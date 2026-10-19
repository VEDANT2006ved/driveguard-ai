import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  ShieldCheck,
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  Play,
  Square,
  Menu,
  X,
  ChevronRight,
  Activity,
} from 'lucide-react';

const NAV_TABS = [
  { id: 'overview', num: '01', label: 'OVERVIEW' },
  { id: 'monitor', num: '02', label: 'LIVE MONITOR' },
  { id: 'analytics', num: '03', label: 'ANALYTICS' },
  { id: 'history', num: '04', label: 'TRIP HISTORY' },
];

/**
 * Bang & Olufsen A9-Inspired Minimalist Navigation Header
 * Premium, architectural, product-focused with warm ivory tones, charcoal typography,
 * razor-thin dividers, spacious layout, and an accessible responsive mobile drawer.
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
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isOnline = connectionStatus === 'online';
  const drawerRef = useRef(null);

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
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        backgroundColor: 'rgba(247, 246, 242, 0.94)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        transition: 'background-color var(--transition-fast)',
      }}
      role="banner"
    >
      {/* Top Primary Navigation Bar */}
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0.95rem clamp(1.25rem, 4vw, 3.5rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}
      >
        {/* Brand Wordmark & Shield Icon */}
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
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.65rem',
            userSelect: 'none',
            outlineOffset: '4px',
            transition: 'opacity var(--transition-fast)',
          }}
        >
          {/* Subtle status indicator dot */}
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
                  : 'var(--text-muted)',
              display: 'inline-block',
              transition: 'background-color var(--transition-fast)',
            }}
            className={isOnline && isMonitoring ? 'telemetry-pulse' : ''}
            title={
              isOnline && isMonitoring
                ? 'System Online & Monitoring Active'
                : isOnline
                ? 'System Online (Standby)'
                : 'System Offline'
            }
          />

          <Shield
            size={16}
            strokeWidth={2}
            style={{
              color: 'var(--text-primary)',
              opacity: 0.9,
              flexShrink: 0,
            }}
          />

          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.96rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              color: 'var(--text-primary)',
              textTransform: 'uppercase',
            }}
          >
            DRIVEGUARD
            <span
              style={{
                fontWeight: 400,
                color: 'var(--text-secondary)',
                marginLeft: '0.35rem',
              }}
            >
              AI
            </span>
          </span>
        </div>

        {/* Center Desktop Navigation Tabs */}
        <nav
          className="bo-desktop-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(1.5rem, 3.2vw, 2.75rem)',
          }}
          aria-label="Main Navigation"
        >
          {NAV_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className="bo-nav-link"
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: '0.5rem 0',
                  position: 'relative',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  outlineOffset: '4px',
                }}
                aria-current={isActive ? 'page' : undefined}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.8rem',
                    fontWeight: isActive ? 600 : 500,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    transition: 'color var(--transition-fast)',
                  }}
                >
                  {tab.label}
                </span>

                {/* Elegant Minimalist Hover & Active Underline */}
                <span
                  className="bo-nav-underline"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '1.5px',
                    backgroundColor: 'var(--text-primary)',
                    transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                    transformOrigin: 'left center',
                    transition: 'transform 0.24s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
              </button>
            );
          })}
        </nav>

        {/* Right Desktop Actions: Audio, Notifs, and Start Monitoring */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          {/* Audio Chime Toggle Button */}
          <button
            onClick={onToggleAudio}
            title={isAudioMuted ? 'Unmute safety audio chimes' : 'Mute safety audio chimes'}
            aria-label={isAudioMuted ? 'Unmute safety audio' : 'Mute safety audio'}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              padding: '0.45rem 0.65rem',
              borderRadius: '9999px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              color: isAudioMuted ? 'var(--text-muted)' : 'var(--text-primary)',
              transition: 'all var(--transition-fast)',
            }}
            className="bo-utility-btn"
          >
            {isAudioMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
            <span style={{ letterSpacing: '0.06em' }}>{isAudioMuted ? 'MUTED' : 'AUDIO'}</span>
          </button>

          {/* Desktop Push Notification Toggle */}
          <button
            onClick={onToggleNotifications}
            title={
              notificationPermission === 'denied'
                ? 'Desktop notifications blocked by browser'
                : 'Toggle safety desktop notifications'
            }
            aria-label="Toggle notifications"
            style={{
              background:
                notificationPermission === 'denied'
                  ? 'var(--color-alert-dim)'
                  : 'transparent',
              border: `1px solid ${
                notificationPermission === 'denied'
                  ? 'var(--color-alert-border)'
                  : 'var(--border-subtle)'
              }`,
              padding: '0.45rem 0.65rem',
              borderRadius: '9999px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              color:
                notificationPermission === 'denied'
                  ? 'var(--color-alert)'
                  : isNotificationsEnabled
                  ? 'var(--color-safe)'
                  : 'var(--text-secondary)',
              transition: 'all var(--transition-fast)',
            }}
            className="bo-utility-btn"
          >
            {notificationPermission === 'granted' && isNotificationsEnabled ? (
              <Bell size={13} />
            ) : (
              <BellOff size={13} />
            )}
            <span style={{ letterSpacing: '0.06em' }}>
              {notificationPermission === 'denied'
                ? 'BLOCKED'
                : isNotificationsEnabled
                ? 'NOTIFS ON'
                : 'NOTIFS OFF'}
            </span>
          </button>

          {/* Clearly Visible Start / Halt Monitoring Action */}
          <button
            onClick={handleMonitoringAction}
            aria-label={isMonitoring ? 'Halt active driver monitoring' : 'Start real-time driver monitoring'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.55rem',
              backgroundColor: isMonitoring ? '#111111' : 'var(--text-primary)',
              color: '#FFFFFF',
              border: '1px solid var(--text-primary)',
              borderRadius: '9999px',
              padding: '0.52rem 1.35rem',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.82rem',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            }}
            className="bo-primary-action-btn"
          >
            {isMonitoring ? (
              <>
                <Square size={11} fill="#FFFFFF" />
                <span className="bo-action-label-full">HALT SENSING</span>
                <span className="bo-action-label-short">HALT</span>
              </>
            ) : (
              <>
                <Play size={11} fill="#FFFFFF" />
                <span className="bo-action-label-full">START MONITORING</span>
                <span className="bo-action-label-short">MONITOR</span>
              </>
            )}
          </button>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            className="bo-hamburger-btn"
            style={{
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              width: '38px',
              height: '38px',
              borderRadius: '9999px',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              transition: 'all var(--transition-fast)',
            }}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Narrow Sub-Header Metadata Strip */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'rgba(239, 236, 230, 0.65)',
          padding: '0.35rem clamp(1.25rem, 4vw, 3.5rem)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.68rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <span>CORE // DRIVEGUARD AI</span>
          <span>•</span>
          <span>
            ENGINE:{' '}
            {isOnline
              ? isMonitoring
                ? `${fps} FPS OPTICAL STREAM`
                : 'PAUSED (CAMERA IDLE)'
              : 'OFFLINE / DISCONNECTED'}
          </span>
          <span>•</span>
          <span>LATENCY: {isOnline ? `${latencyMs}MS` : '--'}</span>
        </div>

        <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
          <span
            style={{
              color:
                isOnline && isMonitoring
                  ? 'var(--color-safe)'
                  : isOnline
                  ? '#D97706'
                  : 'var(--text-muted)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor:
                  isOnline && isMonitoring
                    ? 'var(--color-safe)'
                    : isOnline
                    ? '#D97706'
                    : 'var(--text-muted)',
              }}
            />
            {isOnline
              ? isMonitoring
                ? 'MONITORING ACTIVE'
                : 'STANDBY'
              : 'ENGINE DISCONNECTED'}
          </span>
        </div>
      </div>

      {/* Mobile Navigation Drawer & Backdrop */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="bo-drawer-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            top: '73px',
            backgroundColor: 'rgba(17, 17, 17, 0.45)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setMobileMenuOpen(false);
            }
          }}
        >
          <div
            className="bo-drawer-content"
            style={{
              backgroundColor: 'var(--bg-canvas)',
              borderBottom: '1px solid var(--border-subtle)',
              padding: '1.75rem clamp(1.25rem, 5vw, 2.5rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              boxShadow: '0 16px 36px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Mobile Navigation Links */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {NAV_TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onSelectTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid var(--border-subtle)',
                      padding: '1rem 0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      textAlign: 'left',
                      minHeight: '48px',
                    }}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.72rem',
                          color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                        }}
                      >
                        {tab.num}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '1.05rem',
                          fontWeight: isActive ? 600 : 400,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                        }}
                      >
                        {tab.label}
                      </span>
                    </div>

                    <ChevronRight
                      size={16}
                      style={{
                        color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                        transform: isActive ? 'translateX(2px)' : 'none',
                      }}
                    />
                  </button>
                );
              })}
            </div>

            {/* Mobile Primary Start/Halt Monitoring Button */}
            <div style={{ paddingTop: '0.5rem' }}>
              <button
                onClick={handleMonitoringAction}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.65rem',
                  backgroundColor: isMonitoring ? '#111111' : 'var(--text-primary)',
                  color: '#FFFFFF',
                  border: '1px solid var(--text-primary)',
                  borderRadius: '9999px',
                  padding: '0.85rem 1.5rem',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.88rem',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  minHeight: '48px',
                }}
              >
                {isMonitoring ? (
                  <>
                    <Square size={13} fill="#FFFFFF" />
                    <span>HALT ACTIVE SENSING</span>
                  </>
                ) : (
                  <>
                    <Play size={13} fill="#FFFFFF" />
                    <span>START REAL-TIME MONITORING</span>
                  </>
                )}
              </button>
            </div>

            {/* Mobile Controls & System Status Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--border-subtle)',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                {/* Audio Button */}
                <button
                  onClick={onToggleAudio}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border-subtle)',
                    padding: '0.45rem 0.8rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    color: isAudioMuted ? 'var(--text-muted)' : 'var(--text-primary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer',
                    minHeight: '38px',
                  }}
                >
                  {isAudioMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                  <span>{isAudioMuted ? 'MUTED' : 'AUDIO ON'}</span>
                </button>

                {/* Notifications Button */}
                <button
                  onClick={onToggleNotifications}
                  style={{
                    background:
                      notificationPermission === 'denied'
                        ? 'var(--color-alert-dim)'
                        : 'transparent',
                    border: `1px solid ${
                      notificationPermission === 'denied'
                        ? 'var(--color-alert-border)'
                        : 'var(--border-subtle)'
                    }`,
                    padding: '0.45rem 0.8rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    color:
                      notificationPermission === 'denied'
                        ? 'var(--color-alert)'
                        : isNotificationsEnabled
                        ? 'var(--color-safe)'
                        : 'var(--text-secondary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer',
                    minHeight: '38px',
                  }}
                >
                  {notificationPermission === 'granted' && isNotificationsEnabled ? (
                    <Bell size={13} />
                  ) : (
                    <BellOff size={13} />
                  )}
                  <span>{isNotificationsEnabled ? 'NOTIFS' : 'OFF'}</span>
                </button>
              </div>

              <div
                style={{
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                }}
              >
                STATUS: {isOnline ? (isMonitoring ? 'STREAMING' : 'IDLE') : 'OFFLINE'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scoped CSS Styles for Navigation & Drawer */}
      <style>{`
        .bo-nav-link:hover .bo-nav-underline {
          transform: scaleX(1) !important;
        }
        .bo-utility-btn:hover {
          border-color: var(--text-primary) !important;
          color: var(--text-primary) !important;
        }
        .bo-primary-action-btn:hover {
          background-color: #000000 !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12) !important;
        }
        .bo-hamburger-btn:hover {
          border-color: var(--text-primary) !important;
        }

        /* Drawer Entrance Animation */
        @keyframes boDrawerSlide {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .bo-drawer-content {
          animation: boDrawerSlide 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .bo-action-label-short {
          display: none;
        }

        /* Responsive Breakpoints */
        @media (max-width: 920px) {
          .bo-desktop-nav {
            display: none !important;
          }
          .bo-hamburger-btn {
            display: flex !important;
          }
          .bo-utility-btn {
            display: none !important;
          }
        }

        @media (max-width: 440px) {
          .bo-action-label-full {
            display: none !important;
          }
          .bo-action-label-short {
            display: inline !important;
          }
          .bo-primary-action-btn {
            padding: 0.42rem 0.8rem !important;
            font-size: 0.74rem !important;
          }
        }

        /* Reduced Motion Compliance */
        @media (prefers-reduced-motion: reduce) {
          .bo-drawer-content {
            animation: none !important;
          }
          .bo-nav-underline {
            transition: none !important;
          }
          .bo-primary-action-btn {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </header>
  );
}
