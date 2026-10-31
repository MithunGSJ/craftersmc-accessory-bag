import { describe, it, expect } from 'vitest';
import { findAccessoryById } from '../data/accessoryRegistry.ts';
import { evaluateAccessoryPrice } from './pricingEngine.ts';

describe('cardRecipeRedirect', () => {
  it('correctly maps upgraded accessory recipes to parent accessory definitions for card redirection', () => {
    // Draconic Artifact requires Draconic Ring + Fused Remnants
    const draconicArtifact = findAccessoryById('DRACONIC_ARTIFACT');
    expect(draconicArtifact).toBeDefined();

    const priceInfo = evaluateAccessoryPrice(draconicArtifact!);
    expect(priceInfo.craftBreakdown).toBeDefined();
    expect(priceInfo.craftBreakdown!.length).toBeGreaterThan(0);

    // Verify parent accessory ingredient exists in craftBreakdown and resolves to a valid accessory
    const ringIng = priceInfo.craftBreakdown!.find(ing => ing.itemId === 'DRACONIC_RING');
    expect(ringIng).toBeDefined();
    expect(ringIng?.count).toBe(1);

    const ringDef = findAccessoryById(ringIng!.itemId);
    expect(ringDef).toBeDefined();
    expect(ringDef?.name).toBe('Draconic Ring');
    expect(ringDef?.baseRarity).toBe('RARE');
  });

  it('correctly maps Fire Devourer craft breakdown to Fire Extinguisher accessory for redirection', () => {
    const fireDevourer = findAccessoryById('FIRE_DEVOURER');
    expect(fireDevourer).toBeDefined();

    const priceInfo = evaluateAccessoryPrice(fireDevourer!);
    expect(priceInfo.craftBreakdown).toBeDefined();

    const feIng = priceInfo.craftBreakdown!.find(ing => ing.itemId === 'FIRE_EXTINGUISHER');
    expect(feIng).toBeDefined();

    const feDef = findAccessoryById(feIng!.itemId);
    expect(feDef).toBeDefined();
    expect(feDef?.name).toBe("Fire Extinguisher");
  });

  it('correctly maps Frostclaw Relic craft breakdown to Red Claw Artifact accessory for redirection', () => {
    const frostclawRelic = findAccessoryById('FROSTCLAW_RELIC');
    expect(frostclawRelic).toBeDefined();

    const priceInfo = evaluateAccessoryPrice(frostclawRelic!);
    expect(priceInfo.craftBreakdown).toBeDefined();

    const rcaIng = priceInfo.craftBreakdown!.find(ing => ing.itemId === 'RED_CLAW_ARTIFACT');
    expect(rcaIng).toBeDefined();

    const rcaDef = findAccessoryById(rcaIng!.itemId);
    expect(rcaDef).toBeDefined();
    expect(rcaDef?.name).toBe('Red Claw Artifact');
  });

  it('differentiates accessory ingredients from raw Bazaar materials', () => {
    const expArtifact = findAccessoryById('EXPERIENCE_ARTIFACT');
    expect(expArtifact).toBeDefined();

    const priceInfo = evaluateAccessoryPrice(expArtifact!);
    expect(priceInfo.craftBreakdown).toBeDefined();

    // Experience Artifact is crafted from 9 enchanted lapis blocks (no accessory parent)
    const hasAccessoryIngredient = priceInfo.craftBreakdown!.some(ing => findAccessoryById(ing.itemId) !== undefined);
    expect(hasAccessoryIngredient).toBe(false);

    // Pure bazaar material
    expect(priceInfo.craftBreakdown![0].itemId).toBe('enchanted_lapis_block');
    expect(priceInfo.craftBreakdown![0].count).toBe(9);
  });
});
