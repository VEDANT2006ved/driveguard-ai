# DriveGuard AI — Editorial Motion-Led Driver Telemetry & Safety Architecture

An editorial, minimalist driver-attentiveness telemetry application inspired by **huyml.co**, **Lucas Perret**, and **Ari Ahokas** design principles. Pairs real-time computer vision landmark analysis with temporal risk state-machines, persistent SQLite session auditing, audible automotive chimes, and browser desktop safety notifications.

---

## Visual Design System & Palette

- **Canvas Background**: `#F0EFEC` (Warm off-white base)
- **Primary Ink Typography**: `#171717` (Deep ink black)
- **Secondary Typography**: `#77736D` (Editorial warm grey)
- **Subtle Dividers & Rules**: `#D8D5CF`
- **Alert Accent**: `#E84B32` (Vibrant alert red for warnings, micro-sleep, and critical safety states)
- **Nominal Olive Accent**: `#2D5A27` (Botanical dark olive for nominal and recovery states)
- **Typography Pairing**:
  - Expressive Display Serif: `Instrument Serif` & `Playfair Display`
  - Body & UI Architecture: `Plus Jakarta Sans`
  - Precision Telemetry: `JetBrains Mono`
- **Illustrations**: Original hand-drawn line-art vector driver and cockpit artwork with dynamic steering, eye blinks, and alert states.

---

## Architecture & Data Flow

