import { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from './hooks/useAudio';
import { CanvasContainer } from './components/CanvasContainer';
import { Navbar } from './components/Navbar';
import { Loader } from './components/Loader';
import { ProjectShowcase } from './components/ProjectShowcase';
import { Footer } from './components/Footer';
import { CustomCursor } from './cursor/CustomCursor';
import { ChevronDown, Sparkles } from 'lucide-react';



function App() {
  const { playHover } = useAudio();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    if (!isLoaded) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0
    });

    // Make lenis globally accessible for other components (like 3D Canvas)
    (window as any).lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      delete (window as any).lenis;
    };
  }, [isLoaded]);

  // Track scroll position to update active navbar section
  useEffect(() => {
    if (!isLoaded) return;

    const sections = ['hero', 'showcase', 'submission-form'];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 350; // offset for detection
      for (const section of sections) {
        const el = document.getElementById(section);

        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoaded]);

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Terminal bootloader screen */}
      <AnimatePresence>
        {!isLoaded && (
          <Loader onLoaded={() => setIsLoaded(true)} />
        )}
      </AnimatePresence>

      {/* Main Exhibition Layout */}
      {isLoaded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}
        >
          {/* Glassmorphic Header Menu */}
          <Navbar activeSection={activeSection} onNavigate={handleNavigate} />

          {/* 3D Canvas Background Container (Fixed backdrop) */}
          <CanvasContainer />

          {/* Custom Cursor 3D Overlay */}
          <CustomCursor />

          {/* Scrolling Web Content Layers */}
          <div style={{ position: 'relative', zIndex: 5, width: '100%' }}>

            {/* HERO SECTION */}
            <section
              id="hero"
              className="hero-section"
            >
              {/* Dark subtle overlay to enhance text readability */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to bottom, rgba(5, 8, 22, 0.4) 0%, rgba(5, 8, 22, 0.7) 100%)',
                zIndex: -1
              }} />

              <div
                className="container hero-container"
              >
                {/* Visual Accent badge */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: 'rgba(0, 240, 255, 0.05)',
                    border: '1px solid rgba(0, 240, 255, 0.3)',
                    padding: '6px 16px',
                    borderRadius: '50px',
                    fontSize: '0.75rem',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    color: '#00f0ff',
                    letterSpacing: '1.5px',
                    boxShadow: '0 0 15px rgba(0, 240, 255, 0.1)'
                  }}
                >
                  <Sparkles size={12} className="animate-flicker" />
                  <span>STUDENT PROJECT SHOWCASE</span>
                </motion.div>

                {/* Title & College Name Group to ensure tight and elegant spacing */}
                <div className="college-title-group">
                  {/* College Name */}
                  <motion.div
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
                    className="college-title-accent"
                  >
                    Dr. B. B. HEGDE FIRST GRADE COLLEGE, KUNDAPURA
                  </motion.div>

                  {/* Expo Heading title */}
                  <motion.h1
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.55, duration: 1.0, type: 'spring' }}
                    className="cinematic-title"
                    data-text="CODING EXPO"
                    style={{
                      fontSize: 'clamp(3rem, 8vw, 6.5rem)',
                      fontFamily: "'Orbitron', sans-serif",
                      fontWeight: 900,
                      lineHeight: '1.05',
                      letterSpacing: '4px',
                      margin: '0 0 10px 0',
                      background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 40%, #00f0ff 70%, #8b5cf6 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 0 40px rgba(0, 240, 255, 0.1)'
                    }}
                  >
                    CODING EXPO
                  </motion.h1>
                </div>


                {/* Subtitle */}
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  style={{
                    fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 500,
                    color: '#e5e7eb',
                    maxWidth: '680px',
                    lineHeight: '1.5',
                    letterSpacing: '0.5px'
                  }}
                >
                  Discover websites, AI projects, IoT systems, and creative developer ideas from BCA students.
                </motion.p>


                {/* Extra guide line */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  style={{
                    fontSize: '0.75rem',
                    color: '#9ca3af',
                    fontFamily: 'monospace',
                    letterSpacing: '1px',
                    marginTop: '5px'
                  }}
                >
                  * MULTI-MEMBER DYNAMIC REGISTRY SYSTEM *
                </motion.div>


                {/* Core CTA */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.0, duration: 0.8 }}
                  style={{ marginTop: '30px' }}
                >
                  <button
                    onClick={() => handleNavigate('showcase')}
                    style={{
                      padding: '16px 36px',
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      color: '#050816',
                      background: 'linear-gradient(90deg, #00f0ff, #8b5cf6)',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      letterSpacing: '2px',
                      boxShadow: '0 0 25px rgba(0, 240, 255, 0.35)',
                      transition: 'all 0.3s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      playHover();
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 0 35px rgba(139, 92, 246, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 240, 255, 0.35)';
                    }}
                  >
                    ENTER SHOWCASE
                  </button>

                </motion.div>
              </div>

              {/* Scroll down animated tip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                style={{
                  position: 'absolute',
                  bottom: '40px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#9ca3af',
                  fontSize: '0.7rem',
                  fontFamily: "'Orbitron', sans-serif",
                  letterSpacing: '2px'
                }}
              >
                <span>SCROLL DOWN</span>
                <ChevronDown size={14} style={{ animation: 'bounce 2s infinite' }} />
              </motion.div>
            </section>

            {/* EXHIBITS / PROJECTS SECTION */}
            <ProjectShowcase />

            {/* SYSTEM FOOTER */}
            <Footer onNavigate={handleNavigate} />


          </div>
        </motion.div>
      )}

      {/* Bounce Keyframe styles */}
      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-6px);
          }
          60% {
            transform: translateY(-3px);
          }
        }
      `}</style>
    </>
  );
}

export default App;
