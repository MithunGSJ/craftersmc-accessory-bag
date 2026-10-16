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
  FEATHER_RING: r('FEATHER_RING', [{ itemId: 'enchanted_feather', name: 'Enchanted Feather', count: 224 }], 'FEATHER_TALISMAN'),
  FEATHER_ARTIFACT: r('FEATHER_ARTIFACT', [{ itemId: 'enchanted_feather', name: 'Enchanted Feather', count: 128 }], 'FEATHER_RING'),
  GOLDEN_FEATHER_BOOTS: r('GOLDEN_FEATHER_BOOTS', [{ itemId: 'enchanted_feather', name: 'Enchanted Feather', count: 64 }], 'FEATHER_ARTIFACT'),

  // Speed Line
  SPEED_TALISMAN: r('SPEED_TALISMAN', [{ itemId: 'sugar_cane', name: 'Sugar Cane', count: 108 }]),
  SPEED_RING: r('SPEED_RING', [{ itemId: 'enchanted_sugar', name: 'Enchanted Sugar', count: 96 }], 'SPEED_TALISMAN'),
  SPEED_ARTIFACT: r('SPEED_ARTIFACT', [{ itemId: 'enchanted_sugar_cane', name: 'Enchanted Sugar Cane', count: 48 }], 'SPEED_RING'),

  // Bamboo Line
  BAMBOO_TALISMAN: r('BAMBOO_TALISMAN', [{ itemId: 'bamboo', name: 'Bamboo', count: 512 }]),
  BAMBOO_RING: r('BAMBOO_RING', [{ itemId: 'enchanted_bamboo', name: 'Enchanted Bamboo', count: 256 }], 'BAMBOO_TALISMAN'),

  // Farming & Gathering
  FARMING_TALISMAN: r('FARMING_TALISMAN', [{ itemId: 'wheat', name: 'Wheat', count: 576 }]),
  FARMER_ORB: r('FARMER_ORB', [{ itemId: 'enchanted_pumpkin', name: 'Enchanted Pumpkin', count: 64 }]),
  VACCINE_TALISMAN: r('VACCINE_TALISMAN', [{ itemId: 'enchanted_potato', name: 'Enchanted Potato', count: 144 }]),
  WOOD_AFFINITY_TALISMAN: r('WOOD_AFFINITY_TALISMAN', [{ itemId: 'oak_log', name: 'Oak Wood', count: 512 }]),

  // Cropie / Squash / Fermento
  CROPIE_TALISMAN: r('CROPIE_TALISMAN', [{ itemId: 'cropie', name: 'Cropie', count: 256 }]),
  SQUASH_RING: r('SQUASH_RING', [{ itemId: 'squash', name: 'Squash', count: 128 }], 'CROPIE_TALISMAN'),
  FERMENTO_ARTIFACT: r('FERMENTO_ARTIFACT', [{ itemId: 'fermento', name: 'Fermento', count: 64 }], 'SQUASH_RING'),

  // Mining & Utility
  COINS_TALISMAN: r('COINS_TALISMAN', [{ itemId: 'emerald', name: 'Emerald', count: 128 }]),
  EMERALD_RING: r('EMERALD_RING', [{ itemId: 'enchanted_emerald', name: 'Enchanted Emerald', count: 256 }]),
  MAGNETIC_TALISMAN: r('MAGNETIC_TALISMAN', [{ itemId: 'emerald', name: 'Emerald', count: 128 }]),
  GRAVITY_TALISMAN: r('GRAVITY_TALISMAN', [{ itemId: 'obsidian', name: 'Obsidian', count: 128 }]),
  EXPERIENCE_ARTIFACT: r('EXPERIENCE_ARTIFACT', [{
    itemId: 'enchanted_lapis_block',
    name: 'Enchanted Lapis Block',
    count: 9,
    subMaterial: { itemId: 'enchanted_lapis_lazuli', name: 'Enchanted Lapis Lazuli', count: 1440 }
  }]),

  // Combat / Mob items
  FIRE_TALISMAN: r('FIRE_TALISMAN', [{ itemId: 'enchanted_blaze_rod', name: 'Enchanted Blaze Rod', count: 128 }]),
  FIRE_EXTINGUISHER: r('FIRE_EXTINGUISHER', [
    { itemId: 'enchanted_blaze_rod', name: 'Enchanted Blaze Rod', count: 128 },
    { itemId: 'enchanted_iron_ingot', name: 'Enchanted Iron Ingot', count: 64 }
  ]),
  FIRE_DEVOURER: r('FIRE_DEVOURER', [{ itemId: 'enchanted_blaze_rod', name: 'Enchanted Blaze Rod', count: 256 }], 'FIRE_EXTINGUISHER'),
  LAVA_TALISMAN: r('LAVA_TALISMAN', [{ itemId: 'enchanted_magma_cream', name: 'Enchanted Magma Cream', count: 128 }]),
  NIGHT_VISION_CHARM: r('NIGHT_VISION_CHARM', [{ itemId: 'enchanted_red_mushroom_block', name: 'Enchanted Mushroom', count: 128 }]),

  // Personal Compactors
  PERSONAL_COMPACTOR_4000: r('PERSONAL_COMPACTOR_4000', [{ itemId: 'enchanted_redstone_block', name: 'Enchanted Redstone Block', count: 112 }]),
  PERSONAL_COMPACTOR_5000: r('PERSONAL_COMPACTOR_5000', [{ itemId: 'enchanted_redstone_block', name: 'Enchanted Redstone Block', count: 224 }], 'PERSONAL_COMPACTOR_4000'),
  PERSONAL_COMPACTOR_6000: r('PERSONAL_COMPACTOR_6000', [{ itemId: 'enchanted_redstone_block', name: 'Enchanted Redstone Block', count: 448 }], 'PERSONAL_COMPACTOR_5000'),
  PERSONAL_COMPACTOR_7000: r('PERSONAL_COMPACTOR_7000', [{ itemId: 'enchanted_redstone_block', name: 'Enchanted Redstone Block', count: 896 }], 'PERSONAL_COMPACTOR_6000'),

  // Personal Deletors
  PERSONAL_DELETOR_4000: r('PERSONAL_DELETOR_4000', [{ itemId: 'enchanted_iron_block', name: 'Enchanted Iron Block', count: 112 }]),
  PERSONAL_DELETOR_5000: r('PERSONAL_DELETOR_5000', [{ itemId: 'enchanted_iron_block', name: 'Enchanted Iron Block', count: 224 }], 'PERSONAL_DELETOR_4000'),
  PERSONAL_DELETOR_6000: r('PERSONAL_DELETOR_6000', [{ itemId: 'enchanted_iron_block', name: 'Enchanted Iron Block', count: 448 }], 'PERSONAL_DELETOR_5000'),
  PERSONAL_DELETOR_7000: r('PERSONAL_DELETOR_7000', [{ itemId: 'enchanted_iron_block', name: 'Enchanted Iron Block', count: 896 }], 'PERSONAL_DELETOR_6000'),

  // Slayer Recipes
  RED_CLAW_TALISMAN: r('RED_CLAW_TALISMAN', [{ itemId: 'golden_tooth', name: 'Golden Tooth', count: 64 }]),
  RED_CLAW_RING: r('RED_CLAW_RING', [{ itemId: 'golden_tooth', name: 'Golden Tooth', count: 256 }], 'RED_CLAW_TALISMAN'),
  RED_CLAW_ARTIFACT: r('RED_CLAW_ARTIFACT', [{ itemId: 'golden_tooth', name: 'Golden Tooth', count: 512 }], 'RED_CLAW_RING'),
  HUNTER_TALISMAN: r('HUNTER_TALISMAN', [{ itemId: 'golden_tooth', name: 'Golden Tooth', count: 64 }]),
  HUNTER_RING: r('HUNTER_RING', [{ itemId: 'golden_tooth', name: 'Golden Tooth', count: 256 }], 'HUNTER_TALISMAN'),
  FROSTCLAW_RELIC: r('FROSTCLAW_RELIC', [{ itemId: 'golden_tooth', name: 'Golden Tooth', count: 512 }], 'HUNTER_RING'),
  ZOMBIE_RING: r('ZOMBIE_RING', [{ itemId: 'enchanted_rotten_flesh', name: 'Enchanted Rotten Flesh', count: 512 }], 'ZOMBIE_TALISMAN'),
  ZOMBIE_ARTIFACT: r('ZOMBIE_ARTIFACT', [{ itemId: 'revenant_viscera', name: 'Revenant Viscera', count: 128 }], 'ZOMBIE_RING'),
  REAPER_ORB: r('REAPER_ORB', [{ itemId: 'revenant_viscera', name: 'Revenant Viscera', count: 256 }], 'ZOMBIE_ARTIFACT'),

  // Spooky / Bat line
  CANDY_TALISMAN: r('CANDY_TALISMAN', [{ itemId: 'green_candy', name: 'Green Candy', count: 16 }]),
  CANDY_RING: r('CANDY_RING', [{ itemId: 'green_candy', name: 'Green Candy', count: 64 }], 'CANDY_TALISMAN'),
  CANDY_ARTIFACT: r('CANDY_ARTIFACT', [{ itemId: 'purple_candy', name: 'Purple Candy', count: 32 }], 'CANDY_RING'),
  CANDY_RELIC: r('CANDY_RELIC', [{ itemId: 'purple_candy', name: 'Purple Candy', count: 64 }], 'CANDY_ARTIFACT'),
  BAT_RING: r('BAT_RING', [{ itemId: 'green_candy', name: 'Green Candy', count: 64 }], 'BAT_TALISMAN'),
  BAT_ARTIFACT: r('BAT_ARTIFACT', [{ itemId: 'purple_candy', name: 'Purple Candy', count: 64 }], 'BAT_RING'),
  BAT_PERSON_RING: r('BAT_PERSON_RING', [{ itemId: 'purple_candy', name: 'Purple Candy', count: 128 }], 'BAT_PERSON_TALISMAN'),
  BAT_PERSON_ARTIFACT: r('BAT_PERSON_ARTIFACT', [{ itemId: 'purple_candy', name: 'Purple Candy', count: 256 }], 'BAT_PERSON_RING'),
  WOLF_RING: r('WOLF_RING', [{ itemId: 'enchanted_bone', name: 'Enchanted Bone', count: 128 }], 'WOLF_TALISMAN')
};
