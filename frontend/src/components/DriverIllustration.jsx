import React from 'react';

/**
 * DriverIllustration Component
 * Original hand-drawn line-art illustration of an alert occupant in a vehicle cockpit,
 * adapted for both warm cream canvases and deep emerald contrast sections.
 */
export default function DriverIllustration({
  state = 'NOMINAL', // 'NOMINAL' | 'WARNING' | 'CRITICAL'
  size = 320,
  animated = true,
  theme = 'light',   // 'light' | 'dark'
}) {
  const isAlert = state === 'CRITICAL';
  const isWarn = state === 'WARNING';
  const isDark = theme === 'dark';

  const strokeColor = isDark ? '#FAF8F2' : '#171717';
  const fillColor = isDark ? '#113527' : '#FAF8F2';
  const alertColor = '#E11D48';
  const warnColor = '#F59E0B';
  const accentColor = isAlert ? alertColor : isWarn ? warnColor : strokeColor;

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: `${size}px`,
        maxWidth: '100%',
      }}
    >
      <svg
        width={size}
        height={size * 0.75}
        viewBox="0 0 360 270"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        {/* Subtle ground / dashboard baseline */}
        <line
          x1="30"
          y1="230"
          x2="330"
          y2="230"
          stroke={strokeColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity={isDark ? 0.6 : 1}
        />

        {/* Minimalist Seat Back */}
        <path
          d="M 90 230 L 80 130 C 78 110, 86 95, 102 95 L 115 95"
          stroke={strokeColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Seat Headrest */}
        <rect
          x="88"
          y="68"
          width="24"
          height="22"
          rx="6"
          stroke={strokeColor}
          strokeWidth="1.8"
          fill="none"
        />

        {/* Driver Torso & Arm */}
        <path
          d="M 108 190 C 120 180, 138 180, 160 195 L 180 230"
          stroke={strokeColor}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Arm reaching toward steering wheel */}
        <path
          d="M 132 155 Q 165 160, 205 170"
          stroke={strokeColor}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Forearm & hand gripping wheel */}
        <path
          d="M 205 170 L 222 165"
          stroke={strokeColor}
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Driver Head & Neck */}
        <path d="M 126 135 L 130 148" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M 142 135 L 142 148" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" />

        {/* Head profile / jaw */}
        <path
          d="M 118 115 C 118 92, 132 82, 146 82 C 160 82, 168 94, 168 112 C 168 126, 156 136, 142 136 C 132 136, 118 132, 118 115 Z"
          stroke={strokeColor}
          strokeWidth="1.8"
          fill={fillColor}
        />

        {/* Hair / Cap line */}
        <path
          d="M 122 100 C 126 84, 142 78, 158 84 C 162 86, 168 90, 169 96"
          stroke={strokeColor}
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Eyeglasses frame */}
        <circle
          cx="152"
          cy="108"
          r="8"
          stroke={strokeColor}
          strokeWidth="1.6"
          fill="none"
        />
        <line x1="144" y1="108" x2="136" y2="106" stroke={strokeColor} strokeWidth="1.6" />

        {/* Eye Pupil / State */}
        <g className={animated && !isAlert ? 'animate-driver-eyes' : ''}>
          {isAlert ? (
            /* Closed eye (sleeping) */
            <path
              d="M 148 109 Q 152 113, 156 109"
              stroke={alertColor}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          ) : isWarn ? (
            /* Droopy eye */
            <path
              d="M 148 108 Q 152 111, 156 108"
              stroke={warnColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
          ) : (
            /* Open alert eye pupil */
            <circle cx="152" cy="108" r="2.4" fill={strokeColor} />
          )}
        </g>

        {/* Steering Wheel & Column */}
        <g className={animated ? 'animate-steer' : ''}>
          {/* Wheel column angle */}
          <line x1="228" y1="175" x2="252" y2="230" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" />
          {/* Outer steering rim (angled ellipse) */}
          <ellipse
            cx="222"
            cy="165"
            rx="20"
            ry="38"
            transform="rotate(-25 222 165)"
            stroke={accentColor}
            strokeWidth="3.2"
            fill="none"
            style={{ transition: 'stroke 0.3s ease' }}
          />
          {/* Steering Hub */}
          <circle cx="222" cy="165" r="5" fill={strokeColor} />
        </g>

        {/* Windshield / A-pillar line suggestion */}
        <path
          d="M 235 60 L 295 210"
          stroke={strokeColor}
          strokeWidth="1.2"
          strokeDasharray="4 4"
          opacity={isDark ? 0.35 : 0.45}
        />
        {/* Rearview mirror */}
        <rect
          x="210"
          y="56"
          width="26"
          height="10"
          rx="3"
          stroke={strokeColor}
          strokeWidth="1.2"
          fill={fillColor}
        />
        <line x1="223" y1="56" x2="228" y2="48" stroke={strokeColor} strokeWidth="1.2" />

        {/* Subtly Animated Vision Wave Rays (Emerging forward from driver face) */}
        <g opacity={isAlert ? 0.2 : isDark ? 0.5 : 0.7}>
          <path
            d="M 175 104 Q 215 95, 265 85"
            stroke={isAlert ? alertColor : isDark ? '#6EE7B7' : '#7C3AED'}
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
          <path
            d="M 175 108 L 275 108"
            stroke={isAlert ? alertColor : isDark ? '#6EE7B7' : '#7C3AED'}
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />
          <path
            d="M 175 112 Q 215 120, 265 130"
            stroke={isAlert ? alertColor : isDark ? '#6EE7B7' : '#7C3AED'}
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
        </g>
      </svg>
    </div>
  );
}
