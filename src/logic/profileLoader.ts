import { SAMPLE_PROFILES, SampleProfile } from '../data/sampleProfiles.ts';
import { PlayerAccessoryItem } from '../data/accessoryTypes.ts';
import { parseAccessoryBagBase64 } from './accessoryParser.ts';
import { THEME_CONFIG } from '../config/themeConfig.ts';

export interface LoadedProfileData {
  readonly playerName: string;
  readonly profileName: string;
  readonly items: readonly PlayerAccessoryItem[];
  readonly source: 'sample' | 'custom_nbt' | 'api';
  readonly lastFetched?: number;
}

interface ApiCacheEntry {
  readonly timestamp: number;
  readonly data: LoadedProfileData;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes caching per CraftersMC API Usage Policy
const apiCache = new Map<string, ApiCacheEntry>();

export function getSampleProfileById(id: string): SampleProfile | undefined {
  return SAMPLE_PROFILES.find(p => p.id === id);
}

export function loadSampleProfile(id: string): LoadedProfileData {
  const sample = getSampleProfileById(id) || SAMPLE_PROFILES[0];
  return {
    playerName: sample.gamertag,
    profileName: sample.profileName,
    items: sample.items,
    source: 'sample'
  };
}

const makeItem = (
  internalId: string,
  displayName: string,
  rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY',
  slot: number,
  reforge?: string
): PlayerAccessoryItem => ({
  id: `${internalId}_${slot}`,
  internalId,
  displayName,
  rarity,
  reforge,
  slot
});

const AUTHENTIC_SIMULATED_ITEMS: readonly PlayerAccessoryItem[] = [
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
];

export function createSimulatedProfileForPlayer(playerName: string): LoadedProfileData {
  return {
    playerName: playerName.trim(),
    profileName: 'Simulated SkyBlock',
    items: AUTHENTIC_SIMULATED_ITEMS,
    source: 'sample'
  };
}

export function loadFromBase64Nbt(base64: string, playerName = 'Custom Player'): LoadedProfileData {
  const items = parseAccessoryBagBase64(base64);
  return {
    playerName,
    profileName: 'Custom NBT',
    items,
    source: 'custom_nbt'
  };
}

export async function fetchPlayerFromApi(
  identifier: string
): Promise<LoadedProfileData> {
  const cleanId = identifier.trim();
  const cacheKey = cleanId.toLowerCase();
  const cached = apiCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const headers: Record<string, string> = {
    Accept: 'application/json'
  };

  // Use local Vite proxy in browser environment to eliminate CORS errors
  const baseUrl =
    typeof window !== 'undefined' && window.location?.origin
      ? '/api'
      : THEME_CONFIG.apiBaseUrl;

  const playerUrl = `${baseUrl}/v1/player/${encodeURIComponent(cleanId)}`;
  let response: Response;

  try {
    response = await fetch(playerUrl, { headers });
  } catch (netErr) {
    throw new Error(
      'Unable to connect to CraftersMC API. Please check your internet connection.'
    );
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(
        'CraftersMC API authorization error. Check server CRAFTERS_API_KEY environment variable.'
      );
    }
    if (response.status === 404) {
      throw new Error(`Player "${identifier}" not found on CraftersMC. Check the spelling or gamertag.`);
    }
    if (response.status === 429) {
      throw new Error('Rate limit exceeded (40 req/min). Please wait a moment before trying again.');
    }
    throw new Error(`API error (${response.status}): ${response.statusText}`);
  }

  const playerData = await response.json();
  const player = playerData?.player || playerData;
  const playerName = player?.name || identifier;

  // Now attempt to load SkyBlock profile if active profile or profile ID is known
  let items: PlayerAccessoryItem[] = [];
  let profileName = 'SkyBlock';

  const profileId = player?.stats?.skyBlock?.profileId;
  const rawUuid = String(player?.uuid || '');
  const uuidClean = rawUuid.replace(/-/g, '');

  if (profileId) {
    try {
      const sbUrl = `${baseUrl}/v1/skyblock/profile/${profileId}`;
      const sbRes = await fetch(sbUrl, { headers });
      if (sbRes.ok) {
        const sbData = await sbRes.json();
        const prof = sbData?.profile || sbData;
        profileName =
          prof?.cuteName ||
          player?.stats?.skyBlock?.profiles?.[profileId]?.cuteName ||
          'SkyBlock';
        const members = prof?.members || {};
        const memberData = members[uuidClean] || members[rawUuid] || Object.values(members)[0];
        if (memberData && typeof memberData === 'object' && 'accessoryBag' in memberData) {
          const rawBag = String((memberData as { accessoryBag?: string }).accessoryBag || '');
          items = parseAccessoryBagBase64(rawBag);
        }
      }
    } catch (e) {
      console.warn('Could not fetch SkyBlock profile directly:', e);
    }
  }

  const result: LoadedProfileData = {
    playerName,
    profileName,
    items,
    source: 'api',
    lastFetched: Date.now()
  };

  apiCache.set(cacheKey, { timestamp: Date.now(), data: result });
  return result;
}
