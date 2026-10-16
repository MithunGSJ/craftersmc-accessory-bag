import React from 'react';
import { playClickSound } from '../utils/soundEffects.ts';

interface CustomLookupModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onLookupApi: (username: string, apiKey: string) => Promise<void>;
  readonly onImportBase64: (base64: string, name: string) => void;
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
}

export const CustomLookupModal: React.FC<CustomLookupModalProps> = ({
  isOpen,
  onClose,
  onLookupApi,
  onImportBase64,
  isLoading,
  errorMessage
}) => {
  const [tab, setTab] = React.useState<'api' | 'nbt'>('api');
  const [username, setUsername] = React.useState('');
  const [apiKey, setApiKey] = React.useState('');
  const [rawBase64, setRawBase64] = React.useState('');
  const [customName, setCustomName] = React.useState('');

  if (!isOpen) return null;

  const handleApiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    await onLookupApi(username.trim(), apiKey.trim());
  };

  const handleNbtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawBase64.trim()) return;
    onImportBase64(rawBase64.trim(), customName.trim() || 'Custom Player');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="glass-card modal-content"
        style={{ maxWidth: '520px' }}
        onClick={e => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '6px', color: '#FFFFFF' }}>
          Player Lookup & Data Import
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
          Query live CraftersMC Public API or paste raw Base64 NBT accessory bag string.
        </p>

        <div className="filter-pills" style={{ marginBottom: '18px' }}>
          <button
            className={`pill-btn ${tab === 'api' ? 'active' : ''}`}
            onClick={() => {
              playClickSound();
              setTab('api');
            }}
          >
            Live CraftersMC API Lookup
          </button>
          <button
            className={`pill-btn ${tab === 'nbt' ? 'active' : ''}`}
            onClick={() => {
              playClickSound();
              setTab('nbt');
            }}
          >
            Direct Base64 NBT Paste
          </button>
        </div>

        {errorMessage && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#FCA5A5',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              marginBottom: '16px'
            }}
          >
            ⚠️ {errorMessage}
          </div>
        )}

        {tab === 'api' ? (
          <form onSubmit={handleApiSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
                PLAYER USERNAME, UUID, OR PIXEL ID *
              </label>
              <input
                type="text"
                className="search-input"
                style={{ paddingLeft: '14px' }}
                placeholder="e.g. DeathWish_99 or 069a79f4-44e9..."
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
                CRAFTERSMC API KEY (OPTIONAL)
              </label>
              <input
                type="password"
                className="search-input"
                style={{ paddingLeft: '14px' }}
                placeholder="Leave blank for public endpoints or enter developer key"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="pill-btn active"
              style={{ justifyContent: 'center', padding: '12px', marginTop: '6px' }}
              disabled={isLoading}
            >
              {isLoading ? '⏳ Fetching Profile...' : '🔍 Fetch Accessory Bag'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleNbtSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
                PLAYER ALIAS
              </label>
              <input
                type="text"
                className="search-input"
                style={{ paddingLeft: '14px' }}
                placeholder="e.g. ImportedBag_1"
                value={customName}
                onChange={e => setCustomName(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
                BASE64 GZIPPED NBT DATA *
              </label>
              <textarea
                className="search-input"
                style={{ padding: '10px 14px', height: '110px', resize: 'vertical', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}
                placeholder="H4sIAAAAAAAA/..."
                value={rawBase64}
                onChange={e => setRawBase64(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="pill-btn active"
              style={{ justifyContent: 'center', padding: '12px', marginTop: '6px' }}
            >
              📥 Decode & Load Bag
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
