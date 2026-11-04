import React, { useState, useEffect } from 'react';
import {
  X,
  Activity,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Camera,
  Server,
  Radio,
  Video,
  Copy,
  Check,
  Terminal,
} from 'lucide-react';
import {
  getApiBaseUrl,
  getWsBaseUrl,
  getVideoFeedUrl,
  setCustomBackendUrl,
  getCustomBackendUrl,
  testBackendConnection,
} from '../config/api';

/**
 * BackendDiagnosticsModal Component — High-Fashion Minimalist Editorial Edition
 * Cloudflare Tunnel & Python Optical Pipeline Diagnostics
 */
export default function BackendDiagnosticsModal({
  isOpen,
  onClose,
  connectionStatus = 'offline',
  fps = 0,
}) {
  const [currentUrl, setCurrentUrl] = useState(() => getApiBaseUrl());
  const [inputUrl, setInputUrl] = useState(() => getCustomBackendUrl() || getApiBaseUrl());
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const active = getApiBaseUrl();
      setCurrentUrl(active);
      setInputUrl(getCustomBackendUrl() || active);
      runHealthCheck(active);
    }
  }, [isOpen]);

  const runHealthCheck = async (target) => {
    setIsTesting(true);
    setTestResult(null);
    const start = performance.now();
    const res = await testBackendConnection(target);
    const latency = Math.round(performance.now() - start);
    setIsTesting(false);
    setTestResult({ ...res, latency });
  };

  const handleSaveUrl = () => {
    const cleaned = setCustomBackendUrl(inputUrl);
    const active = getApiBaseUrl();
    setCurrentUrl(active);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
    runHealthCheck(active);
  };

  const handleResetDefault = () => {
    setCustomBackendUrl(null);
    const active = getApiBaseUrl();
    setCurrentUrl(active);
    setInputUrl(active);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
    runHealthCheck(active);
  };

  const handleCopyCommand = () => {
    navigator.clipboard.writeText('python run_production_bridge.py');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  const isWsOnline = connectionStatus === 'online';
  const isApiOnline = testResult?.ok === true;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(17, 17, 17, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '4px',
          border: '1px solid var(--border-light)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-secondary)',
          }}
        >
          <div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                color: 'var(--text-secondary)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: 700,
              }}
            >
              SYSTEM BRIDGE // HARDWARE TELEMETRY DIAGNOSTICS
            </span>
            <h3
              style={{
                margin: '0.2rem 0 0 0',
                fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
                fontSize: '1.3rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              Backend &amp; Tunnel Pipeline Status
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              color: 'var(--text-secondary)',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.75rem', overflowY: 'auto' }}>
          {/* Quick Status Banner */}
          <div
            style={{
              padding: '1rem 1.25rem',
              borderRadius: '2px',
              backgroundColor: isWsOnline && isApiOnline ? 'var(--color-safe-dim)' : 'var(--bg-secondary)',
              border: `1px solid ${isWsOnline && isApiOnline ? 'var(--color-safe-border)' : 'var(--border-light)'}`,
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.85rem',
            }}
          >
            {isWsOnline && isApiOnline ? (
              <CheckCircle2 size={20} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
            ) : (
              <AlertCircle size={20} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
            )}
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  color: isWsOnline && isApiOnline ? 'var(--accent-emerald)' : 'var(--text-primary)',
                }}
              >
                {isWsOnline && isApiOnline
                  ? 'All Optical & AI Telemetry Channels Active'
                  : 'Python AI Engine or Tunnel Disconnected'}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                  marginTop: '0.2rem',
                  lineHeight: 1.45,
                }}
              >
                {isWsOnline && isApiOnline
                  ? `Your deployment is connected to the Python backend with live telemetry and ${fps} FPS.`
                  : 'Your website cannot reach the local Python engine. Start the local bridge or provide the Cloudflare Tunnel URL below.'}
              </div>
            </div>
          </div>

          {/* 1-Click Launch Command */}
          <div
            style={{
              padding: '1.15rem 1.35rem',
              borderRadius: '2px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-light)',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                STEP 1: RUN TUNNEL BRIDGE ON LAPTOP
              </span>
              <button
                onClick={handleCopyCommand}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                }}
              >
                {copied ? <Check size={12} color="var(--accent-emerald)" /> : <Copy size={12} />}
                <span>{copied ? 'COPIED' : 'COPY COMMAND'}</span>
              </button>
            </div>
            <code
              style={{
                display: 'block',
                padding: '0.65rem 0.85rem',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-light)',
                borderRadius: '2px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                color: 'var(--text-primary)',
              }}
            >
              python run_production_bridge.py
            </code>
          </div>

          {/* Custom URL Input */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                color: 'var(--text-secondary)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '0.45rem',
              }}
            >
              STEP 2: PUBLIC CLOUDFLARE TUNNEL URL
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://xxxx.trycloudflare.com"
                style={{
                  flex: 1,
                  padding: '0.6rem 0.85rem',
                  borderRadius: '2px',
                  border: '1px solid var(--border-light)',
                  backgroundColor: 'var(--bg-surface)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
              />
              <button
                onClick={handleSaveUrl}
                className="btn-editorial"
                style={{ padding: '0.55rem 1rem' }}
              >
                {saveSuccess ? 'SAVED' : 'SAVE & CONNECT'}
              </button>
            </div>
          </div>

          {/* Test Health Result */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={() => runHealthCheck(currentUrl)}
              disabled={isTesting}
              className="btn-editorial-outline"
              style={{ fontSize: '0.72rem', padding: '0.45rem 0.85rem' }}
            >
              <RefreshCw size={12} className={isTesting ? 'animate-pulse-live' : ''} />
              <span>{isTesting ? 'TESTING...' : 'TEST CONNECTION'}</span>
            </button>

            {testResult && (
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: testResult.ok ? 'var(--accent-emerald)' : 'var(--accent-crimson)',
                }}
              >
                {testResult.ok ? `CONNECTED (${testResult.latency}ms)` : `FAILED (${testResult.error || 'UNREACHABLE'})`}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
