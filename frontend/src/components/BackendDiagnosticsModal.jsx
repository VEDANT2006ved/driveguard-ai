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
} from 'lucide-react';
import {
  getApiBaseUrl,
  getWsBaseUrl,
  getVideoFeedUrl,
  setCustomBackendUrl,
  getCustomBackendUrl,
  testBackendConnection,
} from '../config/api';

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
        backgroundColor: 'rgba(23, 23, 23, 0.72)',
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
          backgroundColor: '#FAF9F6',
          borderRadius: '4px',
          border: '1px solid #D8D4CC',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
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
            borderBottom: '1px solid #E6E2DA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#F3EFEA',
          }}
        >
          <div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: '#77756F',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              System Bridge // Hardware Telemetry Diagnostics
            </span>
            <h3
              style={{
                margin: '0.2rem 0 0 0',
                fontFamily: 'var(--font-sans)',
                fontSize: '1.2rem',
                fontWeight: 600,
                color: '#171717',
                letterSpacing: '-0.01em',
              }}
            >
              Backend & Tunnel Pipeline Status
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              color: '#77756F',
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
              borderRadius: '3px',
              backgroundColor: isWsOnline && isApiOnline ? '#EEF8F1' : '#FFF5F2',
              border: `1px solid ${isWsOnline && isApiOnline ? '#A8D5B5' : '#F4B8AC'}`,
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.85rem',
            }}
          >
            {isWsOnline && isApiOnline ? (
              <CheckCircle2 size={20} color="#2E7D46" style={{ flexShrink: 0, marginTop: '2px' }} />
            ) : (
              <AlertCircle size={20} color="#D64527" style={{ flexShrink: 0, marginTop: '2px' }} />
            )}
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  color: isWsOnline && isApiOnline ? '#1B4D2B' : '#7A2210',
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
                  color: isWsOnline && isApiOnline ? '#2A663C' : '#9E321B',
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
                backgroundColor: '#FFFFFF',
                border: '1px solid #E6E2DA',
                borderRadius: '3px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Server size={14} color="#77756F" />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#77756F' }}>REST API (/health)</span>
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: isApiOnline ? '#2E7D46' : '#D64527',
                  }}
                >
                  {isTesting ? 'TESTING...' : isApiOnline ? `OK (${testResult?.latency}ms)` : 'OFFLINE'}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#171717', marginTop: '0.35rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUrl}
              </div>
            </div>

            {/* 2. WebSocket Telemetry */}
            <div
              style={{
                padding: '0.85rem 1rem',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E6E2DA',
                borderRadius: '3px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Radio size={14} color="#77756F" />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#77756F' }}>WEBSOCKET TELEMETRY</span>
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: isWsOnline ? '#2E7D46' : '#D64527',
                  }}
                >
                  {isWsOnline ? 'CONNECTED' : connectionStatus.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#171717', marginTop: '0.35rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {getWsBaseUrl()}
              </div>
            </div>

            {/* 3. Camera Hardware */}
            <div
              style={{
                padding: '0.85rem 1rem',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E6E2DA',
                borderRadius: '3px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Camera size={14} color="#77756F" />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#77756F' }}>WEBCAM HARDWARE</span>
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: isCameraActive ? '#2E7D46' : isApiOnline ? '#B87216' : '#77756F',
                  }}
                >
                  {isCameraActive ? 'ACTIVE (INDEX 0)' : isApiOnline ? 'STANDBY / PAUSED' : 'UNKNOWN'}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#77756F', marginTop: '0.35rem' }}>
                {isCameraActive ? 'Capturing 640x480 @ 30 FPS' : 'Awaiting start or physical camera'}
              </div>
            </div>

            {/* 4. Optical MJPEG Video Feed */}
            <div
              style={{
                padding: '0.85rem 1rem',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E6E2DA',
                borderRadius: '3px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Video size={14} color="#77756F" />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#77756F' }}>MJPEG VIDEO STREAM</span>
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: isWsOnline && isApiOnline ? '#2E7D46' : '#77756F',
                  }}
                >
                  {isWsOnline && isApiOnline ? 'STREAMING' : 'IDLE'}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#171717', marginTop: '0.35rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {getVideoFeedUrl()}
              </div>
            </div>
          </div>

          {/* Backend URL Configuration Box */}
          <div
            style={{
              padding: '1.25rem',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E6E2DA',
              borderRadius: '3px',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#171717',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Connect to Remote Tunnel or Local Backend
              </label>
              <button
                onClick={() => runHealthCheck(inputUrl)}
                disabled={isTesting}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#77756F',
                  cursor: isTesting ? 'wait' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.74rem',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                <RefreshCw size={12} className={isTesting ? 'animate-spin' : ''} />
                <span>Test Endpoint</span>
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#77756F', margin: '0 0 0.85rem 0', lineHeight: 1.45 }}>
              Paste your public Cloudflare Tunnel URL (e.g. <code>https://xxxx.trycloudflare.com</code>) or local IP.
              Changes take effect immediately without redeploying.
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <input
                type="url"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://your-tunnel.trycloudflare.com or http://localhost:8000"
                style={{
                  flex: 1,
                  minWidth: '240px',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '2px',
                  border: '1px solid #D8D4CC',
                  backgroundColor: '#FAF9F6',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  color: '#171717',
                  outline: 'none',
                }}
              />
              <button
                onClick={handleSaveUrl}
                style={{
                  padding: '0.6rem 1.25rem',
                  backgroundColor: '#171717',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '2px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                {saveSuccess ? <Check size={14} /> : null}
                <span>{saveSuccess ? 'Connected' : 'Save & Connect'}</span>
              </button>
              <button
                onClick={handleResetDefault}
                style={{
                  padding: '0.6rem 0.85rem',
                  backgroundColor: 'transparent',
                  color: '#77756F',
                  border: '1px solid #D8D4CC',
                  borderRadius: '2px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                }}
              >
                Reset Default
              </button>
            </div>

            {testResult && !testResult.ok && (
              <div style={{ marginTop: '0.75rem', fontSize: '0.76rem', color: '#D64527', fontFamily: 'var(--font-mono)' }}>
                ⚠ Connection Failed: {testResult.error}
              </div>
            )}
          </div>

          {/* Quick Start Terminal Instructions */}
          <div
            style={{
              padding: '1.25rem',
              backgroundColor: '#F3EFEA',
              border: '1px solid #E6E2DA',
              borderRadius: '3px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', fontWeight: 600, color: '#171717', textTransform: 'uppercase' }}>
                How to start the local backend & tunnel:
              </span>
              <button
                onClick={handleCopyCommand}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#77756F',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {copied ? <Check size={12} color="#2E7D46" /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy Command'}</span>
              </button>
            </div>

            <pre
              style={{
                margin: '0.5rem 0',
                padding: '0.75rem 1rem',
                backgroundColor: '#171717',
                color: '#E6E2DA',
                borderRadius: '2px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                overflowX: 'auto',
              }}
            >
              python run_production_bridge.py
            </pre>

            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.76rem', color: '#77756F', lineHeight: 1.45 }}>
              This command automatically starts the Python OpenCV/MediaPipe server and Cloudflare Tunnel, then displays the public HTTPS URL to paste above.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '1rem 1.75rem',
            borderTop: '1px solid #E6E2DA',
            backgroundColor: '#F3EFEA',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem 1.5rem',
              backgroundColor: '#171717',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '2px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
}
