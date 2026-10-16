import React from 'react';
import { EvaluatedAccessory } from '../data/accessoryTypes.ts';
import { THEME_CONFIG } from '../config/themeConfig.ts';
import { playClickSound } from '../utils/soundEffects.ts';

interface RecommendationsPanelProps {
  readonly evaluated: readonly EvaluatedAccessory[];
  readonly onSelectAccessory: (acc: EvaluatedAccessory) => void;
}

export const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({
  evaluated,
  onSelectAccessory
}) => {
  // Find candidates:
  // 1. Unowned base tier 1 accessories (Missing)
  // 2. Direct upgrades (Upgradable Next)
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
        evaluated: e,
        mpGain,
        cost,
        costPerMp
      };
    })
    .filter(c => c.costPerMp > 0 && c.costPerMp < Infinity)
    .sort((a, b) => a.costPerMp - b.costPerMp)
    .slice(0, 4);

  if (candidates.length === 0) return null;

  return (
    <section className="glass-card" style={{ padding: '22px', marginBottom: '28px', borderLeft: '4px solid var(--accent-cyan)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>💡</span> Cheapest Missing Magical Power (MP) Upgrades
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Optimal talisman targets sorted by lowest coin cost per Magical Power point gained.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
        {candidates.map(({ evaluated: item, mpGain, cost, costPerMp }) => {
          const style = THEME_CONFIG.rarityMap[item.definition.baseRarity];
          return (
            <div
              key={item.definition.id}
              style={{
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '12px 14px',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease, transform 0.2s ease'
              }}
              onClick={() => {
                playClickSound();
                onSelectAccessory(item);
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, color: style.color, fontSize: '0.9rem' }}>
                  {item.definition.name}
                </span>
                <span className="mp-pill" style={{ fontSize: '0.75rem' }}>+{mpGain} MP</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                📍 {item.definition.source}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.78rem' }}>
                <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>💰 {cost.toLocaleString()} Coins</span>
                <span style={{ color: 'var(--accent-cyan)' }}>{Math.round(costPerMp).toLocaleString()} coins/MP</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
