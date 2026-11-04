import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Terminal, ShieldAlert, Sparkles, Copy, Check } from 'lucide-react';

/**
 * AlertBanner Component — High-Fashion Minimalist Editorial & Techwear Edition
 * Displays real-time critical driver intervention alerts, caution warnings, or recovery acknowledgments.
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
        className="animate-fade-in"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem 1.45rem',
          border: '1px solid var(--border-light)',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '4px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '2px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Terminal size={14} color="var(--text-primary)" />
          </div>
          <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Optical Engine Standby:</strong> Python MediaPipe pipeline is offline.
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
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-light)',
            borderRadius: '2px',
          }}
        >
          <code
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.74rem',
              color: 'var(--text-primary)',
            }}
          >
            python run_production_bridge.py
          </code>
          {copied ? <Check size={12} color="var(--accent-emerald)" /> : <Copy size={12} color="var(--text-muted)" />}
        </div>
      </div>
    );
  }

  if (isRecovering) {
    return (
      <div
        className="animate-fade-in"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.85rem 1.45rem',
          border: '1px solid var(--color-safe-border)',
          backgroundColor: 'var(--color-safe-dim)',
          borderRadius: '4px',
          marginBottom: '1.5rem',
          color: 'var(--accent-emerald)',
        }}
      >
        <CheckCircle size={16} />
        <span style={{ fontSize: '0.84rem', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
          VIGILANCE RESTORED — NOMINAL PALPEBRAL APERTURE &amp; ATTENTIVENESS CONFIRMED
        </span>
      </div>
    );
  }

  const isAlert = alertState === 'CRITICAL';
  const isWarn = alertState === 'WARNING';

  if (!isAlert && !isWarn) return null;

  return (
    <div
      className="animate-fade-in"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.95rem 1.45rem',
        border: `1px solid ${isAlert ? 'var(--color-alert-border)' : 'var(--color-warning-border)'}`,
        backgroundColor: isAlert ? 'var(--color-alert-dim)' : 'var(--color-warning-dim)',
        color: isAlert ? 'var(--accent-crimson)' : 'var(--accent-amber)',
        borderRadius: '4px',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {isAlert ? <AlertCircle size={18} /> : <AlertTriangle size={18} />}
        <div>
          <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
            {isAlert ? 'CRITICAL SAFETY INTERVENTION' : 'ATTENTION REQUIRED'}
          </span>
          <span style={{ fontSize: '0.86rem', fontWeight: 500 }}>
            {message || (isAlert ? 'Prolonged eye closure detected. Take immediate rest.' : 'Driver fatigue or gaze deviation detected.')}
          </span>
        </div>
      </div>

      <div className="techwear-tag" style={{ borderColor: isAlert ? 'var(--accent-crimson)' : 'var(--accent-amber)', color: isAlert ? 'var(--accent-crimson)' : 'var(--accent-amber)', backgroundColor: 'transparent' }}>
        {riskReason}
      </div>
    </div>
  );
}
