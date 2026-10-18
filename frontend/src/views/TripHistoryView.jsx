import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertTriangle, CheckCircle, ChevronRight, RefreshCw, FileText, Shield } from 'lucide-react';

const RECORDED_SESSIONS = [
  {
    id: 'TRIP-2026-041',
    date: 'OCT 14, 2026',
    time: '20:15 - 21:40',
    duration: '1h 25m',
    distance: '84.2 km',
    safetyScore: 94,
    grade: 'A',
    status: 'OPTIMAL',
    incidents: [
      { time: '20:48', type: 'Micro-yawn', severity: 'LOW', metric: 'MAR 0.58' },
    ],
  },
  {
    id: 'TRIP-2026-040',
    date: 'OCT 13, 2026',
    time: '23:10 - 00:25',
    duration: '1h 15m',
    distance: '68.0 km',
    safetyScore: 78,
    grade: 'B-',
    status: 'CAUTION',
    incidents: [
      { time: '23:42', type: 'Prolonged Eye Closure (1.4s)', severity: 'MEDIUM', metric: 'EAR 0.18' },
      { time: '00:05', type: 'Head Yaw Deviation (>30°)', severity: 'LOW', metric: 'Yaw 34°' },
    ],
  },
  {
    id: 'TRIP-2026-039',
    date: 'OCT 12, 2026',
    time: '08:30 - 09:12',
    duration: '42m',
    distance: '31.5 km',
    safetyScore: 98,
    grade: 'A+',
    status: 'OPTIMAL',
    incidents: [],
  },
];

