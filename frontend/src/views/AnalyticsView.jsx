import React, { useState, useEffect } from 'react';
import { BarChart3, AlertTriangle, RefreshCw, Award, Activity, TrendingUp, ShieldCheck, Sparkles } from 'lucide-react';

/**
 * Parses duration strings like "1h 25m", "12m 50s", "42m", or "18s" into total seconds.
 */
function parseDurationToSeconds(durationStr) {
  if (!durationStr || typeof durationStr !== 'string') return 0;
  let total = 0;
  const hMatch = durationStr.match(/(\d+)\s*h/i);
  const mMatch = durationStr.match(/(\d+)\s*m/i);
  const sMatch = durationStr.match(/(\d+)\s*s/i);
  if (hMatch) total += parseInt(hMatch[1], 10) * 3600;
  if (mMatch) total += parseInt(mMatch[1], 10) * 60;
  if (sMatch) total += parseInt(sMatch[1], 10);
  return total;
}

/**
 * Formats total seconds into human-readable duration matching DriveGuard editorial standard.
 */
function formatSecondsToDuration(totalSecs) {
  if (!totalSecs || isNaN(totalSecs) || totalSecs <= 0) return '0s';
  const hrs = Math.floor(totalSecs / 3600);
  const remSec = totalSecs % 3600;
  const mins = Math.floor(remSec / 60);
  const secs = remSec % 60;
  if (hrs > 0) {
    return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
  }
  if (mins > 0) {
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  }
  return `${secs}s`;
}

/**
 * Accurately categorizes recorded incident types based on backend telemetry reason taxonomy.
 */
function categorizeIncident(incidentType = '') {
  const t = String(incidentType).toLowerCase();
  if (t.includes('eye closure') || t.includes('palpebral')) return 'eye_closure';
  if (t.includes('yawn')) return 'yawn';
  if (t.includes('head-down') || t.includes('head down') || t.includes('pitch -')) return 'head_down';
  if (t.includes('turned aside') || t.includes('yaw') || t.includes('lateral')) return 'lateral';
  if (t.includes('upward') || t.includes('head-up') || t.includes('head up')) return 'head_up';
  return 'other';
}

