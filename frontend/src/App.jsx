import React, { useState, useEffect, useRef } from 'react';
import { X, Volume2, Bell, AlertTriangle } from 'lucide-react';
import Preloader from './components/Preloader';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import OverviewView from './views/OverviewView';
import LiveMonitorView from './views/LiveMonitorView';
import AnalyticsView from './views/AnalyticsView';
import TripHistoryView from './views/TripHistoryView';
import { telemetryClient } from './services/telemetryClient';
import { alertController } from './services/alertController';
import { gpsTracker } from './services/gpsTracker';
import { API_BASE_URL, VIDEO_FEED_URL, getApiBaseUrl, getVideoFeedUrl } from './config/api';
import BackendDiagnosticsModal from './components/BackendDiagnosticsModal';
import './styles/tokens.css';
import './styles/animations.css';

export default function App() {
  const [hasCompletedOpening, setHasCompletedOpening] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [connectionStatus, setConnectionStatus] = useState('offline');
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isSimMode, setIsSimMode] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);

  // Desktop notification permission & active state
  const [notificationPermission, setNotificationPermission] = useState(() =>
    alertController.getNotificationPermission()
  );
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(() => {
    return alertController.getNotificationPermission() === 'granted';
  });
  const [showNotificationGuide, setShowNotificationGuide] = useState(false);

  // Synchronize notification permission dynamically with browser settings (on focus, visibility, poll)
  useEffect(() => {
    const syncPermission = () => {
      const currentPerm = alertController.getNotificationPermission();
      setNotificationPermission((prev) => {
        if (prev !== currentPerm) {
          if (currentPerm === 'granted') {
            setIsNotificationsEnabled(true);
            setShowNotificationGuide(false);
          } else if (currentPerm === 'denied' || currentPerm === 'unsupported') {
            setIsNotificationsEnabled(false);
          }
          return currentPerm;
        }
        return prev;
      });
    };

    syncPermission();
    window.addEventListener('focus', syncPermission);
    document.addEventListener('visibilitychange', syncPermission);
    const interval = setInterval(syncPermission, 1500);

    // AudioContext unlock on initial user gesture (compliant with autoplay policies)
    const unlockAudio = () => {
      alertController.resumeAudioContext();
    };
    window.addEventListener('pointerdown', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });

    return () => {
      window.removeEventListener('focus', syncPermission);
      document.removeEventListener('visibilitychange', syncPermission);
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      clearInterval(interval);
    };
  }, []);

  // Ephemeral recovery acknowledgment state
  const [isRecovering, setIsRecovering] = useState(false);
  const recoveryTimerRef = useRef(null);

  const handleRecovery = () => {
    setIsRecovering(true);
    if (recoveryTimerRef.current) clearTimeout(recoveryTimerRef.current);
    recoveryTimerRef.current = setTimeout(() => {
      setIsRecovering(false);
    }, 3500);
  };

  const handleToggleNotifications = async () => {
    alertController.resumeAudioContext();
    if (!alertController.isNotificationSupported()) {
      alert('Desktop notifications are not supported in this browser.');
      return;
    }
    const currentPerm = alertController.getNotificationPermission();
    if (currentPerm === 'default') {
      const result = await alertController.requestNotificationPermission();
      setNotificationPermission(result);
      if (result === 'granted') {
        setIsNotificationsEnabled(true);
        setShowNotificationGuide(false);
      } else if (result === 'denied') {
        setIsNotificationsEnabled(false);
        setShowNotificationGuide(true);
      }
    } else if (currentPerm === 'granted') {
      setIsNotificationsEnabled((prev) => !prev);
    } else if (currentPerm === 'denied') {
      setNotificationPermission('denied');
      setIsNotificationsEnabled(false);
      setShowNotificationGuide(true);
    }
  };

  // Real or simulated telemetry state
  const [telemetry, setTelemetry] = useState({
    isMonitoring: true,
    riskScore: 0,
    riskLevel: 'NOMINAL',
    riskReason: 'NONE',
    ear: 0.33,
    mar: 0.12,
    headPitch: 0.5,
    headYaw: 1.2,
    headRoll: -0.4,
    blinkRate: 16,
    perclos: 3.5,
    eyesClosedTime: 0,
    fps: 0,
    latencyMs: 0,
    alertMessage: '',
  });

  const [telemetryHistory, setTelemetryHistory] = useState([]);

  // Connect to Python WebSocket Telemetry engine
  useEffect(() => {
    telemetryClient.connect({
      onStatusChange: (status) => {
        setConnectionStatus(status);
      },
      onMessage: (data) => {
        // Deactivate sim mode if real hardware stream is active
        setIsSimMode(false);
        if (typeof data.isMonitoring === 'boolean') {
          setIsMonitoring(data.isMonitoring);
        }
        setTelemetry(data);
        if (data.isMonitoring !== false) {
          setTelemetryHistory((prev) => [...prev.slice(-399), data]);
          alertController.processTelemetry(data, {
            isAudioMuted,
            notificationsEnabled: isNotificationsEnabled,
            onRecovery: handleRecovery,
            onIncident: (incident) => gpsTracker.attachIncident(incident),
          });
        }
      },
    });

    return () => {
      telemetryClient.disconnect();
      alertController.teardown();
      gpsTracker.stopTracking();
    };
  }, [isAudioMuted, isNotificationsEnabled]);

  // Monitoring Start / Stop / Restart Handlers
  const handleStartMonitoring = async () => {
    setIsMonitoring(true);
    telemetryClient.sendAction('start');
    try {
      await fetch(`${getApiBaseUrl()}/api/monitoring/start`, { method: 'POST' });
    } catch (e) {
      console.warn('API start monitoring error:', e);
    }
  };

  const handleStopMonitoring = async () => {
    setIsMonitoring(false);
    alertController.teardown();
    gpsTracker.stopTracking();
    telemetryClient.sendAction('stop');
    try {
      await fetch(`${getApiBaseUrl()}/api/monitoring/stop`, { method: 'POST' });
    } catch (e) {
      console.warn('API stop monitoring error:', e);
    }
  };

  const handleToggleMonitoring = async () => {
    if (isMonitoring) {
      await handleStopMonitoring();
    } else {
      await handleStartMonitoring();
    }
  };

  // Diagnostics test mode trigger
  const handleTriggerTestIncident = (type) => {
    let nextTelemetry;
    if (type === 'CRITICAL') {
      nextTelemetry = {
        isMonitoring: true,
        riskScore: 92,
        riskLevel: 'CRITICAL',
        riskReason: 'DROWSINESS_EYE_CLOSURE',
        ear: 0.12,
        mar: 0.18,
        headPitch: 0.5,
        headYaw: 1.1,
        headRoll: 0.0,
        blinkRate: 34,
        perclos: 42.0,
        eyesClosedTime: 2.1,
        fps: 60,
        latencyMs: 14,
        alertMessage: 'CRITICAL: PROLONGED EYE CLOSURE (2.1s) — IMMEDIATE STOP REQUIRED',
      };
    } else if (type === 'HEAD_DOWN') {
      nextTelemetry = {
        isMonitoring: true,
        riskScore: 55,
        riskLevel: 'WARNING',
        riskReason: 'HEAD_DOWN_DISTRACTION',
        ear: 0.32,
        mar: 0.12,
        headPitch: -21.4,
        headYaw: 2.1,
        headRoll: 0.4,
        blinkRate: 16,
        perclos: 3.5,
        eyesClosedTime: 0.0,
        fps: 60,
        latencyMs: 12,
        alertMessage: 'DISTRACTION: HEAD DIRECTED DOWNWARD (-21.4°) FOR 2.4s',
      };
    } else if (type === 'WARNING') {
      nextTelemetry = {
        isMonitoring: true,
        riskScore: 54,
        riskLevel: 'WARNING',
        riskReason: 'DROWSINESS_YAWN',
        ear: 0.31,
        mar: 0.68,
        headPitch: 0.5,
        headYaw: 1.5,
        headRoll: 0.1,
        blinkRate: 26,
        perclos: 4.5,
        eyesClosedTime: 0.0,
        fps: 60,
        latencyMs: 15,
        alertMessage: 'DROWSINESS: SUSTAINED YAWNING DETECTED',
      };
    } else {
      nextTelemetry = {
        isMonitoring: true,
        riskScore: 8,
        riskLevel: 'NOMINAL',
        riskReason: 'NONE',
        ear: 0.35,
        mar: 0.12,
        headPitch: 0.5,
        headYaw: 1.2,
        headRoll: -0.4,
        blinkRate: 16,
        perclos: 3.2,
        eyesClosedTime: 0,
        fps: 60,
        latencyMs: 12,
        alertMessage: '',
      };
    }

    setTelemetry(nextTelemetry);
    setTelemetryHistory((prev) => [...prev.slice(-399), nextTelemetry]);
    if (nextTelemetry.riskLevel !== 'NOMINAL') {
      gpsTracker.attachIncident(nextTelemetry);
    }
    alertController.processTelemetry(nextTelemetry, {
      isAudioMuted,
      notificationsEnabled: isNotificationsEnabled,
      onRecovery: handleRecovery,
      onIncident: (incident) => gpsTracker.attachIncident(incident),
    });
  };

  // Toggle UI Diagnostics Mode
  const handleToggleSimMode = () => {
    setIsSimMode((prev) => {
      const next = !prev;
      if (next) {
        handleTriggerTestIncident('NORMAL');
      } else {
        alertController.teardown();
        setTelemetry({
          isMonitoring: true,
          riskScore: 0,
          riskLevel: 'NOMINAL',
          riskReason: 'NONE',
          ear: 0.33,
          mar: 0.12,
          headPitch: 0.5,
          headYaw: 1.2,
          headRoll: -0.4,
          blinkRate: 16,
          perclos: 3.5,
          eyesClosedTime: 0,
          fps: 0,
          latencyMs: 0,
          alertMessage: '',
        });
      }
      return next;
    });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-canvas)', position: 'relative' }}>
      {/* Editorial Top Navigation Header */}
      <Navigation
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          connectionStatus={isSimMode ? 'calibrating' : connectionStatus}
          isMonitoring={isMonitoring}
          onToggleMonitoring={handleToggleMonitoring}
          onStartMonitoring={handleStartMonitoring}
          isAudioMuted={isAudioMuted}
          onToggleAudio={() => setIsAudioMuted(!isAudioMuted)}
          notificationPermission={notificationPermission}
          isNotificationsEnabled={isNotificationsEnabled}
          onToggleNotifications={handleToggleNotifications}
          fps={telemetry.fps}
          latencyMs={telemetry.latencyMs}
          onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
        />

        {/* View Container — Full bleed capable with generous editorial layout */}
        <main
          style={{
            width: '100%',
            margin: '0 auto',
            paddingBottom: '5rem',
            position: 'relative',
          }}
        >
          {activeTab === 'overview' && (
            <OverviewView
              telemetryData={telemetry}
              isEngineConnected={connectionStatus === 'online'}
              isSimMode={isSimMode}
              isMonitoring={isMonitoring}
              isRecovering={isRecovering}
              onStartMonitoring={handleStartMonitoring}
              onNavigateToMonitor={() => setActiveTab('monitor')}
              onToggleSimMode={handleToggleSimMode}
            />
          )}

          {activeTab === 'monitor' && (
            <LiveMonitorView
              telemetryData={telemetry}
              isEngineConnected={connectionStatus === 'online'}
              isSimMode={isSimMode}
              isMonitoring={isMonitoring}
              isRecovering={isRecovering}
              onToggleMonitoring={handleToggleMonitoring}
              onStartMonitoring={handleStartMonitoring}
              onStopMonitoring={handleStopMonitoring}
              videoStreamUrl={connectionStatus === 'online' ? getVideoFeedUrl() : null}
              onTriggerTestIncident={handleTriggerTestIncident}
              onToggleSimMode={handleToggleSimMode}
              onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              telemetryHistory={telemetryHistory}
              isEngineConnected={connectionStatus === 'online'}
            />
          )}

          {activeTab === 'history' && <TripHistoryView />}
        </main>

        {/* Bang & Olufsen A9-Inspired Minimalist Editorial Footer */}
        <Footer
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          connectionStatus={isSimMode ? 'calibrating' : connectionStatus}
          isMonitoring={isMonitoring}
          fps={telemetry.fps}
          latencyMs={telemetry.latencyMs}
        />

      {/* Desktop Notification Permissions Guidance Modal */}
      {showNotificationGuide && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(13, 14, 16, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.25rem',
          }}
          onClick={() => setShowNotificationGuide(false)}
        >
          <div
            className="animate-fade-up"
            style={{
              backgroundColor: '#18191B',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '4px',
              padding: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              maxWidth: '540px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: '#FE5B2A',
                    fontSize: '0.72rem',
                    fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: '0.4rem',
                  }}
                >
                  <AlertTriangle size={12} />
                  <span>SYS // 05 • BROWSER PERMISSIONS</span>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display, 'Syne', sans-serif)",
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    textTransform: 'uppercase',
                    color: '#F5F5F7',
                    margin: '0.1rem 0 0 0',
                  }}
                >
                  DESKTOP SAFETY ALERTS BLOCKED
                </h3>
              </div>
              <button
                onClick={() => setShowNotificationGuide(false)}
                aria-label="Close"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  color: '#9FA4B0',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                }}
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '0.88rem', color: '#9FA4B0', lineHeight: 1.55, margin: 0 }}>
              Your browser has notifications set to <strong style={{ color: '#F5F5F7' }}>Block</strong> for this origin. Browser security requires enabling permissions manually in browser site settings to dispatch real-time critical safety alarms.
            </p>

            {/* Step-by-Step Instructions */}
            <div
              style={{
                backgroundColor: '#141518',
                borderRadius: '2px',
                padding: '1.25rem 1.4rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                fontSize: '0.86rem',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                    fontWeight: 700,
                    color: '#0D0E10',
                    fontSize: '0.72rem',
                    backgroundColor: '#FE5B2A',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '2px',
                  }}
                >
                  01
                </span>
                <span style={{ color: '#F5F5F7', lineHeight: 1.45 }}>
                  Click the <strong>Tune / Padlock</strong> icon (site info) immediately to the left of the URL in your browser address bar.
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                    fontWeight: 700,
                    color: '#0D0E10',
                    fontSize: '0.72rem',
                    backgroundColor: '#FE5B2A',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '2px',
                  }}
                >
                  02
                </span>
                <span style={{ color: '#F5F5F7', lineHeight: 1.45 }}>
                  In the site settings dropdown, find <strong>Notifications</strong> and change the toggle from <strong>Block</strong> to <strong>Allow</strong>.
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                    fontWeight: 700,
                    color: '#0D0E10',
                    fontSize: '0.72rem',
                    backgroundColor: '#FE5B2A',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '2px',
                  }}
                >
                  03
                </span>
                <span style={{ color: '#F5F5F7', lineHeight: 1.45 }}>
                  Switch back to DriveGuard AI. The system will automatically detect the updated permission and activate real-time notifications.
                </span>
              </div>
            </div>

            {/* Test Sounds & Actions */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
                paddingTop: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => alertController.playWarningChime(false)}
                  title="Test audible warning sound"
                  className="sstr-btn-secondary"
                  style={{
                    padding: '0.45rem 0.95rem',
                    fontSize: '0.75rem',
                  }}
                >
                  <Volume2 size={13} />
                  <span>Test Warning</span>
                </button>

                <button
                  onClick={() => alertController.playCriticalAlarm(false)}
                  title="Test loud critical alarm"
                  className="sstr-btn-secondary"
                  style={{
                    padding: '0.45rem 0.95rem',
                    fontSize: '0.75rem',
                    borderColor: 'rgba(239, 68, 68, 0.4)',
                    color: '#EF4444',
                  }}
                >
                  <Volume2 size={13} />
                  <span>Test Critical</span>
                </button>
              </div>

              <button
                onClick={() => setShowNotificationGuide(false)}
                className="sstr-btn"
                style={{
                  padding: '0.5rem 1.4rem',
                }}
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* System Bridge & Diagnostics Modal */}
      <BackendDiagnosticsModal
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
        connectionStatus={connectionStatus}
        fps={telemetry.fps}
      />
    </div>
  );
}
