/**
 * DriveGuard AI — Production API & WebSocket Configuration
 * Supports build-time Vercel environment variables (VITE_API_BASE_URL, VITE_WS_URL)
 * and runtime browser overrides via localStorage ('driveguard_backend_url') for
 * seamless live demonstration with zero-rebuild tunnel switching.
 */

const STORAGE_KEY = 'driveguard_backend_url';

export function getCustomBackendUrl() {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && saved.trim()) return saved.trim().replace(/\/+$/, '');
    } catch {
      // Ignore localStorage restrictions
    }
  }
  return null;
}

export function setCustomBackendUrl(url) {
  if (typeof window !== 'undefined') {
    try {
      if (url && url.trim()) {
        const cleaned = url.trim().replace(/\/+$/, '');
        localStorage.setItem(STORAGE_KEY, cleaned);
        window.dispatchEvent(new CustomEvent('driveguard:backend-url-changed', { detail: cleaned }));
        return cleaned;
      } else {
        localStorage.removeItem(STORAGE_KEY);
        window.dispatchEvent(new CustomEvent('driveguard:backend-url-changed', { detail: null }));
        return null;
      }
    } catch {
      return null;
    }
  }
  return null;
}

export function getApiBaseUrl() {
  const custom = getCustomBackendUrl();
  if (custom) return custom;

  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.trim().replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined') {
    // If running locally in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:8000';
    }
  }

  // Fallback
  return 'http://localhost:8000';
}

export function getWsBaseUrl(customApiUrl) {
  if (import.meta.env.VITE_WS_URL && !customApiUrl && !getCustomBackendUrl()) {
    return import.meta.env.VITE_WS_URL.trim();
  }

  const apiBase = customApiUrl || getApiBaseUrl();
  if (!apiBase) return 'ws://localhost:8000/ws/telemetry';

  if (apiBase.startsWith('https://')) {
    return `${apiBase.replace(/^https:\/\//, 'wss://')}/ws/telemetry`;
  }
  if (apiBase.startsWith('http://')) {
    return `${apiBase.replace(/^http:\/\//, 'ws://')}/ws/telemetry`;
  }
  return `wss://${apiBase}/ws/telemetry`;
}

export function getVideoFeedUrl(customApiUrl) {
  const apiBase = customApiUrl || getApiBaseUrl();
  return `${apiBase}/video_feed`;
}

// Named constant exports for backward compatibility
export const API_BASE_URL = getApiBaseUrl();
export const WS_BASE_URL = getWsBaseUrl();
export const VIDEO_FEED_URL = getVideoFeedUrl();

/**
 * Health check helper with timeout
 */
export async function testBackendConnection(targetUrl) {
  const base = (targetUrl || getApiBaseUrl()).replace(/\/+$/, '');
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${base}/health`, {
      method: 'GET',
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
    });
    clearTimeout(timeoutId);
    if (!res.ok) {
      return { ok: false, status: res.status, error: `HTTP ${res.status}` };
    }
    const data = await res.json();
    return { ok: true, data };
  } catch (err) {
    return {
      ok: false,
      error: err.name === 'AbortError' ? 'Connection timed out (4s)' : err.message || 'Network unreachable',
    };
  }
}
