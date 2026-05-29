import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Scene } from './Scene';

export const CanvasContainer: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1, // behind the text overlay sections but fixed
        pointerEvents: 'none', // click through to scroll
        backgroundColor: '#050816'
      }}
    >
      <Canvas
        camera={{ position: [0, 1.2, 3.2], fov: 50 }}
        gl={{ 
          antialias: true, 
          alpha: false,
          powerPreference: 'high-performance'
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <Scene />
          
          {/* Cinematic Bloom/Glow Postprocessing */}
          <EffectComposer>
            <Bloom 
              luminanceThreshold={0.15} 
              luminanceSmoothing={0.9} 
              intensity={0.6} 
              mipmapBlur
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
};
