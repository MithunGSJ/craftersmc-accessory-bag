import { EvaluatedAccessory } from '../data/accessoryTypes.ts';
import { ItemRarity, THEME_CONFIG } from '../config/themeConfig.ts';
import { ACCESSORIES_BY_FAMILY } from '../data/accessoryRegistry.ts';

export interface BagStatistics {
  readonly totalMagicalPower: number;
  readonly maxPossibleMagicalPower: number;
  readonly ownedCount: number;
  readonly missingCount: number;
  readonly upgradableCount: number;
  readonly totalFamilies: number;
  readonly completionPercentage: number;
  readonly rarityCounts: Record<ItemRarity, number>;
  readonly enrichmentCount: number;
  readonly reforgeCount: number;
}

export function calculateBagStatistics(evaluated: readonly EvaluatedAccessory[]): BagStatistics {
  let totalMagicalPower = 0;
  let ownedCount = 0;
  let missingCount = 0;
  let upgradableCount = 0;
  let enrichmentCount = 0;
  let reforgeCount = 0;

  const rarityCounts: Record<ItemRarity, number> = {
    COMMON: 0,
    UNCOMMON: 0,
    RARE: 0,
    EPIC: 0,
    LEGENDARY: 0,
    MYTHIC: 0,
    SPECIAL: 0,
    VERY_SPECIAL: 0
  };

  for (const item of evaluated) {
    if (item.status === 'OWNED') {
      ownedCount++;
      totalMagicalPower += item.effectiveMagicalPower;
      const rarity = item.ownedItem ? item.ownedItem.rarity : item.definition.baseRarity;
      rarityCounts[rarity] = (rarityCounts[rarity] || 0) + 1;

      if (item.ownedItem?.enrichment) enrichmentCount++;
      if (item.ownedItem?.reforge) reforgeCount++;
    } else if (item.status === 'UPGRADABLE_NEXT') {
      upgradableCount++;
    } else if (item.status === 'MISSING') {
      // Only count missing if it is tier 1 or no tier is owned in the family
      if (item.familyMaxTierOwned === 0 && item.definition.tier === 1) {
        missingCount++;
      }
    }
  }

  // Calculate maximum achievable MP from the highest tier of every family
  let maxPossibleMagicalPower = 0;
  const familyList = Object.values(ACCESSORIES_BY_FAMILY);
  for (const family of familyList) {
    const highest = family[family.length - 1];
    if (highest) {
      maxPossibleMagicalPower += THEME_CONFIG.rarityMap[highest.baseRarity]?.magicalPower || 0;
    }
  }

  const totalFamilies = familyList.length;
  const completionPercentage = totalFamilies > 0 ? Math.min(100, Math.round((ownedCount / totalFamilies) * 100)) : 0;

  return {
    totalMagicalPower,
    maxPossibleMagicalPower,
    ownedCount,
    missingCount,
    upgradableCount,
    totalFamilies,
    completionPercentage,
    rarityCounts,
    enrichmentCount,
    reforgeCount
  };
}