export default function TripHistoryView() {
  const [trips, setTrips] = useState(RECORDED_SESSIONS);
  const [selectedTrip, setSelectedTrip] = useState(RECORDED_SESSIONS[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchTrips = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('http://localhost:8000/api/trips');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setTrips(data);
          setSelectedTrip((prev) => {
            if (!prev) return data[0];
            const match = data.find((t) => t.id === prev.id);
            return match || data[0];
          });
        }
      }
    } catch (err) {
      console.warn('Could not fetch trip history from API:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const getGradeTheme = (grade = '') => {
    const g = String(grade).toUpperCase();
    if (g.startsWith('A')) {
      return {
        color: '#10B981',
        bg: 'rgba(16, 185, 129, 0.08)',
        border: 'rgba(16, 185, 129, 0.25)',
      };
    }
    if (g.startsWith('B')) {
      return {
        color: 'var(--text-primary)',
        bg: 'var(--bg-ivory-subtle)',
        border: 'var(--border-subtle)',
      };
    }
    if (g.startsWith('C')) {
      return {
        color: '#D97706',
        bg: 'rgba(217, 119, 6, 0.08)',
        border: 'rgba(217, 119, 6, 0.25)',
      };
    }
    return {
      color: 'var(--color-accent-red)',
      bg: 'rgba(232, 75, 50, 0.08)',
      border: 'var(--color-alert-border)',
    };
  };

  const activeTrip = selectedTrip || trips[0] || RECORDED_SESSIONS[0];
  const activeGradeTheme = getGradeTheme(activeTrip?.grade);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '2rem',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: '0.5rem',
            }}
          >
            <FileText size={12} color="var(--color-accent-red)" />
            <span>SYS.04 // AUDIT LEDGER & CERTIFICATION</span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-condensed)',
              fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              lineHeight: 1,
              color: 'var(--text-primary)',
              margin: '0.2rem 0 0.65rem 0',
            }}
          >
            SESSION AUDIT VAULT
          </h1>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.92rem',
              maxWidth: '680px',
              lineHeight: 1.55,
              margin: 0,
            }}
          >
            Chronological session ledgers. Palpebral aperture excursions, yawning durations,
            and posture shifts are logged with microsecond precision for compliance and fleet safety.
          </p>
        </div>

        <button
          onClick={fetchTrips}
          disabled={isRefreshing}
          title="Refresh session vault"
          className="vantage-btn-outline"
          style={{
            cursor: isRefreshing ? 'wait' : 'pointer',
          }}
        >
          <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
          <span>{isRefreshing ? 'Syncing...' : 'Sync Ledger'}</span>
        </button>
      </div>

      {/* Grid: Ledger + Inspector */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2rem',
          alignItems: 'start',
        }}
      >
        {/* Left: Ledger List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.25rem' }}>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
              RECORDED SESSIONS ({trips.length})
            </span>
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              SELECT TO INSPECT
            </span>
          </div>

          {trips.map((trip) => {
            const isSelected = activeTrip?.id === trip.id;
            const theme = getGradeTheme(trip.grade);

            return (
              <div
                key={trip.id}
                onClick={() => setSelectedTrip(trip)}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: isSelected ? '1.5px solid var(--text-primary)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-card)',
                  padding: '1.25rem 1.5rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'var(--text-secondary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  }
                }}
              >
                {/* Active selection indicator line */}
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '3px',
                      backgroundColor: 'var(--color-accent-red)',
                      borderTopLeftRadius: 'var(--radius-card)',
                      borderBottomLeftRadius: 'var(--radius-card)',
                    }}
                  />
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span className="font-mono" style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {trip.id}
                    </span>
                    <span style={{ color: 'var(--border-subtle)' }}>•</span>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {trip.date}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                    <span>{trip.time}</span>
                    <span>•</span>
                    <span>{trip.duration}</span>
                    <span>•</span>
                    <span>{trip.distance && trip.distance !== '--' ? trip.distance : 'Optical (N/A)'}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '0.2rem 0.65rem',
                        borderRadius: 'var(--radius-btn)',
                        backgroundColor: theme.bg,
                        color: theme.color,
                        border: `1px solid ${theme.border}`,
                        fontSize: '0.78rem',
                        fontFamily: 'var(--font-condensed)',
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {trip.grade} ({trip.safetyScore}%)
                    </div>
                  </div>
                  <ChevronRight size={16} color={isSelected ? 'var(--text-primary)' : 'var(--text-muted)'} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Trip Inspector */}
        {activeTrip && (
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-card-lg)',
              padding: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.75rem',
              boxShadow: 'var(--shadow-md)',
              position: 'sticky',
              top: '90px',
            }}
          >
            {/* Certificate Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                  }}
                >
                  AUDIT CERTIFICATE
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-condensed)',
                    fontSize: '2.2rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    color: 'var(--text-primary)',
                    margin: '0.2rem 0 0 0',
                  }}
                >
                  {activeTrip.id}
                </h3>
                <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                  Verified session recorded on {activeTrip.date} ({activeTrip.time})
                </span>
              </div>

              {/* Architectural Grade Badge */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '74px',
                  height: '74px',
                  borderRadius: 'var(--radius-card)',
                  backgroundColor: activeGradeTheme.bg,
                  border: `1px solid ${activeGradeTheme.border}`,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-condensed)',
                    fontSize: '2.6rem',
                    fontWeight: 600,
                    lineHeight: 1,
                    color: activeGradeTheme.color,
                  }}
                >
                  {activeTrip.grade}
                </span>
                <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: activeGradeTheme.color }}>
                  {activeTrip.safetyScore}%
                </span>
              </div>
            </div>

            {/* Three Summary Metric Pills */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.85rem',
                backgroundColor: 'var(--bg-ivory-subtle)',
                borderRadius: 'var(--radius-card)',
                padding: '1.1rem 1.25rem',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div>
                <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block' }}>
                  Duration
                </span>
                <span style={{ fontFamily: 'var(--font-condensed)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {activeTrip.duration}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block' }}>
                  Distance
                </span>
                <span style={{ fontFamily: 'var(--font-condensed)', fontSize: '1.25rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                  {activeTrip.distance && activeTrip.distance !== '--' ? activeTrip.distance : 'Optical (N/A)'}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block' }}>
                  Incidents
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-condensed)',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: activeTrip.incidents && activeTrip.incidents.length > 0 ? 'var(--color-accent-red)' : 'var(--color-safe)',
                  }}
                >
                  {activeTrip.incidents ? activeTrip.incidents.length : 0} FLAGGED
                </span>
              </div>
            </div>

            {/* Incident Timestamp Audit Log */}
            <div>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '0.85rem',
                }}
              >
                INCIDENT TIMESTAMP LOG
              </span>

              {activeTrip.incidents && activeTrip.incidents.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {activeTrip.incidents.map((inc, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-card)',
                        backgroundColor: 'var(--bg-canvas)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: 'var(--radius-btn)',
                            backgroundColor: 'rgba(232, 75, 50, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <AlertTriangle size={13} color="var(--color-accent-red)" />
                        </div>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                          {inc.type}
                        </span>
                      </div>
                      <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {inc.time} • <strong style={{ color: 'var(--text-primary)' }}>{inc.metric}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    padding: '1.1rem 1.3rem',
                    borderRadius: 'var(--radius-card)',
                    backgroundColor: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: 'var(--radius-btn)',
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CheckCircle size={15} color="var(--color-safe)" />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-condensed)', fontSize: '0.95rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--color-safe)' }}>
                      Optimal Compliance Maintained
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      Zero drowsiness, yawn excursions, or head deviations detected.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Regulatory Footer Note */}
            <div
              style={{
                fontSize: '0.76rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '1rem',
              }}
            >
              Session data is written directly to SQLite upon stop event. Optical telemetric metrics are evaluated via MediaPipe 468-point mesh inference.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
