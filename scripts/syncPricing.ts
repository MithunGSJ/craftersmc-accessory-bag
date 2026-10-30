import fs from 'fs';
import path from 'path';
import { ACCESSORY_RECIPES } from '../src/data/accessoryRecipes.ts';

const API_KEY = process.env.CRAFTERS_API_KEY || '44858bff-1259-457f-905d-514867e3780d';
const SNAPSHOT_PATH = path.resolve(process.cwd(), 'src/data/pricingSnapshot.json');

interface BazaarDetailResponse {
  readonly success: boolean;
  readonly itemId: string;
  readonly weeklyAveragePrice?: number;
  readonly buyTopEntries?: readonly { readonly price: number; readonly quantity: number }[];
  readonly sellTopEntries?: readonly { readonly price: number; readonly quantity: number }[];
  readonly buyVolume?: number;
  readonly sellVolume?: number;
}

interface AuctionItemResponse {
  readonly itemId?: string;
  readonly item?: { readonly id?: string };
  readonly startingPrice?: number;
  readonly highestBidAmount?: number;
  readonly type?: string;
  readonly ended?: boolean;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry<T>(url: string, retries = 5): Promise<{ status: number; data?: T }> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          'X-API-Key': API_KEY,
          'User-Agent': 'CraftersMC-Automated-Pricing-Sync/1.0'
        },
        signal: AbortSignal.timeout(15000)
      });

      if (res.status === 429) {
        console.log(`⏳ HTTP 429 rate limit on ${url}. Sleeping 70s to reset quota (attempt ${attempt}/${retries})...`);
        await sleep(70000);
        continue;
      }

      if (res.ok) {
        const data = await res.json() as T;
        return { status: res.status, data };
      }
      return { status: res.status };
    } catch {
      if (attempt < retries) await sleep(3000);
    }
  }
  return { status: 500 };
}

export function extractAllDynamicRecipeMaterials(): string[] {
  const materials = new Set<string>();
  for (const recipe of Object.values(ACCESSORY_RECIPES)) {
    for (const ing of recipe.ingredients) {
      materials.add(ing.itemId.toLowerCase().trim());
      if (ing.subMaterial) {
        materials.add(ing.subMaterial.itemId.toLowerCase().trim());
      }
    }
  }
  return Array.from(materials).sort();
}

