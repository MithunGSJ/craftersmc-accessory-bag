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
        id: 'BAT_ARTIFACT_1',
        internalId: 'BAT_ARTIFACT',
        displayName: 'Bat Artifact',
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

  it('correctly tracks unique ownedFamiliesCount and bounds completion percentage based on families', () => {
    const playerItems: PlayerAccessoryItem[] = [
      { id: 'D0', internalId: 'DAYFREEZER', displayName: 'Dayfreezer', rarity: 'LEGENDARY', slot: 0, lore: [] },
      { id: 'N0', internalId: 'NIGHTFREEZER', displayName: 'Nightfreezer', rarity: 'LEGENDARY', slot: 1, lore: [] }
    ];
    const evaluated = evaluatePlayerAccessories(playerItems);
    const stats = calculateBagStatistics(evaluated);

    // Both owned, but belong to 1 unique family (day_night_freezer)
    expect(stats.ownedCount).toBe(2);
    expect(stats.ownedFamiliesCount).toBe(1);
    expect(stats.completionPercentage).toBe(Math.round((1 / stats.totalFamilies) * 100));
  });

  it('counts all owned accessories in rarityCounts and dynamically scales maxPossibleMagicalPower', () => {
    const playerItems: PlayerAccessoryItem[] = [
      { id: 'ZR', internalId: 'ZOMBIE_RING', displayName: 'Zombie Ring', rarity: 'UNCOMMON', slot: 0, lore: [] },
      { id: 'ZT', internalId: 'ZOMBIE_TALISMAN', displayName: 'Zombie Talisman', rarity: 'COMMON', slot: 1, lore: [] }
    ];
    const evaluated = evaluatePlayerAccessories(playerItems);
    const stats = calculateBagStatistics(evaluated);

    expect(stats.ownedCount).toBe(2);
    expect(stats.rarityCounts.UNCOMMON).toBe(1);
    expect(stats.rarityCounts.COMMON).toBe(1);
    expect(stats.maxPossibleMagicalPower).toBeGreaterThanOrEqual(stats.totalMagicalPower);
  });
});
