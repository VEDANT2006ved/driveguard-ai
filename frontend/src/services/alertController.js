/**
 * DriveGuard AI — Alert & Notification Controller
 * Manages audible multi-tone alarms, cooldown intervals, state transition alerts,
 * master volume controls, and Web Notifications API integration with graceful fallbacks.
 */

class AlertController {
  constructor() {
    this.audioContext = null;
    this.masterGainNode = null;
    this.masterVolume = 0.85; // Strong, audible, safe default (0.0 to 1.0)
    this.activeNodes = [];
    this.activeNotification = null;
    this.autoCloseTimeout = null;

    // Transition tracking
    this.prevRiskLevel = 'NOMINAL';
    this.prevRiskReason = 'NONE';
    this.lastAlertTimestamp = 0;

    // Configurable Cooldowns (in milliseconds)
    this.cooldowns = {
      WARNING: 4000,   // 4.0 seconds for sustained warning
      CRITICAL: 2500,  // 2.5 seconds for sustained critical
    };
  }

  // ---------------------------------------------------------------------------
  // Web Audio Context & Master Gain
  // ---------------------------------------------------------------------------
  getAudioContext() {
    try {
      if (!this.audioContext) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.audioContext = new AudioCtx();
          this.masterGainNode = this.audioContext.createGain();
          this.masterGainNode.gain.setValueAtTime(this.masterVolume, this.audioContext.currentTime);
          this.masterGainNode.connect(this.audioContext.destination);
        }
      }
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume().catch(() => {});
      }
      return this.audioContext;
    } catch (e) {
      console.warn('AudioContext initialization error:', e);
      return null;
    }
  }

  resumeAudioContext() {
    try {
      const ctx = this.getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        return ctx.resume();
      }
    } catch {
      // ignore
    }
  }

  setMasterVolume(val) {
    const clamped = Math.max(0, Math.min(1.0, val));
    this.masterVolume = clamped;
    if (this.masterGainNode && this.audioContext) {
      try {
        this.masterGainNode.gain.setValueAtTime(clamped, this.audioContext.currentTime);
      } catch (e) {
        console.warn('Could not set master gain:', e);
      }
    }
  }

  getMasterVolume() {
    return this.masterVolume;
  }

  stopAllAudio() {
    this.activeNodes.forEach(({ osc, gain }) => {
      try {
        if (gain && this.audioContext) {
          gain.gain.cancelScheduledValues(this.audioContext.currentTime);
          gain.gain.setValueAtTime(0, this.audioContext.currentTime);
        }
        if (osc) {
          osc.stop();
          osc.disconnect();
        }
      } catch {
        // already stopped or disconnected
      }
    });
    this.activeNodes = [];
  }

  // ---------------------------------------------------------------------------
  // Sound Profiles (Multi-Tone Automotive Safety Alarms)
  // ---------------------------------------------------------------------------

  /**
   * CRITICAL Alert: Urgent high-intensity 3-pulse klaxon sequence.
   * Distinct, piercing, and authoritative (880 Hz -> 880 Hz -> 1046.5 Hz).
   */
  playCriticalAlarm(isMuted = false) {
    if (isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    this.stopAllAudio();

    try {
      const t = ctx.currentTime + 0.01;
      const targetGain = this.masterGainNode || ctx.destination;

      const pulses = [
        { freq: 880, start: t, dur: 0.16, gain: 0.65 },
        { freq: 880, start: t + 0.20, dur: 0.16, gain: 0.65 },
        { freq: 1046.5, start: t + 0.40, dur: 0.24, gain: 0.70 },
      ];

      pulses.forEach(({ freq, start, dur, gain: pulseGain }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Triangle wave provides rich fundamental harmonics without harsh buzzy distortion
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        // Controlled click-free envelope (15ms attack, solid sustain, 25ms decay)
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.linearRampToValueAtTime(pulseGain, start + 0.015);
        gain.gain.setValueAtTime(pulseGain * 0.95, start + dur - 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

        osc.connect(gain);
        gain.connect(targetGain);

        osc.start(start);
        osc.stop(start + dur);

        this.activeNodes.push({ osc, gain });
        osc.onended = () => {
          this.activeNodes = this.activeNodes.filter((item) => item.osc !== osc);
        };
      });
    } catch (e) {
      console.warn('Failed to play critical alarm tone:', e);
    }
  }

  /**
   * WARNING Alert: Clear, audible two-tone caution chime (587.3 Hz -> 880 Hz).
   * Noticeable and crisp, alerting the driver to distraction or yawning onset.
   */
  playWarningChime(isMuted = false) {
    if (isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    this.stopAllAudio();

    try {
      const t = ctx.currentTime + 0.01;
      const targetGain = this.masterGainNode || ctx.destination;

      const tones = [
        { freq: 587.33, start: t, dur: 0.14, gain: 0.45 },        // D5
        { freq: 880.0, start: t + 0.15, dur: 0.32, gain: 0.52 },  // A5
      ];

      tones.forEach(({ freq, start, dur, gain: toneGain }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.linearRampToValueAtTime(toneGain, start + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

        osc.connect(gain);
        gain.connect(targetGain);

        osc.start(start);
        osc.stop(start + dur);

        this.activeNodes.push({ osc, gain });
        osc.onended = () => {
          this.activeNodes = this.activeNodes.filter((item) => item.osc !== osc);
        };
      });
    } catch (e) {
      console.warn('Failed to play warning chime:', e);
    }
  }

  /**
   * RECOVERY Alert: Subtle, gentle ascending triad confirming posture restoration.
   * Significantly softer than warning or critical alerts (C5 -> E5 -> G5).
   */
  playRecoveryChime(isMuted = false) {
    if (isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    this.stopAllAudio();

    try {
      const t = ctx.currentTime + 0.01;
      const targetGain = this.masterGainNode || ctx.destination;

      const tones = [
        { freq: 523.25, start: t, dur: 0.10, gain: 0.20 },         // C5
        { freq: 659.25, start: t + 0.10, dur: 0.10, gain: 0.22 },  // E5
        { freq: 783.99, start: t + 0.20, dur: 0.28, gain: 0.25 },  // G5
      ];

      tones.forEach(({ freq, start, dur, gain: toneGain }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.linearRampToValueAtTime(toneGain, start + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

        osc.connect(gain);
        gain.connect(targetGain);

        osc.start(start);
        osc.stop(start + dur);

        this.activeNodes.push({ osc, gain });
        osc.onended = () => {
          this.activeNodes = this.activeNodes.filter((item) => item.osc !== osc);
        };
      });
    } catch (e) {
      console.warn('Failed to play recovery chime:', e);
    }
  }

  // ---------------------------------------------------------------------------
  // Web Notifications API Integration
  // ---------------------------------------------------------------------------
  isNotificationSupported() {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  getNotificationPermission() {
    if (!this.isNotificationSupported()) return 'unsupported';
    return Notification.permission; // 'default' | 'granted' | 'denied'
  }

  async requestNotificationPermission() {
    if (!this.isNotificationSupported()) return 'unsupported';
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (err) {
      console.warn('Failed to request notification permission:', err);
      return 'denied';
    }
  }

  dismissActiveNotification() {
    if (this.autoCloseTimeout) {
      clearTimeout(this.autoCloseTimeout);
      this.autoCloseTimeout = null;
    }
    if (this.activeNotification) {
      try {
        this.activeNotification.close();
      } catch {
        // already closed
      }
      this.activeNotification = null;
    }
  }

  dispatchNotification(title, message, isCritical = false) {
    if (!this.isNotificationSupported()) return;
    if (Notification.permission !== 'granted') return;

    this.dismissActiveNotification();

    try {
      const notification = new Notification(title, {
        body: message,
        tag: 'driveguard-safety-incident', // replaces previous notification cleanly
        renotify: true,
        silent: true, // We provide custom Web Audio chime
      });

      this.activeNotification = notification;

      // Auto-dismiss after 4.5 seconds
      this.autoCloseTimeout = setTimeout(() => {
        if (this.activeNotification === notification) {
          notification.close();
          this.activeNotification = null;
        }
      }, 4500);
    } catch (err) {
      console.warn('Could not dispatch browser notification:', err);
    }
  }

  // ---------------------------------------------------------------------------
  // State Transition & Cooldown Processing Engine
  // ---------------------------------------------------------------------------
  processTelemetry(
    telemetry,
    {
      isAudioMuted = false,
      notificationsEnabled = true,
      onRecovery = null,
      onIncident = null,
    } = {}
  ) {
    const currentLevel = telemetry?.riskLevel || 'NOMINAL';
    const currentReason = telemetry?.riskReason || 'NONE';
    const message = telemetry?.alertMessage || '';
    const now = Date.now();

    const isLevelEscalation =
      (this.prevRiskLevel === 'NOMINAL' && (currentLevel === 'WARNING' || currentLevel === 'CRITICAL')) ||
      (this.prevRiskLevel === 'WARNING' && currentLevel === 'CRITICAL');

    const isRecovery =
      (this.prevRiskLevel === 'WARNING' || this.prevRiskLevel === 'CRITICAL') &&
      currentLevel === 'NOMINAL';

    // 1. Recovery Transition (WARNING/CRITICAL -> NOMINAL)
    if (isRecovery) {
      this.dismissActiveNotification();
      this.playRecoveryChime(isAudioMuted);
      if (typeof onRecovery === 'function') {
        onRecovery();
      }
      this.prevRiskLevel = 'NOMINAL';
      this.prevRiskReason = 'NONE';
      this.lastAlertTimestamp = 0;
      return;
    }

    // 2. Incident Escalation or First Trigger
    if (isLevelEscalation) {
      this.lastAlertTimestamp = now;
      if (typeof onIncident === 'function') {
        onIncident(telemetry);
      }
      if (currentLevel === 'CRITICAL') {
        this.playCriticalAlarm(isAudioMuted);
        if (notificationsEnabled) {
          this.dispatchNotification(
            '⚠️ DriveGuard AI: Critical Safety Alert',
            message || 'Critical driver fatigue threshold reached — stop driving immediately.',
            true
          );
        }
      } else if (currentLevel === 'WARNING') {
        this.playWarningChime(isAudioMuted);
        if (notificationsEnabled) {
          this.dispatchNotification(
            'DriveGuard AI: Attention Advisory',
            message || 'Driver distraction or sustained yawning detected — refocus on roadway.',
            false
          );
        }
      }
      this.prevRiskLevel = currentLevel;
      this.prevRiskReason = currentReason;
      return;
    }

    // 3. Ongoing Active Incident (Cooldown Periodic Reminder)
    if (currentLevel === 'CRITICAL' || currentLevel === 'WARNING') {
      const cooldownLimit = this.cooldowns[currentLevel] || 3000;
      const elapsedSinceAlert = now - this.lastAlertTimestamp;

      if (elapsedSinceAlert >= cooldownLimit) {
        this.lastAlertTimestamp = now;
        if (currentLevel === 'CRITICAL') {
          this.playCriticalAlarm(isAudioMuted);
        } else {
          this.playWarningChime(isAudioMuted);
        }
      }
      this.prevRiskLevel = currentLevel;
      this.prevRiskReason = currentReason;
      return;
    }

    // Baseline Nominal State
    this.prevRiskLevel = currentLevel;
    this.prevRiskReason = currentReason;
  }

  // ---------------------------------------------------------------------------
  // Complete Teardown (On Monitoring Stop or Component Unmount)
  // ---------------------------------------------------------------------------
  teardown() {
    this.stopAllAudio();
    this.dismissActiveNotification();
    this.prevRiskLevel = 'NOMINAL';
    this.prevRiskReason = 'NONE';
    this.lastAlertTimestamp = 0;
  }
}

export const alertController = new AlertController();
