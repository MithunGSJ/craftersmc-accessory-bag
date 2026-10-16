import { AccessoryDefinition } from './accessoryTypes.ts';

export const SLAYER_ACCESSORIES: readonly AccessoryDefinition[] = [
  // Slayer Hunter Family (Wolf Slayer)
  {
    id: 'HUNTER_TALISMAN',
    name: 'Hunter Talisman',
    baseRarity: 'UNCOMMON',
    category: 'Slayer',
    familyId: 'hunter',
    tier: 1,
    description: 'Grants +2 Combat Wisdom.',
    source: 'Wolf Slayer Level 6 (Crafting)',
    estimatedCoins: 350000,
    iconEmoji: '🎯',
    loreLines: ['Grants +2 Combat Wisdom.']
  },
  {
    id: 'HUNTER_RING',
    name: 'Hunter Ring',
    baseRarity: 'RARE',
    category: 'Slayer',
    familyId: 'hunter',
    tier: 2,
    description: 'Grants +4 Combat Wisdom.',
    source: 'Wolf Slayer Level 7 (Crafting)',
    estimatedCoins: 1500000,
    iconEmoji: '🎯',
    loreLines: ['Grants +4 Combat Wisdom.']
  },
  // Slayer Red Claw Family (Wolf Slayer)
  {
    id: 'RED_CLAW_TALISMAN',
    name: 'Red Claw Talisman',
    baseRarity: 'UNCOMMON',
    category: 'Slayer',
    familyId: 'red_claw',
    tier: 1,
    description: 'Grants +1% Critical Damage.',
    source: 'Wolf Slayer Level 1 (Crafting)',
    estimatedCoins: 80000,
    iconEmoji: '🐾',
    loreLines: ['Grants +1% Critical Damage.']
  },
  {
    id: 'RED_CLAW_RING',
    name: 'Red Claw Ring',
    baseRarity: 'RARE',
    category: 'Slayer',
    familyId: 'red_claw',
    tier: 2,
    description: 'Grants +3% Critical Damage.',
    source: 'Wolf Slayer Level 5 (Crafting)',
    estimatedCoins: 650000,
    iconEmoji: '🐾',
    loreLines: ['Grants +3% Critical Damage.']
  },
  {
    id: 'RED_CLAW_ARTIFACT',
    name: 'Red Claw Artifact',
    baseRarity: 'EPIC',
    category: 'Slayer',
    familyId: 'red_claw',
    tier: 3,
    description: 'Grants +5% Critical Damage.',
    source: 'Wolf Slayer Level 5 (Crafting)',
    estimatedCoins: 4800000,
    iconEmoji: '🐾',
    loreLines: ['Grants +5% Critical Damage.']
  },
  // Frostclaw & Reaper Slayer Relics
  {
    id: 'FROSTCLAW_RELIC',
    name: 'Frostclaw Relic',
    baseRarity: 'LEGENDARY',
    category: 'Slayer',
    familyId: 'frostclaw',
    tier: 1,
    description: 'Grants +10% Critical Damage and Cold resistance.',
    source: 'Wolf Slayer Level 8 (Crafting)',
    estimatedCoins: 18000000,
    iconEmoji: '❄️',
    loreLines: ['Grants +10% Critical Damage.']
  },
  {
    id: 'REAPER_ORB',
    name: 'Reaper Orb',
    baseRarity: 'LEGENDARY',
    category: 'Slayer',
    familyId: 'reaper_orb',
    tier: 1,
    description: 'Grants +15 Strength and +5% life steal bonus.',
    source: 'Zombie Slayer Level 8 (Crafting)',
    estimatedCoins: 22000000,
    iconEmoji: '🔮',
    loreLines: ['Grants +15 Strength.']
  }
];
