import React from 'react';
import { EvaluatedAccessory } from '../data/accessoryTypes.ts';
import { THEME_CONFIG } from '../config/themeConfig.ts';
import { playClickSound } from '../utils/soundEffects.ts';

interface RecommendationsPanelProps {
  readonly evaluated: readonly EvaluatedAccessory[];
  readonly onSelectAccessory: (acc: EvaluatedAccessory) => void;
}

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

      const stage = e.definition.stage || 'Mid Collection';
      const stageWeight = STAGE_ORDER[stage] || 5;

      return {
        evaluated: e,
        mpGain,
        stage,
        stageWeight
      };
    })
    .sort((a, b) => {
      // Prioritize earlier acquisition stages first, then higher MP gain
      if (a.stageWeight !== b.stageWeight) {
        return a.stageWeight - b.stageWeight;
      }
      return b.mpGain - a.mpGain;
    })
    .slice(0, 4);

  if (candidates.length === 0) return null;

  return (
    <section className="glass-card" style={{ padding: '22px', marginBottom: '28px', borderLeft: '4px solid var(--accent-cyan)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>💡</span> Recommended Next Accessory Upgrades (CraftersMC Progression)
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Priority talisman targets ordered by official CraftersMC Wiki obtaining milestones &amp; MP gain.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
        {candidates.map(({ evaluated: item, mpGain, stage }) => {
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

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: 'var(--accent-cyan)'
                }}>
                  {stage}
                </span>
                {item.definition.npcCost && (
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: 'rgba(250, 204, 21, 0.15)',
                    color: 'var(--accent-gold)'
                  }}>
                    💰 {item.definition.npcCost}
                  </span>
                )}
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                📍 {item.definition.source}
              </div>

              {item.status === 'UPGRADABLE_NEXT' && (
                <div style={{ fontSize: '0.75rem', color: 'var(--status-upgradable)', marginTop: '4px', fontWeight: 600 }}>
                  ⚡ Upgrades from current tier
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
