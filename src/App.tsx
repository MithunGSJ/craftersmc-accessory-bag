import React from 'react';
import { HeroHeader } from './components/HeroHeader.tsx';
import { StatsOverview } from './components/StatsOverview.tsx';
import { AccessoryFilterBar, StatusFilter } from './components/AccessoryFilterBar.tsx';
import { AccessoryCard } from './components/AccessoryCard.tsx';
import { MinecraftInventoryView } from './components/MinecraftInventoryView.tsx';
import { AccessoryModal } from './components/AccessoryModal.tsx';
import { RecommendationsPanel } from './components/RecommendationsPanel.tsx';
import { CustomLookupModal } from './components/CustomLookupModal.tsx';
import {
  loadSampleProfile,
  fetchPlayerFromApi,
  createSimulatedProfileForPlayer,
  LoadedProfileData
} from './logic/profileLoader.ts';
import { evaluatePlayerAccessories, filterAccessories, sortAccessoriesByBagOrder } from './logic/accessoryMatcher.ts';
import { calculateBagStatistics } from './logic/statsCalculator.ts';
import { hydrateLivePricing } from './logic/pricingEngine.ts';
import { EvaluatedAccessory, AccessoryCategory } from './data/accessoryTypes.ts';
import { ItemRarity, THEME_CONFIG } from './config/themeConfig.ts';

export const App: React.FC = () => {
  const [currentProfileId, setCurrentProfileId] = React.useState('fresh');
  const [profileData, setProfileData] = React.useState<LoadedProfileData>(() =>
    loadSampleProfile('fresh')
  );

  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>('ALL');
  const [categoryFilter, setCategoryFilter] = React.useState<'ALL' | AccessoryCategory>('ALL');
  const [rarityFilter, setRarityFilter] = React.useState<'ALL' | ItemRarity>('ALL');
  const [viewMode, setViewMode] = React.useState<'CHEST' | 'CARDS'>('CHEST');

  const [selectedAccessory, setSelectedAccessory] = React.useState<EvaluatedAccessory | null>(null);
  const [isLookupOpen, setIsLookupOpen] = React.useState(false);
  const [isFetchingApi, setIsFetchingApi] = React.useState(false);
  const [apiError, setApiError] = React.useState<string | null>(null);
  const [, setPricingHydrated] = React.useState(false);

  React.useEffect(() => {
    void hydrateLivePricing().then(ok => {
      if (ok) setPricingHydrated(true);
    });
  }, []);

  // Evaluate accessories
  const evaluatedAll = React.useMemo(() => {
    return evaluatePlayerAccessories(profileData.items, { hideSupersededTiers: false });
  }, [profileData.items]);

  // Compute statistics
  const bagStats = React.useMemo(() => {
    return calculateBagStatistics(evaluatedAll);
  }, [evaluatedAll]);

  // Filtered view sorted by bag slot order
  const visibleAccessories = React.useMemo(() => {
    const filtered = filterAccessories(evaluatedAll, {
      statusFilter,
      categoryFilter,
      rarityFilter,
      searchQuery
    });
    return sortAccessoriesByBagOrder(filtered);
  }, [evaluatedAll, statusFilter, categoryFilter, rarityFilter, searchQuery]);

  const handleSelectSample = (id: string) => {
    setCurrentProfileId(id);
    setProfileData(loadSampleProfile(id));
  };

  const handleApiLookup = async (username: string) => {
    setIsFetchingApi(true);
    setApiError(null);
    try {
      const data = await fetchPlayerFromApi(username);
      setProfileData(data);
      setCurrentProfileId('custom');
      setIsLookupOpen(false);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Unknown error during API lookup');
    } finally {
      setIsFetchingApi(false);
    }
  };

  const handleLoadSimulated = (name: string) => {
    setProfileData(createSimulatedProfileForPlayer(name));
    setCurrentProfileId('custom');
    setIsLookupOpen(false);
  };

  return (
    <div className="app-container">
      <HeroHeader
        currentProfileId={currentProfileId}
        onSelectSample={handleSelectSample}
        onOpenCustomModal={() => setIsLookupOpen(true)}
      />

      <StatsOverview
        stats={bagStats}
        playerName={profileData.playerName}
        profileName={profileData.profileName}
      />

      <RecommendationsPanel
        evaluated={evaluatedAll}
        onSelectAccessory={acc => setSelectedAccessory(acc)}
      />

      <AccessoryFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        rarityFilter={rarityFilter}
        onRarityFilterChange={setRarityFilter}
      />

      <div className="view-mode-tabs" role="tablist" aria-label="View Mode">
        <button
          type="button"
          className={`view-tab-btn ${viewMode === 'CHEST' ? 'active' : ''}`}
          onClick={() => setViewMode('CHEST')}
        >
          🎒 Minecraft Inventory View
        </button>
        <button
          type="button"
          className={`view-tab-btn ${viewMode === 'CARDS' ? 'active' : ''}`}
          onClick={() => setViewMode('CARDS')}
        >
          📋 Card Grid View
        </button>
      </div>

      {visibleAccessories.length > 0 ? (
        viewMode === 'CHEST' ? (
          <MinecraftInventoryView
            accessories={visibleAccessories}
            onSelectAccessory={acc => setSelectedAccessory(acc)}
            defaultBagNumber={1}
          />
        ) : (
          <section className="accessory-grid" aria-label="Accessories catalog">
            {visibleAccessories.map(item => (
              <AccessoryCard
                key={item.definition.id}
                evaluated={item}
                onClick={() => setSelectedAccessory(item)}
              />
            ))}
          </section>
        )
      ) : (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '8px' }}>🔍 No accessories found</p>
          <p style={{ fontSize: '0.88rem' }}>Try broadening your search term or clearing filters.</p>
        </div>
      )}

      <footer className="disclaimer-banner" style={{ marginTop: '48px' }}>
        <div>
          <strong>CraftersMC Public API Accessory Bag Auditor</strong> • Version 1.0.0
        </div>
        <div style={{ marginTop: '6px' }}>{THEME_CONFIG.legalDisclaimer}</div>
        <div style={{ marginTop: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          Accessory data, recipes &amp; item sprites sourced with gratitude from the{' '}
          <a
            href="https://craftersmc.wiki.gg"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent-cyan)', textDecoration: 'underline' }}
          >
            CraftersMC Community Wiki
          </a>
          .
        </div>
      </footer>

      <AccessoryModal
        evaluated={selectedAccessory}
        allEvaluated={evaluatedAll}
        onClose={() => setSelectedAccessory(null)}
        onSelectAccessory={setSelectedAccessory}
      />

      <CustomLookupModal
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
        onLookupApi={handleApiLookup}
        onLoadSimulated={handleLoadSimulated}
        isLoading={isFetchingApi}
        errorMessage={apiError}
      />
    </div>
  );
};
