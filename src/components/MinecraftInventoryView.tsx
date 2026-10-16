import React from 'react';
import { EvaluatedAccessory } from '../data/accessoryTypes.ts';
import { THEME_CONFIG } from '../config/themeConfig.ts';
import { playEquipSound, playClickSound } from '../utils/soundEffects.ts';
import { AccessoryIcon } from './AccessoryIcon.tsx';
import { evaluateAccessoryPrice } from '../logic/pricingEngine.ts';

interface MinecraftInventoryViewProps {
  readonly accessories: readonly EvaluatedAccessory[];
  readonly onSelectAccessory: (acc: EvaluatedAccessory) => void;
  readonly defaultBagNumber?: number;
}

const SLOTS_PER_PAGE = 45; // 9 columns x 5 rows, exactly like Image 2

export const MinecraftInventoryView: React.FC<MinecraftInventoryViewProps> = ({
  accessories,
  onSelectAccessory,
  defaultBagNumber = 1
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [hoveredItem, setHoveredItem] = React.useState<EvaluatedAccessory | null>(null);
  const [tooltipPos, setTooltipPos] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const totalPages = Math.max(1, Math.ceil(accessories.length / SLOTS_PER_PAGE));

  // Reset page if filtered items exceed available pages
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const pageItems = React.useMemo(() => {
    const start = (currentPage - 1) * SLOTS_PER_PAGE;
    return accessories.slice(start, start + SLOTS_PER_PAGE);
  }, [accessories, currentPage]);

  // Pad slots up to 45 so grid remains consistent 9x5 double-chest layout
  const gridSlots = React.useMemo(() => {
    const slots: (EvaluatedAccessory | null)[] = [...pageItems];
    while (slots.length < SLOTS_PER_PAGE) {
      slots.push(null);
    }
    return slots;
  }, [pageItems]);

  const handleMouseMove = (e: React.MouseEvent) => {
    // Offset tooltip slightly from cursor and keep inside viewport
    const x = Math.min(e.clientX + 14, window.innerWidth - 320);
    const y = Math.min(e.clientY + 14, window.innerHeight - 340);
    setTooltipPos({ x, y });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      playClickSound();
      setCurrentPage(p => p - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      playClickSound();
      setCurrentPage(p => p + 1);
    }
  };

  // Determine bag number label (mirrors Image 2's "Accessory Bag [11]")
  const bagNumber = defaultBagNumber > 1 ? defaultBagNumber : currentPage;

  return (
    <div className="mc-gui-wrapper">
      <div className="mc-gui-container" onMouseMove={handleMouseMove} role="region" aria-label="Minecraft Accessory Bag Inventory">
        {/* Container Header */}
        <div className="mc-gui-header">
          <span className="mc-gui-title">Accessory Bag [{bagNumber}]</span>
          <span className="mc-gui-close" title="Minecraft Chest Window">✕</span>
        </div>

        {/* 9x5 Slot Grid */}
        <div className="mc-gui-grid" role="grid" aria-label="Accessory Slots">
          {gridSlots.map((item, idx) => {
            if (!item) {
              return <div key={`empty-${idx}`} className="mc-slot empty" aria-hidden="true" />;
            }

            const { definition, status } = item;
            const isOwned = status === 'OWNED';
            const isUpgradable = status === 'UPGRADABLE_NEXT';
            const isMissing = status === 'MISSING';

            return (
              <div
                key={definition.id}
                className={`mc-slot occupied ${isOwned ? 'slot-owned' : ''} ${isUpgradable ? 'slot-upgradable' : ''} ${isMissing ? 'slot-missing' : ''}`}
                tabIndex={0}
                role="gridcell"
                aria-label={`${definition.name} (${isUpgradable ? 'Missing, Upgradable' : status})`}
                onClick={() => {
                  playEquipSound();
                  onSelectAccessory(item);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    playEquipSound();
                    onSelectAccessory(item);
                  }
                }}
                onMouseEnter={() => setHoveredItem(item)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <AccessoryIcon
                  id={definition.id}
                  name={definition.name}
                  fallbackEmoji={definition.iconEmoji}
                  size={32}
                />

                {/* Status Indicator Dots */}
                <div className="mc-slot-badge-container">
                  {isUpgradable ? (
                    <>
                      <span className="mc-slot-dot dot-missing" title="Missing from bag" />
                      <span className="mc-slot-dot dot-upgradable" title="Direct upgrade available" />
                    </>
                  ) : isMissing ? (
                    <span className="mc-slot-dot dot-missing" title="Missing from bag" />
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Navigation & Controls */}
        <div className="mc-gui-footer">
          <button
            type="button"
            className="mc-gui-btn"
            disabled={currentPage <= 1}
            onClick={handlePrevPage}
            aria-label="Previous page"
          >
            ◀ Prev Page
          </button>

          <span className="mc-gui-page-info">
            Page {currentPage} of {totalPages} ({accessories.length} Items)
          </span>

          <button
            type="button"
            className="mc-gui-btn"
            disabled={currentPage >= totalPages}
            onClick={handleNextPage}
            aria-label="Next page"
          >
            Next Page ▶
          </button>
        </div>
      </div>

      {/* Floating Minecraft Tooltip on Hover */}
      {hoveredItem && (
        <MinecraftTooltip item={hoveredItem} pos={tooltipPos} />
      )}
    </div>
  );
};

interface TooltipProps {
  readonly item: EvaluatedAccessory;
  readonly pos: { x: number; y: number };
}

const MinecraftTooltip: React.FC<TooltipProps> = ({ item, pos }) => {
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
        <div style={{ color: '#5555FF', fontSize: '0.9rem' }}>
          Reforge: {ownedItem.reforge}
        </div>
      )}
      {ownedItem?.enrichment && (
        <div style={{ color: '#00AAAA', fontSize: '0.9rem' }}>
          ✦ {ownedItem.enrichment}
        </div>
      )}

      {/* Status Tags */}
      <div style={{ margin: '4px 0', fontSize: '0.95rem' }}>
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
      <div style={{ color: '#55FFFF', margin: '4px 0', fontWeight: 'bold' }}>
        Magical Power: +{effectiveMagicalPower > 0 ? effectiveMagicalPower : style.magicalPower} MP
      </div>

      {/* Pricing / Obtaining Info */}
      <div style={{ color: '#FFAA00', fontSize: '0.9rem', marginTop: '4px' }}>
        {priceInfo.primaryMethod === 'BAZAAR_CRAFT' && (
          <div style={{ color: '#55FF55' }}>🌾 Craft: ~{priceInfo.displayLabel} (Bazaar)</div>
        )}
        {priceInfo.primaryMethod === 'AUCTION' && (
          <div style={{ color: '#FFFF55' }}>🏛️ AH: ~{priceInfo.displayLabel}</div>
        )}
        {priceInfo.primaryMethod === 'NPC_SHOP' && (
          <div style={{ color: '#FFAA00' }}>🪙 {priceInfo.displayLabel}</div>
        )}
        {priceInfo.auction && priceInfo.primaryMethod !== 'AUCTION' && (
          <div style={{ color: '#AAAAAA', fontSize: '0.82rem' }}>
            AH Range: Min {priceInfo.auction.minPrice >= 1000000 ? `${(priceInfo.auction.minPrice / 1000000).toFixed(1)}M` : `${Math.round(priceInfo.auction.minPrice / 1000)}K`} - Avg {priceInfo.auction.avgPrice >= 1000000 ? `${(priceInfo.auction.avgPrice / 1000000).toFixed(1)}M` : `${Math.round(priceInfo.auction.avgPrice / 1000)}K`}
          </div>
        )}
      </div>

      {/* Rarity & Footer */}
      <div className="mc-tooltip-footer" style={{ color: style.color }}>
        {style.label} ACCESSORY
      </div>
      <div style={{ color: '#777777', fontSize: '0.8rem', marginTop: '2px' }}>
        (Click to view crafting recipe & details)
      </div>
    </div>
  );
};
