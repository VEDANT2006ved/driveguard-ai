import React, { useEffect, useState } from 'react';

/**
 * Preloader Component - SSTR Industrial Engineering Launch Screen
 * Provides an instantaneous, mechanical brand reveal with zero blocking latency.
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

    // Swift 400ms reveal
    const timer = setTimeout(() => {
      setIsFading(true);
      const exitTimer = setTimeout(() => {
        onComplete?.();
      }, 350);
      return () => clearTimeout(exitTimer);
    }, 400);

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
        transition: 'opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: isFading ? 'none' : 'auto',
        cursor: 'pointer',
      }}
    >
      {/* SSTR Crosshair Reticles in Corners */}
      <div style={{ position: 'absolute', top: 24, left: 24, color: 'rgba(255, 255, 255, 0.3)', fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)", fontSize: '12px' }}>+</div>
      <div style={{ position: 'absolute', top: 24, right: 24, color: 'rgba(255, 255, 255, 0.3)', fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)", fontSize: '12px' }}>+</div>
      <div style={{ position: 'absolute', bottom: 24, left: 24, color: 'rgba(255, 255, 255, 0.3)', fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)", fontSize: '12px' }}>+</div>
      <div style={{ position: 'absolute', bottom: 24, right: 24, color: 'rgba(255, 255, 255, 0.3)', fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)", fontSize: '12px' }}>+</div>

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '2px',
              backgroundColor: '#FE5B2A',
              boxShadow: '0 0 12px rgba(254, 91, 42, 0.8)',
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-display, 'Syne', sans-serif)",
              fontSize: '2.5rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: '#F5F5F7',
              lineHeight: 1,
            }}
          >
            DRIVEGUARD
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
              fontSize: '0.9rem',
              color: '#FE5B2A',
              fontWeight: 700,
              border: '1px solid rgba(254, 91, 42, 0.4)',
              padding: '0.1rem 0.4rem',
              borderRadius: '2px',
            }}
          >
            AI
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
            fontSize: '0.72rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#9FA4B0',
          }}
        >
          <span>SYS // 01</span>
          <span>•</span>
          <span>OPTICAL DRIVER VIGILANCE PLATFORM</span>
        </div>

        {/* Hairline Progress Indicator */}
        <div
          style={{
            width: '140px',
            height: '2px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            marginTop: '0.5rem',
            borderRadius: '1px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '50%',
              backgroundColor: '#FE5B2A',
              animation: 'laserScan 1.2s ease-in-out infinite alternate',
            }}
          />
        </div>
      </div>
    </div>
  );
}
