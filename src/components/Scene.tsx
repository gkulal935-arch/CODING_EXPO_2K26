import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Grid } from '@react-three/drei';
import { Character } from './Character';

// Camera controller component inside the Canvas
const CameraController: React.FC = () => {
  const gyroRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      // beta (pitch, front/back tilt) and gamma (roll, left/right tilt)
      if (e.beta !== null && e.gamma !== null) {
        // Assume holding phone at 45 degree angle for natural viewing pitch
        const x = THREE.MathUtils.clamp(e.gamma / 22, -1.0, 1.0);
        const y = THREE.MathUtils.clamp((e.beta - 45) / 22, -1.0, 1.0);
        
        gyroRef.current.x = x;
        gyroRef.current.y = y;
      }
    };

    window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  useFrame((state) => {
    const pointer = state.pointer;
    const scrollY = window.scrollY || 0;
    const aspect = state.viewport.aspect; // width / height

    // Adapt camera target Z based on aspect ratio (narrow portrait needs camera pulled back)
    const zoomFactor = aspect < 1.3 ? Math.min(1.8, 1.35 / aspect) : 1.0;
    const targetZ = (3.0 + scrollY * 0.004) * zoomFactor;
    const scrollOffsetHeight = scrollY * 0.002;

    // Combine pointer coordinates and mobile gyro orientation
    const targetX = pointer.x * 1.0 + gyroRef.current.x * 0.4;
    const targetY = pointer.y * 0.6 + 0.8 + gyroRef.current.y * 0.3;

    // Interpolations (lerp)
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY + scrollOffsetHeight, 0.05);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);

    // Look at the character chest height
    state.camera.lookAt(0, 0.1, 0);
  });

  return null;
};

// Particles cloud simulating floating neon code segments/dust (mobile-optimized density)
const ParticleSystem: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Throttle particle density on mobile to preserve frame rates
  const count = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    return isMobile ? 60 : 150;
  }, []);

  // Generate random positions, speeds, and colors
  const [positions, speedData] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 6; // X
      pos[i * 3 + 1] = Math.random() * 4 - 2; // Y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5; // Z
      
      speeds[i] = 0.1 + Math.random() * 0.3; // speed going up
    }
    return [pos, speeds];
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    
    const positionsAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    
    for (let i = 0; i < count; i++) {
      let y = positionsAttr.getY(i);
      
      // Move up
      y += speedData[i] * delta;
      
      // Wrap around when reaching top boundary
      if (y > 2.5) {
        y = -2.0;
        positionsAttr.setX(i, (Math.random() - 0.5) * 6);
        positionsAttr.setZ(i, (Math.random() - 0.5) * 5);
      }
      
      positionsAttr.setY(i, y);
    }
    
    positionsAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00f0ff"
        size={0.03}
        transparent
        opacity={0.6}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};


export const Scene: React.FC = () => {
  return (
    <>
      {/* Lights Setup */}
      {/* Soft fill ambient */}
      <ambientLight intensity={0.15} />

      {/* Cyberpunk Neon Highlights */}
      {/* Direct neon cyan spotlight on character */}
      <spotLight
        position={[2, 4, 3]}
        angle={0.4}
        penumbra={0.8}
        intensity={2.5}
        color="#00f0ff"
        castShadow
      />
      {/* Cyber purple back light */}
      <directionalLight
        position={[-3, 2, -2]}
        intensity={1.5}
        color="#8b5cf6"
      />
      {/* Glowing point lights */}
      <pointLight position={[0, 2, 1]} intensity={0.5} color="#00ff88" />

      {/* Atmospheric Fog */}
      <fog attach="fog" args={['#050816', 8, 15]} />

      {/* Camera Controller */}
      <CameraController />

      {/* Code Particles */}
      <ParticleSystem />

      {/* Character and Workspace */}
      <Character />

      {/* Cyber Grid Floor */}
      <group position={[0, -1.6, 0]}>
        <Grid
          renderOrder={-1}
          position={[0, 0, 0]}
          args={[30, 30]} // size
          cellSize={0.5}
          cellThickness={1.0}
          cellColor="#00f0ff"
          sectionSize={2.5}
          sectionThickness={1.5}
          sectionColor="#8b5cf6"
          fadeDistance={10}
          fadeStrength={1}
          infiniteGrid
        />
      </group>
    </>
  );
};
