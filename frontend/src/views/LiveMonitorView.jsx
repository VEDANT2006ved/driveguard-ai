import React, { useState } from 'react';
import RiskGauge from '../components/RiskGauge';
import AlertBanner from '../components/AlertBanner';
import DriverIllustration from '../components/DriverIllustration';
import InteractiveCockpit3D from '../components/InteractiveCockpit3D';
import { Camera, Eye, Sliders, Play, Square, Activity, Compass, AlertCircle, Radio, Sparkles, Box } from 'lucide-react';

/**
 * LiveMonitorView Component (Phase 2: Cinematic Optical & 3D Kinematics Cockpit)
 * Combines live webcam stream with 3D WebGL kinematics cockpit toggle,
 * dynamic risk aura feedback, responsive layout, and ergonomic controls.
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
  const [viewportMode, setViewportMode] = useState('camera'); // 'camera' | '3d'

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

  // Dynamic Aura calculation based on risk score
  const getRiskAura = () => {
    if (!isLive) return '0 8px 30px rgba(23, 23, 23, 0.04)';
    if (riskLevel === 'CRITICAL' || riskScore >= 70) {
      return '0 16px 50px rgba(225, 29, 72, 0.28)';
    }
    if (riskLevel === 'WARNING' || riskScore >= 35) {
      return '0 12px 40px rgba(245, 158, 11, 0.22)';
    }
    return '0 10px 36px rgba(16, 185, 129, 0.1)';
  };

  const getRiskBorder = () => {
    if (!isLive) return 'var(--border-subtle)';
    if (riskLevel === 'CRITICAL' || riskScore >= 70) return 'rgba(225, 29, 72, 0.5)';
    if (riskLevel === 'WARNING' || riskScore >= 35) return 'rgba(245, 158, 11, 0.5)';
    return 'var(--border-subtle)';
  };

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
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: 'var(--color-accent-purple-light)',
              color: 'var(--color-accent-purple-dark)',
              borderRadius: '9999px',
              padding: '0.3rem 0.85rem',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              letterSpacing: '0.04em',
              marginBottom: '0.5rem',
            }}
          >
            <Radio size={12} className={isLive ? 'animate-pulse-live' : ''} />
            <span>02 // OPTICAL &amp; 3D KINEMATICS COCKPIT</span>
          </div>

          <h1
            className="font-serif"
            style={{
              fontSize: 'clamp(2.2rem, 4.2vw, 3.4rem)',
              fontWeight: 400,
              lineHeight: 1.12,
              letterSpacing: '-0.025em',
              color: 'var(--text-primary)',
              margin: '0.1rem 0 0 0',
            }}
          >
            Driver <em>attentiveness</em> cockpit.
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          {/* Viewport Mode Switcher (Camera vs 3D) */}
          <div
            style={{
              display: 'inline-flex',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '9999px',
              padding: '3px',
              gap: '3px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <button
              onClick={() => setViewportMode('camera')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 1rem',
                borderRadius: '9999px',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: viewportMode === 'camera' ? 'var(--text-primary)' : 'transparent',
                color: viewportMode === 'camera' ? '#FFFFFF' : 'var(--text-secondary)',
                transition: 'all 0.2s ease',
              }}
            >
              <Camera size={13} />
              <span>Camera Stream</span>
            </button>

            <button
              onClick={() => setViewportMode('3d')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 1rem',
                borderRadius: '9999px',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: viewportMode === '3d' ? 'var(--text-primary)' : 'transparent',
                color: viewportMode === '3d' ? '#FFFFFF' : 'var(--text-secondary)',
                transition: 'all 0.2s ease',
              }}
            >
              <Box size={13} />
              <span>3D Hologram</span>
            </button>
          </div>

          {/* Start / Stop Monitoring Pill Button */}
          {isEngineConnected && (
            <button
              onClick={onToggleMonitoring}
              className="pill-btn btn-magnetic-pill"
              style={{
                backgroundColor: isMonitoring ? '#FEE2E2' : 'var(--color-accent-purple)',
                color: isMonitoring ? '#991B1B' : 'var(--color-accent-purple-dark)',
                borderColor: isMonitoring ? '#FCA5A5' : 'rgba(124, 58, 237, 0.25)',
                padding: '0.55rem 1.4rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                boxShadow: 'var(--shadow-sm)',
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

      {/* Main Responsive Split Grid */}
      <div className="live-monitor-grid">
        {/* Left: Viewport (Camera Stream or Interactive 3D Model) */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: `1.5px solid ${getRiskBorder()}`,
            borderRadius: '28px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: getRiskAura(),
            transition: 'box-shadow 0.4s ease, border-color 0.4s ease',
          }}
        >
          {/* Viewport Header Bar */}
          <div
            style={{
              padding: '0.95rem 1.5rem',
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
                  backgroundColor: 'var(--color-accent-purple)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {viewportMode === '3d' ? <Box size={13} color="#22103E" /> : <Camera size={13} color="#22103E" />}
              </div>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>
                {viewportMode === '3d' ? 'WEBGL_3D // KINEMATICS HEAD MESH' : 'CAM_01 // 640x480 RAW OPTICAL STREAM'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  width: '7px',
                  height: '7px',
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

          {/* Viewport Content Area */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              minHeight: 'clamp(320px, 50vw, 460px)',
              backgroundColor: viewportMode === '3d' ? '#091A14' : '#EDE8E0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {viewportMode === '3d' ? (
              /* Mode B: Three.js Interactive 3D Hologram */
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <InteractiveCockpit3D
                  telemetryData={telemetryData}
                  isMonitoring={isMonitoring}
                  height="460px"
                  theme="dark"
                />
              </div>
            ) : isEngineConnected && videoStreamUrl ? (
              /* Mode A: Real Optical Camera Stream */
              <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: 'clamp(320px, 50vw, 460px)' }}>
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

                {/* Laser scan line overlay when active */}
                {isMonitoring && (
                  <div
                    className="animate-laser-scan"
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      height: '2px',
                      backgroundColor: 'var(--color-emerald-accent)',
                      boxShadow: '0 0 12px var(--color-emerald-accent)',
                      pointerEvents: 'none',
                      zIndex: 5,
                    }}
                  />
                )}

                {!isMonitoring && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(250, 248, 242, 0.92)',
                      backdropFilter: 'blur(8px)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '2.5rem',
                      textAlign: 'center',
                      zIndex: 10,
                    }}
                  >
                    <DriverIllustration state="NOMINAL" size={180} animated={false} />
                    <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--color-alert)', marginTop: '1rem', fontWeight: 700 }}>
                      // OPTICAL CAPTURE HALTED
                    </span>
                    <h3 className="font-serif" style={{ fontSize: '1.6rem', fontWeight: 400, color: 'var(--text-primary)', margin: '0.2rem 0 0.5rem 0' }}>
                      Live Monitoring is Paused
                    </h3>
                    <p style={{ maxWidth: '420px', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '1.5rem' }}>
                      Webcam capture and MediaPipe neural inference are halted. Camera hardware is released and driver privacy is safeguarded.
                    </p>
                    <button
                      onClick={onStartMonitoring}
                      className="pill-btn pill-btn-lavender btn-magnetic-pill"
                      style={{ padding: '0.8rem 2rem' }}
                    >
                      <Play size={15} fill="#22103E" />
                      <span>Resume Live Monitoring</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Calibration Canvas when waiting for camera */
              <div
                style={{
                  width: '100%',
                  minHeight: 'clamp(320px, 50vw, 460px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2.5rem',
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                <DriverIllustration state={riskLevel} size={240} animated={true} />

                <div style={{ maxWidth: '440px', zIndex: 2, marginTop: '1.25rem' }}>
                  <h4 className="font-serif" style={{ fontSize: '1.5rem', fontWeight: 400, color: 'var(--text-primary)', margin: '0 0 0.4rem 0' }}>
                    {isSimMode ? 'Simulation Test Harness Active' : 'Waiting for Python Optical Engine'}
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '1.25rem' }}>
                    {isSimMode
                      ? 'Simulated driver events are currently driving the risk gauge, biometric ratios, and alert chimes.'
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
                        borderRadius: '9999px',
                        color: 'var(--text-primary)',
                        fontSize: '0.82rem',
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
              padding: '0.95rem 1.5rem',
              backgroundColor: 'var(--bg-surface)',
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
            <span>
              MODE: {isEngineConnected ? (isMonitoring ? 'LIVE CAMERA (OPENCV)' : 'STANDBY (CAMERA RELEASED)') : isSimMode ? 'SYNTHETIC' : 'OFFLINE'}
            </span>
            <span>EYES CLOSED ACCUMULATION: {isLive ? `${eyesClosedTime.toFixed(1)}s` : '--'}</span>
          </div>
        </div>

        {/* Right: Biometric Instruments & HUD */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Risk Gauge Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '26px',
              padding: '2rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-accent-purple-dark)', letterSpacing: '0.06em', marginBottom: '1rem', textTransform: 'uppercase' }}>
              Dynamic Attentiveness Index
            </span>
            <RiskGauge
              score={isLive ? riskScore : 0}
              level={isLive ? riskLevel : isEngineConnected && !isMonitoring ? 'PAUSED' : 'STANDBY'}
              isLive={isLive}
              size={195}
            />
          </div>

          {/* EAR & MAR Threshold Levels */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '26px',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.4rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Biometric Signal Ratios
            </span>

            {/* EAR */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.84rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                  Eye Aspect Ratio (EAR)
                </span>
                <span className="font-mono" style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                  {isLive ? ear.toFixed(2) : '--'} <span style={{ color: 'var(--text-muted)' }}>/ 0.22 crit</span>
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-canvas-subtle)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: isLive ? `${Math.min(100, (ear / 0.45) * 100)}%` : '0%',
                    height: '100%',
                    backgroundColor: ear < 0.22 ? 'var(--color-alert)' : '#059669',
                    borderRadius: '9999px',
                    transition: 'width 0.25s ease, background-color 0.25s ease',
                  }}
                />
              </div>
            </div>

            {/* MAR */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.84rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                  Mouth Aspect Ratio (MAR)
                </span>
                <span className="font-mono" style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                  {isLive ? mar.toFixed(2) : '--'} <span style={{ color: 'var(--text-muted)' }}>/ 0.55 warn</span>
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-canvas-subtle)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: isLive ? `${Math.min(100, (mar / 0.8) * 100)}%` : '0%',
                    height: '100%',
                    backgroundColor: mar > 0.55 ? '#D97706' : '#059669',
                    borderRadius: '9999px',
                    transition: 'width 0.25s ease, background-color 0.25s ease',
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
              <div style={{ backgroundColor: 'var(--bg-canvas-subtle)', padding: '0.6rem 0.35rem', borderRadius: '14px' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.62rem', letterSpacing: '0.08em' }}>PITCH</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{isLive ? `${headPitch.toFixed(1)}°` : '--'}</span>
              </div>
              <div style={{ backgroundColor: 'var(--bg-canvas-subtle)', padding: '0.6rem 0.35rem', borderRadius: '14px' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.62rem', letterSpacing: '0.08em' }}>YAW</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{isLive ? `${headYaw.toFixed(1)}°` : '--'}</span>
              </div>
              <div style={{ backgroundColor: 'var(--bg-canvas-subtle)', padding: '0.6rem 0.35rem', borderRadius: '14px' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.62rem', letterSpacing: '0.08em' }}>ROLL</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{isLive ? `${headRoll.toFixed(1)}°` : '--'}</span>
              </div>
            </div>
          </div>

          {/* Diagnostics Test Harness Controls */}
          {isSimMode && (
            <div
              style={{
                backgroundColor: 'var(--bg-card-lavender)',
                border: '1.5px solid rgba(124, 58, 237, 0.2)',
                borderRadius: '26px',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <Sliders size={14} color="var(--color-accent-purple-dark)" />
                <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-accent-purple-dark)', textTransform: 'uppercase' }}>
                  Diagnostics Simulation Harness
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  onClick={() => onTriggerTestIncident?.('NORMAL')}
                  className="pill-btn btn-magnetic-pill"
                  style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-subtle)', padding: '0.55rem', fontSize: '0.76rem', color: 'var(--text-primary)' }}
                >
                  SIMULATE NORMAL ATTENTION
                </button>
                <button
                  onClick={() => onTriggerTestIncident?.('HEAD_DOWN')}
                  className="pill-btn btn-magnetic-pill"
                  style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-subtle)', padding: '0.55rem', fontSize: '0.76rem', color: 'var(--text-primary)' }}
                >
                  SIMULATE HEAD-DOWN (DISTRACTION)
                </button>
                <button
                  onClick={() => onTriggerTestIncident?.('WARNING')}
                  className="pill-btn btn-magnetic-pill"
                  style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(217, 119, 6, 0.3)', color: '#D97706', padding: '0.55rem', fontSize: '0.76rem' }}
                >
                  SIMULATE YAWN (WARNING)
                </button>
                <button
                  onClick={() => onTriggerTestIncident?.('CRITICAL')}
                  className="pill-btn btn-magnetic-pill"
                  style={{ backgroundColor: 'var(--color-alert)', color: '#FFFFFF', padding: '0.55rem', fontSize: '0.76rem', border: 'none' }}
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
