import asyncio
import json
import logging
import time
import cv2
import numpy as np
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from engine.face_mesh import DriverFaceMeshEngine
from engine.risk_scorer import DriverRiskScorer
from storage import init_db, get_all_trips, SessionManager

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("DriveGuardAI")

app = FastAPI(title="DriveGuard AI Telemetry API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global engines & state
mesh_engine = DriverFaceMeshEngine()
risk_scorer = DriverRiskScorer()
session_manager = SessionManager(min_session_seconds=5.0)

is_monitoring = True
cap = None
camera_active = False

latest_frame_bytes = None
latest_telemetry = {
    "isMonitoring": True,
    "riskScore": 0,
    "riskLevel": "NOMINAL",
    "riskReason": "NONE",
    "ear": 0.0,
    "mar": 0.0,
    "headPitch": 0.0,
    "headYaw": 0.0,
    "headRoll": 0.0,
    "blinkRate": 0,
    "perclos": 0.0,
    "eyesClosedTime": 0.0,
    "blinkScore": 0.0,
    "lookDownScore": 0.0,
    "fps": 0,
    "latencyMs": 0,
    "alertMessage": "Awaiting camera capture...",
}

active_websockets = set()


def create_standby_frame(text="MONITORING PAUSED"):
    """Clean editorial paused frame when monitoring is stopped."""
    img = np.zeros((480, 640, 3), dtype=np.uint8)
    img[:] = (234, 232, 227) # Warm off-white #EAE8E3 (BGR: 227, 232, 234)

    # Architectural grid lines in subtle #D8D5CF (BGR: 207, 213, 216)
    grid_color = (207, 213, 216)
    for x in range(0, 640, 40):
        cv2.line(img, (x, 0), (x, 480), grid_color, 1)
    for y in range(0, 480, 40):
        cv2.line(img, (0, y), (640, y), grid_color, 1)

    # Frame border and reticle
    ink_color = (23, 23, 23)
    cv2.circle(img, (320, 240), 75, ink_color, 1)
    cv2.circle(img, (320, 240), 4, ink_color, -1)
    cv2.line(img, (300, 240), (340, 240), ink_color, 1)
    cv2.line(img, (320, 220), (320, 260), ink_color, 1)

    # Corner brackets
    bracket_len = 16
    cv2.line(img, (30, 30), (30 + bracket_len, 30), ink_color, 2)
    cv2.line(img, (30, 30), (30, 30 + bracket_len), ink_color, 2)
    cv2.line(img, (610, 30), (610 - bracket_len, 30), ink_color, 2)
    cv2.line(img, (610, 30), (610, 30 + bracket_len), ink_color, 2)
    cv2.line(img, (30, 450), (30 + bracket_len, 450), ink_color, 2)
    cv2.line(img, (30, 450), (30, 450 - bracket_len), ink_color, 2)
    cv2.line(img, (610, 450), (610 - bracket_len, 450), ink_color, 2)
    cv2.line(img, (610, 450), (610, 450 - bracket_len), ink_color, 2)

    cv2.putText(img, text, (200, 180), cv2.FONT_HERSHEY_SIMPLEX, 0.75, ink_color, 2, cv2.LINE_AA)
    cv2.putText(img, "OPTICAL INFERENCE & WEBCAM ARE STOPPED", (135, 345), cv2.FONT_HERSHEY_SIMPLEX, 0.52, (109, 115, 119), 1, cv2.LINE_AA)
    cv2.putText(img, "CLICK 'START MONITORING' IN THE DASHBOARD TO RESUME", (105, 375), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (109, 115, 119), 1, cv2.LINE_AA)
    return img


def create_synthetic_frame(text="SIMULATED COCKPIT FEED"):
    """Fallback frame when monitoring is active but no physical webcam is found."""
    img = np.zeros((480, 640, 3), dtype=np.uint8)
    img[:] = (234, 232, 227)

    for x in range(0, 640, 40):
        cv2.line(img, (x, 0), (x, 480), (207, 213, 216), 1)
    for y in range(0, 480, 40):
        cv2.line(img, (0, y), (640, y), (207, 213, 216), 1)

    cv2.circle(img, (320, 240), 90, (50, 75, 232), 1)
    cv2.line(img, (300, 240), (340, 240), (50, 75, 232), 1)
    cv2.line(img, (320, 220), (320, 260), (50, 75, 232), 1)

    cv2.putText(img, text, (180, 200), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (23, 23, 23), 1, cv2.LINE_AA)
    cv2.putText(img, "PHYSICAL CAMERA NOT DETECTED (ATTACH WEBCAM)", (110, 280), cv2.FONT_HERSHEY_SIMPLEX, 0.48, (109, 115, 119), 1, cv2.LINE_AA)
    return img


def start_camera():
    global cap, camera_active
    if cap is None or not cap.isOpened():
        logger.info("Starting optical capture loop on webcam index 0...")
        cap = cv2.VideoCapture(0)
        if cap.isOpened():
            cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
            cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
            cap.set(cv2.CAP_PROP_FPS, 30)
            camera_active = True
            logger.info("Physical webcam index 0 connected successfully.")
        else:
            cap = None
            camera_active = False
            logger.warning("No physical webcam found at index 0.")


def stop_camera():
    global cap, camera_active
    if cap is not None:
        logger.info("Releasing physical webcam hardware...")
        cap.release()
        cap = None
    camera_active = False
    logger.info("Webcam hardware released.")


async def camera_worker():
    global latest_frame_bytes, latest_telemetry, camera_active, is_monitoring

    # Attempt initial camera connection if monitoring is active
    if is_monitoring:
        start_camera()

    frame_count = 0
    fps_start_time = time.time()
    current_fps = 30

    while True:
        t0 = time.time()

        # -------------------------------------------------------------
        # Case A: Live Monitoring is STOPPED / PAUSED
        # -------------------------------------------------------------
        if not is_monitoring:
            if cap is not None:
                stop_camera()

            # Generate standby frame and paused telemetry
            standby_frame = create_standby_frame()
            ret_enc, buffer = cv2.imencode(".jpg", standby_frame, [int(cv2.IMWRITE_JPEG_QUALITY), 80])
            if ret_enc:
                latest_frame_bytes = buffer.tobytes()

            paused_telemetry = {
                "isMonitoring": False,
                "riskScore": 0,
                "riskLevel": "NOMINAL",
                "riskReason": "NONE",
                "ear": 0.0,
                "mar": 0.0,
                "headPitch": 0.0,
                "headYaw": 0.0,
                "headRoll": 0.0,
                "blinkRate": 0,
                "perclos": 0.0,
                "eyesClosedTime": 0.0,
                "blinkScore": 0.0,
                "lookDownScore": 0.0,
                "fps": 0,
                "latencyMs": 0,
                "alertMessage": "MONITORING PAUSED — CLICK START TO RESUME",
            }
            latest_telemetry = paused_telemetry

            # Broadcast paused state to connected frontends
            if active_websockets:
                msg = json.dumps(paused_telemetry)
                disconnected = []
                for ws in list(active_websockets):
                    try:
                        await ws.send_text(msg)
                    except Exception:
                        disconnected.append(ws)
                for ws in disconnected:
                    active_websockets.discard(ws)

            # Sleep 100ms when idle to consume zero CPU
            await asyncio.sleep(0.1)
            continue

        # -------------------------------------------------------------
        # Case B: Live Monitoring is ACTIVE
        # -------------------------------------------------------------
        if cap is None or not cap.isOpened():
            start_camera()

        if cap is not None and cap.isOpened():
            ret, frame = cap.read()
            if not ret or frame is None:
                frame = create_synthetic_frame()
        else:
            frame = create_synthetic_frame()

        # Run MediaPipe face mesh detection & biometrics
        try:
            results = mesh_engine.process_frame(frame)
            telemetry = risk_scorer.update(results)
            annotated_frame = results["annotated_frame"]
        except Exception as e:
            logger.error(f"Inference error: {e}")
            annotated_frame = frame
            telemetry = {
                "isMonitoring": True,
                "riskScore": 0,
                "riskLevel": "NOMINAL",
                "riskReason": "NONE",
                "ear": 0.0,
                "mar": 0.0,
                "headPitch": 0.0,
                "headYaw": 0.0,
                "headRoll": 0.0,
                "blinkRate": 0,
                "perclos": 0.0,
                "eyesClosedTime": 0.0,
                "alertMessage": "INFERENCE ENGINE ERROR",
            }

        # Calculate FPS & processing latency
        frame_count += 1
        elapsed_fps = time.time() - fps_start_time
        if elapsed_fps >= 1.0:
            current_fps = round(frame_count / elapsed_fps)
            frame_count = 0
            fps_start_time = time.time()

        latency_ms = int((time.time() - t0) * 1000)

        telemetry["isMonitoring"] = True
        telemetry["fps"] = current_fps
        telemetry["latencyMs"] = latency_ms
        latest_telemetry = telemetry

        # Update active monitoring session with real incident detections
        session_manager.process_telemetry(telemetry)

        # Encode frame as JPEG for MJPEG stream
        ret_enc, buffer = cv2.imencode(".jpg", annotated_frame, [int(cv2.IMWRITE_JPEG_QUALITY), 80])
        if ret_enc:
            latest_frame_bytes = buffer.tobytes()

        # Broadcast telemetry to connected WebSockets
        if active_websockets:
            msg = json.dumps(telemetry)
            disconnected = []
            for ws in list(active_websockets):
                try:
                    await ws.send_text(msg)
                except Exception:
                    disconnected.append(ws)
            for ws in disconnected:
                active_websockets.discard(ws)

        # ~30 FPS pacing
        sleep_time = max(0.005, 0.033 - (time.time() - t0))
        await asyncio.sleep(sleep_time)


@app.on_event("startup")
async def startup_event():
    init_db()
    if is_monitoring:
        session_manager.start_session()
    asyncio.create_task(camera_worker())


# -------------------------------------------------------------
# REST & Monitoring Control Endpoints
# -------------------------------------------------------------
@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "DriveGuard AI Telemetry Engine",
        "is_monitoring": is_monitoring,
        "camera_active": camera_active,
        "connected_clients": len(active_websockets),
        "timestamp": time.time(),
    }


