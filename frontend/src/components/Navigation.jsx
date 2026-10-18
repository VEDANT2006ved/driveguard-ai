import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Bell, BellOff, Play, Square, Shield, Radio, Activity, Menu, X } from 'lucide-react';

const NAV_TABS = [
  { id: 'overview', num: '01', label: 'Overview' },
  { id: 'monitor', num: '02', label: 'Live Monitor' },
  { id: 'analytics', num: '03', label: 'Analytics' },
  { id: 'history', num: '04', label: 'Trip History' },
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
  const [timeStr, setTimeStr] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(' ')[0]);
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const isOnline = connectionStatus === 'online';

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        width: '100%',
        padding: '0.75rem clamp(1rem, 3.5vw, 2.5rem)',
        pointerEvents: 'none',
      }}
    >
      {/* Centered Floating Pill Navigation Capsule (Wispr Flow Aesthetic) */}
      <div
        className="animate-fade-down"
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          backgroundColor: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '9999px',
          padding: '0.45rem 0.65rem 0.45rem 1.15rem',
          boxShadow: '0 8px 32px rgba(23, 23, 23, 0.05), 0 1px 2px rgba(23, 23, 23, 0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          pointerEvents: 'auto',
          position: 'relative',
        }}
      >
        {/* Brand Monogram */}
        <div
          onClick={() => onSelectTab('overview')}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            userSelect: 'none',
          }}
        >
          {/* Audio/Vision Waveform Glyph */}
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '9999px',
              backgroundColor: 'var(--color-lavender)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="5" width="2" height="6" rx="1" fill="#22103E" />
              <rect x="6" y="2" width="2" height="12" rx="1" fill="#22103E" />
              <rect x="10" y="4" width="2" height="8" rx="1" fill="#22103E" />
              <rect x="14" y="6" width="2" height="4" rx="1" fill="#22103E" />
            </svg>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
            <span
              className="font-serif"
              style={{
                fontSize: '1.45rem',
                fontStyle: 'italic',
                fontWeight: 400,
                color: 'var(--text-primary)',
                lineHeight: 1,
              }}
            >
              Drive
            </span>
            <span
              className="font-display"
              style={{
                fontSize: '1.45rem',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: 'var(--text-primary)',
                lineHeight: 1,
              }}
            >
              Guard
            </span>
            <span
              className="font-mono"
              style={{
                fontSize: '0.68rem',
                color: 'var(--color-purple)',
                fontWeight: 700,
                marginLeft: '0.15rem',
              }}
            >
              AI
            </span>
          </div>
        </div>

        {/* Desktop Segmented Capsule Tab Switcher */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--bg-surface-warm)',
            borderRadius: '9999px',
            padding: '3px',
            border: '1px solid rgba(23, 23, 23, 0.04)',
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
                  background: isActive ? '#FFFFFF' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '0.42rem 1.05rem',
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  boxShadow: isActive ? '0 2px 8px rgba(0, 0, 0, 0.06)' : 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action & System Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Audio Toggle Pill */}
          <button
            onClick={onToggleAudio}
            title={isAudioMuted ? 'Unmute safety audio chimes' : 'Mute safety audio chimes'}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              borderRadius: '9999px',
              padding: '0.35rem 0.65rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: isAudioMuted ? 'var(--text-muted)' : 'var(--text-primary)',
              fontSize: '0.74rem',
              fontFamily: 'var(--font-sans)',
              fontWeight: 500,
              transition: 'all var(--transition-fast)',
            }}
            className="system-pill"
          >
            {isAudioMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
            <span>{isAudioMuted ? 'Muted' : 'Audio'}</span>
          </button>

          {/* Desktop Notification Pill */}
          <button
            onClick={onToggleNotifications}
            title={
              notificationPermission === 'unsupported'
                ? 'Desktop notifications unsupported in this browser'
                : notificationPermission === 'denied'
                ? 'Notifications blocked in browser. Click for instructions to unblock.'
                : notificationPermission === 'default'
                ? 'Click to enable browser notifications for critical safety alerts'
                : isNotificationsEnabled
                ? 'Desktop safety notifications active (Click to pause)'
                : 'Desktop safety notifications paused (Click to resume)'
            }
            style={{
              background: notificationPermission === 'denied' ? 'var(--color-alert-dim)' : 'transparent',
              border: `1px solid ${notificationPermission === 'denied' ? 'var(--color-alert-border)' : 'var(--border-subtle)'}`,
              borderRadius: '9999px',
              padding: '0.35rem 0.65rem',
              cursor: notificationPermission === 'unsupported' ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              color:
                notificationPermission === 'denied'
                  ? 'var(--color-alert)'
                  : notificationPermission === 'granted' && isNotificationsEnabled
                  ? 'var(--color-safe)'
                  : 'var(--text-secondary)',
              fontSize: '0.74rem',
              fontFamily: 'var(--font-sans)',
              fontWeight: 500,
              transition: 'all var(--transition-fast)',
            }}
            className="system-pill"
          >
            {notificationPermission === 'granted' && isNotificationsEnabled ? (
              <Bell size={13} />
            ) : (
              <BellOff size={13} />
            )}
            <span>
              {notificationPermission === 'unsupported'
                ? 'No Notifs'
                : notificationPermission === 'denied'
                ? 'Blocked'
                : notificationPermission === 'default'
                ? 'Enable'
                : isNotificationsEnabled
                ? 'Notifs On'
                : 'Notifs Off'}
            </span>
          </button>

          {/* Live Engine Status Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.65rem',
              borderRadius: '9999px',
              backgroundColor: 'var(--bg-canvas-subtle)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)',
            }}
            className="system-pill"
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: !isOnline ? '#9E988F' : isMonitoring ? '#10B981' : '#E11D48',
                display: 'inline-block',
              }}
              className={isOnline && isMonitoring ? 'animate-pulse-live' : ''}
            />
            <span>{isOnline ? (isMonitoring ? `${fps} FPS` : 'STANDBY') : 'OFFLINE'}</span>
          </div>

          {/* Primary Action Button — Wispr Flow Signature Lavender Pill */}
          {isOnline ? (
            <button
              onClick={onToggleMonitoring}
              title={isMonitoring ? 'Stop optical monitoring and release camera' : 'Start optical monitoring'}
              className="pill-btn btn-magnetic-pill"
              style={{
                backgroundColor: isMonitoring ? '#FEE2E2' : 'var(--color-lavender)',
                color: isMonitoring ? '#991B1B' : 'var(--color-lavender-ink)',
                borderColor: isMonitoring ? '#FCA5A5' : 'var(--color-lavender-border)',
                padding: '0.5rem 1.15rem',
                fontSize: '0.82rem',
                fontWeight: 600,
              }}
            >
              {isMonitoring ? (
                <>
                  <Square size={12} fill="#991B1B" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Play size={12} fill="#22103E" />
                  <span>Monitor</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => onSelectTab('monitor')}
              className="pill-btn pill-btn-ghost btn-magnetic-pill"
              style={{
                padding: '0.5rem 1.15rem',
                fontSize: '0.82rem',
              }}
            >
              Cockpit
            </button>
          )}

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              borderRadius: '9999px',
              width: '34px',
              height: '34px',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-primary)',
            }}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu Drawer */}
      {mobileMenuOpen && (
        <div
          className="animate-fade-up"
          style={{
            maxWidth: '1240px',
            margin: '0.5rem auto 0',
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid var(--border-subtle)',
            padding: '1rem',
            boxShadow: '0 12px 36px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            pointerEvents: 'auto',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {NAV_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  onSelectTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                style={{
                  backgroundColor: activeTab === tab.id ? 'var(--bg-surface-warm)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '16px',
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.82rem',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--color-purple)', marginRight: '0.35rem' }}>
                  {tab.num}
                </span>
                {tab.label}
              </button>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <button
              onClick={onToggleAudio}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.78rem',
                color: 'var(--text-primary)',
              }}
            >
              {isAudioMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              <span>{isAudioMuted ? 'Muted' : 'Audio On'}</span>
            </button>

            <button
              onClick={onToggleNotifications}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.78rem',
                color: notificationPermission === 'denied' ? 'var(--color-alert)' : 'var(--text-primary)',
              }}
            >
              <Bell size={14} />
              <span>{notificationPermission === 'denied' ? 'Blocked' : isNotificationsEnabled ? 'Notifs On' : 'Notifs Off'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Embedded CSS for responsive floating capsule */}
      <style>{`
        @media (max-width: 820px) {
          .desktop-nav {
            display: none !important;
          }
          .system-pill {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
