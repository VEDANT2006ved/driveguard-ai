import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Eye, ShieldAlert, Sparkles, Compass, Radio, Activity } from 'lucide-react';

/**
 * InteractiveCockpit3D - SSTR Industrial Engineering Edition
 * Cinematic 3D driver head & vehicle cockpit telemetry visualizer powered by Three.js.
 * Reacts dynamically to real-time driver head-pose (Pitch, Yaw, Roll), risk score,
 * and monitoring status with interactive mouse orbit parallax.
 */
export default function InteractiveCockpit3D({
  telemetryData = {},
  isMonitoring = true,
  height = '420px',
  theme = 'dark', // 'dark' (SSTR carbon obsidian) or 'light'
}) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationFrameRef = useRef(null);
  const isVisibleRef = useRef(true);

  // 3D Objects refs for animation
  const headGroupRef = useRef(null);
  const cockpitRingRef = useRef(null);
  const steeringRef = useRef(null);
  const laserGridRef = useRef(null);
  const scanLineRef = useRef(null);
  const ambientLightRef = useRef(null);
  const pointLightRef = useRef(null);

  // Mouse parallax state
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const {
    riskScore = 0,
    riskLevel = 'NOMINAL',
    headPitch = 0,
    headYaw = 0,
    headRoll = 0,
    ear = 0.32,
    mar = 0.12,
  } = telemetryData;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const heightPx = container.clientHeight || 420;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 100);
    camera.position.set(0, 0.2, 4.2);

    // 2. WebGL Renderer with Alpha & Antialiasing
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 3. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const pointLight = new THREE.PointLight(0xfe5b2a, 3, 10);
    pointLight.position.set(2, 3, 3);
    scene.add(pointLight);
    pointLightRef.current = pointLight;

    const fillLight = new THREE.PointLight(0x38bdf8, 2, 8);
    fillLight.position.set(-2, -1, 2);
    scene.add(fillLight);

    // 4. Create Driver Head Group (Stylized Low-Poly Holographic Mesh)
    const headGroup = new THREE.Group();
    scene.add(headGroup);
    headGroupRef.current = headGroup;

    // Cranium / Face Base (Icosahedron for clean facial polygon facets)
    const craniumGeo = new THREE.IcosahedronGeometry(0.85, 2);
    const craniumMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.3,
      metalness: 0.8,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });
    const craniumMesh = new THREE.Mesh(craniumGeo, craniumMat);
    headGroup.add(craniumMesh);

    // Inner Glow Core
    const coreGeo = new THREE.SphereGeometry(0.65, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x059669,
      transparent: true,
      opacity: 0.25,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    headGroup.add(coreMesh);

    // Eye Orbit Ring Indicators (Left & Right)
    const eyeRingGeo = new THREE.TorusGeometry(0.12, 0.02, 8, 24);
    const eyeRingMat = new THREE.MeshBasicMaterial({ color: 0xfe5b2a });

    const leftEye = new THREE.Mesh(eyeRingGeo, eyeRingMat);
    leftEye.position.set(-0.28, 0.12, 0.72);
    headGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeRingGeo, eyeRingMat);
    rightEye.position.set(0.28, 0.12, 0.72);
    headGroup.add(rightEye);

    // Mouth / Jaw Indicator Node
    const jawNodeGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.03, 16);
    const jawNodeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const jawNode = new THREE.Mesh(jawNodeGeo, jawNodeMat);
    jawNode.position.set(0, -0.38, 0.65);
    jawNode.rotation.x = Math.PI / 2;
    headGroup.add(jawNode);

    // 5. Stylized Steering Wheel Arc & Cockpit Depth Ring
    const cockpitRingGeo = new THREE.TorusGeometry(1.65, 0.035, 16, 64, Math.PI * 1.3);
    const cockpitRingMat = new THREE.MeshStandardMaterial({
      color: 0x2b2e36,
      roughness: 0.4,
      metalness: 0.9,
    });
    const cockpitRing = new THREE.Mesh(cockpitRingGeo, cockpitRingMat);
    cockpitRing.position.set(0, -0.4, 0.6);
    cockpitRing.rotation.z = Math.PI * 0.85;
    scene.add(cockpitRing);
    steeringRef.current = cockpitRing;

    // Outer Gyroscope Tracking Rings
    const gyroGeo1 = new THREE.RingGeometry(1.9, 1.93, 48);
    const gyroMat1 = new THREE.MeshBasicMaterial({
      color: 0xfe5b2a,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    });
    const gyro1 = new THREE.Mesh(gyroGeo1, gyroMat1);
    gyro1.rotation.x = Math.PI * 0.45;
    scene.add(gyro1);
    cockpitRingRef.current = gyro1;

    // 6. Laser Ground Grid
    const gridHelper = new THREE.GridHelper(6, 24, 0xfe5b2a, 0x1f232b);
    gridHelper.position.y = -1.2;
    scene.add(gridHelper);
    laserGridRef.current = gridHelper;

    // 7. Sweeping Laser Scanning Plane
    const scanPlaneGeo = new THREE.PlaneGeometry(2.6, 0.03);
    const scanPlaneMat = new THREE.MeshBasicMaterial({
      color: 0xfe5b2a,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
    });
    const scanLine = new THREE.Mesh(scanPlaneGeo, scanPlaneMat);
    scanLine.position.set(0, 0, 0.85);
    scene.add(scanLine);
    scanLineRef.current = scanLine;

    // 8. Mouse Listeners
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x * 0.4;
      mouseRef.current.targetY = y * 0.3;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
      setIsHovered(false);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mouseenter', handleMouseEnter);

    // 9. Resize Observer
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 10. IntersectionObserver for Performance (pause loop when offscreen)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // 11. Render Animation Loop
    let clock = new THREE.Clock();
    let scanDirection = 1;

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      if (!isVisibleRef.current) return;

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse parallax damping
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      // Vertical Laser Scan sweep
      if (scanLineRef.current) {
        scanLineRef.current.position.y += scanDirection * delta * 0.9;
        if (scanLineRef.current.position.y > 0.8) scanDirection = -1;
        if (scanLineRef.current.position.y < -0.8) scanDirection = 1;
      }

      // Gyroscope subtle continuous drift
      if (cockpitRingRef.current) {
        cockpitRingRef.current.rotation.z += delta * 0.15;
      }

      // Steering wheel gentle reactive sway
      if (steeringRef.current) {
        steeringRef.current.rotation.z = Math.PI * 0.85 + Math.sin(elapsedTime * 0.8) * 0.05;
      }

      // Head model orientation:
      // Uses REAL head telemetry (converted from degrees to radians) combined with mouse parallax
      if (headGroupRef.current) {
        const radPitch = THREE.MathUtils.degToRad(headPitch || 0);
        const radYaw = THREE.MathUtils.degToRad(headYaw || 0);
        const radRoll = THREE.MathUtils.degToRad(headRoll || 0);

        // Smooth interpolation towards telemetry targets
        headGroupRef.current.rotation.x +=
          (radPitch + mouseRef.current.y * 0.5 - headGroupRef.current.rotation.x) * 0.1;
        headGroupRef.current.rotation.y +=
          (-radYaw + mouseRef.current.x * 0.7 - headGroupRef.current.rotation.y) * 0.1;
        headGroupRef.current.rotation.z +=
          (-radRoll - headGroupRef.current.rotation.z) * 0.1;

        // Subtle organic breathing motion when stationary
        headGroupRef.current.position.y = Math.sin(elapsedTime * 1.5) * 0.02;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup resources cleanly
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mouseenter', handleMouseEnter);

      // Clean Three.js geometries and materials
      scene.traverse((child) => {
        if (child.isMesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      });

      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Dynamic Colors based on Real Risk Score and Level
  useEffect(() => {
    if (!headGroupRef.current || !pointLightRef.current) return;

    let targetColor = 0x10b981; // Nominal Emerald
    let lightColor = 0x10b981;

    if (riskLevel === 'CRITICAL' || riskScore >= 70) {
      targetColor = 0xef4444; // Critical Red
      lightColor = 0xf87171;
    } else if (riskLevel === 'WARNING' || riskScore >= 35) {
      targetColor = 0xfe5b2a; // SSTR Safety Orange
      lightColor = 0xff7b52;
    }

    pointLightRef.current.color.setHex(lightColor);

    headGroupRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        if (child.material.color) {
          child.material.color.lerp(new THREE.Color(targetColor), 0.3);
        }
      }
    });

    if (scanLineRef.current && scanLineRef.current.material) {
      scanLineRef.current.material.color.setHex(lightColor);
    }
  }, [riskScore, riskLevel]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: height,
        borderRadius: '4px',
        overflow: 'hidden',
        backgroundColor: '#141518',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Three.js Canvas Container */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
          cursor: isHovered ? 'grab' : 'default',
        }}
      />

      {/* SSTR Crosshair Reticles in Corners */}
      <div style={{ position: 'absolute', top: 8, left: 8, color: 'rgba(255, 255, 255, 0.25)', fontFamily: 'var(--font-mono)', fontSize: '10px', pointerEvents: 'none' }}>+</div>
      <div style={{ position: 'absolute', top: 8, right: 8, color: 'rgba(255, 255, 255, 0.25)', fontFamily: 'var(--font-mono)', fontSize: '10px', pointerEvents: 'none' }}>+</div>
      <div style={{ position: 'absolute', bottom: 8, left: 8, color: 'rgba(255, 255, 255, 0.25)', fontFamily: 'var(--font-mono)', fontSize: '10px', pointerEvents: 'none' }}>+</div>
      <div style={{ position: 'absolute', bottom: 8, right: 8, color: 'rgba(255, 255, 255, 0.25)', fontFamily: 'var(--font-mono)', fontSize: '10px', pointerEvents: 'none' }}>+</div>

      {/* 3D Holographic HUD Overlays & Floating Metrics */}
      <div
        style={{
          position: 'absolute',
          top: '1.25rem',
          left: '1.25rem',
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.75rem',
            borderRadius: '2px',
            backgroundColor: 'rgba(13, 14, 16, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '0.72rem',
            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
            fontWeight: 600,
            color: '#F5F5F7',
          }}
        >
          <Radio size={12} className="animate-orange-pulse" color="#FE5B2A" />
          <span>3D KINEMATICS COCKPIT</span>
        </div>

        <span
          style={{
            fontSize: '0.7rem',
            color: '#9FA4B0',
            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
            paddingLeft: '0.25rem',
          }}
        >
          ROTATION: P {headPitch?.toFixed(1)}° • Y {headYaw?.toFixed(1)}° • R {headRoll?.toFixed(1)}°
        </span>
      </div>

      {/* Top Right: Live Risk Amplitude Badge */}
      <div
        style={{
          position: 'absolute',
          top: '1.25rem',
          right: '1.25rem',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '2px',
            backgroundColor:
              riskScore >= 70
                ? 'rgba(239, 68, 68, 0.15)'
                : riskScore >= 35
                ? 'rgba(254, 91, 42, 0.15)'
                : 'rgba(16, 185, 129, 0.15)',
            border:
              riskScore >= 70
                ? '1px solid rgba(239, 68, 68, 0.4)'
                : riskScore >= 35
                ? '1px solid rgba(254, 91, 42, 0.4)'
                : '1px solid rgba(16, 185, 129, 0.3)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor:
                riskScore >= 70 ? '#EF4444' : riskScore >= 35 ? '#FE5B2A' : '#10B981',
            }}
            className="animate-green-pulse"
          />
          <span
            style={{
              fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
              fontSize: '0.75rem',
              fontWeight: 700,
              color:
                riskScore >= 70
                  ? '#EF4444'
                  : riskScore >= 35
                  ? '#FE5B2A'
                  : '#10B981',
            }}
          >
            {riskScore}% {riskLevel}
          </span>
        </div>
      </div>

      {/* Floating Bottom Left: Biometric Metric Pills */}
      <div
        style={{
          position: 'absolute',
          bottom: '1.25rem',
          left: '1.25rem',
          display: 'flex',
          gap: '0.65rem',
          flexWrap: 'wrap',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            padding: '0.35rem 0.75rem',
            borderRadius: '2px',
            backgroundColor: 'rgba(20, 21, 24, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(6px)',
            fontSize: '0.72rem',
            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
            color: '#F5F5F7',
          }}
        >
          EAR <strong style={{ color: ear < 0.22 ? '#EF4444' : '#10B981' }}>{ear?.toFixed(2)}</strong>
        </div>

        <div
          style={{
            padding: '0.35rem 0.75rem',
            borderRadius: '2px',
            backgroundColor: 'rgba(20, 21, 24, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(6px)',
            fontSize: '0.72rem',
            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
            color: '#F5F5F7',
          }}
        >
          MAR <strong style={{ color: mar > 0.55 ? '#FE5B2A' : '#10B981' }}>{mar?.toFixed(2)}</strong>
        </div>

        <div
          style={{
            padding: '0.35rem 0.75rem',
            borderRadius: '2px',
            backgroundColor: 'rgba(20, 21, 24, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(6px)',
            fontSize: '0.72rem',
            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
            color: '#F5F5F7',
          }}
        >
          SCAN <strong style={{ color: isMonitoring ? '#10B981' : '#9FA4B0' }}>{isMonitoring ? '30 FPS' : 'IDLE'}</strong>
        </div>
      </div>

      {/* Bottom Right: Interactive Hint */}
      <div
        style={{
          position: 'absolute',
          bottom: '1.25rem',
          right: '1.25rem',
          pointerEvents: 'none',
          fontSize: '0.68rem',
          fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
          color: '#9FA4B0',
          textAlign: 'right',
        }}
      >
        <span>HOVER &amp; MOVE TO ORBIT 3D PERSPECTIVE</span>
      </div>
    </div>
  );
}
