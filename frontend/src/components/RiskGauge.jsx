import React, { useEffect, useRef, useState } from 'react';

/**
 * RiskGauge Component (Wispr Flow Refined Attentiveness Dial)
 * An elegant circular instrument combining luxury watchmaking precision with modern AI telemetry.
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
    const duration = 380; // ms
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
    if (isAlert) return 'var(--color-alert)';
    if (isWarn) return 'var(--color-warning)';
    return 'var(--bg-emerald)';
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
          stroke="var(--bg-surface-warm)"
          strokeWidth="7"
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
          strokeWidth="7"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke 0.25s ease',
            filter: isAlert ? 'drop-shadow(0 0 6px rgba(225, 29, 72, 0.4))' : 'none',
          }}
        />

        {/* Subtle Critical Boundary Tick */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius + 8}
          fill="none"
          stroke="var(--color-alert)"
          strokeWidth="1.5"
          strokeDasharray={`${arcLength * 0.3} ${circumference}`}
          strokeDashoffset={arcLength * 0.7}
          opacity={0.7}
        />
      </svg>

      {/* Internal Minimal Readout */}
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
          className="label-editorial"
          style={{
            fontSize: '0.64rem',
            color: 'var(--text-secondary)',
            marginBottom: '0.1rem',
            letterSpacing: '0.1em',
          }}
        >
          {isLive ? 'RISK INDEX' : 'STANDBY'}
        </span>

        <div
          className="font-serif"
          style={{
            fontSize: 'clamp(2.6rem, 5vw, 3.4rem)',
            fontWeight: 400,
            lineHeight: 0.95,
            color: currentColor,
            fontStyle: 'italic',
          }}
        >
          {isLive ? displayScore : '--'}
          {isLive && (
            <span
              className="font-mono"
              style={{
                fontSize: '0.9rem',
                fontStyle: 'normal',
                color: 'var(--text-muted)',
                marginLeft: '2px',
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
            borderRadius: '9999px',
            border: `1px solid ${isAlert ? 'var(--color-alert-border)' : isWarn ? 'var(--color-warning-border)' : 'var(--border-subtle)'}`,
            backgroundColor: isAlert ? 'var(--color-alert-dim)' : isWarn ? 'var(--color-warning-dim)' : 'var(--bg-surface-warm)',
          }}
        >
          <span
            className="label-editorial"
            style={{
              fontSize: '0.58rem',
              color: isAlert ? 'var(--color-alert)' : isWarn ? 'var(--color-warning)' : 'var(--text-primary)',
              fontWeight: 700,
            }}
          >
            {isLive ? level : 'OFFLINE'}
          </span>
        </div>
      </div>
    </div>
  );
}
