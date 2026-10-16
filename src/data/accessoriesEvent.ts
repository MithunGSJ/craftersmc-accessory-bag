import { AccessoryDefinition } from './accessoryTypes.ts';

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