export async function runPricingSync(): Promise<{
  materialsCount: number;
  auctionsCount: number;
  updatedMaterials: number;
}> {
  console.log('🚀 Starting Automated Live Pricing Synchronization...');
  const dynamicMaterials = extractAllDynamicRecipeMaterials();
  console.log(`📋 Dynamically discovered ${dynamicMaterials.length} unique recipe materials from accessory registry.`);

  const snapshot = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8'));
  if (!snapshot.bazaar) snapshot.bazaar = {};
  if (!snapshot.auctions) snapshot.auctions = {};

  // 1. Fetch live active auctions across all available pages
  console.log('🏛️ Syncing live auction house BIN market listings...');
  let allAuctions: AuctionItemResponse[] = [];
  const p0 = await fetchWithRetry<{ totalPages?: number; auctions?: AuctionItemResponse[] }>(
    'https://api.craftersmc.net/v1/skyblock/auctions?page=0'
  );

  if (p0.data?.auctions) {
    allAuctions = allAuctions.concat(p0.data.auctions);
    const totalPages = Math.min(Number(p0.data.totalPages) || 1, 5);
    for (let p = 1; p < totalPages; p++) {
      await sleep(2500);
      const pageRes = await fetchWithRetry<{ auctions?: AuctionItemResponse[] }>(
        `https://api.craftersmc.net/v1/skyblock/auctions?page=${p}`
      );
      if (pageRes.data?.auctions) {
        allAuctions = allAuctions.concat(pageRes.data.auctions);
      }
    }
  }
  console.log(`✅ Fetched ${allAuctions.length} total active auction listings.`);

  // Group auction stats
  const auctionsByItem: Record<string, AuctionItemResponse[]> = {};
  for (const a of allAuctions) {
    if (a.ended) continue;
    const rawId = (a.itemId || a.item?.id || '').replace(/^trpixel:/i, '').toUpperCase();
    if (!rawId) continue;
    if (!auctionsByItem[rawId]) auctionsByItem[rawId] = [];
    auctionsByItem[rawId].push(a);
  }

  for (const [id, list] of Object.entries(auctionsByItem)) {
    const binList = list
      .filter(a => a.type === 'BIN')
      .map(a => a.startingPrice || a.highestBidAmount || 0)
      .filter(p => p > 0)
      .sort((a, b) => a - b);

    if (binList.length > 0) {
      const min = binList[0];
      const median = binList[Math.floor(binList.length / 2)];
      const filtered = binList.filter(p => p <= Math.max(median * 2.5, min * 3));
      const avg = Math.round(filtered.reduce((s, p) => s + p, 0) / filtered.length);
      snapshot.auctions[id] = {
        minPrice: min,
        avgPrice: avg,
        maxPrice: filtered[filtered.length - 1],
        count: binList.length,
        totalCount: list.length,
        hasBin: true
      };
    }
  }

  // 2. Fetch live Bazaar prices for every dynamic recipe material
  console.log('🌾 Syncing live Bazaar prices for all dynamic materials...');
  let updatedMaterials = 0;

  const NPC_PRICES: Record<string, number> = {
    chest: 20,
    oak_leaves: 12,
    poisonous_potato: 50,
    wheat_seeds: 12,
    fused_remnants: 6400000,
    remnant_of_the_eye: 200000
  };

  const BAZAAR_ALIASES: Record<string, string> = {
    envoys_horn: 'envoy_horns',
    envoy_horn: 'envoy_horns'
  };

  for (let i = 0; i < dynamicMaterials.length; i++) {
    const itemId = dynamicMaterials[i];

    // Check NPC raw shop items (saves API quota)
    if (NPC_PRICES[itemId] !== undefined) {
      const npcPrice = NPC_PRICES[itemId];
      snapshot.bazaar[itemId] = {
        avgPrice: npcPrice,
        weeklyAveragePrice: npcPrice,
        buyVolume: 0,
        sellVolume: 0
      };
      updatedMaterials++;
      console.log(`[${i + 1}/${dynamicMaterials.length}] 🪙 NPC ${itemId}: ${npcPrice} coins`);
      continue;
    }

    await sleep(2500); // 2.5s pacing strictly avoids 40 req/min limits

    const queryId = BAZAAR_ALIASES[itemId] || itemId;
    const res = await fetchWithRetry<BazaarDetailResponse>(
      `https://api.craftersmc.net/v1/skyblock/bazaar/${queryId}/details`
    );

    if (res.status === 200 && res.data?.success) {
      const d = res.data;
      const weekly = Number(d.weeklyAveragePrice) || 0;
      const buyTop = Number(d.buyTopEntries?.[0]?.price) || 0;
      const sellTop = Number(d.sellTopEntries?.[0]?.price) || 0;
      const effectivePrice = Math.round(weekly || buyTop || sellTop);

      const entry = {
        avgPrice: effectivePrice,
        weeklyAveragePrice: weekly || effectivePrice,
        buyVolume: d.buyVolume || 0,
        sellVolume: d.sellVolume || 0
      };
      snapshot.bazaar[itemId] = entry;
      if (queryId !== itemId) snapshot.bazaar[queryId] = entry;
      updatedMaterials++;
      console.log(`[${i + 1}/${dynamicMaterials.length}] ✅ BAZAAR ${itemId}: ${effectivePrice.toLocaleString()} coins`);
    } else {
      const ahItem = snapshot.auctions[itemId.toUpperCase()];
      if (ahItem && ahItem.avgPrice > 0) {
        snapshot.bazaar[itemId] = {
          avgPrice: ahItem.avgPrice,
          weeklyAveragePrice: ahItem.avgPrice
        };
        updatedMaterials++;
        console.log(`[${i + 1}/${dynamicMaterials.length}] 🏛️ AH ${itemId}: ${ahItem.avgPrice.toLocaleString()} coins`);
      } else {
        const existing = snapshot.bazaar[itemId];
        if (existing && existing.avgPrice > 0) {
          console.log(`[${i + 1}/${dynamicMaterials.length}] 📦 FALLBACK ${itemId}: ${existing.avgPrice.toLocaleString()} coins (Retained baseline: item not exposed in CraftersMC Bazaar API)`);
        } else {
          console.log(`[${i + 1}/${dynamicMaterials.length}] ℹ️ UNTRADED ${itemId}: No active listings found on Bazaar or AH`);
        }
      }
    }
  }

  fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2));
  console.log(`🎉 Automated pricing sync complete! Saved to ${SNAPSHOT_PATH}`);

  return {
    materialsCount: dynamicMaterials.length,
    auctionsCount: Object.keys(snapshot.auctions).length,
    updatedMaterials
  };
}

if (process.argv[1] && process.argv[1].endsWith('syncPricing.ts')) {
  runPricingSync()
    .then(res => {
      console.log(`✅ Synced ${res.updatedMaterials}/${res.materialsCount} materials and ${res.auctionsCount} auction items.`);
    })
    .catch(err => {
      console.error('❌ Pricing sync failed:', err);
      process.exit(1);
    });
}
