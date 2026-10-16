import React from 'react';
import { EvaluatedAccessory } from '../data/accessoryTypes.ts';
import { THEME_CONFIG } from '../config/themeConfig.ts';
import { playEquipSound } from '../utils/soundEffects.ts';

interface AccessoryCardProps {
  readonly evaluated: EvaluatedAccessory;
  readonly onClick: () => void;
}

export const AccessoryCard: React.FC<AccessoryCardProps> = ({ evaluated, onClick }) => {
  const { definition, status, ownedItem, effectiveMagicalPower } = evaluated;
  const rarity = ownedItem ? ownedItem.rarity : definition.baseRarity;
  const style = THEME_CONFIG.rarityMap[rarity] || THEME_CONFIG.rarityMap.COMMON;

  const isOwned = status === 'OWNED';
  const isMissing = status === 'MISSING';
  const isUpgradable = status === 'UPGRADABLE_NEXT';
  const isPrevious = status === 'UPGRADED_PREVIOUS';

  const statusLabel = isOwned
    ? 'Owned'
    : isUpgradable
    ? 'Upgradable'
    : isPrevious
    ? 'Replaced'
    : 'Missing';

  const statusColor = isOwned
    ? 'var(--status-owned)'
    : isUpgradable
    ? 'var(--status-upgradable)'
    : isPrevious
    ? 'var(--text-muted)'
    : 'var(--status-missing)';

  return (
    <article
      className={`glass-card accessory-card ${isMissing ? 'status-missing' : ''}`}
      style={{
        border: `1px solid ${isOwned ? style.border : 'var(--border-card)'}`,
        boxShadow: isOwned ? `0 4px 20px -5px ${style.glow}` : 'none'
      }}
      onClick={() => {
        playEquipSound();
        onClick();
      }}
      tabIndex={0}
      role="button"
      aria-label={`${definition.name} (${statusLabel})`}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          playEquipSound();
          onClick();
        }
      }}
    >
      <div className="card-top">
        <div className="card-icon-box" style={{ borderColor: style.border }}>
          <span>{definition.iconEmoji}</span>
        </div>

        <div className="card-meta">
          <div className="card-title" style={{ color: style.color }} title={definition.name}>
            {ownedItem?.displayName || definition.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
            <span className="card-rarity" style={{ color: style.color }}>
              {style.label}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>• {definition.category}</span>
          </div>
        </div>
      </div>

      <p
        style={{
          fontSize: '0.82rem',
          color: 'var(--text-secondary)',
          margin: '4px 0 10px 0',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '2.4em'
        }}
      >
        {definition.description}
      </p>

      {ownedItem?.reforge && (
        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              padding: '2px 6px',
              borderRadius: '4px',
              background: 'rgba(255, 184, 0, 0.15)',
              color: 'var(--accent-gold)'
            }}
          >
            Reforge: {ownedItem.reforge}
          </span>
          {ownedItem.enrichment && (
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: '4px',
                background: 'rgba(0, 229, 255, 0.15)',
                color: 'var(--accent-cyan)'
              }}
            >
              ✦ {ownedItem.enrichment}
            </span>
          )}
        </div>
      )}

      <div className="card-badge-row">
        <span
          style={{
            fontWeight: 700,
            color: statusColor,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: statusColor }} />
          {statusLabel}
        </span>

        <span className="mp-pill">
          {effectiveMagicalPower > 0 ? `+${effectiveMagicalPower} MP` : `0 MP`}
        </span>
      </div>
    </article>
  );
};
