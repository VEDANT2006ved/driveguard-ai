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
  { id: 'overview', num: '01', label: 'OVERVIEW' },
  { id: 'monitor', num: '02', label: 'LIVE COCKPIT' },
  { id: 'analytics', num: '03', label: 'ANALYTICS' },
  { id: 'history', num: '04', label: 'FLIGHT VAULT' },
];

/**
 * DriveGuard AI — SSTR-Inspired Industrial Engineering Navigation Bar
 * Reference: SSTR (https://sstr.tech/en/)
 * High-precision carbon obsidian field, SSTR Electric Safety Orange (#FE5B2A) beacon,
 * crisp monospace indices, and tactile hardware ignition CTA.
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
    <header className="sstr-navbar-header" role="banner">
      <div className="sstr-navbar-container">
        {/* Left: Industrial Brand Crest & Index */}
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
          className="sstr-brand-button"
        >
          <div className="sstr-brand-crest">
            <Shield size={16} strokeWidth={2.2} className="sstr-shield-icon" />
            <span
              className={`sstr-beacon-dot ${
                isOnline && isMonitoring
                  ? 'active'
                  : isOnline
                  ? 'standby'
                  : 'offline'
              }`}
            />
          </div>

          <div className="sstr-brand-text-group">
            <span className="sstr-brand-title">DRIVEGUARD</span>
            <span className="sstr-brand-badge">// AI</span>
            <span className="sstr-brand-index">SYS.01</span>
          </div>
        </div>

        {/* Center: Segmented Hardware Navigation Dock */}
        <nav className="sstr-nav-dock" aria-label="Main Navigation">
          {NAV_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`sstr-nav-tab ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="sstr-tab-num">{tab.num}</span>
                <span className="sstr-tab-label">{tab.label}</span>
                {isActive && <span className="sstr-tab-active-pip" />}
              </button>
            );
          })}
        </nav>

        {/* Right: Unified Controls, Diagnostics & Ignition CTA */}
        <div className="sstr-controls-cluster">
          {/* Telemetry / Engine Status Pill */}
          <button
            onClick={onOpenDiagnostics}
            title={
              isOnline
                ? `Engine Connected (${fps} FPS, ${latencyMs}ms). Click for Diagnostics & Tunnel settings.`
                : 'Engine Disconnected. Click to connect local engine or Cloudflare Tunnel.'
            }
            aria-label="Engine connection diagnostics"
            className={`sstr-status-pill ${
              isOnline ? (isMonitoring ? 'online' : 'standby') : 'offline'
            }`}
          >
            <span className="sstr-status-pulse-ring" />
            <span className="sstr-status-label">
              {isOnline
                ? isMonitoring
                  ? fps > 0
                    ? `${fps} FPS`
                    : 'LIVE'
                  : 'STANDBY'
                : 'OFFLINE'}
            </span>
            <Activity size={12} className="sstr-status-icon" />
          </button>

          {/* Grouped Audio & Notification Quick Toggles */}
          <div className="sstr-utility-group">
            <button
              onClick={onToggleAudio}
              title={isAudioMuted ? 'Unmute safety audio chimes' : 'Mute safety audio chimes'}
              aria-label={isAudioMuted ? 'Unmute safety audio' : 'Mute safety audio'}
              className={`sstr-util-btn ${isAudioMuted ? 'muted' : 'active'}`}
            >
              {isAudioMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>

            <span className="sstr-util-divider" />

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
              className={`sstr-util-btn ${
                notificationPermission === 'denied'
                  ? 'denied'
                  : isNotificationsEnabled
                  ? 'active'
                  : 'idle'
              }`}
            >
              {isNotificationsEnabled ? <Bell size={14} /> : <BellOff size={14} />}
              {isNotificationsEnabled && <span className="sstr-notif-indicator" />}
            </button>
          </div>

          {/* Primary Action Button (SSTR Electric Safety Orange Ignition CTA) */}
          <button
            onClick={handleMonitoringAction}
            aria-label={isMonitoring ? 'Halt active driver monitoring' : 'Start real-time driver monitoring'}
            className={`sstr-cta-btn ${isMonitoring ? 'monitoring' : 'idle'}`}
          >
            {isMonitoring ? (
              <>
                <Square size={11} fill="currentColor" className="sstr-cta-icon" />
                <span className="sstr-cta-text-full">HALT SENSING</span>
                <span className="sstr-cta-text-compact">HALT</span>
              </>
            ) : (
              <>
                <Play size={11} fill="currentColor" className="sstr-cta-icon" />
                <span className="sstr-cta-text-full">START MONITORING</span>
                <span className="sstr-cta-text-compact">START</span>
              </>
            )}
          </button>

          {/* Mobile Drawer Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            className="sstr-hamburger-btn"
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
          className="sstr-mobile-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setMobileMenuOpen(false);
            }
          }}
        >
          <div className="sstr-mobile-drawer">
            {/* System Status Banner in Drawer */}
            <div
              className={`sstr-mobile-status-card ${
                isOnline ? (isMonitoring ? 'online' : 'standby') : 'offline'
              }`}
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDiagnostics?.();
              }}
            >
              <div className="sstr-mobile-status-left">
                <span className="sstr-mobile-status-dot" />
                <div>
                  <div className="sstr-mobile-status-title">
                    {isOnline
                      ? isMonitoring
                        ? `OPTICAL PIPELINE ONLINE • ${fps} FPS`
                        : 'HARDWARE ON STANDBY'
                      : 'PIPELINE DISCONNECTED'}
                  </div>
                  <div className="sstr-mobile-status-sub">
                    {isOnline ? `Latency: ${latencyMs}ms • Diagnostics` : 'Configure Tunnel or Bridge'}
                  </div>
                </div>
              </div>
              <ChevronRight size={15} color="var(--text-muted)" />
            </div>

            {/* Mobile Navigation Links */}
            <div className="sstr-mobile-nav-list">
              {NAV_TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onSelectTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`sstr-mobile-nav-item ${isActive ? 'active' : ''}`}
                  >
                    <div className="sstr-mobile-nav-left">
                      <span className="sstr-mobile-nav-num">{tab.num}</span>
                      <span className="sstr-mobile-nav-label">{tab.label}</span>
                    </div>
                    {isActive ? (
                      <span className="sstr-mobile-nav-active-pip" />
                    ) : (
                      <ChevronRight size={14} className="sstr-mobile-nav-arrow" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Mobile Action Controls */}
            <div className="sstr-mobile-actions">
              <button
                onClick={handleMonitoringAction}
                className={`sstr-mobile-cta-btn ${isMonitoring ? 'monitoring' : 'idle'}`}
              >
                {isMonitoring ? (
                  <>
                    <Square size={14} fill="currentColor" />
                    <span>HALT SENSING</span>
                  </>
                ) : (
                  <>
                    <Play size={14} fill="currentColor" />
                    <span>START MONITORING</span>
                  </>
                )}
              </button>

              <button
                onClick={onToggleNotifications}
                className={`sstr-mobile-util-btn ${
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

      {/* Scoped CSS Styles for SSTR Industrial Navbar */}
      <style>{`
        .sstr-navbar-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          width: 100%;
          background: rgba(13, 14, 16, 0.88);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
          transition: background-color var(--transition-fast), border-color var(--transition-fast);
        }

        .sstr-navbar-container {
          max-width: 1440px;
          margin: 0 auto;
          height: 68px;
          padding: 0 clamp(1.25rem, 3.5vw, 3rem);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }

        /* Brand Styling */
        .sstr-brand-button {
          display: inline-flex;
          align-items: center;
          gap: 0.85rem;
          cursor: pointer;
          user-select: none;
          outline: none;
          transition: opacity var(--transition-fast);
        }
        .sstr-brand-button:hover {
          opacity: 0.92;
        }

        .sstr-brand-crest {
          position: relative;
          width: 34px;
          height: 34px;
          border-radius: 4px;
          background: #18191B;
          border: 1px solid rgba(255, 255, 255, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sstr-shield-icon {
          color: #FE5B2A;
        }

        .sstr-beacon-dot {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: 1.5px solid #0D0E10;
          background-color: #5F6470;
          transition: background-color var(--transition-fast);
        }
        .sstr-beacon-dot.active {
          background-color: #10B981;
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.8);
        }
        .sstr-beacon-dot.standby {
          background-color: #FE5B2A;
          box-shadow: 0 0 8px rgba(254, 91, 42, 0.8);
        }
        .sstr-beacon-dot.offline {
          background-color: #5F6470;
        }

        .sstr-brand-text-group {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }
        .sstr-brand-title {
          font-family: var(--font-display);
          font-size: 0.98rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #FFFFFF;
          line-height: 1;
        }
        .sstr-brand-badge {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 700;
          color: #FE5B2A;
          line-height: 1.2;
        }
        .sstr-brand-index {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: #5F6470;
          margin-left: 0.25rem;
          letter-spacing: 0.08em;
        }

        /* Center Segmented Hardware Dock */
        .sstr-nav-dock {
          display: flex;
          align-items: center;
          background: rgba(24, 25, 27, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          padding: 3px;
          gap: 2px;
        }

        .sstr-nav-tab {
          background: transparent;
          border: 1px solid transparent;
          border-radius: 4px;
          padding: 0.42rem 0.95rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          outline: none;
          position: relative;
        }
        .sstr-tab-num {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: #5F6470;
          letter-spacing: 0.06em;
          font-weight: 600;
          transition: color var(--transition-fast);
        }
        .sstr-tab-label {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          color: #9FA4B0;
          transition: color var(--transition-fast);
        }
        .sstr-tab-active-pip {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: #FE5B2A;
          box-shadow: 0 0 6px #FE5B2A;
          margin-left: 2px;
        }

        .sstr-nav-tab:hover:not(.active) {
          background: rgba(255, 255, 255, 0.04);
        }
        .sstr-nav-tab:hover:not(.active) .sstr-tab-label {
          color: #FFFFFF;
        }

        .sstr-nav-tab.active {
          background: #202226;
          border-color: rgba(255, 255, 255, 0.12);
        }
        .sstr-nav-tab.active .sstr-tab-num {
          color: #FE5B2A;
        }
        .sstr-nav-tab.active .sstr-tab-label {
          color: #FFFFFF;
        }

        /* Right Controls Cluster */
        .sstr-controls-cluster {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        /* Telemetry Status Capsule */
        .sstr-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.45rem 0.85rem;
          border-radius: 4px;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          cursor: pointer;
          outline: none;
          transition: all var(--transition-fast);
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(24, 25, 27, 0.7);
          color: #9FA4B0;
        }
        .sstr-status-pill:hover {
          border-color: rgba(255, 255, 255, 0.25);
          color: #FFFFFF;
        }
        .sstr-status-pill.online {
          background: rgba(16, 185, 129, 0.1);
          border-color: rgba(16, 185, 129, 0.35);
          color: #34D399;
        }
        .sstr-status-pill.standby {
          background: rgba(254, 91, 42, 0.1);
          border-color: rgba(254, 91, 42, 0.35);
          color: #FE5B2A;
        }
        .sstr-status-pill.offline {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.3);
          color: #F87171;
        }

        .sstr-status-pulse-ring {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: currentColor;
        }
        .sstr-status-pill.online .sstr-status-pulse-ring {
          animation: sstrGreenPulse 2s ease-in-out infinite;
        }
        .sstr-status-pill.standby .sstr-status-pulse-ring {
          animation: sstrOrangePulse 2s ease-in-out infinite;
        }
        .sstr-status-icon {
          opacity: 0.7;
        }

        /* Audio & Notifications Capsule */
        .sstr-utility-group {
          display: inline-flex;
          align-items: center;
          background: rgba(24, 25, 27, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          padding: 2px 4px;
        }
        .sstr-util-btn {
          background: transparent;
          border: none;
          padding: 0.38rem 0.55rem;
          color: #9FA4B0;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 3px;
          transition: all var(--transition-fast);
          position: relative;
        }
        .sstr-util-btn:hover {
          color: #FFFFFF;
          background: rgba(255, 255, 255, 0.06);
        }
        .sstr-util-btn.muted {
          color: #EF4444;
        }
        .sstr-util-btn.denied {
          color: #EF4444;
        }
        .sstr-util-divider {
          width: 1px;
          height: 14px;
          background-color: rgba(255, 255, 255, 0.1);
          margin: 0 2px;
        }
        .sstr-notif-indicator {
          position: absolute;
          top: 3px;
          right: 3px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: #FE5B2A;
        }

        /* Ignition CTA Button */
        .sstr-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.55rem 1.25rem;
          border-radius: 4px;
          font-family: var(--font-mono);
          font-size: 0.76rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all var(--transition-fast);
          border: none;
        }
        .sstr-cta-btn.idle {
          background-color: #FE5B2A;
          color: #FFFFFF;
          box-shadow: 0 2px 14px rgba(254, 91, 42, 0.35);
        }
        .sstr-cta-btn.idle:hover {
          background-color: #FF6E3F;
          box-shadow: 0 4px 20px rgba(254, 91, 42, 0.5);
          transform: translateY(-1px);
        }
        .sstr-cta-btn.monitoring {
          background-color: #202226;
          color: #EF4444;
          border: 1px solid rgba(239, 68, 68, 0.35);
        }
        .sstr-cta-btn.monitoring:hover {
          background-color: #282A30;
          border-color: #EF4444;
        }

        .sstr-cta-text-compact {
          display: none;
        }

        .sstr-hamburger-btn {
          display: none;
          background: rgba(24, 25, 27, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          padding: 0.45rem;
          color: #FFFFFF;
          cursor: pointer;
        }

        /* Mobile Drawer Styles */
        .sstr-mobile-overlay {
          position: fixed;
          inset: 0;
          z-index: 1050;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(12px);
          display: flex;
          justifyContent: flex-end;
        }
        .sstr-mobile-drawer {
          width: 85%;
          max-width: 380px;
          height: 100%;
          background: #141518;
          border-left: 1px solid rgba(255, 255, 255, 0.1);
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          overflow-y: auto;
        }
        .sstr-mobile-status-card {
          padding: 1rem;
          border-radius: 6px;
          background: #18191B;
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justifyContent: space-between;
          align-items: center;
          cursor: pointer;
        }
        .sstr-mobile-status-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .sstr-mobile-status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #FE5B2A;
        }
        .sstr-mobile-status-title {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 700;
          color: #FFFFFF;
        }
        .sstr-mobile-status-sub {
          font-family: var(--font-sans);
          font-size: 0.72rem;
          color: #9FA4B0;
        }
        .sstr-mobile-nav-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .sstr-mobile-nav-item {
          display: flex;
          justifyContent: space-between;
          align-items: center;
          padding: 0.85rem 1rem;
          background: #18191B;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 4px;
          cursor: pointer;
          color: #FFFFFF;
          text-align: left;
        }
        .sstr-mobile-nav-item.active {
          border-color: #FE5B2A;
          background: rgba(254, 91, 42, 0.08);
        }
        .sstr-mobile-nav-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .sstr-mobile-nav-num {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: #FE5B2A;
          font-weight: 700;
        }
        .sstr-mobile-nav-label {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.06em;
        }
        .sstr-mobile-nav-active-pip {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #FE5B2A;
          box-shadow: 0 0 8px #FE5B2A;
        }
        .sstr-mobile-actions {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .sstr-mobile-cta-btn {
          width: 100%;
          padding: 0.85rem;
          background: #FE5B2A;
          color: #FFFFFF;
          border: none;
          border-radius: 4px;
          font-family: var(--font-mono);
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .sstr-mobile-util-btn {
          width: 100%;
          padding: 0.75rem;
          background: #18191B;
          color: #9FA4B0;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .sstr-nav-dock {
            display: none;
          }
          .sstr-hamburger-btn {
            display: flex;
          }
        }
        @media (max-width: 640px) {
          .sstr-cta-text-full {
            display: none;
          }
          .sstr-cta-text-compact {
            display: inline;
          }
          .sstr-utility-group {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}