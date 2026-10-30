import { ACCESSORY_RECIPES, AccessoryRecipe } from '../data/accessoryRecipes.ts';
import { BAZAAR_SNAPSHOT, AUCTION_SNAPSHOT, AuctionPriceSnapshot } from '../data/pricingData.ts';
import { AccessoryDefinition } from '../data/accessoryTypes.ts';
import { findAccessoryById } from '../data/accessoryRegistry.ts';

export interface SubMaterialComparison {
  readonly itemId: string;
  readonly name: string;
  readonly count: number;
  readonly unitPrice: number;
  readonly totalCost: number;
  readonly isCheaper: boolean;
  readonly priceDifference: number;
}

export interface IngredientCost {
  readonly itemId: string;
  readonly name: string;
  readonly count: number;
  readonly unitPrice: number;
  readonly totalCost: number;
  readonly subMaterial?: SubMaterialComparison;
}

export interface AccessoryPriceDetails {
  readonly effectivePrice: number;
  readonly primaryMethod: 'BAZAAR_CRAFT' | 'AUCTION' | 'NPC_SHOP' | 'UNOBTAINABLE' | 'FREE_QUEST';
  readonly craftCost?: number;
  readonly craftBreakdown?: readonly IngredientCost[];
  readonly auction?: AuctionPriceSnapshot;
  readonly npcCost?: number;
  readonly displayLabel: string;
}

// In-memory live cache
const liveBazaarCache = new Map<string, number>();
const liveAuctionCache = new Map<string, AuctionPriceSnapshot>();
const priceDetailsCache = new Map<string, AccessoryPriceDetails>();

const NPC_RAW_MATERIALS: Record<string, number> = {
  chest: 20,
  oak_leaves: 12,
  poisonous_potato: 50,
  wheat_seeds: 12,
  fused_remnants: 6400000,
  remnant_of_the_eye: 200000
};
const BAZAAR_ITEM_ALIASES: Record<string, string> = { envoys_horn: 'envoy_horns', envoy_horn: 'envoy_horns' };

export function getBazaarMaterialPrice(itemId: string): number {
  const raw = itemId.toLowerCase().trim();
  const normalized = BAZAAR_ITEM_ALIASES[raw] || raw;
  if (NPC_RAW_MATERIALS[normalized] !== undefined) return NPC_RAW_MATERIALS[normalized];
  if (NPC_RAW_MATERIALS[raw] !== undefined) return NPC_RAW_MATERIALS[raw];
  if (liveBazaarCache.has(normalized)) return liveBazaarCache.get(normalized)!;
  if (liveBazaarCache.has(raw)) return liveBazaarCache.get(raw)!;
  const snap = BAZAAR_SNAPSHOT[normalized] || BAZAAR_SNAPSHOT[raw];
  if (snap && snap.avgPrice > 0) return snap.avgPrice;
  const ah = getAccessoryAuctionPrice(itemId);
  return ah && ah.avgPrice > 0 ? ah.avgPrice : 0;
}

export function getAccessoryAuctionPrice(accessoryId: string): AuctionPriceSnapshot | undefined {
  const normalized = accessoryId.toUpperCase().replace(/^TRPIXEL:/, '').trim();
  return liveAuctionCache.get(normalized) || AUCTION_SNAPSHOT[normalized];
}

export function setLiveAuctionPrice(accessoryId: string, snapshot: AuctionPriceSnapshot): void {
  liveAuctionCache.set(accessoryId.toUpperCase().replace(/^TRPIXEL:/, '').trim(), snapshot);
  priceDetailsCache.clear();
}

export function setLiveBazaarPrice(itemId: string, price: number): void {
  liveBazaarCache.set(itemId.toLowerCase().trim(), price);
  priceDetailsCache.clear();
}

export function clearPricingCache(): void {
  liveAuctionCache.clear();
  liveBazaarCache.clear();
  priceDetailsCache.clear();
}

