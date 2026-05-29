import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import { CursorScene } from './CursorScene';

// Helper to determine if an interactive element should have magnetic snapping
const isMagneticElement = (el: HTMLElement | null): boolean => {
  if (!el) return false;
  
  // Explicit override classes/attributes
  if (el.classList.contains('magnetic') || el.hasAttribute('data-magnetic')) return true;
  if (el.classList.contains('no-magnetic') || el.hasAttribute('data-no-magnetic')) return false;
  
  // Get element bounding box dimensions
  const rect = el.getBoundingClientRect();
  
  // Only apply snapping to small targets (width and height both < 160px)
  // Large cards/sections must NOT snap to avoid capturing the cursor and breaking sub-clicks
  const isSmall = rect.width > 0 && rect.width < 160 && rect.height > 0 && rect.height < 160;
  
  // Elements that are typically buttons or links
  const isSmallTag = el.tagName === 'A' || el.tagName === 'BUTTON';
  const isSmallClass = typeof el.className === 'string' && (
    el.className.includes('btn') ||
    el.className.includes('nav-link') ||
    el.className.includes('clickable') ||
    el.className.includes('toggle') ||
    el.className.includes('arrow')
  );
  
  return isSmall && (isSmallTag || isSmallClass);
};

export const CustomCursor: React.FC = () => {
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [initialized, setInitialized] = useState(false);
  
  const mouseRef = useRef({
    x: 0,
    y: 0,
    smoothX: 0,
    smoothY: 0,
    tailX: 0,
    tailY: 0,
    isHovering: false,
    isMagnetic: false,
    hoveredEl: null as HTMLElement | null
  });

  // Check touch capability on mount to support pointer devices only
  useEffect(() => {
    const isTouchDevice = () => {
      return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0
      );
    };
    
    const touch = isTouchDevice();
    setIsTouch(touch);
    
    // Toggle active custom cursor class on body only for desktop
    if (!touch) {
      document.body.classList.add('custom-cursor-active');
    }
    
    // Desktop Handlers
    const handleMouseMove = (e: MouseEvent) => {
      if (!initialized) {
        // Fast init to avoid cursor flying in from (0,0)
        mouseRef.current.smoothX = e.clientX;
        mouseRef.current.smoothY = e.clientY;
        mouseRef.current.tailX = e.clientX;
        mouseRef.current.tailY = e.clientY;
        setInitialized(true);
      }
      
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      setIsVisible(true);
    };

    // Highly optimized hover detection using event delegation (bubbles up)
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Find closest interactive parent without calling slow getComputedStyle
      const interactiveEl = target.closest('a, button, input, select, textarea, [role="button"], [role="link"], .clickable, [data-interactive]');
      
      if (interactiveEl) {
        const el = interactiveEl as HTMLElement;
        mouseRef.current.isHovering = true;
        mouseRef.current.hoveredEl = el;
        mouseRef.current.isMagnetic = isMagneticElement(el);
        setIsHoveringInteractive(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const relatedTarget = e.relatedTarget as HTMLElement;
      
      // Clear hover states when fully leaving the bounds of the active interactive element
      if (mouseRef.current.hoveredEl && (!relatedTarget || !mouseRef.current.hoveredEl.contains(relatedTarget))) {
        mouseRef.current.isHovering = false;
        mouseRef.current.isMagnetic = false;
        mouseRef.current.hoveredEl = null;
        setIsHoveringInteractive(false);
      }
    };

    // Mobile / Tablet Touch Handlers (glowing touch trail)
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touchPoint = e.touches[0];
        
        // Instant setup position to avoid trails from old coords
        mouseRef.current.x = touchPoint.clientX;
        mouseRef.current.y = touchPoint.clientY;
        mouseRef.current.smoothX = touchPoint.clientX;
        mouseRef.current.smoothY = touchPoint.clientY;
        mouseRef.current.tailX = touchPoint.clientX;
        mouseRef.current.tailY = touchPoint.clientY;
        
        // Spawn active particles on drag/touch
        mouseRef.current.isHovering = true;
        setIsVisible(true);
        setInitialized(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touchPoint = e.touches[0];
        mouseRef.current.x = touchPoint.clientX;
        mouseRef.current.y = touchPoint.clientY;
        setIsVisible(true);
      }
    };

    const handleTouchEnd = () => {
      setIsVisible(false);
      mouseRef.current.isHovering = false;
    };

    if (touch) {
      window.addEventListener('touchstart', handleTouchStart, { passive: true });
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
      window.addEventListener('touchend', handleTouchEnd, { passive: true });
      window.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    } else {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('mouseleave', handleMouseLeave);
      document.addEventListener('mouseleave', handleMouseLeave);
      document.addEventListener('mouseenter', handleMouseEnter);
      window.addEventListener('mouseover', handleMouseOver);
      window.addEventListener('mouseout', handleMouseOut);
    }

    return () => {
      document.body.classList.remove('custom-cursor-active');
      
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
      
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, [initialized]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none', // Ensure container passes events through
            zIndex: 9999,
            mixBlendMode: 'screen', // Screen blend mode blends glowing colors additively
            backfaceVisibility: 'hidden',
            transform: 'translate3d(0,0,0)', // GPU layout acceleration
          }}
        >
          <Canvas
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance'
            }}
            style={{ width: '100%', height: '100%', pointerEvents: 'none' }} // Explicitly prevent canvas click interception
          >
            <CursorScene mouseRef={mouseRef} isHovering={isHoveringInteractive} isTouch={isTouch} />
          </Canvas>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
