import React, { useEffect, useRef } from 'react';
import { setupViewportTilt } from '../utils/motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function StatsBanner() {
  const containerRef = useRef(null);
  const cardDeckRef = useRef(null);
  const num1Ref = useRef(null);
  const num2Ref = useRef(null);
  const num3Ref = useRef(null);
  const num4Ref = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cleanupTilt = () => {};

    // 1. Apply physical Viewport Tilt (Step 5 of prompt)
    if (!prefersReducedMotion && cardDeckRef.current) {
      cleanupTilt = setupViewportTilt(cardDeckRef.current, {
        enterRotateX: 3.5,
        exitRotateX: -2.5,
        enterScale: 0.97,
        exitScale: 0.98,
      });

      // 2. Staggered card entrance when in view
      const anim = gsap.fromTo(
        '.stats-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardDeckRef.current,
            start: 'top 85%',
          },
        }
      );

      // 3. Counter numerical rollups (Step 8 Typography)
      const counterTrigger = ScrollTrigger.create({
        trigger: cardDeckRef.current,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          const c1 = { val: 0 };
          gsap.to(c1, {
            val: 1.4,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: () => {
              if (num1Ref.current) num1Ref.current.innerText = `${c1.val.toFixed(1)}M+`;
            },
          });

          const c2 = { val: 80 };
          gsap.to(c2, {
            val: 18,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: () => {
              if (num2Ref.current) num2Ref.current.innerText = `< ${Math.round(c2.val)}ms`;
            },
          });

          const c3 = { val: 98.0 };
          gsap.to(c3, {
            val: 99.999,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: () => {
              if (num3Ref.current) num3Ref.current.innerText = `${c3.val.toFixed(3)}%`;
            },
          });

          const c4 = { val: 0 };
          gsap.to(c4, {
            val: 100,
            duration: 1.4,
            ease: 'power2.out',
            onUpdate: () => {
              if (num4Ref.current) num4Ref.current.innerText = `${Math.round(c4.val)}% ITAR`;
            },
          });
        },
      });

      return () => {
        cleanupTilt();
        anim.scrollTrigger?.kill();
        anim.kill();
        counterTrigger.kill();
      };
    }
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div 
        ref={cardDeckRef}
        className="velocity-reactive p-6 sm:p-8 rounded-2xl glass-deck-1 border border-[#a855f7]/25 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] transition-shadow duration-500 hover:shadow-[0_0_55px_rgba(168,85,247,0.25)]"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          
          <div className="stats-card space-y-2 text-left group">
            <div className="font-mono text-xs uppercase text-[#a855f7] tracking-widest font-bold group-hover:text-[#c084fc] transition-colors">
              TELEMETRY STREAM
            </div>
            <div 
              ref={num1Ref}
              className="font-['Space_Grotesk'] text-3xl sm:text-4xl text-white font-bold tracking-tight"
            >
              1.4M+
            </div>
            <div className="text-xs text-[#94a3b8] font-['Inter'] leading-relaxed">
              Daily processed packets with 0% data drop
            </div>
          </div>

          <div className="stats-card space-y-2 text-left group">
            <div className="font-mono text-xs uppercase text-[#3b82f6] tracking-widest font-bold group-hover:text-[#60a5fa] transition-colors">
              LATENCY BUDGET
            </div>
            <div 
              ref={num2Ref}
              className="font-['Space_Grotesk'] text-3xl sm:text-4xl text-white font-bold tracking-tight"
            >
              &lt; 18ms
            </div>
            <div className="text-xs text-[#94a3b8] font-['Inter'] leading-relaxed">
              Mean uplink latency across all active ground arrays
            </div>
          </div>

          <div className="stats-card space-y-2 text-left group">
            <div className="font-mono text-xs uppercase text-[#c084fc] tracking-widest font-bold group-hover:text-[#ddb7ff] transition-colors">
              ORBITAL SLA
            </div>
            <div 
              ref={num3Ref}
              className="font-['Space_Grotesk'] text-3xl sm:text-4xl text-white font-bold tracking-tight"
            >
              99.999%
            </div>
            <div className="text-xs text-[#94a3b8] font-['Inter'] leading-relaxed">
              High-availability deterministic node quorum
            </div>
          </div>

          <div className="stats-card space-y-2 text-left group">
            <div className="font-mono text-xs uppercase text-[#a855f7] tracking-widest font-bold group-hover:text-[#c084fc] transition-colors">
              REGULATORY ASSURANCE
            </div>
            <div 
              ref={num4Ref}
              className="font-['Space_Grotesk'] text-3xl sm:text-4xl text-white font-bold tracking-tight"
            >
              100% ITAR
            </div>
            <div className="text-xs text-[#94a3b8] font-['Inter'] leading-relaxed">
              SOC2 Type II &amp; AS9100D aerospace qualified
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