@app.get("/api/monitoring/status")
def get_monitoring_status():
    return {
        "is_monitoring": is_monitoring,
        "camera_active": camera_active,
        "connected_clients": len(active_websockets),
    }


@app.post("/api/monitoring/start")
def start_monitoring_endpoint():
    global is_monitoring
    is_monitoring = True
    session_manager.start_session()
    # Reset temporal timers for clean restart
    risk_scorer.eyes_closed_start = None
    risk_scorer.yawn_start = None
    risk_scorer.distraction_start = None
    logger.info("Live monitoring started via API.")
    return {"status": "ok", "is_monitoring": True}


@app.post("/api/monitoring/stop")
def stop_monitoring_endpoint():
    global is_monitoring
    is_monitoring = False
    stop_camera()
    finalized_trip = session_manager.stop_session()
    if finalized_trip:
        logger.info(f"Live monitoring stopped via API — session {finalized_trip['id']} saved.")
    else:
        logger.info("Live monitoring stopped via API — no qualifying session to save.")
    return {"status": "ok", "is_monitoring": False, "trip": finalized_trip}


@app.get("/api/trips")
def get_trips_endpoint():
    """Returns all recorded driver monitoring sessions ordered newest first."""
    try:
        return get_all_trips()
    except Exception as e:
        logger.error(f"Error reading trips from database: {e}")
        return []


