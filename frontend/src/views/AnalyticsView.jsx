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

/**
 * AnalyticsView Component
 * Luxury Editorial Fleet Compliance & Telemetry Waveform
 * Design: Explora Journeys (editorial typographic hierarchy) + NOMU (minimalist metric cards) + Decathlon Yestalgia (verification seals)
 */
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
      setTrips([]);
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
    eye_closure: { label: 'Prolonged Eye Closure', count: 0, color: '#DC2626' },
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
    A: { label: 'Grade A / A+ (Optimal)', count: 0, color: '#2E7D32' },
    B: { label: 'Grade B / B+ / B- (Caution)', count: 0, color: '#4B5563' },
    C: { label: 'Grade C (Elevated Risk)', count: 0, color: '#D97706' },
    F: { label: 'Grade F (Critical)', count: 0, color: '#DC2626' },
  };

  trips.forEach((t) => {
    const g = String(t.grade || '').toUpperCase();
    if (g.startsWith('A')) gradeDistribution.A.count += 1;
    else if (g.startsWith('B')) gradeDistribution.B.count += 1;
    else if (g.startsWith('C')) gradeDistribution.C.count += 1;
    else gradeDistribution.F.count += 1;
  });

  const chronologicalTrips = [...trips].reverse();

  return (
    <div
      className="cinematic-fade-in"
      style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: 'clamp(1.5rem, 3vw, 2.5rem) clamp(1rem, 3vw, 2.5rem)',
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem',
      }}
    >
      {/* View Header with Mode Selector Toggle */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '1.5rem',
          borderBottom: '1px solid rgba(23, 23, 23, 0.12)',
          paddingBottom: '1.5rem',
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
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
              marginBottom: '0.4rem',
            }}
          >
            <Activity size={12} color="#DC2626" />
            <span>SECTION 03 // TELEMETRY & AUDIT VAULT</span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.3rem, 4.4vw, 3.5rem)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              color: 'var(--text-primary)',
              margin: '0.1rem 0 0.5rem 0',
            }}
          >
            {activeMode === 'live' ? 'Attentiveness Waveform' : 'Safety Compliance Vault'}
          </h1>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.92rem',
              maxWidth: '680px',
              lineHeight: 1.6,
              margin: 0,
              fontFamily: 'var(--font-sans)',
            }}
          >
            {activeMode === 'live'
              ? 'Real-time temporal risk distribution, palpebral tracking, and cranial kinematics streaming directly from edge inference.'
              : 'Cumulative compliance analytics compiled from verified driving sessions persistently stored in SQLite.'}
          </p>
        </div>

        {/* Minimalist Tactile Segmented Toggle */}
        <div
          style={{
            display: 'inline-flex',
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(23, 23, 23, 0.12)',
            borderRadius: '9999px',
            padding: '3px',
            gap: '3px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
          }}
        >
          <button
            onClick={() => setActiveMode('live')}
            style={{
              padding: '0.55rem 1.35rem',
              borderRadius: '9999px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.82rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeMode === 'live' ? '#171717' : 'transparent',
              color: activeMode === 'live' ? '#FFFFFF' : 'var(--text-secondary)',
              transition: 'all 0.2s ease',
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
              fontSize: '0.82rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeMode === 'historical' ? '#171717' : 'transparent',
              color: activeMode === 'historical' ? '#FFFFFF' : 'var(--text-secondary)',
              transition: 'all 0.2s ease',
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
          {/* Live Summary Metric Cards */}
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
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(23, 23, 23, 0.1)',
                borderRadius: '16px',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '160px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
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
                    borderRadius: '9999px',
                    backgroundColor: '#F3EFEA',
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                  }}
                >
                  TARGET &lt; 25%
                </span>
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '3.6rem',
                  fontWeight: 400,
                  lineHeight: 1,
                  color: 'var(--text-primary)',
                  margin: '0.4rem 0',
                }}
              >
                {hasLiveData ? `${averageRisk}%` : '--'}
              </div>
              <span style={{ fontSize: '0.78rem', color: '#9CA3AF', fontFamily: 'var(--font-sans)' }}>
                Rolling mean across active monitoring buffer
              </span>
            </div>

            {/* Card 2: Peak Transient Risk */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(23, 23, 23, 0.1)',
                borderRadius: '16px',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '160px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
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
                    borderRadius: '9999px',
                    backgroundColor: maxRisk > 65 ? '#FEF2F2' : '#F3EFEA',
                    color: maxRisk > 65 ? '#DC2626' : 'var(--text-secondary)',
                    fontWeight: 600,
                  }}
                >
                  {maxRisk > 65 ? 'HIGH FATIGUE' : 'CONTROLLED'}
                </span>
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '3.6rem',
                  fontWeight: 400,
                  lineHeight: 1,
                  color: maxRisk > 65 ? '#DC2626' : 'var(--text-primary)',
                  margin: '0.4rem 0',
                }}
              >
                {hasLiveData ? `${maxRisk}%` : '--'}
              </div>
              <span style={{ fontSize: '0.78rem', color: '#9CA3AF', fontFamily: 'var(--font-sans)' }}>
                Maximum momentary fatigue recorded in window
              </span>
            </div>

            {/* Card 3: Synchronized Samples */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(23, 23, 23, 0.1)',
                borderRadius: '16px',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '160px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
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
                    borderRadius: '9999px',
                    backgroundColor: isEngineConnected ? '#ECFDF5' : '#F3EFEA',
                    color: isEngineConnected ? '#2E7D32' : '#9CA3AF',
                    fontWeight: 600,
                  }}
                >
                  {isEngineConnected ? 'ONLINE' : 'OFFLINE'}
                </span>
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '3.6rem',
                  fontWeight: 400,
                  lineHeight: 1,
                  color: 'var(--text-primary)',
                  margin: '0.4rem 0',
                }}
              >
                {telemetryHistory.length}
                <span style={{ fontSize: '1.25rem', fontFamily: 'var(--font-mono)', color: '#9CA3AF', fontWeight: 400 }}>
                  {' '}/ 400 PTS
                </span>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#9CA3AF', fontFamily: 'var(--font-sans)' }}>
                Rolling time window (~13s @ 30 FPS edge ingestion)
              </span>
            </div>
          </div>

          {/* Cinematic Dark SVG Waveform Chart Frame */}
          <div
            style={{
              backgroundColor: '#111214',
              borderRadius: '16px',
              padding: 'clamp(1.5rem, 3vw, 2.25rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
              color: '#FFFFFF',
              position: 'relative',
              overflow: 'hidden',
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
                    color: 'rgba(255, 255, 255, 0.5)',
                    textTransform: 'uppercase',
                  }}
                >
                  TEMPORAL INGESTION CURVE
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.5rem',
                    fontWeight: 400,
                    color: '#FFFFFF',
                    margin: '0.2rem 0 0 0',
                  }}
                >
                  Real-Time Risk Amplitude Over Time
                </h3>
              </div>

              <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-mono)',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(220, 38, 38, 0.2)',
                    color: '#F87171',
                    border: '1px solid rgba(220, 38, 38, 0.4)',
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
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: 'rgba(255, 255, 255, 0.6)',
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
                borderRadius: '8px',
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
                      <stop offset="0%" stopColor="#2E7D32" />
                      <stop offset="60%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#DC2626" />
                    </linearGradient>
                    <linearGradient id="vantageAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#DC2626" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#DC2626" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Threshold Guidelines */}
                  <line x1="0" y1="60" x2="800" y2="60" stroke="#DC2626" strokeDasharray="3 3" strokeWidth="1" strokeOpacity="0.6" />
                  <line x1="0" y1="130" x2="800" y2="130" stroke="#D97706" strokeDasharray="3 3" strokeWidth="1" strokeOpacity="0.45" />
                  <line x1="0" y1="190" x2="800" y2="190" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />

                  <text x="14" y="54" fill="#F87171" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">
                    CRITICAL (70%)
                  </text>
                  <text x="14" y="124" fill="#FBBF24" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">
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
                <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.5)', padding: '2rem' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.75rem auto',
                    }}
                  >
                    <BarChart3 size={20} color="#F87171" />
                  </div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#FFFFFF' }}>
                    No live telemetry buffer recorded yet
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: '0.35rem', fontFamily: 'var(--font-mono)' }}>
                    Start Live Monitoring or trigger Diagnostic tests to visualize real-time waveform.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Real-Time Biometric Diagnostics Strip */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '1rem',
            }}
          >
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(23, 23, 23, 0.1)',
                borderRadius: '12px',
                padding: '1.35rem',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
              }}
            >
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Eye Aspect Ratio (EAR)
              </span>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 400, color: 'var(--text-primary)', margin: '0.2rem 0' }}>
                {latestTelemetry && typeof latestTelemetry.ear === 'number' ? latestTelemetry.ear.toFixed(2) : '--'}
              </div>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#9CA3AF' }}>Nominal baseline: &gt; 0.22</span>
            </div>

            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(23, 23, 23, 0.1)',
                borderRadius: '12px',
                padding: '1.35rem',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
              }}
            >
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Mouth Aspect Ratio (MAR)
              </span>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 400, color: 'var(--text-primary)', margin: '0.2rem 0' }}>
                {latestTelemetry && typeof latestTelemetry.mar === 'number' ? latestTelemetry.mar.toFixed(2) : '--'}
              </div>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#9CA3AF' }}>Yawn threshold: &gt; 0.55</span>
            </div>

            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(23, 23, 23, 0.1)',
                borderRadius: '12px',
                padding: '1.35rem',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
              }}
            >
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Cranial Pitch
              </span>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 400, color: 'var(--text-primary)', margin: '0.2rem 0' }}>
                {latestTelemetry && typeof latestTelemetry.headPitch === 'number'
                  ? `${latestTelemetry.headPitch.toFixed(1)}°`
                  : '--'}
              </div>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#9CA3AF' }}>Head-down trigger: &lt; -10°</span>
            </div>

            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(23, 23, 23, 0.1)',
                borderRadius: '12px',
                padding: '1.35rem',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
              }}
            >
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                PERCLOS Index
              </span>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 400, color: 'var(--text-primary)', margin: '0.2rem 0' }}>
                {latestTelemetry && typeof latestTelemetry.perclos === 'number'
                  ? `${latestTelemetry.perclos.toFixed(1)}%`
                  : '--'}
              </div>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#9CA3AF' }}>Fatigue warning: &gt; 15%</span>
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
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 1.15rem',
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(23, 23, 23, 0.15)',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-sans)',
                fontWeight: 500,
                color: 'var(--text-primary)',
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
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(23, 23, 23, 0.1)',
                borderRadius: '16px',
                padding: '3.5rem 2rem',
                textAlign: 'center',
                color: 'var(--text-secondary)',
              }}
            >
              <RefreshCw size={24} className="animate-spin" style={{ display: 'inline-block', marginBottom: '0.75rem', color: '#DC2626' }} />
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                Accessing SQLite Session Audit Ledger...
              </div>
            </div>
          )}

          {/* Backend Unavailable Error State */}
          {!isLoadingHistory && historyError && (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #DC2626',
                borderRadius: '16px',
                padding: '2.5rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.85rem',
              }}
            >
              <AlertTriangle size={32} color="#DC2626" />
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0 }}>
                Audit Ledger Unavailable
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '500px', margin: 0 }}>
                Could not connect to backend database ({historyError}). Ensure the FastAPI server is running on port 8000.
              </p>
              <button
                onClick={fetchHistoricalTrips}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.55rem 1.4rem',
                  backgroundColor: '#171717',
                  color: '#FFFFFF',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.82rem',
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
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(23, 23, 23, 0.1)',
                borderRadius: '16px',
                padding: '3.5rem 2rem',
                textAlign: 'center',
                color: 'var(--text-secondary)',
              }}
            >
              <Award size={32} style={{ opacity: 0.4, marginBottom: '0.75rem', display: 'inline-block', color: '#9CA3AF' }} />
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0 }}>
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
              {/* Four Summary Cards */}
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
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(23, 23, 23, 0.1)',
                    borderRadius: '16px',
                    padding: '1.75rem',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                    }}
                  >
                    Mean Safety Score
                  </span>
                  <div
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '3.6rem',
                      fontWeight: 400,
                      lineHeight: 1,
                      color: 'var(--text-primary)',
                      margin: '0.4rem 0',
                    }}
                  >
                    {averageHistoricalSafetyScore}%
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#9CA3AF', fontFamily: 'var(--font-sans)' }}>
                    Algorithmic heuristic across {validTrips.length} sessions
                  </span>
                </div>

                {/* Card 2: Cumulative Monitored Time */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(23, 23, 23, 0.1)',
                    borderRadius: '16px',
                    padding: '1.75rem',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                    }}
                  >
                    Cumulative Monitored Time
                  </span>
                  <div
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '3.6rem',
                      fontWeight: 400,
                      lineHeight: 1,
                      color: 'var(--text-primary)',
                      margin: '0.4rem 0',
                    }}
                  >
                    {formatSecondsToDuration(cumulativeDurationSecs)}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#9CA3AF', fontFamily: 'var(--font-sans)' }}>
                    Active driving across {trips.length} records
                  </span>
                </div>

                {/* Card 3: Recorded Safety Incidents */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(23, 23, 23, 0.1)',
                    borderRadius: '16px',
                    padding: '1.75rem',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                    }}
                  >
                    Recorded Incidents
                  </span>
                  <div
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '3.6rem',
                      fontWeight: 400,
                      lineHeight: 1,
                      color: totalIncidentsCount > 0 ? '#DC2626' : '#2E7D32',
                      margin: '0.4rem 0',
                    }}
                  >
                    {totalIncidentsCount}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#9CA3AF', fontFamily: 'var(--font-sans)' }}>
                    Drowsiness, distraction &amp; deviation events
                  </span>
                </div>

                {/* Card 4: Optimal Session Ratio */}
                <div
                  style={{
                    backgroundColor: '#0E1311',
                    color: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '1.75rem',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      color: '#A7F3D0',
                      textTransform: 'uppercase',
                    }}
                  >
                    Optimal Session Ratio
                  </span>
                  <div
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '3.6rem',
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
                  <span style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'var(--font-sans)' }}>
                    {gradeDistribution.A.count} of {trips.length} sessions rated Grade A
                  </span>
                </div>
              </div>

              {/* Chronological Safety-Score Trend Chart (SVG) */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(23, 23, 23, 0.1)',
                  borderRadius: '16px',
                  padding: 'clamp(1.5rem, 3vw, 2.25rem)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
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
                        color: 'var(--text-secondary)',
                        textTransform: 'uppercase',
                      }}
                    >
                      CHRONOLOGICAL SAFETY TRAJECTORY
                    </span>
                    <h3
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.5rem',
                        fontWeight: 400,
                        color: 'var(--text-primary)',
                        margin: '0.2rem 0 0 0',
                      }}
                    >
                      Session-by-Session Compliance Progression
                    </h3>
                  </div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      fontFamily: 'var(--font-mono)',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '9999px',
                      backgroundColor: '#F3EFEA',
                      color: 'var(--text-secondary)',
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
                    backgroundColor: '#FDFBF7',
                    borderRadius: '8px',
                    position: 'relative',
                    border: '1px solid rgba(23, 23, 23, 0.08)',
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
                    <line x1="50" y1="56" x2="780" y2="56" stroke="#2E7D32" strokeDasharray="3 3" strokeWidth="1" strokeOpacity="0.5" />
                    <line x1="50" y1="95" x2="780" y2="95" stroke="rgba(23, 23, 23, 0.15)" strokeDasharray="3 3" strokeWidth="1" />
                    <line x1="50" y1="135" x2="780" y2="135" stroke="#DC2626" strokeDasharray="3 3" strokeWidth="1" strokeOpacity="0.4" />

                    <text x="14" y="60" fill="#2E7D32" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">90% A</text>
                    <text x="14" y="99" fill="var(--text-secondary)" fontSize="10" fontFamily="var(--font-mono)">75% B</text>
                    <text x="14" y="139" fill="#DC2626" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">60% C</text>

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
                            stroke="#171717"
                            strokeWidth="2.2"
                            points={pointsStr}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          {coords.map((c, i) => {
                            const isSelected = selectedTripIndex === i;
                            const pointColor =
                              c.trip.safetyScore >= 85
                                ? '#2E7D32'
                                : c.trip.safetyScore >= 70
                                ? '#171717'
                                : '#DC2626';

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
                                    fill="#171717"
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

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#9CA3AF' }}>
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
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(23, 23, 23, 0.1)',
                    borderRadius: '16px',
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.12em', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                      TAXONOMY BREAKDOWN
                    </span>
                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--text-primary)', margin: '0.2rem 0 0 0' }}>
                      Safety Violations by Category
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

                            <div
                              style={{
                                width: '100%',
                                height: '6px',
                                backgroundColor: '#F3EFEA',
                                borderRadius: '3px',
                                overflow: 'hidden',
                              }}
                            >
                              <div
                                style={{
                                  width: `${pct}%`,
                                  height: '100%',
                                  backgroundColor: cat.color,
                                  borderRadius: '3px',
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
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(23, 23, 23, 0.1)',
                    borderRadius: '16px',
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.12em', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                      FLEET COMPLIANCE
                    </span>
                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--text-primary)', margin: '0.2rem 0 0 0' }}>
                      Session Safety Grade Spread
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

                          <div
                            style={{
                              width: '100%',
                              height: '6px',
                              backgroundColor: '#F3EFEA',
                              borderRadius: '3px',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width: `${pct}%`,
                                height: '100%',
                                backgroundColor: item.color,
                                borderRadius: '3px',
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
                  backgroundColor: '#FDFBF7',
                  border: '1px solid rgba(23, 23, 23, 0.08)',
                  borderRadius: '12px',
                  padding: '1.25rem 1.5rem',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
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