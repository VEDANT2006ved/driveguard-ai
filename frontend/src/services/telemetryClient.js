/**
 * Telemetry WebSocket Client for DriveGuard AI
 * Connects directly to the Python FastAPI backend engine or Cloudflare Tunnel.
 */

import { getWsBaseUrl } from '../config/api';

class TelemetryClient {
  constructor() {
    this.url = getWsBaseUrl();
    this.ws = null;
    this.reconnectTimer = null;
    this.onMessageCallback = null;
    this.onStatusChangeCallback = null;
    this.status = 'offline';
    this.retryCount = 0;

    // Listen for runtime backend URL changes from UI or localStorage
    if (typeof window !== 'undefined') {
      window.addEventListener('driveguard:backend-url-changed', () => {
        this.reconnect(getWsBaseUrl());
      });
    }
  }

  connect({ onMessage, onStatusChange }) {
    this.onMessageCallback = onMessage;
    this.onStatusChangeCallback = onStatusChange;
    this.url = getWsBaseUrl();
    this._initWebSocket();
  }

  reconnect(newUrl = null) {
    if (newUrl) {
      this.url = newUrl;
    } else {
      this.url = getWsBaseUrl();
    }
    this.retryCount = 0;
    this.disconnect();
    this._initWebSocket();
  }

  _initWebSocket() {
    try {
      this._updateStatus('calibrating');
      const wsUrl = this.url || getWsBaseUrl();
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.retryCount = 0;
        this._updateStatus('online');
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (this.onMessageCallback) {
            this.onMessageCallback(data);
          }
        } catch (err) {
          console.warn('[TelemetryClient] JSON parse error:', err);
        }
      };

      this.ws.onclose = () => {
        this._updateStatus('offline');
        this._scheduleReconnect();
      };

      this.ws.onerror = () => {
        this._updateStatus('offline');
        if (this.ws) {
          try {
            this.ws.close();
          } catch {
            // Already closed
          }
        }
      };
    } catch {
      this._updateStatus('offline');
      this._scheduleReconnect();
    }
  }

  _updateStatus(status) {
    if (this.status !== status) {
      this.status = status;
      if (this.onStatusChangeCallback) {
        this.onStatusChangeCallback(status);
      }
    }
  }

  _scheduleReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    // Exponential backoff capped at 6s
    const delay = Math.min(6000, 1500 * Math.pow(1.4, this.retryCount));
    this.retryCount++;
    this.reconnectTimer = setTimeout(() => {
      this._initWebSocket();
    }, delay);
  }

  sendAction(action) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ action }));
    }
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      try {
        this.ws.close();
      } catch {
        // Safe disconnect
      }
      this.ws = null;
    }
    this._updateStatus('offline');
  }

  getStatus() {
    return this.status;
  }

  getUrl() {
    return this.url;
  }
}

export const telemetryClient = new TelemetryClient();
