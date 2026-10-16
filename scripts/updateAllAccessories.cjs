const fs = require('fs');

// 1. COMBAT (17 items)
const combat = `import { AccessoryDefinition } from './accessoryTypes.ts';

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
  // Fire Family & Lava
  {
    id: 'FIRE_TALISMAN',
    name: 'Fire Talisman',
    baseRarity: 'COMMON',
    category: 'Combat',
    familyId: 'fire',
    tier: 1,
    description: 'Provides immunity to Fire.',
    source: 'Crafting (Blaze Rod 5)',
    stage: 'Early Collection',
    iconEmoji: '🔥',
    loreLines: ['Provides immunity to Fire.']
  },
  {
    id: 'FIRE_EXTINGUISHER',
    name: 'Fire Extinguisher',
    baseRarity: 'RARE',
    category: 'Combat',
    familyId: 'fire',
    tier: 2,
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
    familyId: 'fire',
    tier: 3,
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
`;

// 2. SLAYER (7 items)
const slayer = `import { AccessoryDefinition } from './accessoryTypes.ts';

export const SLAYER_ACCESSORIES: readonly AccessoryDefinition[] = [
  // Slayer Hunter Family (Wolf Slayer)
  {
    id: 'HUNTER_TALISMAN',
    name: 'Hunter Talisman',
    baseRarity: 'UNCOMMON',
    category: 'Slayer',
    familyId: 'hunter',
    tier: 1,
    description: 'Combat Wisdom: +2 Requires Wolf Slayer 6.',
    source: 'Crafting (Wolf Slayer 6)',
    stage: 'Slayer',
    iconEmoji: '🎯',
    loreLines: ['Combat Wisdom: +2', 'Requires Wolf Slayer 6.']
  },
  {
    id: 'HUNTER_RING',
    name: 'Hunter Ring',
    baseRarity: 'RARE',
    category: 'Slayer',
    familyId: 'hunter',
    tier: 2,
    description: 'Combat Wisdom: +5 Requires Wolf Slayer 7.',
    source: 'Crafting (Wolf Slayer 7)',
    stage: 'Slayer',
    iconEmoji: '🎯',
    loreLines: ['Combat Wisdom: +5', 'Requires Wolf Slayer 7.']
  },
  // Slayer Red Claw Family (Wolf Slayer)
  {
    id: 'RED_CLAW_TALISMAN',
    name: 'Red Claw Talisman',
    baseRarity: 'UNCOMMON',
    category: 'Slayer',
    familyId: 'red_claw',
    tier: 1,
    description: 'Critical Damage: +1% Requires Wolf Slayer 1.',
    source: 'Crafting (Wolf Slayer 1)',
    stage: 'Slayer',
    iconEmoji: '🐾',
    loreLines: ['Critical Damage: +1%', 'Requires Wolf Slayer 1.']
  },
  {
    id: 'RED_CLAW_RING',
    name: 'Red Claw Ring',
    baseRarity: 'RARE',
    category: 'Slayer',
    familyId: 'red_claw',
    tier: 2,
    description: 'Critical Damage: +3% Requires Wolf Slayer 3.',
    source: 'Crafting (Wolf Slayer 5)',
    stage: 'Slayer',
    iconEmoji: '🐾',
    loreLines: ['Critical Damage: +3%', 'Requires Wolf Slayer 3.']
  },
  {
    id: 'RED_CLAW_ARTIFACT',
    name: 'Red Claw Artifact',
    baseRarity: 'EPIC',
    category: 'Slayer',
    familyId: 'red_claw',
    tier: 3,
    description: 'Critical Damage: +5% Requires Wolf Slayer 5.',
    source: 'Crafting (Wolf Slayer 5)',
    stage: 'Slayer',
    iconEmoji: '🐾',
    loreLines: ['Critical Damage: +5%', 'Requires Wolf Slayer 5.']
  },
  // Frostclaw & Reaper Slayer Relics
  {
    id: 'FROSTCLAW_RELIC',
    name: 'Frostclaw Relic',
    baseRarity: 'LEGENDARY',
    category: 'Slayer',
    familyId: 'frostclaw',
    tier: 1,
    description: 'Critical Damage: +7% Requires Wolf Slayer 7.',
    source: 'Crafting (Wolf Slayer 8)',
    stage: 'Slayer',
    iconEmoji: '❄️',
    loreLines: ['Critical Damage: +7%', 'Requires Wolf Slayer 7.']
  },
  {
    id: 'REAPER_ORB',
    name: 'Reaper Orb',
    baseRarity: 'LEGENDARY',
    category: 'Slayer',
    familyId: 'reaper_orb',
    tier: 1,
    description: 'Gain a stack of 2 Strength for every mob killed in the last 5 seconds. Requires Zombie Slayer 8.',
    source: 'Crafting (Zombie Slayer 8)',
    stage: 'Slayer',
    iconEmoji: '🔮',
    loreLines: ['Gain a stack of 2 Strength for every mob killed in the last 5 seconds.', 'Requires Zombie Slayer 8.']
  }
];
`;

