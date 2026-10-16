import { AccessoryDefinition } from './accessoryTypes.ts';

export const COMBAT_ACCESSORIES: readonly AccessoryDefinition[] = [
  // Zombie Family
  {
    id: 'ZOMBIE_TALISMAN',
    name: 'Zombie Talisman',
    baseRarity: 'COMMON',
    category: 'Combat',
    familyId: 'zombie',
    tier: 1,
    description: 'Reduce damage taken from Zombies by 5%.',
    source: 'Julia NPC (Hub) - 500 Coins',
    estimatedCoins: 500,
    iconEmoji: '🧟',
    loreLines: ['Reduce damage taken from Zombies by 5%.']
  },
  {
    id: 'ZOMBIE_RING',
    name: 'Zombie Ring',
    baseRarity: 'UNCOMMON',
    category: 'Combat',
    familyId: 'zombie',
    tier: 2,
    description: 'Reduce damage taken from Zombies by 10%.',
    source: 'Zombie Slayer Level 2 (Crafting)',
    estimatedCoins: 25000,
    iconEmoji: '🧟',
    loreLines: ['Reduce damage taken from Zombies by 10%.']
  },
  {
    id: 'ZOMBIE_ARTIFACT',
    name: 'Zombie Artifact',
    baseRarity: 'RARE',
    category: 'Combat',
    familyId: 'zombie',
    tier: 3,
    description: 'Reduce damage taken from Zombies by 15%.',
    source: 'Zombie Slayer Level 7 (Crafting)',
    estimatedCoins: 850000,
    iconEmoji: '🧟',
    loreLines: ['Reduce damage taken from Zombies by 15%.']
  },
  // Skeleton Family
  {
    id: 'SKELETON_TALISMAN',
    name: 'Skeleton Talisman',
    baseRarity: 'COMMON',
    category: 'Combat',
    familyId: 'skeleton',
    tier: 1,
    description: 'Reduce damage taken from Skeletons by 5%.',
    source: 'Julia NPC (Hub) - 500 Coins',
    estimatedCoins: 500,
    iconEmoji: '💀',
    loreLines: ['Reduce damage taken from Skeletons by 5%.']
  },
  // Wolf Family
  {
    id: 'WOLF_TALISMAN',
    name: 'Wolf Talisman',
    baseRarity: 'COMMON',
    category: 'Combat',
    familyId: 'wolf_talisman_line',
    tier: 1,
    description: 'Reduce damage taken from Wolves by 5%.',
    source: 'Old Wolf Rare Drop (0.01%)',
    estimatedCoins: 150000,
    iconEmoji: '🐺',
    loreLines: ['Reduce damage taken from Wolves by 5%.']
  },
  {
    id: 'WOLF_RING',
    name: 'Wolf Ring',
    baseRarity: 'UNCOMMON',
    category: 'Combat',
    familyId: 'wolf_talisman_line',
    tier: 2,
    description: 'Reduce damage taken from Wolves by 10%.',
    source: 'Wolf Collection (Crafting)',
    estimatedCoins: 450000,
    iconEmoji: '🐺',
    loreLines: ['Reduce damage taken from Wolves by 10%.']
  },
  // Blood God Crest
  {
    id: 'BLOOD_GOD_CREST',
    name: 'Blood God Crest',
    baseRarity: 'COMMON',
    category: 'Combat',
    familyId: 'blood_god',
    tier: 1,
    description: 'Honors the Blood God. Tracks mob kills.',
    source: 'Pig Shop / Technoblade Memorial',
    estimatedCoins: 200000,
    iconEmoji: '👑',
    loreLines: ['Blood God Memorial Accessory.']
  },
  // Draconic Family
  {
    id: 'DRACONIC_TALISMAN',
    name: 'Draconic Talisman',
    baseRarity: 'UNCOMMON',
    category: 'Combat',
    familyId: 'draconic',
    tier: 1,
    description: 'Grants +2% damage against Dragons.',
    source: 'Dragon Crafting',
    estimatedCoins: 250000,
    iconEmoji: '🐉',
    loreLines: ['Grants +2% damage against Dragons.']
  },
  {
    id: 'DRACONIC_RING',
    name: 'Draconic Ring',
    baseRarity: 'RARE',
    category: 'Combat',
    familyId: 'draconic',
    tier: 2,
    description: 'Grants +5% damage against Dragons.',
    source: 'Dragon Crafting',
    estimatedCoins: 1200000,
    iconEmoji: '🐉',
    loreLines: ['Grants +5% damage against Dragons.']
  },
  {
    id: 'DRACONIC_ARTIFACT',
    name: 'Draconic Artifact',
    baseRarity: 'EPIC',
    category: 'Combat',
    familyId: 'draconic',
    tier: 3,
    description: 'Grants +10% damage against Dragons.',
    source: 'Dragon Crafting',
    estimatedCoins: 6500000,
    iconEmoji: '🐉',
    loreLines: ['Grants +10% damage against Dragons.']
  },
  // Intimidation Family
  {
    id: 'INTIMIDATION_TALISMAN',
    name: 'Intimidation Talisman',
    baseRarity: 'COMMON',
    category: 'Combat',
    familyId: 'intimidation',
    tier: 1,
    description: 'Monsters at or below Level 1 will not target you.',
    source: 'Julia NPC (Hub) - 10,000 Coins',
    estimatedCoins: 10000,
    iconEmoji: '👿',
    loreLines: ['Level 1 monsters will not target you.']
  },
  {
    id: 'INTIMIDATION_RING',
    name: 'Intimidation Ring',
    baseRarity: 'UNCOMMON',
    category: 'Combat',
    familyId: 'intimidation',
    tier: 2,
    description: 'Monsters at or below Level 5 will not target you.',
    source: 'Crafting Upgrade',
    estimatedCoins: 100000,
    iconEmoji: '👿',
    loreLines: ['Level 5 monsters will not target you.']
  },
  {
    id: 'INTIMIDATION_ARTIFACT',
    name: 'Intimidation Artifact',
    baseRarity: 'RARE',
    category: 'Combat',
    familyId: 'intimidation',
    tier: 3,
    description: 'Monsters at or below Level 25 will not target you.',
    source: 'Crafting Upgrade',
    estimatedCoins: 850000,
    iconEmoji: '👿',
    loreLines: ['Level 25 monsters will not target you.']
  },
  // Fire Family & Lava
  {
    id: 'FIRE_TALISMAN',
    name: 'Fire Talisman',
    baseRarity: 'COMMON',
    category: 'Combat',
    familyId: 'fire',
    tier: 1,
    description: 'Grants immunity to Fire damage.',
    source: 'Blaze Rod Collection V (Crafting)',
    estimatedCoins: 15000,
    iconEmoji: '🔥',
    loreLines: ['Grants complete immunity to Fire.']
  },
  {
    id: 'FIRE_EXTINGUISHER',
    name: 'Fire Extinguisher',
    baseRarity: 'RARE',
    category: 'Combat',
    familyId: 'fire',
    tier: 2,
    description: 'Immunity to Fire and reduces Nether mob damage by 10%.',
    source: 'Nether Crafting',
    estimatedCoins: 650000,
    iconEmoji: '🧯',
    loreLines: ['Immunity to Fire and Nether protection.']
  },
  {
    id: 'FIRE_DEVOURER',
    name: 'Fire Devourer',
    baseRarity: 'EPIC',
    category: 'Combat',
    familyId: 'fire',
    tier: 3,
    description: 'Absorbs Fire damage into temporary Strength.',
    source: 'Nether High-Tier Crafting',
    estimatedCoins: 4500000,
    iconEmoji: '🔥',
    loreLines: ['Absorbs Fire damage into temporary Strength.']
  },
  {
    id: 'LAVA_TALISMAN',
    name: 'Lava Talisman',
    baseRarity: 'UNCOMMON',
    category: 'Combat',
    familyId: 'lava',
    tier: 1,
    description: 'Grants complete immunity to Lava damage.',
    source: 'Magma Cream Collection VII (Crafting)',
    estimatedCoins: 45000,
    iconEmoji: '🌋',
    loreLines: ['Grants complete immunity to Lava.']
  }
];
