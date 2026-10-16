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
  identifier: string,
  apiKey?: string
): Promise<LoadedProfileData> {
  const cacheKey = identifier.trim().toLowerCase();
  const cached = apiCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const headers: Record<string, string> = {
    Accept: 'application/json'
  };
  if (apiKey && apiKey.trim() !== '') {
    headers['Authorization'] = `Bearer ${apiKey.trim()}`;
  }

  const playerUrl = `${THEME_CONFIG.apiBaseUrl}/v1/player/${encodeURIComponent(identifier.trim())}`;
  const response = await fetch(playerUrl, { headers });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Player "${identifier}" not found on CraftersMC.`);
    }
    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment before trying again.');
    }
    throw new Error(`API error (${response.status}): ${response.statusText}`);
  }

  const playerData = await response.json();
  const player = playerData?.player;
  const playerName = player?.name || identifier;

  // Now attempt to load SkyBlock profile if active profile or profile ID is known
  let items: PlayerAccessoryItem[] = [];
  let profileName = 'SkyBlock';

  if (player?.pixelId) {
    try {
      const sbUrl = `${THEME_CONFIG.apiBaseUrl}/v1/skyblock/profile/${player.pixelId}`;
      const sbRes = await fetch(sbUrl, { headers });
      if (sbRes.ok) {
        const sbData = await sbRes.json();
        profileName = sbData?.profile?.cuteName || 'SkyBlock';
        const members = sbData?.profile?.members || {};
        const memberData = members[player.pixelId] || Object.values(members)[0];
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
