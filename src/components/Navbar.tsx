import React, { useState, useEffect } from 'react';
import { useAudio } from '../hooks/useAudio';
import { Volume2, VolumeX, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '1100px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          zIndex: 1000,
          border: '1px solid rgba(0, 240, 255, 0.2)',
          boxShadow: '0 0 20px rgba(0, 240, 255, 0.05)'
        }}
      >
        {/* Brand Logo - Simplified to premium CodingExpo 2025 */}
        <div 
          className="clickable"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            cursor: 'pointer',
            zIndex: 1001
          }}
          onClick={(e) => handleLinkClick(e, 'hero')}
          onMouseEnter={playHover}
        >
          <span 
            className="premium-logo clickable"
            style={{ 
              fontFamily: "'Orbitron', 'Space Grotesk', sans-serif", 
              fontWeight: 900, 
              letterSpacing: '1px',
              fontSize: 'clamp(1rem, 4vw, 1.25rem)',
            }}
          >
            Coding Expo 2026
          </span>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1001 }}>
          {/* Status (simplified from HOST_SECURE to student-friendly ACTIVE badge) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: '#00ff88', fontFamily: "'Space Grotesk', sans-serif" }}>
            <span style={{ 
              width: '6px', 
              height: '6px', 
              borderRadius: '50%', 
              backgroundColor: '#00ff88',
              boxShadow: '0 0 6px #00ff88',
              animation: 'pulse 2s infinite'
            }} />
            <span style={{ letterSpacing: '1px', fontWeight: 600, display: window.innerWidth < 400 ? 'none' : 'inline' }}>ACTIVE</span>
          </div>

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
              width: '36px',
              height: '36px',
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
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} style={{ animation: 'pulse 1.5s infinite' }} />}
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
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: isOpen ? '#8b5cf6' : '#f3f4f6',
                boxShadow: isOpen ? '0 0 10px rgba(139, 92, 246, 0.2)' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
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
