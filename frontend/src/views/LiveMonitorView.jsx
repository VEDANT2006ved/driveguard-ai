import React, { useState } from 'react';
import RiskGauge from '../components/RiskGauge';
import AlertBanner from '../components/AlertBanner';
import DriverIllustration from '../components/DriverIllustration';
import GpsTripPanel from '../components/GpsTripPanel';
import {
  Camera,
  Play,
  Square,
  Activity,
  Sliders,
  Copy,
  Check,
  Radio,
  Sparkles,
  Shield,
  Eye,
  Info,
  ExternalLink,
} from 'lucide-react';

/**
 * LiveMonitorView Component
 * High-End Luxury Automotive Optical Cockpit
 * Design Inspiration: Explora Journeys (editorial layout), NOMU (minimal tactile controls),
 * and Decathlon Yestalgia (retro-futuristic telemetry crosshairs & scenario dials).
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

  const getRiskBorder = () => {
    if (!isLive) return 'rgba(23, 23, 23, 0.12)';
    if (riskLevel === 'CRITICAL' || riskScore >= 70) return '#DC2626';
    if (riskLevel === 'WARNING' || riskScore >= 35) return '#D97706';
    return 'rgba(46, 125, 50, 0.35)';
  };

  const handleCopyCommand = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
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

  return (
    <div
      className="cinematic-fade-in"
      style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: 'clamp(1.5rem, 3vw, 2.5rem) clamp(1rem, 3vw, 2.5rem)',
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem',
      }}
    >
      {/* Editorial Safety Alert Banner */}
      <AlertBanner
        alertState={riskLevel}
        riskReason={riskReason}
        message={alertMessage}
        isEngineConnected={isEngineConnected || isSimMode}
        isMonitoring={isMonitoring}
        isRecovering={isRecovering}
      />

      {/* Viewport Header: Editorial Luxury Masthead */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderBottom: '1px solid rgba(23, 23, 23, 0.12)',
          paddingBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: isLive ? '#2E7D32' : '#9CA3AF',
              }}
              className={isLive ? 'telemetry-pulse' : ''}
            />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--text-secondary)',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}
            >
              COCKPIT SENSING // REAL-TIME OPTICAL HUD
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              margin: 0,
              lineHeight: 1.05,
            }}
          >
            Optical Telemetry HUD
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.92rem',
              color: 'var(--text-secondary)',
              marginTop: '0.4rem',
              marginBottom: 0,
              maxWidth: '620px',
            }}
          >
            Continuous computer-vision driver monitoring. MediaPipe palpebral closure & cranial pose classification.
          </p>
        </div>

        {/* Live Controls Capsule */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          {/* Status Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.55rem 1.15rem',
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(23, 23, 23, 0.12)',
              borderRadius: '9999px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              letterSpacing: '0.06em',
              color: 'var(--text-primary)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: isLive ? '#2E7D32' : isSimMode ? '#D97706' : '#9CA3AF',
              }}
              className={isLive ? 'telemetry-pulse' : ''}
            />
            <span>
              {isEngineConnected
                ? isMonitoring
                  ? `LIVE STREAM (${fps} FPS)`
                  : 'STANDBY (PAUSED)'
                : isSimMode
                ? 'SIMULATION HARNESS'
                : 'ENGINE DISCONNECTED'}
            </span>
          </div>

          {/* Ignition Halt / Resume CTA */}
          {isEngineConnected ? (
            <button
              onClick={onToggleMonitoring}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: isMonitoring ? '#171717' : '#2E7D32',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.62rem 1.45rem',
                borderRadius: '9999px',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.82rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
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
          ) : (
            <button
              onClick={onOpenDiagnostics}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#171717',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.62rem 1.4rem',
                borderRadius: '9999px',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.82rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <Radio size={12} />
              <span>DIAGNOSTICS & TUNNEL</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Responsive Split Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 1fr)',
          gap: '2rem',
          alignItems: 'start',
        }}
        className="cockpit-hud-grid"
      >
        {/* Left Column: Primary Optical Viewport Frame */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: `1.5px solid ${getRiskBorder()}`,
            borderRadius: '16px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)',
            position: 'relative',
            transition: 'border-color 0.3s ease',
          }}
        >
          {/* Decathlon Yestalgia Retro-Futuristic Reticle Marks */}
          <span
            style={{
              position: 'absolute',
              top: '8px',
              left: '10px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: 'rgba(23, 23, 23, 0.3)',
              pointerEvents: 'none',
              zIndex: 15,
            }}
          >
            +
          </span>
          <span
            style={{
              position: 'absolute',
              top: '8px',
              right: '10px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: 'rgba(23, 23, 23, 0.3)',
              pointerEvents: 'none',
              zIndex: 15,
            }}
          >
            +
          </span>

          {/* Viewport Technical Header Bar */}
          <div
            style={{
              padding: '0.9rem 1.5rem',
              borderBottom: '1px solid rgba(23, 23, 23, 0.08)',
              backgroundColor: '#FDFBF7',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Camera size={14} color="var(--text-primary)" />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  letterSpacing: '0.08em',
                }}
              >
                CAM_01 // 640x480 RAW OPTICAL STREAM
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: isLive ? '#2E7D32' : '#9CA3AF',
                }}
                className={isLive ? 'telemetry-pulse' : ''}
              />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: isLive ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                {isEngineConnected ? (isMonitoring ? `${fps} FPS` : 'CAMERA RELEASED') : 'STANDBY'}
              </span>
            </div>
          </div>

          {/* Video Stream / Standby Area */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              minHeight: 'clamp(340px, 45vw, 480px)',
              backgroundColor: '#111214',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {isEngineConnected && videoStreamUrl ? (
              <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: 'clamp(340px, 45vw, 480px)' }}>
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

                {/* Laser scan line overlay when monitoring */}
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
                      backgroundColor: 'rgba(13, 14, 16, 0.88)',
                      backdropFilter: 'blur(8px)',
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
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        color: '#EF4444',
                        letterSpacing: '0.14em',
                        fontWeight: 600,
                      }}
                    >
                      // SENSOR CAPTURE HALTED
                    </span>
                    <h3
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '2rem',
                        fontWeight: 400,
                        margin: '0.6rem 0',
                      }}
                    >
                      Optical Stream Paused
                    </h3>
                    <p
                      style={{
                        fontFamily: 'var(--font-sans)',
                        maxWidth: '420px',
                        fontSize: '0.88rem',
                        color: 'rgba(255, 255, 255, 0.75)',
                        lineHeight: 1.55,
                        marginBottom: '1.75rem',
                      }}
                    >
                      Webcam hardware is cleanly released and neural inference is stopped. Driver privacy is protected.
                    </p>
                    <button
                      onClick={onStartMonitoring}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        backgroundColor: '#FFFFFF',
                        color: '#171717',
                        border: 'none',
                        padding: '0.75rem 2rem',
                        borderRadius: '9999px',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <Play size={13} fill="#171717" />
                      <span>RESUME MONITORING</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Bespoke Standby Calibration Canvas (Explora / NOMU / Decathlon Aesthetic) */
              <div
                style={{
                  width: '100%',
                  minHeight: 'clamp(380px, 46vw, 500px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 'clamp(2rem, 4vw, 3rem)',
                  textAlign: 'center',
                  position: 'relative',
                  backgroundColor: '#FBF9F5',
                }}
              >
                {/* Visual driver illustration */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <DriverIllustration state={riskLevel} size={210} animated={true} />
                </div>

                <div style={{ maxWidth: '480px' }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.3rem 0.85rem',
                      backgroundColor: isSimMode ? 'rgba(217, 119, 6, 0.1)' : 'rgba(23, 23, 23, 0.05)',
                      borderRadius: '9999px',
                      marginBottom: '0.85rem',
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: isSimMode ? '#D97706' : '#9CA3AF',
                      }}
                    />
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        color: isSimMode ? '#D97706' : 'var(--text-secondary)',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                      }}
                    >
                      {isSimMode ? 'SIMULATION HARNESS ACTIVE' : 'AWAITING HARDWARE PIPELINE'}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(1.5rem, 3vw, 1.95rem)',
                      fontWeight: 400,
                      color: 'var(--text-primary)',
                      margin: '0 0 0.65rem 0',
                      lineHeight: 1.2,
                    }}
                  >
                    {isSimMode ? 'Simulated Driver Telemetry' : 'Waiting for Python Optical Pipeline'}
                  </h3>

                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.88rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                      marginBottom: '1.5rem',
                    }}
                  >
                    {isSimMode
                      ? 'Synthetic attentiveness telemetry is currently driving the risk dial, acoustic warnings, and GPS tags below.'
                      : 'To stream your physical webcam through the MediaPipe neural detection pipeline, launch the Python engine on your laptop:'}
                  </p>

                  {!isSimMode && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem' }}>
                      {/* Copyable terminal command */}
                      <div
                        onClick={() => handleCopyCommand('python run_production_bridge.py')}
                        title="Click to copy start command"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.65rem 1.25rem',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid rgba(23, 23, 23, 0.15)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <code
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.82rem',
                            color: 'var(--text-primary)',
                            letterSpacing: '0.04em',
                          }}
                        >
                          python run_production_bridge.py
                        </code>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '24px',
                            height: '24px',
                            borderRadius: '4px',
                            backgroundColor: copiedCmd ? '#ECFDF5' : 'rgba(23, 23, 23, 0.05)',
                          }}
                        >
                          {copiedCmd ? <Check size={13} color="#2E7D32" /> : <Copy size={13} color="#6B7280" />}
                        </div>
                      </div>

                      {/* Action buttons row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {onOpenDiagnostics && (
                          <button
                            onClick={onOpenDiagnostics}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.45rem',
                              padding: '0.55rem 1.25rem',
                              backgroundColor: '#171717',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '9999px',
                              fontSize: '0.78rem',
                              fontFamily: 'var(--font-sans)',
                              fontWeight: 500,
                              cursor: 'pointer',
                            }}
                          >
                            <Radio size={12} />
                            <span>CONNECT TUNNEL / DIAGNOSTICS</span>
                          </button>
                        )}

                        {onToggleSimMode && (
                          <button
                            onClick={onToggleSimMode}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.45rem',
                              padding: '0.55rem 1.25rem',
                              backgroundColor: '#FFFFFF',
                              color: 'var(--text-primary)',
                              border: '1px solid rgba(23, 23, 23, 0.18)',
                              borderRadius: '9999px',
                              fontSize: '0.78rem',
                              fontFamily: 'var(--font-sans)',
                              fontWeight: 500,
                              cursor: 'pointer',
                            }}
                          >
                            <Sparkles size={12} color="#D97706" />
                            <span>LAUNCH SIMULATION DEMO</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Viewport Telemetry Footer Bar */}
          <div
            style={{
              padding: '0.85rem 1.5rem',
              backgroundColor: '#FDFBF7',
              borderTop: '1px solid rgba(23, 23, 23, 0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: 'var(--text-secondary)',
              letterSpacing: '0.04em',
            }}
          >
            <span>
              MODE: {isEngineConnected ? (isMonitoring ? 'LIVE HARDWARE (OPENCV)' : 'STANDBY (CAMERA RELEASED)') : isSimMode ? 'SYNTHETIC HARNESS' : 'DISCONNECTED'}
            </span>
            <span>EYES CLOSED DURATION: {isLive ? `${eyesClosedTime.toFixed(1)}S` : '--'}</span>
          </div>
        </div>

        {/* Right Column: Technical Biometric Meters & Risk Dial */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Risk Gauge Card */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(23, 23, 23, 0.1)',
              borderRadius: '16px',
              padding: '2rem 1.75rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
              position: 'relative',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                letterSpacing: '0.12em',
                color: 'var(--text-secondary)',
                marginBottom: '1.25rem',
                textTransform: 'uppercase',
              }}
            >
              DYNAMIC ATTENTIVENESS INDEX
            </span>
            <RiskGauge
              score={isLive ? riskScore : 0}
              level={isLive ? riskLevel : isEngineConnected && !isMonitoring ? 'PAUSED' : 'STANDBY'}
              isLive={isLive}
              size={195}
            />
          </div>

          {/* EAR & MAR Biometric Ratio Bars */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(23, 23, 23, 0.1)',
              borderRadius: '16px',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.12em',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                }}
              >
                BIOMETRIC SIGNAL RATIOS
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  color: '#9CA3AF',
                }}
              >
                68-POINT MESH
              </span>
            </div>

            {/* Eye Aspect Ratio (EAR) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Eye Aspect Ratio (EAR)
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                  {isLive ? ear.toFixed(2) : '--'} <span style={{ color: '#9CA3AF' }}>/ 0.22 crit</span>
                </span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#F3EFEA', borderRadius: '3px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: isLive ? `${Math.min(100, (ear / 0.45) * 100)}%` : '0%',
                    height: '100%',
                    backgroundColor: ear < 0.22 ? '#DC2626' : '#171717',
                    transition: 'width 0.25s ease',
                  }}
                />
              </div>
            </div>

            {/* Mouth Aspect Ratio (MAR) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Mouth Aspect Ratio (MAR)
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                  {isLive ? mar.toFixed(2) : '--'} <span style={{ color: '#9CA3AF' }}>/ 0.55 warn</span>
                </span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#F3EFEA', borderRadius: '3px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: isLive ? `${Math.min(100, (mar / 0.8) * 100)}%` : '0%',
                    height: '100%',
                    backgroundColor: mar > 0.55 ? '#D97706' : '#171717',
                    transition: 'width 0.25s ease',
                  }}
                />
              </div>
            </div>

            {/* 3D Cranial Pose Angle Boxes */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.65rem',
                borderTop: '1px solid rgba(23, 23, 23, 0.08)',
                paddingTop: '1.25rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                textAlign: 'center',
              }}
            >
              <div style={{ backgroundColor: '#FDFBF7', border: '1px solid rgba(23, 23, 23, 0.06)', padding: '0.65rem 0.35rem', borderRadius: '8px' }}>
                <span style={{ color: '#9CA3AF', display: 'block', fontSize: '0.65rem', letterSpacing: '0.08em' }}>PITCH</span>
                <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.2rem' }}>
                  {isLive ? `${headPitch.toFixed(1)}°` : '--'}
                </span>
              </div>
              <div style={{ backgroundColor: '#FDFBF7', border: '1px solid rgba(23, 23, 23, 0.06)', padding: '0.65rem 0.35rem', borderRadius: '8px' }}>
                <span style={{ color: '#9CA3AF', display: 'block', fontSize: '0.65rem', letterSpacing: '0.08em' }}>YAW</span>
                <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.2rem' }}>
                  {isLive ? `${headYaw.toFixed(1)}°` : '--'}
                </span>
              </div>
              <div style={{ backgroundColor: '#FDFBF7', border: '1px solid rgba(23, 23, 23, 0.06)', padding: '0.65rem 0.35rem', borderRadius: '8px' }}>
                <span style={{ color: '#9CA3AF', display: 'block', fontSize: '0.65rem', letterSpacing: '0.08em' }}>ROLL</span>
                <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.2rem' }}>
                  {isLive ? `${headRoll.toFixed(1)}°` : '--'}
                </span>
              </div>
            </div>
          </div>

          {/* Decathlon Yestalgia Interactive Incident Simulation Controls */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(23, 23, 23, 0.1)',
              borderRadius: '16px',
              padding: '1.75rem',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sliders size={14} color="var(--text-primary)" />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.12em',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    textTransform: 'uppercase',
                  }}
                >
                  DIAGNOSTICS SCENARIO DIAL
                </span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#9CA3AF' }}>
                DECATHLON TEST HARNESS
              </span>
            </div>

            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
              Instantly test UI reactivity, audio alarms, desktop notifications, and GPS safety event tagging:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              <button
                onClick={() => handleScenarioSelect('NORMAL')}
                style={{
                  padding: '0.65rem 0.85rem',
                  backgroundColor: activeScenario === 'NORMAL' && isSimMode ? '#171717' : '#FDFBF7',
                  color: activeScenario === 'NORMAL' && isSimMode ? '#FFFFFF' : 'var(--text-primary)',
                  border: '1px solid rgba(23, 23, 23, 0.12)',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontSize: '0.68rem', color: activeScenario === 'NORMAL' && isSimMode ? '#A7F3D0' : '#2E7D32', marginBottom: '0.15rem' }}>
                  STATE 01 // NOMINAL
                </div>
                Attentive Driver
              </button>

              <button
                onClick={() => handleScenarioSelect('HEAD_DOWN')}
                style={{
                  padding: '0.65rem 0.85rem',
                  backgroundColor: activeScenario === 'HEAD_DOWN' && isSimMode ? '#171717' : '#FDFBF7',
                  color: activeScenario === 'HEAD_DOWN' && isSimMode ? '#FFFFFF' : 'var(--text-primary)',
                  border: '1px solid rgba(23, 23, 23, 0.12)',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontSize: '0.68rem', color: activeScenario === 'HEAD_DOWN' && isSimMode ? '#FDE68A' : '#D97706', marginBottom: '0.15rem' }}>
                  STATE 02 // DISTRACTION
                </div>
                Head-Down (-21°)
              </button>

              <button
                onClick={() => handleScenarioSelect('WARNING')}
                style={{
                  padding: '0.65rem 0.85rem',
                  backgroundColor: activeScenario === 'WARNING' && isSimMode ? '#171717' : '#FDFBF7',
                  color: activeScenario === 'WARNING' && isSimMode ? '#FFFFFF' : 'var(--text-primary)',
                  border: '1px solid rgba(23, 23, 23, 0.12)',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontSize: '0.68rem', color: activeScenario === 'WARNING' && isSimMode ? '#FDE68A' : '#D97706', marginBottom: '0.15rem' }}>
                  STATE 03 // FATIGUE
                </div>
                Yawn (MAR &gt; 0.65)
              </button>

              <button
                onClick={() => handleScenarioSelect('CRITICAL')}
                style={{
                  padding: '0.65rem 0.85rem',
                  backgroundColor: activeScenario === 'CRITICAL' && isSimMode ? '#DC2626' : '#FEF2F2',
                  color: activeScenario === 'CRITICAL' && isSimMode ? '#FFFFFF' : '#DC2626',
                  border: '1px solid rgba(220, 38, 38, 0.3)',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontSize: '0.68rem', color: activeScenario === 'CRITICAL' && isSimMode ? '#FCA5A5' : '#991B1B', marginBottom: '0.15rem' }}>
                  STATE 04 // CRITICAL
                </div>
                Microsleep (2.1s)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* GPS Trip Route & Distance Telemetry Section */}
      <div style={{ marginTop: '1rem' }}>
        <GpsTripPanel />
      </div>
    </div>
  );
}