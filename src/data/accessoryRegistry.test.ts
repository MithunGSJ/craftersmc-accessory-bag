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
});
