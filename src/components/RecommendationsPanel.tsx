import React from 'react';
import { EvaluatedAccessory } from '../data/accessoryTypes.ts';
import { THEME_CONFIG } from '../config/themeConfig.ts';
import { playClickSound } from '../utils/soundEffects.ts';
import { AccessoryIcon } from './AccessoryIcon.tsx';
import { evaluateAccessoryPrice, formatCoins } from '../logic/pricingEngine.ts';

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
      const priceInfo = evaluateAccessoryPrice(e.definition);
      const costPerMp = priceInfo.effectivePrice > 0 ? Math.round(priceInfo.effectivePrice / mpGain) : 0;

      return {
        evaluated: e,
        mpGain,
        stage,
        stageWeight,
        priceInfo,
        costPerMp
      };
    })
    .sort((a, b) => {
      // Prioritize earlier acquisition stages first
      if (a.stageWeight !== b.stageWeight) {
        return a.stageWeight - b.stageWeight;
      }
      // Within same stage, prioritize lower cost per MP (best value)
      if (a.costPerMp > 0 && b.costPerMp > 0 && a.costPerMp !== b.costPerMp) {
        return a.costPerMp - b.costPerMp;
      }
      return b.mpGain - a.mpGain;
    })
    .slice(0, 4);

  if (candidates.length === 0) return null;

  return (
    <section className="glass-card" style={{ padding: '20px', marginBottom: '28px', borderLeft: '4px solid var(--accent-cyan)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>💡</span> Recommended Next Accessories (CraftersMC Live Progression)
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Priority talisman targets sorted by obtaining milestone, live Bazaar craft cost &amp; Auction valuation.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
        {candidates.map(({ evaluated: item, mpGain, stage, priceInfo, costPerMp }) => {
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AccessoryIcon
                    id={item.definition.id}
                    name={item.definition.name}
                    fallbackEmoji={item.definition.iconEmoji}
                    size={26}
                  />
                  <span style={{ fontWeight: 700, color: style.color, fontSize: '0.88rem' }}>
                    {item.definition.name}
                  </span>
                </div>
                <span className="mp-pill" style={{ fontSize: '0.75rem' }}>+{mpGain} MP</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
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

                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background:
                    priceInfo.primaryMethod === 'BAZAAR_CRAFT'
                      ? 'rgba(34, 197, 94, 0.15)'
                      : 'rgba(250, 204, 21, 0.15)',
                  color:
                    priceInfo.primaryMethod === 'BAZAAR_CRAFT'
                      ? '#4ade80'
                      : 'var(--accent-gold)'
                }}>
                  {priceInfo.primaryMethod === 'BAZAAR_CRAFT' && '🌾 '}
                  {priceInfo.primaryMethod === 'AUCTION' && '🏛️ '}
                  {priceInfo.primaryMethod === 'NPC_SHOP' && '🪙 '}
                  {priceInfo.primaryMethod === 'NPC_SHOP'
                    ? (item.definition.npcCost || formatCoins(priceInfo.effectivePrice))
                    : `~${formatCoins(priceInfo.effectivePrice)}`}
                </span>

                {costPerMp > 0 && (
                  <span style={{
                    fontSize: '0.68rem',
                    color: 'var(--text-muted)',
                    padding: '2px 4px'
                  }}>
                    ({formatCoins(costPerMp)}/MP)
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