// 3. GATHERING (20 items)
const gathering = `import { AccessoryDefinition } from './accessoryTypes.ts';

export const GATHERING_ACCESSORIES: readonly AccessoryDefinition[] = [
  // Farming Family
  {
    id: 'FARMING_TALISMAN',
    name: 'Farming Talisman',
    baseRarity: 'COMMON',
    category: 'Farming',
    familyId: 'farming',
    tier: 1,
    description: 'Grants +10 Speed while in Harvest Haven.',
    source: 'Crafting (Wheat 4)',
    stage: 'Early Collection',
    iconEmoji: '🌾',
    loreLines: ['Grants +10 Speed while in Harvest Haven.']
  },
  {
    id: 'FARMER_ORB',
    name: 'Farmer Orb',
    baseRarity: 'UNCOMMON',
    category: 'Farming',
    familyId: 'farmer_orb',
    tier: 1,
    description: 'Increases the regrowth rate of nearby crops on the public islands, regrowing an extra crop every 3 seconds.',
    source: 'Crafting (Pumpkin 6)',
    stage: 'Early Collection',
    iconEmoji: '🎃',
    loreLines: ['Increases the regrowth rate of nearby crops on public islands.']
  },
  {
    id: 'VACCINE_TALISMAN',
    name: 'Vaccine Talisman',
    baseRarity: 'COMMON',
    category: 'Farming',
    familyId: 'vaccine',
    tier: 1,
    description: 'Provides immunity to Poison damage.',
    source: 'Crafting (Potato 3)',
    stage: 'Early Collection',
    iconEmoji: '🥔',
    loreLines: ['Provides immunity to Poison damage.']
  },
  {
    id: 'POTATO_TALISMAN',
    name: 'Potato Talisman',
    baseRarity: 'COMMON',
    category: 'Farming',
    familyId: 'potato',
    tier: 1,
    description: 'Speed: +1 Your potato minions farm 5% faster while wearing on your island.',
    source: 'Shiny Orb',
    stage: 'Rare Drop',
    iconEmoji: '🥔',
    loreLines: ['Speed: +1', 'Your potato minions farm 5% faster while wearing on your island.']
  },
  // Bamboo Family
  {
    id: 'BAMBOO_TALISMAN',
    name: 'Bamboo Talisman',
    baseRarity: 'COMMON',
    category: 'Farming',
    familyId: 'bamboo',
    tier: 1,
    description: 'Grants +1 Speed for every log or bamboo you cut in the last 10 seconds.',
    source: 'Crafting (Bamboo 2)',
    stage: 'Early Collection',
    iconEmoji: '🎍',
    loreLines: ['Grants +1 Speed for every log or bamboo you cut in the last 10 seconds.']
  },
  {
    id: 'BAMBOO_RING',
    name: 'Bamboo Ring',
    baseRarity: 'UNCOMMON',
    category: 'Farming',
    familyId: 'bamboo',
    tier: 2,
    description: 'Grants +2 Speed for every log or bamboo you cut in the last 10 seconds.',
    source: 'Crafting (Bamboo 7)',
    stage: 'Mid Collection',
    iconEmoji: '🎍',
    loreLines: ['Grants +2 Speed for every log or bamboo you cut in the last 10 seconds.']
  },
  // Farmionaire Family
  {
    id: 'FARMIONAIRE_TALISMAN',
    name: 'Farmionaire Talisman',
    baseRarity: 'COMMON',
    category: 'Farming',
    familyId: 'farmionaire',
    tier: 1,
    description: "Grants +5 Crop Fortune to a random crop during Ethan's Farming Contest.",
    source: 'Farm-o-Matic',
    stage: 'Event',
    iconEmoji: '🚜',
    loreLines: ["Grants +5 Crop Fortune to a random crop during Ethan's Farming Contest."]
  },
  {
    id: 'FARMIONAIRE_RING',
    name: 'Farmionaire Ring',
    baseRarity: 'UNCOMMON',
    category: 'Farming',
    familyId: 'farmionaire',
    tier: 2,
    description: "Grants +15 Crop Fortune to a random crop during Ethan's Farming Contest.",
    source: 'Farm-o-Matic',
    stage: 'Event',
    iconEmoji: '🚜',
    loreLines: ["Grants +15 Crop Fortune to a random crop during Ethan's Farming Contest."]
  },
  {
    id: 'FARMIONAIRE_ARTIFACT',
    name: 'Farmionaire Artifact',
    baseRarity: 'RARE',
    category: 'Farming',
    familyId: 'farmionaire',
    tier: 3,
    description: "Grants +25 Crop Fortune to a random crop during Ethan's Farming Contest.",
    source: 'Farm-o-Matic',
    stage: 'Event',
    iconEmoji: '🚜',
    loreLines: ["Grants +25 Crop Fortune to a random crop during Ethan's Farming Contest."]
  },
  // Cropie / Squash / Fermento Family
  {
    id: 'CROPIE_TALISMAN',
    name: 'Cropie Talisman',
    baseRarity: 'COMMON',
    category: 'Farming',
    familyId: 'cropie_line',
    tier: 1,
    description: 'Wheat Fortune: +10 Carrot Fortune: +10 Potato Fortune: +10 Beetroot Fortune: +10',
    source: 'Crafting',
    stage: 'Mid Collection',
    iconEmoji: '🌱',
    loreLines: ['Wheat Fortune: +10 Carrot Fortune: +10 Potato Fortune: +10 Beetroot Fortune: +10']
  },
  {
    id: 'SQUASH_RING',
    name: 'Squash Ring',
    baseRarity: 'UNCOMMON',
    category: 'Farming',
    familyId: 'cropie_line',
    tier: 2,
    description: 'Wheat Fortune: +20 Carrot Fortune: +20 Potato Fortune: +20 Melon Fortune: +20 Pumpkin Fortune: +20 Cocoa Beans Fortune: +20 Beetroot Fortune: +20',
    source: 'Crafting',
    stage: 'Mid Collection',
    iconEmoji: '🎃',
    loreLines: ['Fortune bonuses across all crops: +20']
  },
  {
    id: 'FERMENTO_ARTIFACT',
    name: 'Fermento Artifact',
    baseRarity: 'RARE',
    category: 'Farming',
    familyId: 'cropie_line',
    tier: 3,
    description: 'Farming Fortune: +30',
    source: 'Crafting',
    stage: 'High Collection',
    iconEmoji: '🍄',
    loreLines: ['Farming Fortune: +30']
  },
  // Foraging
  {
    id: 'WOOD_AFFINITY_TALISMAN',
    name: 'Wood Affinity Talisman',
    baseRarity: 'UNCOMMON',
    category: 'Foraging',
    familyId: 'wood_affinity',
    tier: 1,
    description: 'Grants +10 Speed while in Graveyard or Forest.',
    source: 'Crafting (Oak Log 8)',
    stage: 'Early Collection',
    iconEmoji: '🪵',
    loreLines: ['Grants +10 Speed while in Graveyard or Forest.']
  },
  // Mining Family
  {
    id: 'MINE_AFFINITY_TALISMAN',
    name: 'Mine Affinity Talisman',
    baseRarity: 'COMMON',
    category: 'Mining',
    familyId: 'mine_affinity',
    tier: 1,
    description: 'Grants +25 Speed while in Mining Islands.',
    source: 'Julia (2.5K)',
    npcCost: '2,500 Coins',
    stage: 'NPC Shop',
    iconEmoji: '⛏️',
    loreLines: ['Grants +25 Speed while in Mining Islands.']
  },
  {
    id: 'MAGNETIC_TALISMAN',
    name: 'Magnetic Talisman',
    baseRarity: 'UNCOMMON',
    category: 'Mining',
    familyId: 'magnetic',
    tier: 1,
    description: 'Increases the item pick up range by 3x.',
    source: 'Crafting (Emerald 3)',
    stage: 'Early Collection',
    iconEmoji: '🧲',
    loreLines: ['Increases the item pick up range by 3x.']
  },
  {
    id: 'GRAVITY_TALISMAN',
    name: 'Gravity Talisman',
    baseRarity: 'UNCOMMON',
    category: 'Mining',
    familyId: 'gravity',
    tier: 1,
    description: 'Grants between +1 and +10 Strength and Defense the closer you are to the center of an island.',
    source: 'Crafting (Obsidian 3)',
    stage: 'Early Collection',
    iconEmoji: '🪐',
    loreLines: ['Grants between +1 and +10 Strength and Defense near island center.']
  },
  {
    id: 'COINS_TALISMAN',
    name: 'Coins Talisman',
    baseRarity: 'COMMON',
    category: 'Mining',
    familyId: 'coins',
    tier: 1,
    description: 'Spawns random coins around you if you are on a public island.',
    source: 'Crafting (Emerald 2)',
    stage: 'Early Collection',
    iconEmoji: '🪙',
    loreLines: ['Spawns random coins around you if you are on a public island.']
  },
  {
    id: 'EMERALD_RING',
    name: 'Emerald Ring',
    baseRarity: 'UNCOMMON',
    category: 'Mining',
    familyId: 'emerald_ring',
    tier: 1,
    description: 'Gives +1 coin every minute.',
    source: 'Crafting (Emerald 5)',
    stage: 'Early Collection',
    iconEmoji: '🟢',
    loreLines: ['Gives +1 coin every minute.']
  },
  // Fishing (Seal of the Seas Family)
  {
    id: 'SEAL_OF_THE_SEAS',
    name: 'Seal of the Seas',
    baseRarity: 'UNCOMMON',
    category: 'Fishing',
    familyId: 'sea_seal',
    tier: 1,
    description: 'Magic Find: +1% Grants +1 coin for every 25 coins you gain from mobs.',
    source: '"Lost Treasures" quest (Steal coins option)',
    stage: 'Quest',
    iconEmoji: '🌊',
    loreLines: ['Magic Find: +1%', 'Grants +1 coin for every 25 coins you gain from mobs.']
  },
  {
    id: 'SEAL_OF_THE_OCEANS',
    name: 'Seal of the Oceans',
    baseRarity: 'RARE',
    category: 'Fishing',
    familyId: 'sea_seal',
    tier: 2,
    description: 'Magic Find: +1% Grants +1 coin for every 25 coins you gain from mobs.',
    source: '"Lost Treasures" quest (Honest option)',
    stage: 'Quest',
    iconEmoji: '🌊',
    loreLines: ['Magic Find: +1%', 'Grants +1 coin for every 25 coins you gain from mobs.']
  }
];
`;

