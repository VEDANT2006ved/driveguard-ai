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
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', position: 'relative' }}>
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
            backgroundColor: 'var(--bg-overlay)',
            backdropFilter: 'blur(4px)',
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
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.75rem',
              maxWidth: '480px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              boxShadow: 'var(--shadow-xl)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <AlertTriangle size={15} style={{ color: 'var(--color-warning)' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-warning)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Notifications blocked</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Enable Safety Alerts
                </h3>
              </div>
              <button
                onClick={() => setShowNotificationGuide(false)}
                aria-label="Close"
                className="btn-icon"
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Your browser has blocked notifications for this site. Enable them in your browser settings to receive real-time safety alerts.
            </p>

            {/* Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { step: '1', text: <>Click the <strong>padlock icon</strong> to the left of your browser's address bar.</> },
                { step: '2', text: <>Find <strong>Notifications</strong> and change it from <strong>Block</strong> to <strong>Allow</strong>.</> },
                { step: '3', text: 'Return to DriveGuard AI — alerts will activate automatically.' },
              ].map(({ step, text }) => (
                <div key={step} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{
                    flexShrink: 0, width: '22px', height: '22px',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)',
                  }}>{step}</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.5, paddingTop: '0.125rem' }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.25rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => alertController.playWarningChime(false)} className="btn-secondary" style={{ fontSize: '0.8125rem', gap: '0.375rem' }}>
                  <Volume2 size={13} /> Test warning
                </button>
                <button onClick={() => alertController.playCriticalAlarm(false)} className="btn-secondary" style={{ fontSize: '0.8125rem', gap: '0.375rem', color: 'var(--color-critical)', borderColor: 'var(--color-critical-border)' }}>
                  <Volume2 size={13} /> Test critical
                </button>
              </div>
              <button onClick={() => setShowNotificationGuide(false)} className="btn-primary">
                Done
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
