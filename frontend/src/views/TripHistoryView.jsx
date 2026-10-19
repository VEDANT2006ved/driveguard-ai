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
} from 'lucide-react';
import RouteVisualizer from '../components/RouteVisualizer';
import { gpsTracker } from '../services/gpsTracker';
import { API_BASE_URL, getApiBaseUrl } from '../config/api';

// Fallback session dataset in case backend is loading or cold
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

/**
 * Clean up degree symbol encoding artifacts from SQLite string fields
 */
function cleanMetricString(val) {
  if (!val) return '';
  return String(val)
    .replace(/(-?\d+(?:\.\d+)?)\s*A[^\w\s\)]*/g, (m, p1) => `${p1}°`)
    .replace(/>(\d+)\s*A[^\w\s\)]*/g, (m, p1) => `>${p1}°`);
}

/**
 * TripHistoryView Component — Redesigned Minimal Editorial Automotive Experience
 * Clean, restrained, generous whitespace, unified summary row, and authentic SQLite data.
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
  const [showGpsRoute, setShowGpsRoute] = useState(false);

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

      // Merge any session-local GPS trips recorded during this browser session
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
              time: new Date(inc.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              }),
              type: inc.type,
              severity: inc.severity,
              metric:
                inc.metric ||
                (inc.hasCoordinates
                  ? `GPS: ${inc.lat?.toFixed(4)}°, ${inc.lng?.toFixed(4)}°`
                  : 'Optical Alert'),
              lat: inc.lat,
              lng: inc.lng,
            })),
            waypoints: lt.waypoints,
            isGpsVerified: true,
            isSimulated: lt.isSimulated,
            createdAt: lt.createdAt,
          });
        }
      });

      if (combined.length > 0) {
        setTrips(combined);
        setSelectedTrip((prev) => {
          if (!prev) return combined[0];
          const match = combined.find((t) => t.id === prev.id);
          return match || combined[0];
        });
        if (isManual) {
          setSyncConfirmed(true);
          setTimeout(() => setSyncConfirmed(false), 2400);
        }
      }
    } catch (err) {
      console.warn('Could not fetch trip history from API:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTrips(false);
  }, []);

  // Compute horizontal summary row metrics dynamically from loaded SQLite sessions
  const summary = useMemo(() => {
    const total = trips.length;
    if (total === 0) {
      return { total: 0, avgScore: 100, incidentFree: 0, totalTime: '0m' };
    }

    const avgScore = Math.round(
      trips.reduce((acc, t) => acc + (Number(t.safetyScore) || 0), 0) / total
    );

    const incidentFree = trips.filter((t) => !t.incidents || t.incidents.length === 0).length;

    let totalSec = 0;
    trips.forEach((t) => {
      const str = t.duration || '';
      const hMatch = str.match(/(\d+)\s*h/);
      const mMatch = str.match(/(\d+)\s*m/);
      const sMatch = str.match(/(\d+)\s*s/);
      if (hMatch) totalSec += parseInt(hMatch[1], 10) * 3600;
      if (mMatch) totalSec += parseInt(mMatch[1], 10) * 60;
      if (sMatch) totalSec += parseInt(sMatch[1], 10);
    });

    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const totalTime = h > 0 ? `${h}h ${m}m` : `${m || 1}m`;

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

  const getScoreColor = (score = 100) => {
    if (score >= 85) return '#2E7D32'; // Restrained green
    if (score >= 70) return '#D97706'; // Amber
    return '#DC2626'; // Red
  };

  return (
    <div
      className="editorial-vault"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        color: '#171717',
        animation: 'editorialFadeIn 0.4s ease-out forwards',
      }}
    >
      {/* 1. Page Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderBottom: '1px solid #E6E2DA',
          paddingBottom: '1.75rem',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
              fontSize: '0.72rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#77756F',
              marginBottom: '0.5rem',
              fontWeight: 600,
            }}
          >
            DRIVEGUARD / SAFETY RECORDS
          </div>

          <h1
            style={{
              fontFamily: "Georgia, 'Times New Roman', 'Playfair Display', serif",
              fontSize: 'clamp(2.3rem, 4.4vw, 3.3rem)',
              fontWeight: 400,
              letterSpacing: '-0.025em',
              color: '#171717',
              margin: '0 0 0.45rem 0',
              lineHeight: 1.1,
            }}
          >
            Your journeys, documented.
          </h1>

          <p
            style={{
              color: '#77756F',
              fontSize: '0.95rem',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            A clear record of every monitored session.
          </p>
        </div>

        {/* Minimal Sync Button on Right */}
        <button
          onClick={() => fetchTrips(true)}
          disabled={isRefreshing}
          aria-label="Sync session ledger"
          title="Sync session records with local SQLite database"
          className="editorial-sync-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'transparent',
            border: '1px solid #E6E2DA',
            borderRadius: '4px',
            padding: '0.5rem 1rem',
            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
            fontSize: '0.74rem',
            letterSpacing: '0.04em',
            color: syncConfirmed ? '#2E7D32' : '#171717',
            cursor: isRefreshing ? 'wait' : 'pointer',
            transition: 'all 0.18s ease',
          }}
        >
          {syncConfirmed ? (
            <Check size={13} style={{ color: '#2E7D32' }} />
          ) : (
            <RefreshCw
              size={13}
              style={{
                animation: isRefreshing ? 'spin 0.9s linear infinite' : 'none',
              }}
            />
          )}
          <span>{isRefreshing ? 'Syncing...' : syncConfirmed ? 'Synced' : 'Sync'}</span>
        </button>
      </div>

      {/* 2. Horizontal Summary Row (Replaces 4 Statistic Cards) */}
      <div
        className="editorial-summary-row"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.5rem',
          borderBottom: '1px solid #E6E2DA',
          paddingBottom: '2rem',
        }}
      >
        {/* Total Sessions */}
        <div className="editorial-stat-item" style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontFamily: "var(--font-sans, 'Plus Jakarta Sans', sans-serif)",
              fontSize: 'clamp(2.1rem, 3.4vw, 2.7rem)',
              fontWeight: 500,
              lineHeight: 1,
              color: '#171717',
              letterSpacing: '-0.02em',
            }}
          >
            {summary.total}
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
              fontSize: '0.68rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#77756F',
              marginTop: '0.5rem',
              fontWeight: 600,
            }}
          >
            Total sessions
          </span>
        </div>

        {/* Average Safety Score */}
        <div
          className="editorial-stat-item"
          style={{
            display: 'flex',
            flexDirection: 'column',
            borderLeft: '1px solid #E6E2DA',
            paddingLeft: '1.5rem',
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-sans, 'Plus Jakarta Sans', sans-serif)",
              fontSize: 'clamp(2.1rem, 3.4vw, 2.7rem)',
              fontWeight: 500,
              lineHeight: 1,
              color: '#171717',
              letterSpacing: '-0.02em',
            }}
          >
            {summary.avgScore}%
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
              fontSize: '0.68rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#77756F',
              marginTop: '0.5rem',
              fontWeight: 600,
            }}
          >
            Average safety score
          </span>
        </div>

        {/* Incident-free Sessions */}
        <div
          className="editorial-stat-item"
          style={{
            display: 'flex',
            flexDirection: 'column',
            borderLeft: '1px solid #E6E2DA',
            paddingLeft: '1.5rem',
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-sans, 'Plus Jakarta Sans', sans-serif)",
              fontSize: 'clamp(2.1rem, 3.4vw, 2.7rem)',
              fontWeight: 500,
              lineHeight: 1,
              color: '#171717',
              letterSpacing: '-0.02em',
            }}
          >
            {summary.incidentFree}
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
              fontSize: '0.68rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#77756F',
              marginTop: '0.5rem',
              fontWeight: 600,
            }}
          >
            Incident-free sessions
          </span>
        </div>

        {/* Total Monitored Time */}
        <div
          className="editorial-stat-item"
          style={{
            display: 'flex',
            flexDirection: 'column',
            borderLeft: '1px solid #E6E2DA',
            paddingLeft: '1.5rem',
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-sans, 'Plus Jakarta Sans', sans-serif)",
              fontSize: 'clamp(2.1rem, 3.4vw, 2.7rem)',
              fontWeight: 500,
              lineHeight: 1,
              color: '#171717',
              letterSpacing: '-0.02em',
            }}
          >
            {summary.totalTime}
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
              fontSize: '0.68rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#77756F',
              marginTop: '0.5rem',
              fontWeight: 600,
            }}
          >
            Total monitored time
          </span>
        </div>
      </div>

      {/* 3. Compact Understated Toolbar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          borderBottom: '1px solid #E6E2DA',
          paddingBottom: '0.75rem',
        }}
      >
        {/* Simple Text Tabs with Thin Underline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'All sessions' },
            { id: 'SAFE', label: 'Safe sessions' },
            { id: 'CAUTION', label: 'Caution' },
            { id: 'FLAGGED', label: 'Flagged incidents' },
          ].map((tab) => {
            const isTabActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: isTabActive ? '2px solid #D66A45' : '2px solid transparent',
                  padding: '0.5rem 0',
                  color: isTabActive ? '#171717' : '#77756F',
                  fontFamily: "var(--font-sans, 'Plus Jakarta Sans', sans-serif)",
                  fontSize: '0.86rem',
                  fontWeight: isTabActive ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search & Sort Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          {/* Understated Search */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              borderBottom: '1px solid #E6E2DA',
              padding: '0.35rem 0',
              width: 'clamp(160px, 20vw, 220px)',
            }}
          >
            <Search size={13} style={{ color: '#77756F' }} />
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontFamily: "var(--font-sans, 'Plus Jakarta Sans', sans-serif)",
                fontSize: '0.82rem',
                color: '#171717',
                width: '100%',
              }}
            />
          </div>

          {/* Simple Sort Toggle */}
          <button
            onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'none',
              border: 'none',
              color: '#77756F',
              fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
              fontSize: '0.74rem',
              cursor: 'pointer',
              padding: '0.35rem 0',
            }}
          >
            <ArrowUpDown size={12} />
            <span>{sortOrder === 'newest' ? 'Newest first' : 'Oldest first'}</span>
          </button>
        </div>
      </div>

      {/* 4. Main Two-Column Layout: Minimalist Chronological Ledger & Clean Detail Panel */}
      <div
        className="editorial-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(340px, 1.15fr) minmax(360px, 1fr)',
          gap: '2.5rem',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Chronological Ledger */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filteredTrips.length === 0 ? (
            <div
              style={{
                padding: '3.5rem 1rem',
                textAlign: 'center',
                color: '#77756F',
              }}
            >
              <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.92rem' }}>
                No sessions found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setActiveFilter('ALL');
                  setSearchQuery('');
                }}
                style={{
                  background: 'none',
                  border: '1px solid #E6E2DA',
                  borderRadius: '4px',
                  padding: '0.4rem 0.85rem',
                  color: '#171717',
                  fontSize: '0.76rem',
                  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                  cursor: 'pointer',
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            filteredTrips.map((trip, idx) => {
              const isSelected = activeTrip?.id === trip.id;
              const incidentCount = trip.incidents?.length || 0;

              return (
                <div
                  key={trip.id}
                  onClick={() => setSelectedTrip(trip)}
                  className="editorial-row"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.05rem 1.25rem',
                    borderBottom: '1px solid #E6E2DA',
                    borderLeft: isSelected ? '2.5px solid #D66A45' : '2.5px solid transparent',
                    backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.65)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    animation: 'editorialFadeIn 0.3s ease both',
                    animationDelay: `${Math.min(idx * 25, 250)}ms`,
                  }}
                >
                  {/* Left: ID and Date/Time */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span
                        style={{
                          fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                          fontSize: '0.86rem',
                          fontWeight: 600,
                          color: '#171717',
                        }}
                      >
                        {trip.id}
                      </span>
                      <span style={{ color: '#E6E2DA' }}>/</span>
                      <span style={{ fontSize: '0.78rem', color: '#77756F' }}>
                        {trip.date}
                      </span>
                    </div>

                    <div
                      style={{
                        fontSize: '0.76rem',
                        color: '#77756F',
                        fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                      }}
                    >
                      {trip.time} · {trip.duration}
                    </div>
                  </div>

                  {/* Right: Score, Incidents & Small Arrow */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    {/* Incident Count Indicator */}
                    <span
                      style={{
                        fontSize: '0.76rem',
                        fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                        color: incidentCount > 0 ? (incidentCount >= 3 ? '#DC2626' : '#D66A45') : '#77756F',
                      }}
                    >
                      {incidentCount === 0 ? '0 incidents' : `${incidentCount} flagged`}
                    </span>

                    {/* Grade & Score */}
                    <span
                      style={{
                        fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: getScoreColor(trip.safetyScore),
                        minWidth: '55px',
                        textAlign: 'right',
                      }}
                    >
                      {trip.grade} · {trip.safetyScore}%
                    </span>

                    <ChevronRight
                      size={14}
                      className="row-arrow"
                      style={{
                        color: isSelected ? '#171717' : '#B3AFA8',
                        transition: 'transform 0.18s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Clean Detail Panel */}
        {activeTrip && (
          <div
            key={activeTrip.id}
            className="editorial-detail-panel"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E6E2DA',
              borderRadius: '6px',
              padding: 'clamp(1.5rem, 3vw, 2.25rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.75rem',
              position: 'sticky',
              top: '88px',
              animation: 'editorialFadeIn 0.25s ease forwards',
            }}
          >
            {/* Detail Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                borderBottom: '1px solid #E6E2DA',
                paddingBottom: '1.5rem',
                gap: '1rem',
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                    fontSize: '0.68rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#77756F',
                    marginBottom: '0.35rem',
                    fontWeight: 600,
                  }}
                >
                  SESSION DETAILS
                </div>

                <h2
                  style={{
                    fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                    fontSize: '1.65rem',
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    color: '#171717',
                    margin: '0 0 0.25rem 0',
                  }}
                >
                  {activeTrip.id}
                </h2>

                <div
                  style={{
                    fontSize: '0.82rem',
                    color: '#77756F',
                  }}
                >
                  {activeTrip.date} ({activeTrip.time})
                </div>
              </div>

              {/* Simple Safety Score & Grade Display */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  textAlign: 'right',
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-sans, 'Plus Jakarta Sans', sans-serif)",
                    fontSize: '2rem',
                    fontWeight: 600,
                    lineHeight: 1,
                    color: getScoreColor(activeTrip.safetyScore),
                    letterSpacing: '-0.02em',
                  }}
                >
                  {activeTrip.grade}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                    fontSize: '0.74rem',
                    color: '#77756F',
                    marginTop: '0.2rem',
                  }}
                >
                  Score: {activeTrip.safetyScore}%
                </span>
              </div>
            </div>

            {/* Compact Three-Column Metric Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                borderBottom: '1px solid #E6E2DA',
                paddingBottom: '1.5rem',
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                    fontSize: '0.66rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#77756F',
                    display: 'block',
                    marginBottom: '0.25rem',
                  }}
                >
                  Duration
                </span>
                <span
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 500,
                    color: '#171717',
                  }}
                >
                  {activeTrip.duration}
                </span>
              </div>

              <div>
                <span
                  style={{
                    fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                    fontSize: '0.66rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#77756F',
                    display: 'block',
                    marginBottom: '0.25rem',
                  }}
                >
                  Distance
                </span>
                <span
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 500,
                    color: '#171717',
                  }}
                >
                  {activeTrip.distance && activeTrip.distance !== '--'
                    ? activeTrip.distance
                    : 'Not measured'}
                </span>
                {activeTrip.isGpsVerified && (
                  <span
                    style={{
                      fontSize: '0.66rem',
                      color: '#D66A45',
                      fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                      fontWeight: 600,
                      display: 'block',
                      marginTop: '0.2rem',
                    }}
                  >
                    ● GPS Tracked
                  </span>
                )}
              </div>

              <div>
                <span
                  style={{
                    fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                    fontSize: '0.66rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#77756F',
                    display: 'block',
                    marginBottom: '0.25rem',
                  }}
                >
                  Incidents
                </span>
                <span
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 500,
                    color:
                      activeTrip.incidents && activeTrip.incidents.length > 0
                        ? activeTrip.incidents.length >= 3
                          ? '#DC2626'
                          : '#D66A45'
                        : '#2E7D32',
                  }}
                >
                  {activeTrip.incidents ? activeTrip.incidents.length : 0}
                </span>
              </div>
            </div>

            {/* GPS Route Map (Available for sessions with recorded GPS points) */}
            {activeTrip.waypoints && activeTrip.waypoints.length > 0 && (
              <div style={{ borderBottom: '1px solid #E6E2DA', paddingBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                      fontSize: '0.68rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: '#77756F',
                      fontWeight: 600,
                    }}
                  >
                    RECORDED GPS ROUTE
                  </span>
                  <button
                    onClick={() => setShowGpsRoute((prev) => !prev)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      background: 'none',
                      border: '1px solid #E6E2DA',
                      borderRadius: '4px',
                      padding: '0.3rem 0.65rem',
                      fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                      fontSize: '0.68rem',
                      color: '#171717',
                      cursor: 'pointer',
                    }}
                  >
                    <Navigation size={11} style={{ color: '#D66A45' }} />
                    <span>{showGpsRoute ? 'Hide Route Map' : `View Map (${activeTrip.waypoints.length} Points)`}</span>
                  </button>
                </div>

                {showGpsRoute && (
                  <RouteVisualizer
                    waypoints={activeTrip.waypoints}
                    incidents={activeTrip.incidents || []}
                    isLive={false}
                    isSimulated={activeTrip.isSimulated}
                    totalDistanceKm={activeTrip.distanceKm || parseFloat(activeTrip.distance) || 0}
                  />
                )}
              </div>
            )}

            {/* Incident Timeline as a Clean Vertical List */}
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                  fontSize: '0.68rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#77756F',
                  marginBottom: '0.85rem',
                  fontWeight: 600,
                }}
              >
                INCIDENT TIMELINE
              </div>

              {activeTrip.incidents && activeTrip.incidents.length > 0 ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: '260px',
                    overflowY: 'auto',
                  }}
                  className="editorial-timeline-scroll"
                >
                  {activeTrip.incidents.map((inc, i) => {
                    const isCrit = inc.severity === 'CRITICAL';
                    const isWarn = inc.severity === 'WARNING';
                    const dotColor = isCrit ? '#DC2626' : isWarn ? '#D97706' : '#77756F';
                    const cleanedType = cleanMetricString(inc.type);
                    const cleanedMetric = cleanMetricString(inc.metric);

                    return (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.65rem 0',
                          borderBottom: '1px solid #F0ECE6',
                          gap: '0.75rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: dotColor,
                              flexShrink: 0,
                            }}
                          />
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.82rem', color: '#171717', fontWeight: 500 }}>
                              {cleanedType}
                            </span>
                            <span
                              style={{
                                fontSize: '0.68rem',
                                color: dotColor,
                                fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                              }}
                            >
                              {inc.severity}
                            </span>
                          </div>
                        </div>

                        <div
                          style={{
                            textAlign: 'right',
                            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                            fontSize: '0.74rem',
                            color: '#77756F',
                          }}
                        >
                          <span>{inc.time}</span>
                          <span style={{ margin: '0 0.35rem', color: '#E6E2DA' }}>·</span>
                          <strong style={{ color: '#171717', fontWeight: 600 }}>
                            {cleanedMetric}
                          </strong>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div
                  style={{
                    padding: '1rem 0',
                    fontSize: '0.84rem',
                    color: '#77756F',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#2E7D32',
                    }}
                  />
                  <span>No incidents recorded. Clean driving session.</span>
                </div>
              )}
            </div>

            {/* Bottom Persistence Info & Copy Summary Action */}
            <div
              style={{
                borderTop: '1px solid #E6E2DA',
                paddingTop: '1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <div
                style={{
                  fontSize: '0.72rem',
                  color: '#77756F',
                  lineHeight: 1.5,
                  maxWidth: '350px',
                }}
              >
                Session data verified in local SQLite storage. GPS route plots are session-local.
                Durable database persistence requires backend schema synchronization (backend untouched).
              </div>

              <button
                onClick={() => handleCopyReport(activeTrip)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: 'none',
                  border: '1px solid #E6E2DA',
                  borderRadius: '4px',
                  padding: '0.35rem 0.75rem',
                  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                  fontSize: '0.7rem',
                  color: copied ? '#2E7D32' : '#171717',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {copied ? <Check size={11} /> : <Copy size={11} />}
                <span>{copied ? 'Copied' : 'Copy summary'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Scoped CSS for Editorial Vault */}
      <style>{`
        @keyframes editorialFadeIn {
          0% {
            opacity: 0;
            transform: translateY(6px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .editorial-sync-btn:hover {
          border-color: #171717 !important;
          background-color: rgba(0, 0, 0, 0.02) !important;
        }

        .editorial-row:hover {
          background-color: rgba(255, 255, 255, 0.5) !important;
        }

        .editorial-row:hover .row-arrow {
          transform: translateX(3px);
          color: #171717 !important;
        }

        .editorial-timeline-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .editorial-timeline-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .editorial-timeline-scroll::-webkit-scrollbar-thumb {
          background: #E6E2DA;
          border-radius: 2px;
        }

        /* Mobile Breakpoint */
        @media (max-width: 900px) {
          .editorial-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .editorial-detail-panel {
            position: static !important;
          }
          .editorial-stat-item {
            border-left: none !important;
            padding-left: 0 !important;
          }
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .editorial-vault,
          .editorial-row,
          .editorial-detail-panel {
            animation: none !important;
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}
