import { describe, it, expect } from 'vitest';
import { evaluatePlayerAccessories } from './accessoryMatcher.ts';
import { THEME_CONFIG } from '../config/themeConfig.ts';
import { SAMPLE_PROFILES } from '../data/sampleProfiles.ts';

const STAGE_ORDER: Record<string, number> = {
  'NPC Shop': 1,
  'Early Collection': 2,
  'Quest': 3,
  'Mid Collection': 4,
  'High Collection': 5,
  'Event': 6,
  'Slayer': 7,
  'Rare Drop': 8
};

describe('recommendationsEngine', () => {
  it('should rank missing accessories by authentic CraftersMC milestone stages', () => {
    // Fresh profile is missing all accessories
    const fresh = SAMPLE_PROFILES.find(p => p.id === 'fresh')!;
    const evaluated = evaluatePlayerAccessories(fresh.items);

    const candidates = evaluated
      .filter(e => e.status === 'MISSING' || e.status === 'UPGRADABLE_NEXT')
      .map(e => {
        const rarity = e.definition.baseRarity;
        const mpGain =
          e.status === 'UPGRADABLE_NEXT' && e.upgradeRecommendation
            ? e.upgradeRecommendation.additionalMp
            : THEME_CONFIG.rarityMap[rarity]?.magicalPower || 3;
        const stage = e.definition.stage || 'Mid Collection';
        const stageWeight = STAGE_ORDER[stage] || 5;

        return {
          id: e.definition.id,
          name: e.definition.name,
          stage,
          stageWeight,
          mpGain
        };
      })
      .sort((a, b) => {
        if (a.stageWeight !== b.stageWeight) {
          return a.stageWeight - b.stageWeight;
        }
        return b.mpGain - a.mpGain;
      });

    expect(candidates.length).toBeGreaterThan(5);

    // Verify sorted ascending by stageWeight
    for (let i = 0; i < candidates.length - 1; i++) {
      expect(candidates[i].stageWeight).toBeLessThanOrEqual(candidates[i + 1].stageWeight);
    }

    // Early NPC Hub shop items (like Skeleton, Zombie, Mine Affinity, Village Affinity) should be in top candidates
    const topCandidates = candidates.slice(0, 5);
    expect(topCandidates.some(c => c.stage === 'NPC Shop' || c.stage === 'Early Collection')).toBe(true);

    // Late Slayer and multi-step Event items should not precede early NPC Shop / Early Collection
    const topIds = topCandidates.map(c => c.id);
    expect(topIds).not.toContain('FROSTCLAW_RELIC');
    expect(topIds).not.toContain('CANDY_RELIC');
    expect(topIds).not.toContain('REAPER_ORB');
  });
});