export async function hydrateLivePricing(): Promise<boolean> {
  try {
    const res = await fetch('/api/pricing/live');
    if (!res.ok) return false;
    const data = await res.json();
    if (data.success) {
      if (data.auctions) {
        for (const [id, snap] of Object.entries(data.auctions)) {
          liveAuctionCache.set(id.toUpperCase(), snap as AuctionPriceSnapshot);
        }
      }
      if (data.bazaar) {
        for (const [id, snap] of Object.entries(data.bazaar)) {
          const item = snap as { avgPrice: number; weeklyAveragePrice?: number };
          const p = item.weeklyAveragePrice || item.avgPrice;
          if (p > 0) liveBazaarCache.set(id.toLowerCase(), p);
        }
      }
      priceDetailsCache.clear();
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function parseNpcCost(costStr?: string): number | undefined {
  if (!costStr || /gems|bits/i.test(costStr)) return undefined;
  const match = costStr.match(/([\d,.]+)\s*([KkMmBb])?(?:\s*coins|\b|$)/i);
  if (!match) return undefined;
  const num = parseFloat(match[1].replace(/,/g, ''));
  const mult: Record<string, number> = { K: 1e3, M: 1e6, B: 1e9 };
  return num * (mult[match[2]?.toUpperCase() || ''] || 1);
}

export function calculateCraftCost(
  recipe: AccessoryRecipe,
  visited = new Set<string>()
): { totalCost: number; breakdown: IngredientCost[] } {
  if (visited.has(recipe.targetId)) return { totalCost: 0, breakdown: [] };
  visited.add(recipe.targetId);

  let totalCost = 0;
  const breakdown: IngredientCost[] = [];

  if (recipe.upgradesFrom) {
    const parentDef = findAccessoryById(recipe.upgradesFrom);
    const parentName = parentDef ? parentDef.name : recipe.upgradesFrom.replace(/_/g, ' ');
    const parentRecipe = ACCESSORY_RECIPES[recipe.upgradesFrom];
    const parentNpc = parseNpcCost(parentDef?.npcCost);
    const parentPrice = parentRecipe
      ? calculateCraftCost(parentRecipe, visited).totalCost
      : (parentNpc && parentNpc > 0 ? parentNpc : (getAccessoryAuctionPrice(recipe.upgradesFrom)?.avgPrice || 10000));
    totalCost += parentPrice;
    breakdown.push({
      itemId: recipe.upgradesFrom,
      name: parentName,
      count: 1,
      unitPrice: parentPrice,
      totalCost: parentPrice
    });
  }

  for (const ing of recipe.ingredients) {
    const unitPrice = getBazaarMaterialPrice(ing.itemId);
    const subtotal = Math.round(unitPrice * ing.count);

    let subComp: SubMaterialComparison | undefined;
    if (ing.subMaterial) {
      const subUnitPrice = getBazaarMaterialPrice(ing.subMaterial.itemId);
      const subTotal = Math.round(subUnitPrice * ing.subMaterial.count);
      const isCheaper = subTotal > 0 && (subtotal === 0 || subTotal < subtotal);
      const priceDifference = Math.abs(subtotal - subTotal);
      subComp = {
        itemId: ing.subMaterial.itemId,
        name: ing.subMaterial.name,
        count: ing.subMaterial.count,
        unitPrice: subUnitPrice,
        totalCost: subTotal,
        isCheaper,
        priceDifference
      };
    }

    const effectiveItemCost = subtotal > 0 ? subtotal : (subComp?.totalCost || 0);
    totalCost += effectiveItemCost;

    breakdown.push({
      itemId: ing.itemId,
      name: ing.name,
      count: ing.count,
      unitPrice,
      totalCost: effectiveItemCost,
      subMaterial: subComp
    });
  }

  return { totalCost, breakdown };
}

export function evaluateAccessoryPrice(acc: AccessoryDefinition): AccessoryPriceDetails {
  const cached = priceDetailsCache.get(acc.id);
  if (cached) return cached;

  const auction = getAccessoryAuctionPrice(acc.id);
  const npcNum = parseNpcCost(acc.npcCost);
  const recipe = ACCESSORY_RECIPES[acc.id];
  let result: AccessoryPriceDetails;

  // 1. If it has a crafting recipe, calculate craft cost from Bazaar materials
  if (recipe) {
    const { totalCost, breakdown } = calculateCraftCost(recipe);
    if (totalCost > 0) {
      result = {
        effectivePrice: totalCost,
        primaryMethod: 'BAZAAR_CRAFT',
        craftCost: totalCost,
        craftBreakdown: breakdown,
        auction,
        npcCost: npcNum,
        displayLabel: `Craft: ~${formatCoins(totalCost)}`
      };
      priceDetailsCache.set(acc.id, result);
      return result;
    }
  }

  // 2. If it is sold by an NPC (e.g. Julia, Zoe, North, Sky, Baker)
  if (acc.npcCost) {
    if (/gems/i.test(acc.npcCost)) {
      result = {
        effectivePrice: 0,
        primaryMethod: 'NPC_SHOP',
        auction,
        displayLabel: `NPC: ${acc.npcCost}`
      };
      priceDetailsCache.set(acc.id, result);
      return result;
    }
    if (npcNum && npcNum > 0) {
      result = {
        effectivePrice: npcNum,
        primaryMethod: 'NPC_SHOP',
        npcCost: npcNum,
        auction: undefined,
        displayLabel: `NPC: ${formatCoins(npcNum)}`
      };
      priceDetailsCache.set(acc.id, result);
      return result;
    }
  }

  // 3. If it has live auction data
  if (auction && auction.avgPrice > 0) {
    result = {
      effectivePrice: auction.avgPrice,
      primaryMethod: 'AUCTION',
      auction,
      displayLabel: `AH: ~${formatCoins(auction.avgPrice)}`
    };
    priceDetailsCache.set(acc.id, result);
    return result;
  }

  if (acc.stage === 'Quest') {
    result = { effectivePrice: 0, primaryMethod: 'FREE_QUEST', displayLabel: 'Quest Reward' };
    priceDetailsCache.set(acc.id, result);
    return result;
  }

  const fallback = acc.estimatedCoins || 0;
  result = {
    effectivePrice: fallback,
    primaryMethod: fallback > 0 ? 'AUCTION' : 'UNOBTAINABLE',
    displayLabel: fallback > 0 ? `${formatCoins(fallback)}` : 'No offers were made in auction house'
  };
  priceDetailsCache.set(acc.id, result);
  return result;
}

export function formatCoins(amount: number): string {
  if (amount >= 1e9) return `${(amount / 1e9).toFixed(1)}B`;
  if (amount >= 1e6) return `${(amount / 1e6).toFixed(1)}M`;
  if (amount >= 1e3) return `${(amount / 1e3).toFixed(1)}K`;
  return Math.round(amount).toLocaleString();
}

export async function refreshLiveBazaarPrice(itemId: string): Promise<number | null> {
  const raw = itemId.toLowerCase().trim();
  if (NPC_RAW_MATERIALS[raw] !== undefined) return NPC_RAW_MATERIALS[raw];
  try {
    const queryId = BAZAAR_ITEM_ALIASES[raw] || raw;
    const res = await fetch(`/api/v1/skyblock/bazaar/${encodeURIComponent(queryId)}/details`);
    if (!res.ok) return null;
    const json = await res.json();
    const avg = json.weeklyAveragePrice || json.sellTopEntries?.[0]?.price || json.buyTopEntries?.[0]?.price || 0;
    if (avg > 0) {
      setLiveBazaarPrice(itemId, avg);
      if (queryId !== itemId) setLiveBazaarPrice(queryId, avg);
      return avg;
    }
    return null;
  } catch {
    return null;
  }
}
