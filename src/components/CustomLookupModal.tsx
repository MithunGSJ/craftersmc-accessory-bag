import React from 'react';
import { playClickSound } from '../utils/soundEffects.ts';

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
  const contentRef = React.useRef<HTMLDivElement>(null);
  const previousFocusRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setUsername('');
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && !isLoading) {
          playClickSound();
          onClose();
        }
        if (e.key === 'Tab' && contentRef.current) {
          const focusable = contentRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );
          if (focusable.length === 0) return;
          const [first, last] = [focusable[0], focusable[focusable.length - 1]];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      };
      window.addEventListener('keydown', onKey);
      return () => {
        window.removeEventListener('keydown', onKey);
        document.body.style.overflow = originalOverflow;
        previousFocusRef.current?.focus();
      };
    }
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const handleApiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !username.trim()) return;
    await onLookupApi(username.trim());
  };

  const handleQuickSimulate = () => {
    if (isLoading) return;
    playClickSound();
    const targetName = username.trim() || 'DarkKing0098994';
    onLoadSimulated(targetName);
    onClose();
  };

  const handleClose = () => {
    if (isLoading) return;
    playClickSound();
    onClose();
  };

  return (
    <div
      className="modal-backdrop"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lookup-dialog-title"
    >
      <div
        ref={contentRef}
        className="glass-card modal-content"
        style={{ maxWidth: '500px' }}
        onClick={e => e.stopPropagation()}
      >
        <button
          className="modal-close-btn"
          onClick={handleClose}
          aria-label="Close modal"
          disabled={isLoading}
        >
          ✕
        </button>

        <h2 id="lookup-dialog-title" style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '6px', color: '#FFFFFF' }}>
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
              disabled={isLoading}
            >
              ⚡ Test as &quot;{username.trim() || 'DarkKing0098994'}&quot; (Offline Bag)
            </button>
          </div>
        )}

        <form onSubmit={handleApiSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label
              htmlFor="lookup-username-input"
              style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}
            >
              GAMERTAG / USERNAME *
            </label>
            <input
              id="lookup-username-input"
              type="text"
              className="search-input"
              style={{ paddingLeft: '14px' }}
              placeholder="e.g. DarkKing0098994"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
              disabled={isLoading}
            />
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
              disabled={isLoading}
            >
              ⚡ Test Player
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
