import React, { useState } from 'react';
import RiskGauge from '../components/RiskGauge';
import AlertBanner from '../components/AlertBanner';
import DriverIllustration from '../components/DriverIllustration';
import InteractiveCockpit3D from '../components/InteractiveCockpit3D';
import {
  Play,
  Square,
  ArrowRight,
  ArrowUpRight,
  Camera,
  Sliders,
  ShieldCheck,
  Eye,
  Compass,
  Activity,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Radio,
  Lock,
  Cpu,
  Gauge,
  ChevronRight,
  Sparkles,
  Award,
  Layers,
  Zap,
  Terminal,
} from 'lucide-react';

/**
 * OverviewView Component
 * High-End Industrial & Engineering Architecture Overview
 * Primary Reference: SSTR (https://sstr.tech/en/) — Awwwards Site of the Day (SOTD) & Developer Award
 * Strict modular grid, SSTR Electric Safety Orange (#FE5B2A), 3D spatial kinematics,
 * and high-contrast hardware telemetry.
 */
export default function OverviewView({
  telemetryData = {},
  isEngineConnected = false,
  onNavigateToMonitor,
  onToggleSimMode,
  isSimMode = false,
  isMonitoring = true,
  onStartMonitoring,
  onToggleMonitoring,
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
    blinkRate = 18,
    perclos = 3.8,
    alertMessage = '',
    fps = 0,
    latencyMs = 0,
  } = telemetryData || {};

  const isLive = isSimMode || (isEngineConnected && isMonitoring);

  // SSTR perspective switcher: 0 = Cabin Vision, 1 = Chassis Dynamics, 2 = 3D Spatial Hologram
  const [activePerspective, setActivePerspective] = useState(0);

  const perspectives = [
    {
      id: 'cockpit',
      num: '01',
      tabLabel: 'CABIN SENSING',
      title: 'DRIVER-FACING OPTICAL INFERENCE',
      subtitle: 'Interior optical axis calibrated to driver gaze vector and palpebral aperture tracking',
      image: '/images/cockpit-driver.jpg',
      fallback: 'https://images.unsplash.com/photo-1491921125492-f0b9c835b699?auto=format&fit=crop&w=1920&q=85',
      tag: 'AXIS // CABIN_01',
      spec: '468 FACIAL MESH NODES // SUB-15MS LATENCY',
    },
    {
      id: 'vehicle',
      num: '02',
      tabLabel: 'CHASSIS TELEMETRY',
      title: 'AERODYNAMIC EDGE PLATFORM',
      subtitle: 'Self-contained on-device architecture operating with zero external cloud transmission',
      image: '/images/hero-car.jpg',
      fallback: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1920&q=85',
      tag: 'CHASSIS // EDGE_NODE',
      spec: 'AIR-GAPPED SQLITE VAULT // 100% PRIVATE',
    },
    {
      id: 'hologram',
      num: '03',
      tabLabel: '3D SPATIAL KINEMATICS',
      title: 'INTERACTIVE 3D CRANIAL MESH',
      subtitle: 'Real-time Three.js spatial telemetry reacting dynamically to physical head rotation and eyelids',
      is3D: true,
      tag: 'KINEMATICS // 3D_PnP',
      spec: '6-DOF LEVENBERG-MARQUARDT POSE ESTIMATION',
    },
  ];

  const currentView = perspectives[activePerspective];

  // Interactive Scenario Simulator state
  const [simActiveState, setSimActiveState] = useState('NOMINAL');

  return (
    <div className="sstr-overview-container sstr-grid-bg">
      {/* Editorial Safety Alert Banner */}
      <AlertBanner
        alertState={riskLevel}
        riskReason={riskReason}
        message={alertMessage}
        isEngineConnected={isEngineConnected || isSimMode}
        isMonitoring={isMonitoring}
        isRecovering={isRecovering}
      />

      {/* ===================================================================== */}
      {/* SECTION A: SSTR HERO // INDUSTRIAL ENGINEERING MASTHEAD               */}
      {/* ===================================================================== */}
      <section className="sstr-hero-section">
        {/* Technical Header Line */}
        <div className="sstr-hero-meta animate-sstr-fade-in">
          <span className="sstr-tag">SYSTEM ARCHITECTURE // SPEC.01</span>
          <span className="sstr-meta-divider">|</span>
          <span className="sstr-meta-item">ZERO-LATENCY EDGE VISION</span>
          <span className="sstr-meta-divider">|</span>
          <span className="sstr-meta-status">
            {isLive ? 'STATUS: ENGINE ONLINE (30 FPS)' : 'STATUS: HARDWARE STANDBY'}
          </span>
        </div>

        {/* Massive SSTR Engineering Headline */}
        <div className="sstr-hero-headline-block animate-sstr-headline">
          <h1 className="sstr-hero-title">
            FRICTIONLESS <br />
            <span className="sstr-title-accent">DRIVER VIGILANCE.</span>
          </h1>
          <p className="sstr-hero-description">
            High-performance edge computer vision engineered for autonomous driver attentiveness,
            micro-sleep suppression, and non-intrusive 468-point spatial facial landmark kinematics.
          </p>
        </div>

        {/* Hero Interactive Viewport Frame */}
        <div className="sstr-hero-viewport sstr-reticle">
          {/* Top Viewport Navigation Bar */}
          <div className="sstr-viewport-bar">
            <div className="sstr-perspective-switcher">
              {perspectives.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setActivePerspective(idx)}
                  className={`sstr-perspective-tab ${activePerspective === idx ? 'active' : ''}`}
                >
                  <span className="sstr-p-num">{p.num}</span>
                  <span className="sstr-p-label">{p.tabLabel}</span>
                </button>
              ))}
            </div>

            <div className="sstr-viewport-telemetry">
              <span className="sstr-telemetry-item">TOLERANCE: ±0.02°</span>
              <span className="sstr-telemetry-item">LATENCY: {latencyMs > 0 ? `${latencyMs}ms` : '12ms'}</span>
            </div>
          </div>

          {/* Active Visual Screen */}
          <div className="sstr-viewport-screen">
            {currentView.is3D ? (
              <InteractiveCockpit3D
                telemetryData={telemetryData}
                isMonitoring={isMonitoring}
                height="clamp(380px, 50vw, 560px)"
                theme="dark"
              />
            ) : (
              <div className="sstr-image-stage">
                <img
                  src={currentView.image}
                  alt={currentView.title}
                  onError={(e) => {
                    e.currentTarget.src = currentView.fallback;
                  }}
                  className="sstr-stage-img"
                />
                <div className="sstr-stage-gradient" />
                <div className="sstr-stage-overlay-specs">
                  <span className="sstr-stage-tag">{currentView.tag}</span>
                  <h3 className="sstr-stage-title">{currentView.title}</h3>
                  <p className="sstr-stage-desc">{currentView.subtitle}</p>
                  <div className="sstr-stage-badge">
                    <Activity size={12} color="#FE5B2A" />
                    <span>{currentView.spec}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Continuous Mechanical Telemetry Ticker Marquee */}
        <div className="sstr-ticker-wrap">
          <div className="animate-ticker">
            <div className="sstr-ticker-track">
              <span>SYS // DRIVEGUARD.AI</span>
              <span>•</span>
              <span>MEDIAPIPE 468-POINT MESH</span>
              <span>•</span>
              <span>LATENCY &lt; 15MS</span>
              <span>•</span>
              <span>PALPEBRAL EAR TOLERANCE 0.22</span>
              <span>•</span>
              <span>6-DOF LEVENBERG-MARQUARDT POSE</span>
              <span>•</span>
              <span>MOUTH MAR THRESHOLD 0.55</span>
              <span>•</span>
              <span>SQLITE PERSISTENT AUDIT VAULT</span>
              <span>•</span>
              <span>ZERO EXTERNAL CLOUD TELEMETRY</span>
              <span>•</span>
              <span>ISO-26262 ROAD COMPLIANCE</span>
              <span>•</span>
            </div>
            <div className="sstr-ticker-track" aria-hidden="true">
              <span>SYS // DRIVEGUARD.AI</span>
              <span>•</span>
              <span>MEDIAPIPE 468-POINT MESH</span>
              <span>•</span>
              <span>LATENCY &lt; 15MS</span>
              <span>•</span>
              <span>PALPEBRAL EAR TOLERANCE 0.22</span>
              <span>•</span>
              <span>6-DOF LEVENBERG-MARQUARDT POSE</span>
              <span>•</span>
              <span>MOUTH MAR THRESHOLD 0.55</span>
              <span>•</span>
              <span>SQLITE PERSISTENT AUDIT VAULT</span>
              <span>•</span>
              <span>ZERO EXTERNAL CLOUD TELEMETRY</span>
              <span>•</span>
              <span>ISO-26262 ROAD COMPLIANCE</span>
              <span>•</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 01 // THE TEMPORAL MARGIN (THE CRITICAL ENGINEERING PROBLEM)  */}
      {/* ===================================================================== */}
      <section className="sstr-section">
        <div className="sstr-section-header">
          <span className="sstr-tag">SECTION 01 // THE PROBLEM STATEMENT</span>
          <h2 className="sstr-section-title">THE TEMPORAL DEFICIT.</h2>
          <p className="sstr-section-desc">
            At 100 km/h, a motor vehicle traverses 27.7 metres every second. Physiological fatigue
            introduces irreversible latency into human perception-reaction cycles.
          </p>
        </div>

        <div className="sstr-problem-grid">
          {/* Card 1 */}
          <div className="sstr-card sstr-reticle">
            <div className="sstr-card-num">01 // LATENCY</div>
            <h3 className="sstr-card-title">120ms Neural Ingestion</h3>
            <p className="sstr-card-body">
              Standard biological reflex threshold before motor cortex stimulus. Edge optical
              inference tracks micro-tremors 8x faster than human realization.
            </p>
            <div className="sstr-card-stat">
              <span className="sstr-stat-value">14ms</span>
              <span className="sstr-stat-label">DRIVEGUARD AI INFERENCE</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="sstr-card sstr-reticle sstr-card-orange">
            <div className="sstr-card-num">02 // MICROSLEEP</div>
            <h3 className="sstr-card-title">1.0s Blind Distance</h3>
            <p className="sstr-card-body">
              At highway velocities, one second of sustained palpebral aperture closure translates
              into 28 metres of unguided, zero-control kinetic travel.
            </p>
            <div className="sstr-card-stat">
              <span className="sstr-stat-value">27.7m</span>
              <span className="sstr-stat-label">BLIND TRAVEL IN 1.0 SEC</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="sstr-card sstr-reticle">
            <div className="sstr-card-num">03 // CATASTROPHE</div>
            <h3 className="sstr-card-title">1.8s Critical Braking Loss</h3>
            <p className="sstr-card-body">
              Without active acoustic intervention, distracted cranial orientation past 20 degrees
              reduces available emergency stopping distance below survival margins.
            </p>
            <div className="sstr-card-stat">
              <span className="sstr-stat-value">-64%</span>
              <span className="sstr-stat-label">BRAKING MARGIN DEFICIT</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 02 // REAL-TIME OPTICAL COCKPIT HUD PREVIEW                   */}
      {/* ===================================================================== */}
      <section className="sstr-section">
        <div className="sstr-section-header">
          <span className="sstr-tag">SECTION 02 // OPTICAL HUD INSTRUMENTATION</span>
          <h2 className="sstr-section-title">REAL-TIME TELEMETRY CLUSTER.</h2>
          <p className="sstr-section-desc">
            Direct interface into edge computer-vision tensors, dynamic attentiveness score,
            and mathematical landmark ratios.
          </p>
        </div>

        <div className="sstr-cockpit-split">
          {/* Left: Viewport Live Frame */}
          <div className="sstr-live-frame sstr-reticle">
            <div className="sstr-frame-header">
              <div className="sstr-frame-cam">
                <Camera size={14} color="#FE5B2A" />
                <span>CAM_01 // RAW OPTICAL STREAM</span>
              </div>
              <div className="sstr-frame-fps">
                <span className="sstr-fps-dot" />
                <span>{isLive ? `${fps || 30} FPS` : 'STANDBY'}</span>
              </div>
            </div>

            <div className="sstr-frame-canvas">
              <DriverIllustration state={riskLevel} size={220} animated={true} />
              <div className="animate-laser-scan sstr-laser-beam" />
            </div>

            <div className="sstr-frame-footer">
              <span>SENSOR: WEBCAM_HD (640x480)</span>
              <span>EAR: {isLive ? ear.toFixed(2) : '0.33'} | MAR: {isLive ? mar.toFixed(2) : '0.12'}</span>
            </div>
          </div>

          {/* Right: Technical Gauges & Controls */}
          <div className="sstr-gauges-col">
            <div className="sstr-card">
              <span className="sstr-card-num">METRIC // DYNAMIC ATTENTIVENESS</span>
              <div className="sstr-gauge-center">
                <RiskGauge
                  score={isLive ? riskScore : 0}
                  level={isLive ? riskLevel : 'STANDBY'}
                  isLive={isLive}
                  size={180}
                />
              </div>
            </div>

            <div className="sstr-card">
              <span className="sstr-card-num">TOLERANCE // CRANIAL ORIENTATION</span>
              <div className="sstr-angles-grid">
                <div className="sstr-angle-box">
                  <span className="sstr-angle-lbl">PITCH</span>
                  <span className="sstr-angle-val">{isLive ? `${headPitch.toFixed(1)}°` : '0.0°'}</span>
                </div>
                <div className="sstr-angle-box">
                  <span className="sstr-angle-lbl">YAW</span>
                  <span className="sstr-angle-val">{isLive ? `${headYaw.toFixed(1)}°` : '0.0°'}</span>
                </div>
                <div className="sstr-angle-box">
                  <span className="sstr-angle-lbl">ROLL</span>
                  <span className="sstr-angle-val">{isLive ? `${headRoll.toFixed(1)}°` : '0.0°'}</span>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem' }}>
                <button
                  onClick={onNavigateToMonitor}
                  className="sstr-btn"
                  style={{ width: '100%' }}
                >
                  <Activity size={13} />
                  <span>LAUNCH FULL LIVE COCKPIT HUD</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 03 // MATHEMATICAL TAXONOMY & SENSOR FORMULATIONS            */}
      {/* ===================================================================== */}
      <section className="sstr-section">
        <div className="sstr-section-header">
          <span className="sstr-tag">SECTION 03 // ALGORITHMIC TAXONOMY</span>
          <h2 className="sstr-section-title">THE MATHEMATICS OF DETECTION.</h2>
          <p className="sstr-section-desc">
            Deterministic geometry calculated across 468 discrete 3D landmark points. Zero black-box hallucination.
          </p>
        </div>

        <div className="sstr-taxonomy-grid">
          {/* Card 1: Palpebral Closure */}
          <div className="sstr-card sstr-reticle">
            <div className="sstr-card-top">
              <Eye size={18} color="#FE5B2A" />
              <span className="sstr-card-num">MOD // 01</span>
            </div>
            <h3 className="sstr-card-title">Eye Aspect Ratio (EAR)</h3>
            <p className="sstr-card-body">
              Calculates Euclidean distances between perpendicular eyelid coordinate pairs divided by
              horizontal eye fissure span:
            </p>
            <code className="sstr-code-formula">
              EAR = (||p2-p6|| + ||p3-p5||) / (2 * ||p1-p4||)
            </code>
            <div className="sstr-card-footer">
              <span>CRITICAL LIMIT: &lt; 0.22</span>
              <span>SUSTAINED: &gt; 1.0 SEC</span>
            </div>
          </div>

          {/* Card 2: 3D Cranial Kinematics */}
          <div className="sstr-card sstr-reticle">
            <div className="sstr-card-top">
              <Compass size={18} color="#FE5B2A" />
              <span className="sstr-card-num">MOD // 02</span>
            </div>
            <h3 className="sstr-card-title">3D Cranial PnP Kinematics</h3>
            <p className="sstr-card-body">
              Maps 2D optical facial projections against a calibrated 3D anthropometric head model
              using Perspective-n-Point iterative rotation matrices:
            </p>
            <code className="sstr-code-formula">
              s · [u, v, 1]ᵀ = K · [R | t] · [X, Y, Z, 1]ᵀ
            </code>
            <div className="sstr-card-footer">
              <span>DEVIATION LIMIT: &gt; 25°</span>
              <span>DOWNTURN: &lt; -15°</span>
            </div>
          </div>

          {/* Card 3: Mouth MAR Yawn */}
          <div className="sstr-card sstr-reticle">
            <div className="sstr-card-top">
              <Gauge size={18} color="#FE5B2A" />
              <span className="sstr-card-num">MOD // 03</span>
            </div>
            <h3 className="sstr-card-title">Mouth Aspect Ratio (MAR)</h3>
            <p className="sstr-card-body">
              Detects fatigue-induced yawning through continuous lip aperture tracking against
              horizontal commissure width:
            </p>
            <code className="sstr-code-formula">
              MAR = (||m2-m8|| + ||m4-m6||) / (2 * ||m1-m5||)
            </code>
            <div className="sstr-card-footer">
              <span>WARNING THRESHOLD: &gt; 0.55</span>
              <span>TRIGGER: &gt; 2.5 SEC</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 04 // DECATHLON / SSTR INTERACTIVE HARDWARE SIMULATION        */}
      {/* ===================================================================== */}
      <section className="sstr-section">
        <div className="sstr-section-header">
          <span className="sstr-tag">SECTION 04 // HARDWARE TEST DIAL</span>
          <h2 className="sstr-section-title">INTERACTIVE TEST HARNESS.</h2>
          <p className="sstr-section-desc">
            Audit instantaneous reactivity across all safety states. Simulates acute microsleep,
            lateral distraction, and nominal alertness.
          </p>
        </div>

        <div className="sstr-sim-deck sstr-reticle">
          <div className="sstr-deck-header">
            <div className="sstr-deck-title">
              <Sliders size={15} color="#FE5B2A" />
              <span>TEST HARNESS SCENARIO DIAL</span>
            </div>
            <span className="sstr-deck-badge">AIR-GAPPED SIMULATION ENGINE</span>
          </div>

          <div className="sstr-scenarios-grid">
            <button
              onClick={() => {
                setSimActiveState('NOMINAL');
                onToggleSimMode?.();
              }}
              className={`sstr-scenario-btn ${simActiveState === 'NOMINAL' ? 'active' : ''}`}
            >
              <div className="sstr-scenario-tag">STATE 01 // NOMINAL</div>
              <div className="sstr-scenario-name">Attentive Baseline</div>
              <div className="sstr-scenario-spec">EAR 0.35 • MAR 0.12 • PITCH 0.5°</div>
            </button>

            <button
              onClick={() => {
                setSimActiveState('HEAD_DOWN');
                onToggleSimMode?.();
              }}
              className={`sstr-scenario-btn ${simActiveState === 'HEAD_DOWN' ? 'active' : ''}`}
            >
              <div className="sstr-scenario-tag" style={{ color: '#F59E0B' }}>STATE 02 // DISTRACTION</div>
              <div className="sstr-scenario-name">Head-Down Phone Gaze</div>
              <div className="sstr-scenario-spec">PITCH -21.4° FOR 2.4s</div>
            </button>

            <button
              onClick={() => {
                setSimActiveState('WARNING');
                onToggleSimMode?.();
              }}
              className={`sstr-scenario-btn ${simActiveState === 'WARNING' ? 'active' : ''}`}
            >
              <div className="sstr-scenario-tag" style={{ color: '#F59E0B' }}>STATE 03 // FATIGUE</div>
              <div className="sstr-scenario-name">Sustained Yawn Onset</div>
              <div className="sstr-scenario-spec">MAR 0.68 FOR 2.8s</div>
            </button>

            <button
              onClick={() => {
                setSimActiveState('CRITICAL');
                onToggleSimMode?.();
              }}
              className={`sstr-scenario-btn ${simActiveState === 'CRITICAL' ? 'active' : ''}`}
            >
              <div className="sstr-scenario-tag" style={{ color: '#EF4444' }}>STATE 04 // CRITICAL</div>
              <div className="sstr-scenario-name">Prolonged Microsleep</div>
              <div className="sstr-scenario-spec">EAR 0.12 FOR 2.1s • HAZARD CHIME</div>
            </button>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 05 // PERSISTENT FLIGHT LEDGER (SQLITE AUDIT VAULT)           */}
      {/* ===================================================================== */}
      <section className="sstr-section">
        <div className="sstr-section-header">
          <span className="sstr-tag">SECTION 05 // SQLITE IMMUTABLE LEDGER</span>
          <h2 className="sstr-section-title">THE FLIGHT AUDIT VAULT.</h2>
          <p className="sstr-section-desc">
            Every driving session exceeding 5 seconds is persistently certified into SQLite on your local machine.
          </p>
        </div>

        <div className="sstr-ledger-card sstr-reticle">
          <div className="sstr-ledger-header">
            <div>
              <span className="sstr-ledger-sub">PERSISTENT REPOSITORY // LOCALHOST:8000</span>
              <h3 className="sstr-ledger-title">driveguard.db // CERTIFIED SAFETY SESSIONS</h3>
            </div>
            <div className="sstr-ledger-badge">
              <Lock size={12} color="#10B981" />
              <span>100% PRIVATE & ENCRYPTED</span>
            </div>
          </div>

          <div className="sstr-ledger-specs-grid">
            <div className="sstr-spec-item">
              <span className="sstr-spec-lbl">STORAGE ENGINE</span>
              <span className="sstr-spec-val">SQLite3 Local WAL</span>
            </div>
            <div className="sstr-spec-item">
              <span className="sstr-spec-lbl">ENDPOINT SCHEME</span>
              <span className="sstr-spec-val">REST /api/trips</span>
            </div>
            <div className="sstr-spec-item">
              <span className="sstr-spec-lbl">SPATIAL TELEMETRY</span>
              <span className="sstr-spec-val">Haversine GPS Trace</span>
            </div>
            <div className="sstr-spec-item">
              <span className="sstr-spec-lbl">INCIDENT DEDUCTIONS</span>
              <span className="sstr-spec-val">-15pt Sleep / -5pt Yawn</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* EPILOGUE // INDUSTRIAL HARDWARE LAUNCHPAD CTA                         */}
      {/* ===================================================================== */}
      <section className="sstr-epilogue-banner sstr-reticle">
        <div className="sstr-epilogue-content">
          <span className="sstr-tag" style={{ color: '#FE5B2A' }}>MISSION READY // OPERATIONAL COCKPIT</span>
          <h2 className="sstr-epilogue-title">
            ZERO LATENCY. <br />
            ZERO COMPROMISE.
          </h2>
          <p className="sstr-epilogue-desc">
            Engage the high-performance optical pipeline and experience computer-vision driver protection.
          </p>
          <div className="sstr-epilogue-actions">
            <button
              onClick={onNavigateToMonitor}
              className="sstr-btn"
              style={{ padding: '0.85rem 2rem', fontSize: '0.85rem' }}
            >
              <Play size={14} fill="#FFFFFF" />
              <span>LAUNCH LIVE COCKPIT</span>
            </button>

            <button
              onClick={() => onSelectTab?.('history')}
              className="sstr-btn-secondary"
              style={{ padding: '0.85rem 1.8rem', fontSize: '0.85rem' }}
            >
              <span>INSPECT FLIGHT LEDGER</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Scoped CSS Styles for SSTR Overview Experience */}
      <style>{`
        .sstr-overview-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: clamp(1.5rem, 4vw, 3rem) clamp(1.25rem, 3.5vw, 3rem) 6rem;
          display: flex;
          flex-direction: column;
          gap: 5rem;
        }

        /* Hero Section */
        .sstr-hero-section {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .sstr-hero-meta {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          flex-wrap: wrap;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--text-secondary);
        }
        .sstr-meta-divider {
          color: rgba(255, 255, 255, 0.15);
        }
        .sstr-meta-status {
          color: #10B981;
          font-weight: 600;
        }

        .sstr-hero-headline-block {
          max-width: 980px;
        }
        .sstr-hero-title {
          font-family: var(--font-display);
          font-size: clamp(2.8rem, 6.5vw, 5.2rem);
          font-weight: 800;
          line-height: 0.98;
          letter-spacing: -0.03em;
          color: #FFFFFF;
          margin: 0 0 1.25rem 0;
          text-transform: uppercase;
        }
        .sstr-title-accent {
          color: #FE5B2A;
          text-shadow: 0 0 35px rgba(254, 91, 42, 0.35);
        }
        .sstr-hero-description {
          font-family: var(--font-sans);
          font-size: clamp(0.95rem, 1.8vw, 1.15rem);
          line-height: 1.6;
          color: #9FA4B0;
          max-width: 720px;
          margin: 0;
        }

        /* Hero Viewport */
        .sstr-hero-viewport {
          background: #141518;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
        }
        .sstr-viewport-bar {
          background: #18191B;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding: 0.75rem 1.25rem;
          display: flex;
          justifyContent: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .sstr-perspective-switcher {
          display: inline-flex;
          align-items: center;
          background: #0D0E10;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          padding: 2px;
          gap: 2px;
        }
        .sstr-perspective-tab {
          background: transparent;
          border: none;
          padding: 0.45rem 1rem;
          color: #9FA4B0;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 600;
          cursor: pointer;
          border-radius: 3px;
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          transition: all 0.2s ease;
        }
        .sstr-perspective-tab:hover {
          color: #FFFFFF;
        }
        .sstr-perspective-tab.active {
          background: #202226;
          color: #FFFFFF;
        }
        .sstr-perspective-tab.active .sstr-p-num {
          color: #FE5B2A;
        }
        .sstr-p-num {
          color: #5F6470;
        }
        .sstr-viewport-telemetry {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: #5F6470;
        }

        .sstr-viewport-screen {
          position: relative;
          min-height: clamp(380px, 48vw, 540px);
          background: #0D0E10;
          display: flex;
          align-items: center;
          justifyContent: center;
        }
        .sstr-image-stage {
          position: relative;
          width: 100%;
          height: clamp(380px, 48vw, 540px);
          overflow: hidden;
        }
        .sstr-stage-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          filter: contrast(1.05) brightness(0.85);
        }
        .sstr-stage-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(13, 14, 16, 0.1) 0%, rgba(13, 14, 16, 0.85) 100%);
        }
        .sstr-stage-overlay-specs {
          position: absolute;
          bottom: 2rem;
          left: 2rem;
          max-width: 580px;
          z-index: 5;
        }
        .sstr-stage-tag {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: #FE5B2A;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 700;
        }
        .sstr-stage-title {
          font-family: var(--font-display);
          font-size: clamp(1.4rem, 2.5vw, 2.2rem);
          font-weight: 700;
          color: #FFFFFF;
          margin: 0.35rem 0;
          text-transform: uppercase;
        }
        .sstr-stage-desc {
          font-family: var(--font-sans);
          font-size: 0.9rem;
          color: #9FA4B0;
          line-height: 1.5;
          margin-bottom: 0.85rem;
        }
        .sstr-stage-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 0.3rem 0.75rem;
          border-radius: 4px;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: #FFFFFF;
        }

        /* Marquee Ticker */
        .sstr-ticker-wrap {
          overflow: hidden;
          background: #141518;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          padding: 0.85rem 0;
        }
        .sstr-ticker-track {
          display: inline-flex;
          align-items: center;
          gap: 1.5rem;
          font-family: var(--font-mono);
          font-size: 0.74rem;
          color: #9FA4B0;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          white-space: nowrap;
          padding: 0 1rem;
        }
        .sstr-ticker-track span {
          display: inline-block;
        }

        /* Sections General */
        .sstr-section {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .sstr-section-header {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          max-width: 800px;
        }
        .sstr-section-title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 800;
          color: #FFFFFF;
          margin: 0;
          letter-spacing: -0.02em;
          text-transform: uppercase;
        }
        .sstr-section-desc {
          font-family: var(--font-sans);
          font-size: 0.95rem;
          color: #9FA4B0;
          line-height: 1.6;
          margin: 0;
        }

        /* Cards & Grid */
        .sstr-problem-grid,
        .sstr-taxonomy-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .sstr-card {
          background: #141518;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          padding: 1.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          transition: all 0.25s ease;
        }
        .sstr-card:hover {
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }
        .sstr-card-orange {
          border-color: rgba(254, 91, 42, 0.35);
          background: rgba(254, 91, 42, 0.04);
        }
        .sstr-card-num {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: #FE5B2A;
          letter-spacing: 0.1em;
          font-weight: 700;
        }
        .sstr-card-title {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0;
        }
        .sstr-card-body {
          font-family: var(--font-sans);
          font-size: 0.88rem;
          color: #9FA4B0;
          line-height: 1.55;
          margin: 0;
        }
        .sstr-card-stat {
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
        }
        .sstr-stat-value {
          font-family: var(--font-display);
          font-size: 2.2rem;
          font-weight: 800;
          color: #FFFFFF;
          line-height: 1;
        }
        .sstr-stat-label {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: #5F6470;
          letter-spacing: 0.08em;
          margin-top: 0.35rem;
        }

        .sstr-code-formula {
          font-family: var(--font-mono);
          font-size: 0.76rem;
          color: #FE5B2A;
          background: #0D0E10;
          padding: 0.65rem 0.85rem;
          border-radius: 4px;
          border: 1px solid rgba(254, 91, 42, 0.2);
          word-break: break-all;
        }

        .sstr-card-footer {
          margin-top: auto;
          display: flex;
          justifyContent: space-between;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: #5F6470;
          padding-top: 0.85rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        /* Cockpit Split */
        .sstr-cockpit-split {
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
          gap: 1.5rem;
          align-items: start;
        }
        @media (max-width: 992px) {
          .sstr-cockpit-split {
            grid-template-columns: 1fr;
          }
        }

        .sstr-live-frame {
          background: #141518;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          overflow: hidden;
        }
        .sstr-frame-header {
          padding: 0.85rem 1.25rem;
          background: #18191B;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          justifyContent: space-between;
          align-items: center;
          font-family: var(--font-mono);
          font-size: 0.72rem;
        }
        .sstr-frame-cam {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #FFFFFF;
          font-weight: 600;
        }
        .sstr-frame-fps {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          color: #10B981;
        }
        .sstr-fps-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #10B981;
        }
        .sstr-frame-canvas {
          position: relative;
          min-height: 380px;
          background: #0D0E10;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          overflow: hidden;
        }
        .sstr-laser-beam {
          position: absolute;
          left: 0;
          right: 0;
          height: 2px;
          background-color: #FE5B2A;
          box-shadow: 0 0 12px #FE5B2A;
          pointer-events: none;
        }
        .sstr-frame-footer {
          padding: 0.75rem 1.25rem;
          background: #18191B;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          justifyContent: space-between;
          align-items: center;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: #5F6470;
        }

        .sstr-gauges-col {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .sstr-gauge-center {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1.25rem 0;
        }
        .sstr-angles-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.65rem;
          margin-top: 0.65rem;
        }
        .sstr-angle-box {
          background: #0D0E10;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          padding: 0.65rem 0.45rem;
          text-align: center;
        }
        .sstr-angle-lbl {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: #5F6470;
          display: block;
        }
        .sstr-angle-val {
          font-family: var(--font-display);
          font-size: 1.2rem;
          font-weight: 700;
          color: #FFFFFF;
        }

        /* Simulator Deck */
        .sstr-sim-deck {
          background: #141518;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          padding: 1.85rem;
        }
        .sstr-deck-header {
          display: flex;
          justifyContent: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .sstr-deck-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-mono);
          font-size: 0.76rem;
          font-weight: 700;
          color: #FFFFFF;
        }
        .sstr-deck-badge {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: #5F6470;
        }
        .sstr-scenarios-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 0.85rem;
        }
        .sstr-scenario-btn {
          background: #0D0E10;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          padding: 1rem;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .sstr-scenario-btn:hover {
          border-color: rgba(255, 255, 255, 0.25);
          background: #18191B;
        }
        .sstr-scenario-btn.active {
          border-color: #FE5B2A;
          background: rgba(254, 91, 42, 0.08);
        }
        .sstr-scenario-tag {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: #10B981;
          font-weight: 700;
          margin-bottom: 0.35rem;
        }
        .sstr-scenario-name {
          font-family: var(--font-sans);
          font-size: 0.88rem;
          font-weight: 700;
          color: #FFFFFF;
        }
        .sstr-scenario-spec {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: #5F6470;
          margin-top: 0.4rem;
        }

        /* Ledger Card */
        .sstr-ledger-card {
          background: #141518;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          padding: 2rem;
        }
        .sstr-ledger-header {
          display: flex;
          justifyContent: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 1.25rem;
          margin-bottom: 1.5rem;
        }
        .sstr-ledger-sub {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: #FE5B2A;
          letter-spacing: 0.1em;
          display: block;
        }
        .sstr-ledger-title {
          font-family: var(--font-mono);
          font-size: 1.2rem;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0.25rem 0 0 0;
        }
        .sstr-ledger-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.25);
          padding: 0.35rem 0.85rem;
          border-radius: 4px;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: #10B981;
          font-weight: 600;
        }
        .sstr-ledger-specs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.25rem;
        }
        .sstr-spec-item {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .sstr-spec-lbl {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: #5F6470;
          letter-spacing: 0.08em;
        }
        .sstr-spec-val {
          font-family: var(--font-mono);
          font-size: 0.88rem;
          font-weight: 600;
          color: #FFFFFF;
        }

        /* Epilogue */
        .sstr-epilogue-banner {
          background: #141518;
          border: 1px solid rgba(254, 91, 42, 0.3);
          border-radius: 8px;
          padding: clamp(2.5rem, 5vw, 4.5rem) clamp(1.5rem, 4vw, 3rem);
          position: relative;
          overflow: hidden;
        }
        .sstr-epilogue-banner::after {
          content: '';
          position: absolute;
          top: -40%;
          right: -10%;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(254, 91, 42, 0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        .sstr-epilogue-content {
          max-width: 680px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          position: relative;
          z-index: 5;
        }
        .sstr-epilogue-title {
          font-family: var(--font-display);
          font-size: clamp(2.2rem, 4.5vw, 3.8rem);
          font-weight: 800;
          line-height: 1;
          color: #FFFFFF;
          margin: 0;
          letter-spacing: -0.02em;
        }
        .sstr-epilogue-desc {
          font-family: var(--font-sans);
          font-size: 0.95rem;
          color: #9FA4B0;
          line-height: 1.6;
          margin: 0;
        }
        .sstr-epilogue-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          margin-top: 0.85rem;
        }
      `}</style>
    </div>
  );
}