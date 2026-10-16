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
