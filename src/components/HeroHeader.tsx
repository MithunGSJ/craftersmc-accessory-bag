import React from 'react';
import { THEME_CONFIG } from '../config/themeConfig.ts';
import { SAMPLE_PROFILES } from '../data/sampleProfiles.ts';
import { playClickSound, setSoundEnabled, isSoundEnabled } from '../utils/soundEffects.ts';

interface HeroHeaderProps {
  readonly currentProfileId: string;
  readonly onSelectSample: (id: string) => void;
  readonly onOpenCustomModal: () => void;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({
  currentProfileId,
  onSelectSample,
  onOpenCustomModal
}) => {
  const [soundOn, setSoundOn] = React.useState(isSoundEnabled());

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playClickSound();
  };

  return (
    <header className="hero-header glass-card">
      <div className="hero-badge">
        <span>✨ SkyBlock Talisman Audit</span>
      </div>

      <h1 className="hero-title">{THEME_CONFIG.appTitle}</h1>
      <p className="hero-subtitle">{THEME_CONFIG.appSubtitle}</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '18px' }}>
        {SAMPLE_PROFILES.map(sample => {
          const isActive = currentProfileId === sample.id;
          return (
            <button
              key={sample.id}
              className={`pill-btn ${isActive ? 'active' : ''}`}
              onClick={() => {
                playClickSound();
                onSelectSample(sample.id);
              }}
              title={sample.description}
            >
              <span>🥚</span>
              <span>{sample.name}</span>
            </button>
          );
        })}

        <button
          className="pill-btn"
          style={{ borderColor: 'var(--accent-cyan)' }}
          onClick={() => {
            playClickSound();
            onOpenCustomModal();
          }}
        >
          <span>🔍</span>
          <span>Lookup Player</span>
        </button>

        <button
          className="pill-btn"
          onClick={handleToggleSound}
          title="Toggle UI Sound Effects"
        >
          <span>{soundOn ? '🔊 Audio ON' : '🔇 Audio OFF'}</span>
        </button>
      </div>

      <div className="disclaimer-banner compliance-highlight" style={{ margin: '14px auto 0 auto', maxWidth: '850px' }}>
        <span className="compliance-tag">⚖️ Compliance Notice</span>
        <span className="compliance-text">{THEME_CONFIG.legalDisclaimer}</span>
      </div>
    </header>
  );
};
