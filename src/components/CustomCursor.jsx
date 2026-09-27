import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const isInteractiveRef = useRef(false);

  useEffect(() => {
    // Only run on non-touch desktop environments
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let rafId;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsVisible(true);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Check if hovering over interactive element
      const target = e.target;
      const interactiveEl = target.closest('a, button, input, select, textarea, [role="button"], .cursor-pointer');
      const nextInteractive = !!interactiveEl;
      if (nextInteractive !== isInteractiveRef.current) {
        isInteractiveRef.current = nextInteractive;
        setIsInteractive(nextInteractive);
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    // Smooth spring follow for outer ring using rAF
    const animateRing = () => {
      const lerp = isInteractiveRef.current ? 0.24 : 0.15;
      ringX += (mouseX - ringX) * lerp;
      ringY += (mouseY - ringY) * lerp;

      if (ringRef.current) {
        const scale = isInteractiveRef.current ? 1.45 : 1;
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(${scale})`;
      }

      rafId = requestAnimationFrame(animateRing);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    rafId = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div 
      aria-hidden="true" 
      className="hidden md:block pointer-events-none fixed inset-0 z-50 overflow-hidden"
    >
      {/* Precision Inner Dot */}
      <div
        ref={dotRef}
        style={{ opacity: isVisible ? 1 : 0 }}
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full bg-white transition-opacity duration-200 pointer-events-none mix-blend-difference"
      />

      {/* Trailing Fluid Ring */}
      <div
        ref={ringRef}
        style={{ opacity: isVisible ? 1 : 0 }}
        className={`fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 rounded-full border pointer-events-none transition-all duration-300 ${
          isInteractive
            ? 'border-[#c084fc] bg-[#a855f7]/15 shadow-[0_0_15px_rgba(168,85,247,0.35)]'
            : 'border-white/40'
        }`}
      />
    </div>
  );
}
