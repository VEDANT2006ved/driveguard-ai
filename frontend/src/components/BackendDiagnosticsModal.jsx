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
 * BackendDiagnosticsModal Component
 * SSTR Industrial Telemetry & Cloudflare Tunnel Diagnostics
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
  const isCameraActive = testResult?.data?.camera_active === true;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(12px)',
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
          backgroundColor: '#141518',
          borderRadius: '6px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7)',
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
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#18191B',
          }}
        >
          <div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: '#FE5B2A',
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
                fontFamily: 'var(--font-display)',
                fontSize: '1.3rem',
                fontWeight: 700,
                color: '#FFFFFF',
                letterSpacing: '-0.01em',
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
              color: '#9FA4B0',
              borderRadius: '4px',
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
              borderRadius: '4px',
              backgroundColor: isWsOnline && isApiOnline ? 'rgba(16, 185, 129, 0.1)' : 'rgba(254, 91, 42, 0.1)',
              border: `1px solid ${isWsOnline && isApiOnline ? 'rgba(16, 185, 129, 0.35)' : 'rgba(254, 91, 42, 0.35)'}`,
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.85rem',
            }}
          >
            {isWsOnline && isApiOnline ? (
              <CheckCircle2 size={20} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
            ) : (
              <AlertCircle size={20} color="#FE5B2A" style={{ flexShrink: 0, marginTop: '2px' }} />
            )}
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  color: isWsOnline && isApiOnline ? '#10B981' : '#FE5B2A',
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
                  color: '#9FA4B0',
                  marginTop: '0.2rem',
                  lineHeight: 1.45,
                }}
              >
                {isWsOnline && isApiOnline
                  ? `Your Vercel deployment is connected to the Python backend with live telemetry and ${fps} FPS.`
                  : 'Your website cannot reach the local Python engine. Start the local bridge or provide the Cloudflare Tunnel URL below.'}
              </div>
            </div>
          </div>

          {/* 4 Pipeline Health Indicators */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '0.85rem',
              marginBottom: '1.5rem',
            }}
          >
            {/* 1. REST API */}
            <div
              style={{
                padding: '0.85rem 1rem',
                backgroundColor: '#18191B',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '4px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Server size={14} color="#FE5B2A" />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#9FA4B0' }}>REST API (/health)</span>
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: isApiOnline ? '#10B981' : '#EF4444',
                  }}
                >
                  {isTesting ? 'TESTING...' : isApiOnline ? `OK (${testResult?.latency}ms)` : 'OFFLINE'}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#FFFFFF', marginTop: '0.35rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)' }}>
                {currentUrl}
              </div>
            </div>

            {/* 2. WebSocket Telemetry */}
            <div
              style={{
                padding: '0.85rem 1rem',
                backgroundColor: '#18191B',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '4px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Radio size={14} color="#FE5B2A" />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#9FA4B0' }}>WEBSOCKET TELEMETRY</span>
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: isWsOnline ? '#10B981' : '#EF4444',
                  }}
                >
                  {isWsOnline ? 'CONNECTED' : connectionStatus.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#FFFFFF', marginTop: '0.35rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)' }}>
                {getWsBaseUrl()}
              </div>
            </div>

            {/* 3. Camera Hardware */}
            <div
              style={{
                padding: '0.85rem 1rem',
                backgroundColor: '#18191B',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '4px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Camera size={14} color="#FE5B2A" />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#9FA4B0' }}>WEBCAM HARDWARE</span>
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: isCameraActive ? '#10B981' : isApiOnline ? '#FE5B2A' : '#5F6470',
                  }}
                >
                  {isCameraActive ? 'ACTIVE (INDEX 0)' : isApiOnline ? 'STANDBY / PAUSED' : 'UNKNOWN'}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9FA4B0', marginTop: '0.35rem', fontFamily: 'var(--font-mono)' }}>
                {isCameraActive ? 'Capturing 640x480 @ 30 FPS' : 'Awaiting start or physical camera'}
              </div>
            </div>

            {/* 4. Optical MJPEG Video Feed */}
            <div
              style={{
                padding: '0.85rem 1rem',
                backgroundColor: '#18191B',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '4px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Video size={14} color="#FE5B2A" />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#9FA4B0' }}>MJPEG VIDEO STREAM</span>
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: isWsOnline && isApiOnline ? '#10B981' : '#5F6470',
                  }}
                >
                  {isWsOnline && isApiOnline ? 'STREAMING' : 'IDLE'}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#FFFFFF', marginTop: '0.35rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)' }}>
                {getVideoFeedUrl()}
              </div>
            </div>
          </div>

          {/* Backend URL Configuration Box */}
          <div
            style={{
              padding: '1.25rem',
              backgroundColor: '#18191B',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '4px',
              marginBottom: '1.5rem',
            }}
          >
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#FE5B2A',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
              }}
            >
              Set Active Backend / Tunnel URL
            </label>
            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://your-tunnel-url.trycloudflare.com or http://localhost:8000"
                style={{
                  flex: 1,
                  minWidth: '240px',
                  padding: '0.55rem 0.85rem',
                  backgroundColor: '#0D0E10',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '4px',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  outline: 'none',
                }}
              />
              <button
                onClick={handleSaveUrl}
                className="sstr-btn"
                style={{ padding: '0.55rem 1.15rem', fontSize: '0.74rem' }}
              >
                {saveSuccess ? 'SAVED!' : 'APPLY & TEST'}
              </button>
              <button
                onClick={handleResetDefault}
                className="sstr-btn-secondary"
                style={{ padding: '0.55rem 1rem', fontSize: '0.74rem' }}
              >
                RESET
              </button>
            </div>
          </div>

          {/* Quick Terminal Command */}
          <div
            style={{
              padding: '1rem 1.25rem',
              backgroundColor: '#0D0E10',
              border: '1px solid rgba(254, 91, 42, 0.25)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Terminal size={15} color="#FE5B2A" />
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#FFFFFF' }}>
                python run_production_bridge.py
              </code>
            </div>
            <button
              onClick={handleCopyCommand}
              className="sstr-btn-secondary"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.7rem' }}
            >
              {copied ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
              <span>{copied ? 'COPIED' : 'COPY'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}