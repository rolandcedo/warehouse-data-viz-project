/**
 * ThreeScene.jsx
 * React Three Fiber canvas setup with camera, lighting, and controls
 * Provides the foundation for 3D warehouse visualization
 */

import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Color } from 'three';
import { C } from '../styles/designSystem';

const ThreeScene = ({ children }) => {
  const controlsRef = useRef();
  const restoredRef = useRef(false);

  // Restore camera position from sessionStorage after controls are ready
  const handleControlsReady = () => {
    if (restoredRef.current || !controlsRef.current) return;

    const savedState = sessionStorage.getItem('warehouse-canvas-camera-state');
    if (savedState) {
      try {
        const { position, target } = JSON.parse(savedState);
        const camera = controlsRef.current.object;

        // Restore camera position
        camera.position.set(position.x, position.y, position.z);

        // Restore target
        controlsRef.current.target.set(target.x, target.y, target.z);

        // Update controls to apply changes
        controlsRef.current.update();

        restoredRef.current = true;
      } catch (e) {
        console.warn('Failed to restore camera state:', e);
      }
    }
  };

  // Save camera position to sessionStorage when it changes
  const handleCameraChange = () => {
    if (!controlsRef.current) return;

    const camera = controlsRef.current.object;
    const state = {
      position: {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
      },
      target: {
        x: controlsRef.current.target.x,
        y: controlsRef.current.target.y,
        z: controlsRef.current.target.z
      }
    };

    sessionStorage.setItem('warehouse-canvas-camera-state', JSON.stringify(state));
  };

  return (
    <Canvas
      style={{ width: '100%', height: '100%', background: C.neutral[200] }}
      shadows
      gl={{ antialias: true, alpha: false }}
      onCreated={({ scene, gl }) => {
        scene.background = new Color(C.neutral[200]);
        gl.setClearColor(C.neutral[200], 1);
      }}
    >
      {/* Camera setup - elevated isometric-style view */}
      <PerspectiveCamera
        makeDefault
        position={[100, 120, 150]}
        fov={50}
        near={0.1}
        far={2000}
      />

      {/* OrbitControls - Cities: Skylines style camera with state preservation */}
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        minDistance={50}
        maxDistance={300}
        maxPolarAngle={Math.PI / 2.2} // Limit to ~80 degrees (prevent under-floor)
        target={[100, 0, 75]} // Center on warehouse floor
        onChange={handleCameraChange}
        onEnd={handleControlsReady}
      />

      {/* Lighting setup */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[50, 100, 50]}
        intensity={0.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight
        position={[-50, 80, -50]}
        intensity={0.3}
      />

      {/* Loading fallback */}
      <Suspense fallback={null}>
        {children}
      </Suspense>
    </Canvas>
  );
};

export default ThreeScene;
