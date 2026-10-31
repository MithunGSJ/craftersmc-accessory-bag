import React from 'react';
import { EvaluatedAccessory } from '../data/accessoryTypes.ts';
import { THEME_CONFIG } from '../config/themeConfig.ts';
import { ACCESSORIES_BY_FAMILY, findAccessoryById } from '../data/accessoryRegistry.ts';
import { playClickSound } from '../utils/soundEffects.ts';
import { AccessoryIcon } from './AccessoryIcon.tsx';
import { evaluateAccessoryPrice, formatCoins } from '../logic/pricingEngine.ts';

interface AccessoryModalProps {
  readonly evaluated: EvaluatedAccessory | null;
  readonly allEvaluated?: readonly EvaluatedAccessory[];
  readonly onClose: () => void;
  readonly onSelectAccessory?: (acc: EvaluatedAccessory) => void;
}

export const AccessoryModal: React.FC<AccessoryModalProps> = ({
  evaluated,
  allEvaluated,
  onClose,
  onSelectAccessory
}) => {
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [evaluated?.definition.id]);
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!evaluated) return null;

  const { definition, status, ownedItem, effectiveMagicalPower, upgradeRecommendation, skinUrl } = evaluated;
  const rarity = ownedItem ? ownedItem.rarity : definition.baseRarity;
  const style = THEME_CONFIG.rarityMap[rarity] || THEME_CONFIG.rarityMap.COMMON;
  const familyChain = ACCESSORIES_BY_FAMILY[definition.familyId] || [definition];
  const priceInfo = evaluateAccessoryPrice(definition);

  const statusColor = status === 'OWNED' ? 'var(--status-owned)' : status === 'UPGRADABLE_NEXT' ? 'var(--status-upgradable)' : status === 'UPGRADED_PREVIOUS' ? 'var(--text-muted)' : 'var(--status-missing)';

  const isOwned = status === 'OWNED';
  const isUpgradable = status === 'UPGRADABLE_NEXT';
  const baseMp = style.magicalPower || 0;
  const ownedTierDef = familyChain.find(m => m.tier === evaluated.familyMaxTierOwned);
  const ownedTierMp = ownedTierDef ? (THEME_CONFIG.rarityMap[ownedTierDef.baseRarity]?.magicalPower || 0) : 0;
  const netGain = Math.max(0, baseMp - ownedTierMp);

  const isFamilyFreezerOwned = definition.familyId === 'day_night_freezer' &&
    Boolean(allEvaluated?.some(e => e.definition.familyId === 'day_night_freezer' && e.status === 'OWNED'));

  const modalMpText = isOwned
    ? effectiveMagicalPower > 0
      ? `+${effectiveMagicalPower} Active MP`
      : definition.familyId === 'day_night_freezer' ? '0 Active MP (Shared)' : '0 Active MP'
    : isFamilyFreezerOwned
    ? '0 Potential MP (Shared MP Owned)'
    : isUpgradable && netGain > 0 && netGain < baseMp
    ? `+${netGain} MP Upgrade (+${baseMp} Base)`
    : `+${baseMp} Potential MP`;

  const handleSelectAccessoryById = (accId: string) => {
    if (!onSelectAccessory) return;
    const found = findAccessoryById(accId);
    if (!found) return;
    playClickSound();
    const target = allEvaluated?.find(e => e.definition.id === found.id) || {
      definition: found,
      status: 'MISSING' as const,
      effectiveMagicalPower: 0,
      familyMaxTierOwned: 0,
      isHighestInFamily: true
    };
    onSelectAccessory(target);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        ref={contentRef}
        className="glass-card modal-content"
        style={{ border: `1px solid ${style.border}`, boxShadow: `0 10px 40px -5px ${style.glow}`, maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">✕</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '18px' }}>
          <div className="card-icon-box" style={{ width: '64px', height: '64px', borderColor: style.border }}>
            <AccessoryIcon id={definition.id} name={definition.name} fallbackEmoji={definition.iconEmoji} skinUrl={ownedItem?.skinUrl || skinUrl} size={48} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: style.color, margin: 0 }}>
              {ownedItem?.displayName || definition.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span className="card-rarity" style={{ color: style.color }}>{style.label}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>• {definition.category} Category</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '18px' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</span>
            <div style={{ fontWeight: 700, color: statusColor, fontSize: '0.95rem', marginTop: '2px' }}>{isOwned ? 'Owned' : isUpgradable ? 'Upgradable' : status === 'UPGRADED_PREVIOUS' ? 'Replaced' : 'Missing'}</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Magical Power</span>
            <div style={{ fontWeight: 700, color: 'var(--accent-gold)', fontSize: '0.95rem', marginTop: '2px' }}>{modalMpText}</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bag Slot</span>
            <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.95rem', marginTop: '2px' }}>{ownedItem?.slot !== undefined ? `Slot #${ownedItem.slot + 1}` : 'Not in Bag'}</div>
          </div>
        </div>

        {upgradeRecommendation && (
          <div style={{ background: 'rgba(255, 184, 0, 0.08)', border: '1px solid rgba(255, 184, 0, 0.25)', borderRadius: '12px', padding: '12px 14px', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', fontWeight: 700, fontSize: '0.88rem' }}>
              <span>⚡ Upgrade Recommendation</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Next Tier: <strong style={{ color: '#FFFFFF' }}>{upgradeRecommendation.nextTierName}</strong> (+{upgradeRecommendation.additionalMp} MP) • {upgradeRecommendation.nextSource}
              </span>
              {onSelectAccessory && (
                <button
                  type="button"
                  className="recipe-redirect-pill"
                  onClick={() => handleSelectAccessoryById(upgradeRecommendation.nextTierId)}
                  title={`Redirect to ${upgradeRecommendation.nextTierName} card`}
                >
                  View Card ↗
                </button>
              )}
            </div>
          </div>
        )}

        <div style={{ background: 'rgba(0,0,0,0.35)', borderRadius: '12px', padding: '12px 14px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
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
                {priceInfo.craftBreakdown.map((ing, idx) => {
                  const ingAcc = findAccessoryById(ing.itemId);
                  return (
                    <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '5px 8px', borderRadius: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                        <span style={{ color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          • {ing.count}x <strong style={{ color: '#FFFFFF' }}>{ing.name}</strong>
                          {ingAcc && onSelectAccessory ? (
                            <button
                              type="button"
                              className="recipe-redirect-pill"
                              onClick={() => handleSelectAccessoryById(ing.itemId)}
                              title={`Redirect to ${ing.name} card`}
                            >
                              Card ↗
                            </button>
                          ) : (
                            <span style={{ color: 'var(--text-muted)' }}>
                              (@ {formatCoins(ing.unitPrice)}/ea)
                            </span>
                          )}
                        </span>
                        <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>{formatCoins(ing.totalCost)}</span>
                      </div>
                      {ing.subMaterial && (
                        <div style={{ fontSize: '0.72rem', marginTop: '4px', paddingLeft: '8px', borderLeft: '2px solid rgba(56, 189, 248, 0.4)' }}>
                          <span style={{ color: '#94a3b8' }}>
                            ↳ = {ing.subMaterial.count.toLocaleString()}x {ing.subMaterial.name} (@ {formatCoins(ing.subMaterial.unitPrice)}/ea = {formatCoins(ing.subMaterial.totalCost)})
                          </span>
                          <div style={{ color: ing.subMaterial.isCheaper ? '#4ade80' : '#38bdf8', fontWeight: 600, marginTop: '1px' }}>
                            {ing.subMaterial.isCheaper
                              ? `💡 Crafting from raw sub-materials saves ~${formatCoins(ing.subMaterial.priceDifference)}!`
                              : ing.subMaterial.priceDifference > 0 ? `✨ Buying ${ing.count}x ${ing.name} directly saves ~${formatCoins(ing.subMaterial.priceDifference)}!` : `⚖️ Equal cost (${formatCoins(ing.subMaterial.totalCost)}) crafted from sub-materials`}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
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
                <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 500 }}>{priceInfo.auction.count} {priceInfo.auction.hasBin !== false ? 'BIN' : ''} listings</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '0.75rem', textAlign: 'center' }}>
                <div><div style={{ color: 'var(--text-muted)' }}>{priceInfo.auction.hasBin !== false ? 'Lowest BIN' : 'Min'}</div><div style={{ fontWeight: 700, color: '#38bdf8' }}>{formatCoins(priceInfo.auction.minPrice)}</div></div>
                <div><div style={{ color: 'var(--text-muted)' }}>{priceInfo.auction.hasBin !== false ? 'Market Avg' : 'Avg'}</div><div style={{ fontWeight: 700, color: '#facc15' }}>{formatCoins(priceInfo.auction.avgPrice)}</div></div>
                <div><div style={{ color: 'var(--text-muted)' }}>{priceInfo.auction.hasBin !== false ? 'Highest BIN' : 'Max'}</div><div style={{ fontWeight: 700, color: '#f87171' }}>{formatCoins(priceInfo.auction.maxPrice)}</div></div>
              </div>
            </div>
          ) : priceInfo.primaryMethod !== 'BAZAAR_CRAFT' && priceInfo.primaryMethod !== 'NPC_SHOP' && priceInfo.primaryMethod !== 'FREE_QUEST' ? (
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '8px 12px', marginTop: '8px', fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🏛️</span><span>No offers were made in auction house.</span>
            </div>
          ) : null}
        </div>

        <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '12px', padding: '14px 16px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '16px' }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.8px', fontWeight: 700 }}>
            Item Description & Lore (CraftersMC Wiki)
          </span>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#D1D5DB', marginTop: '6px', lineHeight: 1.5 }}>
            {definition.loreLines.map((line, idx) => (<div key={idx}>{line}</div>))}
          </div>
        </div>

        {Boolean(ownedItem?.reforge && ownedItem.reforge.trim().toLowerCase() !== 'none') && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ background: 'rgba(255, 184, 0, 0.08)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255, 184, 0, 0.2)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', fontWeight: 600 }}>Active Reforge</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF' }}>{ownedItem?.reforge}</div>
            </div>
          </div>
        )}

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

        {familyChain.length > 1 && (
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.8px', fontWeight: 700 }}>
              {definition.familyId === 'day_night_freezer' ? 'Freezer Variants (Shared MP)' : 'Upgrade Family Hierarchy'}
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              {familyChain.map(tierItem => {
                const isThis = tierItem.id === definition.id;
                const tierColor = THEME_CONFIG.rarityMap[tierItem.baseRarity]?.color || '#FFFFFF';
                return (
                  <button
                    key={tierItem.id}
                    type="button"
                    className={`hierarchy-chip ${isThis ? 'active' : ''}`}
                    style={{ color: tierColor }}
                    onClick={() => handleSelectAccessoryById(tierItem.id)}
                    title={isThis ? 'Currently viewing' : `View ${tierItem.name}`}
                  >
                    <AccessoryIcon id={tierItem.id} name={tierItem.name} fallbackEmoji={tierItem.iconEmoji} size={18} />
                    {definition.familyId === 'day_night_freezer' ? tierItem.name : `T${tierItem.tier}: ${tierItem.name}`}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
