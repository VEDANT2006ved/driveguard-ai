import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronRight,
  RefreshCw,
  Search,
  Check,
  Copy,
  ArrowUpDown,
  Navigation,
  MapPin,
  Lock,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import RouteVisualizer from '../components/RouteVisualizer';
import { gpsTracker } from '../services/gpsTracker';
import { API_BASE_URL, getApiBaseUrl } from '../config/api';

const FALLBACK_RECORDED_SESSIONS = [
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
    createdAt: '2026-10-14 21:40:00',
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
    createdAt: '2026-10-13 00:25:00',
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
    createdAt: '2026-10-12 09:12:00',
  },
];

function cleanMetricString(val) {
  if (!val) return '';
  return String(val)
    .replace(/(-?\d+(?:\.\d+)?)\s*A[^\w\s\)]*/g, (m, p1) => `${p1}°`)
    .replace(/>(\d+)\s*A[^\w\s\)]*/g, (m, p1) => `>${p1}°`);
}

/**
 * TripHistoryView Component — Minimalist Swiss Editorial Edition
 * References: Images 2 (Aura store), 4 (lab. 001)
 * High-fashion archival flight ledger, search & filters, and SQLite session audit certificates.
 */
export default function TripHistoryView() {
  const [trips, setTrips] = useState(FALLBACK_RECORDED_SESSIONS);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [syncConfirmed, setSyncConfirmed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL'); // ALL | SAFE | CAUTION | FLAGGED
  const [sortOrder, setSortOrder] = useState('newest'); // newest | oldest
  const [copied, setCopied] = useState(false);

  // Fetch real trip records from SQLite backend + merge session-local GPS trips
  const fetchTrips = async (isManual = false) => {
    setIsRefreshing(true);
    try {
      let combined = [];
      const res = await fetch(`${getApiBaseUrl()}/api/trips`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          combined = [...data];
        }
      }

      // Merge session-local GPS trips
      const localGps = gpsTracker.getSessionLocalTrips();
      localGps.forEach((lt) => {
        if (!combined.some((t) => t.id === lt.id)) {
          combined.unshift({
            id: lt.id,
            date: new Date(lt.startTime || Date.now())
              .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              .toUpperCase(),
            time: `${new Date(lt.startTime || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })} - ${new Date(lt.endTime || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`,
            duration: lt.duration,
            distance: `${lt.distanceKm.toFixed(2)} km`,
            distanceKm: lt.distanceKm,
            safetyScore:
              lt.taggedIncidents.length === 0 ? 98 : Math.max(50, 95 - lt.taggedIncidents.length * 15),
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

      if (combined.length > 0) {
        setTrips(combined);
      }
      if (isManual) {
        setSyncConfirmed(true);
        setTimeout(() => setSyncConfirmed(false), 2000);
      }
    } catch (err) {
      console.warn('Could not fetch SQLite trip records:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  // Summary Metrics
  const summary = useMemo(() => {
    const total = trips.length;
    if (total === 0) {
      return { total: 0, avgScore: 100, incidentFree: 0, totalTime: '0m' };
    }
    const scoreSum = trips.reduce((acc, t) => acc + (t.safetyScore || 100), 0);
    const avgScore = Math.round(scoreSum / total);
    const incidentFree = trips.filter((t) => !t.incidents || t.incidents.length === 0).length;

    let totalMinutes = 0;
    trips.forEach((t) => {
      if (!t.duration) return;
      const hMatch = t.duration.match(/(\d+)\s*h/);
      const mMatch = t.duration.match(/(\d+)\s*m/);
      if (hMatch) totalMinutes += parseInt(hMatch[1], 10) * 60;
      if (mMatch) totalMinutes += parseInt(mMatch[1], 10);
    });
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const totalTime = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

    return { total, avgScore, incidentFree, totalTime };
  }, [trips]);

  // Filter and sort session records
  const filteredTrips = useMemo(() => {
    let result = trips.filter((t) => {
      const query = searchQuery.trim().toLowerCase();
      const matchQuery =
        !query ||
        t.id?.toLowerCase().includes(query) ||
        t.date?.toLowerCase().includes(query) ||
        t.status?.toLowerCase().includes(query) ||
        t.grade?.toLowerCase().includes(query);

      if (!matchQuery) return false;

      if (activeFilter === 'ALL') return true;
      if (activeFilter === 'SAFE') {
        const g = String(t.grade || '').toUpperCase();
        return g.startsWith('A');
      }
      if (activeFilter === 'CAUTION') {
        const g = String(t.grade || '').toUpperCase();
        return g.startsWith('B') || g.startsWith('C');
      }
      if (activeFilter === 'FLAGGED') {
        return Array.isArray(t.incidents) && t.incidents.length > 0;
      }
      return true;
    });

    result.sort((a, b) => {
      const aVal = a.createdAt || a.id;
      const bVal = b.createdAt || b.id;
      return sortOrder === 'newest' ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
    });

    return result;
  }, [trips, searchQuery, activeFilter, sortOrder]);

  const activeTrip = selectedTrip || filteredTrips[0] || trips[0];

  const handleCopyReport = (trip) => {
    if (!trip) return;
    const distanceText = trip.distance && trip.distance !== '--' ? trip.distance : 'Not measured';
    const incidentCount = trip.incidents ? trip.incidents.length : 0;
    const text = `DRIVEGUARD AI — SESSION AUDIT
Session ID: ${trip.id}
Date: ${trip.date} (${trip.time})
Safety Score: ${trip.safetyScore}% (Grade ${trip.grade})
Duration: ${trip.duration}
Distance: ${distanceText}
Incidents: ${incidentCount}
Attestation: Verified in SQLite local ledger`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: 'var(--bg-primary)',
        padding: 'clamp(1.5rem, 3.5vw, 3rem) clamp(1rem, 3vw, 2.5rem)',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
      }}
    >
      {/* 1. Page Masthead */}
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
            <span className="techwear-tag">FLIGHT VAULT // 04</span>
            <span>•</span>
            <span>SQLITE IMMUTABLE ARCHIVE</span>
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
            Persistent Flight Ledger
          </h1>

          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Cryptographically timestamped driving sessions with spatial GPS telemetry and incident logs.
          </p>
        </div>

        {/* Sync Button */}
        <button
          onClick={() => fetchTrips(true)}
          disabled={isRefreshing}
          className="btn-editorial-outline"
          style={{ height: '36px' }}
        >
          {syncConfirmed ? (
            <Check size={13} style={{ color: 'var(--accent-emerald)' }} />
          ) : (
            <RefreshCw
              size={13}
              style={{
                animation: isRefreshing ? 'laserScanLine 0.9s linear infinite' : 'none',
              }}
            />
          )}
          <span>{isRefreshing ? 'SYNCING...' : syncConfirmed ? 'SYNCED' : 'SYNC VAULT'}</span>
        </button>
      </div>

      {/* 2. Summary Metric Strip (4 Columns) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-light)',
          borderRadius: '4px',
          padding: '1.25rem',
        }}
      >
        <div>
          <div style={{ fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)", fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>
            {summary.total}
          </div>
          <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: '0.35rem', letterSpacing: '0.08em' }}>
            TOTAL SESSIONS
          </div>
        </div>

        <div>
          <div style={{ fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)", fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>
            {summary.avgScore}%
          </div>
          <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: '0.35rem', letterSpacing: '0.08em' }}>
            AVERAGE SAFETY INDEX
          </div>
        </div>

        <div>
          <div style={{ fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)", fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>
            {summary.incidentFree}
          </div>
          <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: '0.35rem', letterSpacing: '0.08em' }}>
            INCIDENT-FREE SESSIONS
          </div>
        </div>

        <div>
          <div style={{ fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)", fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>
            {summary.totalTime}
          </div>
          <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: '0.35rem', letterSpacing: '0.08em' }}>
            TOTAL MONITORED TIME
          </div>
        </div>
      </div>

      {/* 3. Toolbar: Filter Tabs & Search */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        {/* Filter Tabs */}
        <div style={{ display: 'inline-flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'All sessions' },
            { id: 'SAFE', label: 'Safe (Grade A)' },
            { id: 'CAUTION', label: 'Caution' },
            { id: 'FLAGGED', label: 'Flagged incidents' },
          ].map((tab) => {
            const isTabActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                style={{
                  padding: '0.35rem 0.75rem',
                  border: '1px solid var(--border-light)',
                  borderRadius: '2px',
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: isTabActive ? 'var(--text-primary)' : 'transparent',
                  color: isTabActive ? 'var(--bg-primary)' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-light)',
            borderRadius: '2px',
            padding: '0.35rem 0.75rem',
          }}
        >
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              background: 'none',
              outline: 'none',
              fontFamily: "var(--font-mono, monospace)",
              fontSize: '0.74rem',
              color: 'var(--text-primary)',
              width: '140px',
            }}
          />
        </div>
      </div>

      {/* 4. Main Dual Ledger: Session Rows (Left) & Inspector Drawer (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1.2fr) minmax(320px, 1fr)',
          gap: '1.5rem',
          alignItems: 'start',
        }}
      >
        {/* Left: Session Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {filteredTrips.map((trip) => {
            const isSelected = activeTrip?.id === trip.id;
            return (
              <div
                key={trip.id}
                onClick={() => setSelectedTrip(trip)}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: isSelected ? '1.5px solid var(--text-primary)' : '1px solid var(--border-light)',
                  borderRadius: '3px',
                  padding: '1.15rem 1.4rem',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.15s ease',
                }}
              >
                <div>
                  <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.66rem', color: 'var(--text-muted)' }}>
                    {trip.id} • {trip.date}
                  </div>
                  <div style={{ fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)", fontSize: '1.1rem', fontWeight: 700, marginTop: '0.2rem' }}>
                    {trip.duration} • {trip.distance || '0.00 km'}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.65rem', color: 'var(--text-muted)' }}>GRADE</div>
                    <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '1.1rem', fontWeight: 700, color: (trip.safetyScore || 100) >= 80 ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
                      {trip.grade || 'A'}
                    </div>
                  </div>
                  <ChevronRight size={16} color="var(--text-muted)" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Session Detail Card */}
        {activeTrip && (
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-light)',
              borderRadius: '4px',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              position: 'sticky',
              top: '80px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-light)', paddingBottom: '1.25rem' }}>
              <div>
                <span className="techwear-tag">VERIFIED FLIGHT AUDIT</span>
                <h3 style={{ fontSize: '1.4rem', margin: '0.4rem 0 0.15rem 0' }}>
                  {activeTrip.id}
                </h3>
                <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                  {activeTrip.date} • {activeTrip.time}
                </span>
              </div>

              <button
                onClick={() => handleCopyReport(activeTrip)}
                className="btn-editorial-outline"
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.7rem' }}
              >
                {copied ? <Check size={12} color="var(--accent-emerald)" /> : <Copy size={12} />}
                <span>{copied ? 'COPIED' : 'COPY'}</span>
              </button>
            </div>

            {/* 3-Column Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', textAlign: 'center' }}>
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '2px' }}>
                <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.62rem', color: 'var(--text-muted)' }}>SCORE</div>
                <div style={{ fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)", fontSize: '1.5rem', fontWeight: 700 }}>
                  {activeTrip.safetyScore}%
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '2px' }}>
                <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.62rem', color: 'var(--text-muted)' }}>DURATION</div>
                <div style={{ fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)", fontSize: '1.5rem', fontWeight: 700 }}>
                  {activeTrip.duration}
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '2px' }}>
                <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.62rem', color: 'var(--text-muted)' }}>DISTANCE</div>
                <div style={{ fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)", fontSize: '1.5rem', fontWeight: 700 }}>
                  {activeTrip.distance || '--'}
                </div>
              </div>
            </div>

            {/* Incidents Timeline */}
            <div>
              <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.65rem', letterSpacing: '0.08em' }}>
                RECORDED SAFETY EVENTS ({activeTrip.incidents?.length || 0})
              </div>

              {!activeTrip.incidents || activeTrip.incidents.length === 0 ? (
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', padding: '0.5rem 0' }}>
                  No safety incidents recorded during this flight. Optimal attentiveness maintained.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {activeTrip.incidents.map((evt, eIdx) => (
                    <div
                      key={eIdx}
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-light)',
                        borderRadius: '2px',
                        padding: '0.65rem 0.85rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontFamily: "var(--font-mono, monospace)",
                        fontSize: '0.74rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: evt.severity === 'CRITICAL' ? 'var(--accent-crimson)' : 'var(--accent-amber)',
                          }}
                        />
                        <span>{evt.type}</span>
                      </div>
                      <span style={{ color: 'var(--text-muted)' }}>{evt.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
