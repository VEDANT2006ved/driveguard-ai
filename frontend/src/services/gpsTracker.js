/**
 * DriveGuard AI — GPS Trip Tracking & Haversine Distance Engine
 * Frontend-only Geolocation engine using standard HTML5 Geolocation API.
 * Tracks actual latitude, longitude, accuracy, timestamps, and calculates
 * cumulative Haversine distance with anomaly jump and accuracy filtering.
 */

export const GPS_STATUS = {
  NOT_STARTED: 'NOT_STARTED',
  WAITING_FOR_GPS: 'WAITING_FOR_GPS',
  TRACKING: 'TRACKING',
  GPS_UNAVAILABLE: 'GPS_UNAVAILABLE',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  STOPPED: 'STOPPED',
};

const STORAGE_KEY = 'driveguard_gps_session_trips';
const MAX_ACCEPTABLE_ACCURACY_METERS = 80; // Filter noisy cell tower samples
const MAX_FEASIBLE_SPEED_KMH = 220; // Filter unrealistic GPS teleportation jumps

/**
 * Great-circle distance between two coordinates in kilometres via Haversine formula
 */
export function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 === lat2 && lon1 === lon2) return 0;
  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

class GpsTripTracker {
  constructor() {
    this.status = GPS_STATUS.NOT_STARTED;
    this.statusMessage = 'GPS trip tracking not active.';
    this.watchId = null;
    this.waypoints = [];
    this.taggedIncidents = [];
    this.totalDistanceKm = 0;
    this.startTime = null;
    this.endTime = null;
    this.lastValidPoint = null;
    this.listeners = new Set();
    this.isSimulated = false;
    this.simTimer = null;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    // Push current snapshot immediately
    listener(this.getSnapshot());
    return () => this.listeners.delete(listener);
  }

  notify() {
    const snapshot = this.getSnapshot();
    this.listeners.forEach((fn) => {
      try {
        fn(snapshot);
      } catch (err) {
        console.error('Error in GPS listener:', err);
      }
    });
  }

  getSnapshot() {
    return {
      status: this.status,
      statusMessage: this.statusMessage,
      waypoints: [...this.waypoints],
      taggedIncidents: [...this.taggedIncidents],
      totalDistanceKm: Number(this.totalDistanceKm.toFixed(3)),
      startTime: this.startTime,
      endTime: this.endTime,
      lastValidPoint: this.lastValidPoint ? { ...this.lastValidPoint } : null,
      isTracking: this.status === GPS_STATUS.TRACKING,
      isSimulated: this.isSimulated,
    };
  }

  /**
   * Request permission and begin active GPS tracking
   */
  startTracking() {
    if (this.status === GPS_STATUS.TRACKING) {
      return;
    }

    if (this.simTimer) {
      clearInterval(this.simTimer);
      this.simTimer = null;
    }

    if (!('geolocation' in navigator)) {
      this.status = GPS_STATUS.GPS_UNAVAILABLE;
      this.statusMessage = 'Geolocation is not supported by this browser.';
      this.notify();
      return;
    }

    // Reset session variables
    this.waypoints = [];
    this.taggedIncidents = [];
    this.totalDistanceKm = 0;
    this.startTime = Date.now();
    this.endTime = null;
    this.lastValidPoint = null;
    this.isSimulated = false;

    this.status = GPS_STATUS.WAITING_FOR_GPS;
    this.statusMessage = 'Requesting location permission and acquiring GPS fix...';
    this.notify();

    const options = {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 0,
    };

    try {
      this.watchId = navigator.geolocation.watchPosition(
        (position) => this.handlePositionUpdate(position),
        (error) => this.handlePositionError(error),
        options
      );
    } catch (err) {
      this.status = GPS_STATUS.GPS_UNAVAILABLE;
      this.statusMessage = `Failed to initialize geolocation: ${err.message}`;
      this.notify();
    }
  }

