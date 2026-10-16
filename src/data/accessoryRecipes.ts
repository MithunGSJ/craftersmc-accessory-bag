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

export const ACCESSORY_RECIPES: Record<string, AccessoryRecipe> = {
  // Feather Line
  FEATHER_TALISMAN: {
    targetId: 'FEATHER_TALISMAN',
    ingredients: [{ itemId: 'feather', name: 'Feather', count: 108 }]
  },
  FEATHER_RING: {
    targetId: 'FEATHER_RING',
    upgradesFrom: 'FEATHER_TALISMAN',
    ingredients: [{ itemId: 'enchanted_feather', name: 'Enchanted Feather', count: 224 }]
  },
  FEATHER_ARTIFACT: {
    targetId: 'FEATHER_ARTIFACT',
    upgradesFrom: 'FEATHER_RING',
    ingredients: [{ itemId: 'enchanted_feather', name: 'Enchanted Feather', count: 128 }]
  },
  GOLDEN_FEATHER_BOOTS: {
    targetId: 'GOLDEN_FEATHER_BOOTS',
    upgradesFrom: 'FEATHER_ARTIFACT',
    ingredients: [{ itemId: 'enchanted_feather', name: 'Enchanted Feather', count: 64 }]
  },

  // Speed Line
  SPEED_TALISMAN: {
    targetId: 'SPEED_TALISMAN',
    ingredients: [{ itemId: 'sugar_cane', name: 'Sugar Cane', count: 108 }]
  },
  SPEED_RING: {
    targetId: 'SPEED_RING',
    upgradesFrom: 'SPEED_TALISMAN',
    ingredients: [{ itemId: 'enchanted_sugar', name: 'Enchanted Sugar', count: 96 }]
  },
  SPEED_ARTIFACT: {
    targetId: 'SPEED_ARTIFACT',
    upgradesFrom: 'SPEED_RING',
    ingredients: [{ itemId: 'enchanted_sugar_cane', name: 'Enchanted Sugar Cane', count: 48 }]
  },

  // Bamboo Line
  BAMBOO_TALISMAN: {
    targetId: 'BAMBOO_TALISMAN',
    ingredients: [{ itemId: 'bamboo', name: 'Bamboo', count: 512 }]
  },
  BAMBOO_RING: {
    targetId: 'BAMBOO_RING',
    upgradesFrom: 'BAMBOO_TALISMAN',
    ingredients: [{ itemId: 'enchanted_bamboo', name: 'Enchanted Bamboo', count: 256 }]
  },

  // Farming & Gathering
  FARMING_TALISMAN: {
    targetId: 'FARMING_TALISMAN',
    ingredients: [{ itemId: 'wheat', name: 'Wheat', count: 576 }]
  },
  FARMER_ORB: {
    targetId: 'FARMER_ORB',
    ingredients: [{ itemId: 'enchanted_pumpkin', name: 'Enchanted Pumpkin', count: 64 }]
  },
  VACCINE_TALISMAN: {
    targetId: 'VACCINE_TALISMAN',
    ingredients: [{ itemId: 'enchanted_potato', name: 'Enchanted Potato', count: 144 }]
  },
  WOOD_AFFINITY_TALISMAN: {
    targetId: 'WOOD_AFFINITY_TALISMAN',
    ingredients: [{ itemId: 'oak_log', name: 'Oak Wood', count: 512 }]
  },

  // Cropie / Squash / Fermento
  CROPIE_TALISMAN: {
    targetId: 'CROPIE_TALISMAN',
    ingredients: [{ itemId: 'cropie', name: 'Cropie', count: 256 }]
  },
  SQUASH_RING: {
    targetId: 'SQUASH_RING',
    upgradesFrom: 'CROPIE_TALISMAN',
    ingredients: [{ itemId: 'squash', name: 'Squash', count: 128 }]
  },
  FERMENTO_ARTIFACT: {
    targetId: 'FERMENTO_ARTIFACT',
    upgradesFrom: 'SQUASH_RING',
    ingredients: [{ itemId: 'fermento', name: 'Fermento', count: 64 }]
  },

  // Mining & Utility
  COINS_TALISMAN: {
    targetId: 'COINS_TALISMAN',
    ingredients: [{ itemId: 'emerald', name: 'Emerald', count: 128 }]
  },
  EMERALD_RING: {
    targetId: 'EMERALD_RING',
    ingredients: [{ itemId: 'enchanted_emerald', name: 'Enchanted Emerald', count: 256 }]
  },
  MAGNETIC_TALISMAN: {
    targetId: 'MAGNETIC_TALISMAN',
    ingredients: [{ itemId: 'emerald', name: 'Emerald', count: 128 }]
  },
  GRAVITY_TALISMAN: {
    targetId: 'GRAVITY_TALISMAN',
    ingredients: [{ itemId: 'obsidian', name: 'Obsidian', count: 128 }]
  },
  EXPERIENCE_ARTIFACT: {
    targetId: 'EXPERIENCE_ARTIFACT',
    ingredients: [
      {
        itemId: 'enchanted_lapis_block',
        name: 'Enchanted Lapis Block',
        count: 9,
        subMaterial: { itemId: 'enchanted_lapis_lazuli', name: 'Enchanted Lapis Lazuli', count: 1440 }
      }
    ]
  },

  // Combat / Mob items
  FIRE_TALISMAN: {
    targetId: 'FIRE_TALISMAN',
    ingredients: [{ itemId: 'enchanted_blaze_rod', name: 'Enchanted Blaze Rod', count: 128 }]
  },
  FIRE_EXTINGUISHER: {
    targetId: 'FIRE_EXTINGUISHER',
    ingredients: [
      { itemId: 'enchanted_blaze_rod', name: 'Enchanted Blaze Rod', count: 128 },
      { itemId: 'enchanted_iron_ingot', name: 'Enchanted Iron Ingot', count: 64 }
    ]
  },
  FIRE_DEVOURER: {
    targetId: 'FIRE_DEVOURER',
    upgradesFrom: 'FIRE_EXTINGUISHER',
    ingredients: [{ itemId: 'enchanted_blaze_rod', name: 'Enchanted Blaze Rod', count: 256 }]
  },
  LAVA_TALISMAN: {
    targetId: 'LAVA_TALISMAN',
    ingredients: [{ itemId: 'enchanted_magma_cream', name: 'Enchanted Magma Cream', count: 128 }]
  },
  NIGHT_VISION_CHARM: {
    targetId: 'NIGHT_VISION_CHARM',
    ingredients: [{ itemId: 'enchanted_red_mushroom_block', name: 'Enchanted Mushroom', count: 128 }]
  },

  // Personal Compactors
  PERSONAL_COMPACTOR_4000: {
    targetId: 'PERSONAL_COMPACTOR_4000',
    ingredients: [{ itemId: 'enchanted_redstone_block', name: 'Enchanted Redstone Block', count: 112 }]
  },
  PERSONAL_COMPACTOR_5000: {
    targetId: 'PERSONAL_COMPACTOR_5000',
    upgradesFrom: 'PERSONAL_COMPACTOR_4000',
    ingredients: [{ itemId: 'enchanted_redstone_block', name: 'Enchanted Redstone Block', count: 224 }]
  },
  PERSONAL_COMPACTOR_6000: {
    targetId: 'PERSONAL_COMPACTOR_6000',
    upgradesFrom: 'PERSONAL_COMPACTOR_5000',
    ingredients: [{ itemId: 'enchanted_redstone_block', name: 'Enchanted Redstone Block', count: 448 }]
  },
  PERSONAL_COMPACTOR_7000: {
    targetId: 'PERSONAL_COMPACTOR_7000',
    upgradesFrom: 'PERSONAL_COMPACTOR_6000',
    ingredients: [{ itemId: 'enchanted_redstone_block', name: 'Enchanted Redstone Block', count: 896 }]
  },

  // Personal Deletors
  PERSONAL_DELETOR_4000: {
    targetId: 'PERSONAL_DELETOR_4000',
    ingredients: [{ itemId: 'enchanted_iron_block', name: 'Enchanted Iron Block', count: 112 }]
  },
  PERSONAL_DELETOR_5000: {
    targetId: 'PERSONAL_DELETOR_5000',
    upgradesFrom: 'PERSONAL_DELETOR_4000',
    ingredients: [{ itemId: 'enchanted_iron_block', name: 'Enchanted Iron Block', count: 224 }]
  },
  PERSONAL_DELETOR_6000: {
    targetId: 'PERSONAL_DELETOR_6000',
    upgradesFrom: 'PERSONAL_DELETOR_5000',
    ingredients: [{ itemId: 'enchanted_iron_block', name: 'Enchanted Iron Block', count: 448 }]
  },
  PERSONAL_DELETOR_7000: {
    targetId: 'PERSONAL_DELETOR_7000',
    upgradesFrom: 'PERSONAL_DELETOR_6000',
    ingredients: [{ itemId: 'enchanted_iron_block', name: 'Enchanted Iron Block', count: 896 }]
  },

  // Slayer Recipes
  RED_CLAW_TALISMAN: {
    targetId: 'RED_CLAW_TALISMAN',
    ingredients: [{ itemId: 'golden_tooth', name: 'Golden Tooth', count: 64 }]
  },
  RED_CLAW_RING: {
    targetId: 'RED_CLAW_RING',
    upgradesFrom: 'RED_CLAW_TALISMAN',
    ingredients: [{ itemId: 'golden_tooth', name: 'Golden Tooth', count: 256 }]
  },
  RED_CLAW_ARTIFACT: {
    targetId: 'RED_CLAW_ARTIFACT',
    upgradesFrom: 'RED_CLAW_RING',
    ingredients: [{ itemId: 'golden_tooth', name: 'Golden Tooth', count: 512 }]
  },
  HUNTER_TALISMAN: {
    targetId: 'HUNTER_TALISMAN',
    ingredients: [{ itemId: 'golden_tooth', name: 'Golden Tooth', count: 64 }]
  },
  HUNTER_RING: {
    targetId: 'HUNTER_RING',
    upgradesFrom: 'HUNTER_TALISMAN',
    ingredients: [{ itemId: 'golden_tooth', name: 'Golden Tooth', count: 256 }]
  },
  FROSTCLAW_RELIC: {
    targetId: 'FROSTCLAW_RELIC',
    upgradesFrom: 'HUNTER_RING',
    ingredients: [{ itemId: 'golden_tooth', name: 'Golden Tooth', count: 512 }]
  },
  ZOMBIE_RING: {
    targetId: 'ZOMBIE_RING',
    upgradesFrom: 'ZOMBIE_TALISMAN',
    ingredients: [{ itemId: 'enchanted_rotten_flesh', name: 'Enchanted Rotten Flesh', count: 512 }]
  },
  ZOMBIE_ARTIFACT: {
    targetId: 'ZOMBIE_ARTIFACT',
    upgradesFrom: 'ZOMBIE_RING',
    ingredients: [{ itemId: 'revenant_viscera', name: 'Revenant Viscera', count: 128 }]
  },
  REAPER_ORB: {
    targetId: 'REAPER_ORB',
    upgradesFrom: 'ZOMBIE_ARTIFACT',
    ingredients: [{ itemId: 'revenant_viscera', name: 'Revenant Viscera', count: 256 }]
  },

  // Spooky / Bat line
  CANDY_TALISMAN: {
    targetId: 'CANDY_TALISMAN',
    ingredients: [{ itemId: 'green_candy', name: 'Green Candy', count: 16 }]
  },
  CANDY_RING: {
    targetId: 'CANDY_RING',
    upgradesFrom: 'CANDY_TALISMAN',
    ingredients: [{ itemId: 'green_candy', name: 'Green Candy', count: 64 }]
  },
  CANDY_ARTIFACT: {
    targetId: 'CANDY_ARTIFACT',
    upgradesFrom: 'CANDY_RING',
    ingredients: [{ itemId: 'purple_candy', name: 'Purple Candy', count: 32 }]
  },
  CANDY_RELIC: {
    targetId: 'CANDY_RELIC',
    upgradesFrom: 'CANDY_ARTIFACT',
    ingredients: [{ itemId: 'purple_candy', name: 'Purple Candy', count: 64 }]
  },
  BAT_RING: {
    targetId: 'BAT_RING',
    upgradesFrom: 'BAT_TALISMAN',
    ingredients: [{ itemId: 'green_candy', name: 'Green Candy', count: 64 }]
  },
  BAT_ARTIFACT: {
    targetId: 'BAT_ARTIFACT',
    upgradesFrom: 'BAT_RING',
    ingredients: [{ itemId: 'purple_candy', name: 'Purple Candy', count: 64 }]
  },
  BAT_PERSON_RING: {
    targetId: 'BAT_PERSON_RING',
    upgradesFrom: 'BAT_PERSON_TALISMAN',
    ingredients: [{ itemId: 'purple_candy', name: 'Purple Candy', count: 128 }]
  },
  BAT_PERSON_ARTIFACT: {
    targetId: 'BAT_PERSON_ARTIFACT',
    upgradesFrom: 'BAT_PERSON_RING',
    ingredients: [{ itemId: 'purple_candy', name: 'Purple Candy', count: 256 }]
  },
  WOLF_RING: {
    targetId: 'WOLF_RING',
    upgradesFrom: 'WOLF_TALISMAN',
    ingredients: [{ itemId: 'enchanted_bone', name: 'Enchanted Bone', count: 128 }]
  }
};
