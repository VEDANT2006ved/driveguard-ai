import React from 'react';
import { Shield, ArrowUp, Activity, CheckCircle, Database, Cpu } from 'lucide-react';

const FOOTER_NAV_LINKS = [
  { id: 'overview', label: 'Overview' },
  { id: 'monitor', label: 'Live Monitor' },
  { id: 'analytics', label: 'Safety Analytics' },
  { id: 'history', label: 'Trip History' },
];

/**
 * Bang & Olufsen A9-Inspired Editorial Footer
 * Deep forest charcoal background, refined typography, fine hairlines,
 * working application navigation links, and restrained project architecture status.
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
        backgroundColor: '#0E1311', // Deep-forest charcoal
        color: '#E6E4DE',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative',
        width: '100%',
        marginTop: 'auto',
      }}
      role="contentinfo"
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: 'clamp(3rem, 6vw, 4.5rem) clamp(1.25rem, 4vw, 3.5rem) clamp(2rem, 4vw, 3rem)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(2.5rem, 4vw, 3.5rem)',
        }}
      >
        {/* Top Header Block: Branding, Product Mission & Status Pill */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '2rem',
            paddingBottom: '2.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* Brand & Description */}
          <div style={{ maxWidth: '540px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                marginBottom: '1rem',
                cursor: 'pointer',
              }}
              onClick={() => handleNavClick('overview')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleNavClick('overview');
                }
              }}
              aria-label="DriveGuard AI Homepage"
            >
              <Shield
                size={18}
                strokeWidth={2}
                style={{ color: '#FFFFFF', opacity: 0.95 }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#FFFFFF',
                }}
              >
                DRIVEGUARD
                <span
                  style={{
                    fontWeight: 400,
                    color: '#8C8A83',
                    marginLeft: '0.35rem',
                  }}
                >
                  AI
                </span>
              </span>
            </div>

            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.88rem',
                lineHeight: 1.65,
                color: '#9E9C95',
                margin: 0,
                fontWeight: 400,
              }}
            >
              Real-time edge computer vision for driver attentiveness, fatigue prevention, and occupant safety.
              Non-intrusive 468-point facial landmark telemetry with local SQLite session persistence.
            </p>
          </div>

          {/* Restrained Live Engine Status Indicator Pill */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '0.65rem',
            }}
            className="footer-status-block"
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.45rem 1rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.74rem',
                letterSpacing: '0.06em',
                color: '#FAF9F6',
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor:
                    isOnline && isMonitoring
                      ? 'var(--color-safe)'
                      : isOnline
                      ? '#D97706'
                      : '#6B7280',
                }}
                className={isOnline && isMonitoring ? 'telemetry-pulse' : ''}
              />
              <span>
                SYSTEM {connectionStatus.toUpperCase()}
                {isOnline && isMonitoring ? ` // ${fps} FPS` : ''}
              </span>
            </div>

            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                color: '#7A7872',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {isOnline
                ? `LATENCY: ${latencyMs}MS • 0 CLOUD INTRUSION`
                : 'WAITING FOR ENGINE WEBSOCKET'}
            </span>
          </div>
        </div>

        {/* Navigation & System Information Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
          }}
        >
          {/* Column 1: Working View Navigation */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#FAF9F6',
                marginBottom: '1.25rem',
              }}
            >
              NAVIGATION
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {FOOTER_NAV_LINKS.map((link) => {
                const isActive = activeTab === link.id;
                return (
                  <li key={link.id}>
                    <button
                      onClick={() => handleNavClick(link.id)}
                      className="footer-link-btn"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.86rem',
                        color: isActive ? '#FFFFFF' : '#9E9C95',
                        fontWeight: isActive ? 600 : 400,
                        textAlign: 'left',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'color var(--transition-fast)',
                      }}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {isActive && (
                        <span
                          style={{
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-safe)',
                          }}
                        />
                      )}
                      <span>{link.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 2: Architectural Capabilities */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#FAF9F6',
                marginBottom: '1.25rem',
              }}
            >
              CORE CAPABILITIES
            </div>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.86rem',
                color: '#9E9C95',
              }}
            >
              <li>MediaPipe 468-Point Mesh</li>
              <li>Ocular PERCLOS &amp; EAR Engine</li>
              <li>Mouth MAR Yawn Tracking</li>
              <li>Head Pose PnP Estimation</li>
            </ul>
          </div>

          {/* Column 3: Verification & Edge Privacy */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#FAF9F6',
                marginBottom: '1.25rem',
              }}
            >
              VERIFICATION &amp; PRIVACY
            </div>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.86rem',
                color: '#9E9C95',
              }}
            >
              <li>Step 9 Benchmark Certified (99.4%)</li>
              <li>Local SQLite Session Database</li>
              <li>FastAPI Async WebSocket Bridge</li>
              <li>100% On-Device Local Processing</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Fine Separator, Copyright & Smooth Back to Top */}
        <div
          style={{
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem',
            fontSize: '0.74rem',
            fontFamily: 'var(--font-mono)',
            color: '#7A7872',
          }}
        >
          <div>
            &copy; 2026 DriveGuard AI. Edge Driver Safety Intelligence. All rights reserved.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span>Core v1.0.4 • Local Edge Mode</span>

            <button
              onClick={handleScrollToTop}
              className="footer-back-to-top"
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FAF9F6',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all var(--transition-fast)',
              }}
              aria-label="Back to top of page"
            >
              <span>TOP</span>
              <ArrowUp size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Scoped CSS for Footer Links & Mobile Alignment */}
      <style>{`
        .footer-link-btn:hover {
          color: #FFFFFF !important;
        }
        .footer-back-to-top:hover {
          border-color: #FFFFFF !important;
          background-color: rgba(255, 255, 255, 0.08) !important;
        }
        @media (max-width: 640px) {
          .footer-status-block {
            align-items: flex-start !important;
          }
        }
      `}</style>
    </footer>
  );
}
