import React from 'react';
import RiskGauge from '../components/RiskGauge';
import AlertBanner from '../components/AlertBanner';
import DriverIllustration from '../components/DriverIllustration';
import GpsTripPanel from '../components/GpsTripPanel';
import { Camera, Eye, Sliders, Play, Square, Activity, Compass, AlertCircle, Radio, Terminal } from 'lucide-react';

/**
 * LiveMonitorView Component (VANTAGE Luxury Automotive Editorial Reset)
 * Keeps the real webcam feed as the primary visual with a refined cinematic frame,
 * elegant technical labels, well-aligned biometric measurements, and clear warning states.
 */
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

  const getRiskBorder = () => {
    if (!isLive) return 'var(--border-subtle)';
    if (riskLevel === 'CRITICAL' || riskScore >= 70) return 'var(--color-accent-red)';
    if (riskLevel === 'WARNING' || riskScore >= 35) return 'var(--color-warning)';
    return 'var(--border-subtle)';
  };

  return (
    <div className="cinematic-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span style={{ width: '6px', height: '6px', backgroundColor: isLive ? 'var(--color-accent-green)' : 'var(--text-muted)' }} className={isLive ? 'telemetry-pulse' : ''} />
            <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.14em' }}>
              SECTION 02 // REAL-TIME OPTICAL COCKPIT
            </span>
          </div>

          <h1
            className="font-condensed"
            style={{
              fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
              lineHeight: 0.95,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            OPTICAL TELEMETRY HUD.
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span
            className="font-mono"
            style={{
              fontSize: '0.74rem',
              color: isLive ? 'var(--text-primary)' : 'var(--text-muted)',
              backgroundColor: 'var(--bg-ivory-subtle)',
              padding: '0.45rem 1rem',
              borderRadius: '2px',
              border: '1px solid var(--border-subtle)',
              letterSpacing: '0.06em',
            }}
          >
            FEED: {isEngineConnected ? (isMonitoring ? 'WEBSOCKET_MJPEG (ACTIVE)' : 'STANDBY (PAUSED)') : isSimMode ? 'SIMULATION' : 'OFFLINE'}
          </span>

          {isEngineConnected && (
            <button
              onClick={onToggleMonitoring}
              className="vantage-btn"
              style={{
                backgroundColor: isMonitoring ? '#111111' : 'var(--text-primary)',
                borderColor: 'var(--text-primary)',
                padding: '0.55rem 1.45rem',
              }}
            >
              {isMonitoring ? (
                <>
                  <Square size={12} fill="#FFFFFF" />
                  <span>HALT SENSING</span>
                </>
              ) : (
                <>
                  <Play size={12} fill="#FFFFFF" />
                  <span>START MONITORING</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Main Responsive Split Grid (2-column on desktop, stacked on mobile) */}
      <div className="live-monitor-grid">
        {/* Left: Primary Optical Viewport Frame */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: `1.5px solid ${getRiskBorder()}`,
            borderRadius: 'var(--radius-card)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--shadow-md)',
            transition: 'border-color 0.3s ease',
          }}
        >
          {/* Viewport Technical Header Bar */}
          <div
            style={{
              padding: '0.85rem 1.45rem',
              borderBottom: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-ivory-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Camera size={14} color="var(--text-primary)" />
              <span className="font-mono" style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.08em' }}>
                CAM_01 // 640x480 RAW OPTICAL STREAM
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: isLive ? 'var(--color-accent-green)' : 'var(--text-muted)',
                }}
                className={isLive ? 'telemetry-pulse' : ''}
              />
              <span className="font-mono" style={{ fontSize: '0.72rem', color: isLive ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {isEngineConnected ? (isMonitoring ? `${fps} FPS` : 'CAMERA RELEASED') : 'STANDBY'}
              </span>
            </div>
          </div>

          {/* Video Stream Area */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              minHeight: 'clamp(320px, 48vw, 480px)',
              backgroundColor: '#111214',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {isEngineConnected && videoStreamUrl ? (
              <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: 'clamp(320px, 48vw, 480px)' }}>
                <img
                  src={videoStreamUrl}
                  alt="Live Driver Safety Optical Feed"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    filter: !isMonitoring ? 'grayscale(0.6) contrast(0.95)' : 'none',
                    transition: 'filter 0.3s ease',
                  }}
                />

                {/* Subtle laser scan line overlay when monitoring */}
                {isMonitoring && (
                  <div
                    className="animate-laser-scan"
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      height: '1.5px',
                      backgroundColor: 'rgba(16, 185, 129, 0.8)',
                      boxShadow: '0 0 10px rgba(16, 185, 129, 0.8)',
                      pointerEvents: 'none',
                    }}
                  />
                )}

                {/* Halted Overlay */}
                {!isMonitoring && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(13, 14, 16, 0.9)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '2.5rem',
                      textAlign: 'center',
                      zIndex: 10,
                      color: '#FFFFFF',
                    }}
                  >
                    <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--color-accent-red)', letterSpacing: '0.12em', fontWeight: 600 }}>
                      // SENSOR CAPTURE HALTED
                    </span>
                    <h3 className="font-condensed" style={{ fontSize: '2rem', fontWeight: 600, textTransform: 'uppercase', margin: '0.5rem 0' }}>
                      MONITORING IS PAUSED
                    </h3>
                    <p className="font-sans" style={{ maxWidth: '420px', fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.55, marginBottom: '1.75rem' }}>
                      Webcam hardware has been cleanly released and neural inference is halted. Driver privacy is protected.
                    </p>
                    <button
                      onClick={onStartMonitoring}
                      className="vantage-btn"
                      style={{
                        backgroundColor: '#FFFFFF',
                        color: '#000000',
                        borderColor: '#FFFFFF',
                        padding: '0.75rem 2rem',
                      }}
                    >
                      <Play size={13} fill="#000000" />
                      <span>RESUME MONITORING</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* High-End Calibration Canvas */
              <div
                style={{
                  width: '100%',
                  minHeight: 'clamp(320px, 48vw, 480px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2.5rem',
                  textAlign: 'center',
                  position: 'relative',
                  backgroundColor: 'var(--bg-canvas)',
                }}
              >
                <DriverIllustration state={riskLevel} size={240} animated={true} />

                <div style={{ maxWidth: '440px', marginTop: '1.5rem' }}>
                  <h4 className="font-condensed" style={{ fontSize: '1.6rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>
                    {isSimMode ? 'Simulation Test Harness Active' : 'Waiting for Python Optical Pipeline'}
                  </h4>
                  <p className="font-sans" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '1.25rem' }}>
                    {isSimMode
                      ? 'Simulated driver events are currently driving the risk gauge and acoustic warnings.'
                      : 'To stream your webcam through the MediaPipe neural detection pipeline, start the Python engine:'}
                  </p>

                  {!isSimMode && (
                    <code
                      className="font-mono"
                      style={{
                        display: 'inline-block',
                        padding: '0.5rem 1.25rem',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '2px',
                        color: 'var(--text-primary)',
                        fontSize: '0.84rem',
                        boxShadow: 'var(--shadow-sm)',
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
              backgroundColor: 'var(--bg-ivory-subtle)',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem',
              fontSize: '0.74rem',
              color: 'var(--text-secondary)',
              letterSpacing: '0.04em',
            }}
          >
            <span>
              MODE: {isEngineConnected ? (isMonitoring ? 'LIVE CAMERA (OPENCV)' : 'STANDBY (CAMERA RELEASED)') : isSimMode ? 'SYNTHETIC HARNESS' : 'OFFLINE'}
            </span>
            <span>EYES CLOSED DURATION: {isLive ? `${eyesClosedTime.toFixed(1)}S` : '--'}</span>
          </div>
        </div>

        {/* Right: Technical Biometric Meters & Risk Dial */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Risk Gauge Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-card)',
              padding: '2rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <span className="label-editorial" style={{ marginBottom: '1.25rem', color: 'var(--text-secondary)' }}>
              DYNAMIC ATTENTIVENESS INDEX
            </span>
            <RiskGauge
              score={isLive ? riskScore : 0}
              level={isLive ? riskLevel : isEngineConnected && !isMonitoring ? 'PAUSED' : 'STANDBY'}
              isLive={isLive}
              size={195}
            />
          </div>

          {/* EAR & MAR Ratio Bars */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-card)',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <span className="label-editorial" style={{ color: 'var(--text-secondary)' }}>
              BIOMETRIC SIGNAL RATIOS
            </span>

            {/* EAR */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span className="font-condensed" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                  EYE ASPECT RATIO (EAR)
                </span>
                <span className="font-mono" style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                  {isLive ? ear.toFixed(2) : '--'} <span style={{ color: 'var(--text-muted)' }}>/ 0.22 CRIT</span>
                </span>
              </div>
              <div style={{ width: '100%', height: '5px', backgroundColor: 'var(--bg-ivory-subtle)', borderRadius: '2px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: isLive ? `${Math.min(100, (ear / 0.45) * 100)}%` : '0%',
                    height: '100%',
                    backgroundColor: ear < 0.22 ? 'var(--color-accent-red)' : 'var(--text-primary)',
                    transition: 'width 0.25s ease',
                  }}
                />
              </div>
            </div>

            {/* MAR */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span className="font-condensed" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                  MOUTH ASPECT RATIO (MAR)
                </span>
                <span className="font-mono" style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                  {isLive ? mar.toFixed(2) : '--'} <span style={{ color: 'var(--text-muted)' }}>/ 0.55 WARN</span>
                </span>
              </div>
              <div style={{ width: '100%', height: '5px', backgroundColor: 'var(--bg-ivory-subtle)', borderRadius: '2px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: isLive ? `${Math.min(100, (mar / 0.8) * 100)}%` : '0%',
                    height: '100%',
                    backgroundColor: mar > 0.55 ? 'var(--color-warning)' : 'var(--text-primary)',
                    transition: 'width 0.25s ease',
                  }}
                />
              </div>
            </div>

            {/* 3D Cranial Pose Angle Boxes */}
            <div
              className="font-mono"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.65rem',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '1.25rem',
                fontSize: '0.75rem',
                textAlign: 'center',
              }}
            >
              <div style={{ backgroundColor: 'var(--bg-ivory-subtle)', padding: '0.65rem 0.35rem', borderRadius: '2px' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem', letterSpacing: '0.08em' }}>PITCH</span>
                <span className="font-condensed" style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.15rem' }}>
                  {isLive ? `${headPitch.toFixed(1)}°` : '--'}
                </span>
              </div>
              <div style={{ backgroundColor: 'var(--bg-ivory-subtle)', padding: '0.65rem 0.35rem', borderRadius: '2px' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem', letterSpacing: '0.08em' }}>YAW</span>
                <span className="font-condensed" style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.15rem' }}>
                  {isLive ? `${headYaw.toFixed(1)}°` : '--'}
                </span>
              </div>
              <div style={{ backgroundColor: 'var(--bg-ivory-subtle)', padding: '0.65rem 0.35rem', borderRadius: '2px' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem', letterSpacing: '0.08em' }}>ROLL</span>
                <span className="font-condensed" style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.15rem' }}>
                  {isLive ? `${headRoll.toFixed(1)}°` : '--'}
                </span>
              </div>
            </div>
          </div>

          {/* Diagnostics Test Harness Controls */}
          {isSimMode && (
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-card)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Sliders size={14} color="var(--text-primary)" />
                <span className="label-editorial" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                  DIAGNOSTICS SIMULATION HARNESS
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  onClick={() => onTriggerTestIncident?.('NORMAL')}
                  className="vantage-btn vantage-btn-outline"
                  style={{ padding: '0.55rem', fontSize: '0.78rem' }}
                >
                  SIMULATE NORMAL ATTENTION
                </button>
                <button
                  onClick={() => onTriggerTestIncident?.('HEAD_DOWN')}
                  className="vantage-btn vantage-btn-outline"
                  style={{ padding: '0.55rem', fontSize: '0.78rem' }}
                >
                  SIMULATE HEAD-DOWN (DISTRACTION)
                </button>
                <button
                  onClick={() => onTriggerTestIncident?.('WARNING')}
                  className="vantage-btn vantage-btn-outline"
                  style={{ color: 'var(--color-warning)', borderColor: 'rgba(217, 119, 6, 0.4)', padding: '0.55rem', fontSize: '0.78rem' }}
                >
                  SIMULATE YAWN (WARNING)
                </button>
                <button
                  onClick={() => onTriggerTestIncident?.('CRITICAL')}
                  className="vantage-btn"
                  style={{ backgroundColor: 'var(--color-accent-red)', borderColor: 'var(--color-accent-red)', padding: '0.55rem', fontSize: '0.78rem' }}
                >
                  SIMULATE EYE CLOSURE (CRITICAL)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* GPS Trip Route & Distance Telemetry Section */}
      <GpsTripPanel />
    </div>
  );
}
