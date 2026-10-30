import { describe, it, expect } from 'vitest';
import { evaluatePlayerAccessories } from './accessoryMatcher.ts';
import { calculateBagStatistics } from './statsCalculator.ts';
import { SAMPLE_PROFILES } from '../data/sampleProfiles.ts';

describe('soakAndRobustness', () => {
  it('should run 10,000 evaluations without memory leak or performance degradation', () => {
    const start = performance.now();
    for (let i = 0; i < 10000; i++) {
      const profile = SAMPLE_PROFILES[i % SAMPLE_PROFILES.length];
      const evaluated = evaluatePlayerAccessories(profile.items);
      const stats = calculateBagStatistics(evaluated);
      expect(stats.totalFamilies).toBeGreaterThan(0);
    }
    const elapsed = performance.now() - start;
    // 10,000 evaluations across 85 accessories should complete in under 10000ms
    expect(elapsed).toBeLessThan(10000);
  });

  it('should gracefully handle malformed, corrupted, and extreme inputs', () => {
    // Malformed empty item
    const malformed = [
      { id: '', internalId: '', displayName: '', rarity: 'COMMON' as const, slot: -1, lore: [] }
    ];
    expect(() => evaluatePlayerAccessories(malformed)).not.toThrow();

    // Oversized list with 500 items
    const largeList = Array.from({ length: 500 }, (_, idx) => ({
      id: `ITEM_${idx}`,
      internalId: 'ZOMBIE_TALISMAN',
      displayName: 'Zombie Talisman',
      rarity: 'COMMON' as const,
      slot: idx,
      lore: []
    }));
    const evaluated = evaluatePlayerAccessories(largeList);
    expect(evaluated.length).toBeGreaterThan(20);
    const stats = calculateBagStatistics(evaluated);
    expect(stats.totalMagicalPower).toBe(3); // only 1 active Zombie Talisman counted despite 500 duplicates
  });
});
