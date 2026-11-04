import React from 'react';
import { ArrowUp, Activity, CheckCircle, Database, Cpu, Radio } from 'lucide-react';

const FOOTER_NAV_LINKS = [
  { id: 'overview', label: '01 / OVERVIEW' },
  { id: 'monitor', label: '02 / COCKPIT' },
  { id: 'analytics', label: '03 / TELEMETRY' },
  { id: 'history', label: '04 / VAULT' },
];

/**
 * Footer Component — High-Fashion Minimalist Editorial & Techwear Edition
 * References: Images 1 (SHADXW), 2 (Aura store), 4 (lab. 001)
 */
export default function Footer({
  activeTab,
  onSelectTab,
  connectionStatus = 'offline',
  isMonitoring = false,
  fps = 0,
  latencyMs = 0,
}) {
  const isOnline = connectionStatus === 'online';

  const handleNavClick = (tabId) => {
    onSelectTab?.(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        borderTop: '1px solid var(--border-light)',
        width: '100%',
        marginTop: 'auto',
      }}
      role="contentinfo"
    >
      <div
        style={{
          maxWidth: '1540px',
          margin: '0 auto',
          padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1rem, 3vw, 2.5rem) 2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2.5rem',
        }}
      >
        {/* Top Header Block */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '2rem',
            paddingBottom: '2rem',
            borderBottom: '1px solid var(--border-light)',
          }}
        >
          {/* Brand & Manifesto */}
          <div style={{ maxWidth: '480px' }}>
            <div
              style={{
                fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
                fontSize: '1.4rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
              }}
            >
              DRIVEGUARD AI
            </div>
            <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Minimalist optical driver attentiveness and computer-vision telemetry platform. MediaPipe 468-point facial mesh with zero-latency edge inference.
            </p>
          </div>

          {/* Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              SYSTEM DIRECTORY
            </span>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {FOOTER_NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: '0.74rem',
                    color: activeTab === link.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: activeTab === link.id ? 700 : 500,
                    padding: 0,
                  }}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Line: Metadata & Back to Top */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontFamily: "var(--font-mono, monospace)",
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            ACCOUNT ID — 004.812 // SYS.04 • AIR-GAPPED SQLITE VAULT
          </div>

          <button
            onClick={handleScrollToTop}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'none',
              border: '1px solid var(--border-light)',
              padding: '0.35rem 0.75rem',
              borderRadius: '2px',
              color: 'var(--text-primary)',
              fontFamily: "var(--font-mono, monospace)",
              fontSize: '0.72rem',
              cursor: 'pointer',
            }}
          >
            <span>BACK TO TOP</span>
            <ArrowUp size={12} />
          </button>
        </div>
      </div>
    </footer>
  );
}
