import React, { useState, useEffect, useMemo } from 'react';
import {
  RefreshCw, Search, Check, Copy,
  ChevronRight, MapPin, Clock, Shield,
  AlertTriangle, Calendar, Filter,
} from 'lucide-react';
import RouteVisualizer from '../components/RouteVisualizer';
import { gpsTracker } from '../services/gpsTracker';
import { getApiBaseUrl } from '../config/api';

const FALLBACK_SESSIONS = [
  {
    id: 'TRIP-2026-041',
    date: 'Oct 14, 2026',
    time: '20:15 – 21:40',
    duration: '1h 25m',
    distance: '84.2 km',
    safetyScore: 94,
    grade: 'A',
    status: 'OPTIMAL',
    incidents: [
      { time: '20:48', type: 'Micro-yawn detected', severity: 'LOW', metric: 'MAR 0.58' },
    ],
    createdAt: '2026-10-14 21:40:00',
  },
  {
    id: 'TRIP-2026-040',
    date: 'Oct 13, 2026',
    time: '23:10 – 00:25',
    duration: '1h 15m',
    distance: '68.0 km',
    safetyScore: 78,
    grade: 'B-',
    status: 'CAUTION',
    incidents: [
      { time: '23:42', type: 'Prolonged eye closure (1.4s)', severity: 'MEDIUM', metric: 'EAR 0.18' },
      { time: '00:05', type: 'Head turned sideways', severity: 'LOW', metric: 'Yaw 34°' },
    ],
    createdAt: '2026-10-13 00:25:00',
  },
  {
    id: 'TRIP-2026-039',
    date: 'Oct 12, 2026',
    time: '08:30 – 09:12',
    duration: '42m',
    distance: '31.5 km',
    safetyScore: 98,
    grade: 'A+',
    status: 'OPTIMAL',
    incidents: [],
    createdAt: '2026-10-12 09:12:00',
  },
];

function cleanMetricString(val) {
  if (!val) return '';
  return String(val)
    .replace(/(-?\d+(?:\.\d+)?)\s*A[^\w\s\)]*/g, (m, p1) => `${p1}°`)
    .replace(/>(\d+)\s*A[^\w\s\)]*/g, (m, p1) => `>${p1}°`);
}

