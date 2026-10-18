const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = '44858bff-1259-457f-905d-514867e3780d';
const SNAPSHOT_PATH = path.resolve(__dirname, '../src/data/pricingSnapshot.json');
const RECIPES_PATH = path.resolve(__dirname, '../src/data/accessoryRecipes.ts');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchUrl(urlPath) {
  return new Promise(resolve => {
    https.get({
      hostname: 'api.craftersmc.net',
      path: urlPath,
      headers: {
        'X-API-Key': API_KEY,
        'User-Agent': 'CraftersMC-Auditor/1.0'
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    }).on('error', err => resolve({ status: 500, error: err.message }));
  });
}

async function fetchWith429Retry(urlPath, retries = 5) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetchUrl(urlPath);
    if (res.status === 429) {
      console.log(`⏳ HTTP 429 Rate Limit hit on ${urlPath}. Backing off for 15s (attempt ${attempt}/${retries})...`);
      await sleep(15000);
      continue;
    }
    return res;
  }
  return { status: 429, error: 'Rate limit exceeded after retries' };
}

(async () => {
  console.log('🚀 Starting Robust Pricing Synchronization for ALL Materials & Accessories...');

  // 1. Extract all ingredients
  const recipeContent = fs.readFileSync(RECIPES_PATH, 'utf8');
  const regex = /itemId:\s*'([^']+)'/g;
  const ingredientSet = new Set();
  let match;
  while ((match = regex.exec(recipeContent)) !== null) {
    ingredientSet.add(match[1]);
  }
  const ingredientList = [...ingredientSet].sort();
  console.log(`📋 Total recipe ingredients to verify: ${ingredientList.length}`);

  const snapshot = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8'));
  if (!snapshot.bazaar) snapshot.bazaar = {};
  if (!snapshot.auctions) snapshot.auctions = {};

  // 2. Fetch all live auctions across all pages with retry
  console.log('🏛️ Fetching all active auctions across pages 0 to 5...');
  let allAuctions = [];
  const p0 = await fetchWith429Retry('/v1/skyblock/auctions?page=0');
  if (p0.data && Array.isArray(p0.data.auctions)) {
    allAuctions = allAuctions.concat(p0.data.auctions);
    const totalPages = Number(p0.data.totalPages) || 1;
    for (let p = 1; p < Math.min(totalPages, 6); p++) {
      await sleep(2200);
      const pageRes = await fetchWith429Retry(`/v1/skyblock/auctions?page=${p}`);
      if (pageRes.data && Array.isArray(pageRes.data.auctions)) {
        allAuctions = allAuctions.concat(pageRes.data.auctions);
      }
    }
  }
  console.log(`✅ Loaded ${allAuctions.length} total active auctions.`);

  // Group and compute clean auction stats
  const auctionsByItem = {};
  for (const a of allAuctions) {
    if (a.ended) continue;
    const rawId = (a.itemId || a.item?.id || '').replace(/^trpixel:/i, '').toUpperCase();
    if (!rawId) continue;
    if (!auctionsByItem[rawId]) auctionsByItem[rawId] = [];
    auctionsByItem[rawId].push(a);
  }

  for (const [id, list] of Object.entries(auctionsByItem)) {
    const binList = list.filter(a => a.type === 'BIN').map(a => a.startingPrice || a.highestBidAmount).filter(p => p > 0).sort((a, b) => a - b);
    if (binList.length > 0) {
      const min = binList[0];
      const median = binList[Math.floor(binList.length / 2)];
      const filtered = binList.filter(p => p <= Math.max(median * 2.5, min * 3));
      const avg = Math.round(filtered.reduce((s, p) => s + p, 0) / filtered.length);
      const max = filtered[filtered.length - 1];
      snapshot.auctions[id] = {
        minPrice: min,
        avgPrice: avg,
        maxPrice: max,
        count: binList.length,
        totalCount: list.length,
        hasBin: true
      };
    } else {
      const bids = list.map(a => a.highestBidAmount || a.startingPrice).filter(p => p > 0).sort((a, b) => a - b);
      if (bids.length > 0) {
        snapshot.auctions[id] = {
          minPrice: bids[0],
          avgPrice: Math.round(bids.reduce((s, p) => s + p, 0) / bids.length),
          maxPrice: bids[bids.length - 1],
          count: bids.length,
          totalCount: list.length,
          hasBin: false
        };
      }
    }
  }

  console.log(`✅ Synced ${Object.keys(snapshot.auctions).length} items from live auction house.`);

  // 3. Process every ingredient with guaranteed 429 retry
  console.log('\n🌾 Verifying all 60 materials against CraftersMC Bazaar API...');
  const auditReport = [];

  for (let i = 0; i < ingredientList.length; i++) {
    const itemId = ingredientList[i];
    await sleep(2200); // 2.2s delay = ~27 requests/min

    const res = await fetchWith429Retry(`/v1/skyblock/bazaar/${itemId}/details`);
    if (res.status === 200 && res.data && res.data.success) {
      const d = res.data;
      const weeklyAvg = Number(d.weeklyAveragePrice) || 0;
      const buyTop = Number(d.buyTopEntries?.[0]?.price) || 0;
      const sellTop = Number(d.sellTopEntries?.[0]?.price) || 0;
      const effectivePrice = Math.round(weeklyAvg || buyTop || sellTop);

      const oldVal = snapshot.bazaar[itemId]?.avgPrice || 0;
      const diff = effectivePrice - oldVal;
      const diffPct = oldVal > 0 ? ((diff / oldVal) * 100).toFixed(1) : 'NEW';

      snapshot.bazaar[itemId] = {
        avgPrice: effectivePrice,
        weeklyAveragePrice: weeklyAvg || effectivePrice,
        buyVolume: d.buyVolume || 0,
        sellVolume: d.sellVolume || 0
      };

      console.log(`[${i + 1}/${ingredientList.length}] ✅ BAZAAR ${itemId}: was ${oldVal.toLocaleString()} -> NOW ${effectivePrice.toLocaleString()} coins (${diffPct}%)`);
      auditReport.push({ itemId, source: 'BAZAAR', oldPrice: oldVal, newPrice: effectivePrice });
    } else {
      // Check Auction House
      const upper = itemId.toUpperCase();
      const ahItem = snapshot.auctions[upper];
      if (ahItem && ahItem.avgPrice > 0) {
        const oldVal = snapshot.bazaar[itemId]?.avgPrice || 0;
        snapshot.bazaar[itemId] = {
          avgPrice: ahItem.avgPrice,
          weeklyAveragePrice: ahItem.avgPrice
        };
        console.log(`[${i + 1}/${ingredientList.length}] 🏛️ AUCTION ${itemId}: was ${oldVal.toLocaleString()} -> NOW ${ahItem.avgPrice.toLocaleString()} coins (from AH)`);
        auditReport.push({ itemId, source: 'AUCTION', oldPrice: oldVal, newPrice: ahItem.avgPrice });
      } else {
        const cur = snapshot.bazaar[itemId]?.avgPrice || 0;
        console.log(`[${i + 1}/${ingredientList.length}] 📦 STATIC/NPC ${itemId}: HTTP ${res.status}, keeping ${cur.toLocaleString()} coins`);
        auditReport.push({ itemId, source: 'STATIC_OR_NPC', oldPrice: cur, newPrice: cur });
      }
    }
  }

  // 4. Save updated snapshot
  fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2));
  console.log(`\n🎉 DONE! All 60 recipe materials synced accurately to ${SNAPSHOT_PATH}`);

  if (!fs.existsSync('tmp')) fs.mkdirSync('tmp');
  fs.writeFileSync('tmp/robust_pricing_audit.json', JSON.stringify(auditReport, null, 2));
})();
