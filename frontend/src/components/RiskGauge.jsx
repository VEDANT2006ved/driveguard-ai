import React, { useEffect, useRef, useState } from 'react';

/**
 * RiskGauge Component - SSTR Industrial Attentiveness Indicator
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
    const duration = 320; // ms
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
    if (!isLive) return '#666B78';
    if (isAlert) return '#EF4444';
    if (isWarn) return '#FE5B2A';
    return '#10B981';
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
          stroke="rgba(255, 255, 255, 0.08)"
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
            filter: isAlert ? 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.5))' : isWarn ? 'drop-shadow(0 0 6px rgba(254, 91, 42, 0.4))' : 'none',
          }}
        />

        {/* Subtle Critical Boundary Tick */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius + 8}
          fill="none"
          stroke="#EF4444"
          strokeWidth="1.5"
          strokeDasharray={`${arcLength * 0.3} ${circumference}`}
          strokeDashoffset={arcLength * 0.7}
          opacity={0.6}
        />
      </svg>

      {/* Internal Industrial Readout */}
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
            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
            fontSize: '0.62rem',
            color: '#9FA4B0',
            marginBottom: '0.1rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          {isLive ? 'RISK INDEX' : 'STANDBY'}
        </span>

        <div
          style={{
            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
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
                color: '#9FA4B0',
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
            border: `1px solid ${isAlert ? 'rgba(239, 68, 68, 0.4)' : isWarn ? 'rgba(254, 91, 42, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
            backgroundColor: isAlert ? 'rgba(239, 68, 68, 0.15)' : isWarn ? 'rgba(254, 91, 42, 0.15)' : 'rgba(255, 255, 255, 0.05)',
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
              fontSize: '0.6rem',
              color: isAlert ? '#EF4444' : isWarn ? '#FE5B2A' : '#F5F5F7',
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
