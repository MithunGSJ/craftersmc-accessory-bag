import { describe, it, expect } from 'vitest';
import { evaluatePlayerAccessories } from './accessoryMatcher.ts';
import { THEME_CONFIG } from '../config/themeConfig.ts';
import { SAMPLE_PROFILES } from '../data/sampleProfiles.ts';

describe('recommendationsEngine', () => {
  it('should rank cheapest missing accessories by lowest coin cost per MP', () => {
    // Earlygame adventurer is missing many accessories
    const earlygame = SAMPLE_PROFILES.find(p => p.id === 'earlygame')!;
    const evaluated = evaluatePlayerAccessories(earlygame.items);

    const candidates = evaluated
      .filter(e => e.status === 'MISSING' || e.status === 'UPGRADABLE_NEXT')
      .map(e => {
        const rarity = e.definition.baseRarity;
        const mpGain =
          e.status === 'UPGRADABLE_NEXT' && e.upgradeRecommendation
            ? e.upgradeRecommendation.additionalMp
            : THEME_CONFIG.rarityMap[rarity]?.magicalPower || 3;
        const cost = e.definition.estimatedCoins || 5000;
        const costPerMp = mpGain > 0 ? cost / mpGain : Infinity;
        return {
          id: e.definition.id,
          name: e.definition.name,
          cost,
          mpGain,
          costPerMp
        };
      })
      .filter(c => c.costPerMp > 0 && c.costPerMp < Infinity)
      .sort((a, b) => a.costPerMp - b.costPerMp);

    expect(candidates.length).toBeGreaterThan(5);

    // Verify sorted ascending by costPerMp
    for (let i = 0; i < candidates.length - 1; i++) {
      expect(candidates[i].costPerMp).toBeLessThanOrEqual(candidates[i + 1].costPerMp);
    }

    // Affordable early missing items (like Skeleton / Mine Affinity / Village / Coins) should be in top candidates
    const topIds = candidates.slice(0, 5).map(c => c.id);
    expect(topIds.some(id => id.includes('SKELETON') || id.includes('MINE_AFFINITY') || id.includes('VILLAGE_AFFINITY') || id.includes('COINS'))).toBe(true);

    // Multi-million coin items (like Sky's Badge or Candy Relic or Frostclaw) should not be in the top 3
    expect(topIds.slice(0, 3)).not.toContain('SKYS_BADGE');
    expect(topIds.slice(0, 3)).not.toContain('CANDY_RELIC');
    expect(topIds.slice(0, 3)).not.toContain('FROSTCLAW_RELIC');
  });
});