// 4. EVENT (12 items)
const event = `import { AccessoryDefinition } from './accessoryTypes.ts';

export const EVENT_ACCESSORIES: readonly AccessoryDefinition[] = [
  // Bat Line (Spooky Festival)
  {
    id: 'BAT_TALISMAN',
    name: 'Bat Talisman',
    baseRarity: 'UNCOMMON',
    category: 'Event',
    familyId: 'bat',
    tier: 1,
    description: "Grants +2 Health, +1 Intelligence, and +1 Speed to the player.",
    source: "Dropped from Witch's Bat (Crazy Witch in Spooky Festival)",
    stage: 'Event',
    iconEmoji: '🦇',
    loreLines: ['Health: +2, Intelligence: +1, Speed: +1']
  },
  {
    id: 'BAT_RING',
    name: 'Bat Ring',
    baseRarity: 'RARE',
    category: 'Event',
    familyId: 'bat',
    tier: 2,
    description: "Grants +3 Health, +2 Intelligence, and +2 Speed to the player.",
    source: 'Terrik (Bat Talisman + 64 Green Candy)',
    stage: 'Event',
    iconEmoji: '🦇',
    loreLines: ['Health: +3, Intelligence: +2, Speed: +2']
  },
  {
    id: 'BAT_ARTIFACT',
    name: 'Bat Artifact',
    baseRarity: 'EPIC',
    category: 'Event',
    familyId: 'bat',
    tier: 3,
    description: "Grants +5 Health, +3 Intelligence, and +3 Speed to the player.",
    source: 'Terrik (Bat Ring + 64 Purple Candy)',
    stage: 'Event',
    iconEmoji: '🦇',
    loreLines: ['Health: +5, Intelligence: +3, Speed: +3']
  },
  // Bat Person Line
  {
    id: 'BAT_PERSON_TALISMAN',
    name: 'Bat Person Talisman',
    baseRarity: 'COMMON',
    category: 'Event',
    familyId: 'bat_person',
    tier: 1,
    description: "Grants +2 Strength, +2 Defense, and +2 Intelligence for every bat summoned.",
    source: 'Trick or Treat Chest (1.04% chance)',
    stage: 'Event',
    iconEmoji: '🦇',
    loreLines: ['Grants +2 Strength, +2 Defense, +2 Intelligence for every bat summoned.']
  },
  {
    id: 'BAT_PERSON_RING',
    name: 'Bat Person Ring',
    baseRarity: 'UNCOMMON',
    category: 'Event',
    familyId: 'bat_person',
    tier: 2,
    description: "Grants +3 Strength, +3 Defense, and +3 Intelligence for every bat summoned.",
    source: 'Terrik (Bat Person Talisman + 64 Green Candy)',
    stage: 'Event',
    iconEmoji: '🦇',
    loreLines: ['Grants +3 Strength, +3 Defense, +3 Intelligence for every bat summoned.']
  },
  {
    id: 'BAT_PERSON_ARTIFACT',
    name: 'Bat Person Artifact',
    baseRarity: 'RARE',
    category: 'Event',
    familyId: 'bat_person',
    tier: 3,
    description: "Grants +5 Strength, +5 Defense, and +5 Intelligence for every bat summoned.",
    source: 'Terrik (Bat Person Ring + 64 Purple Candy)',
    stage: 'Event',
    iconEmoji: '🦇',
    loreLines: ['Grants +5 Strength, +5 Defense, +5 Intelligence for every bat summoned.']
  },
  // Candy Line
  {
    id: 'CANDY_TALISMAN',
    name: 'Candy Talisman',
    baseRarity: 'UNCOMMON',
    category: 'Event',
    familyId: 'candy',
    tier: 1,
    description: 'Increases the drop chance of Green Candy and Purple Candy by +5% during Spooky Festival.',
    source: 'Terrik (16 Green Candy)',
    stage: 'Event',
    iconEmoji: '🍬',
    loreLines: ['+5% Green & Purple Candy drop chance during Spooky Festival.']
  },
  {
    id: 'CANDY_RING',
    name: 'Candy Ring',
    baseRarity: 'RARE',
    category: 'Event',
    familyId: 'candy',
    tier: 2,
    description: 'Increases the drop chance of Green Candy and Purple Candy by +10% during Spooky Festival.',
    source: 'Terrik (Candy Talisman + 64 Green Candy)',
    stage: 'Event',
    iconEmoji: '🍬',
    loreLines: ['+10% Green & Purple Candy drop chance during Spooky Festival.']
  },
  {
    id: 'CANDY_ARTIFACT',
    name: 'Candy Artifact',
    baseRarity: 'EPIC',
    category: 'Event',
    familyId: 'candy',
    tier: 3,
    description: 'Increases the drop chance of Green Candy and Purple Candy by +15% during Spooky Festival.',
    source: 'Terrik (Candy Ring + 32 Purple Candy)',
    stage: 'Event',
    iconEmoji: '🍬',
    loreLines: ['+15% Green & Purple Candy drop chance during Spooky Festival.']
  },
  {
    id: 'CANDY_RELIC',
    name: 'Candy Relic',
    baseRarity: 'LEGENDARY',
    category: 'Event',
    familyId: 'candy',
    tier: 4,
    description: 'Increases the drop chance of Green Candy and Purple Candy by +20% during Spooky Festival.',
    source: 'Terrik (Candy Artifact + 64 Purple Candy)',
    stage: 'Event',
    iconEmoji: '🍬',
    loreLines: ['+20% Green & Purple Candy drop chance during Spooky Festival.']
  },
  // Cake Items
  {
    id: 'NEW_YEARS_CAKE_BAG',
    name: "New Year's Cake Bag",
    baseRarity: 'UNCOMMON',
    category: 'Event',
    familyId: 'cake_bag',
    tier: 1,
    description: 'Health: +0 Holds New Year Cakes. Each unique New Year Cake in this bag grants you +1 Health.',
    source: 'North (250K)',
    npcCost: '250,000 Coins',
    stage: 'NPC Shop',
    iconEmoji: '🎂',
    loreLines: ['Health: +0 Holds New Year Cakes.', 'Each unique New Year Cake in this bag grants you +1 Health.']
  },
  {
    id: 'CAKE_SLICE',
    name: 'Cake Slice',
    baseRarity: 'RARE',
    category: 'Event',
    familyId: 'cake_slice',
    tier: 1,
    description: 'Speed: +3',
    source: '"Half-Baked Duo" quest',
    stage: 'Quest',
    iconEmoji: '🍰',
    loreLines: ['Speed: +3', '"Half-Baked Duo" quest reward.']
  }
];
`;

