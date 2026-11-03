import React from 'react';

/**
 * DriverIllustration Component - SSTR Engineering Vector Drawing
 * Hand-drawn optical schema of vehicle cockpit occupant with real-time biometric state feedback.
 */
export default function DriverIllustration({
  state = 'NOMINAL', // 'NOMINAL' | 'WARNING' | 'CRITICAL'
  size = 320,
  animated = true,
  theme = 'dark',   // 'dark' (default SSTR) | 'light'
}) {
  const isAlert = state === 'CRITICAL';
  const isWarn = state === 'WARNING';
  const isDark = theme === 'dark';

  const strokeColor = isDark ? '#F5F5F7' : '#141518';
  const fillColor = isDark ? '#141518' : '#F5F5F7';
  const alertColor = '#EF4444';
  const warnColor = '#FE5B2A';
  const accentColor = isAlert ? alertColor : isWarn ? warnColor : (isDark ? '#FE5B2A' : '#141518');

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
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity={isDark ? 0.35 : 0.8}
        />

        {/* Minimalist Seat Back */}
        <path
          d="M 90 230 L 80 130 C 78 110, 86 95, 102 95 L 115 95"
          stroke={strokeColor}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.8}
        />
        {/* Seat Headrest */}
        <rect
          x="88"
          y="68"
          width="24"
          height="22"
          rx="3"
          stroke={strokeColor}
          strokeWidth="1.6"
          fill="none"
          opacity={0.8}
        />

        {/* Driver Torso & Arm */}
        <path
          d="M 108 190 C 120 180, 138 180, 160 195 L 180 230"
          stroke={strokeColor}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        {/* Arm reaching toward steering wheel */}
        <path
          d="M 132 155 Q 165 160, 205 170"
          stroke={strokeColor}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        {/* Forearm & hand gripping wheel */}
        <path
          d="M 205 170 L 222 165"
          stroke={strokeColor}
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* Driver Head & Neck */}
        <path d="M 126 135 L 130 148" stroke={strokeColor} strokeWidth="1.6" strokeLinecap="round" />
        <path d="M 142 135 L 142 148" stroke={strokeColor} strokeWidth="1.6" strokeLinecap="round" />

        {/* Head profile / jaw */}
        <path
          d="M 118 115 C 118 92, 132 82, 146 82 C 160 82, 168 94, 168 112 C 168 126, 156 136, 142 136 C 132 136, 118 132, 118 115 Z"
          stroke={strokeColor}
          strokeWidth="1.6"
          fill={fillColor}
        />

        {/* Hair / Cap line */}
        <path
          d="M 122 100 C 126 84, 142 78, 158 84 C 162 86, 168 90, 169 96"
          stroke={strokeColor}
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* Eyeglasses frame */}
        <circle
          cx="152"
          cy="108"
          r="8"
          stroke={strokeColor}
          strokeWidth="1.4"
          fill="none"
        />
        <line x1="144" y1="108" x2="136" y2="106" stroke={strokeColor} strokeWidth="1.4" />

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
            <circle cx="152" cy="108" r="2.2" fill={strokeColor} />
          )}
        </g>

        {/* Steering Wheel & Column */}
        <g className={animated ? 'animate-steer' : ''}>
          {/* Wheel column angle */}
          <line x1="228" y1="175" x2="252" y2="230" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" opacity={0.6} />
          {/* Outer steering rim (angled ellipse) */}
          <ellipse
            cx="222"
            cy="165"
            rx="20"
            ry="38"
            transform="rotate(-25 222 165)"
            stroke={accentColor}
            strokeWidth="2.8"
            fill="none"
            style={{ transition: 'stroke 0.25s ease' }}
          />
          {/* Steering Hub */}
          <circle cx="222" cy="165" r="4" fill={strokeColor} />
        </g>

        {/* Windshield / A-pillar line suggestion */}
        <path
          d="M 235 60 L 295 210"
          stroke={strokeColor}
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity={0.3}
        />
        {/* Rearview mirror */}
        <rect
          x="210"
          y="56"
          width="26"
          height="10"
          rx="2"
          stroke={strokeColor}
          strokeWidth="1.2"
          fill={fillColor}
        />
        <line x1="223" y1="56" x2="228" y2="48" stroke={strokeColor} strokeWidth="1.2" />

        {/* Optical Scanning Vector Beams */}
        <g opacity={isAlert ? 0.3 : 0.8}>
          <path
            d="M 175 104 Q 215 95, 265 85"
            stroke={isAlert ? alertColor : '#FE5B2A'}
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <path
            d="M 175 108 L 275 108"
            stroke={isAlert ? alertColor : '#38BDF8'}
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <path
            d="M 175 112 Q 215 120, 265 130"
            stroke={isAlert ? alertColor : '#FE5B2A'}
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        </g>
      </svg>
    </div>
  );
}
