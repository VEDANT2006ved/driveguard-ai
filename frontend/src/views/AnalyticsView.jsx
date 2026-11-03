import React, { useState, useEffect } from 'react';
import { BarChart3, AlertTriangle, RefreshCw, Award, Activity, TrendingUp, ShieldCheck, Lock, Terminal } from 'lucide-react';
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
 * Formats total seconds into human-readable duration matching SSTR engineering standards.
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
 * High-End Industrial Fleet Compliance & Telemetry Waveform
 * Primary Reference: SSTR (https://sstr.tech/en/) — Awwwards Site of the Day (SOTD) & Developer Award
 * Strict modular carbon grid, SSTR Electric Safety Orange (#FE5B2A), precision laser raster scans,
 * and high-contrast telemetry dials.
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
    lateral: { label: 'Lateral Head Deviation', count: 0, color: '#38BDF8' },
    eye_closure: { label: 'Prolonged Eye Closure', count: 0, color: '#EF4444' },
    head_down: { label: 'Head-Down Distraction', count: 0, color: '#FE5B2A' },
    yawn: { label: 'Sustained Yawning', count: 0, color: '#F59E0B' },
    head_up: { label: 'Head-Up Vertical Shift', count: 0, color: '#9FA4B0' },
    other: { label: 'Other Detected Anomalies', count: 0, color: '#5F6470' },
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
    B: { label: 'Grade B / B+ / B- (Caution)', count: 0, color: '#FE5B2A' },
    C: { label: 'Grade C (Elevated Risk)', count: 0, color: '#F59E0B' },
    F: { label: 'Grade F (Critical Hazard)', count: 0, color: '#EF4444' },
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
    <div className="sstr-analytics-wrapper sstr-grid-bg">
      {/* View Header with Mode Selector Toggle */}
      <div className="sstr-analytics-masthead">
        <div>
          <div className="sstr-analytics-meta">
            <span className="sstr-tag">SECTION 03 // TELEMETRY & AUDIT VAULT</span>
            <span className="sstr-meta-divider">|</span>
            <span className="sstr-meta-item">ROLLING EDGE BUFFER</span>
          </div>

          <h1 className="sstr-analytics-title">
            {activeMode === 'live' ? 'ATTENTIVENESS WAVEFORM' : 'SAFETY COMPLIANCE VAULT'}
            <span style={{ color: '#FE5B2A' }}>.</span>
          </h1>

          <p className="sstr-analytics-subtitle">
            {activeMode === 'live'
              ? 'Real-time temporal risk amplitude, palpebral tracking, and cranial kinematics streaming directly from edge inference.'
              : 'Cumulative compliance analytics compiled from verified driving sessions persistently stored in SQLite.'}
          </p>
        </div>

        {/* Minimalist Tactile Segmented Toggle */}
        <div className="sstr-mode-toggle">
          <button
            onClick={() => setActiveMode('live')}
            className={`sstr-toggle-btn ${activeMode === 'live' ? 'active' : ''}`}
          >
            Live Waveform
          </button>

          <button
            onClick={() => setActiveMode('historical')}
            className={`sstr-toggle-btn ${activeMode === 'historical' ? 'active' : ''}`}
          >
            Historical Vault ({trips.length})
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MODE 1: LIVE SESSION WAVEFORM                                         */}
      {/* ===================================================================== */}
      {activeMode === 'live' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* Live Summary Metric Cards */}
          <div className="sstr-kpi-grid">
            {/* Card 1: Average Session Risk */}
            <div className="sstr-card sstr-reticle">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="sstr-card-num">METRIC // AVERAGE RISK</span>
                <span className="sstr-kpi-badge">TARGET &lt; 25%</span>
              </div>
              <div className="sstr-kpi-val">
                {hasLiveData ? `${averageRisk}%` : '--'}
              </div>
              <span className="sstr-kpi-lbl">Rolling mean across active monitoring buffer</span>
            </div>

            {/* Card 2: Peak Transient Risk */}
            <div className="sstr-card sstr-reticle">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="sstr-card-num">METRIC // PEAK RISK</span>
                <span
                  className="sstr-kpi-badge"
                  style={{
                    color: maxRisk > 65 ? '#EF4444' : '#10B981',
                    borderColor: maxRisk > 65 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)',
                  }}
                >
                  {maxRisk > 65 ? 'HIGH FATIGUE' : 'CONTROLLED'}
                </span>
              </div>
              <div
                className="sstr-kpi-val"
                style={{ color: maxRisk > 65 ? '#EF4444' : '#FFFFFF' }}
              >
                {hasLiveData ? `${maxRisk}%` : '--'}
              </div>
              <span className="sstr-kpi-lbl">Maximum momentary fatigue recorded in window</span>
            </div>

            {/* Card 3: Synchronized Samples */}
            <div className="sstr-card sstr-reticle">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="sstr-card-num">METRIC // SAMPLES</span>
                <span
                  className="sstr-kpi-badge"
                  style={{
                    color: isEngineConnected ? '#10B981' : '#5F6470',
                    borderColor: isEngineConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {isEngineConnected ? 'ONLINE' : 'OFFLINE'}
                </span>
              </div>
              <div className="sstr-kpi-val">
                {telemetryHistory.length}
                <span style={{ fontSize: '1.25rem', fontFamily: 'var(--font-mono)', color: '#5F6470', fontWeight: 400 }}>
                  {' '}/ 400 PTS
                </span>
              </div>
              <span className="sstr-kpi-lbl">Rolling time window (~13s @ 30 FPS ingestion)</span>
            </div>
          </div>

          {/* Cinematic Dark SVG Waveform Chart Frame */}
          <div className="sstr-waveform-card sstr-reticle">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <span className="sstr-card-num">TEMPORAL INGESTION CURVE</span>
                <h3 className="sstr-waveform-title">Real-Time Risk Amplitude Over Time</h3>
              </div>

              <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <span className="sstr-wave-tag" style={{ color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.35)' }}>
                  CRITICAL: 70%
                </span>
                <span className="sstr-wave-tag">
                  BUFFER: {telemetryHistory.length} SAMPLES
                </span>
              </div>
            </div>

            {/* SVG Waveform Visualizer Canvas */}
            <div className="sstr-svg-canvas-box">
              {hasLiveData ? (
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 800 240"
                  preserveAspectRatio="none"
                  style={{ display: 'block' }}
                >
                  <defs>
                    <linearGradient id="sstrWaveformGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="50%" stopColor="#FE5B2A" />
                      <stop offset="100%" stopColor="#EF4444" />
                    </linearGradient>
                    <linearGradient id="sstrAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FE5B2A" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#FE5B2A" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Threshold Guidelines */}
                  <line x1="0" y1="60" x2="800" y2="60" stroke="#EF4444" strokeDasharray="3 3" strokeWidth="1" strokeOpacity="0.6" />
                  <line x1="0" y1="130" x2="800" y2="130" stroke="#FE5B2A" strokeDasharray="3 3" strokeWidth="1" strokeOpacity="0.45" />
                  <line x1="0" y1="190" x2="800" y2="190" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />

                  <text x="14" y="54" fill="#EF4444" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">
                    CRITICAL (70%)
                  </text>
                  <text x="14" y="124" fill="#FE5B2A" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">
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
                          fill="url(#sstrAreaGradient)"
                          points={areaPoints}
                        />
                        <polyline
                          fill="none"
                          stroke="url(#sstrWaveformGradient)"
                          strokeWidth="2.5"
                          points={points}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </>
                    );
                  })()}
                </svg>
              ) : (
                <div style={{ textAlign: 'center', color: '#5F6470', padding: '2rem' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.75rem auto',
                    }}
                  >
                    <BarChart3 size={20} color="#FE5B2A" />
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#FFFFFF', fontWeight: 700 }}>
                    NO LIVE TELEMETRY BUFFER RECORDED YET
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#9FA4B0', marginTop: '0.35rem', fontFamily: 'var(--font-mono)' }}>
                    Start Live Monitoring or trigger Diagnostic tests to visualize real-time waveform.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Real-Time Biometric Diagnostics Strip */}
          <div className="sstr-biometrics-strip">
            <div className="sstr-card">
              <span className="sstr-card-num">EYE ASPECT RATIO (EAR)</span>
              <div className="sstr-bio-val">
                {latestTelemetry && typeof latestTelemetry.ear === 'number' ? latestTelemetry.ear.toFixed(2) : '--'}
              </div>
              <span className="sstr-bio-lbl">Baseline: &gt; 0.22</span>
            </div>

            <div className="sstr-card">
              <span className="sstr-card-num">MOUTH ASPECT RATIO (MAR)</span>
              <div className="sstr-bio-val">
                {latestTelemetry && typeof latestTelemetry.mar === 'number' ? latestTelemetry.mar.toFixed(2) : '--'}
              </div>
              <span className="sstr-bio-lbl">Yawn trigger: &gt; 0.55</span>
            </div>

            <div className="sstr-card">
              <span className="sstr-card-num">CRANIAL PITCH</span>
              <div className="sstr-bio-val">
                {latestTelemetry && typeof latestTelemetry.headPitch === 'number'
                  ? `${latestTelemetry.headPitch.toFixed(1)}°`
                  : '--'}
              </div>
              <span className="sstr-bio-lbl">Downturn limit: &lt; -10°</span>
            </div>

            <div className="sstr-card">
              <span className="sstr-card-num">PERCLOS INDEX</span>
              <div className="sstr-bio-val">
                {latestTelemetry && typeof latestTelemetry.perclos === 'number'
                  ? `${latestTelemetry.perclos.toFixed(1)}%`
                  : '--'}
              </div>
              <span className="sstr-bio-lbl">Fatigue warning: &gt; 15%</span>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODE 2: HISTORICAL AUDIT VAULT                                        */}
      {/* ===================================================================== */}
      {activeMode === 'historical' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* Header Status & Sync Button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="sstr-tag">
              SQLITE DATABASE AUDIT LEDGER • {trips.length} PERSISTED SESSIONS
            </span>

            <button
              onClick={fetchHistoricalTrips}
              disabled={isLoadingHistory}
              className="sstr-btn-secondary"
              style={{ padding: '0.45rem 1rem' }}
            >
              <RefreshCw size={12} className={isLoadingHistory ? 'animate-spin' : ''} />
              <span>{isLoadingHistory ? 'SYNCING...' : 'SYNC VAULT'}</span>
            </button>
          </div>

          {/* Loading State */}
          {isLoadingHistory && (
            <div className="sstr-card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
              <RefreshCw size={24} className="animate-spin" style={{ display: 'inline-block', marginBottom: '0.75rem', color: '#FE5B2A' }} />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#FFFFFF', fontWeight: 700 }}>
                ACCESSING SQLITE SESSION AUDIT LEDGER...
              </div>
            </div>
          )}

          {/* Backend Unavailable Error State */}
          {!isLoadingHistory && historyError && (
            <div className="sstr-card" style={{ borderColor: '#EF4444', padding: '2.5rem', textAlign: 'center', alignItems: 'center' }}>
              <AlertTriangle size={32} color="#EF4444" />
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: '#FFFFFF', margin: '0.5rem 0' }}>
                AUDIT LEDGER UNAVAILABLE
              </h4>
              <p style={{ fontSize: '0.88rem', color: '#9FA4B0', maxWidth: '500px', margin: 0 }}>
                Could not connect to backend database ({historyError}). Ensure the FastAPI server is running on port 8000.
              </p>
              <button
                onClick={fetchHistoricalTrips}
                className="sstr-btn"
                style={{ marginTop: '1rem' }}
              >
                RETRY CONNECTION
              </button>
            </div>
          )}

          {/* Empty Historical State */}
          {!isLoadingHistory && !historyError && !hasHistoryData && (
            <div className="sstr-card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
              <Award size={32} style={{ opacity: 0.4, marginBottom: '0.75rem', display: 'inline-block', color: '#5F6470' }} />
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: '#FFFFFF', margin: 0 }}>
                NO HISTORICAL SESSIONS FOUND
              </h4>
              <p style={{ fontSize: '0.88rem', color: '#9FA4B0', maxWidth: '500px', margin: '0.5rem auto 0' }}>
                No completed driving sessions have been committed to SQLite yet. Sessions longer than 5 seconds are saved automatically when monitoring stops.
              </p>
            </div>
          )}

          {/* Historical Data View */}
          {!isLoadingHistory && !historyError && hasHistoryData && (
            <>
              {/* Four Summary Cards */}
              <div className="sstr-kpi-grid">
                {/* Card 1: Mean Recorded Safety Score */}
                <div className="sstr-card sstr-reticle">
                  <span className="sstr-card-num">METRIC // MEAN SAFETY</span>
                  <div className="sstr-kpi-val">{averageHistoricalSafetyScore}%</div>
                  <span className="sstr-kpi-lbl">Algorithmic heuristic across {validTrips.length} sessions</span>
                </div>

                {/* Card 2: Cumulative Monitored Time */}
                <div className="sstr-card sstr-reticle">
                  <span className="sstr-card-num">METRIC // OPERATING TIME</span>
                  <div className="sstr-kpi-val">{formatSecondsToDuration(cumulativeDurationSecs)}</div>
                  <span className="sstr-kpi-lbl">Active driving across {trips.length} records</span>
                </div>

                {/* Card 3: Recorded Safety Incidents */}
                <div className="sstr-card sstr-reticle">
                  <span className="sstr-card-num">METRIC // INCIDENTS</span>
                  <div className="sstr-kpi-val" style={{ color: totalIncidentsCount > 0 ? '#EF4444' : '#10B981' }}>
                    {totalIncidentsCount}
                  </div>
                  <span className="sstr-kpi-lbl">Drowsiness, distraction &amp; deviation events</span>
                </div>

                {/* Card 4: Optimal Session Ratio */}
                <div className="sstr-card sstr-reticle" style={{ borderColor: 'rgba(254, 91, 42, 0.4)' }}>
                  <span className="sstr-card-num">METRIC // OPTIMAL RATIO</span>
                  <div className="sstr-kpi-val" style={{ color: '#FE5B2A' }}>
                    {trips.length > 0
                      ? `${Math.round((gradeDistribution.A.count / trips.length) * 100)}%`
                      : '0%'}
                  </div>
                  <span className="sstr-kpi-lbl">
                    {gradeDistribution.A.count} of {trips.length} sessions rated Grade A
                  </span>
                </div>
              </div>

              {/* Chronological Safety-Score Trend Chart (SVG) */}
              <div className="sstr-waveform-card sstr-reticle">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <span className="sstr-card-num">CHRONOLOGICAL SAFETY TRAJECTORY</span>
                    <h3 className="sstr-waveform-title">Session-by-Session Compliance Progression</h3>
                  </div>
                  <div className="sstr-wave-tag">
                    OLDEST (LEFT) → NEWEST (RIGHT)
                  </div>
                </div>

                {/* SVG Trend Chart Canvas */}
                <div className="sstr-svg-canvas-box">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 800 240"
                    preserveAspectRatio="none"
                    style={{ display: 'block' }}
                  >
                    {/* Horizontal Guidelines */}
                    <line x1="50" y1="56" x2="780" y2="56" stroke="#10B981" strokeDasharray="3 3" strokeWidth="1" strokeOpacity="0.5" />
                    <line x1="50" y1="95" x2="780" y2="95" stroke="rgba(255, 255, 255, 0.12)" strokeDasharray="3 3" strokeWidth="1" />
                    <line x1="50" y1="135" x2="780" y2="135" stroke="#EF4444" strokeDasharray="3 3" strokeWidth="1" strokeOpacity="0.4" />

                    <text x="14" y="60" fill="#10B981" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">90% A</text>
                    <text x="14" y="99" fill="#9FA4B0" fontSize="10" fontFamily="var(--font-mono)">75% B</text>
                    <text x="14" y="139" fill="#EF4444" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">60% C</text>

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
                            stroke="#FE5B2A"
                            strokeWidth="2.4"
                            points={pointsStr}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          {coords.map((c, i) => {
                            const isSelected = selectedTripIndex === i;
                            const pointColor =
                              c.trip.safetyScore >= 85
                                ? '#10B981'
                                : c.trip.safetyScore >= 70
                                ? '#FE5B2A'
                                : '#EF4444';

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
                                    fill="#FFFFFF"
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

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#5F6470' }}>
                  <span>Click any plot node to inspect session score details.</span>
                  <span className="font-mono">{chronologicalTrips.length} AUDIT SESSIONS LOGGED</span>
                </div>
              </div>

              {/* Two Column Detailed Breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {/* Column 1: Incident Category Breakdown */}
                <div className="sstr-card sstr-reticle">
                  <div>
                    <span className="sstr-card-num">TAXONOMY BREAKDOWN</span>
                    <h4 className="sstr-card-title" style={{ fontSize: '1.25rem', marginTop: '0.25rem' }}>
                      Safety Violations by Category
                    </h4>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                    {Object.entries(incidentCategories)
                      .filter(([_, cat]) => cat.count > 0 || totalIncidentsCount === 0)
                      .map(([key, cat]) => {
                        const pct = totalIncidentsCount > 0 ? Math.round((cat.count / totalIncidentsCount) * 100) : 0;

                        return (
                          <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                              <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{cat.label}</span>
                              <span className="font-mono" style={{ color: '#FE5B2A', fontSize: '0.75rem' }}>
                                {cat.count} ({pct}%)
                              </span>
                            </div>

                            <div className="sstr-progress-track">
                              <div
                                className="sstr-progress-fill"
                                style={{
                                  width: `${pct}%`,
                                  backgroundColor: cat.color,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Column 2: Safety Grade Distribution */}
                <div className="sstr-card sstr-reticle">
                  <div>
                    <span className="sstr-card-num">FLEET COMPLIANCE</span>
                    <h4 className="sstr-card-title" style={{ fontSize: '1.25rem', marginTop: '0.25rem' }}>
                      Session Safety Grade Spread
                    </h4>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                    {Object.entries(gradeDistribution).map(([gradeKey, item]) => {
                      const pct = trips.length > 0 ? Math.round((item.count / trips.length) * 100) : 0;

                      return (
                        <div key={gradeKey} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                            <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{item.label}</span>
                            <span className="font-mono" style={{ color: '#9FA4B0', fontSize: '0.75rem' }}>
                              {item.count} sessions ({pct}%)
                            </span>
                          </div>

                          <div className="sstr-progress-track">
                            <div
                              className="sstr-progress-fill"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: item.color,
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
                  backgroundColor: '#141518',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '6px',
                  padding: '1.25rem 1.5rem',
                  fontSize: '0.8rem',
                  color: '#9FA4B0',
                  lineHeight: 1.6,
                }}
              >
                <strong style={{ color: '#FE5B2A' }}>NOTE ON HEURISTIC SCORING: </strong>
                Safety scores are algorithmic heuristics calculated by DriveGuard AI based on computer-vision event
                deductions (15 points per prolonged eye closure and 5 points per distraction or yawning anomaly).
                They reflect driver attentiveness during recorded sessions and are not an accredited medical diagnosis or legal certification.
              </div>
            </>
          )}
        </div>
      )}

      {/* Scoped CSS Styles for SSTR Analytics */}
      <style>{`
        .sstr-analytics-wrapper {
          max-width: 1440px;
          margin: 0 auto;
          padding: clamp(1.5rem, 3.5vw, 2.5rem) clamp(1rem, 3.5vw, 2.5rem) 5rem;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .sstr-analytics-masthead {
          display: flex;
          justifyContent: space-between;
          align-items: flex-end;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .sstr-analytics-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: #9FA4B0;
          margin-bottom: 0.4rem;
          flex-wrap: wrap;
        }
        .sstr-analytics-title {
          font-family: var(--font-display);
          font-size: clamp(2.2rem, 4.5vw, 3.5rem);
          font-weight: 800;
          color: #FFFFFF;
          margin: 0;
          line-height: 1.05;
          letter-spacing: -0.02em;
        }
        .sstr-analytics-subtitle {
          font-family: var(--font-sans);
          font-size: 0.92rem;
          color: #9FA4B0;
          margin: 0.35rem 0 0 0;
          max-width: 680px;
        }

        .sstr-mode-toggle {
          display: inline-flex;
          background: #18191B;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          padding: 3px;
          gap: 3px;
        }
        .sstr-toggle-btn {
          padding: 0.5rem 1.25rem;
          border-radius: 3px;
          font-family: var(--font-mono);
          font-size: 0.76rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          background: transparent;
          color: #9FA4B0;
          transition: all 0.2s ease;
          text-transform: uppercase;
        }
        .sstr-toggle-btn.active {
          background: #FE5B2A;
          color: #FFFFFF;
        }

        .sstr-kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.25rem;
        }
        .sstr-kpi-badge {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          padding: 0.2rem 0.55rem;
          border-radius: 4px;
          background: #0D0E10;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #FFFFFF;
          font-weight: 600;
        }
        .sstr-kpi-val {
          font-family: var(--font-display);
          font-size: 3.6rem;
          font-weight: 800;
          line-height: 1;
          color: #FFFFFF;
          margin: 0.4rem 0;
        }
        .sstr-kpi-lbl {
          font-family: var(--font-sans);
          font-size: 0.78rem;
          color: #5F6470;
        }

        .sstr-waveform-card {
          background: #141518;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          padding: clamp(1.5rem, 3vw, 2.25rem);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
        }
        .sstr-waveform-title {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0.2rem 0 0 0;
        }
        .sstr-wave-tag {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          padding: 0.25rem 0.65rem;
          border-radius: 4px;
          background: #0D0E10;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #9FA4B0;
          font-weight: 600;
        }

        .sstr-svg-canvas-box {
          width: 100%;
          height: 240px;
          background: #0D0E10;
          border-radius: 4px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .sstr-biometrics-strip {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          gap: 1rem;
        }
        .sstr-bio-val {
          font-family: var(--font-display);
          font-size: 2.5rem;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0.2rem 0;
        }
        .sstr-bio-lbl {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: #5F6470;
        }
      `}</style>
    </div>
  );
}