import React from 'react';
import { AlertTriangle, ShieldCheck, AlertOctagon, Info } from 'lucide-react';

/**
 * AlertBanner — clean status banner for safety incidents.
 * Shows contextual color and icon based on risk level.
 */
export default function AlertBanner({
  alertMessage,
  riskLevel,
  riskReason,
  isRecovering,
  alertState,
  message,
  isEngineConnected,
  isMonitoring,
}) {
  // Support both prop name styles
  const level = riskLevel || alertState;
  const msg = alertMessage || message;

  // Don't show if no alert active
  if (!level || level === 'NOMINAL' || !msg) {
    if (isRecovering) {
      return (
        <div
          className="animate-fade-in"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.875rem 1rem',
            backgroundColor: 'var(--color-safe-bg)',
            border: '1px solid var(--color-safe-border)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            color: 'var(--color-safe)',
          }}
        >
          <ShieldCheck size={16} strokeWidth={2} />
          <span style={{ fontWeight: 500 }}>Alert resolved — Driver attention restored</span>
        </div>
      );
    }
    return null;
  }

  const isCritical = level === 'CRITICAL';
  const isWarning  = level === 'WARNING';

  const styles = isCritical
    ? { bg: 'var(--color-critical-bg)', border: 'var(--color-critical-border)', color: 'var(--color-critical)' }
    : { bg: 'var(--color-warning-bg)',  border: 'var(--color-warning-border)',  color: 'var(--color-warning)' };

  const Icon = isCritical ? AlertOctagon : AlertTriangle;

  // Human-readable label for reason codes
  const reasonLabel = {
    'DROWSINESS_EYE_CLOSURE': 'Eye closure detected',
    'DROWSINESS_YAWN':        'Yawning detected',
    'HEAD_DOWN_DISTRACTION':  'Head down — not watching road',
    'HEAD_LATERAL':           'Head turned sideways',
    'BLINK_RATE_HIGH':        'High blink rate',
  }[riskReason] || riskReason;

  // Simplify message — strip ALL_CAPS: prefixes
  const cleanMsg = msg
    .replace(/^(CRITICAL|WARNING|DROWSINESS|DISTRACTION):\s*/i, '')
    .replace(/\(.*?\)/g, '')
    .trim();

  return (
    <div
      className="animate-fade-in"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        padding: '0.875rem 1rem',
        backgroundColor: styles.bg,
        border: `1px solid ${styles.border}`,
        borderRadius: 'var(--radius-md)',
      }}
    >
      <Icon size={16} style={{ color: styles.color, flexShrink: 0, marginTop: '1px' }} strokeWidth={2.5} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: styles.color }}>
          {isCritical ? 'Critical Alert' : 'Warning'}
        </div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
          {cleanMsg || reasonLabel}
        </div>
      </div>
      {isCritical && (
        <span className="badge badge-critical" style={{ flexShrink: 0 }}>
          Immediate Action Required
        </span>
      )}
    </div>
  );
}
