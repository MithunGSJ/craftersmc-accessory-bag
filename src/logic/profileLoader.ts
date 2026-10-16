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

export function createSimulatedProfileForPlayer(playerName: string): LoadedProfileData {
  const base = SAMPLE_PROFILES[1];
  return {
    playerName: playerName.trim(),
    profileName: 'Simulated SkyBlock',
    items: base.items,
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
    headers['X-API-Key'] = apiKey.trim();
  }

  // Use local Vite proxy in browser environment to eliminate CORS errors
  const baseUrl =
    typeof window !== 'undefined' && window.location?.origin
      ? '/api'
      : THEME_CONFIG.apiBaseUrl;

  const playerUrl = `${baseUrl}/v1/player/${encodeURIComponent(identifier.trim())}`;
  let response: Response;

  try {
    response = await fetch(playerUrl, { headers });
  } catch (netErr) {
    throw new Error(
      'Unable to connect to CraftersMC API. Please check your internet connection or supply an API key.'
    );
  }

  if (!response.ok) {
    if (response.status === 401) {
      const errBody = (await response.json().catch(() => ({}))) as { message?: string };
      throw new Error(
        errBody.message ||
          'CraftersMC API requires an API key (X-API-Key). Obtain one in-game using "/api new" and enter it below.'
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
  const player = playerData?.player;
  const playerName = player?.name || identifier;

  // Now attempt to load SkyBlock profile if active profile or profile ID is known
  let items: PlayerAccessoryItem[] = [];
  let profileName = 'SkyBlock';

  if (player?.pixelId) {
    try {
      const sbUrl = `${baseUrl}/v1/skyblock/profile/${player.pixelId}`;
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