@app.get("/api/trips/{trip_id}")
def get_trip_detail_endpoint(trip_id: str):
    """Returns details of a specific trip by its ID."""
    from fastapi import HTTPException
    trips = get_all_trips()
    for t in trips:
        if t["id"] == trip_id:
            return t
    raise HTTPException(status_code=404, detail="Trip record not found")


@app.post("/api/monitoring/toggle")
def toggle_monitoring_endpoint():
    global is_monitoring
    if is_monitoring:
        return stop_monitoring_endpoint()
    else:
        return start_monitoring_endpoint()


@app.websocket("/ws/telemetry")
async def websocket_telemetry(websocket: WebSocket):
    global is_monitoring
    await websocket.accept()
    active_websockets.add(websocket)
    logger.info(f"WebSocket client connected. Total clients: {len(active_websockets)}")
    try:
        # Send initial telemetry immediately
        await websocket.send_text(json.dumps(latest_telemetry))
        while True:
            # Receive commands from frontend client
            text = await websocket.receive_text()
            try:
                data = json.loads(text)
                action = data.get("action")
                if action == "start":
                    start_monitoring_endpoint()
                elif action == "stop":
                    stop_monitoring_endpoint()
                elif action == "toggle":
                    toggle_monitoring_endpoint()
            except Exception:
                pass
    except WebSocketDisconnect:
        active_websockets.discard(websocket)
        logger.info(f"WebSocket client disconnected. Remaining: {len(active_websockets)}")
    except Exception as e:
        active_websockets.discard(websocket)
        logger.warning(f"WebSocket connection closed: {e}")


def generate_mjpeg_stream():
    global latest_frame_bytes
    while True:
        if latest_frame_bytes is not None:
            yield (
                b"--frame\r\n"
                b"Content-Type: image/jpeg\r\n\r\n" + latest_frame_bytes + b"\r\n"
            )
        time.sleep(0.033)


@app.get("/video_feed")
def video_feed():
    return StreamingResponse(
        generate_mjpeg_stream(),
        media_type="multipart/x-mixed-replace; boundary=frame",
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=False)
