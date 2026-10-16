import { PlayerAccessoryItem } from './accessoryTypes.ts';
import { ItemRarity } from '../config/themeConfig.ts';

export interface SampleProfile {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly gamertag: string;
  readonly profileName: string;
  readonly items: readonly PlayerAccessoryItem[];
}

function makeItem(
  internalId: string,
  displayName: string,
  rarity: ItemRarity,
  slot: number,
  reforge?: string
): PlayerAccessoryItem {
  return {
    id: `${internalId}_${slot}`,
    internalId,
    displayName,
    rarity,
    slot,
    reforge,
    lore: [displayName]
  };
}

export const SAMPLE_PROFILES: readonly SampleProfile[] = [
  {
    id: 'endgame',
    name: 'DarkKing0098994 (Dragonfruit)',
    description: 'Active CraftersMC endgame player with 43 authentic accessories, high slayers, and max compactor.',
    gamertag: 'DarkKing0098994',
    profileName: 'Dragonfruit',
    items: [
      makeItem('DAYFREEZER', 'Dayfreezer', 'LEGENDARY', 0),
      makeItem('NIGHTFREEZER', 'Nightfreezer', 'LEGENDARY', 1),
      makeItem('CAMPFIRE_GOD_BADGE', 'Campfire God Badge', 'LEGENDARY', 2),
      makeItem('PERSONAL_COMPACTOR_7000', 'Personal Compactor 7000', 'LEGENDARY', 3, 'Pleasant'),
      makeItem('PERSONAL_DELETOR_7000', 'Personal Deletor 7000', 'LEGENDARY', 4),
      makeItem('SKYS_BADGE', "Sky's Badge", 'LEGENDARY', 5),
      makeItem('CANDY_RELIC', 'Candy Relic', 'LEGENDARY', 6),
      makeItem('RED_CLAW_ARTIFACT', 'Red Claw Artifact', 'EPIC', 7),
      makeItem('FIRE_DEVOURER', 'Fire Devourer', 'EPIC', 8),
      makeItem('EXPERIENCE_ARTIFACT', 'Experience Artifact', 'EPIC', 9),
      makeItem('BAT_ARTIFACT', 'Bat Artifact', 'EPIC', 10),
      makeItem('FEATHER_ARTIFACT', 'Feather Artifact', 'RARE', 11),
      makeItem('SPEED_ARTIFACT', 'Speed Artifact', 'RARE', 12),
      makeItem('CAKE_SLICE', 'Cake Slice', 'RARE', 13),
      makeItem('PIGS_FOOT', "Pig's Foot", 'RARE', 14),
      makeItem('ZOMBIE_ARTIFACT', 'Zombie Artifact', 'RARE', 15),
      makeItem('SEAL_OF_THE_OCEANS', 'Seal of the Oceans', 'RARE', 16),
      makeItem('DRACONIC_RING', 'Draconic Ring', 'RARE', 17),
      makeItem('HUNTER_RING', 'Hunter Ring', 'RARE', 18),
      makeItem('FARMIONAIRE_ARTIFACT', 'Farmionaire Artifact', 'RARE', 19),
      makeItem('LAVA_TALISMAN', 'Lava Talisman', 'UNCOMMON', 20),
      makeItem('PIGGY_BANK', 'Piggy Bank', 'UNCOMMON', 21),
      makeItem('MAGNETIC_TALISMAN', 'Magnetic Talisman', 'UNCOMMON', 22),
      makeItem('GRAVITY_TALISMAN', 'Gravity Talisman', 'UNCOMMON', 23),
      makeItem('NEW_YEARS_CAKE_BAG', "New Year's Cake Bag", 'UNCOMMON', 24),
      makeItem('BAMBOO_RING', 'Bamboo Ring', 'UNCOMMON', 25),
      makeItem('FARMER_ORB', 'Farmer Orb', 'UNCOMMON', 26),
      makeItem('EMERALD_RING', 'Emerald Ring', 'UNCOMMON', 27),
      makeItem('WOLF_RING', 'Wolf Ring', 'UNCOMMON', 28),
      makeItem('BAT_PERSON_RING', 'Bat Person Ring', 'UNCOMMON', 29),
      makeItem('WOOD_AFFINITY_TALISMAN', 'Wood Affinity Talisman', 'UNCOMMON', 30),
      makeItem('VACCINE_TALISMAN', 'Vaccine Talisman', 'COMMON', 31),
      makeItem('SKELETON_TALISMAN', 'Skeleton Talisman', 'COMMON', 32),
      makeItem('MINE_AFFINITY_TALISMAN', 'Mine Affinity Talisman', 'COMMON', 33),
      makeItem('INTIMIDATION_ARTIFACT', 'Intimidation Artifact', 'RARE', 34),
      makeItem('FIRE_TALISMAN', 'Fire Talisman', 'COMMON', 35),
      makeItem('COINS_TALISMAN', 'Coins Talisman', 'COMMON', 36),
      makeItem('VILLAGE_AFFINITY_TALISMAN', 'Village Affinity Talisman', 'COMMON', 37),
      makeItem('FARMING_TALISMAN', 'Farming Talisman', 'COMMON', 38),
      makeItem('POTATO_TALISMAN', 'Potato Talisman', 'COMMON', 39),
      makeItem('BLOOD_GOD_CREST', 'Blood God Crest', 'COMMON', 40),
      makeItem('SCAVENGER_TALISMAN', 'Scavenger Talisman', 'COMMON', 41),
      makeItem('NIGHT_VISION_CHARM', 'Night Vision Charm', 'COMMON', 42)
    ]
  },
  {
    id: 'midgame',
    name: 'Midgame Grinder',
    description: 'Mid-stage SkyBlock player with collections unlocked and tier 2/3 accessories.',
    gamertag: 'SkyCrafter42',
    profileName: 'Kiwi',
    items: [
      makeItem('ZOMBIE_RING', 'Zombie Ring', 'UNCOMMON', 0, 'Shaded'),
      makeItem('RED_CLAW_TALISMAN', 'Red Claw Talisman', 'UNCOMMON', 1, 'Hurtful'),
      makeItem('FEATHER_RING', 'Feather Ring', 'UNCOMMON', 2, 'Shaded'),
      makeItem('SPEED_RING', 'Speed Ring', 'UNCOMMON', 3, 'Sweet'),
      makeItem('BAT_RING', 'Bat Ring', 'RARE', 4, 'Hurtful'),
      makeItem('CAMPFIRE_CULTIST_BADGE', 'Campfire Cultist Badge', 'RARE', 5, 'Sweet'),
      makeItem('GRAVITY_TALISMAN', 'Gravity Talisman', 'UNCOMMON', 6, 'Forceful'),
      makeItem('MAGNETIC_TALISMAN', 'Magnetic Talisman', 'UNCOMMON', 7)
    ]
  },
  {
    id: 'earlygame',
    name: 'Earlygame Adventurer',
    description: 'Starting SkyBlock player with basic collection talismans and hub shop purchases.',
    gamertag: 'NoobMiner12',
    profileName: 'Peach',
    items: [
      makeItem('FARMING_TALISMAN', 'Farming Talisman', 'COMMON', 0),
      makeItem('VACCINE_TALISMAN', 'Vaccine Talisman', 'COMMON', 1),
      makeItem('SPEED_TALISMAN', 'Speed Talisman', 'COMMON', 2),
      makeItem('FEATHER_TALISMAN', 'Feather Talisman', 'COMMON', 3),
      makeItem('ZOMBIE_TALISMAN', 'Zombie Talisman', 'COMMON', 4)
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
