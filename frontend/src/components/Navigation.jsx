import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
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
  Sliders,
  Radio,
} from 'lucide-react';

const NAV_TABS = [
  { id: 'overview', num: '01', label: 'Overview' },
  { id: 'monitor', num: '02', label: 'Live Monitor' },
  { id: 'analytics', num: '03', label: 'Analytics' },
  { id: 'history', num: '04', label: 'Trip History' },
];

/**
 * DriveGuard AI — Luxury Automotive Minimalist Navigation Bar
 * Architectural, product-focused with warm ivory glassmorphism, charcoal typography,
 * floating segmented dock navigation, unified quick-control deck, and a tactile ignition CTA.
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
    <header className="dg-navbar-header" role="banner">
      <div className="dg-navbar-container">
        {/* Left: Brand Crest & Wordmark */}
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
          className="dg-brand-button"
        >
          <div className="dg-brand-crest">
            <Shield size={15} strokeWidth={2.2} className="dg-shield-icon" />
            <span
              className={`dg-beacon-dot ${
                isOnline && isMonitoring
                  ? 'active'
                  : isOnline
                  ? 'standby'
                  : 'offline'
              }`}
            />
          </div>

          <div className="dg-brand-text-group">
            <span className="dg-brand-title">DRIVEGUARD</span>
            <span className="dg-brand-badge">AI</span>
          </div>
        </div>

        {/* Center: Segmented Navigation Dock */}
        <nav className="dg-nav-dock" aria-label="Main Navigation">
          {NAV_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`dg-nav-tab ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="dg-tab-num">{tab.num}</span>
                <span className="dg-tab-label">{tab.label}</span>
                {isActive && <span className="dg-tab-active-dot" />}
              </button>
            );
          })}
        </nav>

        {/* Right: Unified Controls, Diagnostics & Ignition CTA */}
        <div className="dg-controls-cluster">
          {/* Telemetry / Engine Status Pill */}
          <button
            onClick={onOpenDiagnostics}
            title={
              isOnline
                ? `Engine Connected (${fps} FPS, ${latencyMs}ms). Click for Diagnostics & Tunnel settings.`
                : 'Engine Disconnected. Click to connect local engine or Cloudflare Tunnel.'
            }
            aria-label="Engine connection diagnostics"
            className={`dg-status-pill ${
              isOnline ? (isMonitoring ? 'online' : 'standby') : 'offline'
            }`}
          >
            <span className="dg-status-pulse-ring" />
            <span className="dg-status-label">
              {isOnline
                ? isMonitoring
                  ? fps > 0
                    ? `${fps} FPS`
                    : 'LIVE'
                  : 'STANDBY'
                : 'OFFLINE'}
            </span>
            <Activity size={12} className="dg-status-icon" />
          </button>

          {/* Grouped Audio & Notification Quick Toggles */}
          <div className="dg-utility-group">
            <button
              onClick={onToggleAudio}
              title={isAudioMuted ? 'Unmute safety audio chimes' : 'Mute safety audio chimes'}
              aria-label={isAudioMuted ? 'Unmute safety audio' : 'Mute safety audio'}
              className={`dg-util-btn ${isAudioMuted ? 'muted' : 'active'}`}
            >
              {isAudioMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>

            <span className="dg-util-divider" />

            <button
              onClick={onToggleNotifications}
              title={
                notificationPermission === 'denied'
                  ? 'Notifications blocked in browser'
                  : isNotificationsEnabled
                  ? 'Safety notifications active'
                  : 'Enable desktop safety alerts'
              }
              aria-label="Toggle notifications"
              className={`dg-util-btn ${
                notificationPermission === 'denied'
                  ? 'denied'
                  : isNotificationsEnabled
                  ? 'active'
                  : 'idle'
              }`}
            >
              {isNotificationsEnabled ? <Bell size={14} /> : <BellOff size={14} />}
              {isNotificationsEnabled && <span className="dg-notif-indicator" />}
            </button>
          </div>

          {/* Primary Action Button (Automotive Ignition CTA) */}
          <button
            onClick={handleMonitoringAction}
            aria-label={isMonitoring ? 'Halt active driver monitoring' : 'Start real-time driver monitoring'}
            className={`dg-cta-btn ${isMonitoring ? 'monitoring' : 'idle'}`}
          >
            {isMonitoring ? (
              <>
                <Square size={11} fill="currentColor" className="dg-cta-icon" />
                <span className="dg-cta-text-full">HALT SENSING</span>
                <span className="dg-cta-text-compact">HALT</span>
              </>
            ) : (
              <>
                <Play size={11} fill="currentColor" className="dg-cta-icon" />
                <span className="dg-cta-text-full">START MONITORING</span>
                <span className="dg-cta-text-compact">START</span>
              </>
            )}
          </button>

          {/* Mobile Drawer Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            className="dg-hamburger-btn"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
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
          className="dg-mobile-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setMobileMenuOpen(false);
            }
          }}
        >
          <div className="dg-mobile-drawer">
            {/* System Status Banner in Drawer */}
            <div
              className={`dg-mobile-status-card ${
                isOnline ? (isMonitoring ? 'online' : 'standby') : 'offline'
              }`}
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDiagnostics?.();
              }}
            >
              <div className="dg-mobile-status-left">
                <span className="dg-mobile-status-dot" />
                <div>
                  <div className="dg-mobile-status-title">
                    {isOnline
                      ? isMonitoring
                        ? `ENGINE ONLINE • ${fps} FPS`
                        : 'ENGINE STANDBY'
                      : 'ENGINE DISCONNECTED'}
                  </div>
                  <div className="dg-mobile-status-sub">
                    {isOnline ? `Latency: ${latencyMs}ms • Tap for Diagnostics` : 'Tap to configure tunnel / bridge'}
                  </div>
                </div>
              </div>
              <ChevronRight size={15} color="var(--text-muted)" />
            </div>

            {/* Mobile Navigation Links */}
            <div className="dg-mobile-nav-list">
              {NAV_TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onSelectTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`dg-mobile-nav-item ${isActive ? 'active' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <div className="dg-mobile-item-left">
                      <span className="dg-mobile-item-num">{tab.num}</span>
                      <span className="dg-mobile-item-label">{tab.label}</span>
                    </div>
                    <ChevronRight
                      size={16}
                      className="dg-mobile-item-chevron"
                    />
                  </button>
                );
              })}
            </div>

            {/* Mobile Ignition Action */}
            <button
              onClick={handleMonitoringAction}
              className={`dg-mobile-cta-btn ${isMonitoring ? 'monitoring' : 'idle'}`}
            >
              {isMonitoring ? (
                <>
                  <Square size={13} fill="currentColor" />
                  <span>HALT ACTIVE SENSING</span>
                </>
              ) : (
                <>
                  <Play size={13} fill="currentColor" />
                  <span>START REAL-TIME MONITORING</span>
                </>
              )}
            </button>

            {/* Mobile Utility Controls */}
            <div className="dg-mobile-utils-row">
              <button
                onClick={onToggleAudio}
                className={`dg-mobile-util-chip ${isAudioMuted ? 'muted' : 'active'}`}
              >
                {isAudioMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                <span>{isAudioMuted ? 'AUDIO MUTED' : 'AUDIO ON'}</span>
              </button>

              <button
                onClick={onToggleNotifications}
                className={`dg-mobile-util-chip ${
                  notificationPermission === 'denied'
                    ? 'denied'
                    : isNotificationsEnabled
                    ? 'active'
                    : 'idle'
                }`}
              >
                {isNotificationsEnabled ? <Bell size={14} /> : <BellOff size={14} />}
                <span>
                  {notificationPermission === 'denied'
                    ? 'NOTIFS BLOCKED'
                    : isNotificationsEnabled
                    ? 'NOTIFS ACTIVE'
                    : 'NOTIFS OFF'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scoped CSS Styles for Modern Navbar */}
      <style>{`
        /* Header Container */
        .dg-navbar-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          width: 100%;
          background: rgba(247, 246, 242, 0.90);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(226, 223, 214, 0.85);
          box-shadow: 0 4px 20px -2px rgba(17, 17, 17, 0.025);
          transition: background-color var(--transition-fast), border-color var(--transition-fast);
        }

        .dg-navbar-container {
          max-width: 1440px;
          margin: 0 auto;
          height: 68px;
          padding: 0 clamp(1.25rem, 4vw, 3.5rem);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }

        /* Brand Styling */
        .dg-brand-button {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          user-select: none;
          outline: none;
          transition: opacity var(--transition-fast), transform var(--transition-fast);
        }
        .dg-brand-button:hover {
          opacity: 0.92;
        }

        .dg-brand-crest {
          position: relative;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #111111;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
        }
        .dg-shield-icon {
          color: #F7F6F2;
        }

        .dg-beacon-dot {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: 1.5px solid #F7F6F2;
          background-color: var(--text-muted);
          transition: background-color var(--transition-fast);
        }
        .dg-beacon-dot.active {
          background-color: #10B981;
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.7);
        }
        .dg-beacon-dot.standby {
          background-color: #D97706;
        }
        .dg-beacon-dot.offline {
          background-color: #9CA3AF;
        }

        .dg-brand-text-group {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }
        .dg-brand-title {
          font-family: var(--font-sans);
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: var(--text-primary);
          line-height: 1;
        }
        .dg-brand-badge {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: var(--text-secondary);
          background: rgba(17, 17, 17, 0.05);
          border: 1px solid rgba(17, 17, 17, 0.08);
          padding: 2px 6px;
          border-radius: 4px;
          line-height: 1.2;
        }

        /* Center Segmented Dock */
        .dg-nav-dock {
          display: flex;
          align-items: center;
          background: rgba(239, 236, 230, 0.65);
          border: 1px solid rgba(226, 223, 214, 0.9);
          border-radius: 9999px;
          padding: 4px;
          gap: 2px;
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.02);
        }

        .dg-nav-tab {
          background: transparent;
          border: 1px solid transparent;
          border-radius: 9999px;
          padding: 0.42rem 0.95rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          outline: none;
          position: relative;
        }
        .dg-tab-num {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          color: var(--text-muted);
          letter-spacing: 0.06em;
          font-weight: 500;
          transition: color var(--transition-fast);
        }
        .dg-tab-label {
          font-family: var(--font-sans);
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          color: var(--text-secondary);
          transition: color var(--transition-fast);
        }
        .dg-tab-active-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: var(--text-primary);
          margin-left: 1px;
        }

        .dg-nav-tab:hover:not(.active) {
          background: rgba(255, 255, 255, 0.5);
          color: var(--text-primary);
        }
        .dg-nav-tab:hover:not(.active) .dg-tab-label {
          color: var(--text-primary);
        }

        .dg-nav-tab.active {
          background: #FFFFFF;
          border-color: rgba(17, 17, 17, 0.06);
          box-shadow: 0 2px 8px rgba(17, 17, 17, 0.05);
        }
        .dg-nav-tab.active .dg-tab-num {
          color: var(--text-primary);
          font-weight: 600;
        }
        .dg-nav-tab.active .dg-tab-label {
          color: var(--text-primary);
          font-weight: 600;
        }

        /* Right Controls Cluster */
        .dg-controls-cluster {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        /* Telemetry Status Capsule */
        .dg-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.4rem 0.75rem;
          border-radius: 9999px;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          cursor: pointer;
          outline: none;
          transition: all var(--transition-fast);
          border: 1px solid var(--border-subtle);
          background: rgba(255, 255, 255, 0.65);
          color: var(--text-secondary);
        }
        .dg-status-pill:hover {
          border-color: var(--text-primary);
          color: var(--text-primary);
          transform: translateY(-0.5px);
        }
        .dg-status-pill.online {
          background: rgba(16, 185, 129, 0.08);
          border-color: rgba(16, 185, 129, 0.35);
          color: #065F46;
        }
        .dg-status-pill.standby {
          background: rgba(217, 119, 6, 0.08);
          border-color: rgba(217, 119, 6, 0.3);
          color: #92400E;
        }
        .dg-status-pill.offline {
          background: rgba(232, 75, 50, 0.06);
          border-color: rgba(232, 75, 50, 0.25);
          color: #991B1B;
        }

        .dg-status-pulse-ring {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: currentColor;
        }
        .dg-status-pill.online .dg-status-pulse-ring {
          animation: redTelemetryPulse 2s ease-in-out infinite;
        }
        .dg-status-icon {
          opacity: 0.6;
          transition: opacity var(--transition-fast);
        }
        .dg-status-pill:hover .dg-status-icon {
          opacity: 1;
        }

        /* Quick Utility Group (Audio & Notifications) */
        .dg-utility-group {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid var(--border-subtle);
          border-radius: 9999px;
          padding: 2px 4px;
        }
        .dg-util-btn {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          transition: all var(--transition-fast);
        }
        .dg-util-btn:hover {
          color: var(--text-primary);
          background: rgba(17, 17, 17, 0.05);
        }
        .dg-util-btn.muted {
          color: var(--text-muted);
        }
        .dg-util-btn.active {
          color: var(--text-primary);
        }
        .dg-util-btn.denied {
          color: var(--color-alert);
        }

        .dg-notif-indicator {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: #10B981;
        }
        .dg-util-divider {
          width: 1px;
          height: 14px;
          background-color: var(--border-subtle);
        }

        /* Primary Action Ignition Button */
        .dg-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.52rem 1.25rem;
          border-radius: 9999px;
          font-family: var(--font-sans);
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          outline: none;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        .dg-cta-btn.idle {
          background-color: #111111;
          color: #FFFFFF;
          border: 1px solid #111111;
        }
        .dg-cta-btn.idle:hover {
          background-color: #000000;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.16);
        }
        .dg-cta-btn.monitoring {
          background-color: #18191B;
          color: #FFFFFF;
          border: 1px solid rgba(232, 75, 50, 0.5);
          box-shadow: 0 2px 10px rgba(232, 75, 50, 0.15);
        }
        .dg-cta-btn.monitoring:hover {
          background-color: #0E0F11;
          border-color: rgba(232, 75, 50, 0.9);
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(232, 75, 50, 0.25);
        }
        .dg-cta-icon {
          flex-shrink: 0;
        }
        .dg-cta-text-compact {
          display: none;
        }

        /* Hamburger Button */
        .dg-hamburger-btn {
          width: 36px;
          height: 36px;
          border-radius: 9999px;
          border: 1px solid var(--border-subtle);
          background: rgba(255, 255, 255, 0.6);
          color: var(--text-primary);
          display: none;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .dg-hamburger-btn:hover {
          background: #FFFFFF;
          border-color: var(--text-primary);
        }

        /* Mobile Drawer */
        .dg-mobile-overlay {
          position: fixed;
          inset: 0;
          top: 68px;
          background: rgba(17, 17, 17, 0.45);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          z-index: 999;
          display: flex;
          flex-direction: column;
        }
        .dg-mobile-drawer {
          background: var(--bg-canvas);
          border-bottom: 1px solid var(--border-subtle);
          padding: 1.5rem clamp(1.25rem, 5vw, 2.5rem);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
          animation: dgDrawerSlide 0.26s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes dgDrawerSlide {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dg-mobile-status-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1rem;
          border-radius: 8px;
          background: #FFFFFF;
          border: 1px solid var(--border-subtle);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .dg-mobile-status-card:hover {
          border-color: var(--text-primary);
        }
        .dg-mobile-status-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .dg-mobile-status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--text-muted);
        }
        .dg-mobile-status-card.online .dg-mobile-status-dot {
          background-color: #10B981;
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.7);
        }
        .dg-mobile-status-card.standby .dg-mobile-status-dot {
          background-color: #D97706;
        }
        .dg-mobile-status-card.offline .dg-mobile-status-dot {
          background-color: #E84B32;
        }
        .dg-mobile-status-title {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-primary);
          letter-spacing: 0.05em;
        }
        .dg-mobile-status-sub {
          font-size: 0.72rem;
          color: var(--text-secondary);
          margin-top: 2px;
        }

        .dg-mobile-nav-list {
          display: flex;
          flex-direction: column;
        }
        .dg-mobile-nav-item {
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--border-subtle);
          padding: 0.95rem 0.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          text-align: left;
        }
        .dg-mobile-item-left {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .dg-mobile-item-num {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        .dg-mobile-item-label {
          font-family: var(--font-sans);
          font-size: 1.05rem;
          font-weight: 500;
          color: var(--text-secondary);
          letter-spacing: 0.04em;
        }
        .dg-mobile-item-chevron {
          color: var(--text-muted);
          transition: transform var(--transition-fast), color var(--transition-fast);
        }
        .dg-mobile-nav-item.active .dg-mobile-item-label {
          color: var(--text-primary);
          font-weight: 600;
        }
        .dg-mobile-nav-item.active .dg-mobile-item-num {
          color: var(--text-primary);
          font-weight: 600;
        }
        .dg-mobile-nav-item.active .dg-mobile-item-chevron {
          color: var(--text-primary);
          transform: translateX(3px);
        }

        .dg-mobile-cta-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
          padding: 0.85rem 1.5rem;
          border-radius: 9999px;
          font-family: var(--font-sans);
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          border: none;
        }
        .dg-mobile-cta-btn.idle {
          background-color: #111111;
          color: #FFFFFF;
        }
        .dg-mobile-cta-btn.monitoring {
          background-color: #18191B;
          color: #FFFFFF;
          border: 1px solid rgba(232, 75, 50, 0.6);
        }

        .dg-mobile-utils-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.65rem;
          padding-top: 0.5rem;
        }
        .dg-mobile-util-chip {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          padding: 0.65rem;
          border-radius: 9999px;
          border: 1px solid var(--border-subtle);
          background: #FFFFFF;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
        }
        .dg-mobile-util-chip.active {
          color: #065F46;
          border-color: rgba(16, 185, 129, 0.4);
          background: rgba(16, 185, 129, 0.06);
        }
        .dg-mobile-util-chip.denied {
          color: var(--color-alert);
          border-color: rgba(232, 75, 50, 0.3);
          background: rgba(232, 75, 50, 0.06);
        }

        /* Responsive Breakpoints */
        @media (max-width: 980px) {
          .dg-nav-dock {
            display: none !important;
          }
          .dg-hamburger-btn {
            display: flex !important;
          }
          .dg-utility-group {
            display: none !important;
          }
        }

        @media (max-width: 600px) {
          .dg-status-pill {
            display: none !important;
          }
          .dg-cta-text-full {
            display: none !important;
          }
          .dg-cta-text-compact {
            display: inline !important;
          }
          .dg-cta-btn {
            padding: 0.45rem 0.85rem !important;
            font-size: 0.74rem !important;
          }
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .dg-mobile-drawer {
            animation: none !important;
          }
          .dg-nav-tab,
          .dg-cta-btn,
          .dg-status-pill {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </header>
  );
}
