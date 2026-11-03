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
  ChevronRight,
  Gauge,
  Compass,
} from 'lucide-react';

/**
 * LiveMonitorView Component
 * High-End Industrial Optical Cockpit HUD
 * Primary Reference: SSTR (https://sstr.tech/en/) — Awwwards Site of the Day (SOTD) & Developer Award
 * Strict modular carbon grid, SSTR Electric Safety Orange (#FE5B2A), precision laser raster scans,
 * and high-contrast telemetry dials.
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
    if (!isLive) return 'rgba(255, 255, 255, 0.1)';
    if (riskLevel === 'CRITICAL' || riskScore >= 70) return '#EF4444';
    if (riskLevel === 'WARNING' || riskScore >= 35) return '#FE5B2A';
    return 'rgba(16, 185, 129, 0.4)';
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
    <div className="sstr-cockpit-wrapper sstr-grid-bg">
      {/* Editorial Safety Alert Banner */}
      <AlertBanner
        alertState={riskLevel}
        riskReason={riskReason}
        message={alertMessage}
        isEngineConnected={isEngineConnected || isSimMode}
        isMonitoring={isMonitoring}
        isRecovering={isRecovering}
      />

      {/* Cockpit Masthead */}
      <div className="sstr-cockpit-masthead">
        <div>
          <div className="sstr-masthead-meta">
            <span className="sstr-tag">COCKPIT SENSING // 02</span>
            <span className="sstr-meta-divider">|</span>
            <span className="sstr-meta-item">REAL-TIME EDGE PIPELINE</span>
            <span className="sstr-meta-divider">|</span>
            <span className="sstr-meta-item">640x480 RAW OPTICAL STREAM</span>
          </div>

          <h1 className="sstr-cockpit-title">
            OPTICAL TELEMETRY HUD<span className="sstr-title-dot">.</span>
          </h1>
          <p className="sstr-cockpit-subtitle">
            Edge neural ingestion of palpebral aperture closure (EAR) and 3D cranial kinematics.
          </p>
        </div>

        {/* Live Controls Capsule */}
        <div className="sstr-cockpit-controls">
          {/* Status Badge */}
          <div className="sstr-status-chip">
            <span
              className={`sstr-status-beacon ${
                isLive ? 'active' : isSimMode ? 'sim' : 'idle'
              }`}
            />
            <span>
              {isEngineConnected
                ? isMonitoring
                  ? `LIVE STREAM (${fps} FPS)`
                  : 'STANDBY (PAUSED)'
                : isSimMode
                ? 'SIMULATION HARNESS'
                : 'PIPELINE DISCONNECTED'}
            </span>
          </div>

          {/* Ignition Halt / Resume CTA */}
          {isEngineConnected ? (
            <button
              onClick={onToggleMonitoring}
              className={`sstr-ignition-btn ${isMonitoring ? 'monitoring' : 'idle'}`}
            >
              {isMonitoring ? (
                <>
                  <Square size={12} fill="currentColor" />
                  <span>HALT SENSING</span>
                </>
              ) : (
                <>
                  <Play size={12} fill="currentColor" />
                  <span>START MONITORING</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={onOpenDiagnostics}
              className="sstr-btn-secondary"
              style={{ padding: '0.55rem 1.15rem' }}
            >
              <Radio size={12} />
              <span>TUNNEL / DIAGNOSTICS</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Responsive Split Grid */}
      <div className="cockpit-hud-grid">
        {/* Left Column: Primary Optical Viewport Frame */}
        <div
          className="sstr-viewport-card sstr-reticle"
          style={{ borderColor: getRiskBorder() }}
        >
          {/* Viewport Technical Header Bar */}
          <div className="sstr-vp-header">
            <div className="sstr-vp-cam">
              <Camera size={14} color="#FE5B2A" />
              <span>CAM_01 // 640x480 RAW OPTICAL STREAM</span>
            </div>

            <div className="sstr-vp-state">
              <span
                className={`sstr-vp-dot ${isLive ? 'live' : 'standby'}`}
              />
              <span>
                {isEngineConnected ? (isMonitoring ? `${fps} FPS` : 'CAMERA RELEASED') : 'STANDBY'}
              </span>
            </div>
          </div>

          {/* Video Stream / Standby Area */}
          <div className="sstr-vp-canvas">
            {isEngineConnected && videoStreamUrl ? (
              <div className="sstr-vp-stream-box">
                <img
                  src={videoStreamUrl}
                  alt="Live Driver Safety Optical Feed"
                  className="sstr-vp-stream-img"
                  style={{
                    filter: !isMonitoring ? 'grayscale(0.7) contrast(0.95)' : 'none',
                  }}
                />

                {/* Laser scan line overlay when monitoring */}
                {isMonitoring && (
                  <div className="animate-laser-scan sstr-laser-scanline" />
                )}

                {/* Halted Overlay */}
                {!isMonitoring && (
                  <div className="sstr-halted-overlay">
                    <span className="sstr-halted-tag">// SENSOR CAPTURE HALTED</span>
                    <h3 className="sstr-halted-title">Optical Stream Paused</h3>
                    <p className="sstr-halted-desc">
                      Webcam hardware is cleanly released and neural inference is stopped. Driver privacy is protected.
                    </p>
                    <button
                      onClick={onStartMonitoring}
                      className="sstr-btn"
                      style={{ padding: '0.75rem 2rem' }}
                    >
                      <Play size={13} fill="#FFFFFF" />
                      <span>RESUME MONITORING</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* SSTR Standby Calibration Canvas */
              <div className="sstr-standby-box">
                <div style={{ marginBottom: '1.25rem' }}>
                  <DriverIllustration state={riskLevel} size={210} animated={true} />
                </div>

                <div className="sstr-standby-info">
                  <div className="sstr-standby-pill">
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: isSimMode ? '#FE5B2A' : '#5F6470',
                      }}
                    />
                    <span>
                      {isSimMode ? 'SIMULATION HARNESS ACTIVE' : 'AWAITING HARDWARE PIPELINE'}
                    </span>
                  </div>

                  <h3 className="sstr-standby-title">
                    {isSimMode ? 'Simulated Driver Telemetry' : 'Waiting for Python Optical Pipeline'}
                  </h3>

                  <p className="sstr-standby-desc">
                    {isSimMode
                      ? 'Synthetic attentiveness telemetry is driving the risk dial, acoustic warnings, and GPS tags.'
                      : 'To stream your physical webcam through the MediaPipe neural detection pipeline, launch the Python engine on your laptop:'}
                  </p>

                  {!isSimMode && (
                    <div className="sstr-standby-actions">
                      {/* Copyable terminal command */}
                      <div
                        onClick={() => handleCopyCommand('python run_production_bridge.py')}
                        title="Click to copy start command"
                        className="sstr-copy-cmd"
                      >
                        <code>python run_production_bridge.py</code>
                        <div className="sstr-copy-btn">
                          {copiedCmd ? <Check size={12} color="#10B981" /> : <Copy size={12} color="#9FA4B0" />}
                        </div>
                      </div>

                      {/* Action buttons row */}
                      <div className="sstr-action-row">
                        {onOpenDiagnostics && (
                          <button
                            onClick={onOpenDiagnostics}
                            className="sstr-btn-secondary"
                            style={{ padding: '0.55rem 1.25rem', fontSize: '0.76rem' }}
                          >
                            <Radio size={12} />
                            <span>CONNECT TUNNEL / DIAGNOSTICS</span>
                          </button>
                        )}

                        {onToggleSimMode && (
                          <button
                            onClick={onToggleSimMode}
                            className="sstr-btn"
                            style={{ padding: '0.55rem 1.25rem', fontSize: '0.76rem' }}
                          >
                            <Sparkles size={12} />
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
          <div className="sstr-vp-footer">
            <span>
              MODE: {isEngineConnected ? (isMonitoring ? 'LIVE HARDWARE (OPENCV)' : 'STANDBY (CAMERA RELEASED)') : isSimMode ? 'SYNTHETIC HARNESS' : 'DISCONNECTED'}
            </span>
            <span>EYES CLOSED DURATION: {isLive ? `${eyesClosedTime.toFixed(1)}S` : '--'}</span>
          </div>
        </div>

        {/* Right Column: Technical Biometric Meters & Risk Dial */}
        <div className="sstr-telemetry-col">
          {/* Risk Gauge Card */}
          <div className="sstr-card sstr-reticle" style={{ padding: '2rem 1.5rem', alignItems: 'center' }}>
            <span className="sstr-card-num">METRIC // DYNAMIC ATTENTIVENESS</span>
            <div style={{ margin: '1rem 0' }}>
              <RiskGauge
                score={isLive ? riskScore : 0}
                level={isLive ? riskLevel : isEngineConnected && !isMonitoring ? 'PAUSED' : 'STANDBY'}
                isLive={isLive}
                size={195}
              />
            </div>
          </div>

          {/* EAR & MAR Biometric Ratio Bars */}
          <div className="sstr-card sstr-reticle">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="sstr-card-num">BIOMETRICS // 68-POINT MESH</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#5F6470' }}>
                SUB-15MS INGESTION
              </span>
            </div>

            {/* Eye Aspect Ratio (EAR) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600, color: '#FFFFFF' }}>
                  Eye Aspect Ratio (EAR)
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#FE5B2A' }}>
                  {isLive ? ear.toFixed(2) : '--'} <span style={{ color: '#5F6470' }}>/ 0.22 crit</span>
                </span>
              </div>
              <div className="sstr-progress-track">
                <div
                  className="sstr-progress-fill"
                  style={{
                    width: isLive ? `${Math.min(100, (ear / 0.45) * 100)}%` : '0%',
                    backgroundColor: ear < 0.22 ? '#EF4444' : '#10B981',
                  }}
                />
              </div>
            </div>

            {/* Mouth Aspect Ratio (MAR) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600, color: '#FFFFFF' }}>
                  Mouth Aspect Ratio (MAR)
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#FE5B2A' }}>
                  {isLive ? mar.toFixed(2) : '--'} <span style={{ color: '#5F6470' }}>/ 0.55 warn</span>
                </span>
              </div>
              <div className="sstr-progress-track">
                <div
                  className="sstr-progress-fill"
                  style={{
                    width: isLive ? `${Math.min(100, (mar / 0.8) * 100)}%` : '0%',
                    backgroundColor: mar > 0.55 ? '#FE5B2A' : '#10B981',
                  }}
                />
              </div>
            </div>

            {/* 3D Cranial Pose Angle Boxes */}
            <div className="sstr-angles-grid">
              <div className="sstr-angle-box">
                <span className="sstr-angle-lbl">PITCH</span>
                <span className="sstr-angle-val">{isLive ? `${headPitch.toFixed(1)}°` : '--'}</span>
              </div>
              <div className="sstr-angle-box">
                <span className="sstr-angle-lbl">YAW</span>
                <span className="sstr-angle-val">{isLive ? `${headYaw.toFixed(1)}°` : '--'}</span>
              </div>
              <div className="sstr-angle-box">
                <span className="sstr-angle-lbl">ROLL</span>
                <span className="sstr-angle-val">{isLive ? `${headRoll.toFixed(1)}°` : '--'}</span>
              </div>
            </div>
          </div>

          {/* Interactive Incident Simulation Controls */}
          <div className="sstr-card sstr-reticle">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sliders size={14} color="#FE5B2A" />
                <span className="sstr-card-num">DIAGNOSTICS SCENARIO DIAL</span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#5F6470' }}>
                AIR-GAPPED
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              <button
                onClick={() => handleScenarioSelect('NORMAL')}
                className={`sstr-dial-btn ${activeScenario === 'NORMAL' && isSimMode ? 'active' : ''}`}
              >
                <div className="sstr-dial-tag" style={{ color: '#10B981' }}>STATE 01 // NOMINAL</div>
                Attentive Driver
              </button>

              <button
                onClick={() => handleScenarioSelect('HEAD_DOWN')}
                className={`sstr-dial-btn ${activeScenario === 'HEAD_DOWN' && isSimMode ? 'active' : ''}`}
              >
                <div className="sstr-dial-tag" style={{ color: '#FE5B2A' }}>STATE 02 // DISTRACTION</div>
                Head-Down (-21°)
              </button>

              <button
                onClick={() => handleScenarioSelect('WARNING')}
                className={`sstr-dial-btn ${activeScenario === 'WARNING' && isSimMode ? 'active' : ''}`}
              >
                <div className="sstr-dial-tag" style={{ color: '#FE5B2A' }}>STATE 03 // FATIGUE</div>
                Yawn (MAR &gt; 0.65)
              </button>

              <button
                onClick={() => handleScenarioSelect('CRITICAL')}
                className={`sstr-dial-btn ${activeScenario === 'CRITICAL' && isSimMode ? 'active-crit' : ''}`}
              >
                <div className="sstr-dial-tag" style={{ color: '#EF4444' }}>STATE 04 // CRITICAL</div>
                Microsleep (2.1s)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* GPS Trip Route & Distance Telemetry Section */}
      <div style={{ marginTop: '2rem' }}>
        <GpsTripPanel />
      </div>

      {/* Scoped CSS Styles for SSTR Live Cockpit HUD */}
      <style>{`
        .sstr-cockpit-wrapper {
          max-width: 1440px;
          margin: 0 auto;
          padding: clamp(1.5rem, 3.5vw, 2.5rem) clamp(1rem, 3.5vw, 2.5rem) 5rem;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .sstr-cockpit-masthead {
          display: flex;
          justifyContent: space-between;
          align-items: flex-end;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .sstr-masthead-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: #9FA4B0;
          margin-bottom: 0.4rem;
          flex-wrap: wrap;
        }
        .sstr-cockpit-title {
          font-family: var(--font-display);
          font-size: clamp(2.2rem, 4.5vw, 3.5rem);
          font-weight: 800;
          color: #FFFFFF;
          margin: 0;
          line-height: 1.05;
          letter-spacing: -0.02em;
        }
        .sstr-title-dot {
          color: #FE5B2A;
        }
        .sstr-cockpit-subtitle {
          font-family: var(--font-sans);
          font-size: 0.92rem;
          color: #9FA4B0;
          margin: 0.35rem 0 0 0;
        }

        .sstr-cockpit-controls {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          flex-wrap: wrap;
        }
        .sstr-status-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.55rem 1rem;
          background: #18191B;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: #FFFFFF;
        }
        .sstr-status-beacon {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #5F6470;
        }
        .sstr-status-beacon.active {
          background: #10B981;
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.8);
        }
        .sstr-status-beacon.sim {
          background: #FE5B2A;
          box-shadow: 0 0 8px rgba(254, 91, 42, 0.8);
        }

        .sstr-ignition-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.45rem;
          border-radius: 4px;
          font-family: var(--font-mono);
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          border: none;
          text-transform: uppercase;
        }
        .sstr-ignition-btn.idle {
          background: #FE5B2A;
          color: #FFFFFF;
        }
        .sstr-ignition-btn.monitoring {
          background: #202226;
          color: #EF4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        /* Viewport Card */
        .sstr-viewport-card {
          background: #141518;
          border: 1.5px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
          transition: border-color 0.3s ease;
        }
        .sstr-vp-header {
          padding: 0.85rem 1.25rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: #18191B;
          display: flex;
          justifyContent: space-between;
          align-items: center;
          font-family: var(--font-mono);
          font-size: 0.72rem;
        }
        .sstr-vp-cam {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          color: #FFFFFF;
          font-weight: 600;
        }
        .sstr-vp-state {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          color: #9FA4B0;
        }
        .sstr-vp-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #5F6470;
        }
        .sstr-vp-dot.live {
          background: #10B981;
          box-shadow: 0 0 6px #10B981;
        }

        .sstr-vp-canvas {
          position: relative;
          min-height: clamp(340px, 45vw, 480px);
          background: #0D0E10;
          display: flex;
          align-items: center;
          justifyContent: center;
          overflow: hidden;
        }
        .sstr-vp-stream-box {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: clamp(340px, 45vw, 480px);
        }
        .sstr-vp-stream-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .sstr-laser-scanline {
          position: absolute;
          left: 0;
          right: 0;
          height: 2px;
          background-color: #FE5B2A;
          box-shadow: 0 0 10px #FE5B2A;
          pointer-events: none;
        }

        .sstr-halted-overlay {
          position: absolute;
          inset: 0;
          background: rgba(13, 14, 16, 0.9);
          backdrop-filter: blur(8px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justifyContent: center;
          padding: 2rem;
          text-align: center;
          z-index: 10;
        }
        .sstr-halted-tag {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: #EF4444;
          letter-spacing: 0.12em;
          font-weight: 700;
        }
        .sstr-halted-title {
          font-family: var(--font-display);
          font-size: 1.8rem;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0.5rem 0;
        }
        .sstr-halted-desc {
          font-family: var(--font-sans);
          font-size: 0.88rem;
          color: #9FA4B0;
          max-width: 420px;
          margin-bottom: 1.5rem;
        }

        /* Standby */
        .sstr-standby-box {
          width: 100%;
          min-height: clamp(380px, 46vw, 500px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justifyContent: center;
          padding: clamp(2rem, 4vw, 3rem);
          text-align: center;
          position: relative;
          background: #0D0E10;
        }
        .sstr-standby-info {
          max-width: 480px;
        }
        .sstr-standby-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.3rem 0.85rem;
          background: #18191B;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          margin-bottom: 0.85rem;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: #9FA4B0;
          font-weight: 600;
        }
        .sstr-standby-title {
          font-family: var(--font-display);
          font-size: clamp(1.4rem, 2.5vw, 1.85rem);
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 0.5rem 0;
          text-transform: uppercase;
        }
        .sstr-standby-desc {
          font-family: var(--font-sans);
          font-size: 0.88rem;
          color: #9FA4B0;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        .sstr-standby-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.85rem;
        }
        .sstr-copy-cmd {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 1.25rem;
          background: #18191B;
          border: 1px solid rgba(254, 91, 42, 0.3);
          border-radius: 4px;
          cursor: pointer;
          font-family: var(--font-mono);
          font-size: 0.82rem;
          color: #FFFFFF;
        }
        .sstr-copy-btn {
          width: 22px;
          height: 22px;
          border-radius: 3px;
          background: #202226;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sstr-action-row {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .sstr-vp-footer {
          padding: 0.85rem 1.25rem;
          background: #18191B;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          justifyContent: space-between;
          align-items: center;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: #5F6470;
        }

        /* Telemetry Column */
        .sstr-telemetry-col {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .sstr-progress-track {
          width: 100%;
          height: 6px;
          background: #0D0E10;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 3px;
          overflow: hidden;
        }
        .sstr-progress-fill {
          height: 100%;
          transition: width 0.25s ease;
        }

        .sstr-dial-btn {
          background: #0D0E10;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          padding: 0.75rem 0.85rem;
          font-family: var(--font-sans);
          font-size: 0.82rem;
          font-weight: 600;
          color: #FFFFFF;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
        }
        .sstr-dial-btn:hover {
          border-color: rgba(255, 255, 255, 0.25);
          background: #18191B;
        }
        .sstr-dial-btn.active {
          border-color: #FE5B2A;
          background: rgba(254, 91, 42, 0.1);
        }
        .sstr-dial-btn.active-crit {
          border-color: #EF4444;
          background: rgba(239, 68, 68, 0.15);
        }
        .sstr-dial-tag {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 700;
          margin-bottom: 0.2rem;
        }
      `}</style>
    </div>
  );
}