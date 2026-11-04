import React, { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, TrendingDown, AlertTriangle, BarChart3, Activity } from 'lucide-react';
import { getApiBaseUrl } from '../config/api';

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

function formatSecondsToDuration(totalSecs) {
  if (!totalSecs || isNaN(totalSecs) || totalSecs <= 0) return '0s';
  const hrs = Math.floor(totalSecs / 3600);
  const remSec = totalSecs % 3600;
  const mins = Math.floor(remSec / 60);
  const secs = remSec % 60;
  if (hrs > 0) return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
  if (mins > 0) return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  return `${secs}s`;
}

export default function AnalyticsView({ telemetryHistory = [], isEngineConnected = false }) {
  const [activeMode, setActiveMode] = useState('live');
  const [trips, setTrips] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [selectedTripIndex, setSelectedTripIndex] = useState(null);

  const fetchHistoricalTrips = async () => {
    setIsLoadingHistory(true);
    setHistoryError(null);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/trips`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) setTrips(data);
      else throw new Error('Invalid format');
    } catch (err) {
      setHistoryError(err.message || 'Could not load trip data');
      setTrips([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => { fetchHistoricalTrips(); }, []);

  // Live metrics
  const hasLiveData = Array.isArray(telemetryHistory) && telemetryHistory.length > 0;
  const averageRisk = hasLiveData
    ? Math.round(telemetryHistory.reduce((a, c) => a + (typeof c.riskScore === 'number' ? c.riskScore : 0), 0) / telemetryHistory.length)
    : 0;
  const maxRisk = hasLiveData
    ? Math.max(...telemetryHistory.map(d => typeof d.riskScore === 'number' ? d.riskScore : 0))
    : 0;
  const alertCount = hasLiveData
    ? telemetryHistory.filter(d => d.riskLevel && d.riskLevel !== 'NOMINAL').length
    : 0;

  const riskColor = (val) =>
    val >= 70 ? 'var(--color-critical)' : val >= 35 ? 'var(--color-warning)' : 'var(--color-safe)';

  const KPI_CARDS = [
    {
      id: 'avg-risk',
      label: 'Average Risk Score',
      value: hasLiveData ? `${averageRisk}%` : '--',
      sub: 'Rolling session average',
      icon: Activity,
      color: riskColor(averageRisk),
    },
    {
      id: 'peak-risk',
      label: 'Peak Risk Score',
      value: hasLiveData ? `${maxRisk}%` : '--',
      sub: maxRisk > 65 ? 'High fatigue detected' : 'Within normal range',
      icon: TrendingUp,
      color: riskColor(maxRisk),
    },
    {
      id: 'samples',
      label: 'Total Samples',
      value: telemetryHistory.length,
      sub: `${isEngineConnected ? 'Live stream' : 'Offline'} · max 400`,
      icon: BarChart3,
      color: 'var(--text-secondary)',
    },
    {
      id: 'alerts',
      label: 'Safety Alerts',
      value: alertCount,
      sub: alertCount > 0 ? 'Events triggered this session' : 'No alerts this session',
      icon: AlertTriangle,
      color: alertCount > 0 ? 'var(--color-warning)' : 'var(--color-safe)',
    },
  ];

  return (
    <div style={{
      width: '100%',
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '1rem',
        paddingBottom: '1.25rem',
        borderBottom: '1px solid var(--border)',
      }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
            Analytics
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
            Safety trends, risk history, and session data.
          </p>
        </div>

        {/* Mode tabs */}
        <div style={{
          display: 'inline-flex',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '3px',
          backgroundColor: 'var(--bg-secondary)',
          gap: '2px',
        }}>
          {[
            { id: 'live', label: 'Live Analytics' },
            { id: 'historical', label: `Historical (${trips.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              id={`analytics-tab-${tab.id}`}
              onClick={() => setActiveMode(tab.id)}
              style={{
                padding: '0.375rem 0.875rem',
                border: 'none',
                borderRadius: 'calc(var(--radius) - 2px)',
                fontSize: '0.8125rem',
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                backgroundColor: activeMode === tab.id ? 'var(--bg-primary)' : 'transparent',
                color: activeMode === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                boxShadow: activeMode === tab.id ? 'var(--shadow-xs)' : 'none',
                transition: 'all var(--transition-fast)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ===== LIVE ANALYTICS ===== */}
      {activeMode === 'live' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* KPI strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}>
            {KPI_CARDS.map(card => {
              const Icon = card.icon;
              return (
                <div key={card.id} className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.875rem' }}>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      {card.label}
                    </span>
                    <div style={{
                      width: '32px', height: '32px',
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={15} style={{ color: card.color }} strokeWidth={2} />
                    </div>
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.875rem',
                    fontWeight: 800,
                    color: card.color,
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    marginBottom: '0.375rem',
                  }}>
                    {card.value}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {card.sub}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Risk chart */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, margin: '0 0 0.25rem' }}>
                  Risk Score Over Time
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Real-time attention risk — last {telemetryHistory.length} samples
                </p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <div style={{ width: '24px', height: '1.5px', backgroundColor: 'var(--color-critical)', borderRadius: '1px' }} />
                  Critical (70%)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <div style={{ width: '24px', height: '1.5px', backgroundColor: 'var(--color-warning)', borderRadius: '1px', borderTop: '1px dashed var(--color-warning)' }} />
                  Warning (35%)
                </div>
              </div>
            </div>

            <div style={{
              width: '100%',
              height: '220px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              overflow: 'hidden',
              position: 'relative',
            }}>
              {hasLiveData ? (
                <svg width="100%" height="100%" viewBox="0 0 800 220" preserveAspectRatio="none" style={{ display: 'block' }}>
                  <defs>
                    <linearGradient id="riskAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--text-primary)" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="var(--text-primary)" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Y-axis grid lines */}
                  {[20, 70, 130].map((y, i) => (
                    <line key={i} x1="0" y1={y} x2="800" y2={y}
                      stroke="var(--border)" strokeWidth="1" strokeDasharray={i === 0 ? '0' : '4 4'} />
                  ))}

                  {/* Threshold labels */}
                  <text x="8" y="17" fill="var(--color-critical)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="500">Critical 70%</text>
                  <text x="8" y="67" fill="var(--color-warning)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="500">Warning 35%</text>
                  <text x="8" y="127" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono)">Safe</text>

                  {/* Critical line */}
                  <line x1="0" y1="20" x2="800" y2="20" stroke="var(--color-critical)" strokeDasharray="4 4" strokeWidth="1" strokeOpacity="0.6" />
                  {/* Warning line */}
                  <line x1="0" y1="70" x2="800" y2="70" stroke="var(--color-warning)" strokeDasharray="4 4" strokeWidth="1" strokeOpacity="0.5" />

                  {(() => {
                    const count = telemetryHistory.length;
                    const step = count > 1 ? 800 / (count - 1) : 800;
                    const pts = telemetryHistory.map((d, i) => {
                      const score = typeof d.riskScore === 'number' ? Math.max(0, Math.min(100, d.riskScore)) : 0;
                      const x = count === 1 ? 400 : i * step;
                      const y = 200 - (score / 100) * 180;
                      return `${x.toFixed(1)},${y.toFixed(1)}`;
                    }).join(' ');
                    const areaPoints = `0,220 ${pts} 800,220`;
                    return (
                      <>
                        <polygon fill="url(#riskAreaGrad)" points={areaPoints} />
                        <polyline
                          fill="none"
                          stroke="var(--text-primary)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={pts}
                        />
                      </>
                    );
                  })()}
                </svg>
              ) : (
                <div style={{
                  display: 'flex',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}>
                  <BarChart3 size={28} style={{ color: 'var(--border-strong)' }} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Waiting for monitoring data…
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== HISTORICAL ===== */}
      {activeMode === 'historical' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
              {trips.length > 0 ? `${trips.length} recorded sessions` : 'No sessions recorded yet'}
            </p>
            <button
              id="analytics-refresh-btn"
              onClick={fetchHistoricalTrips}
              disabled={isLoadingHistory}
              className="btn-secondary"
              style={{ gap: '0.375rem' }}
            >
              <RefreshCw size={13} style={{ animation: isLoadingHistory ? 'spin 0.8s linear infinite' : 'none' }} />
              {isLoadingHistory ? 'Loading…' : 'Refresh'}
            </button>
          </div>

          {historyError && (
            <div style={{
              padding: '0.875rem 1rem',
              backgroundColor: 'var(--color-critical-bg)',
              border: '1px solid var(--color-critical-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              color: 'var(--color-critical)',
            }}>
              Could not load history: {historyError}. Make sure the backend is running.
            </div>
          )}

          {trips.length === 0 && !historyError ? (
            <div className="card" style={{
              padding: '3rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
            }}>
              <BarChart3 size={32} style={{ color: 'var(--border-strong)' }} />
              <div>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 0.25rem' }}>
                  No sessions recorded
                </p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Complete a monitoring session to see your history here.
                </p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {trips.map((trip, idx) => {
                const score = trip.safety_score || 100;
                const scoreColor = score >= 80 ? 'var(--color-safe)' : score >= 60 ? 'var(--color-warning)' : 'var(--color-critical)';
                return (
                  <div
                    key={trip.id || idx}
                    className="card"
                    style={{
                      padding: '1rem 1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      transition: 'box-shadow var(--transition-fast)',
                      cursor: 'default',
                    }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-xs)'}
                  >
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                        Session #{trip.id || idx + 1} · {trip.date || 'Recent'}
                      </div>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {trip.duration || 'Session'} · {trip.incident_count || 0} alerts
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Safety score</div>
                        <div style={{ fontSize: '1.0625rem', fontWeight: 700, color: scoreColor }}>
                          {score}%
                        </div>
                      </div>
                      <span className={`badge ${score >= 80 ? 'badge-safe' : score >= 60 ? 'badge-warning' : 'badge-critical'}`}>
                        {score >= 80 ? 'Good' : score >= 60 ? 'Fair' : 'Poor'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