// 5. AUTOMATION (8 items)
const automation = `import { AccessoryDefinition } from './accessoryTypes.ts';

export const AUTOMATION_ACCESSORIES: readonly AccessoryDefinition[] = [
  // Personal Compactor Family
  {
    id: 'PERSONAL_COMPACTOR_4000',
    name: 'Personal Compactor 4000',
    baseRarity: 'UNCOMMON',
    category: 'Misc',
    familyId: 'personal_compactor',
    tier: 1,
    description: 'Automatically transforms certain materials in your inventory into enchanted or block forms. This item has 1 configurable slots.',
    source: 'Crafting (Redstone 9)',
    stage: 'High Collection',
    iconEmoji: '⚙️',
    loreLines: ['Automatically compacts materials.', '1 configurable slot.']
  },
  {
    id: 'PERSONAL_COMPACTOR_5000',
    name: 'Personal Compactor 5000',
    baseRarity: 'RARE',
    category: 'Misc',
    familyId: 'personal_compactor',
    tier: 2,
    description: 'Automatically transforms certain materials in your inventory into enchanted or block forms. This item has 3 configurable slots.',
    source: 'Crafting (Redstone 11)',
    stage: 'High Collection',
    iconEmoji: '⚙️',
    loreLines: ['Automatically compacts materials.', '3 configurable slots.']
  },
  {
    id: 'PERSONAL_COMPACTOR_6000',
    name: 'Personal Compactor 6000',
    baseRarity: 'EPIC',
    category: 'Misc',
    familyId: 'personal_compactor',
    tier: 3,
    description: 'Automatically transforms certain materials in your inventory into enchanted or block forms. This item has 7 configurable slots.',
    source: 'Crafting (Redstone 13)',
    stage: 'High Collection',
    iconEmoji: '⚙️',
    loreLines: ['Automatically compacts materials.', '7 configurable slots.']
  },
  {
    id: 'PERSONAL_COMPACTOR_7000',
    name: 'Personal Compactor 7000',
    baseRarity: 'LEGENDARY',
    category: 'Misc',
    familyId: 'personal_compactor',
    tier: 4,
    description: 'Automatically transforms certain materials in your inventory into enchanted or block forms. This item has 12 configurable slots.',
    source: 'Crafting (Redstone 14)',
    stage: 'High Collection',
    iconEmoji: '⚙️',
    loreLines: ['Automatically compacts materials.', '12 configurable slots.']
  },
  // Personal Deletor Family
  {
    id: 'PERSONAL_DELETOR_4000',
    name: 'Personal Deletor 4000',
    baseRarity: 'UNCOMMON',
    category: 'Misc',
    familyId: 'personal_deletor',
    tier: 1,
    description: 'Automatically deletes the selected items on pickup. This item has 1 configurable slots.',
    source: 'Crafting (Iron Ingot 9)',
    stage: 'High Collection',
    iconEmoji: '🗑️',
    loreLines: ['Automatically deletes selected items on pickup.', '1 configurable slot.']
  },
  {
    id: 'PERSONAL_DELETOR_5000',
    name: 'Personal Deletor 5000',
    baseRarity: 'RARE',
    category: 'Misc',
    familyId: 'personal_deletor',
    tier: 2,
    description: 'Automatically deletes the selected items on pickup. This item has 3 configurable slots.',
    source: 'Crafting (Iron Ingot 10)',
    stage: 'High Collection',
    iconEmoji: '🗑️',
    loreLines: ['Automatically deletes selected items on pickup.', '3 configurable slots.']
  },
  {
    id: 'PERSONAL_DELETOR_6000',
    name: 'Personal Deletor 6000',
    baseRarity: 'EPIC',
    category: 'Misc',
    familyId: 'personal_deletor',
    tier: 3,
    description: 'Automatically deletes the selected items on pickup. This item has 7 configurable slots.',
    source: 'Crafting (Iron Ingot 11)',
    stage: 'High Collection',
    iconEmoji: '🗑️',
    loreLines: ['Automatically deletes selected items on pickup.', '7 configurable slots.']
  },
  {
    id: 'PERSONAL_DELETOR_7000',
    name: 'Personal Deletor 7000',
    baseRarity: 'LEGENDARY',
    category: 'Misc',
    familyId: 'personal_deletor',
    tier: 4,
    description: 'Automatically deletes the selected items on pickup. This item has 12 configurable slots.',
    source: 'Crafting (Iron Ingot 12)',
    stage: 'High Collection',
    iconEmoji: '🗑️',
    loreLines: ['Automatically deletes selected items on pickup.', '12 configurable slots.']
  }
];
`;

