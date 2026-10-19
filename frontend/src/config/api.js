/**
 * API & WebSocket Endpoint Configuration
 * Defaults to local Python FastAPI backend, but can be configured
 * via VITE_API_BASE_URL and VITE_WS_URL for deployed environments.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
export const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/telemetry';
export const VIDEO_FEED_URL = `${API_BASE_URL}/video_feed`;
