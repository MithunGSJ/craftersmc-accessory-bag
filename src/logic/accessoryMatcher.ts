import { ALL_ACCESSORIES, ACCESSORIES_BY_FAMILY, findAccessoryById, findAccessoryByName } from '../data/accessoryRegistry.ts';
import {
  PlayerAccessoryItem,
  EvaluatedAccessory,
  AccessoryStatus,
  AccessoryCategory
} from '../data/accessoryTypes.ts';
import { THEME_CONFIG, ItemRarity } from '../config/themeConfig.ts';
import { evaluateAccessoryPrice } from './pricingEngine.ts';

export interface MatcherOptions {
  readonly hideSupersededTiers?: boolean;
}

export type StatusFilter = 'ALL' | 'OWNED' | 'MISSING' | 'UPGRADABLE';

export interface AccessoryFilterOptions {
  readonly statusFilter: StatusFilter;
  readonly categoryFilter: 'ALL' | AccessoryCategory;
  readonly rarityFilter: 'ALL' | ItemRarity;
  readonly searchQuery?: string;
  readonly hideSupersededTiers?: boolean;
}

export function filterAccessories(
  evaluatedAll: readonly EvaluatedAccessory[],
  filters: AccessoryFilterOptions
): EvaluatedAccessory[] {
  const { statusFilter, categoryFilter, rarityFilter, searchQuery = '' } = filters;
  const q = searchQuery.toLowerCase().trim();

  return evaluatedAll.filter(item => {
    // Status filter: MISSING includes pure MISSING and UPGRADABLE_NEXT (unowned higher tier)
    if (statusFilter === 'OWNED' && item.status !== 'OWNED' && !item.ownedItem) return false;
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

    // If player owns a higher tier in this family, never show unowned lower tier ones
    if (statusFilter !== 'OWNED' && (item.status === 'UPGRADED_PREVIOUS' || item.definition.tier < item.familyMaxTierOwned)) {
      if (statusFilter !== 'ALL' || filters.hideSupersededTiers) {
        return false;
      }
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
    if (a.definition.tier !== b.definition.tier) {
      return b.definition.tier - a.definition.tier;
    }
    return a.definition.name.localeCompare(b.definition.name);
  });
}

export function evaluatePlayerAccessories(
  playerItems: readonly PlayerAccessoryItem[],
  options: MatcherOptions = {}
): EvaluatedAccessory[] {
  // Group player items by catalog definition ID and collect uncataloged items
  const itemsByDefId = new Map<string, PlayerAccessoryItem[]>();
  const uncatalogedItems: PlayerAccessoryItem[] = [];
  const familyMaxTierMap = new Map<string, number>();

  for (const item of playerItems) {
    const internalId = item.internalId.toUpperCase();
    const def = findAccessoryById(internalId) || findAccessoryByName(item.displayName);
    if (def) {
      const key = def.id.toUpperCase();
      const list = itemsByDefId.get(key) || [];
      list.push(item);
      itemsByDefId.set(key, list);

      const currentMax = familyMaxTierMap.get(def.familyId) || 0;
      if (def.tier > currentMax) {
        familyMaxTierMap.set(def.familyId, def.tier);
      }
    } else {
      uncatalogedItems.push(item);
    }
  }

  // Ensure matching items are ordered by bag slot
  for (const list of itemsByDefId.values()) {
    list.sort((a, b) => a.slot - b.slot);
  }

  const result: EvaluatedAccessory[] = [];
  const awardedFamilyMp = new Set<string>();

  for (const def of ALL_ACCESSORIES) {
    const matchingItems = itemsByDefId.get(def.id.toUpperCase()) || [];
    const isOwned = matchingItems.length > 0;
    const ownedItem = matchingItems[0];
    const familyMaxTier = familyMaxTierMap.get(def.familyId) || 0;

    let status: AccessoryStatus;
    if (def.isDegradedVariant) {
      if (isOwned) {
        status = 'OWNED';
      } else {
        // Degraded variants (Cracked/Broken Piggy Bank) are damaged states, never missing
        status = 'UPGRADED_PREVIOUS';
      }
    } else if (def.id === 'PIGGY_BANK' && !isOwned && (itemsByDefId.has('CRACKED_PIGGY_BANK') || itemsByDefId.has('BROKEN_PIGGY_BANK'))) {
      // Player owns a variation of the piggy bank; pristine piggy bank is considered resolved and not shown in missing
      status = 'UPGRADED_PREVIOUS';
    } else if (def.familyId === 'day_night_freezer' && !isOwned && (itemsByDefId.has('DAYFREEZER') || itemsByDefId.has('NIGHTFREEZER'))) {
      // Dayfreezer and Nightfreezer are considered one: owning either one is enough, so the other is not missing
      status = 'UPGRADED_PREVIOUS';
    } else if (
      (def.id === 'SEAL_OF_THE_SEAS' && !isOwned && itemsByDefId.has('SEAL_OF_THE_OCEANS')) ||
      (def.id === 'SEAL_OF_THE_OCEANS' && !isOwned && itemsByDefId.has('SEAL_OF_THE_SEAS'))
    ) {
      // Mutually exclusive quest rewards: owning either one resolves the quest line
      status = 'UPGRADED_PREVIOUS';
    } else if (isOwned) {
      status = 'OWNED';
    } else if (familyMaxTier > def.tier) {
      // Player already owns a strictly higher tier in this family; lower tier is superseded
      status = 'UPGRADED_PREVIOUS';
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
    if (isOwned && (def.tier === familyMaxTier || def.isDegradedVariant)) {
      if (!awardedFamilyMp.has(def.familyId)) {
        effectiveMagicalPower = baseMp;
        awardedFamilyMp.add(def.familyId);
      }
    }

    // Upgrade recommendation: only recommend upgrade for the highest tier the player actually OWNS
    let upgradeRecommendation: EvaluatedAccessory['upgradeRecommendation'];
    const familyMembers = ACCESSORIES_BY_FAMILY[def.familyId] || [];
    const nextMember = familyMembers.find(m => m.tier === def.tier + 1);

    if (nextMember && status === 'OWNED' && def.tier === familyMaxTier) {
      const nextRarityMp = THEME_CONFIG.rarityMap[nextMember.baseRarity]?.magicalPower || 0;
      const mpGain = Math.max(0, nextRarityMp - baseMp);
      const estPrice = nextMember.estimatedCoins ?? evaluateAccessoryPrice(nextMember)?.effectivePrice;
      upgradeRecommendation = {
        nextTierId: nextMember.id,
        nextTierName: nextMember.name,
        nextSource: nextMember.source,
        additionalMp: mpGain,
        costCoins: estPrice
      };
    }

    result.push({
      definition: def,
      status,
      ownedItem,
      effectiveMagicalPower,
      familyMaxTierOwned: familyMaxTier,
      isHighestInFamily: def.tier === (familyMembers[familyMembers.length - 1]?.tier || 1),
      skinUrl: ownedItem?.skinUrl,
      isUncataloged: Boolean(ownedItem?.isUncataloged),
      upgradeRecommendation
    });

    // Support duplicate instances of owned catalog accessories (e.g. multiple Personal Compactors)
    for (let i = 1; i < matchingItems.length; i++) {
      const dupItem = matchingItems[i];
      result.push({
        definition: def,
        status: 'OWNED',
        ownedItem: dupItem,
        effectiveMagicalPower: 0,
        familyMaxTierOwned: familyMaxTier,
        isHighestInFamily: def.tier === (familyMembers[familyMembers.length - 1]?.tier || 1),
        skinUrl: dupItem.skinUrl,
        isUncataloged: false
      });
    }
  }

  // Support zero-day uncataloged player accessories dynamically
  const seenUncataloged = new Set<string>();
  for (const item of uncatalogedItems) {
    const familyKey = (item.internalId || item.displayName).toLowerCase();
    const isDuplicate = seenUncataloged.has(familyKey);
    seenUncataloged.add(familyKey);

    const synthDef = {
      id: item.internalId,
      name: item.displayName,
      baseRarity: item.rarity,
      category: 'Misc' as const,
      familyId: familyKey,
      tier: 1,
      description: item.lore.length > 0 ? item.lore[0] : 'In-game accessory',
      source: 'In-Game / Uncataloged',
      iconEmoji: '🔮',
      loreLines: item.lore
    };

    const baseMp = THEME_CONFIG.rarityMap[item.rarity]?.magicalPower || 0;
    let effectiveMagicalPower = 0;
    if (!isDuplicate && !awardedFamilyMp.has(familyKey)) {
      effectiveMagicalPower = baseMp;
      awardedFamilyMp.add(familyKey);
    }

    result.push({
      definition: synthDef,
      status: 'OWNED',
      ownedItem: item,
      skinUrl: item.skinUrl,
      isUncataloged: true,
      effectiveMagicalPower,
      familyMaxTierOwned: 1,
      isHighestInFamily: true
    });
  }

  return result;
}

