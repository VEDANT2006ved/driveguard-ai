import React from 'react';
import DriverIllustration from '../components/DriverIllustration';
import RiskGauge from '../components/RiskGauge';
import AlertBanner from '../components/AlertBanner';
import { Play, ArrowRight, Camera, Sliders, ShieldCheck, Eye, Compass, Activity, Sparkles } from 'lucide-react';

/**
 * OverviewView Component (Wispr Flow Complete Redesign)
 * Features warm pale cream hero typography, deep emerald feature contrast section,
 * multi-color Wispr-style rounded cards, and prominent telemetry action points.
 */
export default function OverviewView({
  telemetryData,
  isEngineConnected,
  onNavigateToMonitor,
  onToggleSimMode,
  isSimMode,
  isMonitoring = true,
  onStartMonitoring,
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
    blinkRate = 18,
    perclos = 3.8,
    alertMessage = '',
  } = telemetryData || {};

  const isLive = isSimMode || (isEngineConnected && isMonitoring);

  return (
    <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
      {/* Editorial Safety Alert Banner */}
      <AlertBanner
        alertState={riskLevel}
        riskReason={riskReason}
        message={alertMessage}
        isEngineConnected={isEngineConnected || isSimMode}
        isMonitoring={isMonitoring}
        isRecovering={isRecovering}
      />

      {/* Hero Section: Warm Buttery Cream with Oversized Editorial Typography */}
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: 'clamp(1rem, 3vw, 2.5rem) 0 clamp(2rem, 4vw, 3.5rem)',
          position: 'relative',
        }}
      >
        {/* Decorative Floating Orbit Swirl (Inspired by Wispr Flow's looping typography) */}
        <div
          className="animate-orbit"
          style={{
            position: 'absolute',
            top: '-20px',
            right: 'clamp(5%, 15vw, 20%)',
            width: '120px',
            height: '120px',
            pointerEvents: 'none',
            opacity: 0.28,
          }}
        >
          <svg viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="46" stroke="#7C3AED" strokeWidth="1" strokeDasharray="4 6" />
            <circle cx="96" cy="50" r="3" fill="#7C3AED" />
          </svg>
        </div>

        {/* Small Capsule Pill Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.95rem',
            borderRadius: '9999px',
            backgroundColor: 'var(--bg-surface-warm)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '1.75rem',
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: isLive ? '#10B981' : '#9E988F',
            }}
            className={isLive ? 'animate-pulse-live' : ''}
          />
          <span
            className="label-editorial"
            style={{ fontSize: '0.68rem', color: 'var(--text-primary)', fontWeight: 600 }}
          >
            DRIVEGUARD AI // NEURAL VEHICLE SAFETY
          </span>
        </div>

        {/* Giant Editorial Headline */}
        <h1
          style={{
            maxWidth: '960px',
            lineHeight: 0.96,
            marginBottom: '1.75rem',
            letterSpacing: '-0.02em',
          }}
        >
          <span
            className="font-serif"
            style={{
              fontSize: 'clamp(3.8rem, 8.5vw, 7.2rem)',
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
              fontSize: 'clamp(3.6rem, 8.2vw, 7rem)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              color: 'var(--text-primary)',
              display: 'inline-block',
            }}
          >
            stay focused.
          </span>
        </h1>

        {/* Subhead in Clean Sans-Serif */}
        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.22rem)',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            maxWidth: '620px',
            marginBottom: '2.5rem',
            fontFamily: 'var(--font-sans)',
            fontWeight: 400,
          }}
        >
          The real-time computer vision system that translates 478 high-frequency facial coordinates
          into microsecond fatigue prevention, gaze tracking, and audit-grade fleet compliance.
        </p>

        {/* Action Buttons: Wispr Lavender Pill + Ghost Outline Pill */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', justifyContent: 'center', alignItems: 'center' }}>
          {!isMonitoring && onStartMonitoring ? (
            <button
              onClick={onStartMonitoring}
              className="pill-btn pill-btn-lavender"
              style={{
                padding: '0.85rem 2rem',
                fontSize: '0.94rem',
              }}
            >
              <Play size={15} fill="#22103E" />
              <span>Start Live Monitoring</span>
            </button>
          ) : (
            <button
              onClick={onNavigateToMonitor}
              className="pill-btn pill-btn-lavender"
              style={{
                padding: '0.85rem 2rem',
                fontSize: '0.94rem',
              }}
            >
              <Camera size={15} />
              <span>Enter Cockpit HUD</span>
            </button>
          )}

          <button
            onClick={onNavigateToMonitor}
            className="pill-btn pill-btn-ghost"
            style={{
              padding: '0.85rem 1.75rem',
              fontSize: '0.94rem',
            }}
          >
            <span>View Optical Stream</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Supporting Architecture Tagline */}
        <span
          className="font-mono"
          style={{
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            marginTop: '1.75rem',
          }}
        >
          Local MediaPipe & OpenCV pipeline • Zero cloud latency • Runs on standard USB & laptop webcams
        </span>
      </section>

      {/* Deep Emerald Feature Contrast Section (Wispr Flow "4x faster than typing" Inspiration) */}
      <section
        style={{
          backgroundColor: 'var(--bg-emerald)',
          borderRadius: 'var(--radius-card-xl)',
          padding: 'clamp(2.5rem, 5vw, 4.5rem) clamp(1.5rem, 4vw, 3.5rem)',
          color: 'var(--text-on-dark)',
          border: '1px solid var(--border-emerald)',
          boxShadow: '0 20px 60px rgba(17, 53, 39, 0.22)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle Ambient Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            left: '30%',
            width: '360px',
            height: '360px',
            borderRadius: '50%',
            backgroundColor: 'rgba(110, 231, 183, 0.08)',
            filter: 'blur(80px)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {/* Section Headline */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <span
              className="label-editorial"
              style={{ color: 'var(--color-mint)', letterSpacing: '0.14em', marginBottom: '0.75rem' }}
            >
              INTELLIGENT OCCUPANT TELEMETRY
            </span>
            <h2
              style={{
                lineHeight: 1.05,
                maxWidth: '780px',
              }}
            >
              <span
                className="font-serif"
                style={{
                  fontSize: 'clamp(2.8rem, 5.5vw, 4.6rem)',
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
                  fontSize: 'clamp(2.8rem, 5.5vw, 4.6rem)',
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
                color: 'var(--text-on-dark-muted)',
                maxWidth: '560px',
                marginTop: '1rem',
                lineHeight: 1.6,
              }}
            >
              DriveGuard continuously monitors eyelid aperture velocity and 3D head pose orientation.
              Natural blinks pass through uninterrupted; micro-sleeps and downward glances are flagged immediately.
            </p>
          </div>

          {/* Interactive Cockpit Demonstration Canvas */}
          <div
            style={{
              backgroundColor: 'var(--bg-emerald-deep)',
              border: '1px solid var(--border-emerald)',
              borderRadius: '26px',
              padding: 'clamp(1.5rem, 3vw, 2.5rem)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center',
              boxShadow: 'inset 0 2px 12px rgba(0,0,0,0.2)',
            }}
          >
            {/* Left: Driver Artwork */}
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
                size={280}
                animated={true}
                theme="dark"
              />
              <span
                className="font-mono"
                style={{
                  fontSize: '0.74rem',
                  color: 'var(--color-mint)',
                  marginTop: '1rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-mint)' }} />
                <span>ACTIVE HUD TRACKING: {isLive ? `${blinkRate} BLINKS/MIN` : 'CALIBRATED'}</span>
              </span>
            </div>

            {/* Right: Real-Time Risk Instrument & Live Biometric Pills */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.75rem' }}>
              <RiskGauge
                score={isLive ? riskScore : 0}
                level={isLive ? riskLevel : 'STANDBY'}
                isLive={isLive}
                size={200}
              />

              {/* Floating Biometric Capsules */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', justifyContent: 'center' }}>
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid var(--border-emerald)',
                    borderRadius: '9999px',
                    padding: '0.4rem 0.95rem',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-mono)',
                    color: '#FAF8F2',
                  }}
                >
                  <span style={{ color: 'var(--color-mint)', marginRight: '0.35rem' }}>EAR:</span>
                  <span>{isLive ? ear.toFixed(2) : '0.33'}</span>
                </div>

                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid var(--border-emerald)',
                    borderRadius: '9999px',
                    padding: '0.4rem 0.95rem',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-mono)',
                    color: '#FAF8F2',
                  }}
                >
                  <span style={{ color: 'var(--color-mint)', marginRight: '0.35rem' }}>MAR:</span>
                  <span>{isLive ? mar.toFixed(2) : '0.12'}</span>
                </div>

                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid var(--border-emerald)',
                    borderRadius: '9999px',
                    padding: '0.4rem 0.95rem',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-mono)',
                    color: '#FAF8F2',
                  }}
                >
                  <span style={{ color: 'var(--color-mint)', marginRight: '0.35rem' }}>PITCH:</span>
                  <span>{isLive ? `${headPitch.toFixed(1)}°` : '0.5°'}</span>
                </div>

                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid var(--border-emerald)',
                    borderRadius: '9999px',
                    padding: '0.4rem 0.95rem',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-mono)',
                    color: '#FAF8F2',
                  }}
                >
                  <span style={{ color: 'var(--color-mint)', marginRight: '0.35rem' }}>PERCLOS:</span>
                  <span>{isLive ? `${perclos.toFixed(1)}%` : '3.8%'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wispr Flow Multi-Color Rounded Card Bento Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="label-editorial" style={{ color: 'var(--color-purple)' }}>
              CORE SAFETY ARCHITECTURE
            </span>
            <h3
              className="font-display"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginTop: '0.25rem',
                letterSpacing: '-0.03em',
              }}
            >
              Precision telemetry, zero guesswork.
            </h3>
          </div>
          <button
            onClick={onToggleSimMode}
            className="pill-btn pill-btn-ghost"
            style={{ fontSize: '0.8rem', padding: '0.45rem 1rem' }}
          >
            <Sliders size={13} />
            <span>{isSimMode ? 'Exit Test Harness' : 'Open Test Harness'}</span>
          </button>
        </div>

        {/* 3 Distinct Wispr-Style Rounded Cards (Lavender, Crisp White, Soft Mint) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {/* Card 1: Lavender Card (Ocular & Fatigue) */}
          <div
            style={{
              backgroundColor: 'var(--bg-lavender-card)',
              border: '1px solid var(--color-lavender-border)',
              borderRadius: 'var(--radius-card)',
              padding: '2.25rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '280px',
              boxShadow: '0 6px 24px rgba(124, 58, 237, 0.05)',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span className="label-editorial" style={{ color: 'var(--color-purple)', fontWeight: 700 }}>
                  01 // OCULAR TELEMETRY
                </span>
                <Eye size={18} color="var(--color-purple)" />
              </div>
              <h4
                className="font-display"
                style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--color-lavender-ink)', lineHeight: 1.25, marginBottom: '0.75rem' }}
              >
                Prolonged Lid Closure & Micro-Sleep
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#4B3F63', lineHeight: 1.55 }}>
                Neural blendshapes separate natural 120ms blinks from true sleep closure. Warnings trigger at 1.0s; critical stop alerts at 1.8s.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(124, 58, 237, 0.15)' }}>
              <div>
                <span className="font-serif" style={{ fontSize: '2rem', fontStyle: 'italic', color: 'var(--color-lavender-ink)' }}>1.0s</span>
                <span style={{ display: 'block', fontSize: '0.72rem', color: '#6B5E85', fontFamily: 'var(--font-mono)' }}>WARN THRESHOLD</span>
              </div>
              <div>
                <span className="font-serif" style={{ fontSize: '2rem', fontStyle: 'italic', color: 'var(--color-alert)' }}>1.8s</span>
                <span style={{ display: 'block', fontSize: '0.72rem', color: '#6B5E85', fontFamily: 'var(--font-mono)' }}>CRITICAL STOP</span>
              </div>
            </div>
          </div>

          {/* Card 2: Crisp White Card (Head-Down & Lateral Distraction) */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-card)',
              padding: '2.25rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '280px',
              boxShadow: '0 6px 24px rgba(23, 23, 23, 0.04)',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span className="label-editorial" style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>
                  02 // 3D HEAD POSE
                </span>
                <Compass size={18} color="var(--text-primary)" />
              </div>
              <h4
                className="font-display"
                style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.25, marginBottom: '0.75rem' }}
              >
                Distraction Separated from Drowsiness
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                Perspective-n-Point facial geometry isolates phone and dashboard reading (-16° pitch) from eye closure, eliminating false sleep alarms.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
              <div>
                <span className="font-serif" style={{ fontSize: '2rem', fontStyle: 'italic', color: 'var(--text-primary)' }}>&lt; -16°</span>
                <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>PITCH DOWN</span>
              </div>
              <div>
                <span className="font-serif" style={{ fontSize: '2rem', fontStyle: 'italic', color: 'var(--text-primary)' }}>&gt; 24°</span>
                <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>LATERAL YAW</span>
              </div>
            </div>
          </div>

          {/* Card 3: Soft Mint Card (Audit-Grade SQLite Ledger) */}
          <div
            style={{
              backgroundColor: 'var(--bg-emerald-light)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: 'var(--radius-card)',
              padding: '2.25rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '280px',
              boxShadow: '0 6px 24px rgba(16, 185, 129, 0.06)',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span className="label-editorial" style={{ color: 'var(--color-emerald-ink)', fontWeight: 700 }}>
                  03 // AUDIT COMPLIANCE
                </span>
                <ShieldCheck size={18} color="var(--color-safe)" />
              </div>
              <h4
                className="font-display"
                style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--color-emerald-ink)', lineHeight: 1.25, marginBottom: '0.75rem' }}
              >
                Local SQLite Session Vault
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#1B4D3E', lineHeight: 1.55 }}>
                Deterministic trip scoring committed on Stop. Logs authentic incidents with microsecond timestamps and biometrics. Zero fabricated miles.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div>
                <span className="font-serif" style={{ fontSize: '2rem', fontStyle: 'italic', color: 'var(--color-safe)' }}>100%</span>
                <span style={{ display: 'block', fontSize: '0.72rem', color: '#2D6A53', fontFamily: 'var(--font-mono)' }}>TAMPER-EVIDENT</span>
              </div>
              <div>
                <span className="font-serif" style={{ fontSize: '2rem', fontStyle: 'italic', color: 'var(--color-safe)' }}>5.0s</span>
                <span style={{ display: 'block', fontSize: '0.72rem', color: '#2D6A53', fontFamily: 'var(--font-mono)' }}>MIN SESSION GATE</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
