import React from 'react';
import { EvaluatedAccessory } from '../data/accessoryTypes.ts';
import { THEME_CONFIG } from '../config/themeConfig.ts';
import { evaluateAccessoryPrice } from '../logic/pricingEngine.ts';

interface MinecraftTooltipProps {
  readonly item: EvaluatedAccessory;
  readonly pos: { x: number; y: number };
}

export const MinecraftTooltip: React.FC<MinecraftTooltipProps> = ({ item, pos }) => {
  const { definition, status, ownedItem, effectiveMagicalPower } = item;
  const rarity = ownedItem ? ownedItem.rarity : definition.baseRarity;
  const style = THEME_CONFIG.rarityMap[rarity] || THEME_CONFIG.rarityMap.COMMON;
  const priceInfo = evaluateAccessoryPrice(definition);

  const isUpgradable = status === 'UPGRADABLE_NEXT';
  const isOwned = status === 'OWNED';
  const isMissing = status === 'MISSING';

  return (
    <div
      className="mc-tooltip"
      style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
      role="tooltip"
    >
      {/* Item Name */}
      <div className="mc-tooltip-title" style={{ color: style.color }}>
        {ownedItem?.displayName || definition.name}
      </div>

      {/* Reforge & Enrichment */}
      {ownedItem?.reforge && (
        <div style={{ color: '#5555FF', fontSize: '16px' }}>
          Reforge: {ownedItem.reforge}
        </div>
      )}
      {ownedItem?.enrichment && (
        <div style={{ color: '#00AAAA', fontSize: '16px' }}>
          ✦ {ownedItem.enrichment}
        </div>
      )}

      {/* Status Tags */}
      <div style={{ margin: '4px 0', fontSize: '18px' }}>
        {isUpgradable ? (
          <>
            <span style={{ color: '#FF5555' }}>✖ MISSING</span>{' '}
            <span style={{ color: '#FFAA00' }}>⚡ UPGRADABLE</span>
          </>
        ) : isOwned ? (
          <span style={{ color: '#55FF55' }}>✔ OWNED</span>
        ) : isMissing ? (
          <span style={{ color: '#FF5555' }}>✖ MISSING</span>
        ) : (
          <span style={{ color: '#AAAAAA' }}>• {status}</span>
        )}
      </div>

      {/* Lore Description */}
      <div className="mc-tooltip-desc">
        {definition.description}
      </div>

      {/* Magical Power */}
      <div style={{ color: '#55FFFF', margin: '4px 0', fontWeight: 'bold', fontSize: '18px' }}>
        Magical Power: +{effectiveMagicalPower > 0 ? effectiveMagicalPower : style.magicalPower} MP
      </div>

      {/* Pricing / Obtaining Info */}
      <div style={{ color: '#FFAA00', fontSize: '16px', marginTop: '4px' }}>
        {priceInfo.primaryMethod === 'BAZAAR_CRAFT' && (
          <div style={{ color: '#55FF55' }}>
            🌾 {priceInfo.displayLabel.startsWith('Craft:') ? priceInfo.displayLabel : `Craft: ~${priceInfo.displayLabel}`} (Bazaar)
          </div>
        )}
        {priceInfo.primaryMethod === 'AUCTION' && (
          <div style={{ color: '#FFFF55' }}>🏛️ AH: ~{priceInfo.displayLabel}</div>
        )}
        {priceInfo.primaryMethod === 'NPC_SHOP' && (
          <div style={{ color: '#FFAA00' }}>🪙 {priceInfo.displayLabel}</div>
        )}
        {priceInfo.auction && priceInfo.primaryMethod !== 'AUCTION' && (
          <div style={{ color: '#AAAAAA', fontSize: '15px' }}>
            AH Range: Min {priceInfo.auction.minPrice >= 1000000 ? `${(priceInfo.auction.minPrice / 1000000).toFixed(1)}M` : `${Math.round(priceInfo.auction.minPrice / 1000)}K`} - Avg {priceInfo.auction.avgPrice >= 1000000 ? `${(priceInfo.auction.avgPrice / 1000000).toFixed(1)}M` : `${Math.round(priceInfo.auction.avgPrice / 1000)}K`}
          </div>
        )}
      </div>

      {/* Rarity & Footer */}
      <div className="mc-tooltip-footer" style={{ color: style.color }}>
        {style.label} ACCESSORY
      </div>
      <div style={{ color: '#888888', fontSize: '14px', marginTop: '2px' }}>
        (Click to view crafting recipe &amp; details)
      </div>
    </div>
  );
};
