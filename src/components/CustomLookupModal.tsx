import React from 'react';

interface CustomLookupModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onLookupApi: (username: string) => Promise<void>;
  readonly onLoadSimulated: (name: string) => void;
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
}

export const CustomLookupModal: React.FC<CustomLookupModalProps> = ({
  isOpen,
  onClose,
  onLookupApi,
  onLoadSimulated,
  isLoading,
  errorMessage
}) => {
  const [username, setUsername] = React.useState('');

  React.useEffect(() => {
    if (isOpen) {
      setUsername('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    await onLookupApi(username.trim());
  };

  const handleQuickSimulate = () => {
    const targetName = username.trim() || 'DarkKing0098994';
    onLoadSimulated(targetName);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="glass-card modal-content"
        style={{ maxWidth: '500px' }}
        onClick={e => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '6px', color: '#FFFFFF' }}>
          Player Lookup
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
          Query live CraftersMC Public API for any player&apos;s SkyBlock accessory bag.
        </p>

        {errorMessage && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#FCA5A5',
              padding: '12px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              marginBottom: '16px',
              lineHeight: 1.5
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: '4px' }}>⚠️ Lookup Note:</div>
            <div>{errorMessage}</div>
            <button
              type="button"
              className="pill-btn"
              style={{
                marginTop: '10px',
                background: 'var(--accent-gold)',
                color: '#0B0D14',
                borderColor: 'var(--accent-gold)',
                fontSize: '0.8rem',
                fontWeight: 700
              }}
              onClick={handleQuickSimulate}
            >
              ⚡ Test as &quot;{username.trim() || 'DarkKing0098994'}&quot; (Offline Bag)
            </button>
          </div>
        )}

        <form onSubmit={handleApiSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
              PLAYER USERNAME, UUID, OR PIXEL ID *
            </label>
            <input
              type="text"
              className="search-input"
              style={{ paddingLeft: '14px' }}
              placeholder="e.g. DarkKing0098994"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            🔒 <strong>Server-Side Proxy:</strong> Requests are securely authenticated server-side. No API key is exposed to or required from your browser.
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button
              type="submit"
              className="pill-btn active"
              style={{ flex: 1, justifyContent: 'center', padding: '12px' }}
              disabled={isLoading}
            >
              {isLoading ? '⏳ Fetching Profile...' : '🔍 Live API Fetch'}
            </button>

            <button
              type="button"
              className="pill-btn"
              style={{ justifyContent: 'center', padding: '12px', borderColor: 'var(--accent-gold)' }}
              onClick={handleQuickSimulate}
            >
              ⚡ Test Player
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