// 6. SPECIAL (21 items)
const special = `import { AccessoryDefinition } from './accessoryTypes.ts';

export const SPECIAL_ACCESSORIES: readonly AccessoryDefinition[] = [
  // Campfire Badges
  {
    id: 'CAMPFIRE_INITIATE_BADGE',
    name: 'Campfire Initiate Badge',
    baseRarity: 'COMMON',
    category: 'Misc',
    familyId: 'campfire',
    tier: 1,
    description: 'Regenerates 8~12 health per second while burning.',
    source: '"Trial of Fire" quest',
    stage: 'Quest',
    iconEmoji: '🔥',
    loreLines: ['Regenerates 8~12 health per second while burning.']
  },
  {
    id: 'CAMPFIRE_ADEPT_BADGE',
    name: 'Campfire Adept Badge',
    baseRarity: 'UNCOMMON',
    category: 'Misc',
    familyId: 'campfire',
    tier: 2,
    description: 'Regenerates 14~20 health per second while burning.',
    source: '"Trial of Fire" quest',
    stage: 'Quest',
    iconEmoji: '🔥',
    loreLines: ['Regenerates 14~20 health per second while burning.']
  },
  {
    id: 'CAMPFIRE_CULTIST_BADGE',
    name: 'Campfire Cultist Badge',
    baseRarity: 'RARE',
    category: 'Misc',
    familyId: 'campfire',
    tier: 3,
    description: 'Regenerates 22~46 health per second while burning.',
    source: '"Trial of Fire" quest',
    stage: 'Quest',
    iconEmoji: '🔥',
    loreLines: ['Regenerates 22~46 health per second while burning.']
  },
  {
    id: 'CAMPFIRE_SCION_BADGE',
    name: 'Campfire Scion Badge',
    baseRarity: 'EPIC',
    category: 'Misc',
    familyId: 'campfire',
    tier: 4,
    description: 'Regenerates 32 health per second while burning.',
    source: '"Trial of Fire" quest',
    stage: 'Quest',
    iconEmoji: '🔥',
    loreLines: ['Regenerates 32 health per second while burning.']
  },
  {
    id: 'CAMPFIRE_GOD_BADGE',
    name: 'Campfire God Badge',
    baseRarity: 'LEGENDARY',
    category: 'Misc',
    familyId: 'campfire',
    tier: 5,
    description: 'Regenerates 48~64 health per second while burning. Also regenerates 7~15 health per second.',
    source: '"Trial of Fire" quest',
    stage: 'Quest',
    iconEmoji: '🔥',
    loreLines: [
      'Regenerates 48~64 health per second while burning.',
      'Also regenerates 7~15 health per second.'
    ]
  },
  // Feather Line
  {
    id: 'FEATHER_TALISMAN',
    name: 'Feather Talisman',
    baseRarity: 'COMMON',
    category: 'Misc',
    familyId: 'feather',
    tier: 1,
    description: 'Increases the minimum height to take fall damage by 5 blocks.',
    source: 'Crafting (Feather 4)',
    stage: 'Early Collection',
    iconEmoji: '🪶',
    loreLines: ['Increases the minimum height to take fall damage by 5 blocks.']
  },
  {
    id: 'FEATHER_RING',
    name: 'Feather Ring',
    baseRarity: 'UNCOMMON',
    category: 'Misc',
    familyId: 'feather',
    tier: 2,
    description: 'Increases how high you can fall before taking fall damage by 7 blocks, and reduces fall damage by 5%.',
    source: 'Crafting (Feather 7)',
    stage: 'Mid Collection',
    iconEmoji: '🪶',
    loreLines: ['Increases fall height by 7 blocks and reduces fall damage by 5%.']
  },
  {
    id: 'FEATHER_ARTIFACT',
    name: 'Feather Artifact',
    baseRarity: 'RARE',
    category: 'Misc',
    familyId: 'feather',
    tier: 3,
    description: 'Increases how high you can fall before taking fall damage by 10 blocks, and reduces fall damage by 15%.',
    source: 'Crafting (Feather 9)',
    stage: 'High Collection',
    iconEmoji: '🪶',
    loreLines: ['Increases fall height by 10 blocks and reduces fall damage by 15%.']
  },
  {
    id: 'GOLDEN_FEATHER_BOOTS',
    name: 'Golden Feather Boots',
    baseRarity: 'LEGENDARY',
    category: 'Misc',
    familyId: 'golden_feather_boots',
    tier: 1,
    description: 'Grants 10 seconds of slow falling while falling from more than 6 blocks. (effect is disabled while sneaking) Also negates fall damage.',
    source: 'Crafting (Feather 9)',
    stage: 'High Collection',
    iconEmoji: '🪶',
    loreLines: [
      'Grants 10 seconds of slow falling when falling >6 blocks.',
      '(effect is disabled while sneaking) Also negates fall damage.'
    ]
  },
  // Speed Line
  {
    id: 'SPEED_TALISMAN',
    name: 'Speed Talisman',
    baseRarity: 'COMMON',
    category: 'Misc',
    familyId: 'speed',
    tier: 1,
    description: 'Speed: +1',
    source: 'Crafting (Sugar Cane 2)',
    stage: 'Early Collection',
    iconEmoji: '⚡',
    loreLines: ['Speed: +1']
  },
  {
    id: 'SPEED_RING',
    name: 'Speed Ring',
    baseRarity: 'UNCOMMON',
    category: 'Misc',
    familyId: 'speed',
    tier: 2,
    description: 'Speed: +3',
    source: 'Crafting (Sugar Cane 5)',
    stage: 'Early Collection',
    iconEmoji: '⚡',
    loreLines: ['Speed: +3']
  },
  {
    id: 'SPEED_ARTIFACT',
    name: 'Speed Artifact',
    baseRarity: 'RARE',
    category: 'Misc',
    familyId: 'speed',
    tier: 3,
    description: 'Speed: +5',
    source: 'Crafting (Sugar Cane 8)',
    stage: 'Mid Collection',
    iconEmoji: '⚡',
    loreLines: ['Speed: +5']
  },
  // Utility & Unique
  {
    id: 'NIGHT_VISION_CHARM',
    name: 'Night Vision Charm',
    baseRarity: 'COMMON',
    category: 'Misc',
    familyId: 'night_vision',
    tier: 1,
    description: 'Grants Night Vision while in inventory or Accessory Bag.',
    source: 'Crafting (Mushroom 7)',
    stage: 'Mid Collection',
    iconEmoji: '👁️',
    loreLines: ['Grants Night Vision while in inventory or Accessory Bag.']
  },
  {
    id: 'SCAVENGER_TALISMAN',
    name: 'Scavenger Talisman',
    baseRarity: 'COMMON',
    category: 'Misc',
    familyId: 'scavenger',
    tier: 1,
    description: 'Grants extra coins on mob kills.',
    source: 'Julia (10K)',
    npcCost: '10,000 Coins',
    stage: 'NPC Shop',
    iconEmoji: '💰',
    loreLines: ['Grants extra coins on mob kills.']
  },
  {
    id: 'VILLAGE_AFFINITY_TALISMAN',
    name: 'Village Affinity Talisman',
    baseRarity: 'COMMON',
    category: 'Misc',
    familyId: 'village_affinity',
    tier: 1,
    description: 'Grants +10 Speed while in Village.',
    source: 'Julia (2K)',
    npcCost: '2,000 Coins',
    stage: 'NPC Shop',
    iconEmoji: '🏘️',
    loreLines: ['Grants +10 Speed while in Village.']
  },
  {
    id: 'PIGGY_BANK',
    name: 'Piggy Bank',
    baseRarity: 'UNCOMMON',
    category: 'Misc',
    familyId: 'piggy_bank',
    tier: 1,
    description: 'Saves your coins on death. Works only when in player inventory. Triggers when losing 20,000+ coins',
    source: 'Crafting (Raw Porkchop 5)',
    stage: 'Early Collection',
    iconEmoji: '🐷',
    loreLines: ['Saves your coins on death. Works only in inventory.', 'Triggers when losing 20,000+ coins.']
  },
  {
    id: 'PIGS_FOOT',
    name: "Pig's Foot",
    baseRarity: 'RARE',
    category: 'Misc',
    familyId: 'pigs_foot',
    tier: 1,
    description: 'Speed: +1',
    source: 'Fynn ("Ender Node Hunt" quest)',
    stage: 'Quest',
    iconEmoji: '🐾',
    loreLines: ['Speed: +1']
  },
  {
    id: 'EXPERIENCE_ARTIFACT',
    name: 'Experience Artifact',
    baseRarity: 'EPIC',
    category: 'Misc',
    familyId: 'experience',
    tier: 1,
    description: 'Every single experience orb grants 25% more XP.',
    source: 'Crafting (Lapis Lazuli 9)',
    stage: 'High Collection',
    iconEmoji: '✨',
    loreLines: ['Every single experience orb grants 25% more XP.']
  },
  {
    id: 'DAYFREEZER',
    name: 'Dayfreezer',
    baseRarity: 'LEGENDARY',
    category: 'Misc',
    familyId: 'dayfreezer',
    tier: 1,
    description: 'Makes the time always seen as day while in inventory or accessory bag.',
    source: 'Zoe (945)',
    npcCost: '945 Bits',
    stage: 'NPC Shop',
    iconEmoji: '☀️',
    loreLines: ['Makes the time always seen as day while in inventory or accessory bag.']
  },
  {
    id: 'NIGHTFREEZER',
    name: 'Nightfreezer',
    baseRarity: 'LEGENDARY',
    category: 'Misc',
    familyId: 'nightfreezer',
    tier: 1,
    description: 'Makes the time always seen as night while in inventory or accessory bag.',
    source: 'Zoe (945)',
    npcCost: '945 Bits',
    stage: 'NPC Shop',
    iconEmoji: '🌙',
    loreLines: ['Makes the time always seen as night while in inventory or accessory bag.']
  },
  {
    id: 'SKYS_BADGE',
    name: "Sky's Badge",
    baseRarity: 'LEGENDARY',
    category: 'Misc',
    familyId: 'skys_badge',
    tier: 1,
    description: 'Health: +10 Pet Luck: +1',
    source: 'Sky (21.5M)',
    npcCost: '21,500,000 Coins',
    stage: 'NPC Shop',
    iconEmoji: '🌟',
    loreLines: ['Health: +10 Pet Luck: +1']
  }
];
`;

fs.writeFileSync('src/data/accessoriesCombat.ts', combat);
fs.writeFileSync('src/data/accessoriesSlayer.ts', slayer);
fs.writeFileSync('src/data/accessoriesGathering.ts', gathering);
fs.writeFileSync('src/data/accessoriesEvent.ts', event);
fs.writeFileSync('src/data/accessoriesAutomation.ts', automation);
fs.writeFileSync('src/data/accessoriesSpecial.ts', special);

console.log('All 6 files successfully updated!');
