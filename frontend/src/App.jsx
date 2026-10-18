import React, { useState, useEffect, useRef } from 'react';
import { X, Volume2, Bell, AlertTriangle } from 'lucide-react';
import Preloader from './components/Preloader';
import Navigation from './components/Navigation';
import OverviewView from './views/OverviewView';
import LiveMonitorView from './views/LiveMonitorView';
import AnalyticsView from './views/AnalyticsView';
import TripHistoryView from './views/TripHistoryView';
import { telemetryClient } from './services/telemetryClient';
import { alertController } from './services/alertController';
import './styles/tokens.css';
import './styles/animations.css';

export default function App() {
  const [hasCompletedOpening, setHasCompletedOpening] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [connectionStatus, setConnectionStatus] = useState('offline');
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isSimMode, setIsSimMode] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(true);

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
          });
        }
      },
    });

    return () => {
      telemetryClient.disconnect();
      alertController.teardown();
    };
  }, [isAudioMuted, isNotificationsEnabled]);

  // Monitoring Start / Stop / Restart Handlers
  const handleStartMonitoring = async () => {
    setIsMonitoring(true);
    telemetryClient.sendAction('start');
    try {
      await fetch('http://localhost:8000/api/monitoring/start', { method: 'POST' });
    } catch (e) {
      console.warn('API start monitoring error:', e);
    }
  };

  const handleStopMonitoring = async () => {
    setIsMonitoring(false);
    alertController.teardown();
    telemetryClient.sendAction('stop');
    try {
      await fetch('http://localhost:8000/api/monitoring/stop', { method: 'POST' });
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
    alertController.processTelemetry(nextTelemetry, {
      isAudioMuted,
      notificationsEnabled: isNotificationsEnabled,
      onRecovery: handleRecovery,
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
      {/* Editorial Preloader Opening Sequence */}
      {!hasCompletedOpening && (
        <Preloader onComplete={() => setHasCompletedOpening(true)} />
      )}

      {/* Main DriveGuard Shell */}
      <div
        style={{
          opacity: hasCompletedOpening ? 1 : 0,
          transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Editorial Top Navigation Header */}
        <Navigation
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          connectionStatus={isSimMode ? 'calibrating' : connectionStatus}
          isMonitoring={isMonitoring}
          onToggleMonitoring={handleToggleMonitoring}
          isAudioMuted={isAudioMuted}
          onToggleAudio={() => setIsAudioMuted(!isAudioMuted)}
          notificationPermission={notificationPermission}
          isNotificationsEnabled={isNotificationsEnabled}
          onToggleNotifications={handleToggleNotifications}
          fps={telemetry.fps}
          latencyMs={telemetry.latencyMs}
        />

        {/* View Container */}
        <main
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: 'clamp(2rem, 5vw, 4rem) clamp(1rem, 4vw, 3rem)',
            paddingBottom: '5rem',
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
              videoStreamUrl={connectionStatus === 'online' ? 'http://localhost:8000/video_feed' : null}
              onTriggerTestIncident={handleTriggerTestIncident}
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

        {/* VANTAGE Automotive Editorial Footer */}
        <footer
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '2.5rem clamp(1rem, 4vw, 3rem) 3.5rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem',
            color: 'var(--text-secondary)',
            fontSize: '0.8rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '1px',
                backgroundColor: 'var(--color-accent-red)',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-condensed)',
                fontSize: '1.05rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
              }}
            >
              DRIVEGUARD.AI
            </span>
            <span style={{ color: 'var(--border-subtle)' }}>•</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              EDGE BIOMETRIC ATTENTIVENESS &amp; FATIGUE DETECTION
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              NON-INTRUSIVE MEDIAPIPE 468-POINT MESH INFERENCE
            </span>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-btn)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: connectionStatus === 'online' ? '#10B981' : '#F59E0B',
                }}
              />
              <span>SYSTEM {connectionStatus.toUpperCase()}</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Desktop Notification Permissions Guidance Modal */}
      {showNotificationGuide && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(13, 14, 16, 0.75)',
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
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-card-lg)',
              padding: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              maxWidth: '540px',
              width: '100%',
              boxShadow: 'var(--shadow-lg)',
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
                    color: 'var(--color-accent-red)',
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: '0.4rem',
                  }}
                >
                  <AlertTriangle size={12} />
                  <span>SYS.05 // BROWSER PERMISSIONS</span>
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-condensed)',
                    fontSize: '1.8rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: 'var(--text-primary)',
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
                  background: 'var(--bg-ivory-subtle)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-btn)',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
              Your browser has notifications set to <strong style={{ color: 'var(--text-primary)' }}>Block</strong> for this origin (<code className="font-mono" style={{ fontSize: '0.8rem', backgroundColor: 'var(--bg-ivory-subtle)', padding: '0.2rem 0.45rem', borderRadius: '3px' }}>localhost:5173</code>). Browser security requires enabling permissions manually in Chrome site settings.
            </p>

            {/* Step-by-Step Instructions */}
            <div
              style={{
                backgroundColor: 'var(--bg-ivory-subtle)',
                borderRadius: 'var(--radius-card)',
                padding: '1.25rem 1.4rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                fontSize: '0.86rem',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    fontSize: '0.72rem',
                    backgroundColor: 'var(--text-primary)',
                    padding: '0.15rem 0.45rem',
                    borderRadius: 'var(--radius-btn)',
                  }}
                >
                  01
                </span>
                <span style={{ color: 'var(--text-primary)', lineHeight: 1.45 }}>
                  Click the <strong>Tune / Padlock</strong> icon (site info) immediately to the left of <strong>localhost:5173</strong> in your browser address bar.
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    fontSize: '0.72rem',
                    backgroundColor: 'var(--text-primary)',
                    padding: '0.15rem 0.45rem',
                    borderRadius: 'var(--radius-btn)',
                  }}
                >
                  02
                </span>
                <span style={{ color: 'var(--text-primary)', lineHeight: 1.45 }}>
                  In the site settings dropdown, find <strong>Notifications</strong> and change the toggle from <strong>Block</strong> to <strong>Allow</strong>.
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    fontSize: '0.72rem',
                    backgroundColor: 'var(--text-primary)',
                    padding: '0.15rem 0.45rem',
                    borderRadius: 'var(--radius-btn)',
                  }}
                >
                  03
                </span>
                <span style={{ color: 'var(--text-primary)', lineHeight: 1.45 }}>
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
                  className="vantage-btn-outline"
                  style={{
                    padding: '0.45rem 0.95rem',
                    fontSize: '0.8rem',
                  }}
                >
                  <Volume2 size={13} />
                  <span>Test Warning</span>
                </button>

                <button
                  onClick={() => alertController.playCriticalAlarm(false)}
                  title="Test loud critical alarm"
                  className="vantage-btn-outline"
                  style={{
                    padding: '0.45rem 0.95rem',
                    fontSize: '0.8rem',
                    borderColor: 'var(--color-alert-border)',
                    color: 'var(--color-accent-red)',
                  }}
                >
                  <Volume2 size={13} />
                  <span>Test Critical</span>
                </button>
              </div>

              <button
                onClick={() => setShowNotificationGuide(false)}
                className="vantage-btn"
                style={{
                  padding: '0.55rem 1.4rem',
                }}
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
