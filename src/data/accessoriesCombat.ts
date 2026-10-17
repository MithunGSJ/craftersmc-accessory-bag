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
    description: 'Reduces the damage taken from Zombies by 5%.',
    source: 'Julia (500)',
    npcCost: '500 Coins',
    stage: 'NPC Shop',
    iconEmoji: '🧟',
    loreLines: ['Reduces the damage taken from Zombies by 5%.']
  },
  {
    id: 'ZOMBIE_RING',
    name: 'Zombie Ring',
    baseRarity: 'UNCOMMON',
    category: 'Combat',
    familyId: 'zombie',
    tier: 2,
    description: 'Reduces the damage taken from Zombies by 10%. Requires Zombie Slayer 2.',
    source: 'Crafting (Zombie Slayer 2)',
    stage: 'Slayer',
    iconEmoji: '🧟',
    loreLines: ['Reduces the damage taken from Zombies by 10%.', 'Requires Zombie Slayer 2.']
  },
  {
    id: 'ZOMBIE_ARTIFACT',
    name: 'Zombie Artifact',
    baseRarity: 'RARE',
    category: 'Combat',
    familyId: 'zombie',
    tier: 3,
    description: 'Reduces the damage taken from Zombies by 15%. Requires Zombie Slayer 7.',
    source: 'Crafting (Zombie Slayer 7)',
    stage: 'Slayer',
    iconEmoji: '🧟',
    loreLines: ['Reduces the damage taken from Zombies by 15%.', 'Requires Zombie Slayer 7.']
  },
  // Skeleton Family
  {
    id: 'SKELETON_TALISMAN',
    name: 'Skeleton Talisman',
    baseRarity: 'COMMON',
    category: 'Combat',
    familyId: 'skeleton',
    tier: 1,
    description: 'Reduces the damage taken from Skeletons by 5%.',
    source: 'Julia (500)',
    npcCost: '500 Coins',
    stage: 'NPC Shop',
    iconEmoji: '💀',
    loreLines: ['Reduces the damage taken from Skeletons by 5%.']
  },
  // Wolf Family
  {
    id: 'WOLF_TALISMAN',
    name: 'Wolf Talisman',
    baseRarity: 'COMMON',
    category: 'Combat',
    familyId: 'wolf_talisman_line',
    tier: 1,
    description: 'Reduces the damage taken from Wolves by 5%.',
    source: 'Dropped from Old Wolf (0.01%)',
    stage: 'Rare Drop',
    iconEmoji: '🐺',
    loreLines: ['Reduces the damage taken from Wolves by 5%.']
  },
  {
    id: 'WOLF_RING',
    name: 'Wolf Ring',
    baseRarity: 'UNCOMMON',
    category: 'Combat',
    familyId: 'wolf_talisman_line',
    tier: 2,
    description: 'Reduces the damage taken from Wolves by 10%.',
    source: 'Crafting',
    stage: 'Mid Collection',
    iconEmoji: '🐺',
    loreLines: ['Reduces the damage taken from Wolves by 10%.']
  },
  // Blood God Crest
  {
    id: 'BLOOD_GOD_CREST',
    name: 'Blood God Crest',
    baseRarity: 'COMMON',
    category: 'Combat',
    familyId: 'blood_god',
    tier: 1,
    description: 'Tracks a counter for each mob killed while worn. Gain +1 Strength for each digit on the counter.',
    source: 'Pig Shop',
    npcCost: '1,250,000 Coins',
    stage: 'Event',
    iconEmoji: '👑',
    loreLines: ['Tracks a counter for each mob killed while worn.', 'Gain +1 Strength for each digit on the counter.']
  },
  // Draconic Family
  {
    id: 'DRACONIC_TALISMAN',
    name: 'Draconic Talisman',
    baseRarity: 'UNCOMMON',
    category: 'Combat',
    familyId: 'draconic',
    tier: 1,
    description: 'Health: +1 Deal 2% bonus damage to Dragons.',
    source: 'Crafting',
    stage: 'Mid Collection',
    iconEmoji: '🐉',
    loreLines: ['Health: +1', 'Deal 2% bonus damage to Dragons.']
  },
  {
    id: 'DRACONIC_RING',
    name: 'Draconic Ring',
    baseRarity: 'RARE',
    category: 'Combat',
    familyId: 'draconic',
    tier: 2,
    description: 'Health: +2 Deal 3% bonus damage to Dragons.',
    source: 'Crafting',
    stage: 'Mid Collection',
    iconEmoji: '🐉',
    loreLines: ['Health: +2', 'Deal 3% bonus damage to Dragons.']
  },
  {
    id: 'DRACONIC_ARTIFACT',
    name: 'Draconic Artifact',
    baseRarity: 'EPIC',
    category: 'Combat',
    familyId: 'draconic',
    tier: 3,
    description: 'Health: +3 Deal 5% bonus damage to Dragons.',
    source: 'Crafting',
    stage: 'High Collection',
    iconEmoji: '🐉',
    loreLines: ['Health: +3', 'Deal 5% bonus damage to Dragons.']
  },
  // Intimidation Family
  {
    id: 'INTIMIDATION_TALISMAN',
    name: 'Intimidation Talisman',
    baseRarity: 'COMMON',
    category: 'Combat',
    familyId: 'intimidation',
    tier: 1,
    description: 'Monsters under Level 1 will not target you.',
    source: 'Julia (10K)',
    npcCost: '10,000 Coins',
    stage: 'NPC Shop',
    iconEmoji: '👿',
    loreLines: ['Monsters under Level 1 will not target you.']
  },
  {
    id: 'INTIMIDATION_RING',
    name: 'Intimidation Ring',
    baseRarity: 'UNCOMMON',
    category: 'Combat',
    familyId: 'intimidation',
    tier: 2,
    description: 'Monsters under Level 5 will not target you.',
    source: 'Terrik (Intimidation Talisman + 100 Green Candy)',
    stage: 'Event',
    iconEmoji: '👿',
    loreLines: ['Monsters under Level 5 will not target you.']
  },
  {
    id: 'INTIMIDATION_ARTIFACT',
    name: 'Intimidation Artifact',
    baseRarity: 'RARE',
    category: 'Combat',
    familyId: 'intimidation',
    tier: 3,
    description: 'Monsters under Level 25 will not target you.',
    source: 'Terrik (Intimidation Ring + 100 Purple Candy)',
    stage: 'Event',
    iconEmoji: '👿',
    loreLines: ['Monsters under Level 25 will not target you.']
  },
  // Fire Talisman (Standalone Common Fire Immunity)
  {
    id: 'FIRE_TALISMAN',
    name: 'Fire Talisman',
    baseRarity: 'COMMON',
    category: 'Combat',
    familyId: 'fire_talisman',
    tier: 1,
    description: 'Provides immunity to Fire.',
    source: 'Crafting (Blaze Rod 5)',
    stage: 'Early Collection',
    iconEmoji: '🔥',
    loreLines: ['Provides immunity to Fire.']
  },
  // Fire Extinguisher / Fire Devourer Family (Damage reduction from Fire mobs)
  {
    id: 'FIRE_EXTINGUISHER',
    name: 'Fire Extinguisher',
    baseRarity: 'RARE',
    category: 'Combat',
    familyId: 'fire_extinguisher',
    tier: 1,
    description: 'Reduces damage you get from Fire mobs by 10%. (Eye of the Cliff, Fire Envoy and Heartigniter)',
    source: 'Crafting',
    stage: 'Mid Collection',
    iconEmoji: '🧯',
    loreLines: ['Reduces damage you get from Fire mobs by 10%.', '(Eye of the Cliff, Fire Envoy and Heartigniter)']
  },
  {
    id: 'FIRE_DEVOURER',
    name: 'Fire Devourer',
    baseRarity: 'EPIC',
    category: 'Combat',
    familyId: 'fire_extinguisher',
    tier: 2,
    description: 'Reduces damage you get from Fire mobs by 20%. (Eye of the Cliff, Fire Envoy and Heartigniter)',
    source: 'Crafting',
    stage: 'High Collection',
    iconEmoji: '🔥',
    loreLines: ['Reduces damage you get from Fire mobs by 20%.', '(Eye of the Cliff, Fire Envoy and Heartigniter)']
  },
  {
    id: 'LAVA_TALISMAN',
    name: 'Lava Talisman',
    baseRarity: 'UNCOMMON',
    category: 'Combat',
    familyId: 'lava',
    tier: 1,
    description: 'Provides immunity to Lava.',
    source: 'Crafting (Magma Cream 7)',
    stage: 'Mid Collection',
    iconEmoji: '🌋',
    loreLines: ['Provides immunity to Lava.']
  }
];
