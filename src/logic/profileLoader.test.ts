import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  loadSampleProfile,
  loadFromBase64Nbt,
  getSampleProfileById,
  clearProfileCache,
  fetchPlayerFromApi
} from './profileLoader.ts';
import { SAMPLE_PROFILES } from '../data/sampleProfiles.ts';

describe('profileLoader', () => {
  beforeEach(() => {
    clearProfileCache();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should find all bundled sample profiles', () => {
    for (const sample of SAMPLE_PROFILES) {
      const found = getSampleProfileById(sample.id);
      expect(found).toBeDefined();
      expect(found?.name).toBe(sample.name);
    }
  });

  it('should only contain Fresh Profile in bundled sample profiles', () => {
    expect(SAMPLE_PROFILES.length).toBe(1);
    expect(SAMPLE_PROFILES[0].id).toBe('fresh');
    expect(SAMPLE_PROFILES[0].name).toBe('Fresh Profile');
  });

  it('should load Fresh profile with zero items', () => {
    const profile = loadSampleProfile('fresh');
    expect(profile.playerName).toBe('NewCrafter');
    expect(profile.items.length).toBe(0);
  });

  it('should load from empty or arbitrary base64 gracefully', () => {
    const custom = loadFromBase64Nbt('', 'TestPlayer');
    expect(custom.playerName).toBe('TestPlayer');
    expect(custom.items).toEqual([]);
    expect(custom.source).toBe('custom_nbt');
  });

  it('supports cache clearing via clearProfileCache', () => {
    expect(() => clearProfileCache()).not.toThrow();
  });

  it('avoids negative caching when an API lookup returns zero items', async () => {
    let callCount = 0;
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
      callCount++;
      const urlStr = String(url);
      if (urlStr.includes('/v1/player/')) {
        return new Response(JSON.stringify({
          player: {
            name: 'EmptyPlayer',
            uuid: '0123456789abcdef0123456789abcdef',
            stats: { skyblock: { activeProfileId: 'prof-1' } }
          }
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      return new Response(JSON.stringify({
        profile: {
          cute_name: 'Apple',
          members: {
            '0123456789abcdef0123456789abcdef': { accessoryBag: '' }
          }
        }
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    });

    const first = await fetchPlayerFromApi('EmptyPlayer');
    expect(first.items.length).toBe(0);
    expect(callCount).toBe(2);

    // If negative caching were active, second call would not invoke fetch
    const second = await fetchPlayerFromApi('EmptyPlayer');
    expect(second.items.length).toBe(0);
    expect(callCount).toBe(4);
  });

  it('resolves memberData with dashed vs undashed UUIDs and accessoryBag object data', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
      const urlStr = String(url);
      if (urlStr.includes('/v1/player/')) {
        return new Response(JSON.stringify({
          player: {
            name: 'DashedPlayer',
            uuid: '11112222-3333-4444-5555-666677778888',
            stats: {
              SkyBlock: {
                profiles: {
                  'p-test': { selected: true, cuteName: 'Banana' }
                }
              }
            }
          }
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      return new Response(JSON.stringify({
        profile: {
          members: {
            // Member key is undashed lowercase
            '11112222333344445555666677778888': {
              accessoryBag: { data: '' }
            }
          }
        }
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    });

    const loaded = await fetchPlayerFromApi('DashedPlayer');
    expect(loaded.playerName).toBe('DashedPlayer');
    expect(loaded.profileName).toBe('Banana');
  });
});
