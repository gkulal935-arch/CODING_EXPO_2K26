import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { CanvasCodeTexture } from './CanvasCodeTexture';

export const Character: React.FC = () => {
  const characterGroup = useRef<THREE.Group>(null);
  const headGroup = useRef<THREE.Group>(null);
  const bodyGroup = useRef<THREE.Group>(null);
  const eyesGroup = useRef<THREE.Group>(null);

  // Refs for floating screens to animate them independently
  const screenLeft = useRef<THREE.Mesh>(null);
  const screenCenter = useRef<THREE.Mesh>(null);
  const screenRight = useRef<THREE.Mesh>(null);

  // Blinking animation states
  const blinkStateRef = useRef({
    blinkTimer: 0,
    blinkInterval: 3 + Math.random() * 4, // blink every 3-7 seconds
    isBlinking: false,
    blinkProgress: 0
  });

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const pointer = state.pointer; // mouse positions normalized (-1 to 1)

    // 1. Idle Floating Animation (sinusoidal vertical float)
    if (characterGroup.current) {
      characterGroup.current.position.y = -0.3 + Math.sin(time * 1.5) * 0.02;
    }

    // 2. Interactive Head Tracking (rotate head towards pointer with idle scanning fallback)
    if (headGroup.current) {
      // Add slow robotic scanning sway when pointer is not active/moving
      const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 768;
      const idleSwaySpeed = isMobileDevice ? 0.7 : 0.4;
      const idleSwayX = Math.sin(time * idleSwaySpeed) * 0.12;
      const idleSwayY = Math.cos(time * (idleSwaySpeed * 0.8)) * 0.08;
      
      const targetRotY = pointer.x * 0.7 + idleSwayX;
      const targetRotX = -pointer.y * 0.4 + idleSwayY;
      
      headGroup.current.rotation.y = THREE.MathUtils.lerp(headGroup.current.rotation.y, targetRotY, 0.08);
      headGroup.current.rotation.x = THREE.MathUtils.lerp(headGroup.current.rotation.x, targetRotX, 0.08);
      // Slight head roll
      headGroup.current.rotation.z = THREE.MathUtils.lerp(headGroup.current.rotation.z, pointer.x * -0.15 + idleSwayX * 0.2, 0.08);
    }

    // 3. Natural Body Sway (slight rotation following cursor + idle breathing)
    if (bodyGroup.current) {
      const breathingSway = Math.sin(time * 0.6) * 0.02;
      
      const targetBodyY = pointer.x * 0.2 + breathingSway;
      const targetBodyX = -pointer.y * 0.08 + Math.cos(time * 0.5) * 0.01;

      
      bodyGroup.current.rotation.y = THREE.MathUtils.lerp(bodyGroup.current.rotation.y, targetBodyY, 0.04);
      bodyGroup.current.rotation.x = THREE.MathUtils.lerp(bodyGroup.current.rotation.x, targetBodyX, 0.04);
    }


    // 4. Blinking Logic
    const blink = blinkStateRef.current;
    blink.blinkTimer += delta;
    if (blink.blinkTimer > blink.blinkInterval) {
      blink.isBlinking = true;
      blink.blinkTimer = 0;
      blink.blinkInterval = 2 + Math.random() * 5;
    }

    if (blink.isBlinking && eyesGroup.current) {
      blink.blinkProgress += delta * 12; // speed of blink
      const scaleY = Math.abs(Math.sin(blink.blinkProgress));
      
      if (blink.blinkProgress >= Math.PI) {
        // Blink finished
        eyesGroup.current.scale.y = 1;
        blink.isBlinking = false;
        blink.blinkProgress = 0;
      } else {
        // Scale eyes down on Y axis to simulate closing eyelids
        eyesGroup.current.scale.y = Math.max(0.05, 1 - scaleY);
      }
    }

    // 5. Floating Holographic Screens (orbiting and floating + cursor parallax interaction)
    if (screenLeft.current) {
      screenLeft.current.position.x = -1.3 + pointer.x * 0.08;
      screenLeft.current.position.y = 0.5 + Math.sin(time * 1.8 + 0.5) * 0.04 + pointer.y * 0.05;
      screenLeft.current.rotation.y = -0.5 + Math.sin(time * 0.5) * 0.03 + pointer.x * 0.08;
      screenLeft.current.rotation.x = pointer.y * 0.05;
    }
    if (screenCenter.current) {
      screenCenter.current.position.x = pointer.x * 0.08;
      screenCenter.current.position.y = 0.8 + Math.sin(time * 1.4) * 0.03 + pointer.y * 0.05;
      screenCenter.current.rotation.y = pointer.x * 0.08;
      screenCenter.current.rotation.x = -0.2 + Math.sin(time * 0.4) * 0.02 - pointer.y * 0.05;
    }
    if (screenRight.current) {
      screenRight.current.position.x = 1.3 + pointer.x * 0.08;
      screenRight.current.position.y = 0.5 + Math.sin(time * 2.0 + 1.0) * 0.04 + pointer.y * 0.05;
      screenRight.current.rotation.y = 0.5 + Math.sin(time * 0.6) * 0.03 + pointer.x * 0.08;
      screenRight.current.rotation.x = pointer.y * 0.05;
    }

  });

  // Generate keyboard keys procedurally
  const keys = useMemo(() => {
    const keyList = [];
    const rows = 4;
    const cols = 12;
    const spacingX = 0.08;
    const spacingZ = 0.08;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // slightly randomize height for cyber keypress look
        const h = 0.01 + Math.random() * 0.015;
        const isGlowing = Math.random() > 0.85;
        keyList.push({
          pos: [
            (c - cols / 2) * spacingX + 0.04,
            h / 2,
            (r - rows / 2) * spacingZ + 0.04
          ] as [number, number, number],
          color: isGlowing ? (Math.random() > 0.5 ? '#00f0ff' : '#8b5cf6') : '#1e1b4b',
          glow: isGlowing
        });
      }
    }
    return keyList;
  }, []);

  return (
    <group ref={characterGroup} position={[0, -0.2, 0]}>
      {/* ================= LIGHT SOURCES WITHIN WORKSPACE ================= */}
      {/* Neon glow from screens hitting character */}
      <pointLight position={[-1.2, 0.5, 0.5]} color="#00f0ff" intensity={1.5} distance={3} decay={2} />
      <pointLight position={[1.2, 0.5, 0.5]} color="#8b5cf6" intensity={1.5} distance={3} decay={2} />
      {/* Underdesk light */}
      <pointLight position={[0, -0.6, -0.2]} color="#00ff88" intensity={0.8} distance={2} decay={2} />

      {/* ================= FLOATING HOLOGRAPHIC SCREENS ================= */}
      {/* Left Screen: Code Terminal */}
      <mesh ref={screenLeft} position={[-1.3, 0.5, 0.3]} rotation={[0, 0.5, 0]}>
        <planeGeometry args={[1.0, 0.7]} />
        <meshBasicMaterial transparent opacity={0.85} side={THREE.DoubleSide}>
          <CanvasCodeTexture type="code" color="#00f0ff" speed={1.2} />
        </meshBasicMaterial>
        {/* Glow Border Frame */}
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(1.0, 0.7)]} />
          <lineBasicMaterial color="#00f0ff" transparent opacity={0.6} />
        </lineSegments>
      </mesh>

      {/* Center Top Screen: System Graph */}
      <mesh ref={screenCenter} position={[0, 0.85, 0.5]} rotation={[-0.2, 0, 0]}>
        <planeGeometry args={[0.9, 0.5]} />
        <meshBasicMaterial transparent opacity={0.85} side={THREE.DoubleSide}>
          <CanvasCodeTexture type="graph" color="#00ff88" speed={1.0} />
        </meshBasicMaterial>
        {/* Glow Border Frame */}
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(0.9, 0.5)]} />
          <lineBasicMaterial color="#00ff88" transparent opacity={0.6} />
        </lineSegments>
      </mesh>

      {/* Right Screen: Binary Data stream */}
      <mesh ref={screenRight} position={[1.3, 0.5, 0.3]} rotation={[0, -0.5, 0]}>
        <planeGeometry args={[1.0, 0.7]} />
        <meshBasicMaterial transparent opacity={0.85} side={THREE.DoubleSide}>
          <CanvasCodeTexture type="matrix" color="#8b5cf6" speed={1.5} />
        </meshBasicMaterial>
        {/* Glow Border Frame */}
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(1.0, 0.7)]} />
          <lineBasicMaterial color="#8b5cf6" transparent opacity={0.6} />
        </lineSegments>
      </mesh>

      {/* ================= THE WORKSPACE (Desk & Keyboard) ================= */}
      {/* Desk Top (Glass panel) */}
      <mesh position={[0, -0.5, 0.2]}>
        <boxGeometry args={[2.4, 0.05, 1.2]} />
        <meshPhysicalMaterial
          color="#050816"
          roughness={0.1}
          metalness={0.1}
          transparent
          opacity={0.6}
          transmission={0.8}
          thickness={0.5}
        />
      </mesh>
      {/* Desk Glow Edges */}
      <lineSegments position={[0, -0.5, 0.2]}>
        <edgesGeometry args={[new THREE.BoxGeometry(2.4, 0.05, 1.2)]} />
        <lineBasicMaterial color="#00f0ff" transparent opacity={0.4} />
      </lineSegments>

      {/* Desk Legs (Metallic pillars) */}
      <mesh position={[-1.1, -1.2, 0.2]}>
        <cylinderGeometry args={[0.04, 0.04, 1.4]} />
        <meshStandardMaterial color="#0c1033" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[1.1, -1.2, 0.2]}>
        <cylinderGeometry args={[0.04, 0.04, 1.4]} />
        <meshStandardMaterial color="#0c1033" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Futuristic Holographic Keyboard Board */}
      <group position={[0, -0.47, 0.4]} rotation={[0.05, 0, 0]}>
        {/* Board base */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.0, 0.02, 0.35]} />
          <meshPhysicalMaterial
            color="#090d29"
            transparent
            opacity={0.8}
            roughness={0.3}
          />
        </mesh>
        {/* Board frame lines */}
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(1.0, 0.02, 0.35)]} />
          <lineBasicMaterial color="#8b5cf6" transparent opacity={0.5} />
        </lineSegments>

        {/* Keyboard Keycaps */}
        {keys.map((k, idx) => (
          <mesh key={idx} position={k.pos}>
            <boxGeometry args={[0.06, 0.02, 0.06]} />
            <meshStandardMaterial
              color={k.color}
              emissive={k.glow ? k.color : '#000000'}
              emissiveIntensity={k.glow ? 2.5 : 0}
              roughness={0.4}
            />
          </mesh>
        ))}
      </group>

      {/* ================= THE CYBERNETIC CODER CHARACTER ================= */}
      <group ref={bodyGroup} position={[0, -0.5, -0.2]}>
        {/* Torso / Neon Hoodie Body */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.3, 0.45, 0.9, 16]} />
          <meshStandardMaterial
            color="#0b0d1a"
            roughness={0.7}
            bumpScale={0.05}
          />
        </mesh>

        {/* Hoodie Neon Trim lines (vertical center zipper line) */}
        <mesh position={[0, 0.5, 0.31]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.02, 0.8, 0.02]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={2}
          />
        </mesh>

        {/* Hoodie Neck Trim (Neon Collar) */}
        <mesh position={[0, 0.94, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.26, 0.02, 8, 24]} />
          <meshStandardMaterial
            color="#8b5cf6"
            emissive="#8b5cf6"
            emissiveIntensity={2}
          />
        </mesh>

        {/* Cyber Arms & Typing Hands Pose */}
        {/* Left Arm */}
        <group position={[-0.45, 0.75, 0.05]}>
          {/* Shoulder joint */}
          <mesh>
            <sphereGeometry args={[0.08]} />
            <meshStandardMaterial color="#0c1033" metalness={0.9} roughness={0.15} />
          </mesh>
          {/* Upper Arm Cylinder */}
          <mesh position={[-0.1, -0.25, 0.15]} rotation={[-0.5, -0.2, -0.3]}>
            <cylinderGeometry args={[0.04, 0.04, 0.55]} />
            <meshStandardMaterial color="#0b0d1a" roughness={0.7} />
          </mesh>
          {/* Elbow Joint */}
          <mesh position={[-0.2, -0.45, 0.3]}>
            <sphereGeometry args={[0.06]} />
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1} />
          </mesh>
          {/* Lower Arm Cylinder resting towards keyboard */}
          <mesh position={[-0.05, -0.45, 0.5]} rotation={[0.4, 0.3, -0.1]}>
            <cylinderGeometry args={[0.035, 0.035, 0.5]} />
            <meshStandardMaterial color="#0b0d1a" roughness={0.7} />
          </mesh>
          {/* Hand resting on keyboard */}
          <mesh position={[0.12, -0.42, 0.65]}>
            <boxGeometry args={[0.07, 0.03, 0.09]} />
            <meshStandardMaterial color="#0c1033" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>

        {/* Right Arm */}
        <group position={[0.45, 0.75, 0.05]}>
          {/* Shoulder joint */}
          <mesh>
            <sphereGeometry args={[0.08]} />
            <meshStandardMaterial color="#0c1033" metalness={0.9} roughness={0.15} />
          </mesh>
          {/* Upper Arm Cylinder */}
          <mesh position={[0.1, -0.25, 0.15]} rotation={[-0.5, 0.2, 0.3]}>
            <cylinderGeometry args={[0.04, 0.04, 0.55]} />
            <meshStandardMaterial color="#0b0d1a" roughness={0.7} />
          </mesh>
          {/* Elbow Joint */}
          <mesh position={[0.2, -0.45, 0.3]}>
            <sphereGeometry args={[0.06]} />
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1} />
          </mesh>
          {/* Lower Arm Cylinder resting towards keyboard */}
          <mesh position={[0.05, -0.45, 0.5]} rotation={[0.4, -0.3, 0.1]}>
            <cylinderGeometry args={[0.035, 0.035, 0.5]} />
            <meshStandardMaterial color="#0b0d1a" roughness={0.7} />
          </mesh>
          {/* Hand resting on keyboard */}
          <mesh position={[-0.12, -0.42, 0.65]}>
            <boxGeometry args={[0.07, 0.03, 0.09]} />
            <meshStandardMaterial color="#0c1033" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>

        {/* Head and Cyber Helmet Group (interactive) */}
        <group ref={headGroup} position={[0, 1.25, 0.05]}>
          {/* Inner Head Core */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.24, 16, 16]} />
            <meshStandardMaterial color="#131524" metalness={0.5} roughness={0.4} />
          </mesh>

          {/* Glowing Eyes Group (blink controllable) */}
          <group ref={eyesGroup} position={[0, 0.04, 0.21]}>
            {/* Left Eye */}
            <mesh position={[-0.09, 0, 0]}>
              <sphereGeometry args={[0.035, 16, 16]} />
              <meshBasicMaterial color="#00ff88" toneMapped={false} />
            </mesh>
            {/* Right Eye */}
            <mesh position={[0.09, 0, 0]}>
              <sphereGeometry args={[0.035, 16, 16]} />
              <meshBasicMaterial color="#00ff88" toneMapped={false} />
            </mesh>
          </group>

          {/* Glowing Glass Outer Helmet (translucent sphere) */}
          <mesh position={[0, 0.02, 0.02]}>
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshPhysicalMaterial
              color="#00f0ff"
              transparent
              opacity={0.35}
              roughness={0.05}
              metalness={0.1}
              transmission={0.9}
              thickness={0.2}
              side={THREE.DoubleSide}
            />
          </mesh>
          
          {/* Helmet Glass Glow Wireframe Overlay */}
          <lineSegments position={[0, 0.02, 0.02]}>
            <edgesGeometry args={[new THREE.SphereGeometry(0.3, 12, 12)]} />
            <lineBasicMaterial color="#00f0ff" transparent opacity={0.15} />
          </lineSegments>

          {/* Helmet Side Cyber-Pods (ears) */}
          <mesh position={[-0.3, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.08, 0.08, 0.06, 16]} />
            <meshStandardMaterial color="#0c1033" metalness={0.8} />
          </mesh>
          <mesh position={[0.3, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.08, 0.08, 0.06, 16]} />
            <meshStandardMaterial color="#0c1033" metalness={0.8} />
          </mesh>

          {/* Side Pod Cyber-Lights */}
          <mesh position={[-0.33, 0.02, 0]}>
            <sphereGeometry args={[0.025]} />
            <meshBasicMaterial color="#8b5cf6" />
          </mesh>
          <mesh position={[0.33, 0.02, 0]}>
            <sphereGeometry args={[0.025]} />
            <meshBasicMaterial color="#8b5cf6" />
          </mesh>

          {/* Cyber Helmet Antennas (pointing backwards) */}
          <mesh position={[-0.15, 0.22, -0.15]} rotation={[-0.4, 0.2, -0.2]}>
            <cylinderGeometry args={[0.015, 0.005, 0.25]} />
            <meshStandardMaterial color="#0c1033" metalness={0.8} />
          </mesh>
          <mesh position={[0.15, 0.22, -0.15]} rotation={[-0.4, -0.2, 0.2]}>
            <cylinderGeometry args={[0.015, 0.005, 0.25]} />
            <meshStandardMaterial color="#0c1033" metalness={0.8} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
