import { describe, it, expect } from 'vitest';
import {
  evaluateAccessoryPrice,
  calculateCraftCost,
  getBazaarMaterialPrice,
  getAccessoryAuctionPrice,
  formatCoins
} from './pricingEngine.ts';
import { ACCESSORY_RECIPES } from '../data/accessoryRecipes.ts';
import { findAccessoryById } from '../data/accessoryRegistry.ts';

describe('pricingEngine', () => {
  it('retrieves bazaar prices for raw and enchanted materials', () => {
    const featherPrice = getBazaarMaterialPrice('feather');
    const enchFeatherPrice = getBazaarMaterialPrice('enchanted_feather');
    expect(featherPrice).toBeGreaterThan(0);
    expect(enchFeatherPrice).toBeGreaterThan(featherPrice);
  });

  it('retrieves auction prices for accessory items', () => {
    const auction = getAccessoryAuctionPrice('FEATHER_ARTIFACT');
    expect(auction).toBeDefined();
    expect(auction?.minPrice).toBeGreaterThan(0);
    expect(auction?.maxPrice).toBeGreaterThanOrEqual(auction?.minPrice || 0);
  });

  it('computes craft cost combining previous tier and materials for feather line up to golden feather boots', () => {
    const talismanDef = findAccessoryById('FEATHER_TALISMAN');
    const ringDef = findAccessoryById('FEATHER_RING');
    const artifactDef = findAccessoryById('FEATHER_ARTIFACT');
    const bootsDef = findAccessoryById('GOLDEN_FEATHER_BOOTS');

    expect(talismanDef).toBeDefined();
    expect(ringDef).toBeDefined();
    expect(artifactDef).toBeDefined();
    expect(bootsDef).toBeDefined();

    const talismanPrice = evaluateAccessoryPrice(talismanDef!);
    const ringPrice = evaluateAccessoryPrice(ringDef!);
    const artifactPrice = evaluateAccessoryPrice(artifactDef!);
    const bootsPrice = evaluateAccessoryPrice(bootsDef!);

    expect(talismanPrice.primaryMethod).toBe('BAZAAR_CRAFT');
    expect(ringPrice.primaryMethod).toBe('BAZAAR_CRAFT');
    expect(artifactPrice.primaryMethod).toBe('BAZAAR_CRAFT');
    expect(bootsPrice.primaryMethod).toBe('BAZAAR_CRAFT');

    expect(talismanPrice.effectivePrice).toBeGreaterThan(0);
    expect(ringPrice.effectivePrice).toBeGreaterThan(talismanPrice.effectivePrice);
    expect(artifactPrice.effectivePrice).toBeGreaterThan(ringPrice.effectivePrice);
    expect(bootsPrice.effectivePrice).toBeGreaterThan(artifactPrice.effectivePrice);

    // Verify boots recipe breakdown contains feather artifact
    const bootsRecipe = ACCESSORY_RECIPES['GOLDEN_FEATHER_BOOTS'];
    const { breakdown } = calculateCraftCost(bootsRecipe);
    expect(breakdown.some(b => b.itemId === 'FEATHER_ARTIFACT')).toBe(true);
    expect(breakdown.some(b => b.itemId === 'enchanted_feather' && b.count === 64)).toBe(true);
  });

  it('evaluates NPC shop items correctly', () => {
    const mineAffinity = findAccessoryById('MINE_AFFINITY_TALISMAN');
    expect(mineAffinity).toBeDefined();
    const price = evaluateAccessoryPrice(mineAffinity!);
    expect(price.npcCost).toBe(2500);
    expect(price.primaryMethod).toBe('NPC_SHOP');
  });

  it('evaluates auction/drop items correctly', () => {
    const wolfTal = findAccessoryById('WOLF_TALISMAN');
    expect(wolfTal).toBeDefined();
    const price = evaluateAccessoryPrice(wolfTal!);
    expect(price.primaryMethod).toBe('AUCTION');
    expect(price.auction).toBeDefined();
    expect(price.auction?.avgPrice).toBeGreaterThan(1000000);
  });

  it('formats coins into readable suffixes', () => {
    expect(formatCoins(500)).toBe('500');
    expect(formatCoins(2500)).toBe('2.5K');
    expect(formatCoins(1500000)).toBe('1.5M');
    expect(formatCoins(2000000000)).toBe('2.0B');
  });
});
