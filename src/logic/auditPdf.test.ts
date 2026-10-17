import { describe, it, expect } from 'vitest';
import { findAccessoryById } from '../data/accessoryRegistry.ts';
import { ACCESSORY_RECIPES } from '../data/accessoryRecipes.ts';
import { evaluateAccessoryPrice } from './pricingEngine.ts';

const PDF_ACCESSORIES = [
  // COMMON (11)
  'BLOOD_GOD_CREST', 'COINS_TALISMAN', 'FARMING_TALISMAN', 'FIRE_TALISMAN',
  'MINE_AFFINITY_TALISMAN', 'NIGHT_VISION_CHARM', 'POTATO_TALISMAN',
  'SCAVENGER_TALISMAN', 'SKELETON_TALISMAN', 'VACCINE_TALISMAN', 'VILLAGE_AFFINITY_TALISMAN',

  // UNCOMMON (10)
  'BAMBOO_RING', 'EMERALD_RING', 'FARMER_ORB', 'GRAVITY_TALISMAN',
  'LAVA_TALISMAN', 'MAGNETIC_TALISMAN', 'NEW_YEARS_CAKE_BAG', 'PIGGY_BANK',
  'WOLF_RING', 'WOOD_AFFINITY_TALISMAN',

  // RARE (10)
  'BAT_PERSON_ARTIFACT', 'CAKE_SLICE', 'FARMIONAIRE_ARTIFACT', 'FERMENTO_ARTIFACT',
  'HUNTER_RING', 'INTIMIDATION_ARTIFACT', 'PIGS_FOOT', 'SEAL_OF_THE_OCEANS',
  'SPEED_ARTIFACT', 'ZOMBIE_ARTIFACT',

  // EPIC (4)
  'BAT_ARTIFACT', 'DRACONIC_ARTIFACT', 'EXPERIENCE_ARTIFACT', 'FIRE_DEVOURER',

  // LEGENDARY (10)
  'CAMPFIRE_GOD_BADGE', 'CANDY_RELIC', 'DAYFREEZER', 'NIGHTFREEZER',
  'FROSTCLAW_RELIC', 'GOLDEN_FEATHER_BOOTS', 'PERSONAL_COMPACTOR_7000',
  'PERSONAL_DELETOR_7000', 'REAPER_ORB', 'SKYS_BADGE'
];

describe('Audit PDF Accessories', () => {
  it('audits all 44 PDF accessories against registry, recipes, and pricing engine', () => {
    expect(PDF_ACCESSORIES.length).toBe(45); // 44 unique families (Day/Night freezer are both in PDF)

    for (const id of PDF_ACCESSORIES) {
      const def = findAccessoryById(id);
      expect(def, `Accessory ${id} must exist in registry`).toBeDefined();
      if (!def) continue;

      const recipe = ACCESSORY_RECIPES[id];
      const pricing = evaluateAccessoryPrice(def);

      expect(pricing.displayLabel).toBeDefined();
      expect(pricing.displayLabel).not.toContain('NaN');
      expect(pricing.displayLabel).not.toContain('undefined');

      if (recipe) {
        expect(pricing.primaryMethod).toBe('BAZAAR_CRAFT');
        expect(pricing.craftCost).toBeGreaterThan(0);
        expect(pricing.craftBreakdown?.length).toBeGreaterThan(0);
      }

      if (def.npcCost) {
        expect(pricing.primaryMethod).toBe('NPC_SHOP');
        expect(pricing.displayLabel).not.toContain('~');
        expect(pricing.displayLabel).not.toContain('Est');
      }
    }
  });
});
