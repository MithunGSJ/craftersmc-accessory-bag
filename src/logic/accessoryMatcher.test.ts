import { describe, it, expect } from 'vitest';
import { evaluatePlayerAccessories } from './accessoryMatcher.ts';
import { PlayerAccessoryItem } from '../data/accessoryTypes.ts';

describe('accessoryMatcher', () => {
  it('should mark all accessories as MISSING for a player with an empty bag', () => {
    const evaluated = evaluatePlayerAccessories([]);
    expect(evaluated.length).toBeGreaterThan(20);
    const missing = evaluated.filter(e => e.status === 'MISSING');
    // All items should be missing since nothing is owned
    expect(missing.length).toBe(evaluated.length);
  });

  it('should mark owned accessories correctly and identify superseded previous tiers', () => {
    const playerItems: PlayerAccessoryItem[] = [
      {
        id: 'ZOMBIE_ARTIFACT_0',
        internalId: 'ZOMBIE_ARTIFACT',
        displayName: 'Zombie Artifact',
        rarity: 'RARE',
        slot: 0,
        lore: []
      }
    ];

    const evaluated = evaluatePlayerAccessories(playerItems);

    const artifact = evaluated.find(e => e.definition.id === 'ZOMBIE_ARTIFACT');
    const ring = evaluated.find(e => e.definition.id === 'ZOMBIE_RING');
    const talisman = evaluated.find(e => e.definition.id === 'ZOMBIE_TALISMAN');

    expect(artifact?.status).toBe('OWNED');
    expect(artifact?.effectiveMagicalPower).toBe(8); // RARE = 8 MP
    expect(ring?.status).toBe('UPGRADED_PREVIOUS');
    expect(talisman?.status).toBe('UPGRADED_PREVIOUS');
  });

  it('should mark next tier as UPGRADABLE_NEXT when an intermediate tier is owned', () => {
    const playerItems: PlayerAccessoryItem[] = [
      {
        id: 'SPIDER_RING_0',
        internalId: 'SPIDER_RING',
        displayName: 'Spider Ring',
        rarity: 'RARE',
        slot: 0,
        lore: []
      }
    ];

    const evaluated = evaluatePlayerAccessories(playerItems);

    const ring = evaluated.find(e => e.definition.id === 'SPIDER_RING');
    const talisman = evaluated.find(e => e.definition.id === 'SPIDER_TALISMAN');
    const artifact = evaluated.find(e => e.definition.id === 'SPIDER_ARTIFACT');

    expect(ring?.status).toBe('OWNED');
    expect(talisman?.status).toBe('UPGRADED_PREVIOUS');
    expect(artifact?.status).toBe('UPGRADABLE_NEXT');
    expect(ring?.upgradeRecommendation).toBeDefined();
    expect(ring?.upgradeRecommendation?.nextTierId).toBe('SPIDER_ARTIFACT');
  });

  it('should respect hideSupersededTiers option', () => {
    const playerItems: PlayerAccessoryItem[] = [
      {
        id: 'ZOMBIE_ARTIFACT_0',
        internalId: 'ZOMBIE_ARTIFACT',
        displayName: 'Zombie Artifact',
        rarity: 'RARE',
        slot: 0,
        lore: []
      }
    ];

    const allEvaluated = evaluatePlayerAccessories(playerItems);
    const filteredEvaluated = evaluatePlayerAccessories(playerItems, { hideSupersededTiers: true });

    expect(filteredEvaluated.length).toBeLessThan(allEvaluated.length);
    const hasPrevious = filteredEvaluated.some(e => e.status === 'UPGRADED_PREVIOUS');
    expect(hasPrevious).toBe(false);
  });
});
