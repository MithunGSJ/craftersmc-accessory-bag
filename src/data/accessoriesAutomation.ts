import { AccessoryDefinition } from './accessoryTypes.ts';

export const AUTOMATION_ACCESSORIES: readonly AccessoryDefinition[] = [
  // Personal Compactor Family
  {
    id: 'PERSONAL_COMPACTOR_4000',
    name: 'Personal Compactor 4000',
    baseRarity: 'UNCOMMON',
    category: 'Misc',
    familyId: 'personal_compactor',
    tier: 1,
    description: 'Automatically compacts 1 item type into enchanted form.',
    source: 'Redstone Collection IX (Crafting)',
    estimatedCoins: 120000,
    iconEmoji: '⚙️',
    loreLines: ['Compacts 1 configured item.']
  },
  {
    id: 'PERSONAL_COMPACTOR_5000',
    name: 'Personal Compactor 5000',
    baseRarity: 'RARE',
    category: 'Misc',
    familyId: 'personal_compactor',
    tier: 2,
    description: 'Automatically compacts up to 3 item types.',
    source: 'Redstone Collection XI (Crafting)',
    estimatedCoins: 450000,
    iconEmoji: '⚙️',
    loreLines: ['Compacts up to 3 configured items.']
  },
  {
    id: 'PERSONAL_COMPACTOR_6000',
    name: 'Personal Compactor 6000',
    baseRarity: 'EPIC',
    category: 'Misc',
    familyId: 'personal_compactor',
    tier: 3,
    description: 'Automatically compacts up to 7 item types.',
    source: 'Redstone Collection XIII (Crafting)',
    estimatedCoins: 1800000,
    iconEmoji: '⚙️',
    loreLines: ['Compacts up to 7 configured items.']
  },
  {
    id: 'PERSONAL_COMPACTOR_7000',
    name: 'Personal Compactor 7000',
    baseRarity: 'LEGENDARY',
    category: 'Misc',
    familyId: 'personal_compactor',
    tier: 4,
    description: 'Automatically compacts up to 12 item types.',
    source: 'Redstone Collection XIV (Crafting)',
    estimatedCoins: 7500000,
    iconEmoji: '⚙️',
    loreLines: ['Compacts up to 12 configured items.']
  },
  // Personal Deletor Family
  {
    id: 'PERSONAL_DELETOR_4000',
    name: 'Personal Deletor 4000',
    baseRarity: 'UNCOMMON',
    category: 'Misc',
    familyId: 'personal_deletor',
    tier: 1,
    description: 'Automatically deletes 1 junk item type on pickup.',
    source: 'Iron Ingot Collection IX (Crafting)',
    estimatedCoins: 85000,
    iconEmoji: '🗑️',
    loreLines: ['Deletes 1 configured item.']
  },
  {
    id: 'PERSONAL_DELETOR_5000',
    name: 'Personal Deletor 5000',
    baseRarity: 'RARE',
    category: 'Misc',
    familyId: 'personal_deletor',
    tier: 2,
    description: 'Automatically deletes up to 3 junk item types.',
    source: 'Iron Ingot Collection X (Crafting)',
    estimatedCoins: 350000,
    iconEmoji: '🗑️',
    loreLines: ['Deletes up to 3 configured items.']
  },
  {
    id: 'PERSONAL_DELETOR_6000',
    name: 'Personal Deletor 6000',
    baseRarity: 'EPIC',
    category: 'Misc',
    familyId: 'personal_deletor',
    tier: 3,
    description: 'Automatically deletes up to 7 junk item types.',
    source: 'Iron Ingot Collection XI (Crafting)',
    estimatedCoins: 1500000,
    iconEmoji: '🗑️',
    loreLines: ['Deletes up to 7 configured items.']
  },
  {
    id: 'PERSONAL_DELETOR_7000',
    name: 'Personal Deletor 7000',
    baseRarity: 'LEGENDARY',
    category: 'Misc',
    familyId: 'personal_deletor',
    tier: 4,
    description: 'Automatically deletes up to 12 junk item types.',
    source: 'Iron Ingot Collection XII (Crafting)',
    estimatedCoins: 6500000,
    iconEmoji: '🗑️',
    loreLines: ['Deletes up to 12 configured items.']
  }
];
