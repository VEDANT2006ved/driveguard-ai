import React, { useState } from 'react';
import InteractiveCockpit3D from '../components/InteractiveCockpit3D';
import DriverIllustration from '../components/DriverIllustration';
import RiskGauge from '../components/RiskGauge';
import AlertBanner from '../components/AlertBanner';
import {
  Play,
  ArrowRight,
  Camera,
  Sliders,
  ShieldCheck,
  Eye,
  Compass,
  Activity,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Radio,
  RefreshCw,
  Cpu,
  Gauge,
  Lock,
} from 'lucide-react';

/**
 * OverviewView Component (Phase 2: Cinematic Motion Design & Interactive 3D Experience)
 * Features an editorial hero with self-drawing SVG curves, layered floating telemetry,
 * real interactive 3D WebGL cockpit with head-pose orientation, and a 6-section scroll-driven
 * storytelling architecture inspired by Wispr Flow.
 */
export default function OverviewView({
  telemetryData = {},
  isEngineConnected = false,
  onNavigateToMonitor,
  onToggleSimMode,
  isSimMode = false,
  isMonitoring = true,
  onStartMonitoring,
  isRecovering = false,
}) {
  const [activeHeroTab, setActiveHeroTab] = useState('3d'); // '3d' | 'camera'
  const [interactiveDetectionTab, setInteractiveDetectionTab] = useState('eye'); // 'eye' | 'yawn' | 'head'

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
  } = telemetryData || {};

  const isLive = isSimMode || (isEngineConnected && isMonitoring);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', position: 'relative' }}>
      {/* Editorial Safety Alert Banner (Unmistakable Urgency) */}
      <AlertBanner
        alertState={riskLevel}
        riskReason={riskReason}
        message={alertMessage}
        isEngineConnected={isEngineConnected || isSimMode}
        isMonitoring={isMonitoring}
        isRecovering={isRecovering}
      />

      {/* ===================================================================== */}
      {/* SECTION 1: CINEMATIC HERO (CREAM CANVAS + SVG DRAW + 3D COCKPIT)      */}
      {/* ===================================================================== */}
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: 'clamp(1rem, 3vw, 2.5rem) 0 clamp(2rem, 4vw, 4rem)',
          position: 'relative',
        }}
      >
        {/* Animated Self-Drawing Decorative SVG Curves (Wispr Flow signature vector loops) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
            zIndex: 0,
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1200 600"
            fill="none"
            preserveAspectRatio="none"
            style={{ opacity: 0.4 }}
          >
            <path
              d="M-50,280 C200,80 400,450 700,220 C950,40 1150,380 1300,160"
              stroke="#7C3AED"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="animate-svg-draw"
            />
            <path
              d="M-80,360 C180,180 480,500 780,300 C1000,140 1180,420 1320,240"
              stroke="#10B981"
              strokeWidth="1.2"
              strokeDasharray="6 8"
              className="animate-dash-flow"
              opacity="0.6"
            />
          </svg>
        </div>

        {/* Floating Rotating Accent Orbit (Top-Right) */}
        <div
          className="animate-orbit"
          style={{
            position: 'absolute',
            top: '-20px',
            right: 'clamp(2%, 8vw, 12%)',
            width: '140px',
            height: '140px',
            pointerEvents: 'none',
            opacity: 0.35,
            zIndex: 0,
          }}
        >
          <svg viewBox="0 0 120 120" fill="none">
            <circle cx="60" cy="60" r="54" stroke="#7C3AED" strokeWidth="1" strokeDasharray="5 7" />
            <circle cx="114" cy="60" r="3.5" fill="#7C3AED" />
            <circle cx="6" cy="60" r="2.5" fill="#10B981" />
          </svg>
        </div>

        {/* Small Capsule Pill Badge with Live Pulse */}
        <div
          className="animate-fade-in"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1.1rem',
            borderRadius: '9999px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '2rem',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isLive ? '#10B981' : '#9E988F',
            }}
            className={isLive ? 'animate-pulse-live' : ''}
          />
          <span
            className="font-mono"
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-primary)',
              fontWeight: 700,
              letterSpacing: '0.04em',
            }}
          >
            DRIVEGUARD AI // REAL-TIME NEURAL TELEMETRY
          </span>
        </div>

        {/* Giant Editorial Headline with Staggered Clip-Path Mask */}
        <h1
          className="animate-clip-hero"
          style={{
            maxWidth: '1000px',
            lineHeight: 0.98,
            marginBottom: '1.75rem',
            letterSpacing: '-0.025em',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <span
            className="font-serif"
            style={{
              fontSize: 'clamp(3.8rem, 8.8vw, 7.4rem)',
              fontStyle: 'italic',
              fontWeight: 400,
              color: 'var(--text-primary)',
              display: 'block',
            }}
          >
            Don't drift,
          </span>
          <span
            className="font-display"
            style={{
              fontSize: 'clamp(3.6rem, 8.5vw, 7.2rem)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              color: 'var(--text-primary)',
              display: 'inline-block',
            }}
          >
            stay{' '}
            <em
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 400,
                color: 'var(--color-emerald-deep)',
              }}
            >
              focused.
            </em>
          </span>
        </h1>

        {/* Clean Subtitle */}
        <p
          style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            maxWidth: '680px',
            marginBottom: '2.5rem',
            fontFamily: 'var(--font-sans)',
            fontWeight: 400,
            position: 'relative',
            zIndex: 1,
          }}
        >
          Translating 478 facial landmarks into microsecond fatigue prevention,
          cranial gaze kinematics, and audit-grade fleet compliance. Local edge inference with zero cloud latency.
        </p>

        {/* Action Buttons: Wispr Lavender Magnetic Pill + Ghost Outline */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {!isMonitoring && onStartMonitoring ? (
            <button
              onClick={onStartMonitoring}
              className="pill-btn pill-btn-lavender btn-magnetic-pill"
              style={{
                padding: '0.95rem 2.25rem',
                fontSize: '0.95rem',
              }}
            >
              <Play size={16} fill="#22103E" />
              <span>Start Live Monitoring</span>
            </button>
          ) : (
            <button
              onClick={onNavigateToMonitor}
              className="pill-btn pill-btn-lavender btn-magnetic-pill"
              style={{
                padding: '0.95rem 2.25rem',
                fontSize: '0.95rem',
              }}
            >
              <Camera size={16} />
              <span>Enter Live Cockpit</span>
            </button>
          )}

          <button
            onClick={onNavigateToMonitor}
            className="pill-btn pill-btn-ghost btn-magnetic-pill"
            style={{
              padding: '0.95rem 2rem',
              fontSize: '0.95rem',
            }}
          >
            <span>Inspect Optical Stream</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Supporting Local Edge Inference Tagline */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            marginTop: '2rem',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            flexWrap: 'wrap',
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Cpu size={12} color="var(--color-emerald-deep)" />
            <span>30 FPS ON-DEVICE INFERENCE</span>
          </span>
          <span>•</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Lock size={12} color="var(--color-accent-purple-dark)" />
            <span>100% PRIVATE EDGE PROCESSING</span>
          </span>
          <span>•</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Gauge size={12} color="#D97706" />
            <span>PnP PERSPECTIVE 3D GEOMETRY</span>
          </span>
        </div>

        {/* =================================================================== */}
        {/* HERO CENTERPIECE: INTERACTIVE 3D COCKPIT WITH LAYERED PARALLAX PILLS */}
        {/* =================================================================== */}
        <div
          style={{
            width: '100%',
            maxWidth: '1040px',
            marginTop: '3.5rem',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* Layered Floating Telemetry Badge Left (Organic Float Hero A) */}
          <div
            className="animate-float-hero-a"
            style={{
              position: 'absolute',
              top: '-24px',
              left: 'clamp(-10px, 3vw, 24px)',
              zIndex: 10,
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '9999px',
              padding: '0.45rem 1rem',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            <span
              style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10B981' }}
              className="animate-pulse-live"
            />
            <span>PERCLOS: {isLive ? `${perclos.toFixed(1)}%` : '3.8%'} (NOMINAL)</span>
          </div>

          {/* Layered Floating Telemetry Badge Right (Organic Float Hero B) */}
          <div
            className="animate-float-hero-b"
            style={{
              position: 'absolute',
              top: '-20px',
              right: 'clamp(-10px, 3vw, 24px)',
              zIndex: 10,
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '9999px',
              padding: '0.45rem 1rem',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              color: 'var(--color-accent-purple-dark)',
            }}
          >
            <Sparkles size={12} color="var(--color-accent-purple-dark)" />
            <span>468-POINT MESH • ZERO CLOUD LEAK</span>
          </div>

          {/* Interactive 3D Canvas Frame */}
          <div
            style={{
              position: 'relative',
              borderRadius: '28px',
              overflow: 'hidden',
              boxShadow: '0 24px 60px rgba(22, 27, 24, 0.1)',
            }}
          >
            <InteractiveCockpit3D
              telemetryData={telemetryData}
              isMonitoring={isMonitoring}
              height="460px"
              theme="dark"
            />
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 2: LIVE SENSING COCKPIT (DEEP EMERALD FULL-WIDTH SECTION)     */}
      {/* ===================================================================== */}
      <section
        style={{
          backgroundColor: 'var(--color-emerald-deep)',
          borderRadius: '32px',
          padding: 'clamp(2.5rem, 5vw, 4.5rem) clamp(1.5rem, 4vw, 3.5rem)',
          color: '#FFFFFF',
          boxShadow: '0 24px 70px rgba(17, 53, 39, 0.28)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Soft Ambient Radial Mint Halo */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            left: '25%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            backgroundColor: 'rgba(110, 231, 183, 0.1)',
            filter: 'blur(90px)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {/* Section Headline */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.3rem 0.85rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(110, 231, 183, 0.12)',
                border: '1px solid rgba(110, 231, 183, 0.25)',
                color: 'var(--color-emerald-accent)',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                letterSpacing: '0.08em',
                marginBottom: '1rem',
              }}
            >
              <Radio size={12} className="animate-pulse-live" />
              <span>LIVE EDGE INFERENCE ENGINE</span>
            </div>

            <h2
              style={{
                lineHeight: 1.08,
                maxWidth: '820px',
                margin: 0,
              }}
            >
              <span
                className="font-serif"
                style={{
                  fontSize: 'clamp(2.6rem, 5.2vw, 4.4rem)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: '#FAF8F2',
                }}
              >
                Sub-second response,
              </span>{' '}
              <span
                className="font-display"
                style={{
                  fontSize: 'clamp(2.6rem, 5.2vw, 4.4rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  color: '#FAF8F2',
                }}
              >
                before distraction turns critical.
              </span>
            </h2>

            <p
              style={{
                fontSize: '1.05rem',
                color: 'rgba(255, 255, 255, 0.72)',
                maxWidth: '620px',
                marginTop: '1.25rem',
                lineHeight: 1.6,
              }}
            >
              DriveGuard continuously monitors eyelid aperture velocity and 3D head pose orientation.
              Natural blinks pass through uninterrupted; micro-sleeps and downward glances are flagged immediately.
            </p>
          </div>

          {/* Embedded Dual Cockpit Demonstration Canvas */}
          <div
            style={{
              backgroundColor: '#091A14',
              border: '1px solid rgba(110, 231, 183, 0.15)',
              borderRadius: '26px',
              padding: 'clamp(1.5rem, 3vw, 2.5rem)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center',
              boxShadow: 'inset 0 2px 20px rgba(0,0,0,0.4)',
            }}
          >
            {/* Left: Driver Biometric Mesh Silhouette */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
                position: 'relative',
              }}
            >
              <DriverIllustration
                state={riskLevel}
                size={270}
                animated={true}
                theme="dark"
              />
              <span
                className="font-mono"
                style={{
                  fontSize: '0.74rem',
                  color: 'var(--color-emerald-accent)',
                  marginTop: '1.25rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-emerald-accent)',
                  }}
                  className="animate-pulse-live"
                />
                <span>FACIAL LANDMARK MATRIX: {isLive ? `${blinkRate} BLINKS/MIN` : 'CALIBRATING'}</span>
              </span>
            </div>

            {/* Right: Real-Time Risk Instrument & Live Biometric Pills */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.75rem' }}>
              <RiskGauge
                score={isLive ? riskScore : 0}
                level={isLive ? riskLevel : 'STANDBY'}
                isLive={isLive}
                size={210}
              />

              {/* Floating Biometric Capsules */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', justifyContent: 'center' }}>
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(110, 231, 183, 0.2)',
                    borderRadius: '9999px',
                    padding: '0.4rem 0.95rem',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-mono)',
                    color: '#FAF8F2',
                  }}
                >
                  <span style={{ color: 'var(--color-emerald-accent)', marginRight: '0.35rem' }}>EAR:</span>
                  <span>{isLive ? ear.toFixed(2) : '0.33'}</span>
                </div>

                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(110, 231, 183, 0.2)',
                    borderRadius: '9999px',
                    padding: '0.4rem 0.95rem',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-mono)',
                    color: '#FAF8F2',
                  }}
                >
                  <span style={{ color: 'var(--color-emerald-accent)', marginRight: '0.35rem' }}>MAR:</span>
                  <span>{isLive ? mar.toFixed(2) : '0.12'}</span>
                </div>

                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(110, 231, 183, 0.2)',
                    borderRadius: '9999px',
                    padding: '0.4rem 0.95rem',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-mono)',
                    color: '#FAF8F2',
                  }}
                >
                  <span style={{ color: 'var(--color-emerald-accent)', marginRight: '0.35rem' }}>PITCH:</span>
                  <span>{isLive ? `${headPitch.toFixed(1)}°` : '0.5°'}</span>
                </div>

                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(110, 231, 183, 0.2)',
                    borderRadius: '9999px',
                    padding: '0.4rem 0.95rem',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-mono)',
                    color: '#FAF8F2',
                  }}
                >
                  <span style={{ color: 'var(--color-emerald-accent)', marginRight: '0.35rem' }}>PERCLOS:</span>
                  <span>{isLive ? `${perclos.toFixed(1)}%` : '3.8%'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 3: DETECTION CHOREOGRAPHY (INTERACTIVE ANIMATED DIAGRAMS)     */}
      {/* ===================================================================== */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.25rem' }}>
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
                marginBottom: '0.75rem',
              }}
            >
              <Activity size={12} />
              <span>02 // BIOMETRIC DETECTION TAXONOMY</span>
            </div>

            <h2
              className="font-serif"
              style={{
                fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)',
                fontWeight: 400,
                color: 'var(--text-primary)',
                margin: 0,
                lineHeight: 1.15,
              }}
            >
              Three core <em>sensing</em> pillars.
            </h2>
          </div>

          <button
            onClick={onToggleSimMode}
            className="pill-btn pill-btn-ghost btn-magnetic-pill"
            style={{ fontSize: '0.82rem', padding: '0.55rem 1.35rem' }}
          >
            <Sliders size={13} />
            <span>{isSimMode ? 'Exit Diagnostic Mode' : 'Toggle Diagnostic Mode'}</span>
          </button>
        </div>

        {/* 3 Interactive Cards (Lavender, Crisp White, Soft Mint) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {/* Card 1: Palpebral Aperture & Eye Closure */}
          <div
            style={{
              backgroundColor: 'var(--bg-card-lavender)',
              border: '1px solid rgba(124, 58, 237, 0.15)',
              borderRadius: '26px',
              padding: '2.25rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '320px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-accent-purple-dark)' }}>
                  01 // PALPEBRAL TRACKING
                </span>
                <Eye size={20} color="var(--color-accent-purple-dark)" />
              </div>

              <h3
                className="font-serif"
                style={{
                  fontSize: '1.7rem',
                  fontWeight: 400,
                  color: 'var(--color-accent-purple-dark)',
                  lineHeight: 1.2,
                  margin: '0 0 0.75rem 0',
                }}
              >
                Prolonged Lid Closure &amp; <em>Micro-Sleep</em>
              </h3>

              <p style={{ fontSize: '0.92rem', color: '#4A3D63', lineHeight: 1.6, margin: 0 }}>
                Eye Aspect Ratio (EAR) evaluates palpebral vertical distance against horizontal width.
                Natural blinks (120ms) are filtered out; closures exceeding 1.0s trigger progressive alerts.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '1.5rem',
                marginTop: '1.75rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid rgba(124, 58, 237, 0.18)',
              }}
            >
              <div>
                <span className="font-serif" style={{ fontSize: '2.2rem', color: 'var(--color-accent-purple-dark)' }}>
                  1.0s
                </span>
                <span style={{ display: 'block', fontSize: '0.72rem', color: '#655780', fontFamily: 'var(--font-mono)' }}>
                  WARN TRIGGER
                </span>
              </div>

              <div>
                <span className="font-serif" style={{ fontSize: '2.2rem', color: 'var(--color-alert)' }}>
                  1.8s
                </span>
                <span style={{ display: 'block', fontSize: '0.72rem', color: '#655780', fontFamily: 'var(--font-mono)' }}>
                  CRITICAL STOP
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: 3D Head Orientation & Distraction */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '26px',
              padding: '2.25rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '320px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  02 // 3D CRANIAL POSE
                </span>
                <Compass size={20} color="var(--text-primary)" />
              </div>

              <h3
                className="font-serif"
                style={{
                  fontSize: '1.7rem',
                  fontWeight: 400,
                  color: 'var(--text-primary)',
                  lineHeight: 1.2,
                  margin: '0 0 0.75rem 0',
                }}
              >
                Distraction Separated from <em>Drowsiness</em>
              </h3>

              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Perspective-n-Point facial geometry isolates smartphone or console glance (-16° pitch)
                from true ocular sleep, eliminating false drowsiness interventions while driving.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '1.5rem',
                marginTop: '1.75rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <div>
                <span className="font-serif" style={{ fontSize: '2.2rem', color: 'var(--text-primary)' }}>
                  &lt; -16°
                </span>
                <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  PITCH DOWN
                </span>
              </div>

              <div>
                <span className="font-serif" style={{ fontSize: '2.2rem', color: 'var(--text-primary)' }}>
                  &gt; 24°
                </span>
                <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  LATERAL YAW
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Audit-Grade Compliance Vault */}
          <div
            style={{
              backgroundColor: 'var(--bg-card-mint)',
              border: '1px solid rgba(16, 185, 129, 0.22)',
              borderRadius: '26px',
              padding: '2.25rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '320px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#064E3B' }}>
                  03 // AUDIT COMPLIANCE
                </span>
                <ShieldCheck size={20} color="#059669" />
              </div>

              <h3
                className="font-serif"
                style={{
                  fontSize: '1.7rem',
                  fontWeight: 400,
                  color: '#064E3B',
                  lineHeight: 1.2,
                  margin: '0 0 0.75rem 0',
                }}
              >
                Local SQLite <em>Audit</em> Vault
              </h3>

              <p style={{ fontSize: '0.92rem', color: '#1A4D3E', lineHeight: 1.6, margin: 0 }}>
                Every driving session longer than 5 seconds is persisted locally to SQLite with microsecond
                timestamps, incident counts, and safety grade letterings.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '1.5rem',
                marginTop: '1.75rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid rgba(16, 185, 129, 0.2)',
              }}
            >
              <div>
                <span className="font-serif" style={{ fontSize: '2.2rem', color: '#059669' }}>
                  100%
                </span>
                <span style={{ display: 'block', fontSize: '0.72rem', color: '#25634D', fontFamily: 'var(--font-mono)' }}>
                  TAMPER-EVIDENT
                </span>
              </div>

              <div>
                <span className="font-serif" style={{ fontSize: '2.2rem', color: '#059669' }}>
                  5.0s
                </span>
                <span style={{ display: 'block', fontSize: '0.72rem', color: '#25634D', fontFamily: 'var(--font-mono)' }}>
                  SESSION GATE
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 4: REAL RISK STATE PROGRESSION (SAFETY PIPELINE)              */}
      {/* ===================================================================== */}
      <section
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '28px',
          padding: 'clamp(2rem, 4vw, 3.5rem)',
          display: 'flex',
          flexDirection: 'column',
          gap: '2.5rem',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ maxWidth: '720px' }}>
          <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            State Machine Progression
          </span>
          <h2 className="font-serif" style={{ fontSize: 'clamp(2rem, 3.8vw, 3.2rem)', fontWeight: 400, color: 'var(--text-primary)', margin: '0.25rem 0 0 0' }}>
            From nominal baseline to <em>critical escalation</em>.
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '0.75rem', lineHeight: 1.6 }}>
            DriveGuard implements an algorithmic risk state machine that prevents false triggers while delivering
            loud, unmistakable acoustic and visual alerts when danger is imminent.
          </p>
        </div>

        {/* 3 Step Pipeline Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {/* Step 1: Nominal */}
          <div
            style={{
              backgroundColor: 'var(--bg-canvas-subtle)',
              borderRadius: '20px',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              border: '1px solid rgba(22, 27, 24, 0.05)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669' }}>
                STAGE 01 // NOMINAL
              </span>
              <CheckCircle size={16} color="#059669" />
            </div>
            <div className="font-serif" style={{ fontSize: '1.8rem', color: 'var(--text-primary)' }}>
              0% - 34% Risk
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Eyes open (EAR &gt; 0.22), natural periodic blinks (120ms). Cranial orientation centered within driving cone. Zero audible sound.
            </p>
          </div>

          {/* Step 2: Warning */}
          <div
            style={{
              backgroundColor: '#FEF3C7',
              borderRadius: '20px',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              border: '1px solid rgba(217, 119, 6, 0.25)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#B45309' }}>
                STAGE 02 // WARNING
              </span>
              <AlertTriangle size={16} color="#B45309" />
            </div>
            <div className="font-serif" style={{ fontSize: '1.8rem', color: '#92400E' }}>
              35% - 69% Risk
            </div>
            <p style={{ fontSize: '0.85rem', color: '#78350F', lineHeight: 1.5, margin: 0 }}>
              Debounced threshold exceeded (&gt;1.0s eye closure or &gt;1.2s sustained yawn). Distinct double-pulse chime emitted at 587 Hz.
            </p>
          </div>

          {/* Step 3: Critical */}
          <div
            style={{
              backgroundColor: 'var(--color-alert-dim)',
              borderRadius: '20px',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              border: '1px solid rgba(225, 29, 72, 0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-alert)' }}>
                STAGE 03 // CRITICAL
              </span>
              <AlertTriangle size={16} color="var(--color-alert)" />
            </div>
            <div className="font-serif" style={{ fontSize: '1.8rem', color: 'var(--color-alert)' }}>
              70% - 100% Risk
            </div>
            <p style={{ fontSize: '0.85rem', color: '#881337', lineHeight: 1.5, margin: 0 }}>
              Prolonged micro-sleep (&gt;1.8s) or sustained downward distraction (&gt;4.5s). Loud 880 Hz sawtooth alarm with 3.5s cooldown recovery.
            </p>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 5: FINAL CINEMATIC CALL-TO-ACTION                             */}
      {/* ===================================================================== */}
      <section
        style={{
          backgroundColor: '#091A14',
          borderRadius: '32px',
          padding: 'clamp(3.5rem, 6vw, 5.5rem) clamp(1.5rem, 4vw, 3.5rem)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.75rem',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Soft Background Mint Light Sweep */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '500px',
            height: '300px',
            borderRadius: '50%',
            backgroundColor: 'rgba(110, 231, 183, 0.08)',
            filter: 'blur(90px)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.95rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(110, 231, 183, 0.12)',
            border: '1px solid rgba(110, 231, 183, 0.25)',
            color: 'var(--color-emerald-accent)',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            letterSpacing: '0.06em',
          }}
        >
          <Sparkles size={12} />
          <span>START PROTECTING YOUR COMMUTE</span>
        </div>

        <h2
          className="font-serif"
          style={{
            fontSize: 'clamp(2.8rem, 6vw, 4.8rem)',
            fontWeight: 400,
            lineHeight: 1.08,
            color: '#FFFFFF',
            maxWidth: '850px',
            margin: 0,
          }}
        >
          Ready to experience <em>real-time</em> driver attentiveness?
        </h2>

        <p
          style={{
            fontSize: '1.05rem',
            color: 'rgba(255, 255, 255, 0.72)',
            maxWidth: '580px',
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          Connect any standard USB or laptop webcam. Zero installation of heavy drivers or proprietary hardware required.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
          <button
            onClick={onNavigateToMonitor}
            className="pill-btn pill-btn-lavender btn-magnetic-pill"
            style={{
              padding: '1rem 2.5rem',
              fontSize: '1rem',
            }}
          >
            <Camera size={18} />
            <span>Launch Live Cockpit HUD</span>
          </button>
        </div>
      </section>
    </div>
  );
}
