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
    description: 'Gives +1 Speed and +1 Health.',
    source: 'Spooky Festival Bat Piñata / Spooky Shop',
    estimatedCoins: 280000,
    iconEmoji: '🦇',
    loreLines: ['Gives +1 Speed and +1 Health.']
  },
  {
    id: 'BAT_RING',
    name: 'Bat Ring',
    baseRarity: 'RARE',
    category: 'Event',
    familyId: 'bat',
    tier: 2,
    description: 'Gives +3 Speed and +3 Health.',
    source: 'Crafting: Bat Talisman + 64 Green Candy',
    estimatedCoins: 1800000,
    iconEmoji: '🦇',
    loreLines: ['Gives +3 Speed and +3 Health.']
  },
  {
    id: 'BAT_ARTIFACT',
    name: 'Bat Artifact',
    baseRarity: 'EPIC',
    category: 'Event',
    familyId: 'bat',
    tier: 3,
    description: 'Gives +5 Speed and +5 Health.',
    source: 'Crafting: Bat Ring + 64 Purple Candy',
    estimatedCoins: 9500000,
    iconEmoji: '🦇',
    loreLines: ['Gives +5 Speed and +5 Health.']
  },
  // Bat Person Line
  {
    id: 'BAT_PERSON_TALISMAN',
    name: 'Bat Person Talisman',
    baseRarity: 'COMMON',
    category: 'Event',
    familyId: 'bat_person',
    tier: 1,
    description: 'Increases stats of Bat Pet by +10%.',
    source: 'Spooky Festival Event Drop',
    estimatedCoins: 75000,
    iconEmoji: '🦇',
    loreLines: ['Increases Bat Pet stats.']
  },
  {
    id: 'BAT_PERSON_RING',
    name: 'Bat Person Ring',
    baseRarity: 'UNCOMMON',
    category: 'Event',
    familyId: 'bat_person',
    tier: 2,
    description: 'Increases stats of Bat Pet by +20%.',
    source: 'Spooky Festival Crafting',
    estimatedCoins: 350000,
    iconEmoji: '🦇',
    loreLines: ['Increases Bat Pet stats by +20%.']
  },
  {
    id: 'BAT_PERSON_ARTIFACT',
    name: 'Bat Person Artifact',
    baseRarity: 'RARE',
    category: 'Event',
    familyId: 'bat_person',
    tier: 3,
    description: 'Increases stats of Bat Pet by +30%.',
    source: 'Spooky Festival High Crafting',
    estimatedCoins: 2200000,
    iconEmoji: '🦇',
    loreLines: ['Increases Bat Pet stats by +30%.']
  },
  // Candy Line
  {
    id: 'CANDY_TALISMAN',
    name: 'Candy Talisman',
    baseRarity: 'UNCOMMON',
    category: 'Event',
    familyId: 'candy',
    tier: 1,
    description: 'Increases candy drop chance by +5% during Spooky Festival.',
    source: 'Spooky Festival Shop (16 Green Candy)',
    estimatedCoins: 50000,
    iconEmoji: '🍬',
    loreLines: ['+5% Candy drop chance.']
  },
  {
    id: 'CANDY_RING',
    name: 'Candy Ring',
    baseRarity: 'RARE',
    category: 'Event',
    familyId: 'candy',
    tier: 2,
    description: 'Increases candy drop chance by +10% during Spooky Festival.',
    source: 'Crafting: Candy Talisman + 64 Green Candy',
    estimatedCoins: 450000,
    iconEmoji: '🍬',
    loreLines: ['+10% Candy drop chance.']
  },
  {
    id: 'CANDY_ARTIFACT',
    name: 'Candy Artifact',
    baseRarity: 'EPIC',
    category: 'Event',
    familyId: 'candy',
    tier: 3,
    description: 'Increases candy drop chance by +15% during Spooky Festival.',
    source: 'Crafting: Candy Ring + 32 Purple Candy',
    estimatedCoins: 3500000,
    iconEmoji: '🍬',
    loreLines: ['+15% Candy drop chance.']
  },
  {
    id: 'CANDY_RELIC',
    name: 'Candy Relic',
    baseRarity: 'LEGENDARY',
    category: 'Event',
    familyId: 'candy',
    tier: 4,
    description: 'Increases candy drop chance by +20% during Spooky Festival.',
    source: 'Crafting: Candy Artifact + 1024 Purple Candy',
    estimatedCoins: 16000000,
    iconEmoji: '🍬',
    loreLines: ['+20% Candy drop chance.']
  },
  // Cake Items
  {
    id: 'NEW_YEARS_CAKE_BAG',
    name: "New Year's Cake Bag",
    baseRarity: 'UNCOMMON',
    category: 'Event',
    familyId: 'cake_bag',
    tier: 1,
    description: 'Stores New Year Cakes. Grants +1 Health per unique cake stored.',
    source: 'North NPC (Hub) - 250,000 Coins',
    estimatedCoins: 250000,
    iconEmoji: '🎂',
    loreLines: ['Stores New Year Cakes for +Health.']
  },
  {
    id: 'CAKE_SLICE',
    name: 'Cake Slice',
    baseRarity: 'RARE',
    category: 'Event',
    familyId: 'cake_slice',
    tier: 1,
    description: 'Delicious cake slice granting permanent stat bonuses.',
    source: '"Half-Baked Duo" Quest Reward',
    estimatedCoins: 450000,
    iconEmoji: '🍰',
    loreLines: ['"Half-Baked Duo" Quest reward.']
  }
];
