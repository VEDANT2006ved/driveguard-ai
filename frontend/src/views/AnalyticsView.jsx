import React, { useState, useEffect } from 'react';
import { BarChart3, AlertTriangle, RefreshCw, Award, Activity, TrendingUp, ShieldCheck } from 'lucide-react';
import { API_BASE_URL, getApiBaseUrl } from '../config/api';

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
      const res = await fetch(`${getApiBaseUrl()}/api/trips`);
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
    lateral: { label: 'Lateral Head Deviation', count: 0, color: '#3B82F6' },
    eye_closure: { label: 'Prolonged Eye Closure', count: 0, color: 'var(--color-accent-red)' },
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
    A: { label: 'Grade A / A+ (Optimal)', count: 0, color: '#10B981' },
    B: { label: 'Grade B / B+ / B- (Caution)', count: 0, color: '#5E5B54' },
    C: { label: 'Grade C (Elevated Risk)', count: 0, color: '#D97706' },
    F: { label: 'Grade F (Critical)', count: 0, color: 'var(--color-accent-red)' },
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* View Header with Mode Selector Toggle */}
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
            <Activity size={12} color="var(--color-accent-red)" />
            <span>SYS.03 // TELEMETRY & AUDIT VAULT</span>
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
            {activeMode === 'live' ? 'ATTENTIVENESS WAVEFORM' : 'FLEET COMPLIANCE AUDIT VAULT'}
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
            {activeMode === 'live'
              ? 'Real-time temporal risk distribution, palpebral tracking, and cranial kinematics streaming directly from edge inference.'
              : 'Cumulative compliance analytics compiled from verified driving sessions persistently stored in SQLite.'}
          </p>
        </div>

        {/* Minimalist Architectural Segmented Toggle */}
        <div
          style={{
            display: 'inline-flex',
            backgroundColor: 'var(--bg-ivory-subtle)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-btn)',
            padding: '3px',
            gap: '3px',
          }}
        >
          <button
            onClick={() => setActiveMode('live')}
            style={{
              padding: '0.55rem 1.4rem',
              borderRadius: '2px',
              fontFamily: 'var(--font-condensed)',
              fontSize: '0.86rem',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeMode === 'live' ? 'var(--text-primary)' : 'transparent',
              color: activeMode === 'live' ? '#FFFFFF' : 'var(--text-secondary)',
              transition: 'all var(--transition-fast)',
            }}
          >
            Live Waveform
          </button>

          <button
            onClick={() => setActiveMode('historical')}
            style={{
              padding: '0.55rem 1.4rem',
              borderRadius: '2px',
              fontFamily: 'var(--font-condensed)',
              fontSize: '0.86rem',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeMode === 'historical' ? 'var(--text-primary)' : 'transparent',
              color: activeMode === 'historical' ? '#FFFFFF' : 'var(--text-secondary)',
              transition: 'all var(--transition-fast)',
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
          {/* Live Summary Metric Architectural Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {/* Card 1: Average Session Risk */}
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-card)',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '160px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                  }}
                >
                  Average Session Risk
                </span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-mono)',
                    padding: '0.2rem 0.55rem',
                    borderRadius: 'var(--radius-btn)',
                    backgroundColor: 'var(--bg-ivory-subtle)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                  }}
                >
                  TARGET &lt; 25%
                </span>
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-condensed)',
                  fontSize: '3.6rem',
                  fontWeight: 600,
                  lineHeight: 1,
                  color: 'var(--text-primary)',
                  margin: '0.4rem 0',
                }}
              >
                {hasLiveData ? `${averageRisk}%` : '--'}
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Rolling mean across active monitoring buffer
              </span>
            </div>

            {/* Card 2: Peak Transient Risk */}
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-card)',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '160px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                  }}
                >
                  Peak Transient Risk
                </span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-mono)',
                    padding: '0.2rem 0.55rem',
                    borderRadius: 'var(--radius-btn)',
                    backgroundColor: maxRisk > 65 ? 'var(--color-alert-dim)' : 'var(--bg-ivory-subtle)',
                    color: maxRisk > 65 ? 'var(--color-accent-red)' : 'var(--text-secondary)',
                    border: maxRisk > 65 ? '1px solid var(--color-alert-border)' : '1px solid var(--border-subtle)',
                    fontWeight: 600,
                  }}
                >
                  {maxRisk > 65 ? 'HIGH FATIGUE' : 'CONTROLLED'}
                </span>
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-condensed)',
                  fontSize: '3.6rem',
                  fontWeight: 600,
                  lineHeight: 1,
                  color: maxRisk > 65 ? 'var(--color-accent-red)' : 'var(--text-primary)',
                  margin: '0.4rem 0',
                }}
              >
                {hasLiveData ? `${maxRisk}%` : '--'}
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Maximum momentary fatigue recorded in window
              </span>
            </div>

            {/* Card 3: Synchronized Samples */}
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-card)',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '160px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                  }}
                >
                  Synchronized Telemetry
                </span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-mono)',
                    padding: '0.2rem 0.65rem',
                    borderRadius: 'var(--radius-btn)',
                    backgroundColor: isEngineConnected ? 'var(--color-safe-dim)' : 'var(--bg-ivory-subtle)',
                    color: isEngineConnected ? 'var(--color-safe)' : 'var(--text-muted)',
                    border: isEngineConnected ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
                    fontWeight: 600,
                  }}
                >
                  {isEngineConnected ? 'ONLINE' : 'OFFLINE'}
                </span>
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-condensed)',
                  fontSize: '3.6rem',
                  fontWeight: 600,
                  lineHeight: 1,
                  color: 'var(--text-primary)',
                  margin: '0.4rem 0',
                }}
              >
                {telemetryHistory.length}
                <span style={{ fontSize: '1.25rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontWeight: 400 }}>
                  {' '}/ 400 PTS
                </span>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Rolling time window (~13s @ 30 FPS edge ingestion)
              </span>
            </div>
          </div>

          {/* Cinematic Dark SVG Waveform Chart Frame */}
          <div
            style={{
              backgroundColor: 'var(--bg-dark)',
              border: '1px solid var(--border-dark)',
              borderRadius: 'var(--radius-card-lg)',
              padding: 'clamp(1.5rem, 3vw, 2.25rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              boxShadow: 'var(--shadow-dark)',
              color: '#FFFFFF',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    color: 'var(--text-light-muted)',
                    textTransform: 'uppercase',
                  }}
                >
                  TEMPORAL INGESTION CURVE
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-condensed)',
                    fontSize: '1.6rem',
                    fontWeight: 500,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: '#FFFFFF',
                    margin: '0.2rem 0 0 0',
                  }}
                >
                  REAL-TIME RISK AMPLITUDE OVER TIME
                </h3>
              </div>

              <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-mono)',
                    padding: '0.25rem 0.65rem',
                    borderRadius: 'var(--radius-btn)',
                    backgroundColor: 'rgba(232, 75, 50, 0.15)',
                    color: 'var(--color-accent-red)',
                    border: '1px solid var(--color-alert-border)',
                    fontWeight: 600,
                  }}
                >
                  CRITICAL: 70%
                </span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-mono)',
                    padding: '0.25rem 0.65rem',
                    borderRadius: 'var(--radius-btn)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: 'var(--text-light-muted)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
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
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '6px',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255, 255, 255, 0.08)',
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
                    <linearGradient id="vantageWaveformGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="60%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#E84B32" />
                    </linearGradient>
                    <linearGradient id="vantageAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E84B32" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#E84B32" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Threshold Guidelines */}
                  <line x1="0" y1="60" x2="800" y2="60" stroke="var(--color-accent-red)" strokeDasharray="3 3" strokeWidth="1" strokeOpacity="0.6" />
                  <line x1="0" y1="130" x2="800" y2="130" stroke="#D97706" strokeDasharray="3 3" strokeWidth="1" strokeOpacity="0.45" />
                  <line x1="0" y1="190" x2="800" y2="190" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />

                  <text x="14" y="54" fill="var(--color-accent-red)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">
                    CRITICAL (70%)
                  </text>
                  <text x="14" y="124" fill="#D97706" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">
                    WARNING (35%)
                  </text>
                  <text x="14" y="184" fill="rgba(255, 255, 255, 0.4)" fontSize="10" fontFamily="var(--font-mono)">
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
                          fill="url(#vantageAreaGradient)"
                          points={areaPoints}
                        />
                        <polyline
                          fill="none"
                          stroke="url(#vantageWaveformGradient)"
                          strokeWidth="2.4"
                          points={points}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </>
                    );
                  })()}
                </svg>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-light-muted)', padding: '2rem' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius-btn)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.75rem auto',
                    }}
                  >
                    <BarChart3 size={20} color="var(--color-accent-red)" />
                  </div>
                  <div style={{ fontFamily: 'var(--font-condensed)', fontSize: '1.1rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#FFFFFF' }}>
                    No live telemetry buffer recorded yet
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-light-muted)', marginTop: '0.35rem', fontFamily: 'var(--font-mono)' }}>
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
                borderRadius: 'var(--radius-card)',
                padding: '1.35rem',
              }}
            >
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Eye Aspect Ratio (EAR)
              </span>
              <div style={{ fontFamily: 'var(--font-condensed)', fontSize: '2.5rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0.2rem 0' }}>
                {latestTelemetry && typeof latestTelemetry.ear === 'number' ? latestTelemetry.ear.toFixed(2) : '--'}
              </div>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Nominal baseline: &gt; 0.22</span>
            </div>

            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-card)',
                padding: '1.35rem',
              }}
            >
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Mouth Aspect Ratio (MAR)
              </span>
              <div style={{ fontFamily: 'var(--font-condensed)', fontSize: '2.5rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0.2rem 0' }}>
                {latestTelemetry && typeof latestTelemetry.mar === 'number' ? latestTelemetry.mar.toFixed(2) : '--'}
              </div>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Yawn threshold: &gt; 0.55</span>
            </div>

            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-card)',
                padding: '1.35rem',
              }}
            >
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Cranial Pitch
              </span>
              <div style={{ fontFamily: 'var(--font-condensed)', fontSize: '2.5rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0.2rem 0' }}>
                {latestTelemetry && typeof latestTelemetry.headPitch === 'number'
                  ? `${latestTelemetry.headPitch.toFixed(1)}°`
                  : '--'}
              </div>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Head-down trigger: &lt; -10°</span>
            </div>

            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-card)',
                padding: '1.35rem',
              }}
            >
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                PERCLOS Index
              </span>
              <div style={{ fontFamily: 'var(--font-condensed)', fontSize: '2.5rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0.2rem 0' }}>
                {latestTelemetry && typeof latestTelemetry.perclos === 'number'
                  ? `${latestTelemetry.perclos.toFixed(1)}%`
                  : '--'}
              </div>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Fatigue warning: &gt; 15%</span>
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
                letterSpacing: '0.08em',
              }}
            >
              SQLITE DATABASE AUDIT LEDGER • {trips.length} PERSISTED SESSIONS
            </span>

            <button
              onClick={fetchHistoricalTrips}
              disabled={isLoadingHistory}
              title="Refresh ledger from database"
              className="vantage-btn-outline"
              style={{
                padding: '0.45rem 1rem',
                fontSize: '0.8rem',
                cursor: isLoadingHistory ? 'wait' : 'pointer',
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
                borderRadius: 'var(--radius-card)',
                padding: '3.5rem 2rem',
                textAlign: 'center',
                color: 'var(--text-secondary)',
              }}
            >
              <RefreshCw size={24} className="animate-spin" style={{ display: 'inline-block', marginBottom: '0.75rem', color: 'var(--color-accent-red)' }} />
              <div style={{ fontFamily: 'var(--font-condensed)', fontSize: '1.2rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                Accessing SQLite Session Audit Ledger...
              </div>
            </div>
          )}

          {/* Backend Unavailable Error State */}
          {!isLoadingHistory && historyError && (
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1.5px solid var(--color-accent-red)',
                borderRadius: 'var(--radius-card)',
                padding: '2.5rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.85rem',
              }}
            >
              <AlertTriangle size={32} color="var(--color-accent-red)" />
              <h4 style={{ fontFamily: 'var(--font-condensed)', fontSize: '1.5rem', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                Audit Ledger Unavailable
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '500px' }}>
                Could not connect to backend database ({historyError}). Ensure the FastAPI server is running on port 8000.
              </p>
              <button
                onClick={fetchHistoricalTrips}
                className="vantage-btn"
                style={{ marginTop: '0.5rem' }}
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
                borderRadius: 'var(--radius-card)',
                padding: '3.5rem 2rem',
                textAlign: 'center',
                color: 'var(--text-secondary)',
              }}
            >
              <Award size={32} style={{ opacity: 0.4, marginBottom: '0.75rem', display: 'inline-block', color: 'var(--text-muted)' }} />
              <h4 style={{ fontFamily: 'var(--font-condensed)', fontSize: '1.5rem', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
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
              {/* Four Architectural Summary Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                {/* Card 1: Mean Recorded Safety Score */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-card)',
                    padding: '1.75rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                    }}
                  >
                    Mean Safety Score
                  </span>
                  <div
                    style={{
                      fontFamily: 'var(--font-condensed)',
                      fontSize: '3.6rem',
                      fontWeight: 600,
                      lineHeight: 1,
                      color: 'var(--text-primary)',
                      margin: '0.4rem 0',
                    }}
                  >
                    {averageHistoricalSafetyScore}%
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Algorithmic heuristic across {validTrips.length} sessions
                  </span>
                </div>

                {/* Card 2: Cumulative Monitored Time */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-card)',
                    padding: '1.75rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                    }}
                  >
                    Cumulative Monitored Time
                  </span>
                  <div
                    style={{
                      fontFamily: 'var(--font-condensed)',
                      fontSize: '3.6rem',
                      fontWeight: 600,
                      lineHeight: 1,
                      color: 'var(--text-primary)',
                      margin: '0.4rem 0',
                    }}
                  >
                    {formatSecondsToDuration(cumulativeDurationSecs)}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Active driving across {trips.length} records
                  </span>
                </div>

                {/* Card 3: Recorded Safety Incidents */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-card)',
                    padding: '1.75rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                    }}
                  >
                    Recorded Incidents
                  </span>
                  <div
                    style={{
                      fontFamily: 'var(--font-condensed)',
                      fontSize: '3.6rem',
                      fontWeight: 600,
                      lineHeight: 1,
                      color: totalIncidentsCount > 0 ? 'var(--color-accent-red)' : 'var(--color-safe)',
                      margin: '0.4rem 0',
                    }}
                  >
                    {totalIncidentsCount}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Drowsiness, distraction &amp; deviation events
                  </span>
                </div>

                {/* Card 4: Optimal Session Ratio (Deep Racing Green Contrast) */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-racing-green)',
                    color: '#FFFFFF',
                    borderRadius: 'var(--radius-card)',
                    padding: '1.75rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      color: 'var(--color-mint)',
                      textTransform: 'uppercase',
                    }}
                  >
                    Optimal Session Ratio
                  </span>
                  <div
                    style={{
                      fontFamily: 'var(--font-condensed)',
                      fontSize: '3.6rem',
                      fontWeight: 600,
                      lineHeight: 1,
                      color: '#FFFFFF',
                      margin: '0.4rem 0',
                    }}
                  >
                    {trips.length > 0
                      ? `${Math.round((gradeDistribution.A.count / trips.length) * 100)}%`
                      : '0%'}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                    {gradeDistribution.A.count} of {trips.length} sessions rated Grade A
                  </span>
                </div>
              </div>

              {/* Chronological Safety-Score Trend Chart (SVG) */}
              <div
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-card-lg)',
                  padding: 'clamp(1.5rem, 3vw, 2.25rem)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 600,
                        letterSpacing: '0.12em',
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                      }}
                    >
                      CHRONOLOGICAL SAFETY TRAJECTORY
                    </span>
                    <h3
                      style={{
                        fontFamily: 'var(--font-condensed)',
                        fontSize: '1.6rem',
                        fontWeight: 500,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        color: 'var(--text-primary)',
                        margin: '0.2rem 0 0 0',
                      }}
                    >
                      SESSION-BY-SESSION COMPLIANCE PROGRESSION
                    </h3>
                  </div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      fontFamily: 'var(--font-mono)',
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-btn)',
                      backgroundColor: 'var(--bg-ivory-subtle)',
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
                    backgroundColor: 'var(--bg-canvas)',
                    borderRadius: 'var(--radius-card)',
                    position: 'relative',
                    border: '1px solid var(--border-subtle)',
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
                    <line x1="50" y1="56" x2="780" y2="56" stroke="var(--color-safe)" strokeDasharray="3 3" strokeWidth="1" strokeOpacity="0.5" />
                    <line x1="50" y1="95" x2="780" y2="95" stroke="var(--border-subtle)" strokeDasharray="3 3" strokeWidth="1" />
                    <line x1="50" y1="135" x2="780" y2="135" stroke="var(--color-accent-red)" strokeDasharray="3 3" strokeWidth="1" strokeOpacity="0.4" />

                    <text x="14" y="60" fill="var(--color-safe)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">90% A</text>
                    <text x="14" y="99" fill="var(--text-secondary)" fontSize="10" fontFamily="var(--font-mono)">75% B</text>
                    <text x="14" y="139" fill="var(--color-accent-red)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">60% C</text>

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
                            stroke="var(--text-primary)"
                            strokeWidth="2.2"
                            points={pointsStr}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          {coords.map((c, i) => {
                            const isSelected = selectedTripIndex === i;
                            const pointColor =
                              c.trip.safetyScore >= 85
                                ? 'var(--color-safe)'
                                : c.trip.safetyScore >= 70
                                ? 'var(--text-primary)'
                                : 'var(--color-accent-red)';

                            return (
                              <g
                                key={c.trip.id || i}
                                style={{ cursor: 'pointer' }}
                                onClick={() => setSelectedTripIndex(isSelected ? null : i)}
                              >
                                <circle
                                  cx={c.x}
                                  cy={c.y}
                                  r={isSelected ? 6.5 : 4}
                                  fill={pointColor}
                                  stroke="#FFFFFF"
                                  strokeWidth="2"
                                />
                                {isSelected && (
                                  <text
                                    x={Math.min(720, Math.max(80, c.x))}
                                    y={c.y > 60 ? c.y - 12 : c.y + 20}
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

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
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
                    borderRadius: 'var(--radius-card-lg)',
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      TAXONOMY BREAKDOWN
                    </span>
                    <h4 style={{ fontFamily: 'var(--font-condensed)', fontSize: '1.4rem', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-primary)', margin: '0.2rem 0 0 0' }}>
                      SAFETY VIOLATIONS BY CATEGORY
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
                              <span className="font-mono" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                                {cat.count} ({pct}%)
                              </span>
                            </div>

                            {/* Crisp Rectangular Proportion Bar */}
                            <div
                              style={{
                                width: '100%',
                                height: '6px',
                                backgroundColor: 'var(--bg-ivory-subtle)',
                                borderRadius: '2px',
                                overflow: 'hidden',
                              }}
                            >
                              <div
                                style={{
                                  width: `${pct}%`,
                                  height: '100%',
                                  backgroundColor: cat.color,
                                  borderRadius: '2px',
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
                    borderRadius: 'var(--radius-card-lg)',
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      FLEET COMPLIANCE
                    </span>
                    <h4 style={{ fontFamily: 'var(--font-condensed)', fontSize: '1.4rem', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-primary)', margin: '0.2rem 0 0 0' }}>
                      SESSION SAFETY GRADE SPREAD
                    </h4>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {Object.entries(gradeDistribution).map(([gradeKey, item]) => {
                      const pct = trips.length > 0 ? Math.round((item.count / trips.length) * 100) : 0;

                      return (
                        <div key={gradeKey} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{item.label}</span>
                            <span className="font-mono" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                              {item.count} sessions ({pct}%)
                            </span>
                          </div>

                          {/* Crisp Rectangular Grade Bar */}
                          <div
                            style={{
                              width: '100%',
                              height: '6px',
                              backgroundColor: 'var(--bg-ivory-subtle)',
                              borderRadius: '2px',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width: `${pct}%`,
                                height: '100%',
                                backgroundColor: item.color,
                                borderRadius: '2px',
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
                  backgroundColor: 'var(--bg-ivory-subtle)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-card)',
                  padding: '1.25rem 1.5rem',
                  fontSize: '0.8rem',
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
