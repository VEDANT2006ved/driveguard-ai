import React from 'react';
import RiskGauge from '../components/RiskGauge';
import AlertBanner from '../components/AlertBanner';
import DriverIllustration from '../components/DriverIllustration';
import { Camera, Eye, Sliders, Play, Square, Activity, Compass, AlertCircle } from 'lucide-react';

/**
 * LiveMonitorView Component (Wispr Flow Refined Optical Telemetry Cockpit)
 * Combines prominent live webcam feed, real-time facial landmark HUD,
 * responsive mobile stacking, and prominent Wispr-style Start/Stop controls.
 */
export default function LiveMonitorView({
  telemetryData,
  isEngineConnected,
  isSimMode,
  isMonitoring = true,
  onToggleMonitoring,
  onStartMonitoring,
  onStopMonitoring,
  videoStreamUrl,
  onTriggerTestIncident,
  isRecovering = false,
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

  const isLive = isSimMode || (isEngineConnected && isMonitoring);

  return (
    <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Editorial Safety Alert Banner */}
      <AlertBanner
        alertState={riskLevel}
        riskReason={riskReason}
        message={alertMessage}
        isEngineConnected={isEngineConnected || isSimMode}
        isMonitoring={isMonitoring}
        isRecovering={isRecovering}
      />

      {/* Viewport Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <span className="label-editorial" style={{ color: 'var(--color-purple)' }}>
            02 // LIVE COCKPIT HUD
          </span>
          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginTop: '0.2rem',
              letterSpacing: '-0.03em',
            }}
          >
            Optical Telemetry Cockpit
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span
            className="font-mono"
            style={{
              fontSize: '0.74rem',
              color: isLive ? 'var(--text-primary)' : 'var(--text-muted)',
              backgroundColor: 'var(--bg-surface-warm)',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            PIPELINE: {isEngineConnected ? (isMonitoring ? 'WEBSOCKET_MJPEG (ACTIVE)' : 'STANDBY (PAUSED)') : isSimMode ? 'TEST HARNESS' : 'DISCONNECTED'}
          </span>

          {isEngineConnected && (
            <button
              onClick={onToggleMonitoring}
              className="pill-btn"
              style={{
                backgroundColor: isMonitoring ? '#FEE2E2' : 'var(--color-lavender)',
                color: isMonitoring ? '#991B1B' : 'var(--color-lavender-ink)',
                borderColor: isMonitoring ? '#FCA5A5' : 'var(--color-lavender-border)',
                padding: '0.55rem 1.4rem',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              {isMonitoring ? (
                <>
                  <Square size={13} fill="#991B1B" />
                  <span>Stop Monitoring</span>
                </>
              ) : (
                <>
                  <Play size={13} fill="#22103E" />
                  <span>Start Monitoring</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Main Responsive Split Grid (2-column on desktop, stacked on mobile <=960px) */}
      <div className="live-monitor-grid">
        {/* Left: Video Canvas / Optical Viewport */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-card)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 8px 30px rgba(23, 23, 23, 0.04)',
          }}
        >
          {/* Viewport Header Bar */}
          <div
            style={{
              padding: '0.85rem 1.45rem',
              borderBottom: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-canvas-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--color-lavender)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Camera size={13} color="#22103E" />
              </div>
              <span className="label-editorial" style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                CAM_01 // 640x480 RAW OPTICAL STREAM
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: isLive ? '#10B981' : '#9E988F',
                }}
                className={isLive ? 'animate-pulse-live' : ''}
              />
              <span className="font-mono" style={{ fontSize: '0.72rem', color: isLive ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {isEngineConnected ? (isMonitoring ? `${fps} FPS` : 'PAUSED') : 'STANDBY'}
              </span>
            </div>
          </div>

          {/* Video Stream Area */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              minHeight: 'clamp(280px, 48vw, 440px)',
              backgroundColor: '#EDE8E0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {isEngineConnected && videoStreamUrl ? (
              <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: 'clamp(280px, 48vw, 440px)' }}>
                <img
                  src={videoStreamUrl}
                  alt="Live Driver Safety Optical HUD"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    filter: !isMonitoring ? 'grayscale(0.4) contrast(0.95)' : 'none',
                    transition: 'filter 0.3s ease',
                  }}
                />
                {!isMonitoring && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(250, 248, 242, 0.88)',
                      backdropFilter: 'blur(6px)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '2.5rem',
                      textAlign: 'center',
                      zIndex: 10,
                    }}
                  >
                    <DriverIllustration
                      state="NOMINAL"
                      size={180}
                      animated={false}
                    />
                    <span className="label-editorial" style={{ color: 'var(--color-alert)', marginTop: '1rem', fontWeight: 700 }}>
                      // OPTICAL CAPTURE HALTED
                    </span>
                    <h3 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem', marginTop: '0.2rem' }}>
                      Live Monitoring is Paused
                    </h3>
                    <p style={{ maxWidth: '420px', fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '1.5rem' }}>
                      Webcam capture and MediaPipe neural inference are halted. Camera hardware is released and driver privacy is safeguarded.
                    </p>
                    <button
                      onClick={onStartMonitoring}
                      className="pill-btn pill-btn-lavender"
                      style={{ padding: '0.75rem 1.85rem' }}
                    >
                      <Play size={14} fill="#22103E" />
                      <span>Resume Live Monitoring</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* High-end Editorial Calibration Canvas when waiting for camera */
              <div
                style={{
                  width: '100%',
                  minHeight: 'clamp(280px, 48vw, 440px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2.5rem',
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                <DriverIllustration
                  state={riskLevel}
                  size={240}
                  animated={true}
                />

                <div style={{ maxWidth: '440px', zIndex: 2, marginTop: '1.25rem' }}>
                  <h4 className="font-display" style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                    {isSimMode ? 'Simulation Test Harness Active' : 'Waiting for Python Optical Engine'}
                  </h4>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '1.25rem' }}>
                    {isSimMode
                      ? 'Simulated driver events are currently driving the risk gauge and alert chimes.'
                      : 'To stream your webcam through the MediaPipe neural detection pipeline, start the Python engine:'}
                  </p>

                  {!isSimMode && (
                    <code
                      className="font-mono"
                      style={{
                        display: 'inline-block',
                        padding: '0.45rem 1rem',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '9999px',
                        color: 'var(--text-primary)',
                        fontSize: '0.82rem',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      }}
                    >
                      python backend/server.py
                    </code>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Viewport Telemetry Footer Bar */}
          <div
            className="font-mono"
            style={{
              padding: '0.85rem 1.45rem',
              backgroundColor: '#FFFFFF',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem',
              fontSize: '0.74rem',
              color: 'var(--text-secondary)',
            }}
          >
            <span>MODE: {isEngineConnected ? (isMonitoring ? 'LIVE CAMERA (OPENCV)' : 'STANDBY (CAMERA RELEASED)') : isSimMode ? 'SYNTHETIC' : 'OFFLINE'}</span>
            <span>EYES CLOSED ACCUMULATION: {isLive ? `${eyesClosedTime.toFixed(1)}s` : '--'}</span>
          </div>
        </div>

        {/* Right: Editorial Biometric Meters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Risk Gauge Card */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-card)',
              padding: '2rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 4px 20px rgba(23, 23, 23, 0.03)',
            }}
          >
            <span className="label-editorial" style={{ marginBottom: '1rem', color: 'var(--color-purple)' }}>
              DYNAMIC ATTENTIVENESS INDEX
            </span>
            <RiskGauge
              score={isLive ? riskScore : 0}
              level={isLive ? riskLevel : (isEngineConnected && !isMonitoring ? 'PAUSED' : 'STANDBY')}
              isLive={isLive}
              size={190}
            />
          </div>

          {/* EAR & MAR Threshold Levels */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-card)',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.4rem',
              boxShadow: '0 4px 20px rgba(23, 23, 23, 0.03)',
            }}
          >
            <span className="label-editorial" style={{ color: 'var(--text-secondary)' }}>
              BIOMETRIC SIGNAL RATIOS
            </span>

            {/* EAR */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.84rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                  Eye Aspect Ratio (EAR)
                </span>
                <span className="font-mono" style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                  {isLive ? ear.toFixed(2) : '--'} <span style={{ color: 'var(--text-muted)' }}>/ 0.22 crit</span>
                </span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-surface-warm)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: isLive ? `${Math.min(100, (ear / 0.45) * 100)}%` : '0%',
                    height: '100%',
                    backgroundColor: ear < 0.22 ? 'var(--color-alert)' : 'var(--bg-emerald)',
                    borderRadius: '9999px',
                    transition: 'width 0.2s ease, background-color 0.2s ease',
                  }}
                />
              </div>
            </div>

            {/* MAR */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.84rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                  Mouth Aspect Ratio (MAR)
                </span>
                <span className="font-mono" style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                  {isLive ? mar.toFixed(2) : '--'} <span style={{ color: 'var(--text-muted)' }}>/ 0.55 warn</span>
                </span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-surface-warm)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: isLive ? `${Math.min(100, (mar / 0.8) * 100)}%` : '0%',
                    height: '100%',
                    backgroundColor: mar > 0.55 ? 'var(--color-warning)' : 'var(--bg-emerald)',
                    borderRadius: '9999px',
                    transition: 'width 0.2s ease, background-color 0.2s ease',
                  }}
                />
              </div>
            </div>

            {/* Head Orientation */}
            <div
              className="font-mono"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '0.5rem',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '1rem',
                fontSize: '0.75rem',
                textAlign: 'center',
              }}
            >
              <div style={{ backgroundColor: 'var(--bg-canvas-subtle)', padding: '0.5rem 0.25rem', borderRadius: '12px' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.62rem', letterSpacing: '0.08em' }}>PITCH</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{isLive ? `${headPitch.toFixed(1)}°` : '--'}</span>
              </div>
              <div style={{ backgroundColor: 'var(--bg-canvas-subtle)', padding: '0.5rem 0.25rem', borderRadius: '12px' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.62rem', letterSpacing: '0.08em' }}>YAW</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{isLive ? `${headYaw.toFixed(1)}°` : '--'}</span>
              </div>
              <div style={{ backgroundColor: 'var(--bg-canvas-subtle)', padding: '0.5rem 0.25rem', borderRadius: '12px' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.62rem', letterSpacing: '0.08em' }}>ROLL</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{isLive ? `${headRoll.toFixed(1)}°` : '--'}</span>
              </div>
            </div>
          </div>

          {/* Diagnostics Test Harness Controls */}
          {isSimMode && (
            <div
              style={{
                backgroundColor: 'var(--bg-lavender-card)',
                border: '1.5px solid var(--color-lavender-border)',
                borderRadius: 'var(--radius-card)',
                padding: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <Sliders size={14} color="var(--color-purple)" />
                <span className="label-editorial" style={{ color: 'var(--color-purple)', fontWeight: 700 }}>
                  DIAGNOSTICS SIMULATION HARNESS
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  onClick={() => onTriggerTestIncident?.('NORMAL')}
                  className="pill-btn pill-btn-ghost"
                  style={{ backgroundColor: '#FFFFFF', padding: '0.5rem', fontSize: '0.76rem' }}
                >
                  SIMULATE NORMAL ATTENTION
                </button>
                <button
                  onClick={() => onTriggerTestIncident?.('HEAD_DOWN')}
                  className="pill-btn pill-btn-ghost"
                  style={{ backgroundColor: '#FFFFFF', padding: '0.5rem', fontSize: '0.76rem' }}
                >
                  SIMULATE HEAD-DOWN (DISTRACTION)
                </button>
                <button
                  onClick={() => onTriggerTestIncident?.('WARNING')}
                  className="pill-btn pill-btn-ghost"
                  style={{ backgroundColor: '#FFFFFF', color: 'var(--color-warning)', padding: '0.5rem', fontSize: '0.76rem' }}
                >
                  SIMULATE YAWN (WARNING)
                </button>
                <button
                  onClick={() => onTriggerTestIncident?.('CRITICAL')}
                  className="pill-btn"
                  style={{ backgroundColor: 'var(--color-alert)', color: '#FFFFFF', padding: '0.5rem', fontSize: '0.76rem' }}
                >
                  SIMULATE EYE CLOSURE (CRITICAL)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
