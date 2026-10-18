import React, { useEffect, useState } from 'react';

/**
 * Preloader Component (VANTAGE Automotive Editorial Entrance)
 * Provides a refined, swift brand reveal with minimal blocking latency.
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
        backgroundColor: '#0D0E10',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isFading ? 0 : 1,
        transform: isFading ? 'scale(1.02)' : 'scale(1)',
        transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
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
          gap: '1.25rem',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '2px',
              backgroundColor: 'var(--color-accent-red)',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-condensed)',
              fontSize: '2.8rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#FFFFFF',
              lineHeight: 1,
            }}
          >
            DRIVEGUARD.AI
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--text-light-muted)',
          }}
        >
          <span>SYS.01</span>
          <span>//</span>
          <span>EDGE BIOMETRIC ATTENTIVENESS</span>
        </div>

        {/* Hairline Progress Indicator */}
        <div
          style={{
            width: '120px',
            height: '1px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            position: 'relative',
            overflow: 'hidden',
            marginTop: '0.5rem',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '40%',
              backgroundColor: 'var(--color-accent-red)',
              animation: 'telemetryPulse 1s ease-in-out infinite',
            }}
          />
        </div>
      </div>
    </div>
  );
}
