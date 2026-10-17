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
    expect(breakdown.some(b => b.itemId === 'enchanted_feather' && b.count === 160)).toBe(true);
    expect(breakdown.some(b => b.itemId === 'golden_feather' && b.count === 1)).toBe(true);
  });
  it('evaluates Zombie Ring craft cost using 500 coin NPC cost for Zombie Talisman instead of auction', () => {
    const ringDef = findAccessoryById('ZOMBIE_RING');
    expect(ringDef).toBeDefined();
    const priceDetails = evaluateAccessoryPrice(ringDef!);
    expect(priceDetails.primaryMethod).toBe('BAZAAR_CRAFT');

    const baseTalisman = priceDetails.craftBreakdown?.find(b => b.itemId === 'ZOMBIE_TALISMAN');
    expect(baseTalisman).toBeDefined();
    expect(baseTalisman?.name).toBe('Zombie Talisman');
    expect(baseTalisman?.unitPrice).toBe(500);
    expect(baseTalisman?.totalCost).toBe(500);
    // Total craft cost is 500 + 64 * 349.5 (~22.8K), NOT 122.4K
    expect(priceDetails.effectivePrice).toBeLessThan(30000);
    expect(priceDetails.effectivePrice).toBeGreaterThan(20000);
  });

  it('evaluates Experience Artifact recipe: 9 Enchanted Lapis Blocks (1440 Enchanted Lapis)', () => {
    const expDef = findAccessoryById('EXPERIENCE_ARTIFACT');
    expect(expDef).toBeDefined();

    const expRecipe = ACCESSORY_RECIPES['EXPERIENCE_ARTIFACT'];
    expect(expRecipe).toBeDefined();
    expect(expRecipe.ingredients[0].itemId).toBe('enchanted_lapis_block');
    expect(expRecipe.ingredients[0].count).toBe(9);
    expect(expRecipe.ingredients[0].subMaterial?.count).toBe(1440);
    expect(expRecipe.ingredients[0].subMaterial?.itemId).toBe('enchanted_lapis_lazuli');

    const blockPrice = getBazaarMaterialPrice('enchanted_lapis_block');
    const lapisPrice = getBazaarMaterialPrice('enchanted_lapis_lazuli');
    const nineBlocksCost = 9 * blockPrice;
    const fourteenFortyLapisCost = 1440 * lapisPrice;

    // Verify 9 Enchanted Lapis Blocks cost LESS than 1440 Enchanted Lapis Lazuli
    expect(nineBlocksCost).toBeLessThan(fourteenFortyLapisCost);

    const priceDetails = evaluateAccessoryPrice(expDef!);
    expect(priceDetails.craftCost).toBeGreaterThan(0);
    expect(priceDetails.craftBreakdown?.[0].subMaterial?.isCheaper).toBe(false); // Submaterial is more expensive, buying blocks directly is cheaper
  });

  it('calculates clean BIN auction stats without troll outliers for Experience Artifact', () => {
    const expAuction = getAccessoryAuctionPrice('EXPERIENCE_ARTIFACT');
    expect(expAuction).toBeDefined();
    // Min, avg, max should reflect the actual ~385k market, NOT 1.9M avg or 5M max
    expect(expAuction?.minPrice).toBe(385000);
    expect(expAuction?.maxPrice).toBeLessThan(500000);
    expect(expAuction?.avgPrice).toBeLessThan(400000);
    expect(expAuction?.hasBin).toBe(true);
  });

  it('evaluates NPC shop items correctly and does not show auction price for coin NPC items', () => {
    const mineAffinity = findAccessoryById('MINE_AFFINITY_TALISMAN');
    expect(mineAffinity).toBeDefined();
    const price = evaluateAccessoryPrice(mineAffinity!);
    expect(price.npcCost).toBe(2500);
    expect(price.primaryMethod).toBe('NPC_SHOP');
    expect(price.auction).toBeUndefined();

    const skysBadge = findAccessoryById('SKYS_BADGE');
    expect(skysBadge).toBeDefined();
    const skyPrice = evaluateAccessoryPrice(skysBadge!);
    expect(skyPrice.npcCost).toBe(21500000);
    expect(skyPrice.primaryMethod).toBe('NPC_SHOP');
    expect(skyPrice.auction).toBeUndefined();
  });

  it('evaluates auction/drop items correctly', () => {
    const wolfTal = findAccessoryById('WOLF_TALISMAN');
    expect(wolfTal).toBeDefined();
    const price = evaluateAccessoryPrice(wolfTal!);
    expect(price.primaryMethod).toBe('AUCTION');
    expect(price.auction).toBeDefined();
    expect(price.auction?.avgPrice).toBeGreaterThan(1000000);
  });

  it('evaluates items without auction history as "No offers were made in auction house"', () => {
    const potato = findAccessoryById('POTATO_TALISMAN');
    expect(potato).toBeDefined();
    const price = evaluateAccessoryPrice(potato!);
    expect(price.displayLabel).toBe('No offers were made in auction house');
  });

  it('formats coins into readable suffixes', () => {
    expect(formatCoins(500)).toBe('500');
    expect(formatCoins(2500)).toBe('2.5K');
    expect(formatCoins(1500000)).toBe('1.5M');
    expect(formatCoins(2000000000)).toBe('2.0B');
  });

  it('correctly evaluates Dayfreezer and Nightfreezer as 945 Gems without parsing Bits/Gems as billions', () => {
    const day = findAccessoryById('DAYFREEZER');
    const night = findAccessoryById('NIGHTFREEZER');
    expect(day).toBeDefined();
    expect(night).toBeDefined();

    const dayPrice = evaluateAccessoryPrice(day!);
    const nightPrice = evaluateAccessoryPrice(night!);

    expect(dayPrice.primaryMethod).toBe('NPC_SHOP');
    expect(dayPrice.displayLabel).toBe('NPC: 945 Gems');
    expect(dayPrice.displayLabel).not.toContain('945.0B');
    expect(dayPrice.displayLabel).not.toContain('Est:');

    expect(nightPrice.primaryMethod).toBe('NPC_SHOP');
    expect(nightPrice.displayLabel).toBe('NPC: 945 Gems');
    expect(nightPrice.displayLabel).not.toContain('945.0B');
  });

  it('displays exact NPC price without "Est:" or "~" for Sky\'s Badge (21.5M) and Cake Bag', () => {
    const sky = findAccessoryById('SKYS_BADGE');
    expect(sky).toBeDefined();
    const skyPrice = evaluateAccessoryPrice(sky!);
    expect(skyPrice.primaryMethod).toBe('NPC_SHOP');
    expect(skyPrice.npcCost).toBe(21500000);
    expect(skyPrice.displayLabel).toBe('NPC: 21.5M');
    expect(skyPrice.displayLabel).not.toContain('Est');
    expect(skyPrice.displayLabel).not.toContain('~');

    const cake = findAccessoryById('NEW_YEARS_CAKE_BAG');
    expect(cake).toBeDefined();
    const cakePrice = evaluateAccessoryPrice(cake!);
    expect(cakePrice.primaryMethod).toBe('NPC_SHOP');
    expect(cakePrice.npcCost).toBe(250000);
    expect(cakePrice.displayLabel).toBe('NPC: 250.0K');
    expect(cakePrice.displayLabel).not.toContain('Est');
  });

  it('validates verified CraftersMC wiki recipes for Fire Extinguisher, Fire Devourer, Frostclaw Relic, and Reaper Orb', () => {
    // Fire Extinguisher: 8x envoys_horn
    const feRecipe = ACCESSORY_RECIPES['FIRE_EXTINGUISHER'];
    expect(feRecipe).toBeDefined();
    expect(feRecipe.ingredients).toEqual([
      { itemId: 'envoys_horn', name: "Envoy's Horn", count: 8 }
    ]);

    // Fire Devourer: 1x FIRE_EXTINGUISHER + 4x fire_fragment
    const fdRecipe = ACCESSORY_RECIPES['FIRE_DEVOURER'];
    expect(fdRecipe).toBeDefined();
    expect(fdRecipe.upgradesFrom).toBe('FIRE_EXTINGUISHER');
    expect(fdRecipe.ingredients).toEqual([
      { itemId: 'fire_fragment', name: 'Fire Fragment', count: 4 }
    ]);

    // Frostclaw Relic: 1x RED_CLAW_ARTIFACT + 64x glacial_fang + 128x enchanted_packed_ice
    const fcRecipe = ACCESSORY_RECIPES['FROSTCLAW_RELIC'];
    expect(fcRecipe).toBeDefined();
    expect(fcRecipe.upgradesFrom).toBe('RED_CLAW_ARTIFACT');
    expect(fcRecipe.ingredients).toEqual([
      { itemId: 'glacial_fang', name: 'Glacial Fang', count: 64 },
      { itemId: 'enchanted_packed_ice', name: 'Enchanted Packed Ice', count: 128 }
    ]);

    // Reaper Orb: 8x scythe_blade (standalone, no upgradesFrom)
    const roRecipe = ACCESSORY_RECIPES['REAPER_ORB'];
    expect(roRecipe).toBeDefined();
    expect(roRecipe.upgradesFrom).toBeUndefined();
    expect(roRecipe.ingredients).toEqual([
      { itemId: 'scythe_blade', name: 'Scythe Blade', count: 8 }
    ]);
  });

  it('validates verified recipes for Piggy Bank, Compactors, Deletors, Spooky and Mining lines', () => {
    // Piggy Bank: 96x enchanted_raw_porkchop + 1x chest
    const pbRecipe = ACCESSORY_RECIPES['PIGGY_BANK'];
    expect(pbRecipe).toBeDefined();
    expect(pbRecipe.ingredients[0].count).toBe(96);
    expect(pbRecipe.ingredients[1].itemId).toBe('chest');

    // Vaccine Talisman: 9x poisonous_potato
    const vtRecipe = ACCESSORY_RECIPES['VACCINE_TALISMAN'];
    expect(vtRecipe.ingredients).toEqual([
      { itemId: 'poisonous_potato', name: 'Poisonous Potato', count: 9 }
    ]);

    // Coins Talisman: 20x emerald + 5x gold_ingot
    const ctRecipe = ACCESSORY_RECIPES['COINS_TALISMAN'];
    expect(ctRecipe.ingredients).toEqual([
      { itemId: 'emerald', name: 'Emerald', count: 20 },
      { itemId: 'gold_ingot', name: 'Gold Ingot', count: 5 }
    ]);

    // Personal Compactor 7000: 56x enchanted_redstone_block
    const pc7k = ACCESSORY_RECIPES['PERSONAL_COMPACTOR_7000'];
    expect(pc7k.ingredients[0].count).toBe(56);
    expect(pc7k.upgradesFrom).toBe('PERSONAL_COMPACTOR_6000');

    // Personal Deletor 7000: 7x enchanted_iron_block
    const pd7k = ACCESSORY_RECIPES['PERSONAL_DELETOR_7000'];
    expect(pd7k.ingredients[0].count).toBe(7);
    expect(pd7k.upgradesFrom).toBe('PERSONAL_DELETOR_6000');

    // Candy Relic: 1024x purple_candy
    const crRecipe = ACCESSORY_RECIPES['CANDY_RELIC'];
    expect(crRecipe.ingredients[0].count).toBe(1024);

    // Bat Person Artifact: 16x spooky_fragment + 128x ectoplasm
    const bpaRecipe = ACCESSORY_RECIPES['BAT_PERSON_ARTIFACT'];
    expect(bpaRecipe.ingredients).toEqual([
      { itemId: 'spooky_fragment', name: 'Spooky Fragment', count: 16 },
      { itemId: 'ectoplasm', name: 'Ectoplasm', count: 128 }
    ]);
  });
});

