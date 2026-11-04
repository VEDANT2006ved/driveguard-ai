import React, { useEffect, useRef, useState } from 'react';

/**
 * RiskGauge Component — High-Fashion Minimalist Editorial Edition
 * Precision circular instrument with high-contrast mechanical ticks and real-time biometric telemetry.
 */
export default function RiskGauge({
  score = 0,
  level = 'NOMINAL',
  isLive = false,
  size = 200,
}) {
  const [displayScore, setDisplayScore] = useState(score);
  const prevScoreRef = useRef(score);
  const animFrameRef = useRef(null);

  // Animate strictly when score value changes
  useEffect(() => {
    if (prevScoreRef.current === score) return;

    const startScore = prevScoreRef.current;
    const targetScore = Math.max(0, Math.min(100, Math.round(score)));
    const duration = 300; // ms
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out expo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(startScore + (targetScore - startScore) * ease);

      setDisplayScore(current);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        prevScoreRef.current = targetScore;
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [score]);

  const radius = (size - 28) / 2;
  const circumference = 2 * Math.PI * radius;
  // 270 degree open arc
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (displayScore / 100) * arcLength;

  const isAlert = displayScore >= 70;
  const isWarn = displayScore >= 35 && displayScore < 70;

  const getStrokeColor = () => {
    if (!isLive) return 'var(--text-muted)';
    if (isAlert) return 'var(--accent-crimson)';
    if (isWarn) return 'var(--accent-amber)';
    return 'var(--text-primary)';
  };

  const currentColor = getStrokeColor();

  return (
    <div
      style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          transform: 'rotate(135deg)',
          overflow: 'visible',
        }}
      >
        {/* Background Arc Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border-light)"
          strokeWidth="6"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
        />

        {/* Dynamic Risk Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={currentColor}
          strokeWidth="6"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke 0.2s ease',
          }}
        />

        {/* Critical Boundary Marker */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius + 7}
          fill="none"
          stroke="var(--accent-crimson)"
          strokeWidth="1.5"
          strokeDasharray={`${arcLength * 0.3} ${circumference}`}
          strokeDashoffset={arcLength * 0.7}
          opacity={0.7}
        />
      </svg>

      {/* Internal Minimalist Readout */}
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: '0.62rem',
            color: 'var(--text-muted)',
            marginBottom: '0.1rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          {isLive ? 'RISK INDEX' : 'STANDBY'}
        </span>

        <div
          style={{
            fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
            fontSize: 'clamp(2.4rem, 4.5vw, 3rem)',
            fontWeight: 700,
            lineHeight: 1,
            color: currentColor,
            letterSpacing: '-0.04em',
          }}
        >
          {isLive ? displayScore : '--'}
          {isLive && (
            <span
              style={{
                fontSize: '0.9rem',
                color: 'var(--text-muted)',
                marginLeft: '2px',
                fontWeight: 400,
              }}
            >
              %
            </span>
          )}
        </div>

        {/* Status Capsule Badge */}
        <div
          style={{
            marginTop: '0.35rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '0.2rem 0.65rem',
            borderRadius: '2px',
            border: `1px solid ${isAlert ? 'var(--color-alert-border)' : isWarn ? 'var(--color-warning-border)' : 'var(--border-light)'}`,
            backgroundColor: isAlert ? 'var(--color-alert-dim)' : isWarn ? 'var(--color-warning-dim)' : 'var(--bg-secondary)',
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: '0.62rem',
              color: isAlert ? 'var(--accent-crimson)' : isWarn ? 'var(--accent-amber)' : 'var(--text-primary)',
              fontWeight: 700,
              letterSpacing: '0.06em',
            }}
          >
            {isLive ? level : 'OFFLINE'}
          </span>
        </div>
      </div>
    </div>
  );
}
