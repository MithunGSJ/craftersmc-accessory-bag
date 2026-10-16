import React from 'react';
import { HeroHeader } from './components/HeroHeader.tsx';
import { StatsOverview } from './components/StatsOverview.tsx';
import { AccessoryFilterBar, StatusFilter } from './components/AccessoryFilterBar.tsx';
import { AccessoryCard } from './components/AccessoryCard.tsx';
import { AccessoryModal } from './components/AccessoryModal.tsx';
import { RecommendationsPanel } from './components/RecommendationsPanel.tsx';
import { CustomLookupModal } from './components/CustomLookupModal.tsx';
import {
  loadSampleProfile,
  loadFromBase64Nbt,
  fetchPlayerFromApi,
  createSimulatedProfileForPlayer,
  LoadedProfileData
} from './logic/profileLoader.ts';
import { evaluatePlayerAccessories } from './logic/accessoryMatcher.ts';
import { calculateBagStatistics } from './logic/statsCalculator.ts';
import { EvaluatedAccessory, AccessoryCategory } from './data/accessoryTypes.ts';
import { ItemRarity, THEME_CONFIG } from './config/themeConfig.ts';

export const App: React.FC = () => {
  const [currentProfileId, setCurrentProfileId] = React.useState('endgame');
  const [profileData, setProfileData] = React.useState<LoadedProfileData>(() =>
    loadSampleProfile('endgame')
  );

  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>('ALL');
  const [categoryFilter, setCategoryFilter] = React.useState<'ALL' | AccessoryCategory>('ALL');
  const [rarityFilter, setRarityFilter] = React.useState<'ALL' | ItemRarity>('ALL');
  const [hideSuperseded, setHideSuperseded] = React.useState(true);

  const [selectedAccessory, setSelectedAccessory] = React.useState<EvaluatedAccessory | null>(null);
  const [isLookupOpen, setIsLookupOpen] = React.useState(false);
  const [isFetchingApi, setIsFetchingApi] = React.useState(false);
  const [apiError, setApiError] = React.useState<string | null>(null);

  // Evaluate accessories
  const evaluatedAll = React.useMemo(() => {
    return evaluatePlayerAccessories(profileData.items, { hideSupersededTiers: hideSuperseded });
  }, [profileData.items, hideSuperseded]);

  // Compute statistics
  const bagStats = React.useMemo(() => {
    return calculateBagStatistics(evaluatedAll);
  }, [evaluatedAll]);

  // Filtered view
  const visibleAccessories = React.useMemo(() => {
    return evaluatedAll.filter(item => {
      // Status filter
      if (statusFilter === 'OWNED' && item.status !== 'OWNED') return false;
      if (statusFilter === 'MISSING' && item.status !== 'MISSING') return false;
      if (statusFilter === 'UPGRADABLE' && item.status !== 'UPGRADABLE_NEXT') return false;

      // Category filter
      if (categoryFilter !== 'ALL' && item.definition.category !== categoryFilter) return false;

      // Rarity filter
      const itemRarity = item.ownedItem ? item.ownedItem.rarity : item.definition.baseRarity;
      if (rarityFilter !== 'ALL' && itemRarity !== rarityFilter) return false;

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = item.definition.name.toLowerCase().includes(q);
        const descMatch = item.definition.description.toLowerCase().includes(q);
        const sourceMatch = item.definition.source.toLowerCase().includes(q);
        const reforgeMatch = item.ownedItem?.reforge?.toLowerCase().includes(q) || false;
        const enrichMatch = item.ownedItem?.enrichment?.toLowerCase().includes(q) || false;
        if (!nameMatch && !descMatch && !sourceMatch && !reforgeMatch && !enrichMatch) {
          return false;
        }
      }

      return true;
    });
  }, [evaluatedAll, statusFilter, categoryFilter, rarityFilter, searchQuery]);

  const handleSelectSample = (id: string) => {
    setCurrentProfileId(id);
    setProfileData(loadSampleProfile(id));
  };

  const handleApiLookup = async (username: string, apiKey: string) => {
    setIsFetchingApi(true);
    setApiError(null);
    try {
      const data = await fetchPlayerFromApi(username, apiKey);
      setProfileData(data);
      setCurrentProfileId('custom');
      setIsLookupOpen(false);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Unknown error during API lookup');
    } finally {
      setIsFetchingApi(false);
    }
  };

  const handleImportBase64 = (base64: string, name: string) => {
    const data = loadFromBase64Nbt(base64, name);
    setProfileData(data);
    setCurrentProfileId('custom');
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
        hideSuperseded={hideSuperseded}
        onToggleHideSuperseded={() => setHideSuperseded(!hideSuperseded)}
      />

      {visibleAccessories.length > 0 ? (
        <section className="accessory-grid" aria-label="Accessories catalog">
          {visibleAccessories.map(item => (
            <AccessoryCard
              key={item.definition.id}
              evaluated={item}
              onClick={() => setSelectedAccessory(item)}
            />
          ))}
        </section>
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
      </footer>

      <AccessoryModal
        evaluated={selectedAccessory}
        onClose={() => setSelectedAccessory(null)}
      />

      <CustomLookupModal
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
        onLookupApi={handleApiLookup}
        onImportBase64={handleImportBase64}
        onLoadSimulated={handleLoadSimulated}
        isLoading={isFetchingApi}
        errorMessage={apiError}
      />
    </div>
  );
};
