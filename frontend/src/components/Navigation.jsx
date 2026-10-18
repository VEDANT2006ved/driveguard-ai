import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Bell, BellOff, Play, Square, Menu, X, ArrowUpRight } from 'lucide-react';

const NAV_TABS = [
  { id: 'overview', num: '01', label: 'OVERVIEW' },
  { id: 'monitor', num: '02', label: 'LIVE MONITOR' },
  { id: 'analytics', num: '03', label: 'ANALYTICS' },
  { id: 'history', num: '04', label: 'TRIP HISTORY' },
];

export default function Navigation({
  activeTab,
  onSelectTab,
  connectionStatus = 'offline',
  isMonitoring = true,
  onToggleMonitoring,
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

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        width: '100%',
        backgroundColor: 'rgba(247, 246, 242, 0.96)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      {/* Top Main Navigation Bar */}
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0.85rem clamp(1.25rem, 4vw, 3.5rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}
      >
        {/* Brand: Uppercase Minimalist Architectural Wordmark */}
        <div
          onClick={() => onSelectTab('overview')}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              backgroundColor: isOnline && isMonitoring ? 'var(--color-accent-green)' : '#111111',
            }}
            className={isOnline && isMonitoring ? 'telemetry-pulse' : ''}
          />
          <span
            className="font-condensed"
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: 'var(--text-primary)',
              textTransform: 'uppercase',
            }}
          >
            DRIVEGUARD<span style={{ color: 'var(--color-accent-red)', marginLeft: '2px' }}>.</span>AI
          </span>
        </div>

        {/* Center: Minimalist Uppercase Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(1.5rem, 3vw, 2.75rem)',
          }}
          className="desktop-nav"
        >
          {NAV_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: '0.4rem 0',
                  position: 'relative',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <span
                  className="font-condensed"
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: isActive ? 600 : 400,
                    letterSpacing: '0.12em',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    transition: 'color var(--transition-fast)',
                  }}
                >
                  {tab.label}
                </span>

                {/* Subtle active underline */}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '1.5px',
                      backgroundColor: 'var(--text-primary)',
                    }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Audio, Notifs, and Start/Stop Monitoring */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Audio Mute Button */}
          <button
            onClick={onToggleAudio}
            title={isAudioMuted ? 'Unmute safety audio chimes' : 'Mute safety audio chimes'}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              padding: '0.4rem 0.65rem',
              borderRadius: '2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.74rem',
              fontFamily: 'var(--font-mono)',
              color: isAudioMuted ? 'var(--text-muted)' : 'var(--text-primary)',
              transition: 'border-color var(--transition-fast)',
            }}
          >
            {isAudioMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
            <span style={{ letterSpacing: '0.06em' }}>{isAudioMuted ? 'MUTED' : 'AUDIO'}</span>
          </button>

          {/* Desktop Notification Pill */}
          <button
            onClick={onToggleNotifications}
            title={
              notificationPermission === 'denied'
                ? 'Desktop notifications blocked. Click for instructions.'
                : 'Toggle safety notifications'
            }
            style={{
              background: notificationPermission === 'denied' ? 'var(--color-alert-dim)' : 'transparent',
              border: `1px solid ${notificationPermission === 'denied' ? 'var(--color-alert-border)' : 'var(--border-subtle)'}`,
              padding: '0.4rem 0.65rem',
              borderRadius: '2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.74rem',
              fontFamily: 'var(--font-mono)',
              color:
                notificationPermission === 'denied'
                  ? 'var(--color-alert)'
                  : isNotificationsEnabled
                  ? 'var(--color-safe)'
                  : 'var(--text-secondary)',
            }}
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

          {/* Restrained Rectangular Start/Stop Monitoring Button */}
          {isOnline ? (
            <button
              onClick={onToggleMonitoring}
              className="vantage-btn"
              style={{
                backgroundColor: isMonitoring ? '#111111' : 'var(--text-primary)',
                borderColor: 'var(--text-primary)',
                padding: '0.5rem 1.25rem',
                fontSize: '0.84rem',
              }}
            >
              {isMonitoring ? (
                <>
                  <Square size={11} fill="#FFFFFF" />
                  <span>HALT SENSING</span>
                </>
              ) : (
                <>
                  <Play size={11} fill="#FFFFFF" />
                  <span>START MONITORING</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => onSelectTab('monitor')}
              className="vantage-btn vantage-btn-outline"
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.84rem' }}
            >
              <span>COCKPIT HUD</span>
            </button>
          )}

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              width: '36px',
              height: '36px',
              borderRadius: '2px',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-primary)',
            }}
            className="mobile-hamburger-btn"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Narrow Metadata Strip Below Navigation (VANTAGE Editorial Detail) */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-ivory-subtle)',
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
          <span>SYS.01 // DRIVEGUARD CORE</span>
          <span>•</span>
          <span>PIPELINE: {isOnline ? (isMonitoring ? `${fps} FPS STREAMING` : 'PAUSED (CAMERA RELEASED)') : 'OFFLINE'}</span>
          <span>•</span>
          <span>LATENCY: {isOnline ? `${latencyMs}MS` : '--'}</span>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ color: isOnline && isMonitoring ? 'var(--color-accent-green)' : 'var(--text-muted)' }}>
            STATUS: {isOnline ? (isMonitoring ? 'MONITORING ACTIVE' : 'STANDBY') : 'DISCONNECTED'}
          </span>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--bg-canvas)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {NAV_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                onSelectTab(tab.id);
                setMobileMenuOpen(false);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                textAlign: 'left',
                padding: '0.65rem 0',
                borderBottom: '1px solid var(--border-subtle)',
                fontFamily: 'var(--font-condensed)',
                fontSize: '1.1rem',
                letterSpacing: '0.1em',
                color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: activeTab === tab.id ? 600 : 400,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>{tab.label}</span>
              <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {tab.num}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* CSS Helper for Responsive Hamburger Display */}
      <style>{`
        @media (max-width: 860px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-hamburger-btn {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
