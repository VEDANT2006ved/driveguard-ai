import math
import os
import cv2
import numpy as np
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

# Landmark indices for EAR (Eye Aspect Ratio)
RIGHT_EYE_INDICES = [33, 160, 158, 133, 153, 144]
LEFT_EYE_INDICES = [362, 385, 387, 263, 373, 380]

# Landmark indices for MAR (Mouth Aspect Ratio)
MOUTH_TOP = 13
MOUTH_BOTTOM = 14
MOUTH_LEFT = 78
MOUTH_RIGHT = 308

# 3D Model points for Head Pose (solvePnP)
# Aligned with image coordinate system (+X right, +Y down, +Z forward/depth)
MODEL_POINTS_3D = np.array([
    (0.0, 0.0, 0.0),          # Nose tip
    (0.0, 330.0, -65.0),      # Chin (+Y is down)
    (-225.0, -170.0, -135.0), # Left eye outer corner (-Y is up)
    (225.0, -170.0, -135.0),  # Right eye outer corner (-Y is up)
    (-150.0, 150.0, -125.0),  # Left mouth corner (+Y is down)
    (150.0, 150.0, -125.0)    # Right mouth corner (+Y is down)
], dtype=np.float64)


def euclidean_dist(p1, p2):
    return math.hypot(p1[0] - p2[0], p1[1] - p2[1])


def calculate_ear(landmarks, eye_indices, w, h):
    pts = [(landmarks[idx].x * w, landmarks[idx].y * h) for idx in eye_indices]
    # p1=pts[0], p2=pts[1], p3=pts[2], p4=pts[3], p5=pts[4], p6=pts[5]
    d_v1 = euclidean_dist(pts[1], pts[5])
    d_v2 = euclidean_dist(pts[2], pts[4])
    d_h = euclidean_dist(pts[0], pts[3])
    if d_h < 1e-6:
        return 0.0
    return (d_v1 + d_v2) / (2.0 * d_h)


def calculate_mar(landmarks, w, h):
    p_top = (landmarks[MOUTH_TOP].x * w, landmarks[MOUTH_TOP].y * h)
    p_bottom = (landmarks[MOUTH_BOTTOM].x * w, landmarks[MOUTH_BOTTOM].y * h)
    p_left = (landmarks[MOUTH_LEFT].x * w, landmarks[MOUTH_LEFT].y * h)
    p_right = (landmarks[MOUTH_RIGHT].x * w, landmarks[MOUTH_RIGHT].y * h)

    d_v = euclidean_dist(p_top, p_bottom)
    d_h = euclidean_dist(p_left, p_right)
    if d_h < 1e-6:
        return 0.0
    return d_v / d_h


def estimate_head_pose(landmarks, w, h):
    image_points = np.array([
        (landmarks[1].x * w, landmarks[1].y * h),      # Nose tip
        (landmarks[152].x * w, landmarks[152].y * h),  # Chin
        (landmarks[33].x * w, landmarks[33].y * h),    # Left eye
        (landmarks[263].x * w, landmarks[263].y * h),  # Right eye
        (landmarks[61].x * w, landmarks[61].y * h),    # Left mouth
        (landmarks[291].x * w, landmarks[291].y * h)   # Right mouth
    ], dtype=np.float64)

    focal_length = w
    center = (w / 2, h / 2)
    camera_matrix = np.array([
        [focal_length, 0, center[0]],
        [0, focal_length, center[1]],
        [0, 0, 1]
    ], dtype=np.float64)
    dist_coeffs = np.zeros((4, 1))

    success, rvec, tvec = cv2.solvePnP(
        MODEL_POINTS_3D, image_points, camera_matrix, dist_coeffs, flags=cv2.SOLVEPNP_ITERATIVE
    )

    if not success:
        return 0.0, 0.0, 0.0, None

    rmat, _ = cv2.Rodrigues(rvec)
    angles, _, _, _, _, _ = cv2.RQDecomp3x3(rmat)

    pitch = angles[0]
    yaw = angles[1]
    roll = angles[2]

    # Project a 3D nose axis forward to display driver gaze vector
    axis_3d = np.array([(0, 0, 100.0)], dtype=np.float64)
    axis_2d, _ = cv2.projectPoints(axis_3d, rvec, tvec, camera_matrix, dist_coeffs)
    p_nose = (int(image_points[0][0]), int(image_points[0][1]))
    p_axis = (int(axis_2d[0][0][0]), int(axis_2d[0][0][1]))

    return pitch, yaw, roll, (p_nose, p_axis)


