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
 * OverviewView Component — High-Fashion Minimalist Editorial & Techwear Edition
 * References:
 * - Image 1 (SHADXW): Decagonal dial button, category tags (← Biometrics, + Features), carousel pagination (01 ── 04)
 * - Image 2 (Aura store): Split oversized display typography (DRIVE / GUARD), manifesto copy, floating preview card
 * - Image 3 (Minimal-ist): Giant vertical typography, asymmetric layout, section numbers (01, 02)
 * - Image 4 (lab. 001): Lowercase grotesque titles, stacked index (SYS 001), clean architectural blocks
 * - Image 5 (Joker): Central subject with floating interactive callout pins and leader dots, scroll mouse pill
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

  // 3-perspective switcher: 0 = Cabin Vision, 1 = Chassis Dynamics, 2 = 3D Spatial Kinematics
  const [activePerspective, setActivePerspective] = useState(0);

  const perspectives = [
    {
      id: 'cockpit',
      num: '01',
      tabLabel: 'CABIN SENSING',
      title: 'DRIVER-FACING OPTICAL INFERENCE',
      subtitle: 'Interior optical axis calibrated to driver gaze vector and palpebral aperture tracking',
      image: 'https://images.unsplash.com/photo-1491921125492-f0b9c835b699?auto=format&fit=crop&w=1920&q=85',
      tag: 'AXIS // CABIN_01',
      spec: '468 FACIAL MESH NODES // SUB-15MS LATENCY',
    },
    {
      id: 'vehicle',
      num: '02',
      tabLabel: 'CHASSIS TELEMETRY',
      title: 'AERODYNAMIC EDGE PLATFORM',
      subtitle: 'Self-contained on-device architecture operating with zero external cloud transmission',
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1920&q=85',
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
      tag: 'KINEMATICS // THREE_JS',
      spec: 'PnP 3D CRANIAL SOLVER // 60 FPS',
    },
  ];

  const currentPerspective = perspectives[activePerspective];

  return (
    <div style={{ width: '100%', backgroundColor: 'var(--bg-primary)' }}>
      {/* Active Incident Banner */}
      {alertMessage && (
        <div style={{ padding: '0 clamp(1rem, 3vw, 2.5rem)', marginTop: '1rem' }}>
          <AlertBanner
            alertMessage={alertMessage}
            riskLevel={riskLevel}
            riskReason={riskReason}
            isRecovering={isRecovering}
          />
        </div>
      )}

      {/* =========================================================================
          HERO SECTION — ASYMMETRIC MINIMALIST TECHWEAR (Images 1 & 2 inspiration)
          ========================================================================= */}
      <section
        style={{
          position: 'relative',
          padding: 'clamp(2rem, 5vw, 4.5rem) clamp(1rem, 3vw, 2.5rem) 3rem',
          borderBottom: '1px solid var(--border-light)',
          overflow: 'hidden',
        }}
      >
        {/* Category Breadcrumbs & Meta (Image 1 style: ← Jackets / + Features) */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            fontFamily: "var(--font-mono, monospace)",
            fontSize: '0.74rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <span>← OPTICAL BIOMETRICS</span>
            <span>+ NEURAL VISION</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>SIZE: 640x480 RAW</span>
            <span>LATENCY: 14MS</span>
            <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>STATUS: NOMINAL</span>
          </div>
        </div>

        {/* Master Split Display Typography (Image 2 style: "Aura       store") */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            userSelect: 'none',
            lineHeight: 0.85,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
              fontSize: 'clamp(3.5rem, 11vw, 10.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            DRIVE
          </h1>

          <h1
            style={{
              fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
              fontSize: 'clamp(3.5rem, 11vw, 10.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            GUARD
          </h1>
        </div>

        {/* Central Asymmetric Stage: Subject & Viewport Switcher */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            marginTop: 'clamp(-2rem, -4vw, -1rem)',
            display: 'grid',
            gridTemplateColumns: '1fr minmax(300px, 780px) 1fr',
            alignItems: 'center',
            gap: 'clamp(1rem, 2.5vw, 2.5rem)',
          }}
        >
          {/* Left Column: Manifesto & Decagonal Dial Button (Images 1 & 2) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: '0.7rem',
                  letterSpacing: '0.12em',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-light)',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '2px',
                }}
              >
                SYS // 01
              </span>
            </div>

            <div>
              <h2
                style={{
                  fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
                  fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)',
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase',
                  color: 'var(--text-primary)',
                  margin: '0 0 0.75rem 0',
                }}
              >
                Vigilance without excess. Only reaction.
              </h2>
              <p
                style={{
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  color: 'var(--text-secondary)',
                  margin: 0,
                  maxWidth: '340px',
                }}
              >
                Zero-cloud biometric edge sensing. Real-time 468-point facial mesh, Levenberg-Marquardt cranial pose, and palpebral aperture tracking.
              </p>
            </div>

            {/* Decagonal / Radial Dial CTA Button (Image 1 style: ADD TO BAG $99.99) */}
            <div style={{ marginTop: '0.5rem' }}>
              <button
                onClick={onNavigateToMonitor}
                className="decagonal-dial-btn"
                style={{ padding: 0 }}
              >
                <div className="dial-polygon">
                  <ArrowUpRight size={18} strokeWidth={2} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.64rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    ENGAGE COCKPIT
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    0.00s LATENCY
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Center Stage: Viewport Visualizer (3D Mesh / High-Key Image) */}
          <div
            style={{
              position: 'relative',
              borderRadius: '4px',
              border: '1px solid var(--border-light)',
              backgroundColor: 'var(--bg-secondary)',
              overflow: 'hidden',
              minHeight: '460px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
            }}
          >
            {/* Perspective View Display */}
            {currentPerspective.is3D ? (
              <div style={{ width: '100%', height: '460px' }}>
                <InteractiveCockpit3D
                  telemetryData={telemetryData}
                  isMonitoring={isLive}
                  height="460px"
                  theme="light"
                />
              </div>
            ) : (
              <div style={{ position: 'relative', width: '100%', height: '460px' }}>
                <img
                  src={currentPerspective.image}
                  alt={currentPerspective.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'grayscale(25%) contrast(105%)',
                  }}
                  onError={(e) => {
                    e.currentTarget.src = currentPerspective.fallback;
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(17, 17, 17, 0.4) 0%, transparent 60%)',
                  }}
                />
              </div>
            )}

            {/* Floating Interactive Callout Pins (Image 5 Joker style) */}
            <div
              style={{
                position: 'absolute',
                top: '2rem',
                left: '2rem',
                zIndex: 10,
              }}
            >
              <div className="floating-callout-pin">
                <span className="pin-dot" />
                <span>• 468-PT FACIAL MESH</span>
              </div>
            </div>

            <div
              style={{
                position: 'absolute',
                top: '4.5rem',
                right: '2rem',
                zIndex: 10,
              }}
            >
              <div className="floating-callout-pin">
                <span className="pin-dot" />
                <span>• CRANIAL PnP ±0.02°</span>
              </div>
            </div>

            <div
              style={{
                position: 'absolute',
                bottom: '2.5rem',
                left: '2rem',
                zIndex: 10,
              }}
            >
              <div className="floating-callout-pin">
                <span className="pin-dot" />
                <span>• PALPEBRAL EAR {ear?.toFixed(2)}</span>
              </div>
            </div>

            {/* Perspective Switcher Dock (Bottom Center) */}
            <div
              style={{
                position: 'absolute',
                bottom: '1rem',
                right: '1rem',
                display: 'flex',
                gap: '0.4rem',
                zIndex: 15,
                backgroundColor: 'rgba(247, 247, 245, 0.9)',
                backdropFilter: 'blur(8px)',
                padding: '0.3rem',
                border: '1px solid var(--border-light)',
                borderRadius: '2px',
              }}
            >
              {perspectives.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setActivePerspective(idx)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    background: activePerspective === idx ? 'var(--text-primary)' : 'transparent',
                    color: activePerspective === idx ? 'var(--bg-primary)' : 'var(--text-secondary)',
                    border: 'none',
                    borderRadius: '2px',
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: '0.66rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {p.tabLabel}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Floating Preview Card & Carousel (Images 1 & 2) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', zIndex: 10 }}>
            {/* Rounded Preview Card (Image 2 style) */}
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  OPTICAL HUD
                </span>
                <span
                  style={{
                    fontSize: '0.66rem',
                    fontFamily: "var(--font-mono, monospace)",
                    fontWeight: 700,
                    color: 'var(--accent-emerald)',
                  }}
                >
                  LIVE // 30 FPS
                </span>
              </div>

              {/* Minimal Risk Readout */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span
                  style={{
                    fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
                    fontSize: '2.8rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    lineHeight: 1,
                  }}
                >
                  {riskScore}%
                </span>
                <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  ATTENTIVENESS RISK
                </span>
              </div>

              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Real-time palpebral EAR ratio is currently <strong>{ear?.toFixed(2)}</strong> (nominal safety baseline {'>'} 0.22).
              </div>

              <button
                onClick={onNavigateToMonitor}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'none',
                  border: '1px solid var(--border-light)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '2px',
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>OPEN LIVE COCKPIT</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Carousel Pagination (Image 1 style: 01 ── 04) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontFamily: "var(--font-mono, monospace)",
                fontSize: '0.74rem',
                color: 'var(--text-secondary)',
              }}
            >
              <span>01</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-light)', position: 'relative' }}>
                <div style={{ width: '33%', height: '2px', backgroundColor: 'var(--text-primary)' }} />
              </div>
              <span>04</span>
            </div>
          </div>
        </div>

        {/* Mouse Scroll Indicator Pill (Image 5 style) */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '2.5rem',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 0.95rem',
              border: '1px solid var(--border-light)',
              borderRadius: '9999px',
              fontFamily: "var(--font-mono, monospace)",
              fontSize: '0.68rem',
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--bg-secondary)',
            }}
          >
            <span>🖱 SCROLL TO DISCOVER ARCHITECTURE</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CONTINUOUS EDITORIAL TELEMETRY MARQUEE (Continuous Ticker)
          ========================================================================= */}
      <div
        style={{
          borderBottom: '1px solid var(--border-light)',
          backgroundColor: 'var(--bg-secondary)',
          padding: '0.75rem 0',
          overflow: 'hidden',
          display: 'flex',
        }}
      >
        <div className="animate-editorial-marquee">
          {[...Array(2)].map((_, loopIdx) => (
            <div key={loopIdx} style={{ display: 'flex', gap: '3rem', paddingRight: '3rem' }}>
              <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.72rem', letterSpacing: '0.12em', color: 'var(--text-primary)' }}>
                LATENCY // 14MS
              </span>
              <span style={{ color: 'var(--border-light)' }}>•</span>
              <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.72rem', letterSpacing: '0.12em', color: 'var(--text-primary)' }}>
                FACIAL MESH // 468 TOPOLOGICAL POINTS
              </span>
              <span style={{ color: 'var(--border-light)' }}>•</span>
              <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.72rem', letterSpacing: '0.12em', color: 'var(--text-primary)' }}>
                HEAD POSE // LEVENBERG-MARQUARDT PnP
              </span>
              <span style={{ color: 'var(--border-light)' }}>•</span>
              <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.72rem', letterSpacing: '0.12em', color: 'var(--text-primary)' }}>
                STORAGE // AIR-GAPPED SQLITE TELEMETRY
              </span>
              <span style={{ color: 'var(--border-light)' }}>•</span>
              <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.72rem', letterSpacing: '0.12em', color: 'var(--text-primary)' }}>
                MICROSLEEP // PALPEBRAL APERTURE &lt; 0.22 EAR
              </span>
              <span style={{ color: 'var(--border-light)' }}>•</span>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          CHAPTER 01: THE TEMPORAL DEFICIT (Images 3 & 4 Swiss Typography)
          ========================================================================= */}
      <section
        style={{
          padding: 'clamp(3rem, 6vw, 6rem) clamp(1rem, 3vw, 2.5rem)',
          borderBottom: '1px solid var(--border-light)',
          display: 'grid',
          gridTemplateColumns: 'minmax(40px, 80px) 1fr 1fr',
          gap: 'clamp(1.5rem, 4vw, 4rem)',
          position: 'relative',
        }}
      >
        {/* Giant Vertical Typography (Image 3 style: "202...") */}
        <div
          className="text-vertical"
          style={{
            fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            fontWeight: 800,
            color: 'var(--border-light)',
            userSelect: 'none',
            letterSpacing: '0.04em',
          }}
        >
          2026 // DEFICIT
        </div>

        {/* Left Column: Heading & Manifesto */}
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: '0.7rem',
              letterSpacing: '0.14em',
              color: 'var(--text-muted)',
              marginBottom: '1rem',
            }}
          >
            SYS 001 // TEMPORAL ANALYSIS
          </div>

          <h3
            style={{
              fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
              fontSize: 'clamp(2.2rem, 4vw, 3.6rem)',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
              margin: '0 0 1.5rem 0',
            }}
          >
            The Critical Temporal Deficit
          </h3>

          <p
            style={{
              fontSize: '1rem',
              lineHeight: 1.65,
              color: 'var(--text-secondary)',
              margin: '0 0 1.5rem 0',
            }}
          >
            At 100 km/h, a vehicle covers <strong>27.8 meters per second</strong>. A human driver’s neural transmission from visual awareness to physical braking consumes a minimum of 1,200ms. A 1.0s involuntary microsleep results in nearly 30 meters travelled blind.
          </p>

          <p
            style={{
              fontSize: '0.9rem',
              lineHeight: 1.6,
              color: 'var(--text-muted)',
              margin: 0,
            }}
          >
            DriveGuard AI reduces the detection threshold to under 15ms by performing on-device MediaPipe optical landmark analysis directly at the edge.
          </p>
        </div>

        {/* Right Column: 3 Critical Metrics (Image 4 style: Clean Architectural Blocks) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', justifyContent: 'center' }}>
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-light)',
              borderRadius: '2px',
              padding: '1.5rem',
            }}
          >
            <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              01 // HUMAN PERCEPTUAL LAG
            </div>
            <div style={{ fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)", fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
              120ms – 1,200ms
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Neural signal transmission latency between visual cortex and neuromuscular brake actuation.
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-light)',
              borderRadius: '2px',
              padding: '1.5rem',
            }}
          >
            <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              02 // DISTANCE TRAVELLED BLIND
            </div>
            <div style={{ fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)", fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
              27.8 meters / sec
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              At highway velocities (100 km/h), one single second of eyelid closure is fatal.
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-light)',
              borderRadius: '2px',
              padding: '1.5rem',
            }}
          >
            <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              03 // EDGE INFERENCE LATENCY
            </div>
            <div style={{ fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)", fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent-emerald)', lineHeight: 1 }}>
              &lt; 15 milliseconds
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              MediaPipe landmarking on local CPU/GPU eliminates round-trip cloud packet delay.
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 02: ALGORITHMIC DETECTION ANATOMY (Image 5 Callout Spec)
          ========================================================================= */}
      <section
        style={{
          padding: 'clamp(3rem, 6vw, 6rem) clamp(1rem, 3vw, 2.5rem)',
          borderBottom: '1px solid var(--border-light)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.7rem', letterSpacing: '0.14em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              SYS 002 // MATHEMATICAL TAXONOMY
            </div>
            <h3
              style={{
                fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
                fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              Algorithmic Detection Suite
            </h3>
          </div>

          <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
            PRECISION CALIBRATED // 4-PILLAR RECOGNITION
          </div>
        </div>

        {/* 4 Algorithmic Metric Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {/* EAR Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-light)',
              borderRadius: '2px',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.68rem', color: 'var(--text-muted)' }}>01</span>
                <span className="techwear-tag">OCULAR</span>
              </div>
              <h4 style={{ fontSize: '1.3rem', margin: '0 0 0.5rem 0' }}>Eye Aspect Ratio (EAR)</h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                Computes 6-point Euclidean distance vectors around both ocular apertures. Values falling below 0.22 indicate immediate eyelid drooping.
              </p>
            </div>
            <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.76rem', color: 'var(--text-primary)', marginTop: '1.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
              THRESHOLD: EAR &lt; 0.22 FOR &gt; 1.5s
            </div>
          </div>

          {/* Cranial PnP Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-light)',
              borderRadius: '2px',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.68rem', color: 'var(--text-muted)' }}>02</span>
                <span className="techwear-tag">KINEMATICS</span>
              </div>
              <h4 style={{ fontSize: '1.3rem', margin: '0 0 0.5rem 0' }}>3D Cranial PnP Pose</h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                Solves perspective-n-point 3D head rotation matrix (Pitch, Yaw, Roll). Detects downward head drops and lateral gaze distraction.
              </p>
            </div>
            <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.76rem', color: 'var(--text-primary)', marginTop: '1.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
              TOLERANCE: PITCH &lt; -15° OR YAW &gt; 25°
            </div>
          </div>

          {/* MAR Yawn Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-light)',
              borderRadius: '2px',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.68rem', color: 'var(--text-muted)' }}>03</span>
                <span className="techwear-tag">MANDIBULAR</span>
              </div>
              <h4 style={{ fontSize: '1.3rem', margin: '0 0 0.5rem 0' }}>Mouth Aspect Ratio (MAR)</h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                Calculates lip vertical extension ratio against horizontal width to detect sustained yawning and fatigue onset.
              </p>
            </div>
            <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.76rem', color: 'var(--text-primary)', marginTop: '1.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
              ALERT: MAR &gt; 0.55 SUSTAINED
            </div>
          </div>

          {/* PERCLOS Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-light)',
              borderRadius: '2px',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.68rem', color: 'var(--text-muted)' }}>04</span>
                <span className="techwear-tag">STANDARDS</span>
              </div>
              <h4 style={{ fontSize: '1.3rem', margin: '0 0 0.5rem 0' }}>PERCLOS 80 Benchmark</h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                Measures percentage of eyelid closure over a rolling 60-second window, matching NHTSA and ISO 15007 automotive safety standards.
              </p>
            </div>
            <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.76rem', color: 'var(--text-primary)', marginTop: '1.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
              ISO 15007 / NHTSA COMPLIANT
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 03: TACTILE INCIDENT SIMULATION DIAL
          ========================================================================= */}
      <section
        style={{
          padding: 'clamp(3rem, 5vw, 5rem) clamp(1rem, 3vw, 2.5rem)',
          borderBottom: '1px solid var(--border-light)',
          backgroundColor: 'var(--bg-secondary)',
        }}
      >
        <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.7rem', letterSpacing: '0.14em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            SYS 003 // LIVE HARDWARE SIMULATOR
          </div>

          <h3
            style={{
              fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
              fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
              margin: '0 0 1rem 0',
            }}
          >
            Simulate Biometric Scenarios In Real Time
          </h3>

          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: '620px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
            Click any scenario button below to dispatch synthetic telemetry into the live detection pipeline and observe how DriveGuard AI evaluates facial metrics.
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <button
              onClick={() => onToggleSimMode && onToggleSimMode('NOMINAL')}
              className="btn-editorial-outline"
              style={{ backgroundColor: 'var(--bg-surface)' }}
            >
              <span>NOMINAL DRIVER (SAFE)</span>
            </button>

            <button
              onClick={() => onToggleSimMode && onToggleSimMode('CRITICAL')}
              className="btn-editorial-outline"
              style={{ borderColor: 'var(--accent-crimson)', color: 'var(--accent-crimson)', backgroundColor: 'var(--bg-surface)' }}
            >
              <span>MICROSLEEP (EAR 0.12)</span>
            </button>

            <button
              onClick={() => onToggleSimMode && onToggleSimMode('HEAD_DOWN')}
              className="btn-editorial-outline"
              style={{ borderColor: 'var(--accent-amber)', color: 'var(--accent-amber)', backgroundColor: 'var(--bg-surface)' }}
            >
              <span>HEAD DOWN DISTRACTION (-21°)</span>
            </button>

            <button
              onClick={() => onToggleSimMode && onToggleSimMode('WARNING')}
              className="btn-editorial-outline"
              style={{ borderColor: 'var(--accent-amber)', color: 'var(--accent-amber)', backgroundColor: 'var(--bg-surface)' }}
            >
              <span>SUSTAINED YAWN (MAR 0.68)</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 04: ARCHIVAL FLIGHT LEDGER TEASER & DARK CONTRAST SECTION
          ========================================================================= */}
      <section
        style={{
          padding: 'clamp(4rem, 7vw, 7rem) clamp(1rem, 3vw, 2.5rem)',
          backgroundColor: 'var(--bg-dark)',
          color: 'var(--text-dark-primary)',
          position: 'relative',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(2rem, 4vw, 4rem)',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.7rem', letterSpacing: '0.14em', color: 'var(--text-dark-secondary)', marginBottom: '0.75rem' }}>
              SYS 004 // AIR-GAPPED VAULT
            </div>

            <h3
              style={{
                fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
                fontSize: 'clamp(2.4rem, 4vw, 3.8rem)',
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                textTransform: 'uppercase',
                color: 'var(--text-dark-primary)',
                margin: '0 0 1.5rem 0',
              }}
            >
              Air-Gapped Flight Records
            </h3>

            <p style={{ fontSize: '0.95rem', color: 'var(--text-dark-secondary)', lineHeight: 1.6, margin: '0 0 2rem 0' }}>
              Every driving session is cryptographically timestamped into your local SQLite flight database (`driveguard.db`). Zero telemetry is streamed to external cloud servers.
            </p>

            <button
              onClick={onNavigateToMonitor}
              className="btn-editorial"
              style={{
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--bg-dark)',
                borderColor: 'var(--bg-primary)',
                padding: '0.75rem 1.6rem',
                fontSize: '0.8rem',
              }}
            >
              <span>LAUNCH LIVE COCKPIT</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Visual Flight Vault Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-dark-surface)',
              border: '1px solid var(--border-dark)',
              borderRadius: '4px',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-dark)', paddingBottom: '1rem' }}>
              <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.72rem', color: 'var(--text-dark-secondary)' }}>
                LOCAL DATABASE // driveguard.db
              </span>
              <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: '0.72rem', color: 'var(--accent-emerald)' }}>
                ENCRYPTED AT REST
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-dark-secondary)' }}>Architecture:</span>
                <span style={{ fontFamily: "var(--font-mono, monospace)" }}>FastAPI + SQLite Edge</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-dark-secondary)' }}>Neural Pipeline:</span>
                <span style={{ fontFamily: "var(--font-mono, monospace)" }}>MediaPipe 468 Face Mesh</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-dark-secondary)' }}>Gps Co-Telemetry:</span>
                <span style={{ fontFamily: "var(--font-mono, monospace)" }}>WGS84 Geolocation Fix</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-dark-secondary)' }}>Incident Resolution:</span>
                <span style={{ fontFamily: "var(--font-mono, monospace)" }}>Sub-15ms Timestamped Audit</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
