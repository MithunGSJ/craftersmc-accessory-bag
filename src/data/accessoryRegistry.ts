import { COMBAT_ACCESSORIES } from './accessoriesCombat.ts';
import { SLAYER_ACCESSORIES } from './accessoriesSlayer.ts';
import { GATHERING_ACCESSORIES } from './accessoriesGathering.ts';
import { EVENT_ACCESSORIES } from './accessoriesEvent.ts';
import { AUTOMATION_ACCESSORIES } from './accessoriesAutomation.ts';
import { SPECIAL_ACCESSORIES } from './accessoriesSpecial.ts';
import { AccessoryDefinition, AccessoryCategory } from './accessoryTypes.ts';

export const ALL_ACCESSORIES: readonly AccessoryDefinition[] = [
  ...COMBAT_ACCESSORIES,
  ...SLAYER_ACCESSORIES,
  ...GATHERING_ACCESSORIES,
  ...EVENT_ACCESSORIES,
  ...AUTOMATION_ACCESSORIES,
  ...SPECIAL_ACCESSORIES
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