  handlePositionUpdate(position) {
    const { latitude, longitude, accuracy, altitude, speed } = position.coords;
    const timestamp = position.timestamp || Date.now();

    // 1. Accuracy filter: reject excessively noisy samples
    if (accuracy && accuracy > MAX_ACCEPTABLE_ACCURACY_METERS) {
      this.statusMessage = `Weak signal (±${Math.round(accuracy)}m). Waiting for high-accuracy fix...`;
      this.notify();
      return;
    }

    const currentPoint = {
      lat: Number(latitude.toFixed(6)),
      lng: Number(longitude.toFixed(6)),
      accuracy: accuracy ? Number(accuracy.toFixed(1)) : null,
      altitude: altitude ? Number(altitude.toFixed(1)) : null,
      speed: speed ? Number((speed * 3.6).toFixed(1)) : null, // Convert m/s to km/h
      timestamp,
    };

    // 2. Anomaly jump & speed filter
    if (this.lastValidPoint) {
      const distanceStepKm = haversineDistanceKm(
        this.lastValidPoint.lat,
        this.lastValidPoint.lng,
        currentPoint.lat,
        currentPoint.lng
      );

      const dtHours = Math.max(0.0001, (timestamp - this.lastValidPoint.timestamp) / 3600000);
      const calculatedSpeedKmh = distanceStepKm / dtHours;

      // Filter sudden GPS teleportation jumps
      if (calculatedSpeedKmh > MAX_FEASIBLE_SPEED_KMH && distanceStepKm > 0.5) {
        this.statusMessage = 'Filtered unrealistic GPS jump.';
        this.notify();
        return;
      }

      // Add cumulative distance only if movement is greater than minimal GPS drift threshold (3 meters)
      if (distanceStepKm > 0.003) {
        this.totalDistanceKm += distanceStepKm;
      }
    }

    this.lastValidPoint = currentPoint;
    this.waypoints.push(currentPoint);
    this.status = GPS_STATUS.TRACKING;
    this.statusMessage = `Tracking active (±${Math.round(accuracy || 0)}m accuracy).`;
    this.notify();
  }

  handlePositionError(error) {
    if (this.waypoints.length > 0) {
      // We already have some points, don't crash, just notify signal loss
      this.statusMessage = 'GPS signal temporarily lost. Waiting for satellite lock...';
      this.notify();
      return;
    }

    switch (error.code) {
      case error.PERMISSION_DENIED:
        this.status = GPS_STATUS.PERMISSION_DENIED;
        this.statusMessage =
          'Location access was denied. Please allow location permissions in your browser address bar.';
        break;
      case error.POSITION_UNAVAILABLE:
        this.status = GPS_STATUS.GPS_UNAVAILABLE;
        this.statusMessage = 'GPS position is currently unavailable.';
        break;
      case error.TIMEOUT:
        this.status = GPS_STATUS.GPS_UNAVAILABLE;
        this.statusMessage = 'Acquiring GPS fix timed out. Ensure GPS/Location services are enabled.';
        break;
      default:
        this.status = GPS_STATUS.GPS_UNAVAILABLE;
        this.statusMessage = `GPS error: ${error.message || 'Unknown error'}`;
    }

    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.notify();
  }

  /**
   * Stop active GPS tracking and save session-local summary
   */
  stopTracking() {
    if (this.watchId !== null && 'geolocation' in navigator) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }

    if (this.simTimer) {
      clearInterval(this.simTimer);
      this.simTimer = null;
    }

    this.endTime = Date.now();
    this.status = GPS_STATUS.STOPPED;
    this.statusMessage = `Trip tracking finished. Total distance: ${this.totalDistanceKm.toFixed(2)} km.`;

