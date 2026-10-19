import React, { useState, useEffect } from 'react';
import {
  Navigation,
  Play,
  Square,
  AlertTriangle,
  Compass,
  MapPin,
  Clock,
  Shield,
  Activity,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { gpsTracker, GPS_STATUS } from '../services/gpsTracker';
import RouteVisualizer from './RouteVisualizer';

/**
 * GpsTripPanel Component
 * Functional GPS trip tracking interface using the browser's Geolocation API.
 * Displays live tracking controls, real-time Haversine distance, trip duration,
 * GPS accuracy status, location-tagged safety incidents, and interactive route plot.
 */
export default function GpsTripPanel() {
  const [gpsState, setGpsState] = useState(gpsTracker.getSnapshot());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showIncidentList, setShowIncidentList] = useState(true);

  // Subscribe to GPS tracker updates
  useEffect(() => {
    const unsubscribe = gpsTracker.subscribe((state) => {
      setGpsState(state);
    });
    return () => unsubscribe();
  }, []);

  // Duration timer
  useEffect(() => {
    let timer = null;
    if (gpsState.isTracking && gpsState.startTime) {
      timer = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - gpsState.startTime) / 1000));
      }, 1000);
    } else if (gpsState.status === GPS_STATUS.STOPPED && gpsState.startTime && gpsState.endTime) {
      setElapsedSeconds(Math.floor((gpsState.endTime - gpsState.startTime) / 1000));
    } else {
      setElapsedSeconds(0);
    }
    return () => clearInterval(timer);
  }, [gpsState.isTracking, gpsState.startTime, gpsState.endTime, gpsState.status]);

  const formatDuration = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    const h = Math.floor(m / 60);
    if (h > 0) return `${h}h ${m % 60}m ${s}s`;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  const getStatusBadge = () => {
    switch (gpsState.status) {
      case GPS_STATUS.TRACKING:
        return {
          label: 'TRACKING ACTIVE',
          color: '#2E7D32',
          bg: '#ECFDF5',
          border: '#A7F3D0',
          dot: true,
        };
      case GPS_STATUS.WAITING_FOR_GPS:
        return {
          label: 'WAITING FOR GPS FIX',
          color: '#D97706',
          bg: '#FFFBEB',
          border: '#FDE68A',
          pulse: true,
        };
      case GPS_STATUS.PERMISSION_DENIED:
        return {
          label: 'PERMISSION DENIED',
          color: '#DC2626',
          bg: '#FEF2F2',
          border: '#FECACA',
        };
      case GPS_STATUS.GPS_UNAVAILABLE:
        return {
          label: 'GPS UNAVAILABLE',
          color: '#DC2626',
          bg: '#FEF2F2',
          border: '#FECACA',
        };
      case GPS_STATUS.STOPPED:
        return {
          label: 'TRIP STOPPED',
          color: '#77756F',
          bg: '#FAF9F6',
          border: '#E6E2DA',
        };
      default:
        return {
          label: 'NOT STARTED',
          color: '#77756F',
          bg: '#FAF9F6',
          border: '#E6E2DA',
        };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E6E2DA',
        borderRadius: '6px',
        padding: 'clamp(1.25rem, 2.5vw, 1.75rem)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
      }}
    >
      {/* Panel Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderBottom: '1px solid #E6E2DA',
          paddingBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
              fontSize: '0.68rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#77756F',
              marginBottom: '0.35rem',
              fontWeight: 600,
            }}
          >
            <Navigation size={13} style={{ color: '#D66A45' }} />
            <span>OPTICAL &amp; GPS CO-TELEMETRY // TRIP ROUTE TRACKER</span>
          </div>

          <h3
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: '1.55rem',
              fontWeight: 400,
              color: '#171717',
              margin: '0 0 0.25rem 0',
              lineHeight: 1.2,
            }}
          >
            GPS Route &amp; Travelled Distance
          </h3>

          <p style={{ margin: 0, fontSize: '0.84rem', color: '#77756F' }}>
            {gpsState.statusMessage}
          </p>
        </div>

        {/* Action Controls & Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Status Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.3rem 0.75rem',
              borderRadius: '9999px',
              backgroundColor: statusBadge.bg,
              border: `1px solid ${statusBadge.border}`,
              color: statusBadge.color,
              fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
              fontSize: '0.7rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
            }}
          >
            {statusBadge.dot && (
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: statusBadge.color,
                }}
                className="telemetry-pulse"
              />
            )}
            <span>{statusBadge.label}</span>
          </div>

          {/* Start / Stop GPS Button */}
          {!gpsState.isTracking ? (
            <button
              onClick={() => gpsTracker.startTracking()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: '#171717',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '4px',
                padding: '0.48rem 1.15rem',
                fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                fontSize: '0.74rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Play size={12} fill="#FFFFFF" />
              <span>START GPS TRIP</span>
            </button>
          ) : (
            <button
              onClick={() => gpsTracker.stopTracking()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '4px',
                padding: '0.48rem 1.15rem',
                fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                fontSize: '0.74rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Square size={12} fill="#FFFFFF" />
              <span>STOP GPS TRIP</span>
            </button>
          )}

          {/* Dev Lab Simulation Button */}
          <button
            onClick={() => gpsTracker.startDevLabSimulation()}
            title="Run simulated GPS test drive (for development testing)"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: 'transparent',
              border: '1px dashed #D66A45',
              borderRadius: '4px',
              padding: '0.48rem 0.85rem',
              fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
              fontSize: '0.7rem',
              color: '#D66A45',
              cursor: 'pointer',
            }}
          >
            <Activity size={12} />
            <span>DEV LAB SIM</span>
          </button>
        </div>
      </div>

      {/* Permission Denied Guidance Banner */}
      {gpsState.status === GPS_STATUS.PERMISSION_DENIED && (
        <div
          style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '4px',
            padding: '0.85rem 1.15rem',
            fontSize: '0.82rem',
            color: '#B91C1C',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
          }}
        >
          <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Geolocation Access Blocked</strong>: To enable real-time GPS tracking and Haversine
            distance calculation, click the site settings / tune icon in your browser address bar and
            change Location permission to <strong>Allow</strong>.
          </div>
        </div>
      )}

      {/* Live Metric Strip (4 Columns) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '1rem',
          borderBottom: '1px solid #E6E2DA',
          paddingBottom: '1.25rem',
        }}
      >
        {/* Cumulative Distance */}
        <div>
          <span
            style={{
              fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
              fontSize: '0.66rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#77756F',
              display: 'block',
              marginBottom: '0.2rem',
            }}
          >
            HAUL DISTANCE
          </span>
          <span
            style={{
              fontFamily: "var(--font-sans, 'Plus Jakarta Sans', sans-serif)",
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#D66A45',
              lineHeight: 1,
            }}
          >
            {gpsState.totalDistanceKm.toFixed(2)}{' '}
            <span style={{ fontSize: '0.82rem', color: '#77756F', fontWeight: 400 }}>km</span>
          </span>
        </div>

        {/* Trip Duration */}
        <div>
          <span
            style={{
              fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
              fontSize: '0.66rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#77756F',
              display: 'block',
              marginBottom: '0.2rem',
            }}
          >
            ELAPSED DURATION
          </span>
          <span
            style={{
              fontFamily: "var(--font-sans, 'Plus Jakarta Sans', sans-serif)",
              fontSize: '1.5rem',
              fontWeight: 500,
              color: '#171717',
              lineHeight: 1,
            }}
          >
            {formatDuration(elapsedSeconds)}
          </span>
        </div>

        {/* Accuracy */}
        <div>
          <span
            style={{
              fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
              fontSize: '0.66rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#77756F',
              display: 'block',
              marginBottom: '0.2rem',
            }}
          >
            GPS PRECISION
          </span>
          <span
            style={{
              fontFamily: "var(--font-sans, 'Plus Jakarta Sans', sans-serif)",
              fontSize: '1.5rem',
              fontWeight: 500,
              color: '#171717',
              lineHeight: 1,
            }}
          >
            {gpsState.lastValidPoint?.accuracy ? `±${gpsState.lastValidPoint.accuracy}m` : '--'}
          </span>
        </div>

        {/* Tagged Events */}
        <div>
          <span
            style={{
              fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
              fontSize: '0.66rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#77756F',
              display: 'block',
              marginBottom: '0.2rem',
            }}
          >
            LOCATION-TAGGED EVENTS
          </span>
          <span
            style={{
              fontFamily: "var(--font-sans, 'Plus Jakarta Sans', sans-serif)",
              fontSize: '1.5rem',
              fontWeight: 500,
              color: gpsState.taggedIncidents.length > 0 ? '#DC2626' : '#2E7D32',
              lineHeight: 1,
            }}
          >
            {gpsState.taggedIncidents.length}{' '}
            <span style={{ fontSize: '0.82rem', color: '#77756F', fontWeight: 400 }}>flagged</span>
          </span>
        </div>
      </div>

      {/* Interactive SVG Route Visualizer */}
      <RouteVisualizer
        waypoints={gpsState.waypoints}
        incidents={gpsState.taggedIncidents}
        isLive={gpsState.isTracking}
        isSimulated={gpsState.isSimulated}
        totalDistanceKm={gpsState.totalDistanceKm}
      />

      {/* Location-Tagged Safety Incidents List (Collapsible) */}
      <div style={{ borderTop: '1px solid #E6E2DA', paddingTop: '1rem' }}>
        <button
          onClick={() => setShowIncidentList((prev) => !prev)}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            background: 'none',
            border: 'none',
            padding: '0.25rem 0',
            cursor: 'pointer',
            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
            fontSize: '0.74rem',
            fontWeight: 600,
            color: '#171717',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={13} style={{ color: '#D66A45' }} />
            <span>
              LOCATION-TAGGED SAFETY EVENTS ({gpsState.taggedIncidents.length})
            </span>
          </div>
          {showIncidentList ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showIncidentList && (
          <div style={{ marginTop: '0.75rem' }}>
            {gpsState.taggedIncidents.length === 0 ? (
              <div style={{ fontSize: '0.82rem', color: '#77756F', padding: '0.5rem 0' }}>
                No safety events recorded during this GPS tracking interval.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {gpsState.taggedIncidents.map((evt) => (
                  <div
                    key={evt.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.65rem 0.85rem',
                      backgroundColor: '#FAF9F6',
                      border: '1px solid #E6E2DA',
                      borderRadius: '4px',
                      fontSize: '0.78rem',
                      fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: evt.severity === 'CRITICAL' ? '#DC2626' : '#D97706',
                        }}
                      />
                      <strong style={{ color: '#171717' }}>{evt.type}</strong>
                      <span style={{ color: '#77756F' }}>({evt.severity})</span>
                    </div>

                    <div style={{ color: '#77756F' }}>
                      {evt.metric && <span style={{ marginRight: '0.75rem' }}>{evt.metric}</span>}
                      {evt.hasCoordinates ? (
                        <span style={{ color: '#D66A45', fontWeight: 600 }}>
                          GPS: {evt.lat?.toFixed(5)}°, {evt.lng?.toFixed(5)}°
                        </span>
                      ) : (
                        <span style={{ color: '#B3AFA8' }}>No GPS Fix</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
