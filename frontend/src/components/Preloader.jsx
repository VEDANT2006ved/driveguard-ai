import React, { useEffect, useState } from 'react';

/**
 * Preloader — minimal branded loading screen.
 * Completes in under 1.5s to avoid blocking.
 */
export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Respect reduced motion — skip instantly
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onComplete?.();
      return;
    }

    let raf;
    const start = performance.now();
    const duration = 900;

    const tick = (now) => {
      const elapsed = now - start;
      const p = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(p);
      if (p < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => onComplete?.(), 150);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        zIndex: 9999,
      }}
    >
      {/* Logo mark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '40px', height: '40px',
          backgroundColor: 'var(--text-primary)',
          borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <circle cx="12" cy="12" r="3" fill="white" stroke="white" />
          </svg>
        </div>
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.25rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
        }}>DriveGuard AI</span>
      </div>

      {/* Progress bar */}
      <div style={{
        width: '160px',
        height: '2px',
        backgroundColor: 'var(--border)',
        borderRadius: 'var(--radius-pill)',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          backgroundColor: 'var(--text-primary)',
          borderRadius: 'var(--radius-pill)',
          transition: 'width 60ms linear',
        }} />
      </div>
    </div>
  );
}
