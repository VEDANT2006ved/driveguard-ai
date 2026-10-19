import React, { useState, useMemo } from 'react';
import { Compass, ZoomIn, ZoomOut, RotateCcw, AlertTriangle, Navigation, MapPin } from 'lucide-react';

/**
 * RouteVisualizer Component
 * Renders an interactive, responsive SVG route plot based exclusively on recorded GPS coordinates.
 * Shows start/end pins, plotted path, compass rose, scale bar, and location-tagged safety incident markers.
 */
export default function RouteVisualizer({
  waypoints = [],
  incidents = [],
  isLive = false,
  isSimulated = false,
  totalDistanceKm = 0,
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeTooltip, setActiveTooltip] = useState(null);

  // SVG viewBox dimensions
  const SVG_WIDTH = 640;
  const SVG_HEIGHT = 380;
  const PADDING = 45;

  // Compute bounding box and projection
  const bounds = useMemo(() => {
    if (waypoints.length === 0) {
      return null;
    }

    let minLat = Infinity;
    let maxLat = -Infinity;
    let minLng = Infinity;
    let maxLng = -Infinity;

    waypoints.forEach((p) => {
      if (p.lat < minLat) minLat = p.lat;
      if (p.lat > maxLat) maxLat = p.lat;
      if (p.lng < minLng) minLng = p.lng;
      if (p.lng > maxLng) maxLng = p.lng;
    });

    // Also include incidents with coordinates in bounding box
    incidents.forEach((inc) => {
      if (inc.lat !== null && inc.lng !== null) {
        if (inc.lat < minLat) minLat = inc.lat;
        if (inc.lat > maxLat) maxLat = inc.lat;
        if (inc.lng < minLng) minLng = inc.lng;
        if (inc.lng > maxLng) maxLng = inc.lng;
      }
    });

    // Ensure non-zero span to prevent division by zero
    const latSpan = Math.max(maxLat - minLat, 0.0008);
    const lngSpan = Math.max(maxLng - minLng, 0.0008);

    return {
      minLat: minLat - latSpan * 0.08,
      maxLat: maxLat + latSpan * 0.08,
      minLng: minLng - lngSpan * 0.08,
      maxLng: maxLng + lngSpan * 0.08,
      latSpan: latSpan * 1.16,
      lngSpan: lngSpan * 1.16,
    };
  }, [waypoints, incidents]);

  // Project (lat, lng) to SVG (x, y) coordinates
  const project = (lat, lng) => {
    if (!bounds) return { x: SVG_WIDTH / 2, y: SVG_HEIGHT / 2 };
    const normX = (lng - bounds.minLng) / bounds.lngSpan;
    // Invert Y because SVG y-axis runs downward while latitude runs upward
    const normY = 1 - (lat - bounds.minLat) / bounds.latSpan;

    const x = PADDING + normX * (SVG_WIDTH - 2 * PADDING);
    const y = PADDING + normY * (SVG_HEIGHT - 2 * PADDING);
    return { x, y };
  };

  // Generate SVG polyline points string
  const pointsString = useMemo(() => {
    if (waypoints.length < 2) return '';
    return waypoints
      .map((p) => {
        const { x, y } = project(p.lat, p.lng);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }, [waypoints, bounds]);

  const startPoint = waypoints.length > 0 ? project(waypoints[0].lat, waypoints[0].lng) : null;
  const currentPoint =
    waypoints.length > 0
      ? project(waypoints[waypoints.length - 1].lat, waypoints[waypoints.length - 1].lng)
      : null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        width: '100%',
        position: 'relative',
      }}
    >
      {/* Top Map Controls Strip */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          fontSize: '0.74rem',
          fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span style={{ color: '#77756F' }}>
            WAYPOINTS: <strong style={{ color: '#171717' }}>{waypoints.length}</strong>
          </span>
          <span style={{ color: '#E6E2DA' }}>·</span>
          <span style={{ color: '#77756F' }}>
            HAUL: <strong style={{ color: '#D66A45' }}>{totalDistanceKm.toFixed(2)} km</strong>
          </span>

          {isSimulated && (
            <span
              style={{
                backgroundColor: 'rgba(214, 106, 69, 0.1)',
                color: '#D66A45',
                border: '1px solid rgba(214, 106, 69, 0.3)',
                padding: '0.15rem 0.5rem',
                borderRadius: '3px',
                fontSize: '0.68rem',
                fontWeight: 600,
              }}
            >
              DEV LAB SIMULATION
            </span>
          )}
        </div>

        {/* Zoom & View Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.0))}
            title="Zoom In"
            aria-label="Zoom in on route map"
            style={{
              background: '#FFFFFF',
              border: '1px solid #E6E2DA',
              borderRadius: '3px',
              padding: '0.3rem 0.5rem',
              cursor: 'pointer',
              color: '#171717',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ZoomIn size={12} />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
            title="Zoom Out"
            aria-label="Zoom out on route map"
            style={{
              background: '#FFFFFF',
              border: '1px solid #E6E2DA',
              borderRadius: '3px',
              padding: '0.3rem 0.5rem',
              cursor: 'pointer',
              color: '#171717',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ZoomOut size={12} />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            title="Reset View"
            aria-label="Reset route zoom"
            style={{
              background: '#FFFFFF',
              border: '1px solid #E6E2DA',
              borderRadius: '3px',
              padding: '0.3rem 0.5rem',
              cursor: 'pointer',
              color: '#77756F',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      {/* SVG Map Canvas */}
      <div
        style={{
          width: '100%',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E6E2DA',
          borderRadius: '6px',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
        }}
      >
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '400px',
            display: 'block',
            backgroundColor: '#FAF9F6',
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center center',
            transition: 'transform 0.2s ease',
          }}
        >
          {/* Subtle Grid Background Pattern */}
          <defs>
            <pattern id="gpsGrid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#EFECE6" strokeWidth="0.8" />
            </pattern>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2E7D32" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#D66A45" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#D66A45" stopOpacity="1" />
            </linearGradient>
            <filter id="routeShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#171717" floodOpacity="0.12" />
            </filter>
          </defs>

          <rect width="100%" height="100%" fill="url(#gpsGrid)" />

          {/* Empty State: Waiting for GPS Points */}
          {waypoints.length === 0 && (
            <g>
              <circle
                cx={SVG_WIDTH / 2}
                cy={SVG_HEIGHT / 2}
                r="60"
                fill="none"
                stroke="#E6E2DA"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <circle cx={SVG_WIDTH / 2} cy={SVG_HEIGHT / 2} r="4" fill="#B3AFA8" />
              <text
                x={SVG_WIDTH / 2}
                y={SVG_HEIGHT / 2 + 35}
                textAnchor="middle"
                fontFamily="var(--font-mono, monospace)"
                fontSize="11"
                fill="#77756F"
                letterSpacing="0.08em"
              >
                WAITING FOR GPS POSITION FIX
              </text>
            </g>
          )}

          {/* Single Point Beacon */}
          {waypoints.length === 1 && startPoint && (
            <g>
              <circle
                cx={startPoint.x}
                cy={startPoint.y}
                r="28"
                fill="none"
                stroke="#D66A45"
                strokeWidth="1.5"
                opacity="0.4"
                className="telemetry-pulse"
              />
              <circle cx={startPoint.x} cy={startPoint.y} r="8" fill="#D66A45" />
              <text
                x={startPoint.x}
                y={startPoint.y - 14}
                textAnchor="middle"
                fontFamily="var(--font-mono, monospace)"
                fontSize="10"
                fontWeight="600"
                fill="#171717"
              >
                CURRENT FIX
              </text>
            </g>
          )}

          {/* Multi-point Route Polyline */}
          {waypoints.length >= 2 && (
            <g>
              {/* Outer path glow */}
              <polyline
                points={pointsString}
                fill="none"
                stroke="#D66A45"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.18"
              />
              {/* Core Route Path */}
              <polyline
                points={pointsString}
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#routeShadow)"
              />
            </g>
          )}

          {/* Start Point Pin */}
          {startPoint && waypoints.length >= 2 && (
            <g>
              <circle cx={startPoint.x} cy={startPoint.y} r="7" fill="#2E7D32" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx={startPoint.x} cy={startPoint.y} r="2.5" fill="#FFFFFF" />
              <text
                x={startPoint.x}
                y={startPoint.y + 16}
                textAnchor="middle"
                fontFamily="var(--font-mono, monospace)"
                fontSize="9"
                fontWeight="700"
                fill="#2E7D32"
                letterSpacing="0.05em"
              >
                START
              </text>
            </g>
          )}

          {/* Current / End Point Pin */}
          {currentPoint && waypoints.length >= 2 && (
            <g>
              {isLive && (
                <circle
                  cx={currentPoint.x}
                  cy={currentPoint.y}
                  r="14"
                  fill="none"
                  stroke="#D66A45"
                  strokeWidth="1.5"
                  opacity="0.4"
                  className="telemetry-pulse"
                />
              )}
              <circle cx={currentPoint.x} cy={currentPoint.y} r="8" fill="#D66A45" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx={currentPoint.x} cy={currentPoint.y} r="3" fill="#FFFFFF" />
              <text
                x={currentPoint.x}
                y={currentPoint.y - 12}
                textAnchor="middle"
                fontFamily="var(--font-mono, monospace)"
                fontSize="9"
                fontWeight="700"
                fill="#D66A45"
                letterSpacing="0.05em"
              >
                {isLive ? 'LIVE' : 'END'}
              </text>
            </g>
          )}

          {/* Location-Tagged Incident Markers */}
          {incidents.map((inc, i) => {
            if (inc.lat === null || inc.lng === null) return null;
            const pos = project(inc.lat, inc.lng);
            const isCrit = inc.severity === 'CRITICAL';
            const color = isCrit ? '#DC2626' : '#D97706';

            return (
              <g
                key={inc.id || i}
                onClick={() => setActiveTooltip(activeTooltip?.id === inc.id ? null : inc)}
                style={{ cursor: 'pointer' }}
              >
                <circle cx={pos.x} cy={pos.y} r="9" fill={color} stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx={pos.x} cy={pos.y} r="3.5" fill="#FFFFFF" />
                <text
                  x={pos.x}
                  y={pos.y - 12}
                  textAnchor="middle"
                  fontFamily="var(--font-mono, monospace)"
                  fontSize="8.5"
                  fontWeight="700"
                  fill={color}
                >
                  !
                </text>
              </g>
            );
          })}

          {/* Compass Rose Indicator (Top Right) */}
          <g transform={`translate(${SVG_WIDTH - 42}, 36)`}>
            <circle cx="0" cy="0" r="16" fill="#FFFFFF" stroke="#E6E2DA" strokeWidth="1" />
            {/* North pointer */}
            <polygon points="0,-12 3,2 0,0" fill="#D66A45" />
            <polygon points="0,-12 -3,2 0,0" fill="#171717" />
            {/* South pointer */}
            <polygon points="0,12 3,-2 0,0" fill="#77756F" />
            <polygon points="0,12 -3,-2 0,0" fill="#B3AFA8" />
            <text x="0" y="-14" textAnchor="middle" fontFamily="var(--font-mono, monospace)" fontSize="8" fontWeight="700" fill="#D66A45">
              N
            </text>
          </g>

          {/* Scale Bar Indicator (Bottom Left) */}
          <g transform={`translate(24, ${SVG_HEIGHT - 22})`}>
            <rect x="0" y="0" width="60" height="2" fill="#171717" />
            <line x1="0" y1="-3" x2="0" y2="5" stroke="#171717" strokeWidth="1" />
            <line x1="60" y1="-3" x2="60" y2="5" stroke="#171717" strokeWidth="1" />
            <text x="30" y="-5" textAnchor="middle" fontFamily="var(--font-mono, monospace)" fontSize="7.5" fill="#77756F">
              {totalDistanceKm > 1 ? '1.0 km' : '250 m'}
            </text>
          </g>
        </svg>

        {/* Interactive Tooltip for Clicked Incident Pin */}
        {activeTooltip && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #171717',
              borderRadius: '4px',
              padding: '0.65rem 0.95rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
              maxWidth: '260px',
              fontSize: '0.74rem',
              fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
              zIndex: 10,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <span
                style={{
                  fontWeight: 700,
                  color: activeTooltip.severity === 'CRITICAL' ? '#DC2626' : '#D97706',
                }}
              >
                ● {activeTooltip.severity} EVENT
              </span>
              <button
                onClick={() => setActiveTooltip(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#77756F', fontSize: '0.9rem' }}
              >
                ×
              </button>
            </div>
            <div style={{ fontWeight: 600, color: '#171717', marginBottom: '0.2rem' }}>
              {activeTooltip.type}
            </div>
            {activeTooltip.metric && (
              <div style={{ color: '#77756F', marginBottom: '0.2rem' }}>
                Metric: {activeTooltip.metric}
              </div>
            )}
            <div style={{ color: '#77756F', fontSize: '0.68rem' }}>
              GPS: {activeTooltip.lat?.toFixed(5)}°, {activeTooltip.lng?.toFixed(5)}°
            </div>
          </div>
        )}
      </div>

      {/* Disclaimers & Legal Notice */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
          fontSize: '0.68rem',
          color: '#77756F',
          fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
        }}
      >
        <span>
          Plotted from actual recorded GPS coordinates (straight-line Haversine samples; not turn-by-turn road navigation).
        </span>
        <span>NO PAID APIS · ZERO EXTERNAL TELEMETRY LEAKS</span>
      </div>
    </div>
  );
}