export default function TripHistoryView() {
  const [trips, setTrips] = useState(FALLBACK_SESSIONS);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [syncConfirmed, setSyncConfirmed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('newest');
  const [copied, setCopied] = useState(false);

  const fetchTrips = async (isManual = false) => {
    setIsRefreshing(true);
    try {
      let combined = [];
      const res = await fetch(`${getApiBaseUrl()}/api/trips`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) combined = [...data];
      }
      const localGps = gpsTracker.getSessionLocalTrips();
      localGps.forEach((lt) => {
        if (!combined.some((t) => t.id === lt.id)) {
          combined.unshift({
            id: lt.id,
            date: new Date(lt.startTime || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: `${new Date(lt.startTime || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })} – ${new Date(lt.endTime || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`,
            duration: lt.duration,
            distance: `${lt.distanceKm.toFixed(2)} km`,
            distanceKm: lt.distanceKm,
            safetyScore: lt.taggedIncidents.length === 0 ? 98 : Math.max(50, 95 - lt.taggedIncidents.length * 15),
            grade: lt.taggedIncidents.length === 0 ? 'A+' : lt.taggedIncidents.length <= 2 ? 'B' : 'C',
            status: lt.taggedIncidents.length === 0 ? 'OPTIMAL' : 'CAUTION',
            incidents: lt.taggedIncidents.map((inc) => ({
              time: new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
              type: inc.type,
              severity: inc.severity,
              metric: cleanMetricString(inc.metric),
              lat: inc.lat,
              lng: inc.lng,
              hasCoordinates: inc.hasCoordinates,
            })),
            waypoints: lt.waypoints,
            isLocalSession: true,
            createdAt: new Date(lt.startTime || Date.now()).toISOString(),
          });
        }
      });
      if (combined.length > 0) setTrips(combined);
      if (isManual) { setSyncConfirmed(true); setTimeout(() => setSyncConfirmed(false), 2000); }
    } catch (err) {
      console.warn('Could not fetch trip records:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => { fetchTrips(); }, []);

  const summary = useMemo(() => {
    const total = trips.length;
    if (total === 0) return { total: 0, avgScore: 100, cleanTrips: 0, totalTime: '0m' };
    const scoreSum = trips.reduce((acc, t) => acc + (t.safetyScore || 100), 0);
    const avgScore = Math.round(scoreSum / total);
    const cleanTrips = trips.filter(t => !t.incidents || t.incidents.length === 0).length;
    let totalMins = 0;
    trips.forEach(t => {
      if (!t.duration) return;
      const hm = t.duration.match(/(\d+)\s*h/);
      const mm = t.duration.match(/(\d+)\s*m/);
      if (hm) totalMins += parseInt(hm[1], 10) * 60;
      if (mm) totalMins += parseInt(mm[1], 10);
    });
    const hrs = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    return { total, avgScore, cleanTrips, totalTime: hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m` };
  }, [trips]);

  const filteredTrips = useMemo(() => {
    let result = trips.filter(t => {
      const q = searchQuery.trim().toLowerCase();
      const matches = !q || t.id?.toLowerCase().includes(q) || t.date?.toLowerCase().includes(q) || t.status?.toLowerCase().includes(q);
      if (!matches) return false;
      if (activeFilter === 'ALL') return true;
      if (activeFilter === 'SAFE') return String(t.grade || '').toUpperCase().startsWith('A');
      if (activeFilter === 'CAUTION') {
        const g = String(t.grade || '').toUpperCase();
        return g.startsWith('B') || g.startsWith('C');
      }
      if (activeFilter === 'FLAGGED') return Array.isArray(t.incidents) && t.incidents.length > 0;
      return true;
    });
    result.sort((a, b) => {
      const av = a.createdAt || a.id;
      const bv = b.createdAt || b.id;
      return sortOrder === 'newest' ? bv.localeCompare(av) : av.localeCompare(bv);
    });
    return result;
  }, [trips, searchQuery, activeFilter, sortOrder]);

  const activeTrip = selectedTrip || filteredTrips[0] || trips[0];

  const handleCopyReport = (trip) => {
    if (!trip) return;
    const text = `DriveGuard AI — Trip Report\nTrip: ${trip.id}\nDate: ${trip.date} (${trip.time})\nSafety Score: ${trip.safetyScore}% (${trip.grade})\nDuration: ${trip.duration}\nDistance: ${trip.distance || 'N/A'}\nAlerts: ${trip.incidents?.length || 0}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const scoreColor = (score) =>
    score >= 85 ? 'var(--color-safe)' : score >= 65 ? 'var(--color-warning)' : 'var(--color-critical)';

  const scoreBadge = (score) =>
    score >= 85 ? 'badge-safe' : score >= 65 ? 'badge-warning' : 'badge-critical';

  const scoreLabel = (score) =>
    score >= 85 ? 'Safe' : score >= 65 ? 'Caution' : 'Flagged';

  const SUMMARY_CARDS = [
    { id: 'total-trips', label: 'Total Trips', value: summary.total, icon: Calendar },
    { id: 'avg-score',   label: 'Avg Safety Score', value: `${summary.avgScore}%`, icon: Shield },
    { id: 'clean-trips', label: 'Clean Sessions', value: summary.cleanTrips, icon: Check },
    { id: 'total-time',  label: 'Total Drive Time', value: summary.totalTime, icon: Clock },
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
            Trip History
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
            All recorded driving sessions with safety scores and event logs.
          </p>
        </div>
        <button
          id="trip-history-refresh-btn"
          onClick={() => fetchTrips(true)}
          disabled={isRefreshing}
          className="btn-secondary"
          style={{ gap: '0.375rem' }}
        >
          {syncConfirmed
            ? <Check size={13} style={{ color: 'var(--color-safe)' }} />
            : <RefreshCw size={13} style={{ animation: isRefreshing ? 'spin 0.8s linear infinite' : 'none' }} />
          }
          {isRefreshing ? 'Loading…' : syncConfirmed ? 'Updated' : 'Refresh'}
        </button>
      </div>

      {/* Summary strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '1rem',
      }}>
        {SUMMARY_CARDS.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.id} className="card" style={{ padding: '1.125rem 1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.625rem' }}>
                <Icon size={14} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>{card.label}</span>
              </div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.75rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.03em',
                lineHeight: 1,
              }}>
                {card.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL',     label: 'All' },
            { id: 'SAFE',    label: 'Safe' },
            { id: 'CAUTION', label: 'Caution' },
            { id: 'FLAGGED', label: 'Flagged' },
          ].map(tab => (
            <button
              key={tab.id}
              id={`filter-${tab.id.toLowerCase()}-btn`}
              onClick={() => setActiveFilter(tab.id)}
              style={{
                padding: '0.375rem 0.75rem',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.8125rem',
                fontWeight: activeFilter === tab.id ? 600 : 400,
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                backgroundColor: activeFilter === tab.id ? 'var(--text-primary)' : 'transparent',
                color: activeFilter === tab.id ? 'var(--text-inverse)' : 'var(--text-secondary)',
                transition: 'all var(--transition-fast)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '0.375rem 0.75rem',
        }}>
          <Search size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            id="trip-search-input"
            type="text"
            placeholder="Search trips…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="input"
            style={{ border: 'none', padding: 0, background: 'none', outline: 'none', width: '150px', fontSize: '0.8125rem' }}
          />
        </div>
      </div>

      {/* Main 2-column layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
        gap: '1.25rem',
        alignItems: 'start',
      }}>
        {/* Trip list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {filteredTrips.length === 0 ? (
            <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>No trips match your filter.</p>
            </div>
          ) : (
            filteredTrips.map((trip) => {
              const isSelected = activeTrip?.id === trip.id;
              return (
                <div
                  key={trip.id}
                  id={`trip-row-${trip.id}`}
                  onClick={() => setSelectedTrip(trip)}
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: `1px solid ${isSelected ? 'var(--text-primary)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem 1.25rem',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    transition: 'all var(--transition-fast)',
                    boxShadow: isSelected ? 'var(--shadow-sm)' : 'var(--shadow-xs)',
                  }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      {trip.id} · {trip.date}
                    </div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {trip.duration} · {trip.distance || '—'}
                    </div>
                    {trip.incidents?.length > 0 && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        {trip.incidents.length} alert{trip.incidents.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.0625rem', fontWeight: 700, color: scoreColor(trip.safetyScore || 100) }}>
                        {trip.safetyScore || 100}%
                      </div>
                    </div>
                    <span className={`badge ${scoreBadge(trip.safetyScore || 100)}`}>
                      {scoreLabel(trip.safetyScore || 100)}
                    </span>
                    <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Detail panel */}
        {activeTrip && (
          <div
            className="card"
            style={{ padding: '1.5rem', position: 'sticky', top: '76px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          >
            {/* Panel header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'flex-start',
              paddingBottom: '1rem',
              borderBottom: '1px solid var(--border)',
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Trip Details</div>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, margin: '0 0 0.125rem' }}>
                  {activeTrip.id}
                </h3>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  {activeTrip.date} · {activeTrip.time}
                </span>
              </div>
              <button
                id="copy-trip-report-btn"
                onClick={() => handleCopyReport(activeTrip)}
                className="btn-icon"
                title="Copy trip report"
              >
                {copied ? <Check size={14} style={{ color: 'var(--color-safe)' }} /> : <Copy size={14} />}
              </button>
            </div>

            {/* Metric grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.625rem' }}>
              {[
                { label: 'Safety Score', value: `${activeTrip.safetyScore}%`, color: scoreColor(activeTrip.safetyScore) },
                { label: 'Duration', value: activeTrip.duration, color: 'var(--text-primary)' },
                { label: 'Distance', value: activeTrip.distance || '—', color: 'var(--text-primary)' },
              ].map(m => (
                <div key={m.label} style={{
                  textAlign: 'center',
                  padding: '0.75rem',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius)',
                }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.375rem', fontWeight: 500 }}>
                    {m.label}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.1875rem',
                    fontWeight: 700,
                    color: m.color,
                    letterSpacing: '-0.02em',
                  }}>
                    {m.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Alerts timeline */}
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.625rem' }}>
                Safety Events ({activeTrip.incidents?.length || 0})
              </div>

              {!activeTrip.incidents || activeTrip.incidents.length === 0 ? (
                <div style={{
                  padding: '1rem',
                  backgroundColor: 'var(--color-safe-bg)',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--color-safe-border)',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                }}>
                  <Check size={14} style={{ color: 'var(--color-safe)' }} />
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-safe)', fontWeight: 500 }}>
                    No safety incidents recorded
                  </span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  {activeTrip.incidents.map((evt, i) => {
                    const isCrit = evt.severity === 'CRITICAL' || evt.severity === 'HIGH' || evt.severity === 'MEDIUM';
                    return (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.625rem 0.75rem',
                          backgroundColor: 'var(--bg-secondary)',
                          borderRadius: 'var(--radius)',
                          border: '1px solid var(--border)',
                        }}
                      >
                        <div style={{
                          width: '7px', height: '7px', borderRadius: '50%', flexShrink: 0,
                          backgroundColor: isCrit ? 'var(--color-critical)' : 'var(--color-warning)',
                        }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', fontWeight: 500 }}>{evt.type}</div>
                          {evt.metric && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                              {cleanMetricString(evt.metric)}
                            </div>
                          )}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0 }}>{evt.time}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* GPS route (if waypoints available) */}
            {activeTrip.waypoints && activeTrip.waypoints.length > 1 && (
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.625rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <MapPin size={13} style={{ color: 'var(--text-muted)' }} />
                  GPS Route
                </div>
                <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)', height: '200px' }}>
                  <RouteVisualizer trip={activeTrip} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: minmax(0, 1.2fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