```
+---------------------------------------------------------------------------------------+
|                                    PHYSICAL HARDWARE                                  |
|   Webcam (Index 0, 640x480 @ 30 FPS)  OR  Synthetic Standby Generator (No-Camera)     |
+-------------------------------------------+-------------------------------------------+
                                            |
                                            v
+---------------------------------------------------------------------------------------+
|                                  BACKEND ENGINE (Python)                              |
|                                                                                       |
|   1. MediaPipe FaceLandmarker (face_mesh.py):                                         |
|      - 478 3D facial landmarks                                                        |
|      - Eye Aspect Ratio (EAR) & Mouth Aspect Ratio (MAR)                              |
|      - 3D Head Pose via Perspective-n-Point solvePnP (Pitch, Yaw, Roll)               |
|      - Neural blendshape activations (eyeBlinkLeft/Right, eyeLookDownLeft/Right)      |
|                                                                                       |
|   2. Temporal Risk Scorer (risk_scorer.py):                                           |
|      - 45-frame neutral posture calibration baseline                                  |
|      - Median temporal filtering on EAR                                               |
|      - Separation of head-down distraction from eye closure                           |
|      - Drowsiness: closure >= 1.0s (WARN) -> >= 1.8s (CRITICAL, score 92)             |
|      - Sustained Yawning: MAR > 0.55 for >= 1.2s (WARN)                               |
|      - Head-Down Distraction: Pitch < -16 deg for >= 2.0s (WARN) -> >= 4.5s (CRIT)    |
|      - Lateral Distraction: Yaw > 24 deg for >= 2.0s (WARN)                           |
|      - Face Not Detected: Immediate 0% risk, non-punitive fallback                    |
|                                                                                       |
|   3. Session Manager & SQLite Persistence (storage.py):                               |
|      - Active session tracking with start/stop deduplication                          |
|      - Minimum duration threshold (5.0s) to discard transient clicks                  |
|      - Heuristic safety score: 100 - (15 * Criticals) - (5 * Warnings)                |
|      - Honest unmeasured distance ("--") without fabricated GPS data                  |
|      - Stored in backend/driveguard.db (table: trips)                                 |
+-------------------+-----------------------------------+-------------------------------+
                    |                                   |
         WebSocket  | `/ws/telemetry`                   | MJPEG `/video_feed`
         REST API   | `/api/trips`, `/api/monitoring/*` | REST `/health`
                    |                                   |
                    v                                   v
+---------------------------------------------------------------------------------------+
|                                  FRONTEND CLIENT (Vite / React 19)                    |
|                                                                                       |
|   - telemetryClient.js: Resilient WebSocket client with auto exponential backoff      |
|   - alertController.js: Web Audio multi-tone synthesis (Critical klaxon, Warning      |
|     chime, Recovery triad, master mute, and Notification API integration)             |
|                                                                                       |
|   - Views:                                                                            |
|     01 Overview: Editorial magazine layout, driver illustration & ink gauge           |
|     02 Live Monitor: Responsive optical HUD (stacked on mobile, 2-column on desktop)  |
|     03 Analytics: 400-packet live risk waveform + Historical Audit Vault trends       |
|     04 Trip History: Chronological audit ledger with incident biometrics & grades     |
+---------------------------------------------------------------------------------------+
```

---

## Application Structure

```
micro project - AIML/
├── backend/                       # Python Computer Vision & Telemetry Engine
│   ├── engine/
│   │   ├── face_mesh.py           # MediaPipe FaceLandmarker, EAR, MAR & 3D Head Pose
│   │   ├── risk_scorer.py         # Multi-signal fatigue scoring, PERCLOS & calibration
│   │   └── __init__.py
│   ├── models/
│   │   └── face_landmarker.task   # MediaPipe neural asset bundle
│   ├── driveguard.db              # SQLite persistence database (trips & incidents)
│   ├── evaluate.py                # Standalone Step 9 algorithm benchmark suite
│   ├── evaluation_report.json     # Machine-readable evaluation report
│   ├── requirements.txt           # Python backend dependencies
│   ├── server.py                  # FastAPI + WebSockets + MJPEG stream + controls
│   └── storage.py                 # SQLite storage layer, baseline seeding & session manager
│
├── frontend/                      # Vite + React 19 Editorial Motion Layer
│   ├── src/
│   │   ├── components/
│   │   │   ├── AlertBanner.jsx    # Editorial alert banners (Nominal, Warning, Critical, Recovery)
│   │   │   ├── DriverIllustration.jsx # Hand-drawn vector driver cockpit line-art
│   │   │   ├── Navigation.jsx     # Sticky header, status badge, sound toggle & notif modal
│   │   │   ├── Preloader.jsx      # Editorial opening sequence & paper wipe
│   │   │   └── RiskGauge.jsx      # Circular ink line risk meter (animates on data change)
│   │   ├── services/
│   │   │   ├── alertController.js # Web Audio synthesized chimes & desktop notifications
│   │   │   └── telemetryClient.js # WebSocket client with automatic reconnection logic
│   │   ├── styles/
│   │   │   ├── animations.css     # Keyframes, paper reveals & reduced-motion support
│   │   │   └── tokens.css         # Palette, typography & responsive layout utilities
│   │   ├── views/
│   │   │   ├── AnalyticsView.jsx  # Live 400-sample waveform + Historical Audit Vault
│   │   │   ├── LiveMonitorView.jsx# Optical HUD with responsive mobile-stacked layout
│   │   │   ├── OverviewView.jsx   # Editorial magazine overview & diagnostics
│   │   │   └── TripHistoryView.jsx# Audit session ledger & incident timestamps
│   │   ├── App.jsx                # Main application coordinator & notification modal
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## Prerequisites

- **Python**: Version 3.10 to 3.14 (tested and verified with Python 3.14.7).
- **Node.js**: Version 18.0.0 or higher (with `npm`).
- **Webcam**: Standard USB or integrated webcam (webcam index `0`). If no camera is attached, the backend automatically generates a clean synthetic standby feed so all features remain testable.
- **Operating System**: Windows (tested with PowerShell), macOS, or Linux.

---

## Running the Application

Open two separate Windows PowerShell terminals from the project root directory (`c:\Users\HP\Music\micro project - AIML`).

### Terminal 1: Start the Backend Telemetry Engine

```powershell
cd "c:\Users\HP\Music\micro project - AIML"
pip install -r backend/requirements.txt
python backend/server.py
```

*Server boots on `http://localhost:8000`. Database verified at `backend/driveguard.db`.*

### Terminal 2: Start the Frontend Application

```powershell
cd "c:\Users\HP\Music\micro project - AIML\frontend"
npm install
npm run dev
```

*Frontend dev server launches at `http://localhost:5173`.*

---

## Local Endpoints & URLs

| Service / View | URL | Description |
| :--- | :--- | :--- |
| **Frontend Dashboard** | `http://localhost:5173` | Full editorial driver telemetry application. |
| **Backend Health Check** | `http://localhost:8000/health` | Service health, monitoring flag, camera state, client count. |
| **Monitoring Status** | `http://localhost:8000/api/monitoring/status` | Current monitoring status (`is_monitoring`, `camera_active`). |
| **Trip History API** | `http://localhost:8000/api/trips` | Returns all recorded trips in descending chronological order. |
| **Trip Detail API** | `http://localhost:8000/api/trips/{trip_id}` | Detailed incident breakdown for a specific trip record. |
| **Live MJPEG Optical Stream** | `http://localhost:8000/video_feed` | 640x480 MJPEG video with facial mesh reticle overlays. |
| **Real-Time Telemetry Socket** | `ws://localhost:8000/ws/telemetry` | High-frequency JSON biometric telemetry packet stream. |

---

## Step 9: Standalone AI Reliability & Benchmark Suite

The project includes an isolated, deterministic benchmark harness that evaluates the production `DriverRiskScorer` engine across 6 standardized temporal driving scenarios without requiring a physical camera.

### Running the Evaluation Benchmark

From the project root:

```powershell
python backend/evaluate.py
```

### Evaluated Scenarios

1. **Normal Periodic Blinking**: Driver blinks naturally every 3.0s for 133ms over a 10.0s stream. Asserts zero false-positive warnings or critical alerts.
2. **Prolonged Eye Closure**: Driver closes eyes for 2.5s. Measures warning debounce latency (target ~1.0s) and critical escalation latency (target ~1.8s) with `DROWSINESS_EYE_CLOSURE`.
3. **Sustained Yawning**: Driver yawns with MAR=0.68 for 2.5s while eyes stay open. Asserts warning latency at ~1.2s with `DROWSINESS_YAWN` and prevents false critical eye-closure alerts.
4. **Head-Down Distraction (Eyes Open)**: Driver pitches head downward (-22.0 deg) looking at a device/keyboard with eyes open for 5.0s. Confirms `HEAD_DOWN_DISTRACTION` triggers at ~2.0s and escalates to critical head-slump at ~4.5s. **Asserts zero false drowsiness alerts.**
5. **Lateral Head Movement**: Driver turns head sideways (+30.0 deg yaw) for 3.5s. Asserts `LATERAL_DISTRACTION` warning at ~2.0s with score clamped strictly within warning tier.
6. **Face Not Detected / Occlusion**: Camera loses face tracking for 2.0s. Asserts immediate non-punitive 0% risk score, alert message `"OCCUPANT FACE NOT DETECTED IN CAMERA FRAME"`, and clean state recovery.

### Evaluation Report & Metrics

The benchmark saves its complete report to:
`backend/evaluation_report.json`

**Latest Benchmark Results (1,005 Simulated Frames @ 30 FPS)**:
- **Scenarios Passed**: 6/6 (100%)
- **Classification Accuracy**: 99.40%
- **Precision (PPV)**: 100.00%
- **Recall / Sensitivity**: 97.26%
- **Specificity**: 100.00%
- **F1-Score**: 0.9861
- **False Positives**: 0

---

## SQLite Database & Trip Persistence

- **Location**: `backend/driveguard.db`
- **Table Schema**:
  ```sql
  CREATE TABLE trips (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      duration TEXT NOT NULL,
      distance TEXT NOT NULL,
      safety_score INTEGER NOT NULL,
      grade TEXT NOT NULL,
      status TEXT NOT NULL,
      incidents_json TEXT NOT NULL,
      created_at TEXT NOT NULL
  );
  ```
- **Baseline Seeding**: Preserves three historical records (`TRIP-2026-039`, `TRIP-2026-040`, `TRIP-2026-041`) on startup; will never overwrite existing records.
- **Session Lifecycle**:
  - Starting monitoring begins a session.
  - Stopping monitoring finalizes and commits the session to SQLite if duration >= 5.0 seconds. Sub-5-second toggles are discarded as transient clicks.
  - Duplicate start or stop requests are ignored by thread-safe locks.
- **Safety Score Calculation**:
  - Starts at 100 points baseline.
  - Deducts 15 points per discrete `CRITICAL` event (prolonged eye closure).
  - Deducts 5 points per discrete `WARNING` event (sustained yawning, head-down distraction, lateral distraction).
  - Clamped to [0, 100]. Grades: A+ (>=95), A (>=90), A- (>=85), B+ (>=80), B (>=75), B- (>=70), C (>=60), F (<60).
- **Distance Handling**: Real monitoring sessions record distance as `"--"` (unavailable) because no physical odometer or GPS hardware is attached.

---

## Audio Alerts & Browser Desktop Notifications

- **Web Audio Multi-Tone Synthesis**:
  - **Critical**: High-intensity 3-pulse klaxon (880 Hz -> 880 Hz -> 1046.5 Hz, gain 0.65-0.70).
  - **Warning**: Crisp two-tone caution chime (587.3 Hz -> 880 Hz, gain 0.45-0.52).
  - **Recovery**: Subtle ascending triad (523 Hz -> 659 Hz -> 784 Hz, gain 0.20-0.25).
  - **Mute**: Top ribbon button toggles between `AUDIO ON` and `SOUND OFF`.
- **Browser Desktop Notifications**:
  - Integrates with the Web Notifications API with permission state tracking (`default`, `granted`, `denied`, `unsupported`).
  - Requested strictly on explicit user click (`ENABLE NOTIFS`).
  - If permissions are blocked in Chrome, displays `NOTIFS BLOCKED` and opens an in-app guidance modal explaining how to unlock permissions in Chrome site settings (`localhost:5173`).
  - Automatically re-syncs permission state on window focus and visibility change.

---

## Production Build Verification

To verify that the frontend compiles cleanly for production:

```powershell
cd frontend
npm run build
```

*Output is generated into `frontend/dist/` with zero lint or bundling errors.*

---

## Methodological Limitations & Safety Disclaimers

1. **Synthetic Benchmark Scope**: The automated evaluation benchmark (`backend/evaluate.py`) tests the temporal state-machine, debouncing latency, and scoring logic against mathematical telemetry streams. It does **not** evaluate optical camera lens distortion, hardware frame drops, motion blur, or ambient cabin lux degradation below 50 lux.
2. **Head Pose Projection**: Head pose angles (pitch, yaw, roll) are computed via Perspective-n-Point (PnP) projection of 6 facial landmark points against an anthropometric 3D model. They reflect facial landmark orientation, not physical inertial measurement unit (IMU) readings.
3. **Gaze Tracking Limitation**: Driver gaze classification uses head orientation and vertical blendshape aperture proxies; the system does **not** claim to provide calibrated infrared pupil-corneal reflection eye tracking.
4. **Safety Disclaimer**: DriveGuard AI is an assistive developer prototype and research tool. It is **not** an accredited automotive active-safety system, medical diagnostic instrument, or replacement for alert driver responsibility.
