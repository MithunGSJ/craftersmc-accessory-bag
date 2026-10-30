import { describe, it, expect } from 'vitest';
import {
  evaluateAccessoryPrice,
  calculateCraftCost,
  getBazaarMaterialPrice,
  getAccessoryAuctionPrice,
  formatCoins,
  setLiveAuctionPrice,
  clearPricingCache,
  refreshLiveBazaarPrice
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
    const [tDef, rDef, aDef, bDef] = [
      findAccessoryById('FEATHER_TALISMAN'),
      findAccessoryById('FEATHER_RING'),
      findAccessoryById('FEATHER_ARTIFACT'),
      findAccessoryById('GOLDEN_FEATHER_BOOTS')
    ];
    expect(tDef && rDef && aDef && bDef).toBeTruthy();
    const [tPrice, rPrice, aPrice, bPrice] = [
      evaluateAccessoryPrice(tDef!),
      evaluateAccessoryPrice(rDef!),
      evaluateAccessoryPrice(aDef!),
      evaluateAccessoryPrice(bDef!)
    ];
    expect(tPrice.primaryMethod).toBe('BAZAAR_CRAFT');
    expect(rPrice.primaryMethod).toBe('BAZAAR_CRAFT');
    expect(aPrice.primaryMethod).toBe('BAZAAR_CRAFT');
    expect(bPrice.primaryMethod).toBe('BAZAAR_CRAFT');
    expect(bPrice.effectivePrice).toBeGreaterThan(aPrice.effectivePrice);
    expect(aPrice.effectivePrice).toBeGreaterThan(rPrice.effectivePrice);
    expect(rPrice.effectivePrice).toBeGreaterThan(tPrice.effectivePrice);

    const { breakdown } = calculateCraftCost(ACCESSORY_RECIPES['GOLDEN_FEATHER_BOOTS']);
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
    expect(priceDetails.effectivePrice).toBeGreaterThan(500);
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
    expect(expAuction?.minPrice).toBeGreaterThan(0);
    expect(expAuction?.maxPrice).toBeGreaterThanOrEqual(expAuction?.minPrice || 0);
    expect(expAuction?.avgPrice).toBeGreaterThanOrEqual(expAuction?.minPrice || 0);
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
    expect(price.auction?.avgPrice).toBeGreaterThan(0);
  });

  it('evaluates items without auction history as "No offers were made in auction house"', () => {
    const unobtainedAccessory = {
      id: 'UNTRADED_SAMPLE_TALISMAN',
      name: 'Untraded Sample Talisman',
      baseRarity: 'SPECIAL' as const,
      category: 'Event' as const,
      familyId: 'untraded_sample',
      tier: 1,
      stage: 'Event' as const,
      estimatedCoins: 0,
      source: 'Special Event',
      iconEmoji: '💎',
      description: 'Test talisman without active auction history',
      loreLines: []
    };
    const price = evaluateAccessoryPrice(unobtainedAccessory);
    expect(price.displayLabel).toBe('No offers were made in auction house');
    expect(price.primaryMethod).toBe('UNOBTAINABLE');
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
    expect(ACCESSORY_RECIPES['FIRE_EXTINGUISHER'].ingredients).toEqual([
      { itemId: 'envoy_horns', name: "Envoy's Horn", count: 8 }
    ]);
    const fd = ACCESSORY_RECIPES['FIRE_DEVOURER'];
    expect(fd.upgradesFrom).toBe('FIRE_EXTINGUISHER');
    expect(fd.ingredients).toEqual([{ itemId: 'fire_fragment', name: 'Fire Fragment', count: 4 }]);

    const fc = ACCESSORY_RECIPES['FROSTCLAW_RELIC'];
    expect(fc.upgradesFrom).toBe('RED_CLAW_ARTIFACT');
    expect(fc.ingredients).toEqual([
      { itemId: 'glacial_fang', name: 'Glacial Fang', count: 64 },
      { itemId: 'enchanted_packed_ice', name: 'Enchanted Packed Ice', count: 128 }
    ]);

    const ro = ACCESSORY_RECIPES['REAPER_ORB'];
    expect(ro.upgradesFrom).toBeUndefined();
    expect(ro.ingredients).toEqual([{ itemId: 'scythe_blade', name: 'Scythe Blade', count: 8 }]);
  });

  it('validates verified recipes for Piggy Bank, Compactors, Deletors, Spooky and Mining lines', () => {
    const pb = ACCESSORY_RECIPES['PIGGY_BANK'];
    expect(pb?.ingredients[0].count).toBe(96);
    expect(pb?.ingredients[1].itemId).toBe('chest');
    expect(ACCESSORY_RECIPES['VACCINE_TALISMAN'].ingredients).toEqual([{ itemId: 'poisonous_potato', name: 'Poisonous Potato', count: 9 }]);
    expect(ACCESSORY_RECIPES['COINS_TALISMAN'].ingredients).toEqual([
      { itemId: 'emerald', name: 'Emerald', count: 20 },
      { itemId: 'gold_ingot', name: 'Gold Ingot', count: 5 }
    ]);
    const pc7k = ACCESSORY_RECIPES['PERSONAL_COMPACTOR_7000'];
    expect(pc7k.ingredients[0].count).toBe(56);
    expect(pc7k.upgradesFrom).toBe('PERSONAL_COMPACTOR_6000');
    const pd7k = ACCESSORY_RECIPES['PERSONAL_DELETOR_7000'];
    expect(pd7k.ingredients[0].count).toBe(7);
    expect(pd7k.upgradesFrom).toBe('PERSONAL_DELETOR_6000');
    expect(ACCESSORY_RECIPES['CANDY_RELIC'].ingredients[0].count).toBe(1024);
    expect(ACCESSORY_RECIPES['BAT_PERSON_ARTIFACT'].ingredients).toEqual([
      { itemId: 'spooky_fragment', name: 'Spooky Fragment', count: 16 },
      { itemId: 'ectoplasm', name: 'Ectoplasm', count: 128 }
    ]);
  });

  it('supports dynamic hydration of live auction prices and cache clearing', () => {
    setLiveAuctionPrice('MYTHIC_CUSTOM_TALISMAN', {
      minPrice: 5000000,
      avgPrice: 5500000,
      maxPrice: 6000000,
      count: 10
    });
    const price = getAccessoryAuctionPrice('MYTHIC_CUSTOM_TALISMAN');
    expect(price?.avgPrice).toBe(5500000);
    expect(price?.minPrice).toBe(5000000);

    clearPricingCache();
    // After clear, cache is reset
    expect(getAccessoryAuctionPrice('MYTHIC_CUSTOM_TALISMAN')).toBeUndefined();
  });

  it('evaluates Fermento Artifact craft cost with updated Condensed Fermento Bazaar valuation', () => {
    const fermentoDef = findAccessoryById('FERMENTO_ARTIFACT');
    expect(fermentoDef).toBeDefined();
    const priceDetails = evaluateAccessoryPrice(fermentoDef!);
    expect(priceDetails.primaryMethod).toBe('BAZAAR_CRAFT');
    expect(priceDetails.effectivePrice).toBeGreaterThan(10000000);
  });

  it('evaluates Draconic family with fixed 6.4M Fused Remnants and 200K Remnant of the Eye', async () => {
    expect(getBazaarMaterialPrice('fused_remnants')).toBe(6400000);
    expect(getBazaarMaterialPrice('remnant_of_the_eye')).toBe(200000);

    const [tDef, rDef, aDef] = [findAccessoryById('DRACONIC_TALISMAN')!, findAccessoryById('DRACONIC_RING')!, findAccessoryById('DRACONIC_ARTIFACT')!];
    const [talPrice, ringPrice, artPrice] = [evaluateAccessoryPrice(tDef), evaluateAccessoryPrice(rDef), evaluateAccessoryPrice(aDef)];
    expect(talPrice.primaryMethod === 'BAZAAR_CRAFT' && ringPrice.primaryMethod === 'BAZAAR_CRAFT' && artPrice.primaryMethod === 'BAZAAR_CRAFT').toBe(true);

    const talFused = talPrice.craftBreakdown?.find(b => b.itemId === 'fused_remnants');
    expect(talFused?.totalCost).toBe(12800000);
    expect(talFused?.subMaterial?.totalCost).toBe(12800000);
    expect(talFused?.subMaterial?.count).toBe(64);

    const artFused = artPrice.craftBreakdown?.find(b => b.itemId === 'fused_remnants');
    expect(artFused?.totalCost).toBe(76800000);
    expect(artFused?.subMaterial?.count).toBe(384);

    expect(artPrice.effectivePrice).toBeGreaterThan(80000000);

    const livePrice = await refreshLiveBazaarPrice('fused_remnants');
    expect(livePrice).toBe(6400000);
  });
});
