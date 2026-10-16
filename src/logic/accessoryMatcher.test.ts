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
        id: 'ZOMBIE_RING_0',
        internalId: 'ZOMBIE_RING',
        displayName: 'Zombie Ring',
        rarity: 'UNCOMMON',
        slot: 0,
        lore: []
      }
    ];

    const evaluated = evaluatePlayerAccessories(playerItems);

    const ring = evaluated.find(e => e.definition.id === 'ZOMBIE_RING');
    const talisman = evaluated.find(e => e.definition.id === 'ZOMBIE_TALISMAN');
    const artifact = evaluated.find(e => e.definition.id === 'ZOMBIE_ARTIFACT');

    expect(ring?.status).toBe('OWNED');
    expect(talisman?.status).toBe('UPGRADED_PREVIOUS');
    expect(artifact?.status).toBe('UPGRADABLE_NEXT');
    expect(ring?.upgradeRecommendation).toBeDefined();
    expect(ring?.upgradeRecommendation?.nextTierId).toBe('ZOMBIE_ARTIFACT');
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

  it('allows only ONE of Dayfreezer and Nightfreezer to count towards +16 MP when both are owned', () => {
    const playerItems: PlayerAccessoryItem[] = [
      {
        id: 'DAYFREEZER_0',
        internalId: 'DAYFREEZER',
        displayName: 'Dayfreezer',
        rarity: 'LEGENDARY',
        slot: 0,
        lore: []
      },
      {
        id: 'NIGHTFREEZER_0',
        internalId: 'NIGHTFREEZER',
        displayName: 'Nightfreezer',
        rarity: 'LEGENDARY',
        slot: 1,
        lore: []
      }
    ];

    const evaluated = evaluatePlayerAccessories(playerItems);
    const day = evaluated.find(e => e.definition.id === 'DAYFREEZER');
    const night = evaluated.find(e => e.definition.id === 'NIGHTFREEZER');

    expect(day?.status).toBe('OWNED');
    expect(night?.status).toBe('OWNED');

    // Exactly one should provide 16 MP, and the other should provide 0 MP (non-stacking)
    const dayMp = day?.effectiveMagicalPower || 0;
    const nightMp = night?.effectiveMagicalPower || 0;
    expect(dayMp + nightMp).toBe(16);
    expect(Math.max(dayMp, nightMp)).toBe(16);
    expect(Math.min(dayMp, nightMp)).toBe(0);
  });

  it('supersedes lower tier accessories when a higher tier is owned (e.g. Personal Deletor 7000 over 4000/5000/6000)', () => {
    const playerItems: PlayerAccessoryItem[] = [
      {
        id: 'PD_7000',
        internalId: 'PERSONAL_DELETOR_7000',
        displayName: 'Personal Deletor 7000',
        rarity: 'LEGENDARY',
        slot: 0,
        lore: []
      }
    ];

    const evaluated = evaluatePlayerAccessories(playerItems);
    const p4000 = evaluated.find(e => e.definition.id === 'PERSONAL_DELETOR_4000');
    const p5000 = evaluated.find(e => e.definition.id === 'PERSONAL_DELETOR_5000');
    const p6000 = evaluated.find(e => e.definition.id === 'PERSONAL_DELETOR_6000');
    const p7000 = evaluated.find(e => e.definition.id === 'PERSONAL_DELETOR_7000');

    expect(p7000?.status).toBe('OWNED');
    expect(p7000?.effectiveMagicalPower).toBe(16);

    expect(p4000?.status).toBe('UPGRADED_PREVIOUS');
    expect(p4000?.effectiveMagicalPower).toBe(0);

    expect(p5000?.status).toBe('UPGRADED_PREVIOUS');
    expect(p5000?.effectiveMagicalPower).toBe(0);

    expect(p6000?.status).toBe('UPGRADED_PREVIOUS');
    expect(p6000?.effectiveMagicalPower).toBe(0);
  });
});
