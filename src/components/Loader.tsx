import React, { useState } from 'react';
import { useAudio } from '../hooks/useAudio';
import { Terminal, Cpu, Check } from 'lucide-react';

interface LoaderProps {
  onLoaded: () => void;
}

const BOOT_LOGS = [
  { text: 'SYSTEM: INITIALIZING BCA PROJECT SHOWCASE WORKSPACE...', delay: 100 },
  { text: 'CPU: BOOTING CLIENT-SIDE INTERACTIVE LAYOUT MODULES...', delay: 400 },
  { text: 'MEM: ALIGNING HOLOGRAPHIC 3D CAMERA ENVIRONMENT...', delay: 700 },
  { text: 'NET: ESTABLISHING COMMUNICATIONS WITH DATABASE ROUTERS...', delay: 1000 },
  { text: 'DB: FETCHING SUBMITTED STUDENT PROJECTS AND PREVIEWS...', delay: 1400 },
  { text: 'EXPO: INDEXING STUDENT GITHUB PORTS & ARTIFACTS...', delay: 2000 },
  { text: 'STATUS: CODING EXPO PORTAL SECURED. READY TO ENTER.', delay: 2600 }
];

export const Loader: React.FC<LoaderProps> = ({ onLoaded }) => {
  const { playBoot, playClick, toggleMute } = useAudio();
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'booting' | 'ready' | 'exiting'>('booting');
  const [showInteractionSplash, setShowInteractionSplash] = useState(true);

  // Splash click to start boot sequence with sound
  const handleStartBoot = () => {
    setShowInteractionSplash(false);
    playBoot();
    
    // Animate logs
    BOOT_LOGS.forEach((log) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, log.text]);
      }, log.delay);
    });

    // Animate progress bar
    const duration = 2800;
    const intervalTime = 50;
    const step = 100 / (duration / intervalTime);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(interval);
          setStage('ready');
          return 100;
        }
        return next;
      });
    }, intervalTime);
  };

  const handleEnter = (withAudio: boolean) => {
    playClick();
    if (withAudio) {
      toggleMute();
    }
    setStage('exiting');
    setTimeout(() => {
      onLoaded();
    }, 800); // match fade transition
  };

  if (showInteractionSplash) {
    return (
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#050816',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Space Grotesk', sans-serif",
          overflow: 'hidden'
        }}
        className="scanline-bar"
      >
        <div className="scanline-overlay" />
        
        {/* Futuristic Background Circles */}
        <div style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }} />
        
        <div 
          className="glass-panel" 
          style={{
            padding: '40px 60px',
            textAlign: 'center',
            maxWidth: '600px',
            width: '90%',
            position: 'relative',
            zIndex: 30,
            border: '1px solid rgba(0, 240, 255, 0.3)',
            boxShadow: '0 0 30px rgba(0, 240, 255, 0.15)'
          }}
        >
          <div style={{
            fontSize: '1.1rem',
            color: '#00f0ff',
            textTransform: 'uppercase',
            letterSpacing: '5px',
            fontFamily: "'Orbitron', sans-serif",
            marginBottom: '15px'
          }} className="text-glow-cyan">
            Showcase Online
          </div>
          
          <h1 style={{
            fontSize: '2.5rem',
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: '900',
            lineHeight: '1.2',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #fff 0%, #9ca3af 50%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '1px'
          }}>
            Coding Expo
          </h1>
          
          <p style={{
            color: '#9ca3af',
            marginBottom: '35px',
            fontSize: '0.95rem',
            lineHeight: '1.6'
          }}>
            Welcome to the futuristic student showcase displaying innovative BCA websites, AI models, software developments, and IoT creations.
          </p>

          <button
            onClick={handleStartBoot}
            style={{
              padding: '16px 32px',
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '1rem',
              fontWeight: 'bold',
              color: '#050816',
              background: 'linear-gradient(90deg, #00f0ff, #8b5cf6)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              letterSpacing: '1px',
              boxShadow: '0 0 25px rgba(0, 240, 255, 0.4)',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 0 35px rgba(139, 92, 246, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 240, 255, 0.4)';
            }}
          >
            <Cpu size={18} />
            ENTER SHOWCASE
          </button>
        </div>
      </div>
    );
  }


  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#050816',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Space Grotesk', sans-serif",
        transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: stage === 'exiting' ? 0 : 1,
        transform: stage === 'exiting' ? 'scale(1.05)' : 'scale(1)',
        pointerEvents: stage === 'exiting' ? 'none' : 'auto'
      }}
      className="scanline-bar"
    >
      <div className="scanline-overlay" />

      <div 
        className="glass-panel" 
        style={{
          width: '90%',
          maxWidth: '800px',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          boxShadow: '0 0 40px rgba(5, 8, 22, 0.8)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Terminal Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(0, 240, 255, 0.2)',
          paddingBottom: '15px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Terminal size={18} style={{ color: '#00f0ff' }} />
            <span style={{ 
              fontFamily: "'Orbitron', sans-serif", 
              fontWeight: 700, 
              color: '#f3f4f6',
              letterSpacing: '1px',
              fontSize: '0.9rem' 
            }}>
              EXPO-BOOT // STAGE_DECOMPILING
            </span>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
          </div>
        </div>

        {/* Terminal Logs Output */}
        <div 
          className="font-mono-code"
          style={{
            height: '240px',
            overflowY: 'auto',
            textAlign: 'left',
            fontSize: '0.85rem',
            color: '#9ca3af',
            marginBottom: '30px',
            lineHeight: '1.8',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            padding: '20px',
            borderRadius: '6px',
            border: '1px solid rgba(139, 92, 246, 0.15)',
            boxShadow: 'inset 0 0 15px rgba(0, 0, 0, 0.5)'
          }}
        >
          {logs.map((log, idx) => {
            const isSystem = log.startsWith('SYSTEM:');
            const isStatus = log.startsWith('STATUS:');
            const isError = log.includes('ERROR');
            let color = '#d1d5db';
            if (isSystem) color = '#8b5cf6';
            else if (isStatus) color = '#00ff88';
            else if (isError) color = '#ef4444';
            
            return (
              <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                <span style={{ color: isStatus ? '#00ff88' : '#00f0ff' }}>
                  {isStatus ? '[OK]' : '>>'}
                </span>
                <span style={{ color }}>{log}</span>
              </div>
            );
          })}
          
          {stage === 'booting' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00f0ff', marginTop: '6px' }}>
              <span className="animate-flicker">_</span>
              <span>Running processes...</span>
            </div>
          )}
        </div>

        {/* Loading details */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.85rem', color: '#9ca3af' }}>
          <span style={{ fontFamily: "'Orbitron', sans-serif" }}>INITIALIZING SCENARIOS</span>
          <span>{Math.round(progress)}%</span>
        </div>

        {/* Progress Bar Container */}
        <div style={{
          width: '100%',
          height: '6px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '3px',
          overflow: 'hidden',
          marginBottom: '40px',
          position: 'relative'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #8b5cf6, #00f0ff)',
            boxShadow: '0 0 10px #00f0ff',
            borderRadius: '3px',
            transition: 'width 0.1s ease-out'
          }} />
        </div>

        {/* Dynamic Entry Panel */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          opacity: stage === 'ready' ? 1 : 0,
          transform: stage === 'ready' ? 'translateY(0)' : 'translateY(15px)',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: stage === 'ready' ? 'auto' : 'none'
        }}>
          <button
            onClick={() => handleEnter(false)}
            style={{
              padding: '14px 28px',
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '0.85rem',
              fontWeight: 'bold',
              color: '#f3f4f6',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '6px',
              cursor: 'pointer',
              letterSpacing: '1px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            }}
          >
            ENTER MUTED
          </button>
          
          <button
            onClick={() => handleEnter(true)}
            style={{
              padding: '14px 28px',
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '0.85rem',
              fontWeight: 'bold',
              color: '#050816',
              background: 'linear-gradient(90deg, #00f0ff, #8b5cf6)',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              letterSpacing: '1px',
              boxShadow: '0 0 15px rgba(0, 240, 255, 0.3)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 25px rgba(139, 92, 246, 0.5)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 240, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Check size={14} />
            UNMUTE & ENTER EXPO
          </button>
        </div>
      </div>
    </div>
  );
};
