import React from 'react';
import { AccessoryCategory } from '../data/accessoryTypes.ts';
import { CATEGORIES } from '../data/accessoryRegistry.ts';
import { ItemRarity, THEME_CONFIG } from '../config/themeConfig.ts';
import { playClickSound } from '../utils/soundEffects.ts';

export type StatusFilter = 'ALL' | 'OWNED' | 'MISSING' | 'UPGRADABLE';

interface FilterBarProps {
  readonly searchQuery: string;
  readonly onSearchChange: (query: string) => void;
  readonly statusFilter: StatusFilter;
  readonly onStatusFilterChange: (status: StatusFilter) => void;
  readonly categoryFilter: 'ALL' | AccessoryCategory;
  readonly onCategoryFilterChange: (cat: 'ALL' | AccessoryCategory) => void;
  readonly rarityFilter: 'ALL' | ItemRarity;
  readonly onRarityFilterChange: (rarity: 'ALL' | ItemRarity) => void;
  readonly hideSuperseded: boolean;
  readonly onToggleHideSuperseded: () => void;
}

export const AccessoryFilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  rarityFilter,
  onRarityFilterChange,
  hideSuperseded,
  onToggleHideSuperseded
}) => {
  return (
    <div className="controls-bar">
      <div className="search-and-presets">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search accessory name, reforge, enrichment, or source..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>

        <div className="filter-pills" role="tablist" aria-label="Status filters">
          {(['ALL', 'OWNED', 'MISSING', 'UPGRADABLE'] as const).map(status => (
            <button
              key={status}
              className={`pill-btn ${statusFilter === status ? 'active' : ''}`}
              onClick={() => {
                playClickSound();
                onStatusFilterChange(status);
              }}
            >
              <span>
                {status === 'ALL'
                  ? '🌐 All'
                  : status === 'OWNED'
                  ? '✅ Owned'
                  : status === 'MISSING'
                  ? '❌ Missing'
                  : '⚡ Upgradable'}
              </span>
            </button>
          ))}

          <button
            className={`pill-btn ${hideSuperseded ? 'active' : ''}`}
            onClick={() => {
              playClickSound();
              onToggleHideSuperseded();
            }}
            title="Hide lower tiers when higher tier is already owned"
          >
            <span>{hideSuperseded ? '👁️ Superseded Hidden' : '👁️ Show All Tiers'}</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
        <div className="filter-pills" style={{ flex: 1 }}>
          <button
            className={`pill-btn ${categoryFilter === 'ALL' ? 'active' : ''}`}
            style={{ padding: '6px 12px', fontSize: '0.82rem' }}
            onClick={() => {
              playClickSound();
              onCategoryFilterChange('ALL');
            }}
          >
            All Categories
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`pill-btn ${categoryFilter === cat ? 'active' : ''}`}
              style={{ padding: '6px 12px', fontSize: '0.82rem' }}
              onClick={() => {
                playClickSound();
                onCategoryFilterChange(cat);
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ minWidth: '150px' }}>
          <select
            className="search-input"
            style={{ padding: '8px 12px', fontSize: '0.82rem', height: 'auto', cursor: 'pointer' }}
            value={rarityFilter}
            onChange={e => {
              playClickSound();
              onRarityFilterChange(e.target.value as 'ALL' | ItemRarity);
            }}
            aria-label="Filter by rarity"
          >
            <option value="ALL">All Rarities</option>
            {Object.entries(THEME_CONFIG.rarityMap).map(([key, style]) => (
              <option key={key} value={key}>
                {style.label} (+{style.magicalPower} MP)
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
