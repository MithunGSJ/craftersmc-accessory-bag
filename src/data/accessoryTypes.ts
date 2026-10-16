import { ItemRarity } from '../config/themeConfig.ts';

export type AccessoryCategory =
  | 'Combat'
  | 'Farming'
  | 'Mining'
  | 'Foraging'
  | 'Fishing'
  | 'Slayer'
  | 'Dungeon'
  | 'Event'
  | 'Misc';

export interface AccessoryDefinition {
  readonly id: string;
  readonly name: string;
  readonly baseRarity: ItemRarity;
  readonly category: AccessoryCategory;
  readonly familyId: string;
  readonly tier: number;
  readonly description: string;
  readonly source: string;
  readonly estimatedCoins: number;
  readonly iconEmoji: string;
  readonly loreLines: readonly string[];
}

export interface PlayerAccessoryItem {
  readonly id: string;
  readonly internalId: string;
  readonly displayName: string;
  readonly rarity: ItemRarity;
  readonly reforge?: string;
  readonly enrichment?: string;
  readonly slot: number;
  readonly lore: readonly string[];
  readonly extraAttributes?: Record<string, string | number | boolean>;
}

export type AccessoryStatus = 'OWNED' | 'MISSING' | 'UPGRADED_PREVIOUS' | 'UPGRADABLE_NEXT';

export interface EvaluatedAccessory {
  readonly definition: AccessoryDefinition;
  readonly status: AccessoryStatus;
  readonly ownedItem?: PlayerAccessoryItem;
  readonly effectiveMagicalPower: number;
  readonly familyMaxTierOwned: number;
  readonly isHighestInFamily: boolean;
  readonly upgradeRecommendation?: {
    readonly nextTierId: string;
    readonly nextTierName: string;
    readonly costCoins: number;
    readonly additionalMp: number;
  };
}
