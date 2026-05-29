import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import gsap from 'gsap';

interface CursorSceneProps {
  mouseRef: React.RefObject<{
    x: number;
    y: number;
    smoothX: number;
    smoothY: number;
    tailX: number;
    tailY: number;
    isHovering: boolean;
    isMagnetic: boolean;
    hoveredEl: HTMLElement | null;
  }>;
  isHovering: boolean;
  isTouch: boolean;
}

// Capped particle pool size for high-performance Rendering
const MAX_PARTICLES = 25;

export const CursorScene: React.FC<CursorSceneProps> = ({ mouseRef, isHovering, isTouch }) => {
  const { size } = useThree();
  
  // Refs for meshes
  const orbRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const tailRef = useRef<THREE.Mesh>(null);
  
  const particleRefs = useRef<THREE.Sprite[]>([]);
  const frameCountRef = useRef(0);
  
  // GSAP animation values
  const hoverValRef = useRef({ current: 0 }); // 0 = normal, 1 = hovering interactive
  
  // Track previous target coordinates to calculate mouse speed
  const prevCoordsRef = useRef({ x: 0, y: 0 });
  
  // Create beautiful radial glow texture for sparks
  const glowTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.2, 'rgba(0, 240, 255, 0.8)');
      grad.addColorStop(0.6, 'rgba(139, 92, 246, 0.3)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(32, 32, 32, 0, Math.PI * 2);
      ctx.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  // Pre-render glowing code symbols dynamically to canvas textures
  const symbolTextures = useMemo(() => {
    const symbols = ['{', '}', '</>', '01', ';', '[', ']'];
    const colors = {
      cyan: '#00f0ff',
      purple: '#8b5cf6'
    };
    const map = new Map<string, THREE.CanvasTexture>();
    
    symbols.forEach(sym => {
      Object.entries(colors).forEach(([colorName, colorVal]) => {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, 128, 128);
          ctx.font = 'bold 54px "Space Grotesk", "Orbitron", monospace';
          ctx.fillStyle = colorVal;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          // Glow baked in
          ctx.shadowColor = colorVal;
          ctx.shadowBlur = 12;
          ctx.fillText(sym, 64, 64);
        }
        const texture = new THREE.CanvasTexture(canvas);
        map.set(`${sym}_${colorName}`, texture);
      });
    });
    
    return map;
  }, []);

  // Particle pool data structures
  const particlesData = useMemo(() => {
    const pool = [];
    for (let i = 0; i < MAX_PARTICLES; i++) {
      pool.push({
        active: false,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        scale: 0,
        opacity: 0,
        life: 0,
        maxLife: 0,
        textureName: 'glow'
      });
    }
    return pool;
  }, []);

  // Retrieve the correct texture by name
  const getTexture = (name: string) => {
    if (name.startsWith('symbol_')) {
      const key = name.replace('symbol_', '');
      return symbolTextures.get(key) || glowTexture;
    }
    return glowTexture;
  };

  // Clean up textures on unmount to prevent leaks
  useEffect(() => {
    return () => {
      glowTexture.dispose();
      symbolTextures.forEach(t => t.dispose());
    };
  }, [glowTexture, symbolTextures]);

  // Animate hover state transition with GSAP
  useEffect(() => {
    if (isTouch) return; // Touch device doesn't have hover triggers
    gsap.to(hoverValRef.current, {
      current: isHovering ? 1 : 0,
      duration: 0.3,
      ease: 'power2.out'
    });
  }, [isHovering, isTouch]);

  // Spawns a particle from the pool
  const spawnParticle = (worldX: number, worldY: number, isSymbol: boolean) => {
    const p = particlesData.find(part => !part.active);
    if (!p) return; // Pool full
    
    p.active = true;
    p.x = worldX + (Math.random() - 0.5) * 4;
    p.y = worldY + (Math.random() - 0.5) * 4;
    
    const angle = Math.random() * Math.PI * 2;
    // Mobile/touch trail particles move slightly slower for tighter trail
    const baseSpeed = isTouch ? 25 : 35;
    const speed = isSymbol ? (15 + Math.random() * 20) : (baseSpeed + Math.random() * 45);
    
    p.vx = Math.cos(angle) * speed;
    p.vy = Math.sin(angle) * speed + (isSymbol ? 10 : 5); // Upward drift
    
    p.life = isSymbol ? (0.6 + Math.random() * 0.4) : (0.3 + Math.random() * 0.25);
    p.maxLife = p.life;
    
    if (isSymbol) {
      const symbols = ['{', '}', '</>', '01', ';', '[', ']'];
      const sym = symbols[Math.floor(Math.random() * symbols.length)];
      const color = Math.random() > 0.5 ? 'cyan' : 'purple';
      p.textureName = `symbol_${sym}_${color}`;
      p.scale = isTouch ? (14 + Math.random() * 5) : (18 + Math.random() * 6);
    } else {
      p.textureName = 'glow';
      p.scale = isTouch ? (4 + Math.random() * 4) : (6 + Math.random() * 6);
    }
    p.opacity = 1.0;
  };

  useFrame((state, delta) => {
    frameCountRef.current++;
    const time = state.clock.getElapsedTime();
    const { width: viewW, height: viewH } = size;
    
    const mouse = mouseRef.current;
    if (!mouse) return;
    
    // 1. Calculate target coordinate (apply snapping only to verified small elements)
    let targetX = mouse.x;
    let targetY = mouse.y;
    
    // Disable snapping on touch screens
    if (!isTouch && mouse.isHovering && mouse.isMagnetic && mouse.hoveredEl) {
      const rect = mouse.hoveredEl.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = mouse.x - cx;
      const dy = mouse.y - cy;
      
      // Subtle Snap: attracted 30% toward center, 70% follows the physical mouse
      targetX = cx + dx * 0.70;
      targetY = cy + dy * 0.70;
    }
    
    // 2. Snappy, frame-rate independent lerps (factors increased to 24 and 12 for instant feel)
    const lerpFactor = 1 - Math.exp(-24 * delta);
    const tailLerpFactor = 1 - Math.exp(-12 * delta);
    
    mouse.smoothX = THREE.MathUtils.lerp(mouse.smoothX, targetX, lerpFactor);
    mouse.smoothY = THREE.MathUtils.lerp(mouse.smoothY, targetY, lerpFactor);
    
    mouse.tailX = THREE.MathUtils.lerp(mouse.tailX, mouse.smoothX, tailLerpFactor);
    mouse.tailY = THREE.MathUtils.lerp(mouse.tailY, mouse.smoothY, tailLerpFactor);
    
    // Project coordinates to Orthographic 3D space
    const worldX = mouse.smoothX - viewW / 2;
    const worldY = -mouse.smoothY + viewH / 2;
    
    const tailWorldX = mouse.tailX - viewW / 2;
    const tailWorldY = -mouse.tailY + viewH / 2;
    
    // Calculate mouse speed for trail particle spawns
    const mxDx = targetX - prevCoordsRef.current.x;
    const mxDy = targetY - prevCoordsRef.current.y;
    const speed = Math.sqrt(mxDx * mxDx + mxDy * mxDy);
    
    prevCoordsRef.current.x = targetX;
    prevCoordsRef.current.y = targetY;
    
    // 3. Throttled particle emission (adapted for mobile touch trails)
    if (isTouch) {
      // Touch drag trail spawns
      if (speed > 1.5 && frameCountRef.current % 3 === 0) {
        spawnParticle(worldX, worldY, false);
      }
      if (speed > 2.0 && frameCountRef.current % 15 === 0) {
        spawnParticle(worldX, worldY, true);
      }
    } else {
      if (mouse.isHovering) {
        // Gentle active fountain on interactive element hover
        if (frameCountRef.current % 4 === 0) {
          spawnParticle(worldX, worldY, false);
        }
        if (frameCountRef.current % 18 === 0) {
          spawnParticle(worldX, worldY, true);
        }
      } else {
        // Trail sparks only at higher speeds
        if (speed > 3.0 && frameCountRef.current % 6 === 0) {
          spawnParticle(worldX, worldY, false);
        }
      }
    }
    
    // 4. Update the main 3D meshes (only if not a touch device)
    if (!isTouch) {
      const hoverVal = hoverValRef.current.current; // GSAP smooth factor 0 to 1
      const pulse = 1.0 + (mouse.isHovering ? Math.sin(time * 12) * 0.06 : 0);
      const currentScale = (1.0 + hoverVal * 0.6) * pulse; // scales from 1.0x to 1.6x on hover
      
      if (orbRef.current) {
        orbRef.current.position.set(worldX, worldY, 0);
        orbRef.current.scale.set(currentScale, currentScale, 1);
      }
      
      if (shellRef.current) {
        shellRef.current.rotation.z = time * (0.6 + hoverVal * 1.0);
        shellRef.current.rotation.y = time * (0.3 + hoverVal * 0.5);
      }
      
      if (coreRef.current) {
        coreRef.current.rotation.x = -time * 0.25;
      }
      
      if (tailRef.current) {
        tailRef.current.position.set(tailWorldX, tailWorldY, -0.1);
        const tailScale = 1.0 - hoverVal * 0.3; // subtle scaling on hover
        tailRef.current.scale.set(tailScale, tailScale, 1);
      }
    }
    
    // 5. Update WebGL particle sprite pool (always active)
    const pData = particlesData;
    const pRefs = particleRefs.current;
    
    for (let i = 0; i < MAX_PARTICLES; i++) {
      const p = pData[i];
      const sprite = pRefs[i];
      if (!sprite) continue;
      
      if (!p.active) {
        sprite.visible = false;
        continue;
      }
      
      p.life -= delta;
      if (p.life <= 0) {
        p.active = false;
        sprite.visible = false;
        continue;
      }
      
      // Physics
      p.vx *= 0.94;
      p.vy *= 0.94;
      p.x += p.vx * delta;
      p.y += p.vy * delta;
      
      p.opacity = p.life / p.maxLife;
      const progress = p.life / p.maxLife;
      
      let scaleMult = progress;
      if (p.textureName.startsWith('symbol_')) {
        const birthProgress = 1.0 - progress;
        const popFactor = birthProgress < 0.2 ? birthProgress * 5 : 1.0;
        scaleMult = popFactor * progress;
      }
      
      sprite.visible = true;
      sprite.position.set(p.x, p.y, -0.05);
      
      const currentPartScale = p.scale * scaleMult;
      sprite.scale.set(currentPartScale, currentPartScale, 1);
      
      // Swap texture map if needed
      const tex = getTexture(p.textureName);
      if (sprite.material.map !== tex) {
        sprite.material.map = tex;
        sprite.material.needsUpdate = true;
      }
      sprite.material.opacity = p.opacity;
    }
  });

  return (
    <>
      <OrthographicCamera
        makeDefault
        left={-size.width / 2}
        right={size.width / 2}
        top={size.height / 2}
        bottom={-size.height / 2}
        near={0.1}
        far={100}
        position={[0, 0, 10]}
      />
      
      <ambientLight intensity={0.8} />
      <pointLight position={[0, 0, 5]} intensity={1.5} color="#00f0ff" />
      
      {/* Conditionally hide cursor meshes on mobile to prevent blocking touches */}
      {!isTouch && (
        <>
          {/* Main Cursor Orb */}
          <group ref={orbRef}>
            <mesh ref={coreRef}>
              <sphereGeometry args={[10, 16, 16]} />
              <meshBasicMaterial 
                color="#00f0ff"
                transparent
                opacity={0.9}
              />
            </mesh>
            
            {/* Holographic Wireframe shell */}
            <mesh ref={shellRef}>
              <sphereGeometry args={[16, 12, 12]} />
              <meshBasicMaterial
                color="#8b5cf6"
                wireframe
                transparent
                opacity={0.65}
              />
            </mesh>
            
            {/* Soft bloom backing sprite */}
            <sprite scale={[48, 48, 1]} position={[0, 0, -0.2]}>
              <spriteMaterial
                map={glowTexture}
                transparent
                opacity={0.5}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </sprite>
          </group>
          
          {/* Tail Ring */}
          <mesh ref={tailRef}>
            <ringGeometry args={[6, 8, 16]} />
            <meshBasicMaterial
              color="#8b5cf6"
              transparent
              opacity={0.4}
            />
          </mesh>
        </>
      )}
      
      {/* WebGL particle sprite pool (always active) */}
      <group>
        {Array.from({ length: MAX_PARTICLES }).map((_, i) => (
          <sprite
            key={i}
            ref={(el) => {
              if (el) particleRefs.current[i] = el;
            }}
            visible={false}
          >
            <spriteMaterial
              transparent
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        ))}
      </group>
    </>
  );
};