    // Save to session-local store so Trip History can inspect it
    this.saveSessionLocalTrip();
    this.notify();
  }

  /**
   * Attach an authentic safety incident to the nearest GPS coordinates
   */
  attachIncident(incident) {
    if (!incident) return;

    // Attach latest valid GPS coordinates if tracking
    const eventRecord = {
      id: `INC-GPS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: incident.riskReason || incident.type || 'Safety Alert',
      severity: incident.riskLevel || incident.severity || 'WARNING',
      timestamp: incident.timestamp || Date.now(),
      metric: incident.metric || incident.alertMessage || '',
      hasCoordinates: false,
      lat: null,
      lng: null,
      accuracy: null,
    };

    if (this.lastValidPoint) {
      eventRecord.hasCoordinates = true;
      eventRecord.lat = this.lastValidPoint.lat;
      eventRecord.lng = this.lastValidPoint.lng;
      eventRecord.accuracy = this.lastValidPoint.accuracy;
    }

    this.taggedIncidents.push(eventRecord);
    this.notify();
    return eventRecord;
  }

  /**
   * Development Lab Mode: Simulate a sample driving route
   * Explicitly labeled as DEV LAB SIMULATION; never presented as authentic GPS.
   */
  startDevLabSimulation() {
    this.stopTracking();
    this.isSimulated = true;
    this.status = GPS_STATUS.TRACKING;
    this.statusMessage = 'DEV LAB SIMULATION: Simulated test route active.';
    this.startTime = Date.now();
    this.endTime = null;
    this.waypoints = [];
    this.taggedIncidents = [];
    this.totalDistanceKm = 0;

    // Synthetic testing coordinates (safe automotive proving ground track)
    const baseLat = 37.7749;
    const baseLng = -122.4194;
    const testPoints = [
      { dLat: 0.0, dLng: 0.0, label: 'Start Point' },
      { dLat: 0.0025, dLng: 0.0018, label: 'Turn 1' },
      { dLat: 0.0055, dLng: 0.0035, label: 'Straight' },
      { dLat: 0.0082, dLng: 0.0068, label: 'Corner 2' },
      { dLat: 0.0105, dLng: 0.0102, label: 'Apex' },
      { dLat: 0.0085, dLng: 0.0135, label: 'Exit' },
      { dLat: 0.0045, dLng: 0.0145, label: 'Final Turn' },
      { dLat: 0.0008, dLng: 0.0115, label: 'Finish Straight' },
    ];

    let step = 0;
    const addSimPoint = () => {
      if (step >= testPoints.length) {
        clearInterval(this.simTimer);
        this.simTimer = null;
        this.statusMessage = 'DEV LAB SIMULATION: Route complete.';
        this.notify();
        return;
      }

      const p = testPoints[step];
      const pt = {
        lat: Number((baseLat + p.dLat).toFixed(6)),
        lng: Number((baseLng + p.dLng).toFixed(6)),
        accuracy: 4.5,
        speed: 48,
        timestamp: Date.now(),
      };

      if (this.lastValidPoint) {
        const d = haversineDistanceKm(
          this.lastValidPoint.lat,
          this.lastValidPoint.lng,
          pt.lat,
          pt.lng
        );
        this.totalDistanceKm += d;
      }

      this.lastValidPoint = pt;
      this.waypoints.push(pt);

      // Simulate an incident at step 4
      if (step === 3) {
        this.attachIncident({
          riskReason: 'DROWSINESS_EYE_CLOSURE',
          riskLevel: 'CRITICAL',
          metric: 'EAR 0.14 · Eye Closure (1.8s)',
        });
      } else if (step === 6) {
        this.attachIncident({
          riskReason: 'HEAD_DOWN_DISTRACTION',
          riskLevel: 'WARNING',
          metric: 'Pitch -22.5° · Head Down',
        });
      }

      step++;
      this.notify();
    };

    addSimPoint();
    this.simTimer = setInterval(addSimPoint, 1500);
  }

  saveSessionLocalTrip() {
    try {
      const tripsJson = sessionStorage.getItem(STORAGE_KEY);
      const existing = tripsJson ? JSON.parse(tripsJson) : [];
      const durationSec = this.startTime && this.endTime ? Math.round((this.endTime - this.startTime) / 1000) : 0;
      const m = Math.floor(durationSec / 60);
      const s = durationSec % 60;
      const durationFormatted = m > 0 ? `${m}m ${s}s` : `${s}s`;

      const tripRecord = {
        id: `GPS-TRIP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
        startTime: this.startTime,
        endTime: this.endTime,
        duration: durationFormatted,
        distanceKm: Number(this.totalDistanceKm.toFixed(2)),
        waypointsCount: this.waypoints.length,
        waypoints: this.waypoints,
        taggedIncidents: this.taggedIncidents,
        isSimulated: this.isSimulated,
        createdAt: new Date().toISOString(),
      };

      existing.unshift(tripRecord);
      // Keep up to 10 session trips
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 10)));
    } catch (err) {
      console.warn('Could not save session-local GPS trip:', err);
    }
  }

  getSessionLocalTrips() {
    try {
      const tripsJson = sessionStorage.getItem(STORAGE_KEY);
      return tripsJson ? JSON.parse(tripsJson) : [];
    } catch (err) {
      return [];
    }
  }
}

export const gpsTracker = new GpsTripTracker();
