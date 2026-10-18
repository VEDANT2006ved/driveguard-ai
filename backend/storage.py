"""
DriveGuard AI — Persistent Storage & Session Audit Vault
Provides SQLite database persistence and lifecycle session tracking for driver monitoring sessions.
Uses Python's built-in sqlite3 standard library (zero external dependencies).
"""

import json
import logging
import sqlite3
import threading
import time
from datetime import datetime
from pathlib import Path

logger = logging.getLogger("DriveGuardAI.Storage")

DB_PATH = Path(__file__).resolve().parent / "driveguard.db"

# ---------------------------------------------------------------------------
# Initial Baseline Records (Preserved for Historical Continuity)
# ---------------------------------------------------------------------------
BASELINE_RECORDS = [
    {
        "id": "TRIP-2026-041",
        "date": "OCT 14, 2026",
        "time": "20:15 - 21:40",
        "duration": "1h 25m",
        "distance": "84.2 km",
        "safety_score": 94,
        "grade": "A",
        "status": "OPTIMAL",
        "incidents": [
            {"time": "20:48", "type": "Micro-yawn", "severity": "LOW", "metric": "MAR 0.58"}
        ],
        "created_at": "2026-10-14 21:40:00",
    },
    {
        "id": "TRIP-2026-040",
        "date": "OCT 13, 2026",
        "time": "23:10 - 00:25",
        "duration": "1h 15m",
        "distance": "68.0 km",
        "safety_score": 78,
        "grade": "B-",
        "status": "CAUTION",
        "incidents": [
            {"time": "23:42", "type": "Prolonged Eye Closure (1.4s)", "severity": "MEDIUM", "metric": "EAR 0.18"},
            {"time": "00:05", "type": "Head Yaw Deviation (>30°)", "severity": "LOW", "metric": "Yaw 34°"},
        ],
        "created_at": "2026-10-13 00:25:00",
    },
    {
        "id": "TRIP-2026-039",
        "date": "OCT 12, 2026",
        "time": "08:30 - 09:12",
        "duration": "42m",
        "distance": "31.5 km",
        "safety_score": 98,
        "grade": "A+",
        "status": "OPTIMAL",
        "incidents": [],
        "created_at": "2026-10-12 09:12:00",
    },
]


def get_db_connection(db_path: Path = DB_PATH) -> sqlite3.Connection:
    """Creates a thread-safe connection to the SQLite database with row dict factory."""
    conn = sqlite3.connect(db_path, timeout=10.0)
    conn.row_factory = sqlite3.Row
    return conn


def init_db(db_path: Path = DB_PATH) -> None:
    """
    Initializes the trips table and seeds baseline records if they do not exist.
    Preserves all existing data without modifying or deleting records.
    """
    with get_db_connection(db_path) as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS trips (
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
            )
            """
        )

        # Seed baseline records only if their ID is not already present
        for rec in BASELINE_RECORDS:
            cursor.execute("SELECT 1 FROM trips WHERE id = ?", (rec["id"],))
            if cursor.fetchone() is None:
                cursor.execute(
                    """
                    INSERT INTO trips (
                        id, date, time, duration, distance, safety_score, grade, status, incidents_json, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        rec["id"],
                        rec["date"],
                        rec["time"],
                        rec["duration"],
                        rec["distance"],
                        rec["safety_score"],
                        rec["grade"],
                        rec["status"],
                        json.dumps(rec["incidents"]),
                        rec["created_at"],
                    ),
                )
        conn.commit()
    logger.info(f"DriveGuard database verified at {db_path}")


