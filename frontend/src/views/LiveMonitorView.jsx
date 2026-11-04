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
 * LiveMonitorView Component — High-Fashion Minimalist Editorial & Techwear HUD
 * References: Images 1 (SHADXW), 2 (Aura store), 4 (lab. 001), 5 (Joker)
 * Dual-tone off-white & ink black panels, laser scanlines, and real-time biometric gauges.
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
      style={{
        width: '100%',
        backgroundColor: 'var(--bg-primary)',
        padding: 'clamp(1.5rem, 3.5vw, 3rem) clamp(1rem, 3vw, 2.5rem)',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
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

      {/* Cockpit Masthead */}
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
            <span className="techwear-tag">COCKPIT // 02</span>
            <span>•</span>
            <span>REAL-TIME EDGE PIPELINE</span>
            <span>•</span>
            <span>640x480 RAW OPTICAL STREAM</span>
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
            Optical Telemetry HUD
          </h1>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Real-time biometric extraction of palpebral aperture closure (EAR) and 3D cranial kinematics.
          </p>
        </div>

        {/* Live Controls Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {/* Engine Status Capsule */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.45rem 0.95rem',
              borderRadius: '2px',
              border: '1px solid var(--border-light)',
              backgroundColor: 'var(--bg-secondary)',
              fontFamily: "var(--font-mono, monospace)",
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: isLive ? 'var(--accent-emerald)' : 'var(--text-muted)',
              }}
              className={isLive ? 'animate-pulse-live' : ''}
            />
            <span>
              {isEngineConnected
                ? `ENGINE LINKED (${fps || 30} FPS)`
                : isSimMode
                ? 'SIMULATION RUNNING'
                : 'ENGINE STANDBY'}
            </span>
          </div>

          {/* Ignition Start/Stop Button */}
          {isMonitoring ? (
            <button
              onClick={onStopMonitoring || onToggleMonitoring}
              className="btn-editorial"
              style={{ height: '36px' }}
            >
              <Square size={12} fill="var(--bg-primary)" />
              <span>HALT PIPELINE</span>
            </button>
          ) : (
            <button
              onClick={onStartMonitoring || onToggleMonitoring}
              className="btn-editorial"
              style={{ height: '36px' }}
            >
              <Play size={12} fill="var(--bg-primary)" />
              <span>ENGAGE PIPELINE</span>
            </button>
          )}

          {/* Diagnostics Modal Button */}
          <button
            onClick={onOpenDiagnostics}
            title="Configure Cloudflare Tunnel URL"
            className="btn-editorial-outline"
            style={{ height: '36px', padding: '0 0.85rem' }}
          >
            <Sliders size={14} />
            <span>TUNNEL BRIDGE</span>
          </button>
        </div>
      </div>

      {/* Main Cockpit Dual-Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1.35fr) minmax(300px, 1fr)',
          gap: 'clamp(1.5rem, 3vw, 2.5rem)',
          alignItems: 'start',
        }}
      >
        {/* =========================================================================
            LEFT COLUMN: 640x480 RAW OPTICAL STREAM / STANDBY SCREEN
            ========================================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              backgroundColor: '#111111',
              borderRadius: '4px',
              border: '1px solid var(--border-light)',
              overflow: 'hidden',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
              aspectRatio: '4 / 3',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* Corner Crosshair Reticles (Image 4 & 5 techwear style) */}
            <div style={{ position: 'absolute', top: 12, left: 12, color: 'rgba(255, 255, 255, 0.3)', fontFamily: "var(--font-mono, monospace)", fontSize: '11px', zIndex: 10, pointerEvents: 'none' }}>+</div>
            <div style={{ position: 'absolute', top: 12, right: 12, color: 'rgba(255, 255, 255, 0.3)', fontFamily: "var(--font-mono, monospace)", fontSize: '11px', zIndex: 10, pointerEvents: 'none' }}>+</div>
            <div style={{ position: 'absolute', bottom: 12, left: 12, color: 'rgba(255, 255, 255, 0.3)', fontFamily: "var(--font-mono, monospace)", fontSize: '11px', zIndex: 10, pointerEvents: 'none' }}>+</div>
            <div style={{ position: 'absolute', bottom: 12, right: 12, color: 'rgba(255, 255, 255, 0.3)', fontFamily: "var(--font-mono, monospace)", fontSize: '11px', zIndex: 10, pointerEvents: 'none' }}>+</div>

            {/* Top Stream Header Bar */}
            <div
              style={{
                position: 'relative',
                zIndex: 10,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.85rem 1.25rem',
                backgroundColor: 'rgba(17, 17, 17, 0.85)',
                backdropFilter: 'blur(8px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                fontFamily: "var(--font-mono, monospace)",
                fontSize: '0.7rem',
                letterSpacing: '0.08em',
                color: '#F7F7F5',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Camera size={13} />
                <span>CAM_01 // 640x480 RAW OPTICAL STREAM</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: isLive ? 'var(--accent-emerald)' : '#666666',
                  }}
                  className={isLive ? 'animate-pulse-live' : ''}
                />
                <span style={{ color: isLive ? 'var(--accent-emerald)' : '#888888' }}>
                  {isLive ? 'LIVE' : 'STANDBY'}
                </span>
              </div>
            </div>

            {/* Video Content or Standby Canvas */}
            <div
              style={{
                position: 'relative',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#111111',
              }}
            >
              {isEngineConnected && videoStreamUrl ? (
                <>
                  <img
                    src={videoStreamUrl}
                    alt="Live MediaPipe Optical Telemetry Stream"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="animate-laser-scan" />
                </>
              ) : (
                /* High-Tech Standby Canvas */
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: '2rem 1.5rem',
                    color: '#F7F7F5',
                    zIndex: 5,
                    gap: '1.25rem',
                  }}
                >
                  <DriverIllustration state={riskLevel} size={180} theme="dark" />

                  <div>
                    <h3
                      style={{
                        fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
                        fontSize: '1.4rem',
                        fontWeight: 700,
                        color: '#F7F7F5',
                        margin: '0 0 0.35rem 0',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      WAITING FOR PYTHON OPTICAL PIPELINE
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#999999', maxWidth: '420px', lineHeight: 1.5 }}>
                      To stream your physical webcam through the MediaPipe neural engine, run the command on your host laptop:
                    </p>
                  </div>

                  {/* 1-Click Copy Command Box */}
                  <div
                    onClick={() => handleCopyCommand('python run_production_bridge.py')}
                    title="Click to copy host command"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      padding: '0.45rem 0.95rem',
                      borderRadius: '2px',
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: '0.78rem',
                      color: '#F7F7F5',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <code>python run_production_bridge.py</code>
                    {copiedCmd ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} color="#888888" />}
                  </div>

                  {/* Immediate Action Buttons (Including Direct Simulation Demo) */}
                  <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button
                      onClick={onOpenDiagnostics}
                      style={{
                        padding: '0.45rem 0.95rem',
                        backgroundColor: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#F7F7F5',
                        borderRadius: '2px',
                        fontFamily: "var(--font-mono, monospace)",
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                      }}
                    >
                      <span>TEST / CONFIGURE BACKEND URL</span>
                    </button>

                    <button
                      onClick={() => handleScenarioSelect('NORMAL')}
                      style={{
                        padding: '0.45rem 1.15rem',
                        backgroundColor: '#F7F7F5',
                        border: 'none',
                        color: '#111111',
                        borderRadius: '2px',
                        fontFamily: "var(--font-mono, monospace)",
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <span>⚡ LAUNCH SIMULATION DEMO</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Stream Telemetry Bar */}
            <div
              style={{
                position: 'relative',
                zIndex: 10,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.65rem 1.25rem',
                backgroundColor: 'rgba(17, 17, 17, 0.85)',
                backdropFilter: 'blur(8px)',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                fontFamily: "var(--font-mono, monospace)",
                fontSize: '0.68rem',
                color: '#888888',
              }}
            >
              <span>MODE: {isEngineConnected ? 'LIVE HARDWARE' : isSimMode ? 'SYNTHETIC SIM' : 'OFFLINE'}</span>
              <span>EYES CLOSED: {eyesClosedTime > 0 ? `${eyesClosedTime.toFixed(1)}s` : '--'}</span>
              <span>HEAD POSE: P {headPitch?.toFixed(1)}° • Y {headYaw?.toFixed(1)}°</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: BIOMETRIC TELEMETRY GAUGES & SIMULATION CONTROLS
            ========================================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Attentiveness Dial Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-light)',
              borderRadius: '4px',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
            }}
          >
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                TELEMETRY // INDEX
              </span>
              <span className="techwear-tag">ATTENTIVENESS</span>
            </div>

            <RiskGauge score={riskScore} level={riskLevel} isLive={isLive} size={180} />

            <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Current incident status: <strong>{riskReason !== 'NONE' ? riskReason : 'ALL BIOMETRICS NOMINAL'}</strong>
            </div>
          </div>

          {/* Ocular & Mandibular Ratio Bars */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-light)',
              borderRadius: '4px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            {/* EAR Ratio Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "var(--font-mono, monospace)", fontSize: '0.74rem', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>EYE ASPECT RATIO (EAR)</span>
                <span style={{ fontWeight: 700, color: ear < 0.22 ? 'var(--accent-crimson)' : 'var(--text-primary)' }}>
                  {ear?.toFixed(2)} (CRIT &lt; 0.22)
                </span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-secondary)', borderRadius: '2px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${Math.min(100, (ear / 0.45) * 100)}%`,
                    height: '100%',
                    backgroundColor: ear < 0.22 ? 'var(--accent-crimson)' : 'var(--text-primary)',
                    transition: 'width 0.2s ease',
                  }}
                />
              </div>
            </div>

            {/* MAR Ratio Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "var(--font-mono, monospace)", fontSize: '0.74rem', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>MOUTH ASPECT RATIO (MAR)</span>
                <span style={{ fontWeight: 700, color: mar > 0.55 ? 'var(--accent-amber)' : 'var(--text-primary)' }}>
                  {mar?.toFixed(2)} (WARN &gt; 0.55)
                </span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-secondary)', borderRadius: '2px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${Math.min(100, (mar / 0.8) * 100)}%`,
                    height: '100%',
                    backgroundColor: mar > 0.55 ? 'var(--accent-amber)' : 'var(--text-primary)',
                    transition: 'width 0.2s ease',
                  }}
                />
              </div>
            </div>

            {/* Cranial 3D Degrees Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-light)' }}>
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.5rem', borderRadius: '2px', textAlign: 'center' }}>
                <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.62rem', color: 'var(--text-muted)' }}>PITCH</div>
                <div style={{ fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)", fontSize: '1.1rem', fontWeight: 700 }}>
                  {headPitch?.toFixed(1)}°
                </div>
              </div>
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.5rem', borderRadius: '2px', textAlign: 'center' }}>
                <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.62rem', color: 'var(--text-muted)' }}>YAW</div>
                <div style={{ fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)", fontSize: '1.1rem', fontWeight: 700 }}>
                  {headYaw?.toFixed(1)}°
                </div>
              </div>
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.5rem', borderRadius: '2px', textAlign: 'center' }}>
                <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.62rem', color: 'var(--text-muted)' }}>ROLL</div>
                <div style={{ fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)", fontSize: '1.1rem', fontWeight: 700 }}>
                  {headRoll?.toFixed(1)}°
                </div>
              </div>
            </div>
          </div>

          {/* Tactical Scenario Testing Bar */}
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-light)',
              borderRadius: '4px',
              padding: '1.25rem',
            }}
          >
            <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
              INCIDENT SIMULATION DIAL
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                onClick={() => handleScenarioSelect('NORMAL')}
                className="btn-editorial-outline"
                style={{ fontSize: '0.7rem', padding: '0.45rem', backgroundColor: 'var(--bg-surface)' }}
              >
                NOMINAL (SAFE)
              </button>
              <button
                onClick={() => handleScenarioSelect('CRITICAL')}
                className="btn-editorial-outline"
                style={{ fontSize: '0.7rem', padding: '0.45rem', color: 'var(--accent-crimson)', borderColor: 'var(--accent-crimson)', backgroundColor: 'var(--bg-surface)' }}
              >
                MICROSLEEP
              </button>
              <button
                onClick={() => handleScenarioSelect('HEAD_DOWN')}
                className="btn-editorial-outline"
                style={{ fontSize: '0.7rem', padding: '0.45rem', color: 'var(--accent-amber)', borderColor: 'var(--accent-amber)', backgroundColor: 'var(--bg-surface)' }}
              >
                HEAD DOWN
              </button>
              <button
                onClick={() => handleScenarioSelect('WARNING')}
                className="btn-editorial-outline"
                style={{ fontSize: '0.7rem', padding: '0.45rem', color: 'var(--accent-amber)', borderColor: 'var(--accent-amber)', backgroundColor: 'var(--bg-surface)' }}
              >
                YAWN (FATIGUE)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Integrated GPS Trip Tracking Panel */}
      <div style={{ marginTop: '1rem' }}>
        <GpsTripPanel />
      </div>
    </div>
  );
}
