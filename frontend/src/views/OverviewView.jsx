import React from 'react';
import AlertBanner from '../components/AlertBanner';
import {
  ArrowRight, Eye, Compass, BarChart3, Shield,
  Camera, Activity, ChevronRight,
} from 'lucide-react';

const FEATURES = [
  {
    id: 'fatigue',
    icon: Eye,
    title: 'Fatigue Detection',
    description: 'Tracks eye openness in real time. Alerts you the moment microsleep or prolonged eye closure is detected.',
    color: 'var(--color-safe)',
    colorBg: 'var(--color-safe-bg)',
  },
  {
    id: 'distraction',
    icon: Compass,
    title: 'Distraction Detection',
    description: 'Monitors head orientation and gaze direction. Warns when your attention drifts from the road.',
    color: 'var(--color-warning)',
    colorBg: 'var(--color-warning-bg)',
  },
  {
    id: 'analytics',
    icon: BarChart3,
    title: 'Trip Analytics',
    description: 'Every session is logged with safety scores, event timelines, and GPS route data.',
    color: '#6366F1',
    colorBg: '#EEF2FF',
  },
  {
    id: 'privacy',
    icon: Shield,
    title: 'Privacy First',
    description: '100% on-device processing. No video ever leaves your computer. No cloud dependency.',
    color: 'var(--text-secondary)',
    colorBg: 'var(--bg-secondary)',
  },
];

const STATS = [
  { value: '< 15ms', label: 'Detection latency' },
  { value: '468', label: 'Facial landmarks tracked' },
  { value: '27.8m', label: 'Distance driven blind per second at 100 km/h' },
];

