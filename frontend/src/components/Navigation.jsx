import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  Play,
  Square,
  Menu,
  X,
  Radio,
  Sliders,
  ChevronRight,
} from 'lucide-react';

const NAV_TABS = [
  { id: 'overview', num: '01', label: 'OVERVIEW' },
  { id: 'monitor', num: '02', label: 'COCKPIT' },
  { id: 'analytics', num: '03', label: 'TELEMETRY' },
  { id: 'history', num: '04', label: 'VAULT' },
];

/**
 * Navigation Component — Premium Minimalist Fashion & Techwear Edition
 * Reference: Reference Images 1 (SHADXW) & 2 (Aura store)
 * Minimal horizontal navbar, clean Swiss typography (Space Grotesk),
 * metadata tags (ACCOUNT ID — 004.812), and tactile ignition control.
 */
export default function Navigation({
  activeTab,
  onSelectTab,
  connectionStatus = 'offline',
  isMonitoring = true,
  onToggleMonitoring,
  onStartMonitoring,
  isAudioMuted = false,
  onToggleAudio,
  notificationPermission = 'default',
  isNotificationsEnabled = false,
  onToggleNotifications,
  fps = 0,
  latencyMs = 0,
  onOpenDiagnostics,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isOnline = connectionStatus === 'online';

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Unified Start / Halt monitoring handler
  const handleMonitoringAction = () => {
    if (!isMonitoring) {
      if (onStartMonitoring) {
        onStartMonitoring();
      } else if (onToggleMonitoring) {
        onToggleMonitoring();
      }
      if (activeTab !== 'monitor') {
        onSelectTab('monitor');
      }
    } else {
      if (onToggleMonitoring) {
        onToggleMonitoring();
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      role="banner"
      style={{
        width: '100%',
        backgroundColor: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-light)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: '1540px',
          margin: '0 auto',
          padding: '0 clamp(1rem, 3vw, 2.5rem)',
          height: '66px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left: Brand Identity with 5-Star Crest (Image 2 style) */}
        <div
          onClick={() => onSelectTab('overview')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelectTab('overview');
            }
          }}
          tabIndex={0}
          role="button"
          aria-label="DriveGuard AI Homepage"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span
                style={{
                  fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: 'var(--text-primary)',
                  lineHeight: 1,
                }}
              >
                DRIVEGUARD
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-light)',
                  padding: '0.1rem 0.35rem',
                  borderRadius: '2px',
                }}
              >
                AI
              </span>
            </div>
            <span
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: '0.62rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginTop: '2px',
              }}
            >
              OPTICAL VIGILANCE PLATFORM
            </span>
          </div>
        </div>

        {/* Center: Minimalist Horizontal Navigation (Desktop) */}
        <nav
          className="desktop-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(1rem, 2.5vw, 2.2rem)',
          }}
          aria-label="Main Navigation"
        >
          {NAV_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`editorial-link ${isActive ? 'active' : ''}`}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                }}
              >
                <span
                  style={{
                    fontSize: '0.62rem',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                  }}
                >
                  {tab.num}
                </span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Technical Metadata & Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          {/* Metadata Tag (Inspired by Image 2 "account id - 003.201") */}
          <div
            className="hidden-mobile"
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: '0.68rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              paddingRight: '0.5rem',
              borderRight: '1px solid var(--border-light)',
            }}
          >
            <span>ACCOUNT ID — 004.812</span>
          </div>

          {/* Engine Status Dot */}
          <div
            onClick={onOpenDiagnostics}
            title={isOnline ? 'Python Engine Online' : 'Python Standby / Configure Tunnel'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.3rem 0.65rem',
              borderRadius: '2px',
              border: '1px solid var(--border-light)',
              backgroundColor: 'var(--bg-secondary)',
              cursor: 'pointer',
              fontSize: '0.68rem',
              fontFamily: "var(--font-mono, monospace)",
              color: 'var(--text-primary)',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: isOnline ? 'var(--accent-emerald)' : 'var(--text-muted)',
              }}
              className={isOnline ? 'animate-pulse-live' : ''}
            />
            <span className="hidden-mobile">
              {isOnline ? 'LINKED' : 'STANDBY'}
            </span>
          </div>

          {/* Audio Mute Toggle */}
          <button
            onClick={onToggleAudio}
            title={isAudioMuted ? 'Unmute Audio Alarms' : 'Mute Audio Alarms'}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '2px',
              border: '1px solid var(--border-light)',
              backgroundColor: isAudioMuted ? 'var(--bg-secondary)' : 'transparent',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-primary)',
            }}
          >
            {isAudioMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          {/* Diagnostics / Tunnel Bridge */}
          <button
            onClick={onOpenDiagnostics}
            title="System Diagnostics & Cloudflare Tunnel Settings"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '2px',
              border: '1px solid var(--border-light)',
              backgroundColor: 'transparent',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-primary)',
            }}
          >
            <Sliders size={15} />
          </button>

          {/* Ignition Action Button: START / HALT SENSING */}
          <button
            onClick={handleMonitoringAction}
            className="btn-editorial"
            style={{
              height: '34px',
              padding: '0 1rem',
              backgroundColor: isMonitoring ? 'var(--text-primary)' : '#111111',
            }}
          >
            {isMonitoring ? (
              <>
                <Square size={11} fill="var(--bg-primary)" />
                <span className="hidden-mobile">HALT SENSING</span>
              </>
            ) : (
              <>
                <Play size={11} fill="var(--bg-primary)" />
                <span className="hidden-mobile">START MONITORING</span>
              </>
            )}
          </button>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="mobile-only"
            aria-label="Open Navigation Menu"
            style={{
              width: '36px',
              height: '36px',
              border: '1px solid var(--border-light)',
              borderRadius: '2px',
              backgroundColor: 'transparent',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-primary)',
            }}
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      {/* Mobile Full-Screen Editorial Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'var(--bg-primary)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
                fontSize: '1.2rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
              }}
            >
              DRIVEGUARD AI
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close Navigation"
              style={{
                width: '36px',
                height: '36px',
                border: '1px solid var(--border-light)',
                borderRadius: '2px',
                background: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {NAV_TABS.map((tab) => (
              <div
                key={tab.id}
                onClick={() => {
                  onSelectTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '1rem',
                  cursor: 'pointer',
                  borderBottom: '1px solid var(--border-light)',
                  paddingBottom: '1rem',
                }}
              >
                <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {tab.num}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
                    fontSize: '2rem',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    textTransform: 'uppercase',
                    color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                  }}
                >
                  {tab.label}
                </span>
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={handleMonitoringAction}
              className="btn-editorial"
              style={{ width: '100%', height: '46px', fontSize: '0.82rem' }}
            >
              {isMonitoring ? 'HALT OPTICAL PIPELINE' : 'START MONITORING'}
            </button>
            <div
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
                textAlign: 'center',
                letterSpacing: '0.1em',
              }}
            >
              ACCOUNT ID — 004.812 // SYS.04
            </div>
          </div>
        </div>
      )}

      {/* Responsive Inline CSS Helper */}
      <style>{`
        @media (max-width: 900px) {
          .desktop-nav {
            display: none !important;
          }
          .hidden-mobile {
            display: none !important;
          }
          .mobile-only {
            display: inline-flex !important;
          }
        }
      `}</style>
    </header>
  );
}
