import { describe, it, expect } from 'vitest';
import { evaluatePlayerAccessories, filterAccessories, sortAccessoriesByBagOrder } from './accessoryMatcher.ts';
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

  it('includes UPGRADABLE_NEXT accessories in MISSING tab alongside pure MISSING accessories', () => {
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
    const missingFiltered = filterAccessories(evaluated, {
      statusFilter: 'MISSING',
      categoryFilter: 'ALL',
      rarityFilter: 'ALL'
    });

    const zombieArtifact = missingFiltered.find(e => e.definition.id === 'ZOMBIE_ARTIFACT');
    expect(zombieArtifact).toBeDefined();
    expect(zombieArtifact?.status).toBe('UPGRADABLE_NEXT');

    // Also contains regular missing items like Skeleton Talisman
    const skeletonTalisman = missingFiltered.find(e => e.definition.id === 'SKELETON_TALISMAN');
    expect(skeletonTalisman).toBeDefined();
    expect(skeletonTalisman?.status).toBe('MISSING');

    // Should NOT contain owned items
    const zombieRing = missingFiltered.find(e => e.definition.id === 'ZOMBIE_RING');
    expect(zombieRing).toBeUndefined();

    // Should NOT contain superseded lower tiers
    const zombieTalisman = missingFiltered.find(e => e.definition.id === 'ZOMBIE_TALISMAN');
    expect(zombieTalisman).toBeUndefined();
  });

  it('validates hierarchy separation: Fire Talisman is standalone, Fire Devourer upgrades Fire Extinguisher', () => {
    const playerItems: PlayerAccessoryItem[] = [
      {
        id: 'FE_0',
        internalId: 'FIRE_EXTINGUISHER',
        displayName: 'Fire Extinguisher',
        rarity: 'RARE',
        slot: 0,
        lore: []
      }
    ];

    const evaluated = evaluatePlayerAccessories(playerItems);
    const fireExtinguisher = evaluated.find(e => e.definition.id === 'FIRE_EXTINGUISHER');
    const fireDevourer = evaluated.find(e => e.definition.id === 'FIRE_DEVOURER');
    const fireTalisman = evaluated.find(e => e.definition.id === 'FIRE_TALISMAN');

    expect(fireExtinguisher?.status).toBe('OWNED');
    expect(fireDevourer?.status).toBe('UPGRADABLE_NEXT');
    // Fire Talisman is NOT part of fire_extinguisher family, so it is pure MISSING (not UPGRADED_PREVIOUS)
    expect(fireTalisman?.status).toBe('MISSING');
  });

  it('validates Frostclaw Relic upgrades Red Claw Artifact, and Reaper Orb is standalone', () => {
    const playerItems: PlayerAccessoryItem[] = [
      {
        id: 'RCA_0',
        internalId: 'RED_CLAW_ARTIFACT',
        displayName: 'Red Claw Artifact',
        rarity: 'EPIC',
        slot: 0,
        lore: []
      },
      {
        id: 'ZA_0',
        internalId: 'ZOMBIE_ARTIFACT',
        displayName: 'Zombie Artifact',
        rarity: 'RARE',
        slot: 1,
        lore: []
      }
    ];

    const evaluated = evaluatePlayerAccessories(playerItems);
    const frostclaw = evaluated.find(e => e.definition.id === 'FROSTCLAW_RELIC');
    const hunterRing = evaluated.find(e => e.definition.id === 'HUNTER_RING');
    const reaperOrb = evaluated.find(e => e.definition.id === 'REAPER_ORB');

    expect(frostclaw?.status).toBe('UPGRADABLE_NEXT');
    // Hunter Ring is independent wolf slayer line, so it remains MISSING
    expect(hunterRing?.status).toBe('MISSING');
    // Reaper Orb is independent zombie slayer item, so it remains MISSING (not UPGRADABLE_NEXT from Zombie Artifact)
    expect(reaperOrb?.status).toBe('MISSING');
  });

  it('should sort accessories by in-game bag slot index with owned items first', () => {
    const playerItems: PlayerAccessoryItem[] = [
      {
        id: 'ITEM_B',
        internalId: 'FIRE_TALISMAN',
        displayName: 'Fire Talisman',
        rarity: 'COMMON',
        slot: 5,
        lore: []
      },
      {
        id: 'ITEM_A',
        internalId: 'CAMPFIRE_GOD_BADGE',
        displayName: 'Campfire God Badge',
        rarity: 'LEGENDARY',
        slot: 1,
        lore: []
      }
    ];

    const evaluated = evaluatePlayerAccessories(playerItems);
    const sorted = sortAccessoriesByBagOrder(evaluated);

    // First item should be slot 1 (Campfire God Badge)
    expect(sorted[0].ownedItem?.slot).toBe(1);
    expect(sorted[0].definition.id).toBe('CAMPFIRE_GOD_BADGE');

    // Second item should be slot 5 (Fire Talisman)
    expect(sorted[1].ownedItem?.slot).toBe(5);
    expect(sorted[1].definition.id).toBe('FIRE_TALISMAN');

    // Remaining items should be unowned
    expect(sorted[2].ownedItem).toBeUndefined();
  });
});


