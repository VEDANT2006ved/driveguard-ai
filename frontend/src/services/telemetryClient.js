/**
 * Telemetry WebSocket Client for DriveGuard AI
 * Connects directly to the Python FastAPI backend engine.
 */

class TelemetryClient {
  constructor(url = 'ws://localhost:8000/ws/telemetry') {
    this.url = url;
    this.ws = null;
    this.reconnectTimer = null;
    this.onMessageCallback = null;
    this.onStatusChangeCallback = null;
    this.status = 'offline';
    this.retryCount = 0;
  }

  connect({ onMessage, onStatusChange }) {
    this.onMessageCallback = onMessage;
    this.onStatusChangeCallback = onStatusChange;
    this._initWebSocket();
  }

  _initWebSocket() {
    try {
      this._updateStatus('calibrating');
      this.ws = new WebSocket(this.url);

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
          this.ws.close();
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
    // Exponential backoff capped at 5s
    const delay = Math.min(5000, 1000 * Math.pow(1.5, this.retryCount));
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
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this._updateStatus('offline');
  }
}

export const telemetryClient = new TelemetryClient();
