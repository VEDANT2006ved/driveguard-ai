import React from 'react';
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
      {/* SECTION A: HERO (VANTAGE SPLIT IVORY-TO-IMAGE + OSWALD TYPOGRAPHY)    */}
      {/* ===================================================================== */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          minHeight: 'clamp(580px, 82vh, 880px)',
          backgroundColor: 'var(--bg-canvas)',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          borderBottom: '1px solid var(--border-subtle)',
          marginTop: '-1rem',
        }}
      >
        {/* Right / Background: Dramatic Luxury Automotive Photograph */}
        <div
          className="hero-image-reveal zoom-container"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: 'clamp(55%, 72vw, 85%)',
            zIndex: 1,
          }}
        >
          <img
            src="/images/hero-car.jpg"
            alt="Cinematic luxury performance vehicle in moody lighting"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 45%',
              display: 'block',
              filter: 'contrast(1.08) brightness(0.92)',
            }}
            onError={(e) => {
              // Online fallback if local file is missing
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1920&q=85';
            }}
          />

          {/* VANTAGE Signature Ivory-to-Image Soft Gradient Transition */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to right, #F7F6F2 0%, #F7F6F2 18%, rgba(247, 246, 242, 0.88) 32%, rgba(247, 246, 242, 0.45) 52%, rgba(247, 246, 242, 0) 75%), linear-gradient(to top, rgba(247, 246, 242, 0.6) 0%, transparent 25%)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Left: Huge Condensed Uppercase Headline & Narrative Overlay */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            maxWidth: '1440px',
            margin: '0 auto',
            padding: '2rem clamp(1.25rem, 4vw, 3.5rem)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {/* Small Uppercase Technical Specification Label */}
          <div
            className="cinematic-fade-in"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.25rem',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                backgroundColor: 'var(--color-accent-red)',
              }}
            />
            <span
              className="font-mono"
              style={{
                fontSize: '0.74rem',
                color: 'var(--text-primary)',
                letterSpacing: '0.14em',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              DRIVEGUARD AI // SERIES 2026 // EDGE OCCUPANT INTELLIGENCE
            </span>
          </div>

          {/* Red Accent Dividing Line */}
          <div
            className="accent-line-expand"
            style={{
              height: '2px',
              maxWidth: '80px',
              backgroundColor: 'var(--color-accent-red)',
              marginBottom: '1.75rem',
            }}
          />

          {/* Huge Condensed Uppercase Headline (Oswald) */}
          <h1
            className="hero-headline-reveal font-condensed"
            style={{
              fontSize: 'clamp(4.2rem, 9.8vw, 8.8rem)',
              lineHeight: 0.88,
              letterSpacing: '-0.02em',
              fontWeight: 700,
              color: 'var(--text-primary)',
              textTransform: 'uppercase',
              margin: '0 0 1.75rem 0',
              maxWidth: '820px',
            }}
          >
            DRIVE<br />
            WITH<br />
            <span style={{ color: 'var(--text-primary)' }}>AWARENESS.</span>
          </h1>

          {/* Supporting Line */}
          <p
            className="cinematic-fade-in font-sans"
            style={{
              fontSize: 'clamp(1.05rem, 1.8vw, 1.35rem)',
              lineHeight: 1.5,
              color: 'var(--text-secondary)',
              maxWidth: '520px',
              fontWeight: 400,
              margin: '0 0 2.25rem 0',
            }}
          >
            Real-time driver monitoring. Earlier detection. Smarter safety.
            Translating 478 facial landmarks into deterministic fatigue prevention.
          </p>

          {/* Action Row: Rectangular VANTAGE Action Buttons */}
          <div
            className="cinematic-fade-in"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={onNavigateToMonitor}
              className="vantage-btn"
              style={{
                padding: '0.85rem 2rem',
                fontSize: '0.92rem',
              }}
            >
              <span>ENTER COCKPIT HUD</span>
              <ArrowUpRight size={16} className="arrow-slide" />
            </button>

            {!isMonitoring && onStartMonitoring ? (
              <button
                onClick={onStartMonitoring}
                className="vantage-btn vantage-btn-outline"
                style={{
                  padding: '0.85rem 1.85rem',
                  fontSize: '0.92rem',
                }}
              >
                <Play size={13} fill="currentColor" />
                <span>START SENSING</span>
              </button>
            ) : (
              <button
                onClick={onNavigateToMonitor}
                className="vantage-btn vantage-btn-outline"
                style={{
                  padding: '0.85rem 1.85rem',
                  fontSize: '0.92rem',
                }}
              >
                <span>INSPECT OPTICAL FEED</span>
                <ArrowRight size={14} className="arrow-slide" />
              </button>
            )}
          </div>

          {/* Hairline Technical Metadata Strip at Bottom of Hero */}
          <div
            style={{
              display: 'flex',
              gap: '2rem',
              marginTop: '3.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border-subtle)',
              maxWidth: '640px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', letterSpacing: '0.1em' }}>
                DETECTION LATENCY
              </span>
              <span className="font-condensed" style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                &lt; 15 MS
              </span>
            </div>

            <div>
              <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', letterSpacing: '0.1em' }}>
                FACIAL BLENDSHAPES
              </span>
              <span className="font-condensed" style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                478 MESH PTS
              </span>
            </div>

            <div>
              <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', letterSpacing: '0.1em' }}>
                LOCAL CLOUD LEAK
              </span>
              <span className="font-condensed" style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-accent-green)' }}>
                0.00% PRIVATE
              </span>
            </div>
          </div>
        </div>

        {/* Architectural Floating Telemetry Overlay (Bottom-Right of Image) */}
        <div
          style={{
            position: 'absolute',
            bottom: '2rem',
            right: 'clamp(1.5rem, 4vw, 3.5rem)',
            zIndex: 3,
            backgroundColor: 'rgba(13, 14, 16, 0.88)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            padding: '1rem 1.4rem',
            color: '#FFFFFF',
            borderRadius: '2px',
            maxWidth: '340px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          }}
          className="desktop-nav"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--color-accent-green)', letterSpacing: '0.1em' }}>
              TELEMETRY BUS // 01
            </span>
            <span
              style={{
                width: '6px',
                height: '6px',
                backgroundColor: isLive ? 'var(--color-accent-green)' : '#888888',
              }}
              className={isLive ? 'telemetry-pulse' : ''}
            />
          </div>
          <div className="font-condensed" style={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '0.04em' }}>
            {isLive ? `${riskScore}% ${riskLevel}` : 'SYSTEM STANDBY'}
          </div>
          <div className="font-mono" style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '0.35rem' }}>
            PnP POSE: P {headPitch.toFixed(1)}° • Y {headYaw.toFixed(1)}° • EAR {ear.toFixed(2)}
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
      {/* SECTION C: REAL-TIME SENSING (DEEP BRITISH RACING GREEN SECTION)       */}
      {/* ===================================================================== */}
      <section
        style={{
          backgroundColor: 'var(--bg-racing-green)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#FFFFFF',
          padding: 'clamp(4rem, 7vw, 6.5rem) clamp(1.25rem, 4vw, 3.5rem)',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem', marginBottom: '3.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--color-accent-green)' }} className="telemetry-pulse" />
                <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--color-accent-green)', letterSpacing: '0.14em' }}>
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
                  margin: 0,
                }}
              >
                REAL-TIME SENSING ARCHITECTURE.
              </h2>
            </div>

            <button
              onClick={onNavigateToMonitor}
              className="vantage-btn vantage-btn-dark"
              style={{ padding: '0.75rem 1.75rem' }}
            >
              <span>OPEN FULL COCKPIT HUD</span>
              <ArrowUpRight size={15} className="arrow-slide" />
            </button>
          </div>

          {/* Deep Green Cockpit Canvas */}
          <div
            style={{
              backgroundColor: 'var(--bg-racing-green-deep)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-card)',
              padding: 'clamp(1.5rem, 3.5vw, 2.75rem)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '3rem',
              alignItems: 'center',
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
                theme="dark"
              />

              <div
                className="font-mono"
                style={{
                  fontSize: '0.74rem',
                  color: 'var(--color-accent-green)',
                  marginTop: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  letterSpacing: '0.08em',
                }}
              >
                <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--color-accent-green)' }} className="telemetry-pulse" />
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

              {/* Technical Ratio Badges */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', width: '100%', maxWidth: '420px' }}>
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '0.85rem 1.1rem',
                    borderRadius: '2px',
                  }}
                >
                  <span className="font-mono" style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.6)', display: 'block' }}>
                    EYE ASPECT (EAR)
                  </span>
                  <span className="font-condensed" style={{ fontSize: '1.6rem', fontWeight: 600 }}>
                    {isLive ? ear.toFixed(2) : '0.33'}
                  </span>
                </div>

                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '0.85rem 1.1rem',
                    borderRadius: '2px',
                  }}
                >
                  <span className="font-mono" style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.6)', display: 'block' }}>
                    MOUTH ASPECT (MAR)
                  </span>
                  <span className="font-condensed" style={{ fontSize: '1.6rem', fontWeight: 600 }}>
                    {isLive ? mar.toFixed(2) : '0.12'}
                  </span>
                </div>

                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '0.85rem 1.1rem',
                    borderRadius: '2px',
                  }}
                >
                  <span className="font-mono" style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.6)', display: 'block' }}>
                    CRANIAL PITCH
                  </span>
                  <span className="font-condensed" style={{ fontSize: '1.6rem', fontWeight: 600 }}>
                    {isLive ? `${headPitch.toFixed(1)}°` : '0.5°'}
                  </span>
                </div>

                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '0.85rem 1.1rem',
                    borderRadius: '2px',
                  }}
                >
                  <span className="font-mono" style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.6)', display: 'block' }}>
                    PERCLOS INDEX
                  </span>
                  <span className="font-condensed" style={{ fontSize: '1.6rem', fontWeight: 600 }}>
                    {isLive ? `${perclos.toFixed(1)}%` : '3.8%'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
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
