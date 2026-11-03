import React from 'react';
import { Shield, ArrowUp, Activity, CheckCircle, Database, Cpu, Radio } from 'lucide-react';

const FOOTER_NAV_LINKS = [
  { id: 'overview', label: '01 // OVERVIEW' },
  { id: 'monitor', label: '02 // LIVE COCKPIT' },
  { id: 'analytics', label: '03 // SAFETY ANALYTICS' },
  { id: 'history', label: '04 // FLIGHT VAULT' },
];

/**
 * SSTR-Inspired Industrial Engineering Footer
 * Primary Reference: SSTR (https://sstr.tech/en/)
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
        backgroundColor: '#0A0B0D',
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
              aria-label="DriveGuard AI Homepage"
            >
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '4px',
                  backgroundColor: '#18191B',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Shield size={16} strokeWidth={2.2} style={{ color: '#FE5B2A' }} />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#FFFFFF',
                }}
              >
                DRIVEGUARD
                <span style={{ color: '#FE5B2A', marginLeft: '0.35rem' }}>// AI</span>
              </span>
            </div>

            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.88rem',
                lineHeight: 1.65,
                color: '#9FA4B0',
                margin: 0,
              }}
            >
              High-performance edge computer vision engineered for autonomous driver attentiveness,
              micro-sleep prevention, and 468-point spatial facial landmark kinematics.
              100% on-device processing with local SQLite session persistence.
            </p>
          </div>

          {/* SSTR Status Indicator Pill */}
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
                borderRadius: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.74rem',
                letterSpacing: '0.06em',
                color: '#FFFFFF',
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor:
                    isOnline && isMonitoring
                      ? '#10B981'
                      : isOnline
                      ? '#FE5B2A'
                      : '#5F6470',
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
                color: '#5F6470',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {isOnline
                ? `LATENCY: ${latencyMs}MS • ZERO CLOUD INTRUSION`
                : 'WAITING FOR HARDWARE WEBSOCKET BRIDGE'}
            </span>
          </div>
        </div>

        {/* Navigation & Technical Columns */}
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
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#FE5B2A',
                marginBottom: '1.25rem',
              }}
            >
              SYSTEM NAVIGATION
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
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.78rem',
                        color: isActive ? '#FE5B2A' : '#9FA4B0',
                        fontWeight: isActive ? 700 : 500,
                        textAlign: 'left',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'color var(--transition-fast)',
                      }}
                    >
                      {isActive && (
                        <span
                          style={{
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            backgroundColor: '#FE5B2A',
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

          {/* Column 2: Core Engineering Capabilities */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#FE5B2A',
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
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                color: '#9FA4B0',
              }}
            >
              <li>MediaPipe 468-Point Mesh</li>
              <li>Ocular PERCLOS &amp; EAR Engine</li>
              <li>Mouth MAR Yawn Tracking</li>
              <li>6-DOF Levenberg-Marquardt PnP</li>
            </ul>
          </div>

          {/* Column 3: Verification & Edge Privacy */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#FE5B2A',
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
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                color: '#9FA4B0',
              }}
            >
              <li>Local SQLite WAL Ledger</li>
              <li>FastAPI Async WebSocket Bridge</li>
              <li>Sub-15ms Edge Pipeline</li>
              <li>100% On-Device Processing</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
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
            color: '#5F6470',
          }}
        >
          <div>
            &copy; 2026 DRIVEGUARD AI. HIGH-PERFORMANCE DRIVER INTELLIGENCE. ALL RIGHTS RESERVED.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span>BUILD: v1.0.4-SSTR // EDGE HARNESS</span>

            <button
              onClick={handleScrollToTop}
              className="footer-back-to-top"
              style={{
                background: '#141518',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                padding: '0.35rem 0.85rem',
                borderRadius: '4px',
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

      {/* Scoped CSS for Footer Links */}
      <style>{`
        .footer-link-btn:hover {
          color: #FFFFFF !important;
        }
        .footer-back-to-top:hover {
          border-color: #FE5B2A !important;
          color: #FE5B2A !important;
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