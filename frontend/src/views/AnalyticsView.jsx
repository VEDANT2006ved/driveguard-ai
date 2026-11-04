import React, { useState, useEffect } from 'react';
import { BarChart3, AlertTriangle, RefreshCw, Award, Activity, TrendingUp, ShieldCheck, Lock, Terminal } from 'lucide-react';
import { API_BASE_URL, getApiBaseUrl } from '../config/api';

/**
 * Parses duration strings into total seconds.
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
 * Formats total seconds into human-readable duration.
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
 * Categorizes incident types based on backend reason taxonomy.
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
 * AnalyticsView Component — Minimalist Swiss Editorial Edition
 * References: Images 2 (Aura store), 3 (Minimal-ist), 4 (lab. 001)
 * Clean high-contrast telemetry curves, typography hierarchy, and SQLite session metrics.
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

  // Live telemetry metrics
  const hasLiveData = Array.isArray(telemetryHistory) && telemetryHistory.length > 0;
  const averageRisk = hasLiveData
    ? Math.round(
        telemetryHistory.reduce((acc, curr) => acc + (typeof curr.riskScore === 'number' ? curr.riskScore : 0), 0) /
          Math.max(1, telemetryHistory.length)
      )
    : 0;

  const maxRisk = hasLiveData
    ? Math.max(...telemetryHistory.map((d) => (typeof d.riskScore === 'number' ? d.riskScore : 0)))
    : 0;

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: 'var(--bg-primary)',
        padding: 'clamp(1.5rem, 3.5vw, 3rem) clamp(1rem, 3vw, 2.5rem)',
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem',
      }}
    >
      {/* Masthead */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              fontFamily: "var(--font-mono, monospace)",
              fontSize: '0.72rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
              marginBottom: '0.5rem',
            }}
          >
            <span className="techwear-tag">ANALYTICS // 03</span>
            <span>•</span>
            <span>TEMPORAL SAFETY WAVEFORM</span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
              fontSize: 'clamp(2rem, 3.8vw, 3.2rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
              margin: '0 0 0.4rem 0',
              lineHeight: 1.1,
            }}
          >
            Telemetry &amp; Risk Analytics
          </h1>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            High-precision temporal telemetry curves and historical driver compliance archives.
          </p>
        </div>

        {/* Mode Switcher: Live Session vs. Historical Vault */}
        <div
          style={{
            display: 'inline-flex',
            border: '1px solid var(--border-light)',
            borderRadius: '2px',
            padding: '3px',
            backgroundColor: 'var(--bg-secondary)',
          }}
        >
          <button
            onClick={() => setActiveMode('live')}
            style={{
              padding: '0.45rem 1rem',
              border: 'none',
              borderRadius: '2px',
              fontFamily: "var(--font-mono, monospace)",
              fontSize: '0.74rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: activeMode === 'live' ? 'var(--text-primary)' : 'transparent',
              color: activeMode === 'live' ? 'var(--bg-primary)' : 'var(--text-secondary)',
              transition: 'all 0.15s ease',
            }}
          >
            Live Waveform
          </button>
          <button
            onClick={() => setActiveMode('historical')}
            style={{
              padding: '0.45rem 1rem',
              border: 'none',
              borderRadius: '2px',
              fontFamily: "var(--font-mono, monospace)",
              fontSize: '0.74rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: activeMode === 'historical' ? 'var(--text-primary)' : 'transparent',
              color: activeMode === 'historical' ? 'var(--bg-primary)' : 'var(--text-secondary)',
              transition: 'all 0.15s ease',
            }}
          >
            Historical Vault ({trips.length})
          </button>
        </div>
      </div>

      {/* Mode 1: Live Waveform */}
      {activeMode === 'live' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* KPI Summary Strip */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {/* Average Risk */}
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-light)',
                borderRadius: '4px',
                padding: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  METRIC // AVERAGE RISK
                </span>
                <span className="techwear-tag">TARGET &lt; 25%</span>
              </div>
              <div style={{ fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)", fontSize: '2.5rem', fontWeight: 700, lineHeight: 1 }}>
                {hasLiveData ? `${averageRisk}%` : '--'}
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'block' }}>
                Rolling mean across active monitoring buffer
              </span>
            </div>

            {/* Peak Risk */}
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-light)',
                borderRadius: '4px',
                padding: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  METRIC // PEAK RISK
                </span>
                <span
                  className="techwear-tag"
                  style={{
                    color: maxRisk > 65 ? 'var(--accent-crimson)' : 'var(--accent-emerald)',
                    borderColor: maxRisk > 65 ? 'var(--accent-crimson)' : 'var(--accent-emerald)',
                  }}
                >
                  {maxRisk > 65 ? 'HIGH FATIGUE' : 'CONTROLLED'}
                </span>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  lineHeight: 1,
                  color: maxRisk > 65 ? 'var(--accent-crimson)' : 'var(--text-primary)',
                }}
              >
                {hasLiveData ? `${maxRisk}%` : '--'}
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'block' }}>
                Maximum momentary fatigue recorded in window
              </span>
            </div>

            {/* Samples */}
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-light)',
                borderRadius: '4px',
                padding: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  METRIC // SAMPLES
                </span>
                <span className="techwear-tag">
                  {isEngineConnected ? 'ONLINE' : 'OFFLINE'}
                </span>
              </div>
              <div style={{ fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)", fontSize: '2.5rem', fontWeight: 700, lineHeight: 1 }}>
                {telemetryHistory.length}
                <span style={{ fontSize: '1rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontWeight: 400 }}>
                  {' '}/ 400 PTS
                </span>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'block' }}>
                Rolling time window (~13s @ 30 FPS ingestion)
              </span>
            </div>
          </div>

          {/* SVG Waveform Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-light)',
              borderRadius: '4px',
              padding: '1.75rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  TEMPORAL INGESTION CURVE
                </span>
                <h3 style={{ fontSize: '1.25rem', margin: '0.2rem 0 0 0' }}>
                  Real-Time Risk Amplitude Over Time
                </h3>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span className="techwear-tag" style={{ color: 'var(--accent-crimson)', borderColor: 'var(--accent-crimson)' }}>
                  CRITICAL: 70%
                </span>
                <span className="techwear-tag">
                  BUFFER: {telemetryHistory.length} SAMPLES
                </span>
              </div>
            </div>

            {/* SVG Visualizer Canvas */}
            <div
              style={{
                width: '100%',
                height: '240px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '2px',
                border: '1px solid var(--border-light)',
                overflow: 'hidden',
                position: 'relative',
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
                    <linearGradient id="editorialWaveGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="50%" stopColor="#D97706" />
                      <stop offset="100%" stopColor="#EF4444" />
                    </linearGradient>
                    <linearGradient id="editorialAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#111111" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#111111" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Threshold Guidelines */}
                  <line x1="0" y1="60" x2="800" y2="60" stroke="#EF4444" strokeDasharray="3 3" strokeWidth="1" strokeOpacity="0.6" />
                  <line x1="0" y1="130" x2="800" y2="130" stroke="#D97706" strokeDasharray="3 3" strokeWidth="1" strokeOpacity="0.5" />
                  <line x1="0" y1="190" x2="800" y2="190" stroke="rgba(17, 17, 17, 0.15)" strokeWidth="1" />

                  <text x="14" y="54" fill="#EF4444" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">
                    CRITICAL (70%)
                  </text>
                  <text x="14" y="124" fill="#D97706" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">
                    WARNING (35%)
                  </text>
                  <text x="14" y="184" fill="#777777" fontSize="10" fontFamily="var(--font-mono)">
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
                        <polygon fill="url(#editorialAreaGradient)" points={areaPoints} />
                        <polyline
                          fill="none"
                          stroke="url(#editorialWaveGradient)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={points}
                        />
                      </>
                    );
                  })()}
                </svg>
              ) : (
                <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                  AWAITING LIVE TELEMETRY SAMPLES...
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Historical Vault */}
      {activeMode === 'historical' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              PERSISTENT FLIGHT LEDGER ({trips.length} RECORDED SESSIONS)
            </span>
            <button
              onClick={fetchHistoricalTrips}
              className="btn-editorial-outline"
              style={{ fontSize: '0.72rem', padding: '0.35rem 0.75rem' }}
            >
              <RefreshCw size={12} />
              <span>SYNC VAULT</span>
            </button>
          </div>

          {trips.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: '4px', color: 'var(--text-secondary)' }}>
              No recorded sessions found in local SQLite database. Complete a driving session in Live Cockpit to log trips.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {trips.map((trip, idx) => (
                <div
                  key={trip.id || idx}
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '2px',
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      SESSION #{trip.id || idx + 1} • {trip.date || 'RECENT'}
                    </div>
                    <div style={{ fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)", fontSize: '1.15rem', fontWeight: 700, marginTop: '0.2rem' }}>
                      {trip.duration || 'Session'} • {trip.incident_count || 0} Incidents Flagged
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.68rem', color: 'var(--text-muted)' }}>SAFETY SCORE</div>
                      <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '1.1rem', fontWeight: 700, color: (trip.safety_score || 100) >= 80 ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
                        {trip.safety_score || 100}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
