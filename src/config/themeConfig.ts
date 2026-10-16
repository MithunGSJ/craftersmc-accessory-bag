/**
 * Single typed config module for look, feel, rarity tiers, and theme constants.
 */

export type ItemRarity =
  | 'COMMON'
  | 'UNCOMMON'
  | 'RARE'
  | 'EPIC'
  | 'LEGENDARY'
  | 'MYTHIC'
  | 'SPECIAL'
  | 'VERY_SPECIAL';

export interface RarityStyle {
  readonly label: string;
  readonly color: string;
  readonly glow: string;
  readonly bgGradient: string;
  readonly border: string;
  readonly magicalPower: number;
}

export interface AppThemeConfig {
  readonly appTitle: string;
  readonly appSubtitle: string;
  readonly legalDisclaimer: string;
  readonly apiBaseUrl: string;
  readonly rarityMap: Record<ItemRarity, RarityStyle>;
  readonly colors: {
    readonly bgDark: string;
    readonly cardGlass: string;
    readonly cardBorder: string;
    readonly textPrimary: string;
    readonly textSecondary: string;
    readonly textMuted: string;
    readonly accentGold: string;
    readonly accentCyan: string;
    readonly statusOwned: string;
    readonly statusMissing: string;
    readonly statusUpgradable: string;
  };
  readonly audio: {
    readonly enabledDefault: boolean;
    readonly clickFreq: number;
    readonly successFreq: number;
    readonly equipFreq: number;
  };
}

export const THEME_CONFIG: AppThemeConfig = {
  appTitle: 'CraftersMC Accessory Bag & Missing Talismans',
  appSubtitle: 'Audit your SkyBlock accessory bag, discover missing talismans, and maximize your Magical Power (MP).',
  legalDisclaimer:
    'Not affiliated with, endorsed by, or partnered with CraftersMC, TEON CREATIVE, Minecraft, Mojang, Microsoft, or Xbox. Built in strict accordance with the CraftersMC Public API Usage Policy.',
  apiBaseUrl: 'https://api.craftersmc.net',
  rarityMap: {
    COMMON: {
      label: 'Common',
      color: '#FFFFFF',
      glow: 'rgba(255, 255, 255, 0.4)',
      bgGradient: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(20, 24, 33, 0.95) 100%)',
      border: 'rgba(255, 255, 255, 0.25)',
      magicalPower: 3
    },
    UNCOMMON: {
      label: 'Uncommon',
      color: '#55FF55',
      glow: 'rgba(85, 255, 85, 0.45)',
      bgGradient: 'linear-gradient(135deg, rgba(85, 255, 85, 0.1) 0%, rgba(14, 28, 20, 0.95) 100%)',
      border: 'rgba(85, 255, 85, 0.3)',
      magicalPower: 5
    },
    RARE: {
      label: 'Rare',
      color: '#5555FF',
      glow: 'rgba(85, 85, 255, 0.5)',
      bgGradient: 'linear-gradient(135deg, rgba(85, 85, 255, 0.12) 0%, rgba(16, 20, 36, 0.95) 100%)',
      border: 'rgba(85, 85, 255, 0.35)',
      magicalPower: 8
    },
    EPIC: {
      label: 'Epic',
      color: '#AA00AA',
      glow: 'rgba(170, 0, 170, 0.55)',
      bgGradient: 'linear-gradient(135deg, rgba(170, 0, 170, 0.14) 0%, rgba(28, 14, 32, 0.95) 100%)',
      border: 'rgba(170, 0, 170, 0.4)',
      magicalPower: 12
    },
    LEGENDARY: {
      label: 'Legendary',
      color: '#FFAA00',
      glow: 'rgba(255, 170, 0, 0.6)',
      bgGradient: 'linear-gradient(135deg, rgba(255, 170, 0, 0.15) 0%, rgba(36, 26, 12, 0.95) 100%)',
      border: 'rgba(255, 170, 0, 0.45)',
      magicalPower: 16
    },
    MYTHIC: {
      label: 'Mythic',
      color: '#FF55FF',
      glow: 'rgba(255, 85, 255, 0.65)',
      bgGradient: 'linear-gradient(135deg, rgba(255, 85, 255, 0.18) 0%, rgba(38, 16, 38, 0.95) 100%)',
      border: 'rgba(255, 85, 255, 0.5)',
      magicalPower: 22
    },
    SPECIAL: {
      label: 'Special',
      color: '#FF5555',
      glow: 'rgba(255, 85, 85, 0.6)',
      bgGradient: 'linear-gradient(135deg, rgba(255, 85, 85, 0.15) 0%, rgba(38, 14, 16, 0.95) 100%)',
      border: 'rgba(255, 85, 85, 0.45)',
      magicalPower: 3
    },
    VERY_SPECIAL: {
      label: 'Very Special',
      color: '#FF5555',
      glow: 'rgba(255, 85, 85, 0.7)',
      bgGradient: 'linear-gradient(135deg, rgba(255, 85, 85, 0.2) 0%, rgba(42, 12, 14, 0.95) 100%)',
      border: 'rgba(255, 85, 85, 0.55)',
      magicalPower: 5
    }
  },
  colors: {
    bgDark: '#0B0D14',
    cardGlass: 'rgba(18, 22, 34, 0.75)',
    cardBorder: 'rgba(255, 255, 255, 0.08)',
    textPrimary: '#F1F4FA',
    textSecondary: '#9AA4BA',
    textMuted: '#5E667E',
    accentGold: '#FFB800',
    accentCyan: '#00E5FF',
    statusOwned: '#10B981',
    statusMissing: '#EF4444',
    statusUpgradable: '#F59E0B'
  },
  audio: {
    enabledDefault: true,
    clickFreq: 520,
    successFreq: 880,
    equipFreq: 640
  }
};
