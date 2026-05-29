import React from 'react';
import { motion } from 'framer-motion';

interface FooterProps {
  onNavigate?: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer
      style={{
        position: 'relative',
        zIndex: 10,
        backgroundColor: 'rgba(5, 8, 22, 0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(0, 240, 255, 0.08)',
        padding: '40px 0',
        marginTop: 'auto',
        overflow: 'hidden'
      }}
    >
      {/* Animated Gradient Line at the Top of Footer */}
      <div
        style={{
          height: '2px',
          width: '100%',
          background: 'linear-gradient(90deg, transparent, #00f0ff, #8b5cf6, #ec4899, transparent)',
          position: 'absolute',
          top: 0,
          left: 0,
          boxShadow: '0 0 10px rgba(0, 240, 255, 0.2)'
        }}
      />

      {/* Background Glowing Ambient Light */}
      <div
        style={{
          position: 'absolute',
          bottom: '-30px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '300px',
          height: '100px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          filter: 'blur(30px)',
          pointerEvents: 'none',
          zIndex: -1
        }}
      />

      {/* Tiny Floating Particles */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -35, 0],
              x: [0, Math.sin(i) * 15, 0],
              opacity: [0.15, 0.5, 0.15]
            }}
            transition={{
              duration: 5 + i * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              borderRadius: '50%',
              backgroundColor: i % 2 === 0 ? '#00f0ff' : '#8b5cf6',
              boxShadow: i % 2 === 0 ? '0 0 8px #00f0ff' : '0 0 8px #8b5cf6',
              left: `${15 + (i * 15)}%`,
              top: `${50 + (i * 5)}%`
            }}
          />
        ))}
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 5 }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: '12px'
        }}>

          {/* Main Title */}
          <h3
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '0.95rem',
              color: '#fff',
              fontWeight: 800,
              letterSpacing: '2px',
              margin: 0,
              background: 'linear-gradient(90deg, #fff 0%, #00f0ff 50%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 4px rgba(0, 240, 255, 0.2))'
            }}
          >
            Coding Expo 2026 — Student Innovation Showcase
          </h3>

          {/* Credits Line */}
          <p
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: '#9ca3af',
              fontSize: '0.75rem',
              margin: 0,
              lineHeight: '1.6',
              letterSpacing: '0.5px',
              opacity: 0.85,
              transition: 'opacity 0.3s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '0.85'}
          >
            © 2026 Coding Expo | Developed by Incubation Center | All Rights Reserved.
          </p>

        </div>
      </div>
    </footer>
  );
};
