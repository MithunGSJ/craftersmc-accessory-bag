import React from 'react';
import { BagStatistics } from '../logic/statsCalculator.ts';

interface StatsOverviewProps {
  readonly stats: BagStatistics;
  readonly playerName: string;
  readonly profileName: string;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, playerName, profileName }) => {
  const mpPercent =
    stats.maxPossibleMagicalPower > 0
      ? Math.round((stats.totalMagicalPower / stats.maxPossibleMagicalPower) * 100)
      : 0;

  return (
    <section className="stats-grid" aria-label="Accessory Bag Statistics">
      <div className="glass-card stat-card" style={{ borderLeft: '4px solid var(--accent-gold)' }}>
        <span className="stat-label">Active Magical Power</span>
        <div className="stat-value" style={{ color: 'var(--accent-gold)' }}>
          {stats.totalMagicalPower} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ {stats.maxPossibleMagicalPower} MP</span>
        </div>
        <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden', marginTop: '4px' }}>
          <div
            style={{
              width: `${Math.min(100, mpPercent)}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #FFB800, #FF55FF)',
              borderRadius: '4px',
              transition: 'width 0.4s ease'
            }}
          />
        </div>
        <span className="stat-subtext">{mpPercent}% of theoretical max potential</span>
      </div>

      <div className="glass-card stat-card" style={{ borderLeft: '4px solid var(--status-owned)' }}>
        <span className="stat-label">Owned Families</span>
        <div className="stat-value" style={{ color: 'var(--status-owned)' }}>
          {stats.ownedCount} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ {stats.totalFamilies}</span>
        </div>
        <span className="stat-subtext">Bag completion: {stats.completionPercentage}%</span>
      </div>

      <div className="glass-card stat-card" style={{ borderLeft: '4px solid var(--status-missing)' }}>
        <span className="stat-label">Missing Accessories</span>
        <div className="stat-value" style={{ color: 'var(--status-missing)' }}>
          {stats.missingCount}
        </div>
        <span className="stat-subtext">Unowned base accessory lines</span>
      </div>

      <div className="glass-card stat-card" style={{ borderLeft: '4px solid var(--status-upgradable)' }}>
        <span className="stat-label">Direct Upgrades</span>
        <div className="stat-value" style={{ color: 'var(--status-upgradable)' }}>
          {stats.upgradableCount}
        </div>
        <span className="stat-subtext">Higher tiers available in-family</span>
      </div>

      <div className="glass-card stat-card" style={{ borderLeft: '4px solid var(--accent-cyan)' }}>
        <span className="stat-label">Player & Reforges</span>
        <div className="stat-value" style={{ fontSize: '1.25rem', color: '#FFFFFF', wordBreak: 'break-all' }}>
          {playerName}
        </div>
        <span className="stat-subtext">
          {profileName} • {stats.reforgeCount} Reforges
        </span>
      </div>
    </section>
  );
};
