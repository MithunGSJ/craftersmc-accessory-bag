import { PlayerAccessoryItem } from './accessoryTypes.ts';

export interface SampleProfile {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly gamertag: string;
  readonly profileName: string;
  readonly items: readonly PlayerAccessoryItem[];
}

export const SAMPLE_PROFILES: readonly SampleProfile[] = [
  {
    id: 'endgame',
    name: 'Endgame Hypermaxed',
    description: 'Late-game SkyBlock player with high-tier relics, Hegemony Artifact, and enrichments.',
    gamertag: 'DeathWish_99',
    profileName: 'Watermelon',
    items: [
      {
        id: 'HEGEMONY_ARTIFACT_0',
        internalId: 'HEGEMONY_ARTIFACT',
        displayName: 'Hegemony Artifact',
        rarity: 'MYTHIC',
        reforge: 'Shaded',
        enrichment: 'Crit Chance',
        slot: 0,
        lore: ['Sirius Darker Auction artifact.', 'Grants massive Magical Power boost.']
      },
      {
        id: 'WITHER_RELIC_1',
        internalId: 'WITHER_RELIC',
        displayName: 'Wither Relic',
        rarity: 'LEGENDARY',
        reforge: 'Shaded',
        enrichment: 'Attack Speed',
        slot: 1,
        lore: ['Reduce damage taken from', 'Withers by 25%.']
      },
      {
        id: 'ENDER_RELIC_2',
        internalId: 'ENDER_RELIC',
        displayName: 'Ender Relic',
        rarity: 'LEGENDARY',
        reforge: 'Hurtful',
        enrichment: 'Strength',
        slot: 2,
        lore: ['Reduce damage taken from', 'End mobs by 25%.']
      },
      {
        id: 'BAT_ARTIFACT_3',
        internalId: 'BAT_ARTIFACT',
        displayName: 'Bat Artifact',
        rarity: 'LEGENDARY',
        reforge: 'Forceful',
        slot: 3,
        lore: ['Gives +5 Speed and +5 Health.']
      },
      {
        id: 'AUTO_RECOMBOBULATOR_4',
        internalId: 'AUTO_RECOMBOBULATOR',
        displayName: 'Auto Recombobulator',
        rarity: 'LEGENDARY',
        reforge: 'Shaded',
        slot: 4,
        lore: ['1% chance to automatically recombobulate items.']
      },
      {
        id: 'SPIDER_ARTIFACT_5',
        internalId: 'SPIDER_ARTIFACT',
        displayName: 'Spider Artifact',
        rarity: 'EPIC',
        reforge: 'Shaded',
        slot: 5,
        lore: ['Reduce damage taken from Spiders by 15%.']
      },
      {
        id: 'RED_CLAW_ARTIFACT_6',
        internalId: 'RED_CLAW_ARTIFACT',
        displayName: 'Red Claw Artifact',
        rarity: 'EPIC',
        reforge: 'Silky',
        slot: 6,
        lore: ['Grants +5% Critical Damage.']
      },
      {
        id: 'CAMPFIRE_TALISMAN_7',
        internalId: 'CAMPFIRE_TALISMAN',
        displayName: 'Campfire Scion Badge',
        rarity: 'EPIC',
        reforge: 'Sweet',
        slot: 7,
        lore: ['Tier IV Campfire Trial Completion Badge.']
      },
      {
        id: 'MELODYS_HAIR_8',
        internalId: 'MELODYS_HAIR',
        displayName: "Melody's Hair",
        rarity: 'EPIC',
        reforge: 'Bizarre',
        slot: 8,
        lore: ['Awarded by Melody for mastering the harp.']
      },
      {
        id: 'ZOMBIE_ARTIFACT_9',
        internalId: 'ZOMBIE_ARTIFACT',
        displayName: 'Zombie Artifact',
        rarity: 'RARE',
        reforge: 'Shaded',
        slot: 9,
        lore: ['Reduce damage taken from Zombies by 15%.']
      },
      {
        id: 'SPEED_ARTIFACT_10',
        internalId: 'SPEED_ARTIFACT',
        displayName: 'Speed Artifact',
        rarity: 'RARE',
        reforge: 'Shaded',
        slot: 10,
        lore: ['Gives +5 Speed.']
      },
      {
        id: 'FEATHER_ARTIFACT_11',
        internalId: 'FEATHER_ARTIFACT',
        displayName: 'Feather Artifact',
        rarity: 'RARE',
        reforge: 'Shaded',
        slot: 11,
        lore: ['Reduces fall damage by 15%.']
      },
      {
        id: 'MINERAL_TALISMAN_12',
        internalId: 'MINERAL_TALISMAN',
        displayName: 'Mineral Talisman',
        rarity: 'RARE',
        reforge: 'Shaded',
        slot: 12,
        lore: ['Grants +3 Mining Fortune.']
      }
    ]
  },
  {
    id: 'midgame',
    name: 'Midgame Grinder',
    description: 'Active combat player working through Tier II/III accessories and slayers.',
    gamertag: 'SkyCrafter_X',
    profileName: 'Cucumber',
    items: [
      {
        id: 'ZOMBIE_RING_0',
        internalId: 'ZOMBIE_RING',
        displayName: 'Zombie Ring',
        rarity: 'UNCOMMON',
        reforge: 'Itchy',
        slot: 0,
        lore: ['Reduce damage taken from Zombies by 10%.']
      },
      {
        id: 'SPIDER_RING_1',
        internalId: 'SPIDER_RING',
        displayName: 'Spider Ring',
        rarity: 'RARE',
        reforge: 'Itchy',
        slot: 1,
        lore: ['Reduce damage taken from Spiders by 10%.']
      },
      {
        id: 'RED_CLAW_RING_2',
        internalId: 'RED_CLAW_RING',
        displayName: 'Red Claw Ring',
        rarity: 'RARE',
        reforge: 'Forceful',
        slot: 2,
        lore: ['Grants +3% Critical Damage.']
      },
      {
        id: 'FEATHER_RING_3',
        internalId: 'FEATHER_RING',
        displayName: 'Feather Ring',
        rarity: 'UNCOMMON',
        reforge: 'Sweet',
        slot: 3,
        lore: ['Reduces fall damage by 10%.']
      },
      {
        id: 'SPEED_RING_4',
        internalId: 'SPEED_RING',
        displayName: 'Speed Ring',
        rarity: 'UNCOMMON',
        reforge: 'Sweet',
        slot: 4,
        lore: ['Gives +3 Speed.']
      },
      {
        id: 'HEALING_RING_5',
        internalId: 'HEALING_RING',
        displayName: 'Healing Ring',
        rarity: 'UNCOMMON',
        reforge: 'Sweet',
        slot: 5,
        lore: ['Increases natural healing by +10%.']
      },
      {
        id: 'GRAVITY_TALISMAN_6',
        internalId: 'GRAVITY_TALISMAN',
        displayName: 'Gravity Talisman',
        rarity: 'UNCOMMON',
        reforge: 'Forceful',
        slot: 6,
        lore: ['Grants bonus Strength & Defense.']
      },
      {
        id: 'BAT_RING_7',
        internalId: 'BAT_RING',
        displayName: 'Bat Ring',
        rarity: 'EPIC',
        reforge: 'Hurtful',
        slot: 7,
        lore: ['Gives +3 Speed and +3 Health.']
      }
    ]
  },
  {
    id: 'earlygame',
    name: 'Earlygame Adventurer',
    description: 'Starting SkyBlock player with basic collection talismans and hub shop purchases.',
    gamertag: 'NoobMiner12',
    profileName: 'Peach',
    items: [
      {
        id: 'FARMING_TALISMAN_0',
        internalId: 'FARMING_TALISMAN',
        displayName: 'Farming Talisman',
        rarity: 'COMMON',
        slot: 0,
        lore: ['Increases Speed by +10% in farm areas.']
      },
      {
        id: 'VACCINE_TALISMAN_1',
        internalId: 'VACCINE_TALISMAN',
        displayName: 'Vaccine Talisman',
        rarity: 'COMMON',
        slot: 1,
        lore: ['Grants complete immunity to Poison.']
      },
      {
        id: 'SPEED_TALISMAN_2',
        internalId: 'SPEED_TALISMAN',
        displayName: 'Speed Talisman',
        rarity: 'COMMON',
        slot: 2,
        lore: ['Gives +1 Speed.']
      },
      {
        id: 'FEATHER_TALISMAN_3',
        internalId: 'FEATHER_TALISMAN',
        displayName: 'Feather Talisman',
        rarity: 'COMMON',
        slot: 3,
        lore: ['Reduces fall damage by 5%.']
      },
      {
        id: 'ZOMBIE_TALISMAN_4',
        internalId: 'ZOMBIE_TALISMAN',
        displayName: 'Zombie Talisman',
        rarity: 'COMMON',
        slot: 4,
        lore: ['Reduce damage taken from Zombies by 5%.']
      }
    ]
  },
  {
    id: 'fresh',
    name: 'Fresh Profile',
    description: 'Brand new player account with an empty accessory bag (0 accessories owned).',
    gamertag: 'NewCrafter',
    profileName: 'Apple',
    items: []
  }
];