export default function AnalyticsView({ telemetryHistory = [], isEngineConnected = false }) {
  const [activeMode, setActiveMode] = useState('live'); // 'live' | 'historical'
  const [trips, setTrips] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [selectedTripIndex, setSelectedTripIndex] = useState(null);

  // Fetch verified historical trips directly from SQLite REST API
  const fetchHistoricalTrips = async () => {
    setIsLoadingHistory(true);
    setHistoryError(null);
    try {
      const res = await fetch('http://localhost:8000/api/trips');
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setTrips(data);
      } else {
        throw new Error('Invalid trip records format from backend');
      }
    } catch (err) {
      console.warn('Could not fetch historical trips:', err);
      setHistoryError(err.message || 'Audit vault unavailable');
      setTrips([]); // Strictly no fabricated or demo fallbacks
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistoricalTrips();
  }, []);

  // ---------------------------------------------------------------------------
  // LIVE TELEMETRY CALCULATIONS
  // ---------------------------------------------------------------------------
  const hasLiveData = Array.isArray(telemetryHistory) && telemetryHistory.length > 0;
  const averageRisk = hasLiveData
    ? Math.round(
        telemetryHistory.reduce((acc, curr) => acc + (typeof curr.riskScore === 'number' ? curr.riskScore : 0), 0) /
          Math.max(1, telemetryHistory.length)
      )
    : 0;

  const maxRisk = hasLiveData
    ? Math.max(0, ...telemetryHistory.map((t) => (typeof t.riskScore === 'number' ? t.riskScore : 0)))
    : 0;

  const latestTelemetry = hasLiveData ? telemetryHistory[telemetryHistory.length - 1] : null;

  // ---------------------------------------------------------------------------
  // HISTORICAL AUDIT VAULT CALCULATIONS
  // ---------------------------------------------------------------------------
  const hasHistoryData = Array.isArray(trips) && trips.length > 0;

  const validTrips = trips.filter((t) => t && typeof t.safetyScore === 'number');
  const averageHistoricalSafetyScore =
    validTrips.length > 0
      ? Math.round(validTrips.reduce((acc, t) => acc + t.safetyScore, 0) / validTrips.length)
      : 0;

  const cumulativeDurationSecs = trips.reduce(
    (acc, t) => acc + parseDurationToSeconds(t.duration),
    0
  );

  const allIncidents = trips.flatMap((t) => (Array.isArray(t.incidents) ? t.incidents : []));
  const totalIncidentsCount = allIncidents.length;

  // Tally incident categories
  const incidentCategories = {
    lateral: { label: 'Lateral Head Deviation', count: 0, color: '#6366F1' },
    eye_closure: { label: 'Prolonged Eye Closure', count: 0, color: 'var(--color-alert)' },
    head_down: { label: 'Head-Down Distraction', count: 0, color: '#D97706' },
    yawn: { label: 'Sustained Yawning', count: 0, color: '#8B5CF6' },
    head_up: { label: 'Head-Up Vertical Shift', count: 0, color: '#64748B' },
    other: { label: 'Other Detected Anomalies', count: 0, color: '#94A3B8' },
  };

  allIncidents.forEach((inc) => {
    const cat = categorizeIncident(inc?.type);
    if (incidentCategories[cat]) {
      incidentCategories[cat].count += 1;
    } else {
      incidentCategories.other.count += 1;
    }
  });

  // Tally grade distribution
  const gradeDistribution = {
    A: { label: 'Grade A / A+ (Optimal)', count: 0, color: '#059669' },
    B: { label: 'Grade B / B+ / B- (Caution)', count: 0, color: '#4B5563' },
    C: { label: 'Grade C (Elevated Risk)', count: 0, color: '#D97706' },
    F: { label: 'Grade F (Critical)', count: 0, color: 'var(--color-alert)' },
  };

  trips.forEach((t) => {
    const g = String(t.grade || '').toUpperCase();
    if (g.startsWith('A')) gradeDistribution.A.count += 1;
    else if (g.startsWith('B')) gradeDistribution.B.count += 1;
    else if (g.startsWith('C')) gradeDistribution.C.count += 1;
    else gradeDistribution.F.count += 1;
  });

  // Chronological order for historical trend chart (oldest to newest, left-to-right)
  const chronologicalTrips = [...trips].reverse();

  return (
    <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* View Header with Mode Selector Toggle */}
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
            <Activity size={12} />
            <span>03 // TELEMETRY & AUDIT VAULT</span>
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
            {activeMode === 'live' ? (
              <>
                Continuous <em>biometric</em> stream.
              </>
            ) : (
              <>
                Fleet <em>compliance</em> audit vault.
              </>
            )}
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
            {activeMode === 'live'
              ? 'Real-time temporal risk distribution, palpebral tracking, and cranial kinematics streaming from edge inference.'
              : 'Cumulative audit analytics compiled from verified driving sessions persistently stored in SQLite.'}
          </p>
        </div>

        {/* Wispr Flow Signature Segmented Capsule Toggle */}
        <div
          style={{
            display: 'inline-flex',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '9999px',
            padding: '4px',
            gap: '4px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <button
            onClick={() => setActiveMode('live')}
            style={{
              padding: '0.55rem 1.35rem',
              borderRadius: '9999px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.8rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeMode === 'live' ? 'var(--text-primary)' : 'transparent',
              color: activeMode === 'live' ? '#FFFFFF' : 'var(--text-secondary)',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            Live Waveform
          </button>

          <button
            onClick={() => setActiveMode('historical')}
            style={{
              padding: '0.55rem 1.35rem',
              borderRadius: '9999px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.8rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeMode === 'historical' ? 'var(--text-primary)' : 'transparent',
              color: activeMode === 'historical' ? '#FFFFFF' : 'var(--text-secondary)',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            Historical Vault ({trips.length})
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MODE 1: LIVE SESSION WAVEFORM                                         */}
      {/* ===================================================================== */}
      {activeMode === 'live' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Live Summary Metric Bento Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {/* Card 1: Average Session Risk (Wispr Lavender Accent) */}
            <div
              style={{
                backgroundColor: 'var(--bg-card-lavender)',
                border: '1px solid rgba(124, 58, 237, 0.12)',
                borderRadius: '24px',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '160px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    color: 'var(--color-accent-purple-dark)',
                    textTransform: 'uppercase',
                  }}
                >
                  Average Session Risk
                </span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    color: 'var(--color-accent-purple-dark)',
                    fontWeight: 600,
                  }}
                >
                  Target &lt; 25%
                </span>
              </div>
              <div
                className="font-serif"
                style={{
                  fontSize: '3.4rem',
                  fontWeight: 400,
                  lineHeight: 1,
                  color: 'var(--color-accent-purple-dark)',
                  margin: '0.5rem 0',
                }}
              >
                {hasLiveData ? `${averageRisk}%` : '--'}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Rolling mean across active monitoring buffer
              </span>
            </div>

            {/* Card 2: Peak Transient Risk */}
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '24px',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '160px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                  Peak Transient Risk
                </span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '9999px',
                    backgroundColor: maxRisk > 65 ? 'var(--color-alert-dim)' : 'var(--bg-canvas-subtle)',
                    color: maxRisk > 65 ? 'var(--color-alert)' : 'var(--text-secondary)',
                    fontWeight: 600,
                  }}
                >
                  {maxRisk > 65 ? 'High Fatigue' : 'Controlled'}
                </span>
              </div>
              <div
                className="font-serif"
                style={{
                  fontSize: '3.4rem',
                  fontWeight: 400,
                  lineHeight: 1,
                  color: maxRisk > 65 ? 'var(--color-alert)' : 'var(--text-primary)',
                  margin: '0.5rem 0',
                }}
              >
                {hasLiveData ? `${maxRisk}%` : '--'}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Maximum momentary fatigue recorded in window
              </span>
            </div>

            {/* Card 3: Synchronized Samples */}
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '24px',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '160px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                  Synchronized Telemetry
                </span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '9999px',
                    backgroundColor: isEngineConnected ? '#DCFCE7' : 'var(--bg-canvas-subtle)',
                    color: isEngineConnected ? '#15803D' : 'var(--text-muted)',
                    fontWeight: 600,
                  }}
                >
                  {isEngineConnected ? 'ONLINE' : 'OFFLINE'}
                </span>
              </div>
              <div
                className="font-serif"
                style={{
                  fontSize: '3.4rem',
                  fontWeight: 400,
                  lineHeight: 1,
                  color: 'var(--text-primary)',
                  margin: '0.5rem 0',
                }}
              >
                {telemetryHistory.length}
                <span style={{ fontSize: '1.25rem', fontFamily: 'var(--font-sans)', color: 'var(--text-muted)', fontWeight: 400 }}>
                  {' '}/ 400 pts
                </span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Rolling time window (~13s @ 30 FPS edge ingestion)
              </span>
            </div>
          </div>

          {/* SVG Waveform Chart Frame */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '28px',
              padding: 'clamp(1.5rem, 3vw, 2.25rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
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
                  Temporal Ingestion Curve
                </span>
                <h3
                  className="font-serif"
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 400,
                    color: 'var(--text-primary)',
                    margin: '0.2rem 0 0 0',
                  }}
                >
                  Real-time risk <em>amplitude</em> over time
                </h3>
              </div>

              <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '9999px',
                    backgroundColor: 'var(--color-alert-dim)',
                    color: 'var(--color-alert)',
                    fontWeight: 600,
                  }}
                >
                  CRITICAL: 70%
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '9999px',
                    backgroundColor: 'var(--bg-canvas)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  BUFFER: {telemetryHistory.length} SAMPLES
                </span>
              </div>
            </div>

            {/* SVG Waveform Visualizer Canvas */}
            <div
              style={{
                width: '100%',
                height: '240px',
                backgroundColor: 'var(--bg-canvas-subtle)',
                borderRadius: '18px',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(22, 27, 24, 0.05)',
              }}
            >
              {hasLiveData ? (
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 800 240"
                  preserveAspectRatio="none"
                  style={{ display: 'block' }}
                >
                  <defs>
                    <linearGradient id="wisprWaveformGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#113527" />
                      <stop offset="60%" stopColor="#7C3AED" />
                      <stop offset="100%" stopColor="#E11D48" />
                    </linearGradient>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Threshold Guidelines */}
                  <line x1="0" y1="60" x2="800" y2="60" stroke="var(--color-alert)" strokeDasharray="3 3" strokeWidth="1" strokeOpacity="0.5" />
                  <line x1="0" y1="130" x2="800" y2="130" stroke="#D97706" strokeDasharray="3 3" strokeWidth="1" strokeOpacity="0.4" />
                  <line x1="0" y1="190" x2="800" y2="190" stroke="var(--border-subtle)" strokeWidth="1" />

                  <text x="14" y="54" fill="var(--color-alert)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">
                    CRITICAL (70%)
                  </text>
                  <text x="14" y="124" fill="#D97706" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">
                    WARNING (35%)
                  </text>
                  <text x="14" y="184" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono)">
                    NOMINAL (10%)
                  </text>

                  {/* Polyline and Area */}
                  {(() => {
                    const count = telemetryHistory.length;
                    const step = count > 1 ? 800 / (count - 1) : 800;
                    const points = telemetryHistory
                      .map((d, i) => {
                        const score = typeof d.riskScore === 'number' ? Math.max(0, Math.min(100, d.riskScore)) : 0;
                        const x = count === 1 ? 400 : i * step;
                        const y = 220 - (score / 100) * 180;
                        return `${x.toFixed(1)},${y.toFixed(1)}`;
                      })
                      .join(' ');

                    const firstX = '0.0';
                    const lastX = '800.0';
                    const areaPoints = `${firstX},240.0 ${points} ${lastX},240.0`;

                    return (
                      <>
                        <polygon
                          fill="url(#areaGradient)"
                          points={areaPoints}
                        />
                        <polyline
                          fill="none"
                          stroke="url(#wisprWaveformGradient)"
                          strokeWidth="2.8"
                          points={points}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </>
                    );
                  })()}
                </svg>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--bg-surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.75rem auto',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <BarChart3 size={22} color="var(--color-accent-purple)" />
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    No live telemetry buffer recorded yet
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                    Start Live Monitoring or trigger Diagnostic tests to visualize real-time waveform.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Real-Time Biometric Diagnostics Card Strip */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '1rem',
            }}
          >
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '20px',
                padding: '1.35rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Eye Aspect Ratio (EAR)
              </span>
              <div className="font-serif" style={{ fontSize: '2.2rem', color: 'var(--text-primary)', margin: '0.2rem 0' }}>
                {latestTelemetry && typeof latestTelemetry.ear === 'number' ? latestTelemetry.ear.toFixed(2) : '--'}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Nominal baseline: &gt; 0.22</span>
            </div>

            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '20px',
                padding: '1.35rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Mouth Aspect Ratio (MAR)
              </span>
              <div className="font-serif" style={{ fontSize: '2.2rem', color: 'var(--text-primary)', margin: '0.2rem 0' }}>
                {latestTelemetry && typeof latestTelemetry.mar === 'number' ? latestTelemetry.mar.toFixed(2) : '--'}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Yawn threshold: &gt; 0.55</span>
            </div>

            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '20px',
                padding: '1.35rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Cranial Pitch
              </span>
              <div className="font-serif" style={{ fontSize: '2.2rem', color: 'var(--text-primary)', margin: '0.2rem 0' }}>
                {latestTelemetry && typeof latestTelemetry.headPitch === 'number'
                  ? `${latestTelemetry.headPitch.toFixed(1)}°`
                  : '--'}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Head-down trigger: &lt; -10°</span>
            </div>

            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '20px',
                padding: '1.35rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                PERCLOS Index
              </span>
              <div className="font-serif" style={{ fontSize: '2.2rem', color: 'var(--text-primary)', margin: '0.2rem 0' }}>
                {latestTelemetry && typeof latestTelemetry.perclos === 'number'
                  ? `${latestTelemetry.perclos.toFixed(1)}%`
                  : '--'}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Fatigue warning: &gt; 15%</span>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODE 2: HISTORICAL AUDIT VAULT                                        */}
      {/* ===================================================================== */}
      {activeMode === 'historical' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Header Status & Sync Button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                letterSpacing: '0.04em',
              }}
            >
              SQLITE DATABASE AUDIT LEDGER • {trips.length} PERSISTED SESSIONS
            </span>

            <button
              onClick={fetchHistoricalTrips}
              disabled={isLoadingHistory}
              title="Refresh ledger from database"
              className="btn-magnetic-pill"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '9999px',
                padding: '0.45rem 1rem',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                cursor: isLoadingHistory ? 'wait' : 'pointer',
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
              <RefreshCw size={12} className={isLoadingHistory ? 'animate-spin' : ''} />
              <span>{isLoadingHistory ? 'Syncing...' : 'Sync Vault'}</span>
            </button>
          </div>

          {/* Loading State */}
          {isLoadingHistory && (
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '24px',
                padding: '3.5rem 2rem',
                textAlign: 'center',
                color: 'var(--text-secondary)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <RefreshCw size={24} className="animate-spin" style={{ display: 'inline-block', marginBottom: '0.75rem', color: 'var(--color-accent-purple)' }} />
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Accessing SQLite Session Audit Ledger...
              </div>
            </div>
          )}

          {/* Backend Unavailable Error State */}
          {!isLoadingHistory && historyError && (
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1.5px solid var(--color-alert)',
                borderRadius: '24px',
                padding: '2.5rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.85rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <AlertTriangle size={32} color="var(--color-alert)" />
              <h4 className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 400, color: 'var(--text-primary)' }}>
                Audit Ledger Unavailable
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '500px' }}>
                Could not connect to backend database ({historyError}). Ensure the FastAPI server is running on port 8000.
              </p>
              <button
                onClick={fetchHistoricalTrips}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.55rem 1.4rem',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  backgroundColor: 'var(--text-primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                }}
              >
                Retry Connection
              </button>
            </div>
          )}

          {/* Empty Historical State */}
          {!isLoadingHistory && !historyError && !hasHistoryData && (
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '24px',
                padding: '3.5rem 2rem',
                textAlign: 'center',
                color: 'var(--text-secondary)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <Award size={32} style={{ opacity: 0.5, marginBottom: '0.75rem', display: 'inline-block', color: 'var(--color-accent-purple)' }} />
              <h4 className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 400, color: 'var(--text-primary)' }}>
                No Historical Sessions Found
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0.5rem auto 0' }}>
                No completed driving sessions have been committed to SQLite yet. Sessions longer than 5 seconds are saved automatically when monitoring stops.
              </p>
            </div>
          )}

          {/* Historical Data View */}
          {!isLoadingHistory && !historyError && hasHistoryData && (
            <>
              {/* Four Wispr-Style Multi-Color Summary Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                {/* Card 1: Average Recorded Safety Score (Wispr Soft Lavender) */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-card-lavender)',
                    border: '1px solid rgba(124, 58, 237, 0.12)',
                    borderRadius: '24px',
                    padding: '1.75rem',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      color: 'var(--color-accent-purple-dark)',
                      textTransform: 'uppercase',
                    }}
                  >
                    Mean Safety Score
                  </span>
                  <div
                    className="font-serif"
                    style={{
                      fontSize: '3.4rem',
                      fontWeight: 400,
                      lineHeight: 1,
                      color: 'var(--color-accent-purple-dark)',
                      margin: '0.4rem 0',
                    }}
                  >
                    {averageHistoricalSafetyScore}%
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Algorithmic heuristic across {validTrips.length} sessions
                  </span>
                </div>

                {/* Card 2: Cumulative Monitored Time (Wispr Soft Mint) */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-card-mint)',
                    border: '1px solid rgba(16, 185, 129, 0.15)',
                    borderRadius: '24px',
                    padding: '1.75rem',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      color: '#064E3B',
                      textTransform: 'uppercase',
                    }}
                  >
                    Cumulative Monitored Time
                  </span>
                  <div
                    className="font-serif"
                    style={{
                      fontSize: '3.4rem',
                      fontWeight: 400,
                      lineHeight: 1,
                      color: '#064E3B',
                      margin: '0.4rem 0',
                    }}
                  >
                    {formatSecondsToDuration(cumulativeDurationSecs)}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Active driving across {trips.length} records
                  </span>
                </div>

                {/* Card 3: Recorded Safety Incidents */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '24px',
                    padding: '1.75rem',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
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
                    Recorded Incidents
                  </span>
                  <div
                    className="font-serif"
                    style={{
                      fontSize: '3.4rem',
                      fontWeight: 400,
                      lineHeight: 1,
                      color: totalIncidentsCount > 0 ? 'var(--color-alert)' : '#059669',
                      margin: '0.4rem 0',
                    }}
                  >
                    {totalIncidentsCount}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Drowsiness, distraction &amp; deviation events
                  </span>
                </div>

                {/* Card 4: Optimal Session Ratio (Deep Forest Emerald Contrast) */}
                <div
                  style={{
                    backgroundColor: 'var(--color-emerald-deep)',
                    color: '#FFFFFF',
                    borderRadius: '24px',
                    padding: '1.75rem',
                    boxShadow: 'var(--shadow-md)',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      color: 'var(--color-emerald-accent)',
                      textTransform: 'uppercase',
                    }}
                  >
                    Optimal Session Ratio
                  </span>
                  <div
                    className="font-serif"
                    style={{
                      fontSize: '3.4rem',
                      fontWeight: 400,
                      lineHeight: 1,
                      color: '#FFFFFF',
                      margin: '0.4rem 0',
                    }}
                  >
                    {trips.length > 0
                      ? `${Math.round((gradeDistribution.A.count / trips.length) * 100)}%`
                      : '0%'}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.75)' }}>
                    {gradeDistribution.A.count} of {trips.length} sessions rated Grade A
                  </span>
                </div>
              </div>

              {/* Chronological Safety-Score Trend Chart (SVG) */}
              <div
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '28px',
                  padding: 'clamp(1.5rem, 3vw, 2.25rem)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
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
                      Chronological Safety Trajectory
                    </span>
                    <h3
                      className="font-serif"
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: 400,
                        color: 'var(--text-primary)',
                        margin: '0.2rem 0 0 0',
                      }}
                    >
                      Session-by-session compliance <em>progression</em>
                    </h3>
                  </div>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-mono)',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '9999px',
                      backgroundColor: 'var(--bg-canvas-subtle)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    OLDEST (LEFT) → NEWEST (RIGHT)
                  </div>
                </div>

                {/* SVG Trend Chart Canvas */}
                <div
                  style={{
                    width: '100%',
                    height: '240px',
                    backgroundColor: 'var(--bg-canvas-subtle)',
                    borderRadius: '18px',
                    position: 'relative',
                    border: '1px solid rgba(22, 27, 24, 0.05)',
                  }}
                >
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 800 240"
                    preserveAspectRatio="none"
                    style={{ display: 'block' }}
                  >
                    {/* Horizontal Guidelines */}
                    <line x1="50" y1="56" x2="780" y2="56" stroke="#059669" strokeDasharray="3 3" strokeWidth="1" strokeOpacity="0.5" />
                    <line x1="50" y1="95" x2="780" y2="95" stroke="var(--border-subtle)" strokeDasharray="3 3" strokeWidth="1" />
                    <line x1="50" y1="135" x2="780" y2="135" stroke="var(--color-alert)" strokeDasharray="3 3" strokeWidth="1" strokeOpacity="0.4" />

                    <text x="14" y="60" fill="#059669" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">90% A</text>
                    <text x="14" y="99" fill="var(--text-secondary)" fontSize="10" fontFamily="var(--font-mono)">75% B</text>
                    <text x="14" y="139" fill="var(--color-alert)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">60% C</text>

                    {/* Polyline connecting points in chronological order */}
                    {(() => {
                      const count = chronologicalTrips.length;
                      if (count === 0) return null;

                      const leftPad = 60;
                      const rightPad = 780;
                      const plotWidth = rightPad - leftPad;
                      const step = count > 1 ? plotWidth / (count - 1) : 0;

                      const coords = chronologicalTrips.map((t, i) => {
                        const score = typeof t.safetyScore === 'number' ? Math.max(0, Math.min(100, t.safetyScore)) : 0;
                        const x = count === 1 ? 400 : leftPad + i * step;
                        const y = 200 - (score / 100) * 160;
                        return { x, y, trip: t, index: i };
                      });

                      const pointsStr = coords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');

                      return (
                        <>
                          <polyline
                            fill="none"
                            stroke="var(--color-emerald-deep)"
                            strokeWidth="2.5"
                            points={pointsStr}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          {coords.map((c, i) => {
                            const isSelected = selectedTripIndex === i;
                            const pointColor =
                              c.trip.safetyScore >= 85
                                ? '#059669'
                                : c.trip.safetyScore >= 70
                                ? 'var(--text-primary)'
                                : 'var(--color-alert)';

                            return (
                              <g
                                key={c.trip.id || i}
                                style={{ cursor: 'pointer' }}
                                onClick={() => setSelectedTripIndex(isSelected ? null : i)}
                              >
                                <circle
                                  cx={c.x}
                                  cy={c.y}
                                  r={isSelected ? 7 : 4.5}
                                  fill={pointColor}
                                  stroke="#FFFFFF"
                                  strokeWidth="2.5"
                                />
                                {isSelected && (
                                  <text
                                    x={Math.min(720, Math.max(80, c.x))}
                                    y={c.y > 60 ? c.y - 14 : c.y + 22}
                                    textAnchor="middle"
                                    fill="var(--text-primary)"
                                    fontSize="10"
                                    fontFamily="var(--font-mono)"
                                    fontWeight="bold"
                                  >
                                    {c.trip.id}: {c.trip.safetyScore}% ({c.trip.grade})
                                  </text>
                                )}
                              </g>
                            );
                          })}
                        </>
                      );
                    })()}
                  </svg>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <span>Click any plot node to inspect session score details.</span>
                  <span className="font-mono">{chronologicalTrips.length} AUDIT SESSIONS LOGGED</span>
                </div>
              </div>

              {/* Two Column Detailed Breakdown */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '1.5rem',
                }}
              >
                {/* Column 1: Incident Category Breakdown */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '24px',
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                      Taxonomy Breakdown
                    </span>
                    <h4 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 400, color: 'var(--text-primary)', margin: '0.2rem 0 0 0' }}>
                      Safety violations by <em>category</em>
                    </h4>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {Object.entries(incidentCategories)
                      .filter(([_, cat]) => cat.count > 0 || totalIncidentsCount === 0)
                      .map(([key, cat]) => {
                        const pct = totalIncidentsCount > 0 ? Math.round((cat.count / totalIncidentsCount) * 100) : 0;

                        return (
                          <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{cat.label}</span>
                              <span className="font-mono" style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                                {cat.count} ({pct}%)
                              </span>
                            </div>

                            {/* Capsule Proportion Bar */}
                            <div
                              style={{
                                width: '100%',
                                height: '8px',
                                backgroundColor: 'var(--bg-canvas-subtle)',
                                borderRadius: '9999px',
                                overflow: 'hidden',
                              }}
                            >
                              <div
                                style={{
                                  width: `${pct}%`,
                                  height: '100%',
                                  backgroundColor: cat.color,
                                  borderRadius: '9999px',
                                  transition: 'width 0.4s ease',
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Column 2: Safety Grade Distribution */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '24px',
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                      Fleet Compliance
                    </span>
                    <h4 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 400, color: 'var(--text-primary)', margin: '0.2rem 0 0 0' }}>
                      Session safety grade <em>spread</em>
                    </h4>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {Object.entries(gradeDistribution).map(([gradeKey, item]) => {
                      const pct = trips.length > 0 ? Math.round((item.count / trips.length) * 100) : 0;

                      return (
                        <div key={gradeKey} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{item.label}</span>
                            <span className="font-mono" style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                              {item.count} sessions ({pct}%)
                            </span>
                          </div>

                          {/* Capsule Grade Bar */}
                          <div
                            style={{
                              width: '100%',
                              height: '8px',
                              backgroundColor: 'var(--bg-canvas-subtle)',
                              borderRadius: '9999px',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width: `${pct}%`,
                                height: '100%',
                                backgroundColor: item.color,
                                borderRadius: '9999px',
                                transition: 'width 0.4s ease',
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Integrity & Compliance Disclaimer Note */}
              <div
                style={{
                  backgroundColor: 'var(--bg-canvas-subtle)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '20px',
                  padding: '1.25rem 1.5rem',
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.55,
                }}
              >
                <strong style={{ color: 'var(--text-primary)' }}>NOTE ON HEURISTIC SCORING: </strong>
                Safety scores are algorithmic heuristics calculated by DriveGuard AI based on computer-vision event
                deductions (15 points per prolonged eye closure and 5 points per distraction or yawning anomaly).
                They reflect driver attentiveness during recorded sessions and are not an accredited medical diagnosis or legal certification.
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
