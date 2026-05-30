import React, { useState, useEffect } from 'react';
import { useAudio } from '../hooks/useAudio';
import { Volume2, VolumeX, Menu, X, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import collegeLogo from '../assets/logo-removebg-preview.png';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate }) => {
  const { isMuted, toggleMute, playHover, playClick } = useAudio();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Monitor screen size for mobile collapsing
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsOpen(false); // Auto close mobile menu on resize
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLinkClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    playClick();
    onNavigate(sectionId);
    setIsOpen(false);
  };

  const toggleMenu = () => {
    playClick();
    setIsOpen(!isOpen);
  };

  // Simplified student-friendly links
  const navLinks = [
    { id: 'hero', label: 'Home' },
    { id: 'showcase', label: 'Showcase' },
    { id: 'submission-form', label: 'Add Project' }
  ];

  return (
    <>
      <nav
        className="glass-panel clickable"
        style={{
          position: 'fixed',
          top: isMobile ? '12px' : '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: isMobile ? '94%' : '90%',
          maxWidth: '1100px',
          height: isMobile ? '56px' : '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isMobile ? '0 12px' : '0 24px',
          zIndex: 1000,
          border: '1px solid rgba(0, 240, 255, 0.2)',
          boxShadow: '0 0 20px rgba(0, 240, 255, 0.05)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div 
          className="clickable"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: isMobile ? '6px' : '12px',
            cursor: 'pointer',
            zIndex: 1001,
            position: 'relative'
          }}
          onClick={(e) => handleLinkClick(e, 'hero')}
          onMouseEnter={playHover}
        >
          {/* Logo Sparks */}
          <div style={{ position: 'absolute', top: -10, left: -10, width: 'calc(100% + 20px)', height: 'calc(100% + 20px)', pointerEvents: 'none', zIndex: 0 }}>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -12 - (i * 3), 0],
                  x: [0, (i % 2 === 0 ? 1 : -1) * 6, 0],
                  opacity: [0, 0.65, 0],
                  scale: [0.4, 0.8, 0.4]
                }}
                transition={{
                  duration: 2.5 + i,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.4
                }}
                style={{
                  position: 'absolute',
                  width: '2px',
                  height: '2px',
                  borderRadius: '50%',
                  backgroundColor: i % 2 === 0 ? '#00f0ff' : '#8b5cf6',
                  boxShadow: i % 2 === 0 ? '0 0 4px #00f0ff' : '0 0 4px #8b5cf6',
                  left: `${20 + i * 20}%`,
                  top: `${10 + i * 15}%`
                }}
              />
            ))}
          </div>

          {/* College Logo */}
          <img 
            src={collegeLogo} 
            alt="College Logo" 
            style={{
              height: isMobile ? '24px' : '32px',
              width: 'auto',
              objectFit: 'contain',
              transition: 'transform 0.3s ease, filter 0.3s ease',
              filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.15))',
              display: 'block'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.filter = 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.4))';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.filter = 'drop-shadow(0 0 2px rgba(255,255,255,0.15))';
            }}
          />

          {/* Institutional Divider */}
          <div style={{
            width: '1px',
            height: isMobile ? '16px' : '22px',
            backgroundColor: 'rgba(255, 255, 255, 0.18)',
            margin: isMobile ? '0' : '0 2px 0 0',
            transition: 'all 0.3s ease'
          }} />

          {/* Futuristic Icon beside logo (Hidden on Mobile to prevent overcrowding) */}
          {!isMobile && (
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '4px' }}>
              {/* Pulsing Outer Ring */}
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.7, 0.3] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  border: '1px solid rgba(0, 240, 255, 0.4)',
                  boxShadow: '0 0 10px rgba(0, 240, 255, 0.2)'
                }}
              />
              {/* Spinning Tech Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  border: '1px dashed rgba(139, 92, 246, 0.6)',
                }}
              />
              {/* Central Icon */}
              <Cpu size={16} style={{ color: '#00f0ff', filter: 'drop-shadow(0 0 4px #00f0ff)', position: 'relative', zIndex: 2 }} />
            </div>
          )}

          {/* Logo Text System */}
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1', position: 'relative', zIndex: 2 }}>
            <span style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: isMobile ? '0.52rem' : '0.62rem',
              fontWeight: 800,
              color: '#8b5cf6',
              letterSpacing: isMobile ? '2px' : '3px',
              textTransform: 'uppercase',
              marginBottom: '2px',
              opacity: 0.85,
              filter: 'drop-shadow(0 0 2px rgba(139, 92, 246, 0.5))',
              transition: 'all 0.3s ease'
            }}>
              CODING
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
              <span className="premium-logo-text" style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: isMobile ? '0.95rem' : '1.15rem',
                fontWeight: 900,
                color: '#fff',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                background: 'linear-gradient(90deg, #fff, #00f0ff, #8b5cf6, #fff)',
                backgroundSize: '300% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'gradient-flow-logo 6s linear infinite, logo-neon-flicker 10s infinite',
                filter: 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.35))',
                transition: 'all 0.3s ease'
              }}>
                EXPO
              </span>
              <span style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: isMobile ? '0.65rem' : '0.75rem',
                fontWeight: 900,
                color: '#ec4899',
                letterSpacing: '1px',
                filter: 'drop-shadow(0 0 4px rgba(236, 72, 153, 0.5))',
                transition: 'all 0.3s ease'
              }}>
                2026
              </span>
            </div>
            
            {/* Underlying Animated Glowing Line */}
            <motion.div
              animate={{ width: ['0%', '100%', '0%'] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              style={{
                height: '1px',
                background: 'linear-gradient(90deg, transparent, #00f0ff, #8b5cf6, transparent)',
                marginTop: '3px',
                boxShadow: '0 0 6px #00f0ff'
              }}
            />
          </div>
        </div>


        {/* Desktop Nav Links */}
        {!isMobile && (
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '30px' 
            }}
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => handleLinkClick(e, link.id)}
                  onMouseEnter={playHover}
                  style={{
                    fontFamily: "'Orbitron', 'Space Grotesk', sans-serif",
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: isActive ? '#00f0ff' : '#9ca3af',
                    textDecoration: 'none',
                    letterSpacing: '1px',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    padding: '4px 0'
                  }}
                >
                  {link.label}
                  {/* Bottom active indicator */}
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '2px',
                      backgroundColor: '#00f0ff',
                      transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: '0 0 8px #00f0ff'
                    }}
                  />
                </a>
              );
            })}
          </div>
        )}

        {/* Right Side Buttons: Audio toggle & Hamburger Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px', zIndex: 1001 }}>
          {/* Status (Hidden on Mobile to preserve spacing) */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: '#00ff88', fontFamily: "'Space Grotesk', sans-serif" }}>
              <span style={{ 
                width: '6px', 
                height: '6px', 
                borderRadius: '50%', 
                backgroundColor: '#00ff88',
                boxShadow: '0 0 6px #00ff88',
                animation: 'pulse 2s infinite'
              }} />
              <span style={{ letterSpacing: '1px', fontWeight: 600 }}>ACTIVE</span>
            </div>
          )}

          {/* Audio Toggle Button */}
          <button
            onClick={() => {
              playClick();
              toggleMute();
            }}
            onMouseEnter={playHover}
            className="clickable"
            style={{
              background: isMuted ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 240, 255, 0.1)',
              border: `1px solid ${isMuted ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 240, 255, 0.4)'}`,
              borderRadius: '50%',
              width: isMobile ? '32px' : '36px',
              height: isMobile ? '32px' : '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: isMuted ? '#9ca3af' : '#00f0ff',
              boxShadow: isMuted ? 'none' : '0 0 10px rgba(0, 240, 255, 0.2)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} style={{ animation: 'pulse 1.5s infinite' }} />}
          </button>

          {/* Mobile Hamburger Button */}
          {isMobile && (
            <button
              onClick={toggleMenu}
              onMouseEnter={playHover}
              className="clickable"
              style={{
                background: isOpen ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${isOpen ? 'rgba(139, 92, 246, 0.4)' : 'rgba(255, 255, 255, 0.15)'}`,
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: isOpen ? '#8b5cf6' : '#f3f4f6',
                boxShadow: isOpen ? '0 0 10px rgba(139, 92, 246, 0.2)' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              {isOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          )}
        </div>
        
        {/* Pulse Indicator */}
        <style>{`
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
        `}</style>
      </nav>

      {/* Mobile Glassmorphic Overlay Menu */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(5, 8, 22, 0.94)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              zIndex: 999, // behind navbar button but above body
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '24px'
            }}
          >
            <div className="scanline-overlay" style={{ opacity: 0.4 }} />

            {/* Nav List links */}
            {navLinks.map((link, idx) => {
              const isActive = activeSection === link.id;
              return (
                <motion.a
                  key={link.id}
                  href={`#${link.id}`}
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  transition={{ delay: idx * 0.05, duration: 0.25 }}
                  onClick={(e) => handleLinkClick(e, link.id)}
                  onMouseEnter={playHover}
                  className="clickable"
                  style={{
                    fontFamily: "'Orbitron', 'Space Grotesk', sans-serif",
                    fontSize: '1.4rem',
                    fontWeight: 900,
                    color: isActive ? '#00f0ff' : '#9ca3af',
                    textDecoration: 'none',
                    letterSpacing: '2px',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    textShadow: isActive ? '0 0 15px rgba(0, 240, 255, 0.4)' : 'none'
                  }}
                >
                  {link.label}
                </motion.a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
