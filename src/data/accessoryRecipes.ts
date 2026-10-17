export interface SubMaterial {
  readonly itemId: string;
  readonly name: string;
  readonly count: number;
}

export interface RecipeIngredient {
  readonly itemId: string;
  readonly name: string;
  readonly count: number;
  readonly subMaterial?: SubMaterial;
}

export interface AccessoryRecipe {
  readonly targetId: string;
  readonly upgradesFrom?: string;
  readonly ingredients: readonly RecipeIngredient[];
}

function r(
  targetId: string,
  ingredients: readonly RecipeIngredient[],
  upgradesFrom?: string
): AccessoryRecipe {
  return upgradesFrom ? { targetId, upgradesFrom, ingredients } : { targetId, ingredients };
}

export const ACCESSORY_RECIPES: Record<string, AccessoryRecipe> = {
  // Feather Line
  FEATHER_TALISMAN: r('FEATHER_TALISMAN', [{ itemId: 'feather', name: 'Feather', count: 108 }]),
  FEATHER_RING: r('FEATHER_RING', [{ itemId: 'enchanted_feather', name: 'Enchanted Feather', count: 7 }], 'FEATHER_TALISMAN'),
  FEATHER_ARTIFACT: r('FEATHER_ARTIFACT', [{ itemId: 'enchanted_feather', name: 'Enchanted Feather', count: 128 }], 'FEATHER_RING'),
  GOLDEN_FEATHER_BOOTS: r('GOLDEN_FEATHER_BOOTS', [
    { itemId: 'enchanted_feather', name: 'Enchanted Feather', count: 160 },
    { itemId: 'golden_feather', name: 'Golden Feather', count: 1 }
  ], 'FEATHER_ARTIFACT'),

  // Speed Line
  SPEED_TALISMAN: r('SPEED_TALISMAN', [{ itemId: 'sugar_cane', name: 'Sugar Cane', count: 108 }]),
  SPEED_RING: r('SPEED_RING', [{ itemId: 'enchanted_sugar', name: 'Enchanted Sugar', count: 96 }], 'SPEED_TALISMAN'),
  SPEED_ARTIFACT: r('SPEED_ARTIFACT', [{ itemId: 'enchanted_sugar_cane', name: 'Enchanted Sugar Cane', count: 48 }], 'SPEED_RING'),

  // Bamboo Line
  BAMBOO_TALISMAN: r('BAMBOO_TALISMAN', [{ itemId: 'bamboo', name: 'Bamboo', count: 288 }]),
  BAMBOO_RING: r('BAMBOO_RING', [{ itemId: 'enchanted_bamboo', name: 'Enchanted Bamboo', count: 64 }], 'BAMBOO_TALISMAN'),

  // Farming & Gathering
  FARMING_TALISMAN: r('FARMING_TALISMAN', [
    { itemId: 'wheat', name: 'Wheat', count: 5 },
    { itemId: 'wheat_seeds', name: 'Wheat Seeds', count: 4 }
  ]),
  FARMER_ORB: r('FARMER_ORB', [
    { itemId: 'enchanted_pumpkin', name: 'Enchanted Pumpkin', count: 8 },
    { itemId: 'enchanted_blaze_powder', name: 'Enchanted Blaze Powder', count: 1 }
  ]),
  VACCINE_TALISMAN: r('VACCINE_TALISMAN', [{ itemId: 'poisonous_potato', name: 'Poisonous Potato', count: 9 }]),
  WOOD_AFFINITY_TALISMAN: r('WOOD_AFFINITY_TALISMAN', [
    { itemId: 'oak_leaves', name: 'Oak Leaves', count: 8 },
    { itemId: 'enchanted_oak_log', name: 'Enchanted Oak Log', count: 1 }
  ]),

  CROPIE_TALISMAN: r('CROPIE_TALISMAN', [{ itemId: 'cropie', name: 'Cropie', count: 256 }]),
  SQUASH_RING: r('SQUASH_RING', [{ itemId: 'squash', name: 'Squash', count: 128 }], 'CROPIE_TALISMAN'),
  FERMENTO_ARTIFACT: r(
    'FERMENTO_ARTIFACT',
    [
      {
        itemId: 'condensed_fermento',
        name: 'Condensed Fermento',
        count: 8,
        subMaterial: {
          itemId: 'fermento',
          name: 'Fermento',
          count: 72
        }
      }
    ],
    'SQUASH_RING'
  ),

  // Mining & Utility
  COINS_TALISMAN: r('COINS_TALISMAN', [
    { itemId: 'emerald', name: 'Emerald', count: 20 },
    { itemId: 'gold_ingot', name: 'Gold Ingot', count: 5 }
  ]),
  EMERALD_RING: r('EMERALD_RING', [{ itemId: 'enchanted_emerald', name: 'Enchanted Emerald', count: 32 }]),
  MAGNETIC_TALISMAN: r('MAGNETIC_TALISMAN', [
    { itemId: 'emerald', name: 'Emerald', count: 128 },
    { itemId: 'redstone', name: 'Redstone', count: 32 }
  ]),
  GRAVITY_TALISMAN: r('GRAVITY_TALISMAN', [{ itemId: 'obsidian', name: 'Obsidian', count: 144 }]),
  PIGGY_BANK: r('PIGGY_BANK', [
    { itemId: 'enchanted_raw_porkchop', name: 'Enchanted Raw Porkchop', count: 96 },
    { itemId: 'chest', name: 'Chest', count: 1 }
  ]),
  EXPERIENCE_ARTIFACT: r('EXPERIENCE_ARTIFACT', [{
    itemId: 'enchanted_lapis_block',
    name: 'Enchanted Lapis Block',
    count: 9,
    subMaterial: { itemId: 'enchanted_lapis_lazuli', name: 'Enchanted Lapis Lazuli', count: 1440 }
  }]),

  // Draconic Family
  DRACONIC_TALISMAN: r('DRACONIC_TALISMAN', [
    { itemId: 'fused_remnants', name: 'Fused Remnants', count: 2 },
    { itemId: 'mite_gel', name: 'Mite Gel', count: 96 },
    { itemId: 'absolute_ender_pearl', name: 'Absolute Ender Pearl', count: 32 }
  ]),
  DRACONIC_RING: r('DRACONIC_RING', [
    { itemId: 'fused_remnants', name: 'Fused Remnants', count: 4 },
    { itemId: 'mite_gel', name: 'Mite Gel', count: 96 },
    { itemId: 'tessellated_ender_pearl', name: 'Tessellated Ender Pearl', count: 1 }
  ], 'DRACONIC_TALISMAN'),
  DRACONIC_ARTIFACT: r('DRACONIC_ARTIFACT', [
    { itemId: 'fused_remnants', name: 'Fused Remnants', count: 12 },
    { itemId: 'mite_gel', name: 'Mite Gel', count: 128 },
    { itemId: 'tessellated_ender_pearl', name: 'Tessellated Ender Pearl', count: 2 }
  ], 'DRACONIC_RING'),

  // Combat / Mob items
  FIRE_TALISMAN: r('FIRE_TALISMAN', [{ itemId: 'enchanted_blaze_powder', name: 'Enchanted Blaze Powder', count: 9 }]),
  FIRE_EXTINGUISHER: r('FIRE_EXTINGUISHER', [
    { itemId: 'envoys_horn', name: "Envoy's Horn", count: 8 }
  ]),
  FIRE_DEVOURER: r('FIRE_DEVOURER', [{ itemId: 'fire_fragment', name: 'Fire Fragment', count: 4 }], 'FIRE_EXTINGUISHER'),
  LAVA_TALISMAN: r('LAVA_TALISMAN', [{ itemId: 'enchanted_magma_cream', name: 'Enchanted Magma Cream', count: 9 }]),
  NIGHT_VISION_CHARM: r('NIGHT_VISION_CHARM', [
    { itemId: 'enchanted_red_mushroom', name: 'Enchanted Red Mushroom', count: 4 },
    { itemId: 'enchanted_brown_mushroom', name: 'Enchanted Brown Mushroom', count: 4 }
  ]),

  // Personal Compactors
  PERSONAL_COMPACTOR_4000: r('PERSONAL_COMPACTOR_4000', [
    { itemId: 'super_compactor_3000', name: 'Super Compactor 3000', count: 1 },
    { itemId: 'enchanted_redstone_block', name: 'Enchanted Redstone Block', count: 7 }
  ]),
  PERSONAL_COMPACTOR_5000: r('PERSONAL_COMPACTOR_5000', [
    { itemId: 'enchanted_redstone_block', name: 'Enchanted Redstone Block', count: 14 }
  ], 'PERSONAL_COMPACTOR_4000'),
  PERSONAL_COMPACTOR_6000: r('PERSONAL_COMPACTOR_6000', [
    { itemId: 'enchanted_redstone_block', name: 'Enchanted Redstone Block', count: 28 }
  ], 'PERSONAL_COMPACTOR_5000'),
  PERSONAL_COMPACTOR_7000: r('PERSONAL_COMPACTOR_7000', [
    { itemId: 'enchanted_redstone_block', name: 'Enchanted Redstone Block', count: 56 }
  ], 'PERSONAL_COMPACTOR_6000'),

  // Personal Deletors
  PERSONAL_DELETOR_4000: r('PERSONAL_DELETOR_4000', [
    { itemId: 'enchanted_lava_bucket', name: 'Enchanted Lava Bucket', count: 1 },
    { itemId: 'enchanted_redstone_block', name: 'Enchanted Redstone Block', count: 1 },
    { itemId: 'enchanted_iron_ingot', name: 'Enchanted Iron Ingot', count: 112 }
  ]),
  PERSONAL_DELETOR_5000: r('PERSONAL_DELETOR_5000', [
    { itemId: 'enchanted_iron_ingot', name: 'Enchanted Iron Ingot', count: 224 }
  ], 'PERSONAL_DELETOR_4000'),
  PERSONAL_DELETOR_6000: r('PERSONAL_DELETOR_6000', [
    { itemId: 'enchanted_iron_ingot', name: 'Enchanted Iron Ingot', count: 448 }
  ], 'PERSONAL_DELETOR_5000'),
  PERSONAL_DELETOR_7000: r('PERSONAL_DELETOR_7000', [
    { itemId: 'enchanted_iron_block', name: 'Enchanted Iron Block', count: 7 }
  ], 'PERSONAL_DELETOR_6000'),

  // Slayer Recipes (Wolf & Zombie Slayer lines)
  RED_CLAW_TALISMAN: r('RED_CLAW_TALISMAN', [
    { itemId: 'wolf_tooth', name: 'Wolf Tooth', count: 8 },
    { itemId: 'enchanted_bone', name: 'Enchanted Bone', count: 1 }
  ]),
  RED_CLAW_RING: r('RED_CLAW_RING', [
    { itemId: 'golden_tooth', name: 'Golden Tooth', count: 8 },
    { itemId: 'enchanted_leather', name: 'Enchanted Leather', count: 32 }
  ], 'RED_CLAW_TALISMAN'),
  RED_CLAW_ARTIFACT: r('RED_CLAW_ARTIFACT', [
    { itemId: 'red_claw_egg', name: 'Red Claw Egg', count: 1 },
    { itemId: 'golden_tooth', name: 'Golden Tooth', count: 54 },
    { itemId: 'enchanted_leather', name: 'Enchanted Leather', count: 128 }
  ], 'RED_CLAW_RING'),
  FROSTCLAW_RELIC: r('FROSTCLAW_RELIC', [
    { itemId: 'glacial_fang', name: 'Glacial Fang', count: 64 },
    { itemId: 'enchanted_packed_ice', name: 'Enchanted Packed Ice', count: 128 }
  ], 'RED_CLAW_ARTIFACT'),

  HUNTER_TALISMAN: r('HUNTER_TALISMAN', [
    { itemId: 'golden_tooth', name: 'Golden Tooth', count: 64 },
    { itemId: 'enchanted_rotten_flesh', name: 'Enchanted Rotten Flesh', count: 32 }
  ]),
  HUNTER_RING: r('HUNTER_RING', [
    { itemId: 'grizzly_bait', name: 'Grizzly Bait', count: 1 },
    { itemId: 'golden_tooth', name: 'Golden Tooth', count: 224 }
  ], 'HUNTER_TALISMAN'),

  ZOMBIE_RING: r('ZOMBIE_RING', [
    { itemId: 'revenant_flesh', name: 'Revenant Flesh', count: 64 }
  ], 'ZOMBIE_TALISMAN'),
  ZOMBIE_ARTIFACT: r('ZOMBIE_ARTIFACT', [
    { itemId: 'revenant_viscera', name: 'Revenant Viscera', count: 48 },
    { itemId: 'enchanted_iron_ingot', name: 'Enchanted Iron Ingot', count: 32 },
    { itemId: 'enchanted_diamond', name: 'Enchanted Diamond', count: 16 }
  ], 'ZOMBIE_RING'),
  REAPER_ORB: r('REAPER_ORB', [
    { itemId: 'scythe_blade', name: 'Scythe Blade', count: 8 }
  ]),

  // Spooky / Bat line
  CANDY_TALISMAN: r('CANDY_TALISMAN', [{ itemId: 'green_candy', name: 'Green Candy', count: 16 }]),
  CANDY_RING: r('CANDY_RING', [{ itemId: 'green_candy', name: 'Green Candy', count: 64 }], 'CANDY_TALISMAN'),
  CANDY_ARTIFACT: r('CANDY_ARTIFACT', [{ itemId: 'purple_candy', name: 'Purple Candy', count: 32 }], 'CANDY_RING'),
  CANDY_RELIC: r('CANDY_RELIC', [{ itemId: 'purple_candy', name: 'Purple Candy', count: 1024 }], 'CANDY_ARTIFACT'),
  BAT_RING: r('BAT_RING', [{ itemId: 'green_candy', name: 'Green Candy', count: 64 }], 'BAT_TALISMAN'),
  BAT_ARTIFACT: r('BAT_ARTIFACT', [{ itemId: 'purple_candy', name: 'Purple Candy', count: 64 }], 'BAT_RING'),
  BAT_PERSON_RING: r('BAT_PERSON_RING', [
    { itemId: 'spooky_fragment', name: 'Spooky Fragment', count: 4 },
    { itemId: 'ectoplasm', name: 'Ectoplasm', count: 32 }
  ], 'BAT_PERSON_TALISMAN'),
  BAT_PERSON_ARTIFACT: r('BAT_PERSON_ARTIFACT', [
    { itemId: 'spooky_fragment', name: 'Spooky Fragment', count: 16 },
    { itemId: 'ectoplasm', name: 'Ectoplasm', count: 128 }
  ], 'BAT_PERSON_RING'),
  INTIMIDATION_RING: r('INTIMIDATION_RING', [{ itemId: 'green_candy', name: 'Green Candy', count: 100 }], 'INTIMIDATION_TALISMAN'),
  INTIMIDATION_ARTIFACT: r('INTIMIDATION_ARTIFACT', [{ itemId: 'purple_candy', name: 'Purple Candy', count: 100 }], 'INTIMIDATION_RING'),
  WOLF_RING: r('WOLF_RING', [
    { itemId: 'weak_wolf_catalyst', name: 'Weak Wolf Catalyst', count: 1 },
    { itemId: 'enchanted_bone', name: 'Enchanted Bone', count: 14 }
  ], 'WOLF_TALISMAN')
};
