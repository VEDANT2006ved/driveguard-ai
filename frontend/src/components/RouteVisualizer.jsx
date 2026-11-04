import React, { useState, useMemo } from 'react';
import { Compass, ZoomIn, ZoomOut, RotateCcw, AlertTriangle, Navigation, MapPin } from 'lucide-react';

/**
 * RouteVisualizer Component — High-Fashion Minimalist Editorial & Techwear Edition
 * Responsive SVG Route Plot based exclusively on recorded GPS coordinates.
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

  // Start & Current endpoint positions
  const startPoint = waypoints.length > 0 ? project(waypoints[0].lat, waypoints[0].lng) : null;
  const currentPoint =
    waypoints.length > 1
      ? project(waypoints[waypoints.length - 1].lat, waypoints[waypoints.length - 1].lng)
      : null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        position: 'relative',
      }}
    >
      {/* Route Plot Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          fontSize: '0.74rem',
          fontFamily: "var(--font-mono, monospace)",
          color: 'var(--text-secondary)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span>
            WAYPOINTS: <strong style={{ color: 'var(--text-primary)' }}>{waypoints.length}</strong>
          </span>
          <span>•</span>
          <span>
            HAUL: <strong style={{ color: 'var(--text-primary)' }}>{totalDistanceKm.toFixed(2)} km</strong>
          </span>

          {isSimulated && (
            <span className="techwear-tag" style={{ color: 'var(--accent-amber)', borderColor: 'var(--accent-amber)' }}>
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
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-light)',
              borderRadius: '2px',
              padding: '0.3rem 0.5rem',
              cursor: 'pointer',
              color: 'var(--text-primary)',
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
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-light)',
              borderRadius: '2px',
              padding: '0.3rem 0.5rem',
              cursor: 'pointer',
              color: 'var(--text-primary)',
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
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-light)',
              borderRadius: '2px',
              padding: '0.3rem 0.5rem',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
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
          backgroundColor: '#111111',
          border: '1px solid var(--border-light)',
          borderRadius: '4px',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        }}
      >
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '400px',
            display: 'block',
            backgroundColor: '#111111',
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center center',
            transition: 'transform 0.2s ease',
          }}
        >
          {/* Subtle Grid Background Pattern */}
          <defs>
            <pattern id="editorialGpsGrid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="0.8" />
            </pattern>
            <linearGradient id="editorialRouteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#F7F7F5" stopOpacity="1" />
            </linearGradient>
          </defs>

          <rect width="100%" height="100%" fill="url(#editorialGpsGrid)" />

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
              <circle cx={SVG_WIDTH / 2} cy={SVG_HEIGHT / 2} r="4" fill="#F7F7F5" />
              <text
                x={SVG_WIDTH / 2}
                y={SVG_HEIGHT / 2 + 35}
                textAnchor="middle"
                fontFamily="var(--font-mono, monospace)"
                fontSize="11"
                fill="#888888"
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
                stroke="#F7F7F5"
                strokeWidth="1.5"
                opacity="0.4"
                className="animate-pulse-live"
              />
              <circle cx={startPoint.x} cy={startPoint.y} r="8" fill="#F7F7F5" />
              <text
                x={startPoint.x}
                y={startPoint.y - 14}
                textAnchor="middle"
                fontFamily="var(--font-mono, monospace)"
                fontSize="10"
                fontWeight="700"
                fill="#F7F7F5"
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
                stroke="#F7F7F5"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.2"
              />
              {/* Core Route Path */}
              <polyline
                points={pointsString}
                fill="none"
                stroke="url(#editorialRouteGrad)"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          )}

          {/* Start Point Pin */}
          {startPoint && waypoints.length >= 2 && (
            <g>
              <circle cx={startPoint.x} cy={startPoint.y} r="6" fill="var(--accent-emerald)" stroke="#FFFFFF" strokeWidth="1.5" />
              <text
                x={startPoint.x}
                y={startPoint.y - 10}
                textAnchor="middle"
                fontFamily="var(--font-mono, monospace)"
                fontSize="9"
                fontWeight="700"
                fill="var(--accent-emerald)"
              >
                ORIGIN
              </text>
            </g>
          )}

          {/* Live Current Point Pin */}
          {currentPoint && (
            <g>
              <circle cx={currentPoint.x} cy={currentPoint.y} r="14" fill="none" stroke="#F7F7F5" strokeWidth="1.5" opacity="0.6" className="animate-pulse-live" />
              <circle cx={currentPoint.x} cy={currentPoint.y} r="6" fill="#F7F7F5" stroke="#111111" strokeWidth="1.5" />
              <text
                x={currentPoint.x}
                y={currentPoint.y - 14}
                textAnchor="middle"
                fontFamily="var(--font-mono, monospace)"
                fontSize="10"
                fontWeight="700"
                fill="#F7F7F5"
              >
                VEHICLE
              </text>
            </g>
          )}

          {/* Location-Tagged Safety Incidents */}
          {incidents.map((inc, i) => {
            if (inc.lat === null || inc.lng === null) return null;
            const pos = project(inc.lat, inc.lng);
            const isCrit = inc.severity === 'CRITICAL';
            return (
              <g
                key={inc.id || i}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setActiveTooltip(inc)}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="7"
                  fill={isCrit ? 'var(--accent-crimson)' : 'var(--accent-amber)'}
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
              </g>
            );
          })}
        </svg>

        {/* Compass Rose (Top Right) */}
        <div
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'rgba(17, 17, 17, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '0.25rem 0.45rem',
            borderRadius: '2px',
            fontFamily: "var(--font-mono, monospace)",
            fontSize: '0.62rem',
            color: '#F7F7F5',
            pointerEvents: 'none',
          }}
        >
          <Compass size={14} style={{ color: '#F7F7F5' }} />
          <span style={{ fontWeight: 700, marginTop: '2px' }}>N</span>
        </div>
      </div>
    </div>
  );
}
