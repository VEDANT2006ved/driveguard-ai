import React, { useState } from 'react';
import RiskGauge from '../components/RiskGauge';
import AlertBanner from '../components/AlertBanner';
import DriverIllustration from '../components/DriverIllustration';
import GpsTripPanel from '../components/GpsTripPanel';
import {
  Camera, Play, Square, Sliders, Copy, Check,
  Eye, Activity, Compass,
} from 'lucide-react';

export default function LiveMonitorView({
  telemetryData = {},
  isEngineConnected = false,
  isSimMode = false,
  isMonitoring = true,
  onToggleMonitoring,
  onStartMonitoring,
  onStopMonitoring,
  videoStreamUrl,
  onTriggerTestIncident,
  isRecovering = false,
  onOpenDiagnostics,
  onToggleSimMode,
}) {
  const {
    riskScore = 0,
    riskLevel = 'NOMINAL',
    riskReason = 'NONE',
    ear = 0.33,
    mar = 0.12,
    headPitch = 0.5,
    headYaw = 1.2,
    headRoll = -0.4,
    alertMessage = '',
    fps = 0,
    eyesClosedTime = 0,
  } = telemetryData || {};

  const [copiedCmd, setCopiedCmd] = useState(false);
  const [activeScenario, setActiveScenario] = useState('NORMAL');

  const isLive = isSimMode || (isEngineConnected && isMonitoring);

  const handleCopyCommand = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('python run_production_bridge.py');
      setCopiedCmd(true);
      setTimeout(() => setCopiedCmd(false), 2200);
    }
  };

  const handleScenarioSelect = (scenarioKey) => {
    setActiveScenario(scenarioKey);
    if (!isSimMode && onToggleSimMode && !isEngineConnected) {
      onToggleSimMode();
    }
    onTriggerTestIncident?.(scenarioKey);
  };

  const earPct    = Math.min(100, (ear / 0.45) * 100);
  const marPct    = Math.min(100, (mar / 0.8)  * 100);
  const earAlert  = ear < 0.22;
  const marAlert  = mar > 0.55;

  const riskColor = riskLevel === 'CRITICAL'
    ? 'var(--color-critical)'
    : riskLevel === 'WARNING'
    ? 'var(--color-warning)'
    : 'var(--color-safe)';

  const SCENARIOS = [
    { key: 'NORMAL',   label: 'Normal Driving', color: 'var(--color-safe)',     bg: 'var(--color-safe-bg)' },
    { key: 'CRITICAL', label: 'Microsleep',      color: 'var(--color-critical)', bg: 'var(--color-critical-bg)' },
    { key: 'HEAD_DOWN',label: 'Head Down',       color: 'var(--color-warning)',  bg: 'var(--color-warning-bg)' },
    { key: 'WARNING',  label: 'Yawning',         color: 'var(--color-warning)',  bg: 'var(--color-warning-bg)' },
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
      {/* Alert banner */}
      <AlertBanner
        alertState={riskLevel}
        riskReason={riskReason}
        message={alertMessage}
        isEngineConnected={isEngineConnected || isSimMode}
        isMonitoring={isMonitoring}
        isRecovering={isRecovering}
      />

      {/* Page header */}
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
            Live Monitoring
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
            Real-time facial analysis — eye tracking, head pose, and fatigue detection.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Status badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.375rem 0.875rem',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'var(--bg-secondary)',
            fontSize: '0.8125rem',
            fontWeight: 500,
          }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              backgroundColor: isLive ? 'var(--color-safe)' : 'var(--text-muted)',
            }}
              className={isLive ? 'animate-pulse-live' : ''}
            />
            {isEngineConnected ? `Connected · ${fps || 30} FPS` : isSimMode ? 'Demo mode' : 'Not connected'}
          </div>

          {/* Start / Stop */}
          {isMonitoring ? (
            <button
              id="monitor-stop-btn"
              onClick={onStopMonitoring || onToggleMonitoring}
              className="btn-secondary"
              style={{ gap: '0.375rem' }}
            >
              <Square size={12} fill="currentColor" />
              Stop Monitoring
            </button>
          ) : (
            <button
              id="monitor-start-btn"
              onClick={onStartMonitoring || onToggleMonitoring}
              className="btn-primary"
              style={{ gap: '0.375rem' }}
            >
              <Play size={12} fill="currentColor" />
              Start Monitoring
            </button>
          )}

          {/* Settings */}
          <button id="monitor-settings-btn" onClick={onOpenDiagnostics} className="btn-icon" title="Configure backend">
            <Sliders size={15} />
          </button>
        </div>
      </div>

      {/* Main 2-column grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
        gap: '1.25rem',
        alignItems: 'start',
      }}>
        {/* ===== LEFT: Camera feed ===== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card" style={{
            overflow: 'hidden',
            aspectRatio: '4/3',
            backgroundColor: '#0F0F0F',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}>
            {/* Camera header */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              zIndex: 10,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 1rem',
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Camera size={13} style={{ color: 'rgba(255,255,255,0.7)' }} />
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                  Camera Feed
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <span style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  backgroundColor: isLive ? 'var(--color-safe)' : '#888',
                }}
                  className={isLive ? 'animate-pulse-live' : ''}
                />
                <span style={{ fontSize: '0.75rem', color: isLive ? '#4ADE80' : '#888', fontWeight: 500 }}>
                  {isLive ? 'Live' : 'Standby'}
                </span>
              </div>
            </div>

            {/* Video or standby */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isEngineConnected && videoStreamUrl ? (
                <>
                  <img
                    src={videoStreamUrl}
                    alt="Live camera feed with face detection"
                    style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <div className="animate-laser-scan" />
                </>
              ) : (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '2rem 1.5rem',
                  gap: '1.25rem',
                  color: 'white',
                  width: '100%',
                }}>
                  <DriverIllustration state={riskLevel} size={120} theme="dark" />

                  <div>
                    <h3 style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      color: 'white',
                      margin: '0 0 0.375rem 0',
                    }}>
                      Waiting for camera
                    </h3>
                    <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)', margin: 0, maxWidth: '340px', lineHeight: 1.5 }}>
                      Run the Python backend on your computer to stream your webcam.
                    </p>
                  </div>

                  {/* Copy command */}
                  <div
                    id="copy-cmd-box"
                    onClick={handleCopyCommand}
                    title="Click to copy"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      padding: '0.5rem 0.875rem',
                      borderRadius: 'var(--radius)',
                      fontSize: '0.8125rem',
                      color: 'rgba(255,255,255,0.8)',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-mono)',
                      transition: 'background-color var(--transition-fast)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
                  >
                    <code>python run_production_bridge.py</code>
                    {copiedCmd ? <Check size={13} color="#4ADE80" /> : <Copy size={13} color="rgba(255,255,255,0.5)" />}
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button
                      id="open-settings-btn"
                      onClick={onOpenDiagnostics}
                      style={{
                        padding: '0.4375rem 0.875rem',
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'rgba(255,255,255,0.7)',
                        borderRadius: 'var(--radius)',
                        fontSize: '0.8125rem',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-sans)',
                        transition: 'border-color var(--transition-fast)',
                      }}
                    >
                      Configure backend
                    </button>
                    <button
                      id="launch-demo-btn"
                      onClick={() => handleScenarioSelect('NORMAL')}
                      style={{
                        padding: '0.4375rem 1rem',
                        backgroundColor: 'white',
                        border: 'none',
                        color: '#171717',
                        borderRadius: 'var(--radius)',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: 'var(--font-sans)',
                      }}
                    >
                      ⚡ Launch Demo
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Camera footer bar */}
            {(isLive || isEngineConnected) && (
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '0.5rem 1rem',
                background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.6)',
                zIndex: 10,
              }}>
                <span>{isEngineConnected ? 'Live hardware' : isSimMode ? 'Demo mode' : 'Offline'}</span>
                {eyesClosedTime > 0 && <span style={{ color: 'var(--color-critical)' }}>Eyes closed: {eyesClosedTime.toFixed(1)}s</span>}
                <span>Pitch {headPitch?.toFixed(1)}° · Yaw {headYaw?.toFixed(1)}°</span>
              </div>
            )}
          </div>
        </div>

        {/* ===== RIGHT: Metrics ===== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Risk gauge */}
          <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Attention Risk</span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                {riskReason !== 'NONE' ? riskReason.replace(/_/g, ' ').toLowerCase() : 'All normal'}
              </span>
            </div>
            <RiskGauge score={riskScore} level={riskLevel} isLive={isLive} size={180} />
          </div>

          {/* Biometric metrics */}
          <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Biometric Readings</span>

            {/* EAR */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Eye size={13} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Eye Aspect Ratio (EAR)</span>
                </div>
                <span style={{
                  fontSize: '0.8125rem', fontWeight: 600,
                  color: earAlert ? 'var(--color-critical)' : 'var(--text-primary)',
                }}>
                  {ear?.toFixed(2)}
                  {earAlert && <span style={{ fontSize: '0.7rem', marginLeft: '0.3rem', color: 'var(--color-critical)' }}>↓ low</span>}
                </span>
              </div>
              <div style={{ height: '5px', backgroundColor: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  width: `${earPct}%`, height: '100%',
                  backgroundColor: earAlert ? 'var(--color-critical)' : 'var(--color-safe)',
                  borderRadius: '3px',
                  transition: 'width 0.25s ease, background-color 0.25s ease',
                }} />
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Critical threshold: &lt; 0.22
              </div>
            </div>

            {/* MAR */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Activity size={13} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Mouth Aspect Ratio (MAR)</span>
                </div>
                <span style={{
                  fontSize: '0.8125rem', fontWeight: 600,
                  color: marAlert ? 'var(--color-warning)' : 'var(--text-primary)',
                }}>
                  {mar?.toFixed(2)}
                  {marAlert && <span style={{ fontSize: '0.7rem', marginLeft: '0.3rem', color: 'var(--color-warning)' }}>↑ yawning</span>}
                </span>
              </div>
              <div style={{ height: '5px', backgroundColor: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  width: `${marPct}%`, height: '100%',
                  backgroundColor: marAlert ? 'var(--color-warning)' : 'var(--text-secondary)',
                  borderRadius: '3px',
                  transition: 'width 0.25s ease, background-color 0.25s ease',
                }} />
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Warning threshold: &gt; 0.55
              </div>
            </div>

            {/* Head pose */}
            <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.625rem' }}>
                <Compass size={13} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Head Pose</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {[
                  { label: 'Pitch', value: headPitch },
                  { label: 'Yaw', value: headYaw },
                  { label: 'Roll', value: headRoll },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    textAlign: 'center',
                    padding: '0.625rem 0.5rem',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius)',
                  }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{label}</div>
                    <div style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.0625rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      letterSpacing: '-0.02em',
                    }}>
                      {value?.toFixed(1)}°
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Test scenarios */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ marginBottom: '0.875rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Test Detection
              </span>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0' }}>
                Simulate scenarios to test alert responses.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {SCENARIOS.map(({ key, label, color, bg }) => {
                const isActive = activeScenario === key && isSimMode;
                return (
                  <button
                    id={`scenario-${key.toLowerCase()}-btn`}
                    key={key}
                    onClick={() => handleScenarioSelect(key)}
                    style={{
                      padding: '0.5rem 0.625rem',
                      border: `1px solid ${isActive ? color : 'var(--border)'}`,
                      borderRadius: 'var(--radius)',
                      backgroundColor: isActive ? bg : 'transparent',
                      color: isActive ? color : 'var(--text-secondary)',
                      fontSize: '0.8125rem',
                      fontWeight: isActive ? 600 : 400,
                      cursor: 'pointer',
                      fontFamily: 'var(--font-sans)',
                      transition: 'all var(--transition-fast)',
                      textAlign: 'left',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* GPS panel */}
      <GpsTripPanel />

      {/* Responsive layout */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: minmax(0, 1.4fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
