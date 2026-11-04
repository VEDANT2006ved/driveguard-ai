import React from 'react';

export default function Footer({ activeTab, onSelectTab, connectionStatus, isMonitoring, fps, latencyMs }) {
  const isOnline = connectionStatus === 'online';

  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        backgroundColor: 'var(--bg-secondary)',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '22px', height: '22px',
            backgroundColor: 'var(--text-primary)',
            borderRadius: '5px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              <circle cx="12" cy="12" r="3" fill="white" stroke="white" />
            </svg>
          </div>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>DriveGuard AI</span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>— Driver Safety Monitoring</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {isOnline && fps > 0 && (
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              {fps} FPS{latencyMs > 0 ? ` · ${latencyMs}ms` : ''}
            </span>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              backgroundColor: isOnline ? 'var(--color-safe)' : 'var(--text-muted)',
              display: 'inline-block',
            }}
              className={isOnline ? 'animate-pulse-live' : ''}
            />
            {isOnline ? 'Backend connected' : 'Backend offline'}
          </div>
        </div>
      </div>
    </footer>
  );
}
