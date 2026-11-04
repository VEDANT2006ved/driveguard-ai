import React, { useEffect, useRef, useState } from 'react';

/**
 * RiskGauge — clean circular progress indicator.
 * Shows attention risk score from 0–100 with safe/warning/critical states.
 */
export default function RiskGauge({ score = 0, level = 'NOMINAL', isLive = false, size = 180 }) {
  const [displayScore, setDisplayScore] = useState(score);
  const animRef = useRef(null);
  const prevScore = useRef(score);

  // Smooth score animation
  useEffect(() => {
    const start = prevScore.current;
    const end = score;
    const duration = 400;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplayScore(Math.round(start + (end - start) * eased));
      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        prevScore.current = end;
      }
    };

    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(animate);

    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [score]);

  const isCritical = level === 'CRITICAL' || score >= 70;
  const isWarning  = level === 'WARNING'  || (score >= 35 && score < 70);
  const isSafe     = !isCritical && !isWarning;

  const gaugeColor = isCritical
    ? 'var(--color-critical)'
    : isWarning
    ? 'var(--color-warning)'
    : 'var(--color-safe)';

  const statusLabel = isCritical ? 'Critical' : isWarning ? 'Warning' : 'Safe';
  const statusBadge = isCritical ? 'badge-critical' : isWarning ? 'badge-warning' : 'badge-safe';

  // SVG arc math
  const radius = 70;
  const cx = 90;
  const cy = 90;
  const circumference = 2 * Math.PI * radius;
  const arcFraction = (displayScore / 100) * 0.75; // 270° sweep (3/4 circle)
  const dashOffset = circumference * (1 - arcFraction);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.875rem' }}>
      {/* SVG Gauge */}
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 180 180"
          style={{ transform: 'rotate(135deg)' }}
        >
          {/* Background track */}
          <circle
            cx={cx} cy={cy} r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
          />
          {/* Foreground arc */}
          <circle
            cx={cx} cy={cy} r={radius}
            fill="none"
            stroke={gaugeColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${circumference * arcFraction} ${circumference * (1 - arcFraction)}`}
            strokeDashoffset={0}
            style={{ transition: 'stroke 0.3s ease, stroke-dasharray 0.4s cubic-bezier(0.16,1,0.3,1)' }}
          />
        </svg>

        {/* Center content */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.25rem',
        }}>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: size > 150 ? '2.5rem' : '1.75rem',
            fontWeight: 800,
            color: gaugeColor,
            lineHeight: 1,
            letterSpacing: '-0.03em',
            transition: 'color 0.3s ease',
          }}>
            {displayScore}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Risk Score
          </div>
        </div>
      </div>

      {/* Status badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span className={`badge ${statusBadge}`}>
          {isLive && (
            <span style={{
              width: '5px', height: '5px', borderRadius: '50%',
              backgroundColor: 'currentColor', display: 'inline-block',
            }}
              className="animate-pulse-live"
            />
          )}
          {statusLabel}
        </span>
        {!isLive && (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Standby</span>
        )}
      </div>

      {/* Range reference */}
      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <span style={{ color: 'var(--color-safe)' }}>0–34 Safe</span>
        <span style={{ color: 'var(--color-warning)' }}>35–69 Warning</span>
        <span style={{ color: 'var(--color-critical)' }}>70+ Critical</span>
      </div>
    </div>
  );
}
