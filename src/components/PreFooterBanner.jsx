import React, { useEffect, useRef } from 'react';
import { ArrowRight, Terminal, Rocket, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setupMagneticElement, setupViewportTilt } from '../utils/motion';

gsap.registerPlugin(ScrollTrigger);

export default function PreFooterBanner({ onOpenLaunchModal }) {
  const cardRef = useRef(null);
  const btnRef = useRef(null);
  const auroraRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cleanupTilt = () => {};
    let cleanupMagnetic = () => {};

    if (!prefersReducedMotion && cardRef.current) {
      cleanupTilt = setupViewportTilt(cardRef.current, {
        enterRotateX: 3,
        exitRotateX: -2,
        enterScale: 0.98,
        exitScale: 0.98,
      });

      if (auroraRef.current) {
        gsap.to(auroraRef.current, {
          y: -50,
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }
    }

    if (btnRef.current) {
      cleanupMagnetic = setupMagneticElement(btnRef.current, 0.3);
    }

    return () => {
      cleanupTilt();
      cleanupMagnetic();
    };
  }, []);

  return (
    <section className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div 
        ref={cardRef}
        className="velocity-reactive relative overflow-hidden rounded-3xl glass-deck-2 border border-[#a855f7]/30 p-8 sm:p-14 text-center shadow-[0_0_60px_rgba(183,109,255,0.2)]"
      >
        
        {/* Aurora Gradient Accent Background with Parallax Depth */}
        <div 
          ref={auroraRef}
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[45rem] h-[18rem] bg-gradient-to-r from-[#a855f7]/30 via-[#c084fc]/20 to-[#3b82f6]/30 blur-[90px] rounded-full pointer-events-none"
        ></div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#151833]/90 border border-[#a855f7]/40 text-xs font-mono text-[#c084fc] shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-[#a855f7]" />
            <span className="uppercase tracking-widest font-semibold">FLIGHT-READY DEPLOYMENT</span>
          </div>

          <h2 className="font-['Space_Grotesk'] text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            Ready to launch your orbital infrastructure in minutes?
          </h2>

          <p className="text-base sm:text-lg text-[#94a3b8] font-['Inter'] leading-relaxed max-w-2xl mx-auto">
            Connect your flight bus, simulate trajectory state vectors, and integrate real-time downlinks with zero aerospace friction.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              ref={btnRef}
              onClick={onOpenLaunchModal}
              className="btn-primary-action px-8 py-3.5 rounded-lg font-['Space_Grotesk'] text-sm font-semibold tracking-wide flex items-center gap-2 cursor-pointer group shadow-[0_0_25px_rgba(183,109,255,0.6)]"
            >
              <span>Get Started</span>
              <Rocket className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <a
              href="#telemetry"
              className="btn-secondary-glass px-6 py-3.5 rounded-lg font-['Inter'] text-sm font-medium text-white hover:text-white flex items-center gap-2"
            >
              <Terminal className="w-4 h-4 text-[#a855f7]" />
              <span>Explore Telemetry Deck</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
