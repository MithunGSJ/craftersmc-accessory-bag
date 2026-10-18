import { describe, it, expect } from 'vitest';
import { ALL_ACCESSORIES, ACCESSORIES_BY_FAMILY, findAccessoryById } from './accessoryRegistry.ts';
import { THEME_CONFIG } from '../config/themeConfig.ts';

describe('accessoryRegistry', () => {
  it('should have a substantial set of catalogued accessories with unique IDs', () => {
    expect(ALL_ACCESSORIES.length).toBeGreaterThan(25);
    const ids = new Set<string>();
    for (const item of ALL_ACCESSORIES) {
      expect(ids.has(item.id)).toBe(false);
      ids.add(item.id);
    }
  });

  it('should only use valid recognized item rarities that exist in THEME_CONFIG', () => {
    for (const item of ALL_ACCESSORIES) {
      expect(THEME_CONFIG.rarityMap[item.baseRarity]).toBeDefined();
    }
  });

  it('should correctly organize upgrade chains into families', () => {
    const zombieFamily = ACCESSORIES_BY_FAMILY['zombie'];
    expect(zombieFamily).toBeDefined();
    expect(zombieFamily.length).toBeGreaterThanOrEqual(3);
    expect(zombieFamily[0].id).toBe('ZOMBIE_TALISMAN');
    expect(zombieFamily[1].id).toBe('ZOMBIE_RING');
    expect(zombieFamily[2].id).toBe('ZOMBIE_ARTIFACT');
  });

  it('should retrieve accessories case-insensitively', () => {
    const item = findAccessoryById('zombie_talisman');
    expect(item).toBeDefined();
    expect(item?.name).toBe('Zombie Talisman');
    expect(item?.baseRarity).toBe('COMMON');
  });

  it('guarantees zero duplicate accessories by normalized name across the catalog', () => {
    const seenNames = new Set<string>();
    for (const item of ALL_ACCESSORIES) {
      const normalized = item.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      expect(seenNames.has(normalized), `Duplicate accessory name found: ${item.name} (${item.id})`).toBe(false);
      seenNames.add(normalized);
    }
  });

  it('resolves apostrophe ID aliases for Pig\'s Foot, Sky\'s Badge, and New Year\'s Cake Bag', () => {
    expect(findAccessoryById('PIG_S_FOOT')?.id).toBe('PIGS_FOOT');
    expect(findAccessoryById('PIGS_FOOT')?.id).toBe('PIGS_FOOT');
    expect(findAccessoryById('SKY_S_BADGE')?.id).toBe('SKYS_BADGE');
    expect(findAccessoryById('SKYS_BADGE')?.id).toBe('SKYS_BADGE');
    expect(findAccessoryById('NEW_YEAR_S_CAKE_BAG')?.id).toBe('NEW_YEARS_CAKE_BAG');
    expect(findAccessoryById('NEW_YEAR_CAKE_BAG')?.id).toBe('NEW_YEARS_CAKE_BAG');
    expect(findAccessoryById('NEW_YEARS_CAKE_BAG')?.id).toBe('NEW_YEARS_CAKE_BAG');
  });
});
