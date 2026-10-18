import { COMBAT_ACCESSORIES } from './accessoriesCombat.ts';
import { SLAYER_ACCESSORIES } from './accessoriesSlayer.ts';
import { GATHERING_ACCESSORIES } from './accessoriesGathering.ts';
import { EVENT_ACCESSORIES } from './accessoriesEvent.ts';
import { AUTOMATION_ACCESSORIES } from './accessoriesAutomation.ts';
import { SPECIAL_ACCESSORIES } from './accessoriesSpecial.ts';
import { AccessoryDefinition, AccessoryCategory } from './accessoryTypes.ts';
import { ItemRarity } from '../config/themeConfig.ts';
import wikiAccessoriesData from './wikiAccessories.json';
import { isObtainableAccessory, inferStageFromWiki } from '../logic/wikiBrain.ts';

const BASE_ACCESSORIES: readonly AccessoryDefinition[] = [
  ...COMBAT_ACCESSORIES,
  ...SLAYER_ACCESSORIES,
  ...GATHERING_ACCESSORIES,
  ...EVENT_ACCESSORIES,
  ...AUTOMATION_ACCESSORIES,
  ...SPECIAL_ACCESSORIES
];

const existingIds = new Set(BASE_ACCESSORIES.map(a => a.id.toUpperCase()));
const existingNames = new Set(BASE_ACCESSORIES.map(a => a.name.toLowerCase().replace(/[^a-z0-9]/g, '')));

function inferCategory(name: string, source: string, desc: string): AccessoryCategory {
  const text = `${name} ${source} ${desc}`.toLowerCase();
  if (text.includes('slayer') || text.includes('revenant') || text.includes('tarantula') || text.includes('sven')) return 'Slayer';
  if (text.includes('farm') || text.includes('crop') || text.includes('seed') || text.includes('wheat') || text.includes('pumpkin')) return 'Farming';
  if (text.includes('mine') || text.includes('ore') || text.includes('ingot') || text.includes('pickaxe') || text.includes('drill')) return 'Mining';
  if (text.includes('forag') || text.includes('wood') || text.includes('log') || text.includes('tree') || text.includes('axe')) return 'Foraging';
  if (text.includes('fish') || text.includes('rod') || text.includes('sea') || text.includes('ocean')) return 'Fishing';
  if (text.includes('spooky') || text.includes('jerry') || text.includes('festival') || text.includes('event') || text.includes('candy')) return 'Event';
  if (text.includes('combat') || text.includes('damage') || text.includes('strength') || text.includes('crit') || text.includes('sword') || text.includes('mob')) return 'Combat';
  return 'Misc';
}

function inferTier(name: string): number {
  const n = name.toLowerCase();
  if (n.includes('relic')) return 4;
  if (n.includes('artifact')) return 3;
  if (n.includes('ring')) return 2;
  return 1;
}

interface ScrapedWikiItem {
  readonly id: string;
  readonly name: string;
  readonly rarity: string;
  readonly description: string;
  readonly source: string;
}

const dynamicWikiAccessories: AccessoryDefinition[] = [];
for (const item of (wikiAccessoriesData as readonly ScrapedWikiItem[])) {
  const upperId = item.id.toUpperCase();
  const normalizedName = item.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const contractedId = upperId.replace(/_S_/g, 'S_').replace(/_S$/, 'S');
  const alreadyExists = existingIds.has(upperId) || existingIds.has(contractedId) || existingNames.has(normalizedName);

  if (!alreadyExists && isObtainableAccessory(item)) {
    const validRarities: readonly string[] = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC', 'SPECIAL', 'VERY_SPECIAL'];
    const rarity = (validRarities.includes(item.rarity) ? item.rarity : 'COMMON') as ItemRarity;
    const category = inferCategory(item.name, item.source, item.description);
    const stage = inferStageFromWiki(item.source);
    const tier = inferTier(item.name);
    const isPiggyVariant = upperId === 'CRACKED_PIGGY_BANK' || upperId === 'BROKEN_PIGGY_BANK';
    const familyId = isPiggyVariant ? 'piggy_bank' : upperId.replace(/_(TALISMAN|RING|ARTIFACT|RELIC)$/, '');

    dynamicWikiAccessories.push({
      id: upperId,
      name: item.name,
      baseRarity: rarity,
      category,
      familyId,
      tier: isPiggyVariant ? 1 : tier,
      stage,
      description: item.description || item.name,
      source: isPiggyVariant ? 'Damaged state of Piggy Bank' : (item.source || 'CraftersMC Wiki'),
      iconEmoji: isPiggyVariant ? '🐷' : '💎',
      loreLines: item.description ? [item.description] : [item.name],
      isDegradedVariant: isPiggyVariant
    });
    existingIds.add(upperId);
    existingIds.add(contractedId);
    existingNames.add(normalizedName);
  }
}

