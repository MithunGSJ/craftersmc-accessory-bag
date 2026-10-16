import { describe, it, expect } from 'vitest';
import { calculateBagStatistics } from './statsCalculator.ts';
import { evaluatePlayerAccessories } from './accessoryMatcher.ts';
import { PlayerAccessoryItem } from '../data/accessoryTypes.ts';

describe('statsCalculator', () => {
  it('should return zeroes and 0% completion for an empty bag', () => {
    const evaluated = evaluatePlayerAccessories([]);
    const stats = calculateBagStatistics(evaluated);

    expect(stats.totalMagicalPower).toBe(0);
    expect(stats.ownedCount).toBe(0);
    expect(stats.completionPercentage).toBe(0);
    expect(stats.maxPossibleMagicalPower).toBeGreaterThan(100);
    expect(stats.missingCount).toBeGreaterThan(15);
  });

  it('should accurately sum Magical Power for owned accessories of varying rarities', () => {
    const playerItems: PlayerAccessoryItem[] = [
      {
        id: 'ZOMBIE_ARTIFACT_0',
        internalId: 'ZOMBIE_ARTIFACT',
        displayName: 'Zombie Artifact',
        rarity: 'RARE',
        reforge: 'Shaded',
        slot: 0,
        lore: []
      },
      {
        id: 'ENDER_RELIC_1',
        internalId: 'ENDER_RELIC',
        displayName: 'Ender Relic',
        rarity: 'LEGENDARY',
        reforge: 'Hurtful',
        enrichment: 'Crit Chance',
        slot: 1,
        lore: []
      }
    ];

    const evaluated = evaluatePlayerAccessories(playerItems);
    const stats = calculateBagStatistics(evaluated);

    // Rare (8 MP) + Legendary (16 MP) = 24 MP
    expect(stats.totalMagicalPower).toBe(24);
    expect(stats.ownedCount).toBe(2);
    expect(stats.rarityCounts.RARE).toBe(1);
    expect(stats.rarityCounts.LEGENDARY).toBe(1);
    expect(stats.reforgeCount).toBe(2);
    expect(stats.enrichmentCount).toBe(1);
    expect(stats.completionPercentage).toBeGreaterThan(0);
  });
});
