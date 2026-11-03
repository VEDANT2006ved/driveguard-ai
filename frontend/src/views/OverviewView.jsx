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
  ChevronLeft,
  Sparkles,
  Award,
  Layers,
  Zap,
} from 'lucide-react';

/**
 * OverviewView Component — Luxury Editorial & Interactive Automotive Experience
 * Blending the prestige of Explora Journeys, the avant-garde minimalism of NOMU,
 * and the chapter-based interactive storytelling of Decathlon Yestalgia.
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

  // NOMU-inspired perspective switcher: 0 = Cockpit, 1 = Chassis, 2 = 3D Neural Hologram
  const [activePerspective, setActivePerspective] = useState(0);

  const perspectives = [
    {
      id: 'cockpit',
      num: '01',
      tabLabel: 'Cabin Vision',
      title: 'Driver-Facing Optical Vision',
      subtitle: 'Interior perspective aligned to driver head pose and palpebral aperture tracking',
      image: '/images/cockpit-driver.jpg',
      fallback: 'https://images.unsplash.com/photo-1491921125492-f0b9c835b699?auto=format&fit=crop&w=1920&q=85',
      tag: 'CABIN SENSING AXIS',
      pin: { top: '22%', left: '72%', text: 'Driver Monitoring Vision // 30 FPS' },
    },
    {
      id: 'vehicle',
      num: '02',
      tabLabel: 'Chassis Form',
      title: 'Intelligent Aerodynamic Form',
      subtitle: 'Pristine exhibition showroom context demonstrating zero cloud intrusion',
      image: '/images/hero-car.jpg',
      fallback: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1920&q=85',
      tag: 'CHASSIS DYNAMICS',
      pin: { top: '34%', left: '46%', text: 'Sensor Integration // 468 Landmark Mesh' },
    },
    {
      id: 'hologram',
      num: '03',
      tabLabel: '3D Neural Mesh',
      title: 'Interactive 3D Driver Hologram',
      subtitle: 'Real-time Three.js spatial telemetry reacting dynamically to head rotation and eyelids',
      is3D: true,
      tag: 'SPATIAL TELEMETRY',
      pin: { top: '50%', left: '50%', text: 'Live Spatial Head Pose Kinematics' },
    },
  ];

  const currentView = perspectives[activePerspective];

  // Interactive state machine demo trigger (Decathlon Yestalgia interactive storytelling)
  const [simActiveState, setSimActiveState] = useState('NOMINAL');

  return (
    <div className="dg-overview-wrapper">
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
      {/* SECTION A: GRAND CINEMATIC HERO (EXPLORA JOURNEYS + NOMU DOCK)         */}
      {/* ===================================================================== */}
      <section className="dg-hero-section">
        {/* Editorial Masthead Eyebrow */}
        <div className="dg-masthead-eyebrow cinematic-fade-in">
          <div className="dg-stamp-badge">
            <span className="dg-stamp-dot" />
            <span>VOLUME 2026 // ISSUE IV</span>
          </div>
          <span className="dg-masthead-divider">•</span>
          <span className="dg-masthead-category">EDGE COMPUTER VISION ARCHITECTURE</span>
          <span className="dg-masthead-divider">•</span>
          <span className="dg-masthead-status">
            {isLive ? 'LIVE OPTICAL ENGINE RUNNING' : 'SYSTEM CALIBRATED // STANDBY'}
          </span>
        </div>

        {/* Master Editorial Title (Playfair Serif + Syne Modern Sans) */}
        <div className="dg-hero-title-container hero-headline-reveal">
          <span className="dg-hero-pre-title">THE ARCHITECTURE OF VIGILANCE</span>
          <h1 className="dg-hero-title">
            Where machine intelligence meets human intuition on the open road.
          </h1>
          <p className="dg-hero-subtitle">
            A bespoke on-device driver attentiveness system powered by sub-15ms facial landmark geometry.
            Non-intrusive, zero cloud transmission, preserving privacy and life.
          </p>
        </div>

        {/* Primary Interaction Buttons (Tactile Luxury Deck) */}
        <div className="dg-hero-actions-deck cinematic-fade-in">
          {!isMonitoring && onStartMonitoring ? (
            <button onClick={onStartMonitoring} className="dg-hero-cta-primary">
              <Play size={13} fill="currentColor" />
              <span>START MONITORING</span>
              <span className="dg-cta-badge">ENGINE</span>
            </button>
          ) : (
            <button onClick={onNavigateToMonitor} className="dg-hero-cta-primary">
              <Camera size={14} />
              <span>ENTER COCKPIT HUD</span>
              <ArrowRight size={13} />
            </button>
          )}

          <button onClick={onNavigateToMonitor} className="dg-hero-cta-secondary">
            <span>INSPECT OPTICAL STREAM</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        {/* Centerpiece Visual Exhibit: 3-Way Perspective Canvas (Chassis, Cabin, 3D Three.js) */}
        <div className="dg-hero-canvas-frame hero-image-reveal">
          {/* Top Gallery Header Bar */}
          <div className="dg-canvas-top-bar">
            <div className="dg-canvas-tag">
              <span className="dg-tag-accent" />
              <span>{currentView.tag}</span>
            </div>

            {/* NOMU Segmented Perspective Switcher */}
            <div className="dg-perspective-dock">
              {perspectives.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setActivePerspective(idx)}
                  className={`dg-perspective-btn ${activePerspective === idx ? 'active' : ''}`}
                >
                  <span className="dg-perspective-num">{p.num}</span>
                  <span className="dg-perspective-label">{p.tabLabel}</span>
                </button>
              ))}
            </div>

            <div className="dg-canvas-coords">
              <span>LAT 45.4642° N</span>
              <span>//</span>
              <span>LON 9.1900° E</span>
            </div>
          </div>

          {/* Visual Display: Either 3D Three.js Hologram or High-Res Editorial Photography */}
          <div className="dg-canvas-viewport">
            {currentView.is3D ? (
              <div className="dg-three-container">
                <InteractiveCockpit3D
                  telemetryData={telemetryData}
                  isMonitoring={isMonitoring}
                  height="clamp(380px, 52vw, 560px)"
                  theme="light"
                />
                <div className="dg-3d-hint">
                  <Sparkles size={12} color="var(--color-gold)" />
                  <span>INTERACTIVE THREE.JS SCENE • DRAG MOUSE TO ROTATE ORBIT</span>
                </div>
              </div>
            ) : (
              <div className="dg-image-container zoom-container">
                <img
                  key={currentView.id}
                  src={currentView.image}
                  alt={currentView.title}
                  className="dg-hero-image"
                  onError={(e) => {
                    e.currentTarget.src = currentView.fallback;
                  }}
                />

                {/* Hotspot Sensor Callout */}
                <div
                  className="dg-sensor-hotspot"
                  style={{ top: currentView.pin.top, left: currentView.pin.left }}
                >
                  <span className="dg-hotspot-beacon" />
                  <span className="dg-hotspot-text">{currentView.pin.text}</span>
                </div>
              </div>
            )}

            {/* Subtle Vignette & Frame Brackets */}
            <div className="dg-canvas-bracket top-left">┌</div>
            <div className="dg-canvas-bracket top-right">┐</div>
            <div className="dg-canvas-bracket bottom-left">└</div>
            <div className="dg-canvas-bracket bottom-right">┘</div>

            {/* Nav Arrows */}
            <button
              onClick={() => setActivePerspective((prev) => (prev === 0 ? perspectives.length - 1 : prev - 1))}
              className="dg-canvas-arrow left"
              aria-label="Previous Perspective"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setActivePerspective((prev) => (prev === perspectives.length - 1 ? 0 : prev + 1))}
              className="dg-canvas-arrow right"
              aria-label="Next Perspective"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Bottom Exhibition Caption Footer */}
          <div className="dg-canvas-caption-bar">
            <div>
              <h3 className="dg-caption-title">{currentView.title}</h3>
              <p className="dg-caption-desc">{currentView.subtitle}</p>
            </div>
            <div className="dg-caption-specs">
              <span className="dg-spec-item">
                <strong>468</strong> NODES MESH
              </span>
              <span className="dg-spec-divider">|</span>
              <span className="dg-spec-item">
                <strong>{fps > 0 ? `${fps} FPS` : '30 FPS'}</strong> INFERENCE
              </span>
              <span className="dg-spec-divider">|</span>
              <span className="dg-spec-item">
                <strong>100%</strong> LOCAL PRIVACY
              </span>
            </div>
          </div>
        </div>

        {/* NOMU Animated Continuous Telemetry Ticker Ribbon */}
        <div className="dg-marquee-container">
          <div className="dg-marquee-content animate-ticker">
            <span>EAR METRIC: {ear.toFixed(2)}</span>
            <span className="ticker-dot">•</span>
            <span>MOUTH MAR: {mar.toFixed(2)}</span>
            <span className="ticker-dot">•</span>
            <span>HEAD YAW: {headYaw.toFixed(1)}°</span>
            <span className="ticker-dot">•</span>
            <span>PITCH: {headPitch.toFixed(1)}°</span>
            <span className="ticker-dot">•</span>
            <span>ROLL: {headRoll.toFixed(1)}°</span>
            <span className="ticker-dot">•</span>
            <span>PERCLOS OCULAR: {perclos.toFixed(1)}%</span>
            <span className="ticker-dot">•</span>
            <span>FACIAL LANDMARK MESH: 468 VECTORS</span>
            <span className="ticker-dot">•</span>
            <span>LATENCY: {latencyMs > 0 ? `${latencyMs}MS` : '12MS'}</span>
            <span className="ticker-dot">•</span>
            <span>STATUS: {isLive ? 'STREAMING ACTIVE' : 'CALIBRATED'}</span>
            <span className="ticker-dot">•</span>
            {/* Duplicate for seamless looping */}
            <span>EAR METRIC: {ear.toFixed(2)}</span>
            <span className="ticker-dot">•</span>
            <span>MOUTH MAR: {mar.toFixed(2)}</span>
            <span className="ticker-dot">•</span>
            <span>HEAD YAW: {headYaw.toFixed(1)}°</span>
            <span className="ticker-dot">•</span>
            <span>PITCH: {headPitch.toFixed(1)}°</span>
            <span className="ticker-dot">•</span>
            <span>ROLL: {headRoll.toFixed(1)}°</span>
            <span className="ticker-dot">•</span>
            <span>PERCLOS OCULAR: {perclos.toFixed(1)}%</span>
            <span className="ticker-dot">•</span>
            <span>FACIAL LANDMARK MESH: 468 VECTORS</span>
            <span className="ticker-dot">•</span>
            <span>LATENCY: {latencyMs > 0 ? `${latencyMs}MS` : '12MS'}</span>
            <span className="ticker-dot">•</span>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* CHAPTER 01: THE TEMPORAL HAZARD (EXPLORA JOURNEYS EDITORIAL SPREAD)   */}
      {/* ===================================================================== */}
      <section className="dg-editorial-spread-section">
        <div className="dg-spread-container">
          <div className="dg-spread-grid">
            {/* Left Column: Bold Narrative & Critical Metrics */}
            <div className="dg-spread-narrative">
              <div className="dg-chapter-eyebrow">
                <span className="dg-chapter-num">CHAPTER 01</span>
                <span className="dg-chapter-line" />
                <span className="dg-chapter-tag">THE TEMPORAL MARGIN</span>
              </div>

              <h2 className="dg-spread-headline">
                In 1.8 seconds at 100 km/h, a vehicle travels 50 meters blind.
              </h2>

              <p className="dg-spread-body">
                Fatigue and cognitive distraction are rarely instantaneous catastrophes. They manifest as subtle,
                measurable micro-alterations in palpebral aperture velocity and persistent cranial pitch deviation.
                By the time human conscious awareness registers a lapse, critical braking margins have already vanished.
              </p>

              {/* 3 Precision Technical Benchmarks */}
              <div className="dg-benchmarks-grid">
                <div className="dg-benchmark-card">
                  <span className="dg-bm-num">01 // PHYSIOLOGICAL</span>
                  <span className="dg-bm-value">120 ms</span>
                  <span className="dg-bm-desc">Filtered nominal involuntary blink</span>
                </div>

                <div className="dg-benchmark-card warning">
                  <span className="dg-bm-num">02 // CAUTION GATE</span>
                  <span className="dg-bm-value">1.00 s</span>
                  <span className="dg-bm-desc">Subtle acoustic warn threshold</span>
                </div>

                <div className="dg-benchmark-card critical">
                  <span className="dg-bm-num">03 // CRITICAL EMERGENCY</span>
                  <span className="dg-bm-value">1.80 s</span>
                  <span className="dg-bm-desc">Emergency acoustic tone & incident tag</span>
                </div>
              </div>
            </div>

            {/* Right Column: High-Impact Atmospheric Editorial Image */}
            <div className="dg-spread-media-col">
              <div className="dg-spread-image-card zoom-container">
                <img
                  src="/images/problem-car.jpg"
                  alt="Atmospheric vehicle perspective on dusk motorway"
                  className="dg-spread-img"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1920&q=85';
                  }}
                />
                <div className="dg-spread-badge">
                  <span>FIG. 01 // KINEMATIC DANGER ENVELOPE</span>
                  <span className="dg-spread-badge-sub">VELOCITY 100 KM/H • NIGHTTIME ROAD ENVELOPE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* CHAPTER 02: REAL-TIME SENSING HUD (LUXURY WARM CHAMPAGNE INSTRUMENT)  */}
      {/* ===================================================================== */}
      <section className="dg-hud-chapter-section section-c-hud">
        <div className="dg-hud-container">
          <div className="dg-hud-header-row">
            <div>
              <div className="dg-chapter-eyebrow" style={{ color: '#A77B5A' }}>
                <span className="dg-chapter-num" style={{ color: '#8B7565' }}>CHAPTER 02</span>
                <span className="dg-chapter-line" style={{ backgroundColor: '#D1B198' }} />
                <span className="dg-chapter-tag" style={{ color: '#8B7565' }}>NEURAL COCKPIT INSTRUMENT</span>
              </div>
              <h2 className="dg-hud-headline">Optical Telemetry HUD.</h2>
              <p className="dg-hud-subtext">
                Live facial landmark telemetry stream processed directly on your silicon. Zero network latency,
                100% offline privacy, and mathematical Euclidean precision.
              </p>
            </div>

            <div className="dg-hud-actions">
              <button
                onClick={onToggleMonitoring}
                className="dg-hud-btn"
              >
                {isMonitoring ? (
                  <>
                    <Square size={12} fill="currentColor" />
                    <span>HALT MONITORING</span>
                  </>
                ) : (
                  <>
                    <Play size={12} fill="currentColor" />
                    <span>START SENSING</span>
                  </>
                )}
              </button>

              <button onClick={onNavigateToMonitor} className="dg-hud-btn-outline">
                <span>FULL COCKPIT VIEW</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Main Cockpit Split Grid */}
          <div className="dg-hud-grid">
            {/* Left: Video Viewport / Standby Calibration Canvas */}
            <div className="dg-hud-viewport-card">
              <div className="dg-hud-viewport-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Camera size={14} color="#756052" />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 600, color: '#382C27' }}>
                    OPTICAL CAM_01 // 640x480 RAW STREAM
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: isLive ? '#10B981' : '#8B7565',
                    }}
                    className={isLive ? 'telemetry-pulse' : ''}
                  />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#756052' }}>
                    {isEngineConnected ? (isMonitoring ? `${fps} FPS ACTIVE` : 'STANDBY') : 'AWAITING ENGINE'}
                  </span>
                </div>
              </div>

              <div className="dg-hud-viewport-body">
                {isEngineConnected && isMonitoring ? (
                  <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '340px' }}>
                    <img
                      src="http://localhost:8000/video_feed"
                      alt="Live Optical Telemetry Stream"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="dg-hud-calib-canvas">
                    <DriverIllustration state={riskLevel} size={200} animated={true} />
                    <div className="dg-hud-calib-copy">
                      <h4 className="dg-calib-title">
                        {isSimMode ? 'Simulation Test Harness Active' : 'Waiting for Python Optical Pipeline'}
                      </h4>
                      <p className="dg-calib-desc">
                        {isSimMode
                          ? 'Simulated driver events are currently driving the risk gauge and acoustic warnings.'
                          : 'To stream your webcam through the MediaPipe neural detection pipeline, start the Python engine:'}
                      </p>
                      {!isSimMode && (
                        <code className="dg-code-pill">
                          python run_production_bridge.py
                        </code>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Real-time Telemetry Metrics & Dial */}
            <div className="dg-hud-metrics-card">
              <div className="dg-hud-gauge-wrap">
                <RiskGauge score={riskScore} state={riskLevel} size={180} />
              </div>

              {/* 4 Precision Gauges */}
              <div className="dg-hud-telemetry-boxes">
                <div className="dg-hud-box">
                  <span className="dg-box-label">EAR (EYE APERTURE)</span>
                  <span className="dg-box-val">{ear.toFixed(2)}</span>
                  <span className="dg-box-sub">{ear < 0.22 ? 'FATIGUE DETECTED' : 'NOMINAL > 0.22'}</span>
                </div>

                <div className="dg-hud-box">
                  <span className="dg-box-label">MAR (MOUTH EXCURSION)</span>
                  <span className="dg-box-val">{mar.toFixed(2)}</span>
                  <span className="dg-box-sub">{mar > 0.55 ? 'YAWNING ACTIVE' : 'NOMINAL < 0.55'}</span>
                </div>

                <div className="dg-hud-box">
                  <span className="dg-box-label">HEAD YAW (LATERAL)</span>
                  <span className="dg-box-val">{headYaw > 0 ? `+${headYaw.toFixed(1)}°` : `${headYaw.toFixed(1)}°`}</span>
                  <span className="dg-box-sub">CENTERED DRIVING CONE</span>
                </div>

                <div className="dg-hud-box">
                  <span className="dg-box-label">HEAD PITCH (DOWNWARD)</span>
                  <span className="dg-box-val">{headPitch.toFixed(1)}°</span>
                  <span className="dg-box-sub">{headPitch < -16 ? 'PHONE GLANCE HAZARD' : 'ROAD FOCUS'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* CHAPTER 03: EARLY DETECTION TAXONOMY (DECATHLON RETRO-TECH CARDS)     */}
      {/* ===================================================================== */}
      <section className="dg-taxonomy-section">
        <div className="dg-container">
          <div className="dg-section-header-split">
            <div>
              <div className="dg-chapter-eyebrow">
                <span className="dg-chapter-num">CHAPTER 03</span>
                <span className="dg-chapter-line" />
                <span className="dg-chapter-tag">EARLY BIOMETRIC INTERVENTION</span>
              </div>
              <h2 className="dg-section-headline">Detection Taxonomy.</h2>
              <p className="dg-section-sub">
                Three discrete physiological markers isolating fatigue from natural road behavior.
              </p>
            </div>

            <button
              onClick={onToggleSimMode}
              className="dg-btn-subtle"
            >
              <Sliders size={13} />
              <span>{isSimMode ? 'EXIT DIAGNOSTIC HARNESS' : 'TOGGLE TEST HARNESS'}</span>
            </button>
          </div>

          <div className="dg-cards-triad">
            {/* Card 01: Palpebral Closure */}
            <div className="dg-spec-card">
              <div className="dg-spec-top">
                <span className="dg-spec-tag">SPEC. 01 // OCULAR</span>
                <Eye size={18} color="var(--text-primary)" />
              </div>
              <h3 className="dg-spec-title">Prolonged Palpebral Aperture Closure</h3>
              <p className="dg-spec-body">
                Continuous measurement of upper-to-lower eyelid Euclidean separation. Eliminates nominal 120ms
                involuntary blinks; escalates from warning at 1.0s to critical acoustic intervention at 1.8s.
              </p>
              <div className="dg-spec-footer">
                <div>
                  <span className="dg-spec-lbl">WARN ESCALATION</span>
                  <span className="dg-spec-metric">1.00 s</span>
                </div>
                <div>
                  <span className="dg-spec-lbl">CRITICAL STOP</span>
                  <span className="dg-spec-metric accent-red">1.80 s</span>
                </div>
              </div>
            </div>

            {/* Card 02: Head Pose */}
            <div className="dg-spec-card">
              <div className="dg-spec-top">
                <span className="dg-spec-tag">SPEC. 02 // KINEMATICS</span>
                <Compass size={18} color="var(--text-primary)" />
              </div>
              <h3 className="dg-spec-title">3D Head Pose &amp; Downward Glance</h3>
              <p className="dg-spec-body">
                Perspective-n-Point facial geometry isolates center-console and phone gaze (-16° pitch)
                from true ocular drowsiness, preventing false fatigue triggers while flagging inattention.
              </p>
              <div className="dg-spec-footer">
                <div>
                  <span className="dg-spec-lbl">PITCH DOWNWARD</span>
                  <span className="dg-spec-metric">&lt; -16.0°</span>
                </div>
                <div>
                  <span className="dg-spec-lbl">LATERAL DIVERSION</span>
                  <span className="dg-spec-metric">&gt; 24.0°</span>
                </div>
              </div>
            </div>

            {/* Card 03: Yawn Expansion */}
            <div className="dg-spec-card">
              <div className="dg-spec-top">
                <span className="dg-spec-tag">SPEC. 03 // PALATAL</span>
                <Activity size={18} color="var(--text-primary)" />
              </div>
              <h3 className="dg-spec-title">Sustained Yawning &amp; Aperture Velocity</h3>
              <p className="dg-spec-body">
                Mouth Aspect Ratio (MAR) computes vertical lip excursion against oral width.
                Distinguishes conversation and vocal articulation from prolonged yawning fatigue excursions.
              </p>
              <div className="dg-spec-footer">
                <div>
                  <span className="dg-spec-lbl">YAWN THRESHOLD</span>
                  <span className="dg-spec-metric">&gt; 0.55</span>
                </div>
                <div>
                  <span className="dg-spec-lbl">TEMPORAL GATE</span>
                  <span className="dg-spec-metric">1.20 s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* CHAPTER 04: RISK ESCALATION STATE MACHINE (INTERACTIVE STORYTELLING)  */}
      {/* ===================================================================== */}
      <section className="dg-state-machine-section">
        <div className="dg-container">
          <div className="dg-state-machine-header">
            <div>
              <div className="dg-chapter-eyebrow">
                <span className="dg-chapter-num">CHAPTER 04</span>
                <span className="dg-chapter-line" />
                <span className="dg-chapter-tag">ALGORITHMIC ATTENTIVENESS PROGRESSION</span>
              </div>
              <h2 className="dg-section-headline">Precision Risk Escalation.</h2>
              <p className="dg-section-sub">
                DriveGuard implements an algorithmic state machine that debounces momentary fluctuations
                and ensures acoustic warnings match true physical urgency.
              </p>
            </div>

            {/* Decathlon Yestalgia Interactive Incident Simulator Controls */}
            <div className="dg-sim-triggers-deck">
              <span className="dg-sim-deck-title">INTERACTIVE SCENARIO SIMULATOR:</span>
              <div className="dg-sim-buttons-row">
                <button
                  onClick={() => setSimActiveState('NOMINAL')}
                  className={`dg-sim-pill ${simActiveState === 'NOMINAL' ? 'active' : ''}`}
                >
                  <CheckCircle size={12} color="#10B981" />
                  <span>01 Nominal</span>
                </button>
                <button
                  onClick={() => setSimActiveState('WARNING')}
                  className={`dg-sim-pill ${simActiveState === 'WARNING' ? 'active' : ''}`}
                >
                  <AlertTriangle size={12} color="#D97706" />
                  <span>02 Yawn Caution</span>
                </button>
                <button
                  onClick={() => setSimActiveState('CRITICAL')}
                  className={`dg-sim-pill ${simActiveState === 'CRITICAL' ? 'active' : ''}`}
                >
                  <AlertTriangle size={12} color="#E84B32" />
                  <span>03 Micro-Sleep</span>
                </button>
              </div>
            </div>
          </div>

          <div className="dg-stages-grid">
            {/* Stage 01: Nominal */}
            <div className={`dg-stage-card ${simActiveState === 'NOMINAL' ? 'highlighted' : ''}`}>
              <div className="dg-stage-top">
                <span className="dg-stage-badge nominal">STAGE 01 // NOMINAL</span>
                <CheckCircle size={16} color="#10B981" />
              </div>
              <div className="dg-stage-score">0% – 34%</div>
              <p className="dg-stage-desc">
                Eyes open (EAR &gt; 0.22), natural periodic blinks (120ms). Cranial orientation centered within driving cone.
                Silent background monitoring.
              </p>
              <div className="dg-stage-audio-tag">
                <span className="dg-audio-dot green" />
                <span>SILENT TELEMETRY RUN</span>
              </div>
            </div>

            {/* Stage 02: Warning */}
            <div className={`dg-stage-card ${simActiveState === 'WARNING' ? 'highlighted-warning' : ''}`}>
              <div className="dg-stage-top">
                <span className="dg-stage-badge warning">STAGE 02 // WARNING</span>
                <AlertTriangle size={16} color="#D97706" />
              </div>
              <div className="dg-stage-score" style={{ color: '#D97706' }}>35% – 69%</div>
              <p className="dg-stage-desc">
                Debounced threshold exceeded (&gt;1.0s eye closure or &gt;1.2s sustained yawn). Emits double-pulse acoustic chime at 587 Hz.
              </p>
              <div className="dg-stage-audio-tag">
                <span className="dg-audio-dot amber" />
                <span>587 HZ CHIME PULSE</span>
              </div>
            </div>

            {/* Stage 03: Critical */}
            <div className={`dg-stage-card ${simActiveState === 'CRITICAL' ? 'highlighted-critical' : ''}`}>
              <div className="dg-stage-top">
                <span className="dg-stage-badge critical">STAGE 03 // CRITICAL</span>
                <AlertTriangle size={16} color="#E84B32" />
              </div>
              <div className="dg-stage-score" style={{ color: '#E84B32' }}>70% – 100%</div>
              <p className="dg-stage-desc">
                Prolonged micro-sleep (&gt;1.8s) or sustained downward distraction (&gt;4.5s). Loud emergency 880 Hz alarm with 3.5s cooldown recovery gate.
              </p>
              <div className="dg-stage-audio-tag">
                <span className="dg-audio-dot red" />
                <span>880 HZ CONTINUOUS ALARM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* CHAPTER 05: AUDIT VAULT PREVIEW (EXPLORA JOURNEYS CERTIFIED LEDGER)   */}
      {/* ===================================================================== */}
      <section className="dg-vault-section">
        <div className="dg-container">
          <div className="dg-vault-card">
            <div className="dg-vault-left">
              <div className="dg-chapter-eyebrow">
                <span className="dg-chapter-num">CHAPTER 05</span>
                <span className="dg-chapter-line" />
                <span className="dg-chapter-tag">CRYPTOGRAPHIC COMPLIANCE LEDGER</span>
              </div>
              <h2 className="dg-vault-headline">Deterministic Session Vault.</h2>
              <p className="dg-vault-desc">
                Every completed driving session is committed directly to SQLite database storage on your device.
                Tamper-evident trip certificates, palpebral closure metrics, and verified safety standard grades.
              </p>
              <button onClick={onNavigateToMonitor} className="dg-vault-btn">
                <span>INSPECT SESSION LEDGER</span>
                <ArrowRight size={15} />
              </button>
            </div>

            <div className="dg-vault-stats-grid">
              <div className="dg-stat-box">
                <span className="dg-stat-lbl">DATABASE INTEGRITY</span>
                <span className="dg-stat-val">19 TRIPS</span>
                <span className="dg-stat-sub">Persisted SQLite ledger</span>
              </div>
              <div className="dg-stat-box">
                <span className="dg-stat-lbl">CLASSIFICATION ACCURACY</span>
                <span className="dg-stat-val" style={{ color: '#10B981' }}>99.40%</span>
                <span className="dg-stat-sub">MediaPipe facial landmark mesh</span>
              </div>
              <div className="dg-stat-box">
                <span className="dg-stat-lbl">MINIMUM SESSION GATE</span>
                <span className="dg-stat-val">5.0 SEC</span>
                <span className="dg-stat-sub">Anti-toggle noise filter</span>
              </div>
              <div className="dg-stat-box">
                <span className="dg-stat-lbl">FLEET COMPLIANCE</span>
                <span className="dg-stat-val">GRADE A</span>
                <span className="dg-stat-sub">Optimal driver standard</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* EPILOGUE: THE OPEN HORIZON CTA (DEEP RACING GREEN LUXURY EXPERIENCE) */}
      {/* ===================================================================== */}
      <section className="dg-final-cta-section">
        <div className="dg-cta-backdrop">
          <img
            src="/images/cockpit-interior.jpg"
            alt="Atmospheric luxury sports car cockpit"
            className="dg-cta-bg-img"
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1920&q=85';
            }}
          />
          <div className="dg-cta-overlay" />
        </div>

        <div className="dg-cta-content">
          <div className="dg-cta-stamp">
            <span className="dg-stamp-dot red" />
            <span>SYSTEM READY FOR DEPLOYMENT // ZERO INTRUSION</span>
          </div>

          <h2 className="dg-cta-heading">Elevate your awareness on every journey.</h2>

          <p className="dg-cta-subtext">
            Connect any standard USB or built-in laptop camera. Real-time computer-vision inference
            begins immediately with sub-15ms temporal response.
          </p>

          <button onClick={onNavigateToMonitor} className="dg-cta-launch-btn">
            <span>LAUNCH LIVE COCKPIT HUD</span>
            <ArrowUpRight size={18} />
          </button>
        </div>
      </section>

      {/* Scoped CSS Styles for Overview Luxury Editorial Experience */}
      <style>{`
        .dg-overview-wrapper {
          display: flex;
          flex-direction: column;
          gap: clamp(4rem, 8vw, 7rem);
          position: relative;
          width: 100%;
        }

        /* SECTION A: HERO STYLES */
        .dg-hero-section {
          position: relative;
          width: 100%;
          padding: clamp(2.5rem, 5vw, 4.5rem) clamp(1.25rem, 4vw, 3.5rem) clamp(3rem, 6vw, 5rem);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          border-bottom: 1px solid var(--border-subtle);
        }

        .dg-masthead-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .dg-stamp-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.25rem 0.65rem;
          border-radius: 9999px;
          background: rgba(17, 17, 17, 0.05);
          border: 1px solid rgba(17, 17, 17, 0.09);
          color: var(--text-primary);
          font-weight: 600;
        }
        .dg-stamp-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--color-gold);
        }
        .dg-stamp-dot.red {
          background: #E84B32;
        }
        .dg-masthead-divider {
          opacity: 0.4;
        }

        .dg-hero-title-container {
          max-width: 980px;
          margin-bottom: 2rem;
        }
        .dg-hero-pre-title {
          display: block;
          font-family: var(--font-display);
          font-size: 0.85rem;
          letter-spacing: 0.22em;
          color: var(--color-gold);
          margin-bottom: 0.75rem;
          font-weight: 600;
        }
        .dg-hero-title {
          font-family: var(--font-serif);
          font-size: clamp(2.6rem, 5.6vw, 5.2rem);
          font-weight: 500;
          line-height: 1.08;
          letter-spacing: -0.025em;
          color: var(--text-primary);
          margin: 0 0 1.25rem 0;
        }
        .dg-hero-subtitle {
          font-family: var(--font-sans);
          font-size: clamp(1rem, 1.4vw, 1.15rem);
          line-height: 1.65;
          color: var(--text-secondary);
          max-width: 680px;
          margin: 0 auto;
        }

        .dg-hero-actions-deck {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.95rem;
          margin-bottom: clamp(3rem, 5vw, 4.5rem);
          flex-wrap: wrap;
        }
        .dg-hero-cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          background-color: #111111;
          color: #FFFFFF;
          border: 1px solid #111111;
          border-radius: 9999px;
          padding: 0.85rem 2.25rem;
          font-family: var(--font-sans);
          font-size: 0.88rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        }
        .dg-hero-cta-primary:hover {
          background-color: #000000;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
        }
        .dg-cta-badge {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          padding: 2px 6px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 4px;
        }

        .dg-hero-cta-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background-color: transparent;
          color: var(--text-primary);
          border: 1px solid var(--border-subtle);
          border-radius: 9999px;
          padding: 0.85rem 2rem;
          font-family: var(--font-sans);
          font-size: 0.88rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .dg-hero-cta-secondary:hover {
          border-color: var(--text-primary);
          background: rgba(17, 17, 17, 0.03);
        }

        /* 3-Way Perspective Exhibit Canvas */
        .dg-hero-canvas-frame {
          position: relative;
          width: 100%;
          max-width: 1240px;
          border-radius: 12px;
          overflow: hidden;
          background: #FFFFFF;
          border: 1px solid var(--border-subtle);
          box-shadow: 0 24px 60px -15px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
        }

        .dg-canvas-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1.5rem;
          border-bottom: 1px solid var(--border-subtle);
          background: rgba(247, 246, 242, 0.85);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .dg-canvas-tag {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .dg-tag-accent {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--color-gold);
        }

        .dg-perspective-dock {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(239, 236, 230, 0.7);
          border: 1px solid var(--border-subtle);
          border-radius: 9999px;
          padding: 3px;
        }
        .dg-perspective-btn {
          background: transparent;
          border: none;
          padding: 0.35rem 0.85rem;
          border-radius: 9999px;
          cursor: pointer;
          font-family: var(--font-sans);
          font-size: 0.75rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 0.4rem;
          transition: all var(--transition-fast);
        }
        .dg-perspective-btn.active {
          background: #FFFFFF;
          color: #111111;
          font-weight: 600;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
        }
        .dg-perspective-num {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          opacity: 0.7;
        }
        .dg-canvas-coords {
          color: var(--text-muted);
          display: flex;
          gap: 0.4rem;
        }

        .dg-canvas-viewport {
          position: relative;
          width: 100%;
          height: clamp(380px, 52vw, 560px);
          overflow: hidden;
          background-color: #0E1012;
        }
        .dg-image-container {
          width: 100%;
          height: 100%;
          position: relative;
        }
        .dg-hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .dg-three-container {
          width: 100%;
          height: 100%;
          position: relative;
          background: radial-gradient(circle at center, #18221D 0%, #0A0F0D 100%);
        }
        .dg-3d-hint {
          position: absolute;
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(17, 17, 17, 0.78);
          backdrop-filter: blur(8px);
          color: #FFFFFF;
          padding: 0.35rem 0.85rem;
          border-radius: 9999px;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .dg-sensor-hotspot {
          position: absolute;
          transform: translate(-50%, -50%);
          display: flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(17, 17, 17, 0.82);
          backdrop-filter: blur(10px);
          color: #FFFFFF;
          padding: 0.35rem 0.75rem;
          border-radius: 9999px;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          pointer-events: none;
        }
        .dg-hotspot-beacon {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #E84B32;
          box-shadow: 0 0 8px rgba(232, 75, 50, 0.8);
        }

        .dg-canvas-bracket {
          position: absolute;
          font-family: var(--font-mono);
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.4);
          pointer-events: none;
          z-index: 2;
        }
        .dg-canvas-bracket.top-left { top: 0.75rem; left: 0.75rem; }
        .dg-canvas-bracket.top-right { top: 0.75rem; right: 0.75rem; }
        .dg-canvas-bracket.bottom-left { bottom: 0.75rem; left: 0.75rem; }
        .dg-canvas-bracket.bottom-right { bottom: 0.75rem; right: 0.75rem; }

        .dg-canvas-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(0, 0, 0, 0.08);
          color: #111111;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
          z-index: 5;
        }
        .dg-canvas-arrow.left { left: 1rem; }
        .dg-canvas-arrow.right { right: 1rem; }
        .dg-canvas-arrow:hover {
          background: #FFFFFF;
          transform: translateY(-50%) scale(1.08);
        }

        .dg-canvas-caption-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.75rem;
          background: #FFFFFF;
          border-top: 1px solid var(--border-subtle);
          flex-wrap: wrap;
          gap: 1rem;
        }
        .dg-caption-title {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 0.2rem 0;
        }
        .dg-caption-desc {
          font-size: 0.82rem;
          color: var(--text-secondary);
          margin: 0;
        }
        .dg-caption-specs {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        .dg-spec-divider { opacity: 0.3; }

        /* NOMU Continuous Telemetry Marquee */
        .dg-marquee-container {
          width: 100%;
          overflow: hidden;
          margin-top: 2.5rem;
          border-top: 1px solid var(--border-subtle);
          border-bottom: 1px solid var(--border-subtle);
          padding: 0.65rem 0;
          background: rgba(239, 236, 230, 0.4);
        }
        .dg-marquee-content {
          font-family: var(--font-mono);
          font-size: 0.74rem;
          letter-spacing: 0.12em;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .ticker-dot {
          color: var(--color-gold);
        }

        /* CHAPTER 01: SPREAD SECTION */
        .dg-editorial-spread-section {
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 clamp(1.25rem, 4vw, 3.5rem);
        }
        .dg-spread-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
          gap: 4rem;
          align-items: center;
        }
        .dg-chapter-eyebrow {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          color: var(--color-gold);
          margin-bottom: 1rem;
        }
        .dg-chapter-line {
          width: 24px;
          height: 1px;
          background-color: var(--color-gold);
        }
        .dg-spread-headline {
          font-family: var(--font-serif);
          font-size: clamp(2.4rem, 4.6vw, 4rem);
          font-weight: 500;
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: var(--text-primary);
          margin: 0 0 1.5rem 0;
        }
        .dg-spread-body {
          font-size: 1.05rem;
          line-height: 1.7;
          color: var(--text-secondary);
          margin-bottom: 2.5rem;
        }

        .dg-benchmarks-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          border-top: 1px solid var(--border-subtle);
          padding-top: 1.75rem;
        }
        .dg-benchmark-card {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .dg-bm-num {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--text-muted);
        }
        .dg-bm-value {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .dg-benchmark-card.warning .dg-bm-value { color: #D97706; }
        .dg-benchmark-card.critical .dg-bm-value { color: #E84B32; }
        .dg-bm-desc {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .dg-spread-image-card {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.1);
          min-height: 420px;
        }
        .dg-spread-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .dg-spread-badge {
          position: absolute;
          bottom: 1.25rem;
          left: 1.25rem;
          right: 1.25rem;
          background: rgba(13, 14, 16, 0.88);
          backdrop-filter: blur(12px);
          padding: 0.75rem 1rem;
          border-radius: 4px;
          color: #FFFFFF;
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-family: var(--font-mono);
          font-size: 0.7rem;
        }
        .dg-spread-badge-sub {
          font-size: 0.62rem;
          color: #A3A199;
        }

        /* CHAPTER 02: WARM BEIGE / CHAMPAGNE HUD SECTION */
        .dg-hud-chapter-section {
          background-color: #F3E5D8;
          border-top: 1px solid #D1B198;
          border-bottom: 1px solid #D1B198;
          color: #382C27;
          padding: clamp(4rem, 7vw, 6.5rem) clamp(1.25rem, 4vw, 3.5rem);
          width: 100%;
        }
        .dg-hud-container {
          max-width: 1440px;
          margin: 0 auto;
        }
        .dg-hud-header-row {
          display: flex;
          justifyContent: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 2rem;
          margin-bottom: 3.5rem;
        }
        .dg-hud-headline {
          font-family: var(--font-serif);
          font-size: clamp(2.6rem, 5vw, 4.2rem);
          font-weight: 500;
          color: #382C27;
          margin: 0.25rem 0 0.75rem 0;
        }
        .dg-hud-subtext {
          font-size: 1.05rem;
          line-height: 1.6;
          color: #756052;
          max-width: 600px;
          margin: 0;
        }

        .dg-hud-actions {
          display: flex;
          gap: 0.85rem;
          flex-wrap: wrap;
        }
        .dg-hud-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #382C27;
          color: #FAF5EF;
          border: 1px solid #382C27;
          padding: 0.75rem 1.65rem;
          border-radius: 9999px;
          font-family: var(--font-sans);
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .dg-hud-btn:hover {
          background: #1F1714;
        }
        .dg-hud-btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: transparent;
          color: #382C27;
          border: 1px solid #D1B198;
          padding: 0.75rem 1.65rem;
          border-radius: 9999px;
          font-family: var(--font-sans);
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .dg-hud-btn-outline:hover {
          background: rgba(255, 255, 255, 0.4);
          border-color: #382C27;
        }

        .dg-hud-grid {
          display: grid;
          grid-template-columns: 1.35fr 1fr;
          gap: 2rem;
        }
        @media (max-width: 960px) {
          .dg-hud-grid {
            grid-template-columns: 1fr;
          }
        }

        .dg-hud-viewport-card {
          background: #FAF5EF;
          border: 1px solid #D1B198;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 12px 30px rgba(56, 44, 39, 0.08);
          display: flex;
          flex-direction: column;
        }
        .dg-hud-viewport-bar {
          display: flex;
          justifyContent: space-between;
          align-items: center;
          padding: 0.85rem 1.25rem;
          border-bottom: 1px solid #D1B198;
          background: #EAD8C7;
        }
        .dg-hud-viewport-body {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 380px;
          background: #FAF5EF;
        }
        .dg-hud-calib-canvas {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2.5rem;
          text-align: center;
        }
        .dg-calib-title {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 600;
          color: #382C27;
          margin: 1rem 0 0.5rem 0;
        }
        .dg-calib-desc {
          font-size: 0.88rem;
          color: #756052;
          max-width: 440px;
          line-height: 1.55;
          margin-bottom: 1.25rem;
        }
        .dg-code-pill {
          display: inline-block;
          font-family: var(--font-mono);
          font-size: 0.82rem;
          background: #FFFFFF;
          border: 1px solid #D1B198;
          padding: 0.5rem 1.25rem;
          border-radius: 4px;
          color: #382C27;
        }

        .dg-hud-metrics-card {
          background: #FAF5EF;
          border: 1px solid #D1B198;
          border-radius: 8px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          justify-content: space-between;
        }
        .dg-hud-gauge-wrap {
          display: flex;
          justify-content: center;
          padding: 0.5rem 0;
        }
        .dg-hud-telemetry-boxes {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .dg-hud-box {
          background: #EAD8C7;
          border: 1px solid #D1B198;
          border-radius: 4px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .dg-box-label {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: #8B7565;
          letter-spacing: 0.05em;
        }
        .dg-box-val {
          font-family: var(--font-display);
          font-size: 1.7rem;
          font-weight: 700;
          color: #382C27;
        }
        .dg-box-sub {
          font-size: 0.68rem;
          color: #756052;
          font-family: var(--font-mono);
        }

        /* CHAPTER 03 & 04 COMMON WRAPPERS */
        .dg-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 clamp(1.25rem, 4vw, 3.5rem);
          width: 100%;
        }
        .dg-section-header-split {
          display: flex;
          justifyContent: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-bottom: 3.5rem;
        }
        .dg-section-headline {
          font-family: var(--font-serif);
          font-size: clamp(2.4rem, 4.8vw, 3.8rem);
          font-weight: 500;
          color: var(--text-primary);
          margin: 0.25rem 0 0.75rem 0;
        }
        .dg-section-sub {
          font-size: 1.05rem;
          color: var(--text-secondary);
          max-width: 620px;
          margin: 0;
          line-height: 1.6;
        }

        .dg-btn-subtle {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: transparent;
          border: 1px solid var(--border-subtle);
          border-radius: 9999px;
          padding: 0.65rem 1.45rem;
          font-family: var(--font-sans);
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-primary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .dg-btn-subtle:hover {
          border-color: var(--text-primary);
          background: rgba(17, 17, 17, 0.03);
        }

        /* CARDS TRIAD */
        .dg-cards-triad {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }
        .dg-spec-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 8px;
          padding: 2.5rem 2rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 340px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          transition: transform 0.3s var(--ease-cinematic), box-shadow 0.3s var(--ease-cinematic);
        }
        .dg-spec-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.06);
        }
        .dg-spec-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .dg-spec-tag {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--color-gold);
          font-weight: 600;
          letter-spacing: 0.1em;
        }
        .dg-spec-title {
          font-family: var(--font-display);
          font-size: 1.6rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 1rem 0;
          line-height: 1.2;
        }
        .dg-spec-body {
          font-size: 0.92rem;
          color: var(--text-secondary);
          line-height: 1.65;
          margin: 0;
        }
        .dg-spec-footer {
          display: flex;
          gap: 2rem;
          border-top: 1px solid var(--border-subtle);
          padding-top: 1.5rem;
          margin-top: 2rem;
        }
        .dg-spec-lbl {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--text-muted);
          display: block;
        }
        .dg-spec-metric {
          font-family: var(--font-display);
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .dg-spec-metric.accent-red { color: #E84B32; }

        /* CHAPTER 04: RISK PROGRESSION & SIMULATOR */
        .dg-state-machine-header {
          display: flex;
          justifyContent: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 2rem;
          margin-bottom: 3.5rem;
        }
        .dg-sim-triggers-deck {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .dg-sim-deck-title {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.08em;
          color: var(--text-muted);
        }
        .dg-sim-buttons-row {
          display: flex;
          gap: 0.5rem;
          background: rgba(239, 236, 230, 0.7);
          border: 1px solid var(--border-subtle);
          border-radius: 9999px;
          padding: 3px;
        }
        .dg-sim-pill {
          background: transparent;
          border: none;
          padding: 0.4rem 0.85rem;
          border-radius: 9999px;
          font-family: var(--font-mono);
          font-size: 0.74rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }
        .dg-sim-pill.active {
          background: #FFFFFF;
          color: #111111;
          font-weight: 600;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }

        .dg-stages-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.75rem;
        }
        .dg-stage-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 8px;
          padding: 2.25rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: all 0.3s var(--ease-cinematic);
        }
        .dg-stage-card.highlighted {
          border-color: #10B981;
          box-shadow: 0 12px 30px rgba(16, 185, 129, 0.12);
          transform: translateY(-2px);
        }
        .dg-stage-card.highlighted-warning {
          border-color: #D97706;
          box-shadow: 0 12px 30px rgba(217, 119, 6, 0.12);
          transform: translateY(-2px);
        }
        .dg-stage-card.highlighted-critical {
          border-color: #E84B32;
          box-shadow: 0 12px 30px rgba(232, 75, 50, 0.15);
          transform: translateY(-2px);
        }

        .dg-stage-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .dg-stage-badge {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.08em;
        }
        .dg-stage-badge.nominal { color: #10B981; }
        .dg-stage-badge.warning { color: #D97706; }
        .dg-stage-badge.critical { color: #E84B32; }

        .dg-stage-score {
          font-family: var(--font-display);
          font-size: 2.4rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .dg-stage-desc {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }
        .dg-stage-audio-tag {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: var(--text-muted);
          border-top: 1px solid var(--border-subtle);
          padding-top: 0.75rem;
          margin-top: 0.5rem;
        }
        .dg-audio-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
        }
        .dg-audio-dot.green { background: #10B981; }
        .dg-audio-dot.amber { background: #D97706; }
        .dg-audio-dot.red { background: #E84B32; }

        /* CHAPTER 05: VAULT LEDGER SECTION */
        .dg-vault-card {
          background: #FFFFFF;
          border: 1px solid var(--border-subtle);
          border-radius: 8px;
          padding: clamp(2.5rem, 5vw, 4.5rem);
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 3.5rem;
          align-items: center;
          box-shadow: 0 16px 45px rgba(0, 0, 0, 0.04);
        }
        @media (max-width: 960px) {
          .dg-vault-card {
            grid-template-columns: 1fr;
          }
        }
        .dg-vault-headline {
          font-family: var(--font-serif);
          font-size: clamp(2.4rem, 4.5vw, 3.6rem);
          font-weight: 500;
          color: var(--text-primary);
          margin: 0.5rem 0 1rem 0;
        }
        .dg-vault-desc {
          font-size: 1rem;
          color: var(--text-secondary);
          line-height: 1.65;
          margin-bottom: 2rem;
        }
        .dg-vault-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #111111;
          color: #FFFFFF;
          border: none;
          padding: 0.85rem 2rem;
          border-radius: 9999px;
          font-family: var(--font-sans);
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .dg-vault-btn:hover {
          background: #000000;
          transform: translateY(-1px);
        }

        .dg-vault-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }
        .dg-stat-box {
          background: var(--bg-canvas);
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .dg-stat-lbl {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--text-muted);
        }
        .dg-stat-val {
          font-family: var(--font-display);
          font-size: 2.2rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .dg-stat-sub {
          font-size: 0.74rem;
          color: var(--text-secondary);
        }

        /* EPILOGUE: FINAL CTA SECTION (DEEP FOREST RACING GREEN) */
        .dg-final-cta-section {
          position: relative;
          background: #0E1612;
          color: #FFFFFF;
          border-radius: 12px;
          margin: 0 clamp(1.25rem, 4vw, 3.5rem);
          padding: clamp(5rem, 9vw, 8rem) clamp(1.5rem, 5vw, 4rem);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
        }
        .dg-cta-backdrop {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .dg-cta-bg-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.24;
          filter: contrast(1.15) brightness(0.8);
        }
        .dg-cta-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(14, 22, 18, 0.7) 0%, rgba(10, 15, 12, 0.95) 100%);
        }

        .dg-cta-content {
          position: relative;
          z-index: 2;
          max-width: 820px;
        }
        .dg-cta-stamp {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.16em;
          color: var(--color-gold);
          margin-bottom: 1.5rem;
        }
        .dg-cta-heading {
          font-family: var(--font-serif);
          font-size: clamp(2.8rem, 6.2vw, 5.2rem);
          font-weight: 500;
          line-height: 1.02;
          letter-spacing: -0.02em;
          color: #FFFFFF;
          margin: 0 0 1.5rem 0;
        }
        .dg-cta-subtext {
          font-size: 1.15rem;
          line-height: 1.65;
          color: #C2BFB6;
          max-width: 600px;
          margin: 0 auto 2.75rem;
        }

        .dg-cta-launch-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          background: #FFFFFF;
          color: #0E1612;
          border: none;
          padding: 1rem 2.75rem;
          border-radius: 9999px;
          font-family: var(--font-sans);
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
        }
        .dg-cta-launch-btn:hover {
          background: #F7F6F2;
          transform: translateY(-2px);
          box-shadow: 0 14px 40px rgba(0, 0, 0, 0.45);
        }
      `}</style>
    </div>
  );
}
