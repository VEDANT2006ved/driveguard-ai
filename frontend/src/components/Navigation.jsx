import React, { useState, useEffect } from 'react';
import {
  Volume2, VolumeX, Bell, BellOff,
  Play, Square, Menu, X, Sliders, Wifi, WifiOff,
} from 'lucide-react';

const NAV_TABS = [
  { id: 'overview',   label: 'Overview' },
  { id: 'monitor',   label: 'Live Monitoring' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'history',   label: 'Trip History' },
];

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleMonitoringAction = () => {
    if (!isMonitoring) {
      if (onStartMonitoring) onStartMonitoring();
      else if (onToggleMonitoring) onToggleMonitoring();
      if (activeTab !== 'monitor') onSelectTab('monitor');
    } else {
      if (onToggleMonitoring) onToggleMonitoring();
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      role="banner"
      style={{
        width: '100%',
        backgroundColor: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1.5rem',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        {/* Logo */}
        <div
          onClick={() => onSelectTab('overview')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectTab('overview'); } }}
          tabIndex={0}
          role="button"
          aria-label="DriveGuard AI Homepage"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            userSelect: 'none',
            flexShrink: 0,
          }}
        >
          {/* Shield icon */}
          <div style={{
            width: '30px', height: '30px',
            backgroundColor: 'var(--text-primary)',
            borderRadius: '7px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              <circle cx="12" cy="12" r="3" fill="white" stroke="white" />
            </svg>
          </div>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}>
            DriveGuard AI
          </span>
        </div>

        {/* Center nav (desktop) */}
        <nav
          id="desktop-nav"
          aria-label="Main Navigation"
          style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
        >
          {NAV_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => onSelectTab(tab.id)}
                className={`nav-link ${isActive ? 'active' : ''}`}
                style={{ padding: '0.375rem 0.75rem' }}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          {/* Connection status */}
          <button
            id="nav-connection-status"
            onClick={onOpenDiagnostics}
            title={isOnline ? 'Backend connected — click to configure' : 'Backend offline — click to configure'}
            className="btn-secondary"
            style={{ padding: '0.375rem 0.75rem', gap: '0.375rem', fontSize: '0.8125rem' }}
          >
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
              backgroundColor: isOnline ? 'var(--color-safe)' : 'var(--text-muted)',
            }}
              className={isOnline ? 'animate-pulse-live' : ''}
            />
            <span id="nav-connection-label" style={{ display: 'none' }} className="show-md">
              {isOnline ? 'Connected' : 'Offline'}
            </span>
          </button>

          {/* Audio toggle */}
          <button
            id="nav-audio-toggle"
            onClick={onToggleAudio}
            className="btn-icon"
            title={isAudioMuted ? 'Unmute alerts' : 'Mute alerts'}
            aria-label={isAudioMuted ? 'Unmute audio alerts' : 'Mute audio alerts'}
          >
            {isAudioMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          {/* Settings / diagnostics */}
          <button
            id="nav-settings-btn"
            onClick={onOpenDiagnostics}
            className="btn-icon"
            title="Settings & Backend Configuration"
            aria-label="Open settings"
          >
            <Sliders size={15} />
          </button>

          {/* Start / Stop monitoring */}
          <button
            id="nav-monitoring-toggle"
            onClick={handleMonitoringAction}
            className="btn-primary"
            style={{ height: '34px', padding: '0 0.875rem', fontSize: '0.8125rem', gap: '0.375rem' }}
          >
            {isMonitoring ? (
              <>
                <Square size={11} fill="currentColor" />
                <span id="nav-stop-label">Stop</span>
              </>
            ) : (
              <>
                <Play size={11} fill="currentColor" />
                <span id="nav-start-label">Start Monitoring</span>
              </>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            id="nav-mobile-menu-btn"
            onClick={() => setMobileMenuOpen(true)}
            className="btn-icon"
            aria-label="Open menu"
            style={{ display: 'none' }}
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'var(--bg-primary)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Mobile header */}
          <div style={{
            padding: '0 1.5rem',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border)',
          }}>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}>DriveGuard AI</span>
            <button onClick={() => setMobileMenuOpen(false)} className="btn-icon" aria-label="Close menu">
              <X size={18} />
            </button>
          </div>

          {/* Mobile nav links */}
          <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
            {NAV_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { onSelectTab(tab.id); setMobileMenuOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.875rem 0.75rem',
                  background: 'none',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '1rem',
                  fontWeight: activeTab === tab.id ? 600 : 400,
                  color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  backgroundColor: activeTab === tab.id ? 'var(--bg-secondary)' : 'transparent',
                  transition: 'background-color var(--transition-fast)',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Mobile footer actions */}
          <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={handleMonitoringAction}
              className="btn-primary"
              style={{ width: '100%', height: '44px' }}
            >
              {isMonitoring ? (
                <><Square size={13} fill="currentColor" /> Stop Monitoring</>
              ) : (
                <><Play size={13} fill="currentColor" /> Start Monitoring</>
              )}
            </button>
            <button onClick={() => { onOpenDiagnostics(); setMobileMenuOpen(false); }} className="btn-secondary" style={{ width: '100%', height: '44px' }}>
              <Sliders size={15} /> Settings
            </button>
          </div>
        </div>
      )}

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 768px) {
          #desktop-nav { display: none !important; }
          #mobile-hamburger { display: inline-flex !important; }
          #nav-connection-status { display: none !important; }
          #nav-monitoring-toggle #nav-stop-label,
          #nav-monitoring-toggle #nav-start-label { display: none; }
        }
        @media (min-width: 900px) {
          #nav-connection-label { display: inline !important; }
        }
      `}</style>
    </header>
  );
}
