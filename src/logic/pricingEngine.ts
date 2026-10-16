import { ACCESSORY_RECIPES, AccessoryRecipe } from '../data/accessoryRecipes.ts';
import { BAZAAR_SNAPSHOT, AUCTION_SNAPSHOT, AuctionPriceSnapshot } from '../data/pricingData.ts';
import { AccessoryDefinition } from '../data/accessoryTypes.ts';

export interface IngredientCost {
  readonly itemId: string;
  readonly name: string;
  readonly count: number;
  readonly unitPrice: number;
  readonly totalCost: number;
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

export function getBazaarMaterialPrice(itemId: string): number {
  const normalized = itemId.toLowerCase().trim();
  if (liveBazaarCache.has(normalized)) {
    return liveBazaarCache.get(normalized)!;
  }
  const snap = BAZAAR_SNAPSHOT[normalized];
  if (snap && snap.avgPrice > 0) {
    return snap.avgPrice;
  }
  return 0;
}

export function getAccessoryAuctionPrice(accessoryId: string): AuctionPriceSnapshot | undefined {
  const normalized = accessoryId.toUpperCase().replace(/^TRPIXEL:/, '').trim();
  if (liveAuctionCache.has(normalized)) {
    return liveAuctionCache.get(normalized);
  }
  return AUCTION_SNAPSHOT[normalized];
}

export function parseNpcCost(costStr?: string): number | undefined {
  if (!costStr) return undefined;
  const match = costStr.match(/([\d,.]+)\s*([KkMmBb])?/);
  if (!match) return undefined;
  const num = parseFloat(match[1].replace(/,/g, ''));
  const unit = match[2]?.toUpperCase();
  if (unit === 'K') return num * 1000;
  if (unit === 'M') return num * 1000000;
  if (unit === 'B') return num * 1000000000;
  return num;
}

export function calculateCraftCost(
  recipe: AccessoryRecipe,
  visited = new Set<string>()
): { totalCost: number; breakdown: IngredientCost[] } {
  if (visited.has(recipe.targetId)) {
    return { totalCost: 0, breakdown: [] };
  }
  visited.add(recipe.targetId);

  let totalCost = 0;
  const breakdown: IngredientCost[] = [];

  // If this item upgrades from a base accessory, calculate its base craft cost
  if (recipe.upgradesFrom) {
    const parentRecipe = ACCESSORY_RECIPES[recipe.upgradesFrom];
    if (parentRecipe) {
      const parentResult = calculateCraftCost(parentRecipe, visited);
      totalCost += parentResult.totalCost;
      breakdown.push({
        itemId: recipe.upgradesFrom,
        name: recipe.upgradesFrom.replace(/_/g, ' '),
        count: 1,
        unitPrice: parentResult.totalCost,
        totalCost: parentResult.totalCost
      });
    } else {
      const parentAuction = getAccessoryAuctionPrice(recipe.upgradesFrom);
      const parentPrice = parentAuction?.avgPrice || 10000;
      totalCost += parentPrice;
      breakdown.push({
        itemId: recipe.upgradesFrom,
        name: recipe.upgradesFrom.replace(/_/g, ' '),
        count: 1,
        unitPrice: parentPrice,
        totalCost: parentPrice
      });
    }
  }

  for (const ing of recipe.ingredients) {
    const unitPrice = getBazaarMaterialPrice(ing.itemId);
    const subtotal = Math.round(unitPrice * ing.count);
    totalCost += subtotal;
    breakdown.push({
      itemId: ing.itemId,
      name: ing.name,
      count: ing.count,
      unitPrice,
      totalCost: subtotal
    });
  }

  return { totalCost, breakdown };
}

export function evaluateAccessoryPrice(acc: AccessoryDefinition): AccessoryPriceDetails {
  const auction = getAccessoryAuctionPrice(acc.id);
  const npcNum = parseNpcCost(acc.npcCost);
  const recipe = ACCESSORY_RECIPES[acc.id];

  // 1. If it has a crafting recipe, calculate craft cost from Bazaar materials
  if (recipe) {
    const { totalCost, breakdown } = calculateCraftCost(recipe);
    if (totalCost > 0) {
      return {
        effectivePrice: totalCost,
        primaryMethod: 'BAZAAR_CRAFT',
        craftCost: totalCost,
        craftBreakdown: breakdown,
        auction,
        npcCost: npcNum,
        displayLabel: `Craft: ~${formatCoins(totalCost)}`
      };
    }
  }

  // 2. If it is sold by an NPC (e.g. Julia, Zoe, North, Sky)
  if (npcNum && npcNum > 0) {
    return {
      effectivePrice: npcNum,
      primaryMethod: 'NPC_SHOP',
      npcCost: npcNum,
      auction,
      displayLabel: `NPC: ${formatCoins(npcNum)}`
    };
  }

  // 3. If it has live auction data
  if (auction && auction.avgPrice > 0) {
    return {
      effectivePrice: auction.avgPrice,
      primaryMethod: 'AUCTION',
      auction,
      displayLabel: `AH: ~${formatCoins(auction.avgPrice)}`
    };
  }

  // 4. Fallback for quest / special items
  if (acc.stage === 'Quest') {
    return {
      effectivePrice: 0,
      primaryMethod: 'FREE_QUEST',
      displayLabel: 'Quest Reward'
    };
  }

  const fallback = acc.estimatedCoins || 0;
  return {
    effectivePrice: fallback,
    primaryMethod: fallback > 0 ? 'AUCTION' : 'UNOBTAINABLE',
    displayLabel: fallback > 0 ? `Est: ~${formatCoins(fallback)}` : 'Unobtainable'
  };
}

export function formatCoins(amount: number): string {
  if (amount >= 1000000000) return `${(amount / 1000000000).toFixed(1)}B`;
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
  return Math.round(amount).toLocaleString();
}

export async function refreshLiveBazaarPrice(itemId: string): Promise<number | null> {
  try {
    const res = await fetch(`/api/v1/skyblock/bazaar/${encodeURIComponent(itemId)}/details`, {
      headers: { 'X-API-Key': '44858bff-1259-457f-905d-514867e3780d' }
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.success) {
      const avg = json.weeklyAveragePrice || json.sellTopEntries?.[0]?.price || json.buyTopEntries?.[0]?.price || 0;
      if (avg > 0) {
        liveBazaarCache.set(itemId.toLowerCase(), avg);
        return avg;
      }
    }
    return null;
  } catch {
    return null;
  }
}
