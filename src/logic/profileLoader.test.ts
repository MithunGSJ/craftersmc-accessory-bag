import { describe, it, expect } from 'vitest';
import { loadSampleProfile, loadFromBase64Nbt, getSampleProfileById } from './profileLoader.ts';
import { SAMPLE_PROFILES } from '../data/sampleProfiles.ts';

describe('profileLoader', () => {
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
});
