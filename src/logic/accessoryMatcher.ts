import { ALL_ACCESSORIES, ACCESSORIES_BY_FAMILY, findAccessoryById } from '../data/accessoryRegistry.ts';
import {
  PlayerAccessoryItem,
  EvaluatedAccessory,
  AccessoryStatus,
  AccessoryCategory
} from '../data/accessoryTypes.ts';
import { THEME_CONFIG, ItemRarity } from '../config/themeConfig.ts';

export interface MatcherOptions {
  readonly hideSupersededTiers?: boolean;
}

export type StatusFilter = 'ALL' | 'OWNED' | 'MISSING' | 'UPGRADABLE';

export interface AccessoryFilterOptions {
  readonly statusFilter: StatusFilter;
  readonly categoryFilter: 'ALL' | AccessoryCategory;
  readonly rarityFilter: 'ALL' | ItemRarity;
  readonly searchQuery?: string;
}

export function filterAccessories(
  evaluatedAll: readonly EvaluatedAccessory[],
  filters: AccessoryFilterOptions
): EvaluatedAccessory[] {
  const { statusFilter, categoryFilter, rarityFilter, searchQuery = '' } = filters;
  const q = searchQuery.toLowerCase().trim();

  return evaluatedAll.filter(item => {
    // Status filter: MISSING includes pure MISSING and UPGRADABLE_NEXT (unowned higher tier)
    if (statusFilter === 'OWNED' && item.status !== 'OWNED') return false;
    if (statusFilter === 'MISSING' && item.status !== 'MISSING' && item.status !== 'UPGRADABLE_NEXT') {
      return false;
    }
    if (statusFilter === 'UPGRADABLE' && item.status !== 'UPGRADABLE_NEXT') return false;

    // Category filter
    if (categoryFilter !== 'ALL' && item.definition.category !== categoryFilter) return false;

    // Rarity filter
    const itemRarity = item.ownedItem ? item.ownedItem.rarity : item.definition.baseRarity;
    if (rarityFilter !== 'ALL' && itemRarity !== rarityFilter) return false;

    // Search query
    if (q !== '') {
      const nameMatch = item.definition.name.toLowerCase().includes(q);
      const descMatch = item.definition.description.toLowerCase().includes(q);
      const sourceMatch = item.definition.source.toLowerCase().includes(q);
      const reforgeMatch = item.ownedItem?.reforge?.toLowerCase().includes(q) || false;
      const enrichMatch = item.ownedItem?.enrichment?.toLowerCase().includes(q) || false;
      if (!nameMatch && !descMatch && !sourceMatch && !reforgeMatch && !enrichMatch) {
        return false;
      }
    }

    // If player owns a higher tier in this family, never show the lower tier ones
    if (item.status === 'UPGRADED_PREVIOUS' || item.definition.tier < item.familyMaxTierOwned) {
      return false;
    }

    return true;
  });
}

export function sortAccessoriesByBagOrder(
  items: readonly EvaluatedAccessory[]
): EvaluatedAccessory[] {
  return items.slice().sort((a, b) => {
    const aSlot = a.ownedItem?.slot !== undefined ? a.ownedItem.slot : Infinity;
    const bSlot = b.ownedItem?.slot !== undefined ? b.ownedItem.slot : Infinity;
    if (aSlot !== bSlot) {
      return aSlot - bSlot;
    }
    return 0;
  });
}

export function evaluatePlayerAccessories(
  playerItems: readonly PlayerAccessoryItem[],
  options: MatcherOptions = {}
): EvaluatedAccessory[] {
  // Map player items by internal ID
  const ownedMap = new Map<string, PlayerAccessoryItem>();
  // Track highest tier owned per family
  const familyMaxTierMap = new Map<string, number>();

  for (const item of playerItems) {
    const internalId = item.internalId.toUpperCase();
    if (!ownedMap.has(internalId)) {
      ownedMap.set(internalId, item);
    }
    const def = findAccessoryById(internalId);
    if (def) {
      const currentMax = familyMaxTierMap.get(def.familyId) || 0;
      if (def.tier > currentMax) {
        familyMaxTierMap.set(def.familyId, def.tier);
      }
    }
  }

  const result: EvaluatedAccessory[] = [];
  const awardedFamilyMp = new Set<string>();

  for (const def of ALL_ACCESSORIES) {
    const ownedItem = ownedMap.get(def.id.toUpperCase());
    const familyMaxTier = familyMaxTierMap.get(def.familyId) || 0;
    const isOwned = Boolean(ownedItem);

    let status: AccessoryStatus;
    if (familyMaxTier > def.tier) {
      // Player already owns a strictly higher tier in this family; lower tier is superseded
      status = 'UPGRADED_PREVIOUS';
    } else if (isOwned) {
      status = 'OWNED';
    } else if (familyMaxTier > 0 && def.tier === familyMaxTier + 1) {
      // Next tier upgrade directly available
      status = 'UPGRADABLE_NEXT';
    } else {
      status = 'MISSING';
    }

    if (options.hideSupersededTiers && status === 'UPGRADED_PREVIOUS') {
      continue;
    }

    // Effective MP calculation
    const rarity = ownedItem ? ownedItem.rarity : def.baseRarity;
    const baseMp = THEME_CONFIG.rarityMap[rarity]?.magicalPower || 0;
    // Only the highest owned tier in a family contributes active MP, and only ONE item per family can grant MP
    let effectiveMagicalPower = 0;
    if (isOwned && def.tier === familyMaxTier) {
      if (!awardedFamilyMp.has(def.familyId)) {
        effectiveMagicalPower = baseMp;
        awardedFamilyMp.add(def.familyId);
      }
    }

    // Upgrade recommendation
    let upgradeRecommendation: EvaluatedAccessory['upgradeRecommendation'];
    const familyMembers = ACCESSORIES_BY_FAMILY[def.familyId] || [];
    const nextMember = familyMembers.find(m => m.tier === def.tier + 1);

    if (nextMember && (status === 'OWNED' || status === 'UPGRADABLE_NEXT')) {
      const nextRarityMp = THEME_CONFIG.rarityMap[nextMember.baseRarity]?.magicalPower || 0;
      const mpGain = Math.max(0, nextRarityMp - baseMp);
      upgradeRecommendation = {
        nextTierId: nextMember.id,
        nextTierName: nextMember.name,
        nextSource: nextMember.source,
        additionalMp: mpGain,
        costCoins: nextMember.estimatedCoins
      };
    }

    result.push({
      definition: def,
      status,
      ownedItem,
      effectiveMagicalPower,
      familyMaxTierOwned: familyMaxTier,
      isHighestInFamily: def.tier === (familyMembers[familyMembers.length - 1]?.tier || 1),
      upgradeRecommendation
    });
  }

  return result;
}

