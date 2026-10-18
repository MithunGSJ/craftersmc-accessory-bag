import { COMBAT_ACCESSORIES } from './accessoriesCombat.ts';
import { SLAYER_ACCESSORIES } from './accessoriesSlayer.ts';
import { GATHERING_ACCESSORIES } from './accessoriesGathering.ts';
import { EVENT_ACCESSORIES } from './accessoriesEvent.ts';
import { AUTOMATION_ACCESSORIES } from './accessoriesAutomation.ts';
import { SPECIAL_ACCESSORIES } from './accessoriesSpecial.ts';
import { AccessoryDefinition, AccessoryCategory } from './accessoryTypes.ts';
import { ItemRarity } from '../config/themeConfig.ts';
import wikiAccessoriesData from './wikiAccessories.json';

const BASE_ACCESSORIES: readonly AccessoryDefinition[] = [
  ...COMBAT_ACCESSORIES,
  ...SLAYER_ACCESSORIES,
  ...GATHERING_ACCESSORIES,
  ...EVENT_ACCESSORIES,
  ...AUTOMATION_ACCESSORIES,
  ...SPECIAL_ACCESSORIES
];

const existingIds = new Set(BASE_ACCESSORIES.map(a => a.id.toUpperCase()));

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
  if (!existingIds.has(upperId)) {
    const validRarities: readonly string[] = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC', 'SPECIAL', 'VERY_SPECIAL'];
    const rarity = (validRarities.includes(item.rarity) ? item.rarity : 'COMMON') as ItemRarity;
    const category = inferCategory(item.name, item.source, item.description);
    const tier = inferTier(item.name);
    const familyId = upperId.replace(/_(TALISMAN|RING|ARTIFACT|RELIC)$/, '');

    dynamicWikiAccessories.push({
      id: upperId,
      name: item.name,
      baseRarity: rarity,
      category,
      familyId,
      tier,
      description: item.description || item.name,
      source: item.source || 'CraftersMC Wiki',
      iconEmoji: '💎',
      loreLines: item.description ? [item.description] : [item.name]
    });
    existingIds.add(upperId);
  }
}

export const ALL_ACCESSORIES: readonly AccessoryDefinition[] = [
  ...BASE_ACCESSORIES,
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

export function findAccessoryById(id: string): AccessoryDefinition | undefined {
  return ACCESSORY_BY_ID.get(id.toUpperCase().trim());
}

export function findAccessoryByName(name: string): AccessoryDefinition | undefined {
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  return ACCESSORY_BY_NAME.get(normalized);
}

export function getFamilyHighestTier(familyId: string): AccessoryDefinition | undefined {
  const family = ACCESSORIES_BY_FAMILY[familyId];
  if (!family || family.length === 0) return undefined;
  return family[family.length - 1];
}