export default function OverviewView({
  telemetryData = {},
  isEngineConnected = false,
  onNavigateToMonitor,
  onToggleSimMode,
  isSimMode = false,
  isMonitoring = true,
  onStartMonitoring,
  isRecovering = false,
}) {
  const {
    riskScore = 0,
    riskLevel = 'NOMINAL',
    riskReason = 'NONE',
    ear = 0.33,
    alertMessage = '',
  } = telemetryData || {};

  const isLive = isSimMode || (isEngineConnected && isMonitoring);

  const riskColor = riskLevel === 'CRITICAL'
    ? 'var(--color-critical)'
    : riskLevel === 'WARNING'
    ? 'var(--color-warning)'
    : 'var(--color-safe)';

  const statusLabel = riskLevel === 'CRITICAL' ? 'Critical' : riskLevel === 'WARNING' ? 'Warning' : 'Safe';
  const statusBadge = riskLevel === 'CRITICAL' ? 'badge-critical' : riskLevel === 'WARNING' ? 'badge-warning' : 'badge-safe';

  return (
    <div style={{ width: '100%', backgroundColor: 'var(--bg-primary)' }}>

      {/* Alert banner */}
      {alertMessage && (
        <div style={{ padding: '1rem 1.5rem 0' }}>
          <AlertBanner
            alertMessage={alertMessage}
            riskLevel={riskLevel}
            riskReason={riskReason}
            isRecovering={isRecovering}
          />
        </div>
      )}

      {/* ===== HERO SECTION ===== */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: 'clamp(3rem, 8vw, 6rem) 1.5rem clamp(2rem, 5vw, 4rem)',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: 'clamp(2rem, 5vw, 5rem)',
          alignItems: 'center',
        }}>
          {/* Left: Text content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <span className={`badge ${statusBadge}`} style={{ alignSelf: 'flex-start' }}>
              <span style={{
                width: '5px', height: '5px', borderRadius: '50%',
                backgroundColor: 'currentColor', display: 'inline-block',
              }}
                className={isLive ? 'animate-pulse-live' : ''}
              />
              {isLive ? `Monitoring active · ${statusLabel}` : 'Ready to monitor'}
            </span>

            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: 'var(--text-primary)',
              margin: 0,
            }}>
              Stay Alert.<br />Drive Safer.
            </h1>

            <p style={{
              fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              margin: 0,
              maxWidth: '480px',
            }}>
              Real-time AI monitoring that detects driver fatigue and distraction
              before they become dangerous.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                id="hero-open-monitoring-btn"
                onClick={onNavigateToMonitor}
                className="btn-primary"
                style={{ padding: '0.625rem 1.25rem', fontSize: '0.9375rem' }}
              >
                Open Live Monitoring
                <ArrowRight size={16} />
              </button>
              <button
                id="hero-demo-btn"
                onClick={onToggleSimMode}
                className="btn-secondary"
                style={{ padding: '0.625rem 1.25rem', fontSize: '0.9375rem' }}
              >
                {isSimMode ? 'Stop Demo' : 'Try Demo Mode'}
              </button>
            </div>
          </div>

          {/* Right: Status card */}
          <div className="card" style={{ padding: '1.75rem' }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
            }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Live Status
              </span>
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                fontSize: '0.8125rem',
                color: isLive ? 'var(--color-safe)' : 'var(--text-muted)',
              }}>
                <span style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  backgroundColor: 'currentColor',
                }}
                  className={isLive ? 'animate-pulse-live' : ''}
                />
                {isLive ? 'Active' : 'Standby'}
              </span>
            </div>

            {/* Score display */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '0.75rem',
              marginBottom: '1rem',
            }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '4rem',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                lineHeight: 1,
                color: riskColor,
                transition: 'color 0.3s ease',
              }}>
                {riskScore}
              </div>
              <div style={{ paddingBottom: '0.5rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  Attention Risk Score
                </div>
                <span className={`badge ${statusBadge}`} style={{ marginTop: '0.25rem' }}>
                  {statusLabel}
                </span>
              </div>
            </div>

            {/* EAR metric */}
            <div style={{
              padding: '0.875rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius)',
              marginBottom: '1rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Eye Aspect Ratio</span>
                <span style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: ear < 0.22 ? 'var(--color-critical)' : 'var(--text-primary)',
                }}>
                  {ear?.toFixed(2)}
                  {ear < 0.22 && <span style={{ color: 'var(--color-critical)', marginLeft: '0.375rem', fontSize: '0.75rem' }}>Below threshold</span>}
                </span>
              </div>
              <div style={{ height: '4px', backgroundColor: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{
                  width: `${Math.min(100, (ear / 0.45) * 100)}%`,
                  height: '100%',
                  backgroundColor: ear < 0.22 ? 'var(--color-critical)' : 'var(--color-safe)',
                  borderRadius: '2px',
                  transition: 'width 0.3s ease, background-color 0.3s ease',
                }} />
              </div>
            </div>

            {/* Connection status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Backend connection</span>
              <span style={{
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: isEngineConnected ? 'var(--color-safe)' : 'var(--text-muted)',
              }}>
                {isEngineConnected ? 'Connected' : 'Not connected'}
              </span>
            </div>

            <button
              id="hero-card-open-btn"
              onClick={onNavigateToMonitor}
              className="btn-primary"
              style={{ width: '100%', marginTop: '1.25rem', justifyContent: 'center' }}
            >
              Open Live Monitoring
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* ===== FEATURE CARDS ===== */}
      <section style={{
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: 'clamp(3rem, 6vw, 5rem) 1.5rem',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              marginBottom: '0.5rem',
            }}>
              How it works
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0 }}>
              Four layers of AI-powered safety detection working together.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
          }}>
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  className="card"
                  style={{
                    padding: '1.5rem',
                    transition: 'box-shadow var(--transition), transform var(--transition)',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{
                    width: '40px', height: '40px',
                    backgroundColor: feature.colorBg,
                    borderRadius: 'var(--radius)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '1rem',
                  }}>
                    <Icon size={18} style={{ color: feature.color }} strokeWidth={2} />
                  </div>
                  <h3 style={{
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: '0.5rem',
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    margin: 0,
                  }}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== WHY IT MATTERS ===== */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: 'clamp(3rem, 6vw, 5rem) 1.5rem',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: 'clamp(2rem, 5vw, 5rem)',
          alignItems: 'center',
        }}>
          {/* Left: stats */}
          <div>
            <h2 style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              marginBottom: '0.5rem',
            }}>
              Why driver attention matters
            </h2>
            <p style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: '2rem',
            }}>
              At 100 km/h, a vehicle covers <strong style={{ color: 'var(--text-primary)' }}>27.8 meters per second</strong>.
              A single second of drowsiness is enough to cause a catastrophe.
              DriveGuard AI closes that gap.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {STATS.map((stat, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 1.25rem',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.03em',
                    whiteSpace: 'nowrap',
                    minWidth: '70px',
                  }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Dashboard preview image */}
          <div style={{
            position: 'relative',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-xl)',
          }}>
            <img
              src="https://images.unsplash.com/photo-1491921125492-f0b9c835b699?auto=format&fit=crop&w=900&q=80"
              alt="Driver monitoring in action"
              style={{ width: '100%', height: '320px', objectFit: 'cover', display: 'block' }}
            />
            {/* Overlay card */}
            <div style={{
              position: 'absolute',
              bottom: '1rem',
              left: '1rem',
              right: '1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              borderRadius: 'var(--radius-md)',
              padding: '0.875rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: 'var(--shadow-lg)',
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: 'var(--radius)',
                backgroundColor: 'var(--color-safe-bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Activity size={16} style={{ color: 'var(--color-safe)' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Real-time face analysis
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  468 facial landmarks · &lt;15ms latency
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 768px) {
          section > div[style*="grid-template-columns: minmax(0, 1fr) minmax(0, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