def get_all_trips(db_path: Path = DB_PATH):
    """Fetches all trip records ordered chronologically descending (newest first)."""
    with get_db_connection(db_path) as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT id, date, time, duration, distance, safety_score, grade, status, incidents_json, created_at
            FROM trips
            ORDER BY created_at DESC, id DESC
            """
        )
        rows = cursor.fetchall()
        trips = []
        for r in rows:
            try:
                incidents = json.loads(r["incidents_json"]) if r["incidents_json"] else []
            except Exception:
                incidents = []
            trips.append(
                {
                    "id": r["id"],
                    "date": r["date"],
                    "time": r["time"],
                    "duration": r["duration"],
                    "distance": r["distance"],
                    "safetyScore": r["safety_score"],
                    "grade": r["grade"],
                    "status": r["status"],
                    "incidents": incidents,
                    "createdAt": r["created_at"],
                }
            )
        return trips


def save_trip(trip_data: dict, db_path: Path = DB_PATH) -> bool:
    """Inserts a completed trip record into SQLite."""
    with get_db_connection(db_path) as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO trips (
                id, date, time, duration, distance, safety_score, grade, status, incidents_json, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                trip_data["id"],
                trip_data["date"],
                trip_data["time"],
                trip_data["duration"],
                trip_data["distance"],
                trip_data["safetyScore"],
                trip_data["grade"],
                trip_data["status"],
                json.dumps(trip_data.get("incidents", [])),
                trip_data["createdAt"],
            ),
        )
        conn.commit()
    logger.info(f"Saved completed trip record: {trip_data['id']}")
    return True


def generate_next_trip_id(db_path: Path = DB_PATH) -> str:
    """
    Generates the next sequential Trip ID in format 'TRIP-YYYY-NNN'.
    Inspects existing IDs to prevent collisions.
    """
    current_year = datetime.now().year
    prefix = f"TRIP-{current_year}-"
    with get_db_connection(db_path) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM trips WHERE id LIKE ?", (f"{prefix}%",))
        rows = cursor.fetchall()

    max_num = 0
    for r in rows:
        trip_id = r["id"]
        parts = trip_id.split("-")
        if len(parts) == 3:
            try:
                num = int(parts[2])
                if num > max_num:
                    max_num = num
            except ValueError:
                pass

    next_num = max_num + 1 if max_num > 0 else 42
    return f"{prefix}{next_num:03d}"


# ---------------------------------------------------------------------------
# Session Manager (Lifecycle, Incident Aggregation & Heuristic Scoring)
# ---------------------------------------------------------------------------
class SessionManager:
    """
    Tracks an in-progress driver monitoring session.
    Aggregates real detected safety events, calculates safety scores/grades,
    and commits completed sessions to the database.
    """

    def __init__(self, db_path: Path = DB_PATH, min_session_seconds: float = 5.0):
        self.db_path = db_path
        self.min_session_seconds = min_session_seconds
        self.active_session = None
        self._lock = threading.Lock()

    def start_session(self) -> bool:
        """
        Starts a new driver monitoring session.
        Prevents overlapping sessions if Start is requested multiple times.
        """
        with self._lock:
            if self.active_session is not None:
                logger.info("Session already active; ignoring duplicate start request.")
                return False

            now = time.time()
            now_dt = datetime.now()
            self.active_session = {
                "start_time": now,
                "start_datetime": now_dt,
                "incidents": [],
                "current_incident_reason": None,
                "current_incident_start": None,
            }
            logger.info(f"New monitoring session initialized at {now_dt.strftime('%H:%M:%S')}")
            return True

    def process_telemetry(self, telemetry: dict) -> None:
        """
        Processes real-time telemetry frame to record discrete, non-fabricated safety incidents.
        Deduplicates continuous events so an active incident is only logged once per occurrence.
        """
        with self._lock:
            if not self.active_session:
                return

            risk_reason = telemetry.get("riskReason", "NONE")
            risk_level = telemetry.get("riskLevel", "NOMINAL")

            # Case 1: Active safety incident detected
            if risk_reason != "NONE":
                # Check if this is the start of a new incident
                if self.active_session["current_incident_reason"] != risk_reason:
                    now_dt = datetime.now()
                    time_str = now_dt.strftime("%H:%M")

                    # Human-readable incident type & real biometric metric
                    ear = telemetry.get("ear", 0.0)
                    mar = telemetry.get("mar", 0.0)
                    pitch = telemetry.get("headPitch", 0.0)
                    yaw = telemetry.get("headYaw", 0.0)
                    eyes_closed_time = telemetry.get("eyesClosedTime", 0.0)

                    if risk_reason == "DROWSINESS_EYE_CLOSURE":
                        inc_type = f"Prolonged Eye Closure ({max(1.0, eyes_closed_time):.1f}s)"
                        metric_str = f"EAR {ear:.2f}"
                    elif risk_reason == "DROWSINESS_YAWN":
                        inc_type = "Sustained Yawning"
                        metric_str = f"MAR {mar:.2f}"
                    elif risk_reason == "HEAD_DOWN_DISTRACTION":
                        inc_type = f"Head-Down Distraction ({pitch:.1f}°)"
                        metric_str = f"Pitch {pitch:.1f}°"
                    elif risk_reason == "LATERAL_DISTRACTION":
                        inc_type = f"Head Turned Aside ({yaw:.1f}°)"
                        metric_str = f"Yaw {yaw:.1f}°"
                    elif risk_reason == "HEAD_UP_DISTRACTION":
                        inc_type = f"Head Directed Upward ({pitch:.1f}°)"
                        metric_str = f"Pitch {pitch:.1f}°"
                    else:
                        inc_type = risk_reason.replace("_", " ").title()
                        metric_str = f"Score {telemetry.get('riskScore', 0)}%"

                    new_incident = {
                        "time": time_str,
                        "type": inc_type,
                        "severity": risk_level,  # "WARNING" or "CRITICAL"
                        "metric": metric_str,
                    }
                    self.active_session["incidents"].append(new_incident)
                    self.active_session["current_incident_reason"] = risk_reason
                    self.active_session["current_incident_start"] = time.time()
                else:
                    # Incident is continuing: if severity escalated to CRITICAL, update the entry
                    if risk_level == "CRITICAL" and self.active_session["incidents"]:
                        self.active_session["incidents"][-1]["severity"] = "CRITICAL"

            else:
                # Driver attention returned to NOMINAL: reset current incident tracker
                self.active_session["current_incident_reason"] = None
                self.active_session["current_incident_start"] = None

    def stop_session(self) -> dict | None:
        """
        Finalizes the active monitoring session and saves it to SQLite.
        - Enforces minimum duration (5 seconds) to prevent accidental rapid-toggle clutter.
        - Prevents duplicate writes if called repeatedly when no session is active.
        """
        with self._lock:
            if self.active_session is None:
                logger.info("No active session to finalize.")
                return None

            now = time.time()
            elapsed_sec = now - self.active_session["start_time"]
            start_dt = self.active_session["start_datetime"]
            end_dt = datetime.now()
            incidents = list(self.active_session["incidents"])

            # Discard session immediately so subsequent calls cannot duplicate it
            self.active_session = None

            if elapsed_sec < self.min_session_seconds:
                logger.info(
                    f"Session discarded: duration {elapsed_sec:.1f}s is less than {self.min_session_seconds}s minimum."
                )
                return None

            # -------------------------------------------------------------------
            # Safety Score & Grade Heuristic Calculation
            # -------------------------------------------------------------------
            # Rule:
            # - Starts at a nominal baseline of 100 points.
            # - Deducts 15 points per discrete CRITICAL safety event (prolonged eye closure).
            # - Deducts 5 points per discrete WARNING event (sustained yawning, head-down distraction).
            # - Clamped strictly to [0, 100].
            # Note: This is an assistive fatigue/distraction heuristic based on real CV detections,
            # not an accredited medical certification.
            deductions = 0
            for inc in incidents:
                if inc.get("severity") == "CRITICAL":
                    deductions += 15
                else:
                    deductions += 5

            safety_score = max(0, min(100, 100 - deductions))

            if safety_score >= 95:
                grade = "A+"
                status = "OPTIMAL"
            elif safety_score >= 90:
                grade = "A"
                status = "OPTIMAL"
            elif safety_score >= 85:
                grade = "A-"
                status = "OPTIMAL"
            elif safety_score >= 80:
                grade = "B+"
                status = "CAUTION"
            elif safety_score >= 75:
                grade = "B"
                status = "CAUTION"
            elif safety_score >= 70:
                grade = "B-"
                status = "CAUTION"
            elif safety_score >= 60:
                grade = "C"
                status = "ELEVATED RISK"
            else:
                grade = "F"
                status = "CRITICAL"

            # Duration formatting
            total_secs = int(round(elapsed_sec))
            mins = total_secs // 60
            secs = total_secs % 60
            hrs = mins // 60
            if hrs > 0:
                duration_str = f"{hrs}h {mins % 60}m"
            elif mins > 0:
                duration_str = f"{mins}m {secs:02d}s"
            else:
                duration_str = f"{secs}s"

            # Distance: Strictly unmeasured (no GPS or odometer hardware attached)
            distance_str = "--"

            trip_id = generate_next_trip_id(self.db_path)
            date_str = start_dt.strftime("%b %d, %Y").upper()
            time_str = f"{start_dt.strftime('%H:%M')} - {end_dt.strftime('%H:%M')}"
            created_at_str = end_dt.strftime("%Y-%m-%d %H:%M:%S")

            trip_record = {
                "id": trip_id,
                "date": date_str,
                "time": time_str,
                "duration": duration_str,
                "distance": distance_str,
                "safetyScore": safety_score,
                "grade": grade,
                "status": status,
                "incidents": incidents,
                "createdAt": created_at_str,
            }

            save_trip(trip_record, self.db_path)
            return trip_record
