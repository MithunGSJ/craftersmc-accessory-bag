import React from 'react';
import { EvaluatedAccessory } from '../data/accessoryTypes.ts';
import { playEquipSound, playClickSound } from '../utils/soundEffects.ts';
import { AccessoryIcon } from './AccessoryIcon.tsx';
import { MinecraftTooltip } from './MinecraftTooltip.tsx';
import { AccessoryCard } from './AccessoryCard.tsx';

interface MinecraftInventoryViewProps {
  readonly accessories: readonly EvaluatedAccessory[];
  readonly onSelectAccessory: (acc: EvaluatedAccessory) => void;
  readonly defaultBagNumber?: number;
}

const SLOTS_PER_PAGE = 45; // 9 columns x 5 rows

export const MinecraftInventoryView: React.FC<MinecraftInventoryViewProps> = ({
  accessories,
  onSelectAccessory,
  defaultBagNumber = 1
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [hoveredItem, setHoveredItem] = React.useState<EvaluatedAccessory | null>(null);
  const [tooltipPos, setTooltipPos] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Separate owned accessories in the bag from missing/upgradable accessories
  // Sort owned accessories by their exact NBT bag slot index (line up order)
  const ownedBagAccessories = React.useMemo(() => {
    return accessories
      .filter(item => item.status === 'OWNED')
      .slice()
      .sort((a, b) => (a.ownedItem?.slot ?? 0) - (b.ownedItem?.slot ?? 0));
  }, [accessories]);

  const missingAndUpgradableAccessories = React.useMemo(() => {
    return accessories.filter(
      item => item.status === 'MISSING' || item.status === 'UPGRADABLE_NEXT'
    );
  }, [accessories]);

  const totalPages = Math.max(1, Math.ceil(ownedBagAccessories.length / SLOTS_PER_PAGE));

  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const pageItems = React.useMemo(() => {
    const start = (currentPage - 1) * SLOTS_PER_PAGE;
    return ownedBagAccessories.slice(start, start + SLOTS_PER_PAGE);
  }, [ownedBagAccessories, currentPage]);

  // Pad slots up to 45 so chest GUI remains consistent 9x5 double-chest layout
  const gridSlots = React.useMemo(() => {
    const slots: (EvaluatedAccessory | null)[] = [...pageItems];
    while (slots.length < SLOTS_PER_PAGE) {
      slots.push(null);
    }
    return slots;
  }, [pageItems]);

  const handleMouseMove = (e: React.MouseEvent) => {
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

  const bagNumber = defaultBagNumber > 1 ? defaultBagNumber : currentPage;

  return (
    <div className="mc-gui-wrapper">
      {/* Minecraft Chest Inventory GUI */}
      <div
        className="mc-gui-container"
        onMouseMove={handleMouseMove}
        role="region"
        aria-label="Minecraft Accessory Bag Inventory"
      >
        {/* Container Header */}
        <div className="mc-gui-header">
          <span className="mc-gui-title">Accessory Bag [{bagNumber}]</span>
          <span className="mc-gui-close" title="Minecraft Chest Window">✕</span>
        </div>

        {/* 9x5 Slot Grid (Owned items in line-up order + empty slot padding) */}
        <div className="mc-gui-grid" role="grid" aria-label="Accessory Slots">
          {gridSlots.map((item, idx) => {
            if (!item) {
              return <div key={`empty-${idx}`} className="mc-slot empty" aria-hidden="true" />;
            }

            const { definition } = item;

            return (
              <div
                key={item.ownedItem?.id || `${definition.id}_${idx}`}
                className="mc-slot occupied slot-owned"
                tabIndex={0}
                role="gridcell"
                aria-label={`${item.ownedItem?.displayName || definition.name} (Owned, Slot ${item.ownedItem?.slot ?? idx})`}
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
            Page {currentPage} of {totalPages} ({ownedBagAccessories.length} Owned in Bag)
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

      {/* Missing & Upgradable Accessories rendered as Card Grid at bottom */}
      {missingAndUpgradableAccessories.length > 0 && (
        <section
          className="mc-missing-section"
          style={{ marginTop: '36px', width: '100%', maxWidth: '1040px' }}
          aria-label="Missing and Upgradable Accessories"
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              flexWrap: 'wrap',
              gap: '12px',
              paddingBottom: '12px',
              borderBottom: '1px solid var(--border-subtle)'
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>⚡ Missing &amp; Upgradable Accessories</span>
                <span
                  style={{
                    fontSize: '0.8rem',
                    padding: '2px 10px',
                    borderRadius: '12px',
                    background: 'rgba(255, 170, 0, 0.15)',
                    color: '#FFAA00',
                    border: '1px solid rgba(255, 170, 0, 0.3)'
                  }}
                >
                  {missingAndUpgradableAccessories.length} Accessories
                </span>
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                Acquisition guides, Bazaar weekly average crafting costs, and Auction pricing
              </p>
            </div>
          </div>

          <div className="accessory-grid" aria-label="Missing & Upgradable accessories list">
            {missingAndUpgradableAccessories.map(item => (
              <AccessoryCard
                key={item.definition.id}
                evaluated={item}
                onClick={() => onSelectAccessory(item)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
