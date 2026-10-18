import time
from collections import deque


class DriverRiskScorer:
    def __init__(
        self,
        ear_threshold=0.22,
        mar_threshold=0.55,
        eye_close_warn_sec=1.0,
        eye_close_crit_sec=1.8,
        yawn_warn_sec=1.2,
        distraction_warn_sec=2.0,
    ):
        self.ear_threshold = ear_threshold
        self.mar_threshold = mar_threshold
        self.eye_close_warn_sec = eye_close_warn_sec
        self.eye_close_crit_sec = eye_close_crit_sec
        self.yawn_warn_sec = yawn_warn_sec
        self.distraction_warn_sec = distraction_warn_sec

        # State tracking
        self.eyes_closed_start = None
        self.yawn_start = None
        self.distraction_start = None

        # Temporal smoothing & hysteresis for EAR
        self.ear_raw_window = deque(maxlen=5)
        self.ear_close_threshold = 0.20
        self.ear_reopen_threshold = 0.24
        self.is_eye_currently_closed = False

        # Head-pose neutral baseline calibration
        self.neutral_pitch = 0.0
        self.neutral_yaw = 0.0
        self.calib_samples_pitch = []
        self.calib_samples_yaw = []
        self.calib_max_samples = 45
        self.is_calibrated = False

        # Rolling 60s window for blink rate and PERCLOS
        self.ear_history = deque() # tuples of (timestamp, is_closed)
        self.blink_timestamps = deque()
        self.was_eye_closed = False

    def update(self, metrics):
        """
        metrics: dict from face_mesh.process_frame containing:
          - face_detected (bool)
          - ear (float)
          - mar (float)
          - pitch (float)
          - yaw (float)
          - roll (float)
          - blink_score (float, optional blendshape 0.0-1.0)
          - look_down_score (float, optional blendshape 0.0-1.0)
        """
        now = time.time()
        face_detected = metrics.get("face_detected", False)

        if not face_detected:
            return {
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
                "alertMessage": "OCCUPANT FACE NOT DETECTED IN CAMERA FRAME",
            }

        raw_ear = metrics.get("ear", 0.3)
        mar = metrics.get("mar", 0.1)
        pitch = metrics.get("pitch", 0.0)
        yaw = metrics.get("yaw", 0.0)
        roll = metrics.get("roll", 0.0)
        blink_score = metrics.get("blink_score", 0.0)
        look_down_score = metrics.get("look_down_score", 0.0)

        # 1. Temporal Smoothing on EAR
        self.ear_raw_window.append(raw_ear)
        smoothed_ear = sorted(self.ear_raw_window)[len(self.ear_raw_window) // 2]

        # 2. Neutral Head Pose Calibration (First 45 valid frames)
        if not self.is_calibrated:
            if abs(pitch) < 35.0 and abs(yaw) < 35.0:
                self.calib_samples_pitch.append(pitch)
                self.calib_samples_yaw.append(yaw)
                if len(self.calib_samples_pitch) >= self.calib_max_samples:
                    self.neutral_pitch = sorted(self.calib_samples_pitch)[len(self.calib_samples_pitch) // 2]
                    self.neutral_yaw = sorted(self.calib_samples_yaw)[len(self.calib_samples_yaw) // 2]
                    self.is_calibrated = True

        # Relative orientation to calibrated driving posture
        rel_pitch = pitch - self.neutral_pitch
        rel_yaw = yaw - self.neutral_yaw

        # 3. Head Orientation Conditions
        # Head-down distraction: tilted downward significantly relative to neutral or absolute low pitch
        is_head_down = (rel_pitch < -11.0) or (pitch < -16.0)
        is_head_up = (rel_pitch > 20.0) or (pitch > 24.0)
        is_lateral_distracted = abs(rel_yaw) > 24.0
        is_distracted = is_head_down or is_lateral_distracted or is_head_up

        # Downward vertical gaze / reading angle indicator
        is_downward_gaze = is_head_down or (look_down_score > 0.45)

        # 4. Evidence-Based Eye Closure Detection
        # Distinguish genuine eyelid closure from downward gaze foreshortening
        if is_downward_gaze:
            # When looking down at keyboard/desk, 2D geometric EAR naturally compresses to 0.12-0.18
            # due to viewing perspective. Require unambiguous eyelid closure:
            # High neural blink muscle activation AND low geometric EAR.
            if blink_score > 0.0:
                is_eye_closed_candidate = (blink_score >= 0.58) and (smoothed_ear < 0.15)
            else:
                # Fallback without blendshapes: strict closure threshold
                is_eye_closed_candidate = smoothed_ear < 0.11
        else:
            # Normal forward posture:
            if blink_score > 0.0:
                if self.is_eye_currently_closed:
                    # Hysteresis reopen when blink muscle relaxes or aperture recovers
                    is_eye_closed_candidate = (blink_score >= 0.35) and (smoothed_ear < 0.20)
                else:
                    # Close when blink score is high or geometric EAR indicates true closure
                    is_eye_closed_candidate = (blink_score >= 0.50) or (
                        smoothed_ear < 0.17 and blink_score >= 0.35
                    ) or (smoothed_ear < 0.14)
            else:
                # Fallback without blendshapes
                if self.is_eye_currently_closed:
                    is_eye_closed_candidate = smoothed_ear < 0.20
                else:
                    is_eye_closed_candidate = smoothed_ear < 0.17

        self.is_eye_currently_closed = is_eye_closed_candidate
        is_eye_closed = self.is_eye_currently_closed

        is_yawning = mar > self.mar_threshold

        # 5. Eye Closure Timer
        if is_eye_closed:
            if self.eyes_closed_start is None:
                self.eyes_closed_start = now
            eyes_closed_sec = now - self.eyes_closed_start
        else:
            self.eyes_closed_start = None
            eyes_closed_sec = 0.0

        # 6. Blink Frequency Tracker
        if is_eye_closed and not self.was_eye_closed:
            self.blink_timestamps.append(now)
        self.was_eye_closed = is_eye_closed

        while self.blink_timestamps and (now - self.blink_timestamps[0] > 60.0):
            self.blink_timestamps.popleft()
        blink_rate = len(self.blink_timestamps)

        # 7. Rolling PERCLOS (30s window)
        self.ear_history.append((now, 1 if is_eye_closed else 0))
        while self.ear_history and (now - self.ear_history[0][0] > 30.0):
            self.ear_history.popleft()

        total_samples = len(self.ear_history)
        closed_samples = sum(item[1] for item in self.ear_history)
        perclos = (closed_samples / total_samples * 100.0) if total_samples > 0 else 0.0

        # 8. Yawn Timer
        if is_yawning:
            if self.yawn_start is None:
                self.yawn_start = now
            yawn_sec = now - self.yawn_start
        else:
            self.yawn_start = None
            yawn_sec = 0.0

        # 9. Distraction Timer
        if is_distracted:
            if self.distraction_start is None:
                self.distraction_start = now
            distraction_sec = now - self.distraction_start
        else:
            self.distraction_start = None
            distraction_sec = 0.0

        # 10. Risk Scoring & Specific Reason Determination
        risk_score = 0
        risk_level = "NOMINAL"
        risk_reason = "NONE"
        alert_message = ""

        # Priority A: Drowsiness from Genuine Eye Closure
        if eyes_closed_sec >= self.eye_close_crit_sec or perclos > 40.0:
            risk_score = 92
            risk_level = "CRITICAL"
            risk_reason = "DROWSINESS_EYE_CLOSURE"
            alert_message = f"CRITICAL: PROLONGED EYE CLOSURE ({eyes_closed_sec:.1f}s) — IMMEDIATE STOP REQUIRED"
        elif eyes_closed_sec >= self.eye_close_warn_sec or perclos > 20.0:
            risk_score = 60
            risk_level = "WARNING"
            risk_reason = "DROWSINESS_EYE_CLOSURE"
            alert_message = f"CAUTION: SUSTAINED EYE CLOSURE ({eyes_closed_sec:.1f}s)"

        # Priority B: Drowsiness from Sustained Yawning
        if yawn_sec >= self.yawn_warn_sec:
            yawn_score = min(35, int(yawn_sec * 12)) + 30
            if yawn_score > risk_score:
                risk_score = yawn_score
                if risk_level != "CRITICAL":
                    risk_level = "WARNING"
                    risk_reason = "DROWSINESS_YAWN"
                    alert_message = "DROWSINESS: SUSTAINED YAWNING DETECTED"

        # Priority C: Head Distraction (Separate from Drowsiness)
        if distraction_sec >= self.distraction_warn_sec:
            # Distraction scales from 45% up to 65% (staying strictly within WARNING tier: 35-69%)
            distract_score = min(20, int((distraction_sec - self.distraction_warn_sec) * 8)) + 45
            
            # If head is slumped down for an extreme duration (>4.5s), escalate to critical head-slump
            if is_head_down and distraction_sec >= 4.5:
                distract_score = 85
                distract_level = "CRITICAL"
            else:
                distract_level = "WARNING"

            # Distraction takes effect when no genuine eye closure/yawn drowsiness is active
            if risk_reason == "NONE" or distract_score > risk_score:
                risk_score = distract_score
                risk_level = distract_level
                if is_head_down:
                    risk_reason = "HEAD_DOWN_DISTRACTION"
                    alert_message = f"DISTRACTION: HEAD DIRECTED DOWNWARD ({rel_pitch:.1f}°) FOR {distraction_sec:.1f}s — EYES ON ROAD"
                elif is_lateral_distracted:
                    risk_reason = "LATERAL_DISTRACTION"
                    alert_message = f"DISTRACTION: HEAD TURNED ASIDE ({rel_yaw:.1f}°) FOR {distraction_sec:.1f}s — EYES ON ROAD"
                else:
                    risk_reason = "HEAD_UP_DISTRACTION"
                    alert_message = f"DISTRACTION: HEAD DIRECTED UPWARD ({rel_pitch:.1f}°) FOR {distraction_sec:.1f}s — EYES ON ROAD"

        # Baseline Nominal Score when all metrics are within safe range
        if risk_level == "NOMINAL":
            risk_score = min(25, int(perclos * 0.3 + abs(rel_pitch) * 0.3))

        return {
            "riskScore": int(min(100, max(0, risk_score))),
            "riskLevel": risk_level,
            "riskReason": risk_reason,
            "ear": float(round(smoothed_ear, 3)),
            "mar": float(round(mar, 3)),
            "headPitch": float(round(rel_pitch, 1)),
            "headYaw": float(round(rel_yaw, 1)),
            "headRoll": float(round(roll, 1)),
            "blinkRate": int(blink_rate),
            "perclos": float(round(perclos, 1)),
            "eyesClosedTime": float(round(eyes_closed_sec, 2)),
            "blinkScore": float(round(blink_score, 3)),
            "lookDownScore": float(round(look_down_score, 3)),
            "alertMessage": alert_message,
        }