class DriverFaceMeshEngine:
    def __init__(self, model_path=None):
        if model_path is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            model_path = os.path.join(base_dir, 'models', 'face_landmarker.task')

        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at {model_path}")

        base_options = python.BaseOptions(model_asset_path=model_path)
        options = vision.FaceLandmarkerOptions(
            base_options=base_options,
            output_face_blendshapes=True,
            output_facial_transformation_matrixes=True,
            num_faces=1
        )
        self.detector = vision.FaceLandmarker.create_from_options(options)

    def process_frame(self, frame_bgr):
        h, w, _ = frame_bgr.shape
        rgb_frame = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)

        result = self.detector.detect(mp_image)
        annotated = frame_bgr.copy()

        if not result.face_landmarks:
            # Draw HUD status: SEARCHING FOR OCCUPANT
            cv2.putText(
                annotated, "OCCUPANT SEARCH: NO FACE IN RETICLE",
                (24, 36), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (120, 130, 140), 1, cv2.LINE_AA
            )
            return {
                "face_detected": False,
                "ear": 0.0,
                "left_ear": 0.0,
                "right_ear": 0.0,
                "mar": 0.0,
                "pitch": 0.0,
                "yaw": 0.0,
                "roll": 0.0,
                "blink_score": 0.0,
                "look_down_score": 0.0,
                "annotated_frame": annotated,
            }

        landmarks = result.face_landmarks[0]

        # 1. EAR
        left_ear = calculate_ear(landmarks, LEFT_EYE_INDICES, w, h)
        right_ear = calculate_ear(landmarks, RIGHT_EYE_INDICES, w, h)
        avg_ear = (left_ear + right_ear) / 2.0

        # 2. MAR
        mar = calculate_mar(landmarks, w, h)

        # 3. Head Pose
        pitch, yaw, roll, gaze_line = estimate_head_pose(landmarks, w, h)

        # 4. Neural Blendshape Eyelid Activation
        blink_score = 0.0
        look_down_score = 0.0
        if result.face_blendshapes and len(result.face_blendshapes) > 0:
            for b in result.face_blendshapes[0]:
                if b.category_name in ('eyeBlinkLeft', 'eyeBlinkRight'):
                    blink_score += b.score * 0.5
                elif b.category_name in ('eyeLookDownLeft', 'eyeLookDownRight'):
                    look_down_score += b.score * 0.5

        # 5. Minimalist HUD Overlays
        # Draw eyes contour points
        eye_color = (0, 70, 240) if avg_ear < 0.22 else (80, 210, 120) # BGR
        for idx in LEFT_EYE_INDICES + RIGHT_EYE_INDICES:
            pt = (int(landmarks[idx].x * w), int(landmarks[idx].y * h))
            cv2.circle(annotated, pt, 2, eye_color, -1)

        # Draw mouth contour points
        mouth_color = (0, 180, 255) if mar > 0.55 else (210, 180, 50)
        for idx in [MOUTH_TOP, MOUTH_BOTTOM, MOUTH_LEFT, MOUTH_RIGHT]:
            pt = (int(landmarks[idx].x * w), int(landmarks[idx].y * h))
            cv2.circle(annotated, pt, 2, mouth_color, -1)

        # Draw gaze trajectory vector if available
        if gaze_line:
            p_nose, p_axis = gaze_line
            cv2.arrowedLine(annotated, p_nose, p_axis, (212, 182, 6), 2, tipLength=0.3)

        # Draw face bounding box corner brackets
        xs = [int(lm.x * w) for lm in landmarks]
        ys = [int(lm.y * h) for lm in landmarks]
        min_x, max_x = max(0, min(xs) - 10), min(w - 1, max(xs) + 10)
        min_y, max_y = max(0, min(ys) - 10), min(h - 1, max(ys) + 10)
        bracket_len = 16
        cyan = (212, 182, 6) # BGR cyan

        # Top-left
        cv2.line(annotated, (min_x, min_y), (min_x + bracket_len, min_y), cyan, 2)
        cv2.line(annotated, (min_x, min_y), (min_x, min_y + bracket_len), cyan, 2)
        # Top-right
        cv2.line(annotated, (max_x, min_y), (max_x - bracket_len, min_y), cyan, 2)
        cv2.line(annotated, (max_x, min_y), (max_x - bracket_len, min_y + bracket_len), cyan, 2)
        # Bottom-left
        cv2.line(annotated, (min_x, max_y), (min_x + bracket_len, max_y), cyan, 2)
        cv2.line(annotated, (min_x, max_y), (min_x, max_y - bracket_len), cyan, 2)
        # Bottom-right
        cv2.line(annotated, (max_x, max_y), (max_x - bracket_len, max_y), cyan, 2)
        cv2.line(annotated, (max_x, max_y), (max_x, max_y - bracket_len), cyan, 2)

        # HUD Text Overlay
        status_text = f"EAR: {avg_ear:.2f} | MAR: {mar:.2f} | PITCH: {pitch:.1f} deg | YAW: {yaw:.1f} deg"
        cv2.putText(annotated, status_text, (20, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (240, 245, 250), 1, cv2.LINE_AA)

        return {
            "face_detected": True,
            "ear": float(avg_ear),
            "left_ear": float(left_ear),
            "right_ear": float(right_ear),
            "mar": float(mar),
            "pitch": float(pitch),
            "yaw": float(yaw),
            "roll": float(roll),
            "blink_score": float(blink_score),
            "look_down_score": float(look_down_score),
            "annotated_frame": annotated,
        }
