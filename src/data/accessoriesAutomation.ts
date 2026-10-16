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
