import React from 'react';
import { EvaluatedAccessory } from '../data/accessoryTypes.ts';
import { THEME_CONFIG } from '../config/themeConfig.ts';
import { ACCESSORIES_BY_FAMILY } from '../data/accessoryRegistry.ts';
import { playClickSound } from '../utils/soundEffects.ts';
import { AccessoryIcon } from './AccessoryIcon.tsx';
import { evaluateAccessoryPrice, formatCoins } from '../logic/pricingEngine.ts';

interface AccessoryModalProps {
  readonly evaluated: EvaluatedAccessory | null;
  readonly onClose: () => void;
}

export const AccessoryModal: React.FC<AccessoryModalProps> = ({ evaluated, onClose }) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!evaluated) return null;

  const { definition, status, ownedItem, effectiveMagicalPower, upgradeRecommendation, skinUrl } = evaluated;
  const rarity = ownedItem ? ownedItem.rarity : definition.baseRarity;
  const style = THEME_CONFIG.rarityMap[rarity] || THEME_CONFIG.rarityMap.COMMON;
  const familyChain = ACCESSORIES_BY_FAMILY[definition.familyId] || [definition];
  const priceInfo = evaluateAccessoryPrice(definition);

  const statusColor =
    status === 'OWNED'
      ? 'var(--status-owned)'
      : status === 'UPGRADABLE_NEXT'
      ? 'var(--status-upgradable)'
      : status === 'UPGRADED_PREVIOUS'
      ? 'var(--text-muted)'
      : 'var(--status-missing)';

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="glass-card modal-content"
        style={{
          border: `1px solid ${style.border}`,
          boxShadow: `0 10px 40px -5px ${style.glow}`,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          className="modal-close-btn"
          onClick={() => {
            playClickSound();
            onClose();
          }}
          aria-label="Close details"
        >
          ✕
        </button>

        {/* Header with Pixel Art Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <div
            className="card-icon-box"
            style={{ width: '56px', height: '56px', borderColor: style.border, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <AccessoryIcon
              id={definition.id}
              name={definition.name}
              fallbackEmoji={definition.iconEmoji}
              skinUrl={ownedItem?.skinUrl || skinUrl}
              size={44}
            />
          </div>
          <div>
            <h2 style={{ color: style.color, fontSize: '1.35rem', fontWeight: 800 }}>
              {ownedItem?.displayName || definition.name}
            </h2>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px', flexWrap: 'wrap' }}>
              <span style={{ color: style.color, fontWeight: 700, fontSize: '0.85rem' }}>{style.label}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>• {definition.category}</span>
              {status === 'UPGRADABLE_NEXT' ? (
                <>
                  <span style={{ color: 'var(--status-missing)', fontWeight: 700, fontSize: '0.85rem' }}>• MISSING</span>
                  <span style={{ color: 'var(--status-upgradable)', fontWeight: 700, fontSize: '0.85rem' }}>• UPGRADABLE</span>
                </>
              ) : (
                <span style={{ color: statusColor, fontWeight: 700, fontSize: '0.85rem' }}>• {status}</span>
              )}
              <span className="mp-pill">
                {effectiveMagicalPower > 0
                  ? `+${effectiveMagicalPower} Active MP`
                  : status === 'OWNED' && definition.familyId === 'day_night_freezer'
                  ? '0 Active MP (Shared)'
                  : '0 Active MP'}
              </span>
            </div>
          </div>
        </div>

        {/* Upgrade alert */}
        {upgradeRecommendation && (
          <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AccessoryIcon id={upgradeRecommendation.nextTierId} name={upgradeRecommendation.nextTierName} fallbackEmoji="⚡" size={24} />
            <div>
              <strong style={{ color: 'var(--status-upgradable)' }}>⚡ Direct Upgrade Available:</strong> Upgrades to{' '}
              <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{upgradeRecommendation.nextTierName}</span> for +{upgradeRecommendation.additionalMp} MP (via {upgradeRecommendation.nextSource}).
            </div>
          </div>
        )}

        {/* Live Economy & Valuation */}
        <div style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '12px', padding: '14px 16px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--accent-gold)', letterSpacing: '0.8px', fontWeight: 700 }}>
              CraftersMC Live Economy & Valuation
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: priceInfo.primaryMethod === 'NPC_SHOP' ? '#38bdf8' : '#4ade80' }}>
              {priceInfo.primaryMethod === 'NPC_SHOP'
                ? (definition.npcCost ? `NPC: ${definition.npcCost}` : `NPC: ${formatCoins(priceInfo.effectivePrice)}`)
                : priceInfo.primaryMethod === 'BAZAAR_CRAFT'
                ? `Craft: ~${formatCoins(priceInfo.effectivePrice)}`
                : priceInfo.primaryMethod === 'AUCTION'
                ? `AH: ~${formatCoins(priceInfo.effectivePrice)}`
                : priceInfo.displayLabel}
            </span>
          </div>

          {priceInfo.craftBreakdown && priceInfo.craftBreakdown.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '0.8rem', color: '#93c5fd', fontWeight: 600, marginBottom: '6px' }}>
                🌾 Crafting Recipe (Bazaar Material Weekly Averages):
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {priceInfo.craftBreakdown.map((ing, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      padding: '5px 8px',
                      borderRadius: '6px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        • {ing.count}x <strong style={{ color: '#FFFFFF' }}>{ing.name}</strong>
                        <span style={{ color: 'var(--text-muted)', marginLeft: '6px' }}>
                          (@ {formatCoins(ing.unitPrice)}/ea)
                        </span>
                      </span>
                      <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>
                        {formatCoins(ing.totalCost)}
                      </span>
                    </div>
                    {ing.subMaterial && (
                      <div style={{ fontSize: '0.72rem', marginTop: '4px', paddingLeft: '8px', borderLeft: '2px solid rgba(56, 189, 248, 0.4)' }}>
                        <span style={{ color: '#94a3b8' }}>
                          ↳ = {ing.subMaterial.count.toLocaleString()}x {ing.subMaterial.name} (@ {formatCoins(ing.subMaterial.unitPrice)}/ea = {formatCoins(ing.subMaterial.totalCost)})
                        </span>
                        <div style={{ color: ing.subMaterial.isCheaper ? '#4ade80' : '#38bdf8', fontWeight: 600, marginTop: '1px' }}>
                          {ing.subMaterial.isCheaper
                            ? `💡 Crafting from raw sub-materials saves ~${formatCoins(ing.subMaterial.priceDifference)}!`
                            : `✨ Buying ${ing.count}x ${ing.name} directly saves ~${formatCoins(ing.subMaterial.priceDifference)}!`}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ textAlign: 'right', marginTop: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#4ade80' }}>
                Total Craft Cost: ~{formatCoins(priceInfo.craftCost || 0)} ({priceInfo.craftCost?.toLocaleString()} coins)
              </div>
            </div>
          )}

          {priceInfo.auction ? (
            <div style={{ background: 'rgba(234, 179, 8, 0.08)', border: '1px solid rgba(234, 179, 8, 0.2)', borderRadius: '8px', padding: '8px 12px', marginTop: '6px' }}>
              <div style={{ fontSize: '0.78rem', color: '#facc15', fontWeight: 700, marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                <span>🏛️ CraftersMC Auction House ({priceInfo.auction.hasBin !== false ? 'BIN Market' : 'Bidding'})</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 500 }}>
                  {priceInfo.auction.count} {priceInfo.auction.hasBin !== false ? 'BIN' : ''} listings
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '0.75rem', textAlign: 'center' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>{priceInfo.auction.hasBin !== false ? 'Lowest BIN' : 'Least (Min)'}</div>
                  <div style={{ fontWeight: 700, color: '#38bdf8' }}>{formatCoins(priceInfo.auction.minPrice)}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>{priceInfo.auction.hasBin !== false ? 'Market Avg (BIN)' : 'Average'}</div>
                  <div style={{ fontWeight: 700, color: '#facc15' }}>{formatCoins(priceInfo.auction.avgPrice)}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>{priceInfo.auction.hasBin !== false ? 'Highest BIN' : 'Highest (Max)'}</div>
                  <div style={{ fontWeight: 700, color: '#f87171' }}>{formatCoins(priceInfo.auction.maxPrice)}</div>
                </div>
              </div>
            </div>
          ) : priceInfo.primaryMethod !== 'BAZAAR_CRAFT' && priceInfo.primaryMethod !== 'NPC_SHOP' && priceInfo.primaryMethod !== 'FREE_QUEST' ? (
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '10px 12px', marginTop: '8px', fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🏛️</span>
              <span>No offers were made in auction house.</span>
            </div>
          ) : null}
        </div>

        {/* Lore / Description */}
        <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '12px', padding: '14px 16px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '16px' }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.8px', fontWeight: 700 }}>
            Item Description & Lore (CraftersMC Wiki)
          </span>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#D1D5DB', marginTop: '6px', lineHeight: 1.5 }}>
            {definition.loreLines.map((line, idx) => (<div key={idx}>{line}</div>))}
          </div>
        </div>

        {/* Reforge & Enrichment */}
        {ownedItem && (
          <div style={{ marginBottom: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ background: 'rgba(255, 184, 0, 0.08)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255, 184, 0, 0.2)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', fontWeight: 600 }}>Active Reforge</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF' }}>{ownedItem.reforge || 'None'}</div>
            </div>
            <div style={{ background: 'rgba(0, 229, 255, 0.08)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(0, 229, 255, 0.2)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>Stat Enrichment</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF' }}>{ownedItem.enrichment || 'None'}</div>
            </div>
          </div>
        )}

        {/* Obtaining Requirement */}
        <div style={{ marginBottom: '16px' }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.8px', fontWeight: 700 }}>
            CraftersMC Obtaining Requirement
          </span>
          <div style={{ fontSize: '0.92rem', color: 'var(--text-primary)', marginTop: '4px', fontWeight: 600 }}>
            📍 {definition.source}
          </div>
          {definition.stage && (
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', marginTop: '2px' }}>
              🏷️ Progression Milestone: {definition.stage}
            </div>
          )}
        </div>

        {/* Family Chain with Icons */}
        {familyChain.length > 1 && (
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.8px', fontWeight: 700 }}>
              Upgrade Family Hierarchy
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              {familyChain.map(tierItem => {
                const isThis = tierItem.id === definition.id;
                const tierStyle = THEME_CONFIG.rarityMap[tierItem.baseRarity];
                return (
                  <span
                    key={tierItem.id}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      background: isThis ? 'rgba(255, 184, 0, 0.2)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${isThis ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)'}`,
                      color: tierStyle?.color || '#FFFFFF'
                    }}
                  >
                    <AccessoryIcon id={tierItem.id} name={tierItem.name} fallbackEmoji={tierItem.iconEmoji} size={18} />
                    T{tierItem.tier}: {tierItem.name}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
