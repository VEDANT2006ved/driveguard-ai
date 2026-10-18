import React, { useEffect, useState } from 'react';

/**
 * Preloader Component (Wispr Flow Inspired Swift Entrance)
 * Provides an elegant, fleeting brand reveal without a blocking timer.
 * Respects reduced-motion preferences immediately.
 */
export default function Preloader({ onComplete }) {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Instant bypass if user prefers reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      onComplete?.();
      return;
    }

    // Swift 450ms reveal: elegant, non-blocking
    const timer = setTimeout(() => {
      setIsFading(true);
      const exitTimer = setTimeout(() => {
        onComplete?.();
      }, 400);
      return () => clearTimeout(exitTimer);
    }, 450);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      onClick={() => onComplete?.()}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'var(--bg-canvas)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isFading ? 0 : 1,
        transform: isFading ? 'scale(1.02)' : 'scale(1)',
        transition: 'opacity 0.4s var(--ease-expo), transform 0.4s var(--ease-expo)',
        pointerEvents: isFading ? 'none' : 'auto',
        cursor: 'pointer',
      }}
    >
      {/* Central Brand Reveal */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          textAlign: 'center',
        }}
      >
        {/* Subtle Waveform / Orbit Icon */}
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '9999px',
            backgroundColor: 'var(--color-lavender)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(124, 58, 237, 0.15)',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12" stroke="#22103E" strokeWidth="2" strokeLinecap="round"/>
            <path d="M7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12" stroke="#22103E" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="12" r="2.5" fill="#22103E"/>
          </svg>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
          <span
            className="font-serif"
            style={{
              fontSize: '2.5rem',
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
              fontSize: '2.5rem',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              color: 'var(--text-primary)',
              lineHeight: 1,
            }}
          >
            Guard
          </span>
          <span
            className="font-mono"
            style={{
              fontSize: '0.8rem',
              color: 'var(--color-purple)',
              fontWeight: 600,
              marginLeft: '0.2rem',
            }}
          >
            AI
          </span>
        </div>

        <span
          className="label-editorial"
          style={{
            fontSize: '0.68rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.14em',
          }}
        >
          NEURAL VEHICLE TELEMETRY
        </span>
      </div>
    </div>
  );
}
