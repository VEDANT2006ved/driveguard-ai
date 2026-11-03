import React, { useState, useMemo } from 'react';
import { Compass, ZoomIn, ZoomOut, RotateCcw, AlertTriangle, Navigation, MapPin } from 'lucide-react';

/**
 * RouteVisualizer Component
 * High-End SSTR Industrial Responsive SVG Route Plot based exclusively on recorded GPS coordinates.
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

    incidents.forEach((inc) => {
      if (inc.lat !== null && inc.lng !== null) {
        if (inc.lat < minLat) minLat = inc.lat;
        if (inc.lat > maxLat) maxLat = inc.lat;
        if (inc.lng < minLng) minLng = inc.lng;
        if (inc.lng > maxLng) maxLng = inc.lng;
      }
    });

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
          <span style={{ color: '#5F6470' }}>
            WAYPOINTS: <strong style={{ color: '#FFFFFF' }}>{waypoints.length}</strong>
          </span>
          <span style={{ color: 'rgba(255, 255, 255, 0.15)' }}>·</span>
          <span style={{ color: '#5F6470' }}>
            HAUL: <strong style={{ color: '#FE5B2A' }}>{totalDistanceKm.toFixed(2)} km</strong>
          </span>

          {isSimulated && (
            <span
              style={{
                backgroundColor: 'rgba(254, 91, 42, 0.1)',
                color: '#FE5B2A',
                border: '1px solid rgba(254, 91, 42, 0.3)',
                padding: '0.15rem 0.5rem',
                borderRadius: '3px',
                fontSize: '0.68rem',
                fontWeight: 600,
              }}
            >
              SIMULATION ROUTE
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
              background: '#18191B',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '3px',
              padding: '0.3rem 0.5rem',
              cursor: 'pointer',
              color: '#FFFFFF',
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
              background: '#18191B',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '3px',
              padding: '0.3rem 0.5rem',
              cursor: 'pointer',
              color: '#FFFFFF',
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
              background: '#18191B',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '3px',
              padding: '0.3rem 0.5rem',
              cursor: 'pointer',
              color: '#9FA4B0',
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
          backgroundColor: '#0D0E10',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
        }}
      >
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '400px',
            display: 'block',
            backgroundColor: '#0D0E10',
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center center',
            transition: 'transform 0.2s ease',
          }}
        >
          {/* Subtle Grid Background Pattern */}
          <defs>
            <pattern id="sstrGpsGrid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="0.8" />
            </pattern>
            <linearGradient id="sstrRouteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#FE5B2A" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#FE5B2A" stopOpacity="1" />
            </linearGradient>
            <filter id="sstrRouteGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#FE5B2A" floodOpacity="0.5" />
            </filter>
          </defs>

          <rect width="100%" height="100%" fill="url(#sstrGpsGrid)" />

          {/* Empty State: Waiting for GPS Points */}
          {waypoints.length === 0 && (
            <g>
              <circle
                cx={SVG_WIDTH / 2}
                cy={SVG_HEIGHT / 2}
                r="60"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <circle cx={SVG_WIDTH / 2} cy={SVG_HEIGHT / 2} r="4" fill="#FE5B2A" />
              <text
                x={SVG_WIDTH / 2}
                y={SVG_HEIGHT / 2 + 35}
                textAnchor="middle"
                fontFamily="var(--font-mono, monospace)"
                fontSize="11"
                fill="#5F6470"
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
                stroke="#FE5B2A"
                strokeWidth="1.5"
                opacity="0.4"
                className="telemetry-pulse"
              />
              <circle cx={startPoint.x} cy={startPoint.y} r="8" fill="#FE5B2A" />
              <text
                x={startPoint.x}
                y={startPoint.y - 14}
                textAnchor="middle"
                fontFamily="var(--font-mono, monospace)"
                fontSize="10"
                fontWeight="700"
                fill="#FFFFFF"
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
                stroke="#FE5B2A"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.25"
              />
              {/* Core Route Path */}
              <polyline
                points={pointsString}
                fill="none"
                stroke="url(#sstrRouteGrad)"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#sstrRouteGlow)"
              />
            </g>
          )}

          {/* Start Point Pin */}
          {startPoint && waypoints.length >= 2 && (
            <g>
              <circle cx={startPoint.x} cy={startPoint.y} r="7" fill="#10B981" stroke="#0D0E10" strokeWidth="2" />
              <circle cx={startPoint.x} cy={startPoint.y} r="2.5" fill="#FFFFFF" />
              <text
                x={startPoint.x}
                y={startPoint.y + 16}
                textAnchor="middle"
                fontFamily="var(--font-mono, monospace)"
                fontSize="9"
                fontWeight="700"
                fill="#10B981"
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
                  stroke="#FE5B2A"
                  strokeWidth="1.5"
                  opacity="0.4"
                  className="telemetry-pulse"
                />
              )}
              <circle cx={currentPoint.x} cy={currentPoint.y} r="8" fill="#FE5B2A" stroke="#0D0E10" strokeWidth="2" />
              <circle cx={currentPoint.x} cy={currentPoint.y} r="3" fill="#FFFFFF" />
              <text
                x={currentPoint.x}
                y={currentPoint.y - 12}
                textAnchor="middle"
                fontFamily="var(--font-mono, monospace)"
                fontSize="9"
                fontWeight="700"
                fill="#FE5B2A"
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
            const color = isCrit ? '#EF4444' : '#FE5B2A';

            return (
              <g
                key={i}
                style={{ cursor: 'pointer' }}
                onClick={() => setActiveTooltip(activeTooltip === i ? null : i)}
              >
                <circle cx={pos.x} cy={pos.y} r="9" fill={color} stroke="#0D0E10" strokeWidth="2" />
                <circle cx={pos.x} cy={pos.y} r="3" fill="#FFFFFF" />
                {activeTooltip === i && (
                  <g>
                    <rect
                      x={pos.x - 70}
                      y={pos.y - 42}
                      width="140"
                      height="32"
                      rx="4"
                      fill="#18191B"
                      stroke="rgba(255, 255, 255, 0.2)"
                      strokeWidth="1"
                    />
                    <text
                      x={pos.x}
                      y={pos.y - 28}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontFamily="var(--font-mono, monospace)"
                      fontSize="9"
                      fontWeight="700"
                    >
                      {inc.type}
                    </text>
                    <text
                      x={pos.x}
                      y={pos.y - 16}
                      textAnchor="middle"
                      fill="#9FA4B0"
                      fontFamily="var(--font-mono, monospace)"
                      fontSize="8"
                    >
                      {inc.time} • {inc.metric || inc.severity}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Legend Overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            backgroundColor: 'rgba(20, 21, 24, 0.85)',
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '4px',
            padding: '0.4rem 0.65rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
            fontSize: '0.66rem',
            color: '#9FA4B0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            <span>START</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FE5B2A' }} />
            <span>ROUTE</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
            <span>INCIDENT</span>
          </div>
        </div>
      </div>
    </div>
  );
}