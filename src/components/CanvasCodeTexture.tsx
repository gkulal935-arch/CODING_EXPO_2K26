import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface CanvasCodeTextureProps {
  type: 'code' | 'graph' | 'matrix';
  color?: string;
  speed?: number;
}

const SAMPLE_CODE = [
  'import { useFrame } from "@react-three/fiber";',
  'const cognitiveNode = new NeuralLink();',
  'function renderExhibition() {',
  '  const scene = new THREE.Scene();',
  '  scene.fog = new THREE.FogExp2(0x050816, 0.05);',
  '  const cyberCoder = spawnDeveloper();',
  '  cyberCoder.loadBrainData();',
  '  while (engine.running) {',
  '    cyberCoder.processQueue();',
  '    scene.updateMatrixWorld();',
  '  }',
  '}',
  'const stream = crypto.createCipher("aes-256");',
  'async function fetchShowcases() {',
  '  const req = await fetch("/api/projects");',
  '  const data = await req.json();',
  '  return data.map(fitToGrid);',
  '}',
  'class NeuralNetwork extends Layer {',
  '  forward(inputs) {',
  '    return inputs.map(i => this.activate(i));',
  '  }',
  '}'
];

export const CanvasCodeTexture: React.FC<CanvasCodeTextureProps> = ({
  type,
  color = '#00f0ff',
  speed = 1.0
}) => {
  const canvas = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    return c;
  }, []);

  const textureRef = useRef<THREE.CanvasTexture>(null);
  
  // State variables for drawing animations
  const stateRef = useRef({
    lines: [] as { text: string; x: number; y: number; alpha: number }[],
    lastUpdate: 0,
    graphPoints: [] as number[],
    matrixColumns: [] as number[],
    matrixFontSize: 16
  });

  // Initial set up for matrix and graph
  useEffect(() => {
    const state = stateRef.current;
    
    // Matrix columns initial positions
    const cols = Math.floor(canvas.width / state.matrixFontSize);
    state.matrixColumns = Array(cols).fill(0).map(() => Math.random() * -100);
    
    // Graph points initial values
    state.graphPoints = Array(50).fill(0).map(() => Math.sin(Math.random()) * 80 + 256);
    
    // Code lines initial positions
    for (let i = 0; i < 15; i++) {
      state.lines.push({
        text: SAMPLE_CODE[Math.floor(Math.random() * SAMPLE_CODE.length)],
        x: 20,
        y: canvas.height - (i * 35) - 40,
        alpha: 1 - (i * 0.06)
      });
    }
  }, [canvas]);

  useFrame((r3fState) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const time = r3fState.clock.getElapsedTime();
    const state = stateRef.current;

    // Clear background with semi-transparent black for motion trail
    ctx.fillStyle = 'rgba(5, 8, 22, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (type === 'code') {
      // Draw grid lines first
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw scrolling code text
      ctx.font = 'bold 16px "Space Grotesk", monospace';
      
      const updateInterval = 0.15 / speed; // time in seconds between line movements
      if (time - state.lastUpdate > updateInterval) {
        state.lastUpdate = time;
        
        // Move lines up
        state.lines.forEach((line) => {
          line.y -= 15;
          line.alpha -= 0.05;
        });

        // Remove offscreen line
        state.lines = state.lines.filter(l => l.y > -20);

        // Add a new line at the bottom
        state.lines.push({
          text: SAMPLE_CODE[Math.floor(Math.random() * SAMPLE_CODE.length)],
          x: 20,
          y: canvas.height - 20,
          alpha: 1.0
        });
      }

      // Draw lines
      state.lines.forEach((line) => {
        ctx.fillStyle = color;
        ctx.globalAlpha = Math.max(0.1, line.alpha);
        ctx.fillText(line.text, line.x, line.y);
      });
      ctx.globalAlpha = 1.0;

      // Draw terminal cursor at the last line
      if (state.lines.length > 0) {
        const lastLine = state.lines[state.lines.length - 1];
        const cursorY = canvas.height - 20;
        if (Math.floor(time * 3) % 2 === 0) {
          ctx.fillStyle = color;
          ctx.fillRect(lastLine.x + ctx.measureText(lastLine.text).width + 6, cursorY - 14, 10, 16);
        }
      }

    } else if (type === 'graph') {
      // Draw a complex futuristic diagnostic graph
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)';
      ctx.lineWidth = 2;
      
      // Draw background circle target
      ctx.beginPath();
      ctx.arc(256, 256, 150, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(256, 256, 80, 0, Math.PI * 2);
      ctx.stroke();

      // Rotating scanner line
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
      ctx.beginPath();
      ctx.moveTo(256, 256);
      ctx.lineTo(
        256 + Math.cos(time * 2) * 150,
        256 + Math.sin(time * 2) * 150
      );
      ctx.stroke();

      // Oscilloscope wave
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.beginPath();

      const numPoints = state.graphPoints.length;
      for (let i = 0; i < numPoints; i++) {
        // Shift values and add new noise
        if (Math.random() > 0.9 && i === numPoints - 1) {
          state.graphPoints[i] = 256 + (Math.sin(time * 10) * 80) + (Math.random() - 0.5) * 50;
        } else if (i < numPoints - 1) {
          state.graphPoints[i] = THREE.MathUtils.lerp(state.graphPoints[i], state.graphPoints[i + 1], 0.1 * speed);
        }

        const x = (canvas.width / (numPoints - 1)) * i;
        const y = state.graphPoints[i];

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // reset

      // Overlay text data
      ctx.fillStyle = '#8b5cf6';
      ctx.font = '12px "Orbitron", sans-serif';
      ctx.fillText(`FRQ: ${(55 + Math.sin(time) * 2).toFixed(2)}Hz`, 20, 40);
      ctx.fillText(`CPU: ${(40 + Math.sin(time * 3) * 15).toFixed(1)}%`, 20, 60);
      ctx.fillText('NODE_OK', 20, 80);

    } else if (type === 'matrix') {
      // Digital matrix falling code
      ctx.fillStyle = color;
      ctx.font = `bold ${state.matrixFontSize}px monospace`;

      state.matrixColumns.forEach((y, colIndex) => {
        // Character generator
        const char = String.fromCharCode(33 + Math.floor(Math.random() * 93));
        const x = colIndex * state.matrixFontSize;
        
        ctx.fillStyle = y > 400 ? '#fff' : color;
        ctx.fillText(char, x, y);

        // Move down
        state.matrixColumns[colIndex] += state.matrixFontSize * (0.5 + Math.random() * 0.5) * speed;

        // Reset column if it leaves screen
        if (state.matrixColumns[colIndex] > canvas.height && Math.random() > 0.975) {
          state.matrixColumns[colIndex] = 0;
        }
      });
    }

    // Request texture update
    if (textureRef.current) {
      textureRef.current.needsUpdate = true;
    }
  });

  return (
    <canvasTexture
      ref={textureRef}
      attach="map"
      image={canvas}
      colorSpace={THREE.SRGBColorSpace}
      wrapS={THREE.ClampToEdgeWrapping}
      wrapT={THREE.ClampToEdgeWrapping}
    />
  );
};
