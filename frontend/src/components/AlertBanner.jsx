import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Terminal, ShieldAlert, Sparkles, Copy, Check } from 'lucide-react';

/**
 * AlertBanner Component
 * SSTR-Inspired Industrial Safety & Hardware State Banner
 * Primary Reference: SSTR (https://sstr.tech/en/)
 */
export default function AlertBanner({
  alertState = 'NOMINAL',
  riskReason = 'NONE',
  message = '',
  isEngineConnected = false,
  isMonitoring = true,
  isRecovering = false,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (cmd) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(cmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isEngineConnected) {
    return (
      <div
        className="animate-sstr-fade-in"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem 1.45rem',
          border: '1px solid rgba(254, 91, 42, 0.35)',
          backgroundColor: '#141518',
          borderRadius: '6px',
          boxShadow: '0 4px 18px rgba(0, 0, 0, 0.4)',
          marginBottom: '1.75rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '4px',
              backgroundColor: '#1E2024',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Terminal size={14} color="#FE5B2A" />
          </div>
          <span style={{ fontSize: '0.86rem', color: '#9FA4B0', fontFamily: 'var(--font-sans)' }}>
            <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>Optical Engine Standby:</strong> Python computer vision server is offline.
          </span>
        </div>
        <div
          onClick={() => handleCopy('python run_production_bridge.py')}
          title="Click to copy command"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            cursor: 'pointer',
            padding: '0.35rem 0.85rem',
            backgroundColor: '#0D0E10',
            border: '1px solid rgba(254, 91, 42, 0.3)',
            borderRadius: '4px',
          }}
        >
          <code
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.76rem',
              color: '#FFFFFF',
            }}
          >
            python run_production_bridge.py
          </code>
          {copied ? <Check size={12} color="#10B981" /> : <Copy size={12} color="#5F6470" />}
        </div>
      </div>
    );
  }

  // Monitoring is explicitly stopped / paused
  if (isEngineConnected && !isMonitoring) {
    return (
      <div
        className="animate-sstr-fade-in"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem 1.45rem',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          backgroundColor: '#141518',
          borderRadius: '6px',
          boxShadow: '0 4px 18px rgba(0, 0, 0, 0.4)',
          marginBottom: '1.75rem',
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
              backgroundColor: '#EF4444',
              display: 'inline-block',
            }}
          />
          <span style={{ fontSize: '0.86rem', color: '#9FA4B0', fontFamily: 'var(--font-sans)' }}>
            <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>Optical Monitoring Paused:</strong> Real-time camera feed and risk scoring are halted. Driver privacy preserved.
          </span>
        </div>
        <span
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            color: '#EF4444',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            padding: '0.2rem 0.65rem',
            borderRadius: '4px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            fontWeight: 700,
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
        className="animate-scale-up"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1.15rem 1.6rem',
          border: '1.5px solid #EF4444',
          backgroundColor: '#1E1416',
          borderRadius: '6px',
          boxShadow: '0 8px 30px rgba(239, 68, 68, 0.25)',
          marginBottom: '1.75rem',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '4px',
            backgroundColor: '#EF4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 0 16px rgba(239, 68, 68, 0.6)',
          }}
        >
          <AlertCircle size={20} color="#FFFFFF" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.74rem',
              color: '#EF4444',
              fontWeight: 700,
              letterSpacing: '0.12em',
            }}
          >
            {getAlertTitle()}
          </span>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.94rem', color: '#FFFFFF', fontWeight: 600 }}>
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
        className="animate-sstr-slide-up"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem 1.5rem',
          border: '1.5px solid #FE5B2A',
          backgroundColor: '#1E1815',
          borderRadius: '6px',
          boxShadow: '0 6px 24px rgba(254, 91, 42, 0.2)',
          marginBottom: '1.75rem',
        }}
      >
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '4px',
            backgroundColor: '#FE5B2A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 0 14px rgba(254, 91, 42, 0.5)',
          }}
        >
          <AlertTriangle size={18} color="#FFFFFF" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.74rem',
              color: '#FE5B2A',
              fontWeight: 700,
              letterSpacing: '0.1em',
            }}
          >
            {getAlertTitle()}
          </span>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#FFFFFF', fontWeight: 500 }}>
            {message || getFallbackMessage()}
          </span>
        </div>
      </div>
    );
  }

  // 3. RECOVERY CONFIRMATION (Brief Ephemeral Green Banner)
  if (isRecovering) {
    return (
      <div
        className="animate-sstr-fade-in"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '0.9rem 1.45rem',
          border: '1.5px solid #10B981',
          backgroundColor: '#121E19',
          borderRadius: '6px',
          boxShadow: '0 4px 18px rgba(16, 185, 129, 0.15)',
          marginBottom: '1.75rem',
        }}
      >
        <div
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '4px',
            backgroundColor: '#10B981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 0 12px rgba(16, 185, 129, 0.5)',
          }}
        >
          <CheckCircle size={16} color="#FFFFFF" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: '#10B981',
              fontWeight: 700,
              letterSpacing: '0.1em',
            }}
          >
            ATTENTIVENESS RECOVERED // FORWARD GAZE RESTORED
          </span>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.86rem', color: '#FFFFFF' }}>
            Driver attention returned within nominal operating envelope. Safety counter reset.
          </span>
        </div>
      </div>
    );
  }

  // 4. NOMINAL / STEADY STATE (Understated Subtle Indicator)
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1.4rem',
        backgroundColor: '#141518',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '6px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.4)',
        marginBottom: '1.75rem',
        flexWrap: 'wrap',
        gap: '0.65rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <span
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: '#10B981',
          }}
          className="telemetry-pulse"
        />
        <span style={{ fontSize: '0.84rem', color: '#9FA4B0', fontFamily: 'var(--font-sans)' }}>
          <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>Optimal Posture:</strong> Driver attentiveness and ocular tracking are within nominal parameters.
        </span>
      </div>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.68rem',
          color: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          padding: '0.2rem 0.65rem',
          borderRadius: '4px',
          fontWeight: 600,
          letterSpacing: '0.06em',
        }}
      >
        STATE 01 // NOMINAL
      </span>
    </div>
  );
}