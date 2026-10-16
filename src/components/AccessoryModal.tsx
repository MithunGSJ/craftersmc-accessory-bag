import React from 'react';
import { EvaluatedAccessory } from '../data/accessoryTypes.ts';
import { THEME_CONFIG } from '../config/themeConfig.ts';
import { ACCESSORIES_BY_FAMILY } from '../data/accessoryRegistry.ts';
import { playClickSound } from '../utils/soundEffects.ts';

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

  const { definition, status, ownedItem, effectiveMagicalPower, upgradeRecommendation } = evaluated;
  const rarity = ownedItem ? ownedItem.rarity : definition.baseRarity;
  const style = THEME_CONFIG.rarityMap[rarity] || THEME_CONFIG.rarityMap.COMMON;
  const familyChain = ACCESSORIES_BY_FAMILY[definition.familyId] || [definition];

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
        style={{ border: `1px solid ${style.border}`, boxShadow: `0 10px 40px -5px ${style.glow}` }}
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <div className="card-icon-box" style={{ width: '56px', height: '56px', fontSize: '2rem', borderColor: style.border }}>
            {definition.iconEmoji}
          </div>
          <div>
            <h2 style={{ color: style.color, fontSize: '1.4rem', fontWeight: 800 }}>
              {ownedItem?.displayName || definition.name}
            </h2>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px', flexWrap: 'wrap' }}>
              <span style={{ color: style.color, fontWeight: 700, fontSize: '0.85rem' }}>{style.label}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>• {definition.category}</span>
              <span style={{ color: statusColor, fontWeight: 700, fontSize: '0.85rem' }}>• {status}</span>
              <span className="mp-pill">
                {effectiveMagicalPower > 0 ? `+${effectiveMagicalPower} Active MP` : `0 Active MP`}
              </span>
            </div>
          </div>
        </div>

        {upgradeRecommendation && (
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '10px',
              padding: '10px 14px',
              marginBottom: '16px',
              fontSize: '0.85rem'
            }}
          >
            <strong style={{ color: 'var(--status-upgradable)' }}>⚡ Direct Upgrade Available:</strong> Upgrades to{' '}
            <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{upgradeRecommendation.nextTierName}</span> for +
            {upgradeRecommendation.additionalMp} MP (via {upgradeRecommendation.nextSource}).
          </div>
        )}

        <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '18px' }}>
          <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.8px', fontWeight: 700 }}>
            Item Description & Lore (CraftersMC Wiki)
          </span>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', color: '#D1D5DB', marginTop: '8px', lineHeight: 1.6 }}>
            {definition.loreLines.map((line, idx) => (
              <div key={idx}>{line}</div>
            ))}
          </div>
        </div>

        {ownedItem && (
          <div style={{ marginBottom: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ background: 'rgba(255, 184, 0, 0.08)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255, 184, 0, 0.2)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 600 }}>Active Reforge</span>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' }}>{ownedItem.reforge || 'None'}</div>
            </div>
            <div style={{ background: 'rgba(0, 229, 255, 0.08)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(0, 229, 255, 0.2)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>Stat Enrichment</span>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' }}>{ownedItem.enrichment || 'None'}</div>
            </div>
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.8px', fontWeight: 700 }}>
            CraftersMC Obtaining Requirement
          </span>
          <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: '4px', fontWeight: 600 }}>
            📍 {definition.source}
          </div>
          {definition.npcCost && (
            <div style={{ fontSize: '0.88rem', color: 'var(--accent-gold)', marginTop: '4px', fontWeight: 600 }}>
              💰 NPC Price: {definition.npcCost}
            </div>
          )}
          {definition.stage && (
            <div style={{ fontSize: '0.82rem', color: 'var(--accent-cyan)', marginTop: '2px' }}>
              🏷️ Progression Milestone: {definition.stage}
            </div>
          )}
        </div>

        {familyChain.length > 1 && (
          <div>
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.8px', fontWeight: 700 }}>
              Upgrade Family Hierarchy
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
              {familyChain.map(tierItem => {
                const isThis = tierItem.id === definition.id;
                const tierStyle = THEME_CONFIG.rarityMap[tierItem.baseRarity];
                return (
                  <span
                    key={tierItem.id}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      background: isThis ? 'rgba(255, 184, 0, 0.2)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${isThis ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)'}`,
                      color: tierStyle?.color || '#FFFFFF'
                    }}
                  >
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
