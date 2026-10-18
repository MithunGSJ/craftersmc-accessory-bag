import { describe, it, expect } from 'vitest';
import { findAccessoryById, findAccessoryByName, ALL_ACCESSORIES } from '../data/accessoryRegistry.ts';
import { evaluatePlayerAccessories } from './accessoryMatcher.ts';
import { evaluateObtainability, isObtainableAccessory } from './wikiBrain.ts';
import { PlayerAccessoryItem } from '../data/accessoryTypes.ts';

describe('Future Accessory Resilience Engine', () => {
  it('resolves apostrophe ID variations in both directions (_S_ and S_)', () => {
    // Standard catalog apostrophe items
    expect(findAccessoryById('PIG_S_FOOT')?.id).toBe('PIGS_FOOT');
    expect(findAccessoryById('PIGS_FOOT')?.id).toBe('PIGS_FOOT');
    expect(findAccessoryById('SKY_S_BADGE')?.id).toBe('SKYS_BADGE');
    expect(findAccessoryById('SKYS_BADGE')?.id).toBe('SKYS_BADGE');
    expect(findAccessoryById('NEW_YEAR_S_CAKE_BAG')?.id).toBe('NEW_YEARS_CAKE_BAG');
    expect(findAccessoryById('NEW_YEARS_CAKE_BAG')?.id).toBe('NEW_YEARS_CAKE_BAG');
  });

  it('matches internal IDs that omit possessive S via alphanumeric tolerance', () => {
    // NEW_YEAR_CAKE_BAG (common Hypixel internal ID omitting 's')
    const match = findAccessoryById('NEW_YEAR_CAKE_BAG');
    expect(match).toBeDefined();
    expect(match?.name).toBe("New Year's Cake Bag");
  });

  it('automatically strips any SkyBlock reforge prefix from item display names', () => {
    const testCases = [
      { input: "Pleasant Sky's Badge", expectedId: 'SKYS_BADGE' },
      { input: "Godly Pig's Foot", expectedId: 'PIGS_FOOT' },
      { input: "Shaded New Year's Cake Bag", expectedId: 'NEW_YEARS_CAKE_BAG' },
      { input: 'Silky Seal of the Oceans', expectedId: 'SEAL_OF_THE_OCEANS' },
      { input: 'Bizarre Bat Artifact', expectedId: 'BAT_ARTIFACT' },
      { input: 'Sweet Zombie Ring', expectedId: 'ZOMBIE_RING' }
    ];

    for (const { input, expectedId } of testCases) {
      const match = findAccessoryByName(input);
      expect(match, `Failed to match reforge on ${input}`).toBeDefined();
      expect(match?.id).toBe(expectedId);
    }
  });

  it('resolves IDs with hyphens, dots, or irregular spacing', () => {
    expect(findAccessoryById('pig-s-foot')?.id).toBe('PIGS_FOOT');
    expect(findAccessoryById('sky.s.badge')?.id).toBe('SKYS_BADGE');
    expect(findAccessoryById('NEW-YEARS-CAKE-BAG')?.id).toBe('NEW_YEARS_CAKE_BAG');
  });

  it('evaluates owned future accessories correctly without false MISSING or duplicate cards', () => {
    const playerItems: PlayerAccessoryItem[] = [
      {
        id: 'PIG_SLOT_0',
        internalId: 'PIG_S_FOOT', // underscore variation
        displayName: "Pleasant Pig's Foot", // reforge prefix
        rarity: 'RARE',
        slot: 0,
        lore: []
      },
      {
        id: 'SKY_SLOT_1',
        internalId: 'SKYS_BADGE',
        displayName: "Godly Sky's Badge",
        rarity: 'LEGENDARY',
        slot: 1,
        lore: []
      },
      {
        id: 'CAKE_SLOT_2',
        internalId: 'NEW_YEAR_CAKE_BAG', // omitted possessive S
        displayName: "New Year's Cake Bag",
        rarity: 'UNCOMMON',
        slot: 2,
        lore: []
      }
    ];

    const evaluated = evaluatePlayerAccessories(playerItems);

    const pig = evaluated.find(e => e.definition.id === 'PIGS_FOOT');
    const sky = evaluated.find(e => e.definition.id === 'SKYS_BADGE');
    const cake = evaluated.find(e => e.definition.id === 'NEW_YEARS_CAKE_BAG');

    // 1. None of them should show as MISSING
    expect(pig?.status).toBe('OWNED');
    expect(sky?.status).toBe('OWNED');
    expect(cake?.status).toBe('OWNED');

    // 2. No duplicate uncataloged cards synthesized for them
    const uncataloged = evaluated.filter(e => e.isUncataloged);
    expect(uncataloged.length).toBe(0);

    // 3. Overall missing count does not include these owned items
    const missing = evaluated.filter(e => e.status === 'MISSING');
    expect(missing.some(e => e.definition.id === 'PIGS_FOOT')).toBe(false);
    expect(missing.some(e => e.definition.id === 'SKYS_BADGE')).toBe(false);
    expect(missing.some(e => e.definition.id === 'NEW_YEARS_CAKE_BAG')).toBe(false);
  });

  it('WikiBrain automatically rejects future admin, removed, or trophy accessories', () => {
    const adminItem = {
      name: "Developer's Crown",
      source: 'Admin-only reward',
      description: 'Given to admins {{ambox admin}}'
    };
    const removedItem = {
      name: 'Old Beta Talisman',
      source: 'Removed from active gameplay',
      description: '{{ambox removed}}'
    };
    const obtainableItem = {
      name: "Hunter's Talisman",
      source: 'Crafting ( Wolf Slayer 4)',
      description: 'Increases combat stats'
    };

    expect(isObtainableAccessory(adminItem)).toBe(false);
    expect(evaluateObtainability(adminItem).status).toBe('ADMIN_ONLY');

    expect(isObtainableAccessory(removedItem)).toBe(false);
    expect(evaluateObtainability(removedItem).status).toBe('REMOVED');

    expect(isObtainableAccessory(obtainableItem)).toBe(true);
    expect(evaluateObtainability(obtainableItem).status).toBe('OBTAINABLE');
  });

  it('guarantees entire catalog has unique normalized alphanumeric names', () => {
    const seen = new Set<string>();
    for (const acc of ALL_ACCESSORIES) {
      const alpha = acc.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      expect(seen.has(alpha), `Catalog contains collision for ${acc.name}`).toBe(false);
      seen.add(alpha);
    }
  });
});
