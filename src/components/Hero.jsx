import React, { useEffect, useRef } from 'react';
import { 
  Rocket, 
  Terminal, 
  Orbit, 
  Activity, 
  ChevronRight, 
  Globe2, 
  Sparkles, 
  Radio, 
  Zap 
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setupMagneticElement, setupViewportTilt } from '../utils/motion';

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ onOpenLaunchModal, onScrollToTelemetry }) {
  const heroRef = useRef(null);
  const headlineLine1Ref = useRef(null);
  const headlineLine2Ref = useRef(null);
  const hudCardRef = useRef(null);
  const ctaBtnRef = useRef(null);
  const ambientOrb1Ref = useRef(null);
  const ambientOrb2Ref = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let tl = null;
    let cleanupTilt = () => {};
    let cleanupMagnetic = () => {};

    // 1. Kinetic Text Reveal: Masked vertical translateY reveal on headline lines
    if (!prefersReducedMotion) {
      tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.hero-pill',
        { opacity: 0, y: -16, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, delay: 0.1 }
      )
        .fromTo(
          [headlineLine1Ref.current, headlineLine2Ref.current],
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.12 },
          '-=0.4'
        )
        .fromTo(
          '.hero-subhead',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.5'
        )
        .fromTo(
          '.hero-cta-btn',
          { opacity: 0, y: 20, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1 },
          '-=0.4'
        )
        .fromTo(
          '.hero-trust-badge',
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.06 },
          '-=0.4'
        )
        .fromTo(
          hudCardRef.current,
          { opacity: 0, y: 40, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'power4.out' },
          '-=0.6'
        );

      // 2. Parallax background movement on scroll
      if (ambientOrb1Ref.current && ambientOrb2Ref.current) {
        gsap.to(ambientOrb1Ref.current, {
          y: 180,
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
        gsap.to(ambientOrb2Ref.current, {
          y: -120,
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 2,
          },
        });
      }

      // 3. Viewport 3D perspective tilt on the Mission Deck HUD as user scrolls past
      if (hudCardRef.current) {
        cleanupTilt = setupViewportTilt(hudCardRef.current, {
          enterRotateX: 2.5,
          exitRotateX: -2.5,
          enterScale: 0.98,
          exitScale: 0.97,
        });
      }
    }

    // 4. Setup magnetic interaction on primary button
    if (ctaBtnRef.current) {
      cleanupMagnetic = setupMagneticElement(ctaBtnRef.current, 0.28);
    }

    return () => {
      if (tl) tl.kill();
      if (cleanupTilt) cleanupTilt();
      if (cleanupMagnetic) cleanupMagnetic();
    };
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden"
    >
      {/* Background Ambient Glows with subtle parallax depth */}
      <div 
        ref={ambientOrb1Ref}
        className="glow-orb-violet w-[70rem] h-[35rem] top-10 left-1/2 -translate-x-1/2 opacity-25"
      ></div>
      <div 
        ref={ambientOrb2Ref}
        className="glow-orb-cyan w-[30rem] h-[30rem] top-[40rem] -left-48 opacity-20"
      ></div>
      <div className="glow-orb-violet w-[30rem] h-[30rem] top-[80rem] -right-40 opacity-20"></div>

      {/* Grid subtle background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Eyebrow Pill */}
        <div className="flex justify-center mb-6">
          <div className="hero-pill inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#151833]/90 border border-[#a855f7]/40 text-xs font-mono text-[#c084fc] shadow-[0_0_20px_rgba(183,109,255,0.25)] backdrop-blur-xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a855f7] opacity-80"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#a855f7]"></span>
            </span>
            <span className="font-semibold uppercase tracking-widest text-[#ddb7ff]">
              Next-Gen Orbital Operating System • v3.2 Released
            </span>
          </div>
        </div>

        {/* Headline & Subtitle with masked kinetic line reveals */}
        <div className="text-center max-w-5xl mx-auto space-y-6 mb-10">
          <h1 className="font-['Space_Grotesk'] text-4xl sm:text-6xl lg:text-[68px] font-bold text-white tracking-[-0.03em] leading-[1.1] overflow-hidden">
            <div className="overflow-hidden py-1">
              <span 
                ref={headlineLine1Ref} 
                className="inline-block bg-gradient-to-r from-[#ddb7ff] via-[#a855f7] to-[#3b82f6] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(183,109,255,0.45)]"
              >
                Autonomous Mission Control
              </span>
            </div>
            <div className="overflow-hidden py-1">
              <span 
                ref={headlineLine2Ref}
                className="inline-block text-white"
              >
                for the New Space Economy
              </span>
            </div>
          </h1>

          <p className="hero-subhead max-w-3xl mx-auto text-base sm:text-lg text-[#94a3b8] font-['Inter'] font-normal leading-relaxed">
            Deploy, monitor, and automate satellite constellations, orbital payload logistics, and deep-space telemetry pipelines from a single developer-first cloud platform.
          </p>

          {/* CTA Button Group with Magnetic physics */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              ref={ctaBtnRef}
              onClick={onOpenLaunchModal}
              className="hero-cta-btn btn-primary-action px-8 py-4 rounded-lg font-['Space_Grotesk'] text-base font-semibold tracking-wide flex items-center gap-2 group cursor-pointer shadow-[0_0_30px_rgba(183,109,255,0.55)] focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>Get Started</span>
              <Rocket className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <button
              onClick={onScrollToTelemetry}
              className="hero-cta-btn btn-secondary-glass px-6 py-4 rounded-lg font-['Inter'] text-sm font-medium flex items-center gap-2 text-white hover:text-white cursor-pointer focus-visible:ring-2 focus-visible:ring-[#a855f7]"
            >
              <Activity className="w-4 h-4 text-[#3b82f6]" />
              <span>Schedule Telemetry Demo</span>
            </button>
          </div>
        </div>

        {/* Social Proof Trust Badges from Stitch */}
        <div className="pt-8 pb-12 w-full flex flex-col items-center space-y-4 border-b border-[#a855f7]/15">
          <span className="font-mono text-xs uppercase text-[#94a3b8]/80 tracking-widest text-center">
            Trusted by 140+ aerospace contractors and satellite operators
          </span>
          
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-85 pt-2">
            <div className="hero-trust-badge flex items-center gap-2 font-['Space_Grotesk'] text-lg text-white font-semibold tracking-tighter hover:text-[#ddb7ff] transition-all duration-300 hover:scale-105">
              <Globe2 className="w-5 h-5 text-[#a855f7]" />
              <span>Orbital<span className="text-[#a855f7] font-bold">X</span></span>
            </div>
            <div className="hero-trust-badge flex items-center gap-2 font-['Space_Grotesk'] text-lg text-white tracking-tight hover:text-[#ddb7ff] transition-all duration-300 hover:scale-105">
              <Activity className="w-5 h-5 text-[#3b82f6]" />
              <span>Astro<span className="text-[#3b82f6] font-light">Dynamics</span></span>
            </div>
            <div className="hero-trust-badge flex items-center gap-2 font-['Space_Grotesk'] text-lg text-white tracking-wider hover:text-[#ddb7ff] transition-all duration-300 hover:scale-105">
              <Zap className="w-5 h-5 text-[#c084fc]" />
              <span>HELIOS<span className="text-xs uppercase font-mono text-[#c084fc] align-super ml-0.5">SAT</span></span>
            </div>
            <div className="hero-trust-badge flex items-center gap-2 font-['Space_Grotesk'] text-lg text-white hover:text-[#ddb7ff] transition-all duration-300 hover:scale-105">
              <Radio className="w-5 h-5 text-[#a855f7]" />
              <span>Nova<span className="text-[#a855f7] font-semibold">Space</span></span>
            </div>
            <div className="hero-trust-badge flex items-center gap-2 font-['Space_Grotesk'] text-lg text-white tracking-widest font-light hover:text-[#ddb7ff] transition-all duration-300 hover:scale-105">
              <Orbit className="w-5 h-5 text-[#3b82f6]" />
              <span>VECTOR</span>
            </div>
          </div>
        </div>

        {/* Interactive HUD / Telemetry Deck Preview Card with 3D Viewport Tilt */}
        <div className="w-full pt-10">
          <div 
            ref={hudCardRef}
            className="hero-hud-card velocity-reactive relative w-full rounded-2xl glass-deck-2 p-5 md:p-8 border border-[#a855f7]/30 shadow-[0_0_50px_rgba(183,109,255,0.18)] overflow-hidden transition-shadow duration-500 hover:shadow-[0_0_65px_rgba(183,109,255,0.3)]"
          >
            {/* Glass Topbar HUD */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-[#a855f7]/20">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400/80"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-400/80"></span>
                <span className="ml-3 font-mono text-xs text-white font-semibold tracking-wider">
                  MISSION DECK // LEO-CONSTELLATION-08
                </span>
              </div>

              <div className="flex items-center gap-4 font-mono text-xs">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#151833] text-[#c084fc] border border-[#a855f7]/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  LIVE UPLINK STABLE
                </span>
                <span className="text-[#94a3b8] hidden sm:inline">LEO ORBIT 540 KM</span>
              </div>
            </div>

            {/* HUD 3-Column Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
              
              {/* Left Panel: Real-time Telemetry Stream */}
              <div className="lg:col-span-4 flex flex-col space-y-4">
                <div className="p-4 rounded-xl bg-[#0F1123]/80 border border-[#a855f7]/20 backdrop-blur-md">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-mono text-[11px] text-[#a855f7] tracking-widest font-bold">PROPULSION TELEMETRY</span>
                    <span className="font-mono text-xs text-[#3b82f6] font-bold">STAGE 2 BURNING</span>
                  </div>

                  <div className="space-y-2 font-mono text-xs">
                    <div className="flex justify-between text-[#94a3b8]">
                      <span>Thrust Vector Pitch:</span>
                      <span className="text-white font-semibold">+0.142°</span>
                    </div>
                    <div className="flex justify-between text-[#94a3b8]">
                      <span>Chamber Pressure:</span>
                      <span className="text-emerald-400 font-semibold">108.4 bar [Nominal]</span>
                    </div>
                    <div className="flex justify-between text-[#94a3b8]">
                      <span>Specific Impulse (Isp):</span>
                      <span className="text-white font-semibold">324.6 s</span>
                    </div>
                  </div>

                  <div className="w-full bg-[#151833] rounded-full h-1.5 mt-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#a855f7] to-[#3b82f6] h-1.5 rounded-full w-[78%] animate-pulse"></div>
                  </div>
                </div>

                {/* Realtime Terminal Log */}
                <div className="p-4 rounded-xl bg-[#0A0B1A] border border-[#a855f7]/20 font-mono text-xs text-[#94a3b8] space-y-2 h-44 overflow-hidden relative">
                  <div className="text-[#3b82f6]">[18:41:59] &gt; Ephemeris synced via Kalman-Bucy filter</div>
                  <div className="text-white">[18:42:01] &gt; Autonomous thruster micro-pulse: +0.02 m/s delta-v</div>
                  <div className="text-[#c084fc]">[18:42:04] &gt; RF Handshake accepted: Svalbard Station Ground Array</div>
                  <div className="text-[#3b82f6]">[18:42:06] &gt; Doppler drift corrected: -4.12 kHz</div>
                  <div className="text-white">[18:42:08] &gt; Solar panel alpha tracking: 99.8% photon exposure</div>
                  <div className="text-emerald-400 animate-pulse">[18:42:09] &gt; Optical Downlink established @ 48.2 Gbps</div>
                  <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#0A0B1A] to-transparent pointer-events-none"></div>
                </div>
              </div>

              {/* Center Panel: Orbital Trajectory Visualization */}
              <div className="lg:col-span-5 relative flex flex-col justify-between p-6 rounded-xl bg-[#0F1123]/90 border border-[#a855f7]/20 backdrop-blur-md overflow-hidden min-h-[260px]">
                <div className="absolute inset-0 opacity-25 pointer-events-none flex items-center justify-center">
                  <svg className="w-full h-full animate-orbit-slow" fill="none" stroke="currentColor" viewBox="0 0 500 300">
                    <ellipse cx="250" cy="150" rx="200" ry="80" stroke="#b76dff" strokeDasharray="4 4" strokeWidth="1.5"></ellipse>
                    <ellipse cx="250" cy="150" rx="150" ry="120" stroke="#adc6ff" strokeWidth="1.5"></ellipse>
                    <circle cx="250" cy="150" fill="#191a2a" r="48" stroke="#b76dff" strokeWidth="2"></circle>
                    <circle cx="250" cy="150" fill="#b76dff" r="14"></circle>
                    <circle className="animate-ping" cx="370" cy="190" fill="#adc6ff" r="6"></circle>
                    <circle cx="370" cy="190" fill="#adc6ff" r="5"></circle>
                  </svg>
                </div>

                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <span className="font-mono text-[11px] text-[#a855f7] tracking-widest font-bold uppercase">TRAJECTORY SOLVER 3D</span>
                    <div className="font-['Space_Grotesk'] text-xl text-white font-bold mt-1">Orbital Path: LEO Sync</div>
                  </div>
                  <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/30">
                    APOGEE: 540 KM
                  </span>
                </div>

                <div className="relative z-10 flex flex-wrap gap-3 pt-8">
                  <div className="px-3 py-1.5 rounded-lg bg-[#151833] border border-[#a855f7]/20">
                    <div className="font-mono text-[10px] text-[#94a3b8]">INCLINATION</div>
                    <div className="font-mono text-xs text-white font-bold">51.6419°</div>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-[#151833] border border-[#a855f7]/20">
                    <div className="font-mono text-[10px] text-[#94a3b8]">ECCENTRICITY</div>
                    <div className="font-mono text-xs text-white font-bold">0.00014</div>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-[#151833] border border-[#a855f7]/20">
                    <div className="font-mono text-[10px] text-[#94a3b8]">ORBITAL PERIOD</div>
                    <div className="font-mono text-xs text-white font-bold">92.4 MIN</div>
                  </div>
                </div>
              </div>

              {/* Right Panel: Telemetry Health Gauges */}
              <div className="lg:col-span-3 flex flex-col justify-between space-y-3">
                <div className="p-4 rounded-xl bg-[#0F1123]/80 border border-[#a855f7]/20 backdrop-blur-md">
                  <span className="font-mono text-[10px] text-[#94a3b8] uppercase tracking-wider">SLA UPTIME RELIABILITY</span>
                  <div className="font-['Space_Grotesk'] text-2xl text-[#a855f7] font-bold mt-1">99.999%</div>
                  <p className="text-xs text-[#94a3b8] font-['Inter'] mt-1">Deterministic failover via distributed LEO cross-links.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#0F1123]/80 border border-[#a855f7]/20 backdrop-blur-md">
                  <span className="font-mono text-[10px] text-[#94a3b8] uppercase tracking-wider">GROUND-LINK LATENCY</span>
                  <div className="font-['Space_Grotesk'] text-2xl text-[#3b82f6] font-bold mt-1">14 ms</div>
                  <p className="text-xs text-[#94a3b8] font-['Inter'] mt-1">Phase-steered optical array tracking.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#0F1123]/80 border border-[#a855f7]/20 backdrop-blur-md">
                  <span className="font-mono text-[10px] text-[#94a3b8] uppercase tracking-wider">ACTIVE SATELLITES</span>
                  <div className="font-['Space_Grotesk'] text-2xl text-white font-bold mt-1">420 SVs</div>
                  <p className="text-xs text-[#94a3b8] font-['Inter'] mt-1">Automated autonomous constellation mesh.</p>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
