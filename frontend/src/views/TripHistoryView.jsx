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
        color: '#059669',
        bg: '#DCFCE7',
        border: 'rgba(16, 185, 129, 0.25)',
      };
    }
    if (g.startsWith('B')) {
      return {
        color: 'var(--color-accent-purple-dark)',
        bg: 'var(--bg-card-lavender)',
        border: 'rgba(124, 58, 237, 0.2)',
      };
    }
    if (g.startsWith('C')) {
      return {
        color: '#D97706',
        bg: '#FEF3C7',
        border: 'rgba(217, 119, 6, 0.25)',
      };
    }
    return {
      color: 'var(--color-alert)',
      bg: 'var(--color-alert-dim)',
      border: 'rgba(225, 29, 72, 0.25)',
    };
  };

  const activeTrip = selectedTrip || trips[0] || RECORDED_SESSIONS[0];
  const activeGradeTheme = getGradeTheme(activeTrip?.grade);

  return (
    <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--color-accent-purple-light)',
              color: 'var(--color-accent-purple-dark)',
              border: '1px solid rgba(124, 58, 237, 0.15)',
              borderRadius: '9999px',
              padding: '0.3rem 0.85rem',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              letterSpacing: '0.04em',
              marginBottom: '0.75rem',
            }}
          >
            <FileText size={12} />
            <span>04 // AUDIT LEDGER & CERTIFICATION</span>
          </div>

          <h1
            className="font-serif"
            style={{
              fontSize: 'clamp(2.2rem, 4.2vw, 3.4rem)',
              fontWeight: 400,
              lineHeight: 1.12,
              letterSpacing: '-0.025em',
              color: 'var(--text-primary)',
              margin: '0.1rem 0 0.5rem 0',
            }}
          >
            Session <em>audit</em> vault.
          </h1>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.98rem',
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
          className="btn-magnetic-pill"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '9999px',
            padding: '0.55rem 1.25rem',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            cursor: isRefreshing ? 'wait' : 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: 'var(--shadow-sm)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>
              RECORDED SESSIONS ({trips.length})
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
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
                  border: isSelected ? '1.5px solid var(--color-accent-purple)' : '1px solid var(--border-subtle)',
                  borderRadius: '22px',
                  padding: '1.35rem 1.6rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: isSelected ? '0 8px 24px rgba(124, 58, 237, 0.12)' : 'var(--shadow-sm)',
                  transform: isSelected ? 'translateY(-1px)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.35)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.transform = 'none';
                  }
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span className="font-mono" style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {trip.id}
                    </span>
                    <span style={{ color: 'var(--border-strong)' }}>•</span>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                      {trip.date}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    <span>{trip.time}</span>
                    <span>•</span>
                    <span>{trip.duration}</span>
                    <span>•</span>
                    <span>{trip.distance && trip.distance !== '--' ? trip.distance : 'Optical (N/A)'}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '0.2rem 0.65rem',
                        borderRadius: '9999px',
                        backgroundColor: theme.bg,
                        color: theme.color,
                        border: `1px solid ${theme.border}`,
                        fontSize: '0.78rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                      }}
                    >
                      {trip.grade} ({trip.safetyScore}%)
                    </div>
                  </div>
                  <ChevronRight size={18} color={isSelected ? 'var(--color-accent-purple)' : 'var(--text-muted)'} />
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
              borderRadius: '28px',
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
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                  }}
                >
                  Audit Certificate
                </span>
                <h3
                  className="font-serif"
                  style={{
                    fontSize: '1.8rem',
                    fontWeight: 400,
                    color: 'var(--text-primary)',
                    margin: '0.2rem 0 0 0',
                  }}
                >
                  {activeTrip.id}
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Verified session recorded on {activeTrip.date} ({activeTrip.time})
                </span>
              </div>

              {/* Huge Serif Grade Badge */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '74px',
                  height: '74px',
                  borderRadius: '22px',
                  backgroundColor: activeGradeTheme.bg,
                  border: `1px solid ${activeGradeTheme.border}`,
                }}
              >
                <span
                  className="font-serif"
                  style={{
                    fontSize: '2.4rem',
                    fontWeight: 400,
                    lineHeight: 1,
                    color: activeGradeTheme.color,
                  }}
                >
                  {activeTrip.grade}
                </span>
                <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: activeGradeTheme.color }}>
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
                backgroundColor: 'var(--bg-canvas-subtle)',
                borderRadius: '18px',
                padding: '1.1rem 1.25rem',
                border: '1px solid rgba(22, 27, 24, 0.05)',
              }}
            >
              <div>
                <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block' }}>
                  Duration
                </span>
                <span style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {activeTrip.duration}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block' }}>
                  Distance
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                  {activeTrip.distance && activeTrip.distance !== '--' ? activeTrip.distance : 'Optical (N/A)'}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block' }}>
                  Incidents
                </span>
                <span
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: activeTrip.incidents && activeTrip.incidents.length > 0 ? 'var(--color-alert)' : '#059669',
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
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '0.85rem',
                }}
              >
                Incident Timestamp Log
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
                        borderRadius: '16px',
                        backgroundColor: 'var(--bg-canvas-subtle)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-alert-dim)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <AlertTriangle size={14} color="var(--color-alert)" />
                        </div>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                          {inc.type}
                        </span>
                      </div>
                      <div className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
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
                    padding: '1.25rem 1.4rem',
                    borderRadius: '18px',
                    backgroundColor: 'var(--bg-card-mint)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#DCFCE7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CheckCircle size={16} color="#059669" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#064E3B' }}>
                      Optimal Compliance Maintained
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#047857' }}>
                      Zero drowsiness, yawn excursions, or head deviations detected.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Regulatory Footer Note */}
            <div
              style={{
                fontSize: '0.78rem',
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
