import React, { useState } from 'react';
import RiskGauge from '../components/RiskGauge';
import AlertBanner from '../components/AlertBanner';
import DriverIllustration from '../components/DriverIllustration';
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
} from 'lucide-react';

/**
 * OverviewView Component (VANTAGE Automotive Luxury Editorial Reset)
 * Features dramatic car photography, split ivory-to-dark hero composition,
 * huge condensed uppercase typography (Oswald), restrained technical labels,
 * and a 7-section cinematic narrative.
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

  const [activePerspective, setActivePerspective] = useState(0);

  const perspectives = [
    {
      id: 'cockpit',
      tabLabel: '01 Cockpit Sensing',
      title: 'Driver-Facing Optical Vision',
      description: 'Interior perspective aligned to driver head pose and palpebral aperture tracking',
      image: '/images/cockpit-driver.jpg',
      fallback: 'https://images.unsplash.com/photo-1491921125492-f0b9c835b699?auto=format&fit=crop&w=1920&q=85',
      tag: 'CABIN SENSING AXIS',
      pin: { top: '16%', left: '74%', text: 'Driver Monitoring Vision // 30 FPS' },
    },
    {
      id: 'vehicle',
      tabLabel: '02 Vehicle Architecture',
      title: 'Intelligent Aerodynamic Form',
      description: 'Pristine exhibition showroom context demonstrating zero cloud intrusion',
      image: '/images/hero-car.jpg',
      fallback: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1920&q=85',
      tag: 'CHASSIS DYNAMICS',
      pin: { top: '34%', left: '46%', text: 'Sensor Integration // 468 Landmark Mesh' },
    },
  ];

  const currentView = perspectives[activePerspective];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem', position: 'relative' }}>
      {/* Editorial Safety Alert Banner (Precision Alert) */}
      <AlertBanner
        alertState={riskLevel}
        riskReason={riskReason}
        message={alertMessage}
        isEngineConnected={isEngineConnected || isSimMode}
        isMonitoring={isMonitoring}
        isRecovering={isRecovering}
      />

      {/* ===================================================================== */}
      {/* SECTION A: HERO (BANG & OLUFSEN A9 PRODUCT-FOCUSED MINIMAL HERO)     */}
      {/* ===================================================================== */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          backgroundColor: 'var(--bg-canvas)',
          padding: 'clamp(2rem, 4vw, 3.5rem) clamp(1.25rem, 4vw, 3.5rem) clamp(2.5rem, 5vw, 4rem)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          borderBottom: '1px solid var(--border-subtle)',
          marginTop: '-1rem',
        }}
      >
        {/* Subtle Category & Status Eyebrow */}
        <div
          className="cinematic-fade-in"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: '0.85rem',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: isLive ? 'var(--color-safe)' : 'var(--color-accent-red)',
            }}
            className={isLive ? 'telemetry-pulse' : ''}
          />
          <span>DRIVEGUARD AI // DRIVER SAFETY INTELLIGENCE</span>
        </div>

        {/* Minimal, Elegant Title */}
        <h1
          className="cinematic-fade-in"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(2.3rem, 4.6vw, 3.8rem)',
            fontWeight: 500,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            lineHeight: 1.15,
            maxWidth: '780px',
            margin: '0 0 0.85rem 0',
          }}
        >
          Driver Safety Intelligence
        </h1>

        {/* Calm, Understated Subtitle */}
        <p
          className="cinematic-fade-in"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(0.95rem, 1.35vw, 1.1rem)',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto clamp(1.75rem, 3.5vw, 2.5rem)',
            fontWeight: 400,
          }}
        >
          Real-time edge driver monitoring. Non-intrusive computer vision designed for
          attentiveness, fatigue prevention, and occupant safety.
        </p>

        {/* Prominent but Restrained Actions */}
        <div
          className="cinematic-fade-in"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.85rem',
            flexWrap: 'wrap',
            marginBottom: 'clamp(2.5rem, 4.5vw, 3.5rem)',
          }}
        >
          {!isMonitoring && onStartMonitoring ? (
            <button
              onClick={onStartMonitoring}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                backgroundColor: 'var(--text-primary)',
                color: '#FFFFFF',
                border: '1px solid var(--text-primary)',
                borderRadius: '9999px',
                padding: '0.75rem 2.2rem',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.88rem',
                fontWeight: 500,
                letterSpacing: '0.03em',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#000000';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--text-primary)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)';
              }}
            >
              <Play size={13} fill="currentColor" />
              <span>Start Monitoring</span>
            </button>
          ) : (
            <button
              onClick={onNavigateToMonitor}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                backgroundColor: 'var(--text-primary)',
                color: '#FFFFFF',
                border: '1px solid var(--text-primary)',
                borderRadius: '9999px',
                padding: '0.75rem 2.2rem',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.88rem',
                fontWeight: 500,
                letterSpacing: '0.03em',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#000000';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--text-primary)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Camera size={14} />
              <span>Enter Cockpit HUD</span>
              <ArrowRight size={13} />
            </button>
          )}

          <button
            onClick={onNavigateToMonitor}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'transparent',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '9999px',
              padding: '0.75rem 1.85rem',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.88rem',
              fontWeight: 500,
              letterSpacing: '0.03em',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--text-primary)';
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span>Inspect Optical Stream</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        {/* Centerpiece Product Image Frame (Bang & Olufsen Sculptural Presentation) */}
        <div
          className="hero-image-reveal"
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1120px',
            borderRadius: '16px',
            overflow: 'hidden',
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(17, 17, 17, 0.08)',
            boxShadow: '0 24px 60px -15px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Main Visual Image */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: 'clamp(320px, 52vw, 560px)',
              overflow: 'hidden',
              backgroundColor: '#FAF9F6',
            }}
          >
            <img
              key={currentView.id}
              src={currentView.image}
              alt={currentView.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 48%',
                display: 'block',
                transition: 'opacity 0.5s var(--ease-cinematic), transform 0.6s var(--ease-cinematic)',
              }}
              onError={(e) => {
                e.currentTarget.src = currentView.fallback;
              }}
            />

            {/* Subtle Gradient Vignette at Edges */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, transparent 22%, transparent 78%, rgba(0,0,0,0.18) 100%)',
                pointerEvents: 'none',
              }}
            />

            {/* Sensor Callout Hotspot Badge */}
            <div
              style={{
                position: 'absolute',
                top: currentView.pin.top,
                left: currentView.pin.left,
                transform: 'translate(-50%, -50%)',
                zIndex: 3,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: 'rgba(17, 17, 17, 0.78)',
                backdropFilter: 'blur(10px)',
                color: '#FFFFFF',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.08em',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                pointerEvents: 'none',
              }}
            >
              <span
                style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-accent-red)',
                }}
              />
              <span>{currentView.pin.text}</span>
            </div>

            {/* Unobtrusive Previous / Next View Buttons */}
            <button
              onClick={() => setActivePerspective((prev) => (prev === 0 ? 1 : 0))}
              aria-label="Previous Perspective"
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 4,
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.88)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.88)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <ChevronLeft size={16} />
            </button>

            <button
              onClick={() => setActivePerspective((prev) => (prev === 0 ? 1 : 0))}
              aria-label="Next Perspective"
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 4,
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.88)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.88)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <ChevronRight size={16} />
            </button>

            {/* Bottom Perspective Selector Strip inside Centerpiece */}
            <div
              style={{
                position: 'absolute',
                bottom: '1rem',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 4,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(10px)',
                padding: '3px 4px',
                borderRadius: '9999px',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              }}
            >
              {perspectives.map((p, idx) => {
                const isSelected = activePerspective === idx;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActivePerspective(idx)}
                    style={{
                      border: 'none',
                      background: isSelected ? 'var(--text-primary)' : 'transparent',
                      color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                      padding: '0.35rem 0.85rem',
                      borderRadius: '9999px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      letterSpacing: '0.06em',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    {p.tabLabel}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Minimal Bottom Information Strip (Thin Separators & Refined Specs) */}
        <div
          style={{
            width: '100%',
            maxWidth: '1120px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.75rem',
            paddingTop: '2.5rem',
            marginTop: 'clamp(2rem, 3.5vw, 3rem)',
            borderTop: '1px solid var(--border-subtle)',
            textAlign: 'left',
          }}
        >
          <div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                letterSpacing: '0.12em',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                display: 'block',
              }}
            >
              01 / INFERENCE LATENCY
            </span>
            <div
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1.15rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginTop: '0.25rem',
              }}
            >
              &lt; 15ms Edge Processing
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              100% local, zero cloud dependency
            </span>
          </div>

          <div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                letterSpacing: '0.12em',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                display: 'block',
              }}
            >
              02 / OCULAR PERCLOS
            </span>
            <div
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1.15rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginTop: '0.25rem',
              }}
            >
              EAR &gt; 0.22 Baseline
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Continuous palpebral aperture tracking
            </span>
          </div>

          <div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                letterSpacing: '0.12em',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                display: 'block',
              }}
            >
              03 / SPATIAL KINEMATICS
            </span>
            <div
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1.15rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginTop: '0.25rem',
              }}
            >
              PnP 3D Cranial Pose
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Pitch &amp; yaw distraction vectors
            </span>
          </div>

          <div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                letterSpacing: '0.12em',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                display: 'block',
              }}
            >
              04 / SYSTEM STATE
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                marginTop: '0.25rem',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: isLive ? 'var(--color-safe)' : '#F59E0B',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '1.15rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}
              >
                {isLive ? 'Active Sensing' : 'Ready to Deploy'}
              </span>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              {isEngineConnected ? 'Hardware camera stream online' : 'Camera stream on standby'}
            </span>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION B: THE PROBLEM (EDITORIAL STATEMENT & ATMOSPHERIC ROAD)       */}
      {/* ===================================================================== */}
      <section
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 clamp(1.25rem, 4vw, 3.5rem)',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center',
          }}
        >
          {/* Left: Dramatic Statement */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ width: '24px', height: '1.5px', backgroundColor: 'var(--color-accent-red)' }} />
              <span className="label-editorial" style={{ color: 'var(--color-accent-red)' }}>
                THE TEMPORAL HAZARD
              </span>
            </div>

            <h2
              className="font-condensed"
              style={{
                fontSize: 'clamp(2.4rem, 4.8vw, 4.2rem)',
                lineHeight: 0.95,
                letterSpacing: '-0.02em',
                fontWeight: 700,
                color: 'var(--text-primary)',
                textTransform: 'uppercase',
                margin: '0 0 1.5rem 0',
              }}
            >
              IN 1.8 SECONDS AT 100 KM/H, A VEHICLE TRAVELS 50 METERS BLIND.
            </h2>

            <p
              className="font-sans"
              style={{
                fontSize: '1.05rem',
                lineHeight: 1.65,
                color: 'var(--text-secondary)',
                marginBottom: '2rem',
              }}
            >
              Fatigue and cognitive distraction are not instantaneous events. They manifest as subtle,
              measurable micro-alterations in palpebral aperture velocity and persistent cranial pitch deviation.
              By the time human awareness registers lapse, critical braking margins have vanished.
            </p>

            {/* Three Precision Technical Metrics */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.25rem',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '1.5rem',
              }}
            >
              <div>
                <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>
                  01 // PHYSIOLOGICAL
                </span>
                <span className="font-condensed" style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  120 MS
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>
                  Filtered nominal blink
                </span>
              </div>

              <div>
                <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>
                  02 // CAUTION
                </span>
                <span className="font-condensed" style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--color-warning)' }}>
                  1.00 S
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>
                  Auditory warn threshold
                </span>
              </div>

              <div>
                <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>
                  03 // CRITICAL
                </span>
                <span className="font-condensed" style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--color-accent-red)' }}>
                  1.80 S
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>
                  Emergency acoustic alarm
                </span>
              </div>
            </div>
          </div>

          {/* Right: Atmospheric Image */}
          <div
            className="zoom-container"
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-card)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
              minHeight: '380px',
            }}
          >
            <img
              src="/images/problem-car.jpg"
              alt="Automotive perspective on dark highway"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                filter: 'contrast(1.1) brightness(0.9)',
              }}
              onError={(e) => {
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1920&q=85';
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '1.25rem',
                left: '1.25rem',
                backgroundColor: 'rgba(13, 14, 16, 0.85)',
                padding: '0.5rem 0.95rem',
                borderRadius: '2px',
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                color: '#FFFFFF',
                letterSpacing: '0.08em',
              }}
            >
              FIG.02 // KINEMATIC DANGER ENVELOPE
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION C: REAL-TIME SENSING (OPTICAL TELEMETRY HUD - WARM BEIGE)       */}
      {/* ===================================================================== */}
      <section
        className="section-c-hud"
        style={{
          backgroundColor: '#F3E5D8',
          borderTop: '1px solid #D1B198',
          borderBottom: '1px solid #D1B198',
          color: '#382C27',
          padding: 'clamp(4rem, 7vw, 6.5rem) clamp(1.25rem, 4vw, 3.5rem)',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem', marginBottom: '3.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ width: '6px', height: '6px', backgroundColor: '#A77B5A' }} className="telemetry-pulse" />
                <span className="font-mono" style={{ fontSize: '0.72rem', color: '#A77B5A', letterSpacing: '0.14em', fontWeight: 600 }}>
                  SECTION C // OPTICAL TELEMETRY HUD
                </span>
              </div>

              <h2
                className="font-condensed"
                style={{
                  fontSize: 'clamp(2.8rem, 5.5vw, 4.6rem)',
                  lineHeight: 0.94,
                  letterSpacing: '-0.02em',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#382C27',
                  margin: 0,
                }}
              >
                REAL-TIME SENSING ARCHITECTURE.
              </h2>
            </div>

            <button
              onClick={onNavigateToMonitor}
              className="vantage-btn-beige"
            >
              <span>OPEN FULL COCKPIT HUD</span>
              <ArrowUpRight size={15} className="arrow-slide" />
            </button>
          </div>

          {/* Warm Beige Cockpit Canvas (Secondary Panel) */}
          <div
            style={{
              backgroundColor: '#FAF5EF',
              border: '1px solid #D1B198',
              borderRadius: 'var(--radius-card)',
              padding: 'clamp(1.5rem, 3.5vw, 2.75rem)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '3rem',
              alignItems: 'center',
              boxShadow: '0 12px 36px rgba(167, 123, 90, 0.09), 0 1px 3px rgba(56, 44, 39, 0.04)',
            }}
          >
            {/* Left: Driver Biometric Artwork HUD */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <DriverIllustration
                state={riskLevel}
                size={280}
                animated={true}
                theme="light"
              />

              <div
                className="font-mono"
                style={{
                  fontSize: '0.74rem',
                  color: isLive ? (riskLevel === 'CRITICAL' ? 'var(--color-alert)' : riskLevel === 'WARNING' ? 'var(--color-warning)' : '#A77B5A') : '#8B7565',
                  marginTop: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  letterSpacing: '0.08em',
                  fontWeight: 600,
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: isLive ? (riskLevel === 'CRITICAL' ? 'var(--color-alert)' : riskLevel === 'WARNING' ? 'var(--color-warning)' : '#10B981') : '#A77B5A',
                  }}
                  className="telemetry-pulse"
                />
                <span>LANDMARK GRID: {isLive ? `${blinkRate} BLINKS/MIN` : 'CALIBRATING'}</span>
              </div>
            </div>

            {/* Right: Risk Gauge & Live Biometrics */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
              <RiskGauge
                score={isLive ? riskScore : 0}
                level={isLive ? riskLevel : 'STANDBY'}
                isLive={isLive}
                size={220}
              />

              {/* Technical Ratio Badges (Card surfaces) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', width: '100%', maxWidth: '420px' }}>
                <div
                  style={{
                    backgroundColor: '#EAD8C7',
                    border: '1px solid #D1B198',
                    padding: '0.95rem 1.15rem',
                    borderRadius: '4px',
                    boxShadow: '0 2px 6px rgba(56, 44, 39, 0.04)',
                  }}
                >
                  <span className="font-mono" style={{ fontSize: '0.68rem', color: '#8B7565', display: 'block', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '0.2rem' }}>
                    EYE ASPECT (EAR)
                  </span>
                  <span className="font-condensed" style={{ fontSize: '1.65rem', fontWeight: 700, color: '#382C27', lineHeight: 1.1, display: 'block' }}>
                    {isLive ? ear.toFixed(2) : '0.33'}
                  </span>
                  <span className="font-mono" style={{ fontSize: '0.65rem', color: '#756052', display: 'block', marginTop: '0.25rem' }}>
                    Threshold &gt; 0.22
                  </span>
                </div>

                <div
                  style={{
                    backgroundColor: '#EAD8C7',
                    border: '1px solid #D1B198',
                    padding: '0.95rem 1.15rem',
                    borderRadius: '4px',
                    boxShadow: '0 2px 6px rgba(56, 44, 39, 0.04)',
                  }}
                >
                  <span className="font-mono" style={{ fontSize: '0.68rem', color: '#8B7565', display: 'block', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '0.2rem' }}>
                    MOUTH ASPECT (MAR)
                  </span>
                  <span className="font-condensed" style={{ fontSize: '1.65rem', fontWeight: 700, color: '#382C27', lineHeight: 1.1, display: 'block' }}>
                    {isLive ? mar.toFixed(2) : '0.12'}
                  </span>
                  <span className="font-mono" style={{ fontSize: '0.65rem', color: '#756052', display: 'block', marginTop: '0.25rem' }}>
                    Yawn Warn &gt; 0.55
                  </span>
                </div>

                <div
                  style={{
                    backgroundColor: '#EAD8C7',
                    border: '1px solid #D1B198',
                    padding: '0.95rem 1.15rem',
                    borderRadius: '4px',
                    boxShadow: '0 2px 6px rgba(56, 44, 39, 0.04)',
                  }}
                >
                  <span className="font-mono" style={{ fontSize: '0.68rem', color: '#8B7565', display: 'block', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '0.2rem' }}>
                    CRANIAL PITCH
                  </span>
                  <span className="font-condensed" style={{ fontSize: '1.65rem', fontWeight: 700, color: '#382C27', lineHeight: 1.1, display: 'block' }}>
                    {isLive ? `${headPitch.toFixed(1)}°` : '0.5°'}
                  </span>
                  <span className="font-mono" style={{ fontSize: '0.65rem', color: '#756052', display: 'block', marginTop: '0.25rem' }}>
                    Pitch Tilt (Deg)
                  </span>
                </div>

                <div
                  style={{
                    backgroundColor: '#EAD8C7',
                    border: '1px solid #D1B198',
                    padding: '0.95rem 1.15rem',
                    borderRadius: '4px',
                    boxShadow: '0 2px 6px rgba(56, 44, 39, 0.04)',
                  }}
                >
                  <span className="font-mono" style={{ fontSize: '0.68rem', color: '#8B7565', display: 'block', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '0.2rem' }}>
                    PERCLOS INDEX
                  </span>
                  <span className="font-condensed" style={{ fontSize: '1.65rem', fontWeight: 700, color: '#382C27', lineHeight: 1.1, display: 'block' }}>
                    {isLive ? `${perclos.toFixed(1)}%` : '3.8%'}
                  </span>
                  <span className="font-mono" style={{ fontSize: '0.65rem', color: '#756052', display: 'block', marginTop: '0.25rem' }}>
                    Ocular Closure %
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scoped CSS for Section C Warm Beige HUD */}
        <style>{`
          .section-c-hud {
            --bg-surface-warm: #EAD8C7;
            --border-subtle: #D1B198;
            --text-primary: #382C27;
            --text-secondary: #756052;
            --text-muted: #8B7565;
          }
          .section-c-hud .vantage-btn-beige {
            background-color: #382C27;
            border: 1px solid #382C27;
            color: #FAF5EF;
            border-radius: var(--radius-btn);
            padding: 0.75rem 1.75rem;
            font-family: var(--font-condensed);
            font-size: 0.92rem;
            font-weight: 500;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 0.65rem;
            transition: all var(--transition-fast);
            box-shadow: 0 4px 14px rgba(56, 44, 39, 0.12);
          }
          .section-c-hud .vantage-btn-beige:hover {
            background-color: #221A17;
            border-color: #221A17;
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(56, 44, 39, 0.18);
          }
        `}</style>
      </section>

      {/* ===================================================================== */}
      {/* SECTION D: EARLY DETECTION (THREE RESTRAINED TECHNICAL DIAGRAMS)      */}
      {/* ===================================================================== */}
      <section
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 clamp(1.25rem, 4vw, 3.5rem)',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '3rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--text-primary)' }} />
              <span className="label-editorial">DETECTION TAXONOMY</span>
            </div>

            <h2
              className="font-condensed"
              style={{
                fontSize: 'clamp(2.6rem, 5vw, 4.2rem)',
                lineHeight: 0.95,
                letterSpacing: '-0.02em',
                fontWeight: 700,
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              EARLY BIOMETRIC INTERVENTION.
            </h2>
          </div>

          <button
            onClick={onToggleSimMode}
            className="vantage-btn vantage-btn-outline"
            style={{ padding: '0.65rem 1.45rem', fontSize: '0.84rem' }}
          >
            <Sliders size={13} />
            <span>{isSimMode ? 'EXIT DIAGNOSTIC HARNESS' : 'TOGGLE TEST HARNESS'}</span>
          </button>
        </div>

        {/* 3 Restrained Architectural Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
          }}
        >
          {/* Card 01: Palpebral Closure */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-card)',
              padding: '2.5rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '340px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.12em' }}>
                  SPEC.01 // OCULAR
                </span>
                <Eye size={18} color="var(--text-primary)" />
              </div>

              <h3
                className="font-condensed"
                style={{
                  fontSize: '1.85rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  margin: '0 0 1rem 0',
                }}
              >
                PROLONGED PALPEBRAL APERTURE CLOSURE
              </h3>

              <p className="font-sans" style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Continuous measurement of upper-to-lower eyelid Euclidean separation. Eliminates nominal 120ms
                involuntary blinks; escalates from warning at 1.0s to critical acoustic intervention at 1.8s.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '2rem',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '1.5rem',
                marginTop: '2rem',
              }}
            >
              <div>
                <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>
                  WARN ESCALATION
                </span>
                <span className="font-condensed" style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  1.00 S
                </span>
              </div>

              <div>
                <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>
                  CRITICAL STOP
                </span>
                <span className="font-condensed" style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--color-accent-red)' }}>
                  1.80 S
                </span>
              </div>
            </div>
          </div>

          {/* Card 02: Cranial Perspective */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-card)',
              padding: '2.5rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '340px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.12em' }}>
                  SPEC.02 // KINEMATICS
                </span>
                <Compass size={18} color="var(--text-primary)" />
              </div>

              <h3
                className="font-condensed"
                style={{
                  fontSize: '1.85rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  margin: '0 0 1rem 0',
                }}
              >
                3D HEAD POSE &amp; DOWNWARD GLANCE SEPARATION
              </h3>

              <p className="font-sans" style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Perspective-n-Point facial geometry isolates phone and center-console gaze (-16° pitch)
                from true ocular drowsiness, preventing false fatigue triggers while detecting visual inattention.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '2rem',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '1.5rem',
                marginTop: '2rem',
              }}
            >
              <div>
                <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>
                  PITCH DOWNWARD
                </span>
                <span className="font-condensed" style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  &lt; -16.0°
                </span>
              </div>

              <div>
                <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>
                  LATERAL DIVERSION
                </span>
                <span className="font-condensed" style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  &gt; 24.0°
                </span>
              </div>
            </div>
          </div>

          {/* Card 03: Palatal Yawn Expansion */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-card)',
              padding: '2.5rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '340px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.12em' }}>
                  SPEC.03 // PALATAL
                </span>
                <Activity size={18} color="var(--text-primary)" />
              </div>

              <h3
                className="font-condensed"
                style={{
                  fontSize: '1.85rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  margin: '0 0 1rem 0',
                }}
              >
                SUSTAINED YAWNING &amp; APERTURE VELOCITY
              </h3>

              <p className="font-sans" style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Mouth Aspect Ratio (MAR) computes vertical lip excursion against oral width.
                Distinguishes conversation and vocal articulation from prolonged yawning fatigue excursions.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '2rem',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '1.5rem',
                marginTop: '2rem',
              }}
            >
              <div>
                <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>
                  YAWN THRESHOLD
                </span>
                <span className="font-condensed" style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  &gt; 0.55
                </span>
              </div>

              <div>
                <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>
                  TEMPORAL GATE
                </span>
                <span className="font-condensed" style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  1.20 S
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION E: RESPONSE (ALGORITHMIC RISK STATE TRANSITION)               */}
      {/* ===================================================================== */}
      <section
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 clamp(1.25rem, 4vw, 3.5rem)',
          width: '100%',
        }}
      >
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--color-accent-red)' }} />
            <span className="label-editorial" style={{ color: 'var(--color-accent-red)' }}>
              STATE MACHINE PROGRESSION
            </span>
          </div>

          <h2
            className="font-condensed"
            style={{
              fontSize: 'clamp(2.6rem, 5vw, 4.2rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              fontWeight: 700,
              textTransform: 'uppercase',
              margin: '0 0 1rem 0',
            }}
          >
            PRECISION RISK ESCALATION.
          </h2>

          <p className="font-sans" style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: 0 }}>
            DriveGuard implements an algorithmic state machine that debounces momentary fluctuations
            and ensures acoustic warnings match true physical urgency.
          </p>
        </div>

        {/* 3 Step Architectural Pipeline Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {/* Stage 01: Nominal */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-card)',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--color-accent-green)', letterSpacing: '0.12em', fontWeight: 600 }}>
                STAGE 01 // NOMINAL
              </span>
              <CheckCircle size={16} color="var(--color-accent-green)" />
            </div>

            <div className="font-condensed" style={{ fontSize: '2.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              0% - 34%
            </div>

            <p className="font-sans" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
              Eyes open (EAR &gt; 0.22), natural periodic blinks (120ms). Cranial orientation centered within driving cone. Silent background monitoring.
            </p>
          </div>

          {/* Stage 02: Warning */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--color-warning)',
              borderRadius: 'var(--radius-card)',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--color-warning)', letterSpacing: '0.12em', fontWeight: 600 }}>
                STAGE 02 // WARNING
              </span>
              <AlertTriangle size={16} color="var(--color-warning)" />
            </div>

            <div className="font-condensed" style={{ fontSize: '2.4rem', fontWeight: 700, color: 'var(--color-warning)' }}>
              35% - 69%
            </div>

            <p className="font-sans" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
              Debounced threshold exceeded (&gt;1.0s eye closure or &gt;1.2s sustained yawn). Emits double-pulse acoustic chime at 587 Hz.
            </p>
          </div>

          {/* Stage 03: Critical */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid var(--color-accent-red)',
              borderRadius: 'var(--radius-card)',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxShadow: '0 8px 30px rgba(232, 75, 50, 0.12)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--color-accent-red)', letterSpacing: '0.12em', fontWeight: 700 }}>
                STAGE 03 // CRITICAL
              </span>
              <AlertTriangle size={16} color="var(--color-accent-red)" />
            </div>

            <div className="font-condensed" style={{ fontSize: '2.4rem', fontWeight: 700, color: 'var(--color-accent-red)' }}>
              70% - 100%
            </div>

            <p className="font-sans" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
              Prolonged micro-sleep (&gt;1.8s) or sustained downward distraction (&gt;4.5s). Loud emergency 880 Hz alarm with 3.5s cooldown recovery gate.
            </p>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION F: HISTORICAL INSIGHT (SQLITE PERSISTENCE PREVIEW)             */}
      {/* ===================================================================== */}
      <section
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 clamp(1.25rem, 4vw, 3.5rem)',
          width: '100%',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-card)',
            padding: 'clamp(2.5rem, 5vw, 4rem)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center',
          }}
        >
          <div>
            <span className="label-editorial" style={{ color: 'var(--text-muted)' }}>
              PERSISTENT AUDIT COMPLIANCE
            </span>
            <h2
              className="font-condensed"
              style={{
                fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
                lineHeight: 0.95,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                margin: '0.5rem 0 1.25rem 0',
              }}
            >
              DETERMINISTIC SESSION LEDGER.
            </h2>
            <p className="font-sans" style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
              Every completed driving session is committed directly to local SQLite database storage.
              Tamper-evident records, palpebral duration logs, and verified safety grades.
            </p>

            <button
              onClick={() => onNavigateToMonitor && onNavigateToMonitor()}
              className="vantage-btn"
            >
              <span>INSPECT SESSION LEDGER</span>
              <ArrowRight size={15} className="arrow-slide" />
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1.25rem',
            }}
          >
            <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '1.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
              <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>
                DATABASE INTEGRITY
              </span>
              <span className="font-condensed" style={{ fontSize: '2.4rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                17 TRIPS
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block' }}>
                Committed SQLite ledger
              </span>
            </div>

            <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '1.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
              <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>
                STEP 9 HARNESS
              </span>
              <span className="font-condensed" style={{ fontSize: '2.4rem', fontWeight: 600, color: 'var(--color-accent-green)' }}>
                99.40%
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block' }}>
                Classification accuracy
              </span>
            </div>

            <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '1.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
              <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>
                SESSION GATE
              </span>
              <span className="font-condensed" style={{ fontSize: '2.4rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                5.0 SEC
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block' }}>
                Minimum threshold filter
              </span>
            </div>

            <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '1.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
              <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>
                COMPLIANCE
              </span>
              <span className="font-condensed" style={{ fontSize: '2.4rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                GRADE A
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block' }}>
                Optimal driver standard
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION G: FINAL CTA (HIGH-IMPACT DARK LUXURY AUTOMOTIVE SECTION)     */}
      {/* ===================================================================== */}
      <section
        style={{
          position: 'relative',
          backgroundColor: 'var(--bg-dark)',
          color: '#FFFFFF',
          borderRadius: 'var(--radius-card-lg)',
          margin: '0 clamp(1.25rem, 4vw, 3.5rem) 4rem',
          padding: 'clamp(4.5rem, 8vw, 7rem) clamp(1.5rem, 5vw, 4rem)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          boxShadow: 'var(--shadow-dark)',
        }}
      >
        {/* Background Image Texture */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.28,
            pointerEvents: 'none',
          }}
        >
          <img
            src="/images/cockpit-interior.jpg"
            alt="Atmospheric luxury sports car cockpit"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1920&q=85';
            }}
          />
        </div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '820px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.25rem',
            }}
          >
            <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--color-accent-red)' }} />
            <span className="font-mono" style={{ fontSize: '0.72rem', letterSpacing: '0.16em', color: 'var(--color-accent-red)' }}>
              SYSTEM READY FOR DEPLOYMENT
            </span>
          </div>

          <h2
            className="font-condensed"
            style={{
              fontSize: 'clamp(3.2rem, 7.5vw, 5.8rem)',
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#FFFFFF',
              margin: '0 0 1.5rem 0',
            }}
          >
            ELEVATE YOUR AWARENESS.
          </h2>

          <p
            className="font-sans"
            style={{
              fontSize: '1.15rem',
              lineHeight: 1.6,
              color: 'var(--text-light-muted)',
              maxWidth: '560px',
              margin: '0 auto 2.5rem',
            }}
          >
            Connect any standard USB or laptop camera. Local computer-vision edge inference
            begins immediately with sub-15ms temporal response.
          </p>

          <button
            onClick={onNavigateToMonitor}
            className="vantage-btn"
            style={{
              backgroundColor: '#FFFFFF',
              color: '#000000',
              borderColor: '#FFFFFF',
              padding: '1rem 2.75rem',
              fontSize: '1rem',
            }}
          >
            <span>LAUNCH LIVE COCKPIT HUD</span>
            <ArrowUpRight size={18} className="arrow-slide" />
          </button>
        </div>
      </section>
    </div>
  );
}
