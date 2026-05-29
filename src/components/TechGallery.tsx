import React from 'react';
import { useAudio } from '../hooks/useAudio';
import { Brain, Globe, CloudLightning, ShieldCheck, Smartphone, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

interface TechItem {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  percentage: number;
  subtechs: string[];
  color: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

const TECH_DATA: TechItem[] = [
  {
    id: 'ai-ml',
    name: 'AI & NEURAL NETWORKS',
    subtitle: 'COGNITIVE SYSTEMS',
    description: 'On-device tensor architectures, computer vision pipelines, and localized micro-LLM executors running via WebGPU.',
    percentage: 92,
    subtechs: ['TensorFlow.js', 'ONNX Runtime', 'WebGPU', 'PyTorch Compilers'],
    color: '#8b5cf6', // purple
    icon: Brain
  },
  {
    id: 'web-frontend',
    name: 'WEB & INTERACTIVE 3D',
    subtitle: 'SPATIAL RENDERING',
    description: 'Ultra-smooth WebGL canvases, GLSL vertex/fragment shaders, procedural textures, and GSAP/Motion interfaces.',
    percentage: 98,
    subtechs: ['Three.js', 'React Three Fiber', 'Shaders (GLSL)', 'GSAP / Motion'],
    color: '#00f0ff', // cyan
    icon: Globe
  },
  {
    id: 'cloud-edge',
    name: 'CLOUD & DECENTRALIZED EDGE',
    subtitle: 'HYPER-SCALING',
    description: 'Global serverless workers, decentralized state networks, real-time database nodes, and WASM runtime edge modules.',
    percentage: 87,
    subtechs: ['Cloudflare Workers', 'Vercel Edge', 'Rust WASM', 'Supabase Realtime'],
    color: '#00ff88', // green
    icon: CloudLightning
  },
  {
    id: 'cybersecurity',
    name: 'CYBERSECURITY & NETWORKS',
    subtitle: 'THREAT MITIGATION',
    description: 'Quantum-safe handshake encryptions, JWT/OAuth flow security, real-time socket rate limiters, and smart-contract verification.',
    percentage: 84,
    subtechs: ['Quantum Crypto', 'WebSockets Security', 'Auth0 / JWT', 'Ethers.js'],
    color: '#ec4899', // pink
    icon: ShieldCheck
  },
  {
    id: 'mobile-dev',
    name: 'MOBILE SYSTEMS',
    subtitle: 'HYBRID COMPILATION',
    description: 'Cross-platform native bridges, hardware acceleration wrappers, local database caching, and responsive spatial viewports.',
    percentage: 89,
    subtechs: ['React Native', 'Expo', 'SQLite Cache', 'WebSockets'],
    color: '#fbbf24', // yellow
    icon: Smartphone
  },
  {
    id: 'robotics-iot',
    name: 'ROBOTICS & SPATIAL IOT',
    subtitle: 'HARDWARE INTERFACES',
    description: 'Serial port communication controllers, room mapping arrays, smart sensory telemetry, and low-latency websocket streams.',
    percentage: 76,
    subtechs: ['Web Serial API', 'ESP32 Bridges', 'Spatial Mapping', 'Telemetry Logs'],
    color: '#3b82f6', // blue
    icon: Cpu
  }
];

export const TechGallery: React.FC = () => {
  const { playHover, playClick } = useAudio();

  return (
    <section
      id="tech-gallery"
      style={{
        padding: '120px 0',
        position: 'relative',
        zIndex: 10,
        background: 'linear-gradient(to bottom, transparent, rgba(5, 8, 22, 0.9) 20%, rgba(5, 8, 22, 0.9) 80%, transparent)'
      }}
    >
      <div className="container">
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '0.8rem',
              color: '#8b5cf6',
              letterSpacing: '5px',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '15px'
            }}
            className="text-glow-purple"
          >
            INTELLIGENCE DESK
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '20px', letterSpacing: '1px' }}>
            TECHNOLOGY MATRIX
          </h2>
          <div style={{ width: '80px', height: '4px', background: 'linear-gradient(90deg, #8b5cf6, #00f0ff)', margin: '0 auto', borderRadius: '2px' }} />
        </div>

        {/* Dashboard Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '30px'
          }}

        >
          {TECH_DATA.map((tech) => {
            const Icon = tech.icon;
            const radius = 24;
            const strokeWidth = 4;
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset = circumference - (tech.percentage / 100) * circumference;

            return (
              <motion.div
                key={tech.id}
                onMouseEnter={playHover}
                onClick={playClick}
                className="glass-panel"
                style={{
                  padding: '30px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'default'
                }}
                whileHover={{
                  y: -5,
                  borderColor: tech.color,
                  boxShadow: `0 10px 25px rgba(${tech.color === '#00f0ff' ? '0, 240, 255' : tech.color === '#8b5cf6' ? '139, 92, 246' : '0, 255, 136'}, 0.1)`
                }}
              >
                {/* Upper Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  {/* Icon Block with glowing background */}
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid rgba(255, 255, 255, 0.1)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: tech.color,
                      boxShadow: `inset 0 0 10px rgba(${tech.color === '#00f0ff' ? '0, 240, 255' : tech.color === '#8b5cf6' ? '139, 92, 246' : '0, 255, 136'}, 0.1)`
                    }}
                  >
                    <Icon size={24} />
                  </div>

                  {/* Radial Loading Meter */}
                  <div style={{ position: 'relative', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifySelf: 'center' }}>
                    <svg width="56" height="56" style={{ transform: 'rotate(-90deg)' }}>
                      {/* Background circle */}
                      <circle
                        cx="28"
                        cy="28"
                        r={radius}
                        fill="transparent"
                        stroke="rgba(255, 255, 255, 0.05)"
                        strokeWidth={strokeWidth}
                      />
                      {/* Active progress */}
                      <motion.circle
                        cx="28"
                        cy="28"
                        r={radius}
                        fill="transparent"
                        stroke={tech.color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        whileInView={{ strokeDashoffset }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        strokeLinecap="round"
                      />
                    </svg>
                    {/* Text count inside meter */}
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: '0.65rem',
                      fontFamily: "'Orbitron', sans-serif",
                      fontWeight: 700,
                      color: '#fff'
                    }}>
                      {tech.percentage}%
                    </div>
                  </div>
                </div>

                {/* Subtitle */}
                <div style={{ 
                  fontFamily: "'Orbitron', sans-serif", 
                  fontSize: '0.65rem', 
                  color: tech.color, 
                  letterSpacing: '2px', 
                  marginBottom: '6px',
                  fontWeight: 700 
                }}>
                  {tech.subtitle}
                </div>

                {/* Title */}
                <h3 style={{ fontSize: '1.25rem', color: '#f3f4f6', fontWeight: 900, marginBottom: '15px', letterSpacing: '0.5px' }}>
                  {tech.name}
                </h3>

                {/* Description */}
                <p style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '25px' }}>
                  {tech.description}
                </p>

                {/* Sub-frameworks and Tags */}
                <div style={{ 
                  marginTop: 'auto', 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '6px', 
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  paddingTop: '15px' 
                }}>
                  {tech.subtechs.map((sub, idx) => (
                    <span key={idx} style={{ 
                      fontSize: '0.7rem', 
                      color: '#fff', 
                      background: 'rgba(255, 255, 255, 0.04)', 
                      padding: '2px 8px', 
                      borderRadius: '4px',
                      fontFamily: "'Space Grotesk', sans-serif",
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                      {sub}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
