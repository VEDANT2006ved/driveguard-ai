import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Terminal, ShieldAlert, Sparkles } from 'lucide-react';

/**
 * AlertBanner Component (Wispr Flow Refined Automotive Safety Banners)
 * Prominently surfaces Critical, Warning, and Recovery states with high visual urgency
 * while maintaining the product's warm cream and rounded card visual language.
 */
export default function AlertBanner({
  alertState = 'NOMINAL',
  riskReason = 'NONE',
  message = '',
  isEngineConnected = false,
  isMonitoring = true,
  isRecovering = false,
}) {
  if (!isEngineConnected) {
    return (
      <div
        className="animate-fade-in"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem 1.45rem',
          border: '1px solid var(--border-subtle)',
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          boxShadow: '0 4px 18px rgba(23, 23, 23, 0.03)',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '9999px',
              backgroundColor: 'var(--bg-surface-warm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Terminal size={14} color="var(--text-secondary)" />
          </div>
          <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Optical Engine Standby:</strong> Python computer vision server is offline.
          </span>
        </div>
        <code
          className="font-mono"
          style={{
            fontSize: '0.75rem',
            padding: '0.3rem 0.75rem',
            backgroundColor: 'var(--bg-canvas-subtle)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '9999px',
            color: 'var(--text-primary)',
          }}
        >
          python backend/server.py
        </code>
      </div>
    );
  }

  // Monitoring is explicitly stopped / paused
  if (isEngineConnected && !isMonitoring) {
    return (
      <div
        className="animate-fade-in"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem 1.45rem',
          border: '1px solid var(--border-subtle)',
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          boxShadow: '0 4px 18px rgba(23, 23, 23, 0.03)',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-alert)',
              display: 'inline-block',
            }}
          />
          <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Optical Monitoring Paused:</strong> Real-time camera feed and risk scoring are halted. Driver privacy preserved.
          </span>
        </div>
        <span
          className="label-num"
          style={{
            backgroundColor: 'var(--color-alert-dim)',
            color: 'var(--color-alert)',
            padding: '0.2rem 0.65rem',
            borderRadius: '9999px',
            fontWeight: 600,
          }}
        >
          PAUSED
        </span>
      </div>
    );
  }

  const getAlertTitle = () => {
    if (riskReason === 'HEAD_DOWN_DISTRACTION' || message.includes('HEAD DIRECTED DOWNWARD')) {
      return 'DRIVER DISTRACTION // HEAD DIRECTED DOWNWARD';
    }
    if (riskReason === 'LATERAL_DISTRACTION' || message.includes('HEAD TURNED ASIDE')) {
      return 'DRIVER DISTRACTION // HEAD TURNED LATERALLY';
    }
    if (riskReason === 'HEAD_UP_DISTRACTION' || message.includes('HEAD DIRECTED UPWARD')) {
      return 'DRIVER DISTRACTION // HEAD DIRECTED UPWARD';
    }
    if (riskReason === 'DROWSINESS_EYE_CLOSURE' || message.includes('EYE CLOSURE') || message.includes('MICRO-SLEEP')) {
      return alertState === 'CRITICAL' ? 'CRITICAL DROWSINESS // PROLONGED EYE CLOSURE' : 'ELEVATED FATIGUE // EYE CLOSURE WARNING';
    }
    if (riskReason === 'DROWSINESS_YAWN' || message.includes('YAWN')) {
      return 'ELEVATED FATIGUE // SUSTAINED YAWNING DETECTED';
    }
    if (alertState === 'CRITICAL') {
      return 'CRITICAL SAFETY INTERVENTION REQUIRED';
    }
    return 'ELEVATED ATTENTION ADVISORY';
  };

  const getFallbackMessage = () => {
    if (riskReason === 'HEAD_DOWN_DISTRACTION') {
      return 'Head orientation pitched downward toward interior. Return attention to forward driving trajectory.';
    }
    if (riskReason === 'LATERAL_DISTRACTION') {
      return 'Head turned away from forward roadway. Refocus on traffic path.';
    }
    if (riskReason === 'DROWSINESS_EYE_CLOSURE') {
      return 'Prolonged palpebral aperture closure detected. Micro-sleep hazard.';
    }
    if (riskReason === 'DROWSINESS_YAWN') {
      return 'Sustained mouth aperture indicates fatigue onset.';
    }
    return alertState === 'CRITICAL'
      ? 'Critical safety threshold excursion detected.'
      : 'Attention advisory: maintain alert posture and eyes on the road.';
  };

  // 1. CRITICAL ALERT (High Urgency)
  if (alertState === 'CRITICAL') {
    return (
      <div
        className="alert-red-pulse animate-scale-up"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1.15rem 1.6rem',
          border: '2px solid var(--color-alert)',
          backgroundColor: '#FFF1F2',
          borderRadius: '24px',
          boxShadow: '0 8px 30px rgba(225, 29, 72, 0.18)',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '9999px',
            backgroundColor: 'var(--color-alert)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 14px rgba(225, 29, 72, 0.3)',
          }}
        >
          <AlertCircle size={22} color="#FFFFFF" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <span
            className="label-editorial"
            style={{ color: 'var(--color-alert)', fontWeight: 800, letterSpacing: '0.14em' }}
          >
            {getAlertTitle()}
          </span>
          <span style={{ fontSize: '0.94rem', color: '#881337', fontWeight: 600 }}>
            {message || getFallbackMessage()}
          </span>
        </div>
      </div>
    );
  }

  // 2. WARNING ALERT (Caution)
  if (alertState === 'WARNING') {
    return (
      <div
        className="animate-fade-up"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem 1.5rem',
          border: '1.5px solid var(--color-warning)',
          backgroundColor: '#FFFBEB',
          borderRadius: '22px',
          boxShadow: '0 6px 24px rgba(217, 119, 6, 0.1)',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '9999px',
            backgroundColor: 'var(--color-warning)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <AlertTriangle size={18} color="#FFFFFF" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
          <span
            className="label-editorial"
            style={{ color: '#B45309', fontWeight: 700 }}
          >
            {getAlertTitle()}
          </span>
          <span style={{ fontSize: '0.9rem', color: '#78350F', fontWeight: 500 }}>
            {message || getFallbackMessage()}
          </span>
        </div>
      </div>
    );
  }

  // 3. POSTURE RESTORATION / RECOVERY ACKNOWLEDGMENT
  if (isRecovering && alertState === 'NOMINAL') {
    return (
      <div
        className="animate-fade-up"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '0.9rem 1.45rem',
          border: '1.5px solid var(--color-safe)',
          backgroundColor: '#ECFDF5',
          borderRadius: '22px',
          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.1)',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '9999px',
            backgroundColor: 'var(--color-safe)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <CheckCircle size={18} color="#FFFFFF" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="label-editorial" style={{ color: 'var(--color-safe)', fontWeight: 700 }}>
            SAFETY RECOVERY // POSTURE RESTORED
          </span>
          <span style={{ fontSize: '0.88rem', color: '#065F46', fontWeight: 500 }}>
            Driver attention returned to forward trajectory. Biometrics nominal.
          </span>
        </div>
      </div>
    );
  }

  // 4. NOMINAL STATUS
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1.35rem',
        border: '1px solid var(--border-subtle)',
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        boxShadow: '0 2px 12px rgba(23, 23, 23, 0.02)',
        marginBottom: '2rem',
      }}
    >
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-safe)',
        }}
        className="animate-pulse-live"
      />
      <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
        <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Nominal Attentiveness:</strong> Driver head posture aligned with roadway. Eyes open and tracking forward trajectory.
      </span>
    </div>
  );
}
