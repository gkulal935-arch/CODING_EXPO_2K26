import React from 'react';
import { useAudio } from '../hooks/useAudio';
import { Cpu, Network, Terminal, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface Creator {
  id: string;
  name: string;
  role: string;
  tagline: string;
  skills: { name: string; level: number }[];
  avatar: string; // fallback representation
  github: string;
  twitter: string;
  accent: string;
  icon: React.ComponentType<{ className?: string; size?: number; style?: React.CSSProperties }>;
  status: 'ACTIVE' | 'IDLE' | 'COMPILING';
}

const CREATORS_DATA: Creator[] = [
  {
    id: 'alex-chen',
    name: 'ALEX CHEN',
    role: 'DIGITAL ARCHITECT',
    tagline: 'Specializes in spatial WebGL engines, low-poly geometries, and responsive 3D viewports.',
    skills: [
      { name: 'Three.js / WebGL', level: 95 },
      { name: 'Shader Math (GLSL)', level: 88 },
      { name: 'TypeScript / React', level: 90 }
    ],
    avatar: 'AC',
    github: 'https://github.com',
    twitter: 'https://x.com',
    accent: '#00f0ff', // cyan
    icon: Network,
    status: 'ACTIVE'
  },
  {
    id: 'sarah-vance',
    name: 'SARAH VANCE',
    role: 'NEURAL DEV',
    tagline: 'Focuses on edge neural modeling, model compilation, and on-device WebGPU training layers.',
    skills: [
      { name: 'TensorFlow / PyTorch', level: 92 },
      { name: 'WebGPU Pipeline', level: 85 },
      { name: 'Parallel Compute', level: 80 }
    ],
    avatar: 'SV',
    github: 'https://github.com',
    twitter: 'https://x.com',
    accent: '#8b5cf6', // purple
    icon: Cpu,
    status: 'COMPILING'
  },
  {
    id: 'marcus-k',
    name: 'MARCUS K.',
    role: 'CYBERSECURITY ENG',
    tagline: 'Builds encrypted websocket sockets, blockchain auth APIs, and zero-knowledge protocol adapters.',
    skills: [
      { name: 'Quantum Cryptography', level: 90 },
      { name: 'Rust / WebAssembly', level: 86 },
      { name: 'Socket Pipelines', level: 92 }
    ],
    avatar: 'MK',
    github: 'https://github.com',
    twitter: 'https://x.com',
    accent: '#00ff88', // green
    icon: Shield,
    status: 'ACTIVE'
  },
  {
    id: 'elena-rostova',
    name: 'ELENA ROSTOVA',
    role: 'CREATIVE DEVELOPER',
    tagline: 'Pioneers Web Audio algorithms, procedural sound synthesizers, and frequency visualizations.',
    skills: [
      { name: 'Web Audio Synthesis', level: 94 },
      { name: 'Visual Oscillators', level: 88 },
      { name: 'GSAP Choreography', level: 90 }
    ],
    avatar: 'ER',
    github: 'https://github.com',
    twitter: 'https://x.com',
    accent: '#ec4899', // pink
    icon: Terminal,
    status: 'IDLE'
  }
];

export const FeaturedCreators: React.FC = () => {
  const { playHover, playClick } = useAudio();

  return (
    <section
      id="creators"
      style={{
        padding: '120px 0',
        position: 'relative',
        zIndex: 10,
        background: 'linear-gradient(to bottom, transparent, rgba(5, 8, 22, 0.9) 15%, rgba(5, 8, 22, 0.9) 85%, transparent)'
      }}
    >
      <div className="container">
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '0.8rem',
              color: '#00ff88',
              letterSpacing: '5px',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '15px'
            }}
            className="text-glow-green"
          >
            CREW MANIFEST
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '20px', letterSpacing: '1px' }}>
            FEATURED DEVELOPERS
          </h2>
          <div style={{ width: '80px', height: '4px', background: 'linear-gradient(90deg, #00ff88, #8b5cf6)', margin: '0 auto', borderRadius: '2px' }} />
        </div>

        {/* Creators Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '30px'
          }}
        >
          {CREATORS_DATA.map((creator) => {
            const Icon = creator.icon;
            return (
              <motion.div
                key={creator.id}
                onMouseEnter={playHover}
                onClick={playClick}
                className="glass-panel"
                style={{
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'default'
                }}
                whileHover={{
                  y: -5,
                  borderColor: creator.accent,
                  boxShadow: `0 10px 25px rgba(${creator.accent === '#00f0ff' ? '0, 240, 255' : creator.accent === '#8b5cf6' ? '139, 92, 246' : '0, 255, 136'}, 0.1)`
                }}
              >
                {/* Micro Scanline Bar across card */}
                <div 
                  className="scanline-bar" 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none'
                  }} 
                />

                {/* Status indicator badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span 
                      style={{ 
                        width: '6px', 
                        height: '6px', 
                        borderRadius: '50%', 
                        backgroundColor: creator.status === 'ACTIVE' ? '#00ff88' : creator.status === 'COMPILING' ? '#8b5cf6' : '#9ca3af',
                        boxShadow: `0 0 6px ${creator.status === 'ACTIVE' ? '#00ff88' : creator.status === 'COMPILING' ? '#8b5cf6' : '#9ca3af'}`
                      }} 
                    />
                    <span style={{ 
                      fontSize: '0.6rem', 
                      fontFamily: "'Orbitron', sans-serif", 
                      fontWeight: 700, 
                      color: creator.status === 'ACTIVE' ? '#00ff88' : creator.status === 'COMPILING' ? '#8b5cf6' : '#9ca3af',
                      letterSpacing: '1px' 
                    }}>
                      {creator.status}
                    </span>
                  </div>
                  <Icon size={16} style={{ color: creator.accent }} />
                </div>

                {/* Avatar Shield */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                  <div style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    border: `2px solid ${creator.accent}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(5, 8, 22, 0.8)',
                    fontFamily: "'Orbitron', sans-serif",
                    fontWeight: 900,
                    fontSize: '1.25rem',
                    color: '#fff',
                    boxShadow: `0 0 15px rgba(${creator.accent === '#00f0ff' ? '0, 240, 255' : creator.accent === '#8b5cf6' ? '139, 92, 246' : '0, 255, 136'}, 0.25)`
                  }}>
                    {creator.avatar}
                  </div>
                </div>

                {/* Info */}
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 900, marginBottom: '4px', letterSpacing: '0.5px' }}>
                    {creator.name}
                  </h3>
                  <div style={{ 
                    fontFamily: "'Orbitron', sans-serif", 
                    fontSize: '0.65rem', 
                    color: creator.accent, 
                    fontWeight: 700,
                    letterSpacing: '2px'
                  }}>
                    {creator.role}
                  </div>
                </div>

                <p style={{ 
                  color: '#9ca3af', 
                  fontSize: '0.75rem', 
                  textAlign: 'center', 
                  lineHeight: '1.5',
                  marginBottom: '20px' 
                }}>
                  {creator.tagline}
                </p>

                {/* Skill bars */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', marginTop: 'auto' }}>
                  {creator.skills.map((skill, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#9ca3af', marginBottom: '2px', fontWeight: 600 }}>
                        <span>{skill.name}</span>
                        <span>{skill.level}%</span>
                      </div>
                      <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                        <motion.div
                          style={{ height: '100%', backgroundColor: creator.accent, borderRadius: '2px' }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social links */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: '12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  paddingTop: '15px'
                }}>
                  <a
                    href={creator.github}
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={playHover}
                    style={{ color: '#9ca3af', transition: 'color 0.3s ease', display: 'inline-flex' }}
                    onMouseOver={(e) => e.currentTarget.style.color = creator.accent}
                    onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
                  >
                    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                  </a>
                  <a
                    href={creator.twitter}
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={playHover}
                    style={{ color: '#9ca3af', transition: 'color 0.3s ease', display: 'inline-flex' }}
                    onMouseOver={(e) => e.currentTarget.style.color = creator.accent}
                    onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
                  >
                    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
