import { describe, it, expect } from 'vitest';
import { THEME_CONFIG, ItemRarity } from './themeConfig.ts';

describe('themeConfig', () => {
  it('should have valid configuration for all item rarities', () => {
    const rarities: ItemRarity[] = [
      'COMMON',
      'UNCOMMON',
      'RARE',
      'EPIC',
      'LEGENDARY',
      'MYTHIC',
      'SPECIAL',
      'VERY_SPECIAL'
    ];

    for (const r of rarities) {
      const style = THEME_CONFIG.rarityMap[r];
      expect(style).toBeDefined();
      expect(style.magicalPower).toBeGreaterThan(0);
      expect(style.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it('should include the mandatory legal disclaimer in theme config', () => {
    expect(THEME_CONFIG.legalDisclaimer).toContain('CraftersMC');
    expect(THEME_CONFIG.legalDisclaimer).toContain('Minecraft');
    expect(THEME_CONFIG.legalDisclaimer).toContain('TEON CREATIVE');
  });
});
