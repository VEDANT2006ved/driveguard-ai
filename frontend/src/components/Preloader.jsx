import React, { useEffect, useState } from 'react';

/**
 * Preloader Component — High-Fashion Minimalist Editorial Launch Screen
 * Provides an instantaneous brand reveal with zero blocking latency.
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

    // Swift 350ms reveal
    const timer = setTimeout(() => {
      setIsFading(true);
      const exitTimer = setTimeout(() => {
        onComplete?.();
      }, 300);
      return () => clearTimeout(exitTimer);
    }, 350);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      onClick={() => onComplete?.()}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#111111',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isFading ? 0 : 1,
        transform: isFading ? 'scale(1.02)' : 'scale(1)',
        transition: 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: isFading ? 'none' : 'auto',
        cursor: 'pointer',
      }}
    >
      {/* Corner Crosshair Reticles */}
      <div style={{ position: 'absolute', top: 24, left: 24, color: 'rgba(255, 255, 255, 0.3)', fontFamily: "var(--font-mono, monospace)", fontSize: '12px' }}>+</div>
      <div style={{ position: 'absolute', top: 24, right: 24, color: 'rgba(255, 255, 255, 0.3)', fontFamily: "var(--font-mono, monospace)", fontSize: '12px' }}>+</div>
      <div style={{ position: 'absolute', bottom: 24, left: 24, color: 'rgba(255, 255, 255, 0.3)', fontFamily: "var(--font-mono, monospace)", fontSize: '12px' }}>+</div>
      <div style={{ position: 'absolute', bottom: 24, right: 24, color: 'rgba(255, 255, 255, 0.3)', fontFamily: "var(--font-mono, monospace)", fontSize: '12px' }}>+</div>

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
          <span
            style={{
              fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
              fontSize: '2.5rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: '#F7F7F5',
              lineHeight: 1,
            }}
          >
            DRIVEGUARD
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: '0.85rem',
              color: '#F7F7F5',
              fontWeight: 700,
              border: '1px solid rgba(255, 255, 255, 0.3)',
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
            fontFamily: "var(--font-mono, monospace)",
            fontSize: '0.72rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#888888',
          }}
        >
          <span>SYS // 01</span>
          <span>•</span>
          <span>OPTICAL DRIVER VIGILANCE PLATFORM</span>
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
              backgroundColor: '#F7F7F5',
              animation: 'laserScanLine 1s ease-in-out infinite alternate',
            }}
          />
        </div>
      </div>
    </div>
  );
}
