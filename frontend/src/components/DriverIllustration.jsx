import React from 'react';

/**
 * DriverIllustration — clean SVG illustration for the camera standby state.
 * Shows a driver silhouette with contextual state indicator.
 */
export default function DriverIllustration({ state = 'NOMINAL', size = 160, theme = 'dark' }) {
  const isDark = theme === 'dark';
  const baseColor = isDark ? 'rgba(255,255,255,0.15)' : 'var(--border)';
  const faceColor = isDark ? 'rgba(255,255,255,0.3)' : '#D4D4D4';

  const isCritical = state === 'CRITICAL';
  const isWarning  = state === 'WARNING';

  const eyeColor = isCritical
    ? '#E5484D'
    : isWarning
    ? '#E99A27'
    : (isDark ? 'rgba(255,255,255,0.6)' : '#171717');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
      aria-label="Driver illustration"
    >
      {/* Body / torso */}
      <ellipse cx="80" cy="140" rx="45" ry="30" fill={baseColor} />
      <rect x="52" y="110" width="56" height="40" rx="10" fill={baseColor} />

      {/* Neck */}
      <rect x="70" y="92" width="20" height="20" rx="5" fill={faceColor} />

      {/* Head */}
      <ellipse cx="80" cy="78" rx="30" ry="34" fill={faceColor} />

      {/* Eyes */}
      {isCritical ? (
        // Closed eyes (microsleep)
        <>
          <line x1="62" y1="72" x2="74" y2="72" stroke={eyeColor} strokeWidth="3" strokeLinecap="round" />
          <line x1="86" y1="72" x2="98" y2="72" stroke={eyeColor} strokeWidth="3" strokeLinecap="round" />
        </>
      ) : (
        // Open eyes
        <>
          <ellipse cx="68" cy="72" rx="6" ry="5" fill={eyeColor} />
          <ellipse cx="92" cy="72" rx="6" ry="5" fill={eyeColor} />
          <circle cx="69" cy="71" r="2" fill={isDark ? 'rgba(0,0,0,0.5)' : 'white'} />
          <circle cx="93" cy="71" r="2" fill={isDark ? 'rgba(0,0,0,0.5)' : 'white'} />
        </>
      )}

      {/* Mouth */}
      {isWarning ? (
        // Open (yawning)
        <ellipse cx="80" cy="90" rx="8" ry="6" fill={eyeColor} />
      ) : (
        // Neutral
        <path d="M73 90 Q80 94 87 90" stroke={eyeColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      )}

      {/* Steering wheel */}
      <circle cx="80" cy="135" r="18" stroke={baseColor} strokeWidth="3" fill="none" />
      <circle cx="80" cy="135" r="4" fill={baseColor} />
      <line x1="80" y1="117" x2="80" y2="131" stroke={baseColor} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