export const ALL_ACCESSORIES: readonly AccessoryDefinition[] = [
  ...BASE_ACCESSORIES.filter(acc => isObtainableAccessory(acc)),
  ...dynamicWikiAccessories
];

export const ACCESSORY_BY_ID = new Map<string, AccessoryDefinition>(
  ALL_ACCESSORIES.map(acc => [acc.id.toUpperCase(), acc])
);

export const ACCESSORY_BY_NAME = new Map<string, AccessoryDefinition>(
  ALL_ACCESSORIES.map(acc => [acc.name.toLowerCase().replace(/[^a-z0-9]/g, ''), acc])
);

export const ACCESSORIES_BY_FAMILY = ALL_ACCESSORIES.reduce<Record<string, AccessoryDefinition[]>>(
  (acc, item) => {
    if (!acc[item.familyId]) {
      acc[item.familyId] = [];
    }
    acc[item.familyId].push(item);
    return acc;
  },
  {}
);

// Sort each family by tier ascending
Object.values(ACCESSORIES_BY_FAMILY).forEach(familyList => {
  familyList.sort((a, b) => a.tier - b.tier);
});

export const CATEGORIES: readonly AccessoryCategory[] = [
  'Combat',
  'Slayer',
  'Mining',
  'Farming',
  'Foraging',
  'Fishing',
  'Event',
  'Misc'
];

const ID_ALIASES: Record<string, string> = {
  PIG_S_FOOT: 'PIGS_FOOT',
  SKY_S_BADGE: 'SKYS_BADGE',
  NEW_YEAR_S_CAKE_BAG: 'NEW_YEARS_CAKE_BAG',
  NEW_YEAR_CAKE_BAG: 'NEW_YEARS_CAKE_BAG'
};

export function findAccessoryById(id: string): AccessoryDefinition | undefined {
  const upper = id.toUpperCase().trim();
  const direct = ACCESSORY_BY_ID.get(upper);
  if (direct) return direct;
  const aliased = ID_ALIASES[upper];
  if (aliased) return ACCESSORY_BY_ID.get(aliased);
  const contracted = upper.replace(/_S_/g, 'S_').replace(/_S$/, 'S');
  const contractedMatch = ACCESSORY_BY_ID.get(contracted);
  if (contractedMatch) return contractedMatch;

  // Alphanumeric fallback matches across underscore/space/apostrophe variations
  const alpha = upper.replace(/[^A-Z0-9]/g, '').toLowerCase();
  const directAlpha = ACCESSORY_BY_NAME.get(alpha);
  if (directAlpha) return directAlpha;

  // Plural/possessive tolerance: match if variations differ only by 's' (e.g. NEW_YEAR_CAKE_BAG <-> newyearscakebag)
  const alphaNoS = alpha.replace(/s/g, '');
  if (alphaNoS.length >= 4) {
    for (const [key, def] of ACCESSORY_BY_NAME.entries()) {
      if (key.replace(/s/g, '') === alphaNoS) {
        return def;
      }
    }
  }
  return undefined;
}

const COMMON_REFORGES: readonly string[] = [
  'pleasant', 'shaded', 'silky', 'sweet', 'bloody', 'bountiful', 'gentle',
  'odd', 'fast', 'fair', 'epic', 'sharp', 'heroic', 'spicy', 'legendary',
  'deadly', 'fine', 'grand', 'hasty', 'neat', 'rapid', 'unreal', 'awkward',
  'rich', 'clean', 'fierce', 'heavy', 'light', 'mythic', 'pure', 'smart',
  'titanic', 'wise', 'bizarre', 'itchy', 'ominous', 'pretty', 'shiny',
  'simple', 'strange', 'vivid', 'godly', 'demonic', 'forceful', 'hurtful',
  'keen', 'strong', 'superior', 'unpleasant', 'zealous'
];

export function findAccessoryByName(name: string): AccessoryDefinition | undefined {
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const direct = ACCESSORY_BY_NAME.get(normalized);
  if (direct) return direct;

  for (const ref of COMMON_REFORGES) {
    if (normalized.startsWith(ref)) {
      const stripped = normalized.slice(ref.length);
      const match = ACCESSORY_BY_NAME.get(stripped);
      if (match) return match;
    }
  }
  return undefined;
}

export function getFamilyHighestTier(familyId: string): AccessoryDefinition | undefined {
  const family = ACCESSORIES_BY_FAMILY[familyId];
  if (!family || family.length === 0) return undefined;
  return family[family.length - 1];
}

