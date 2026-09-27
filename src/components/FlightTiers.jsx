import React, { useState, useEffect, useRef } from 'react';
import { Check, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setupViewportTilt } from '../utils/motion';

gsap.registerPlugin(ScrollTrigger);

export default function FlightTiers({ onOpenLaunchModal }) {
  const [isAnnual, setIsAnnual] = useState(false);
  const tiersGridRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion && tiersGridRef.current) {
      const cards = tiersGridRef.current.querySelectorAll('.tier-card-item');
      const anim = gsap.fromTo(
        cards,
        { opacity: 0, y: 35, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: tiersGridRef.current,
            start: 'top 85%',
          },
        }
      );

      const cleanupTilt = setupViewportTilt(tiersGridRef.current, {
        enterRotateX: 2.5,
        exitRotateX: -2,
        enterScale: 0.98,
        exitScale: 0.98,
      });

      return () => {
        anim.scrollTrigger?.kill();
        anim.kill();
        if (cleanupTilt) cleanupTilt();
      };
    }
  }, []);

  const tiers = [
    {
      name: "Explorer / Suborbital",
      tag: "RESEARCH & PROTOTYPES",
      description: "For university cubesats, prototype payloads, and early orbital test-flights.",
      monthlyPrice: "$1,490",
      annualPrice: "$1,190",
      popular: false,
      features: [
        "Up to 3 satellites active",
        "5 ground station passes / day",
        "100 GB hot telemetry log storage",
        "Standard REST & GraphQL APIs",
        "Community Discord & technical support"
      ],
      cta: "Start Free Sandbox",
      action: onOpenLaunchModal
    },
    {
      name: "Orbital Constellation",
      tag: "COMMERCIAL FLEET (RECOMMENDED)",
      description: "For commercial LEO constellations and orbital payload operators requiring 24/7 autonomy.",
      monthlyPrice: "$5,850",
      annualPrice: "$4,680",
      popular: true,
      features: [
        "Up to 25 satellites simultaneous",
        "Unlimited ground network links",
        "Real-time autonomous collision avoidance",
        "5 TB hot telemetry log storage",
        "24/7 dedicated flight engineer hotline",
        "99.99% guaranteed SLA"
      ],
      cta: "Get Started Now",
      action: onOpenLaunchModal
    },
    {
      name: "Deep Space Enterprise",
      tag: "DEFENSE & SOVEREIGN SPACE",
      description: "For defense, national space agencies, and mega-constellations (50+ spacecraft).",
      monthlyPrice: "$18,500+",
      annualPrice: "$14,800+",
      popular: false,
      features: [
        "Unlimited spacecraft & payload nodes",
        "Air-gapped on-premise or sovereign cloud",
        "Hardware-in-the-loop (HIL) simulators",
        "Custom FPGA ground station decoders",
        "Dedicated embedded mission ops crew",
        "ITAR & FedRAMP High certification"
      ],
      cta: "Contact Flight Director",
      action: onOpenLaunchModal
    }
  ];

  return (
    <section id="pricing" className="py-24 relative overflow-hidden bg-[#0A0B1A]">
      <div className="glow-orb-violet w-[500px] h-[500px] top-1/3 left-1/2 -translate-x-1/2 opacity-15"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header matching Stitch */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151833] border border-[#a855f7]/30 text-xs font-mono text-[#c084fc] mb-4 shadow-[0_0_12px_rgba(168,85,247,0.15)]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#a855f7]" />
            <span className="uppercase tracking-widest font-semibold">TRANSPARENT SCALE-UP PRICING</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-['Space_Grotesk'] font-bold text-white tracking-tight">
            Predictable Economics for Constellations of Any Size
          </h2>

          <p className="text-[#94a3b8] font-['Inter'] mt-3 text-sm sm:text-base">
            From experimental university CubeSats to interplanetary multi-spacecraft operations.
          </p>

          {/* Billing Period Toggle */}
          <div className="mt-8 inline-flex items-center p-1 rounded-xl bg-[#0F1123] border border-[#a855f7]/30">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                !isAnnual 
                  ? 'bg-[#a855f7] text-white font-semibold shadow-md' 
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              Monthly Invoicing
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-5 py-2 rounded-lg text-xs font-mono flex items-center gap-2 transition-all cursor-pointer ${
                isAnnual 
                  ? 'bg-[#a855f7] text-white font-semibold shadow-md' 
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              <span>Annual Commitment</span>
              <span className="px-1.5 py-0.5 rounded bg-white/20 text-[10px] text-white font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid with Staggered Entrance & Viewport Tilt */}
        <div 
          ref={tiersGridRef}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch"
        >
          {tiers.map((tier) => {
            const isPopular = tier.popular;
            const price = isAnnual ? tier.annualPrice : tier.monthlyPrice;

            return (
              <div
                key={tier.name}
                className={`tier-card-item velocity-reactive rounded-2xl p-8 flex flex-col justify-between transition-all relative ${
                  isPopular
                    ? 'glass-deck-2 border-2 border-[#c084fc] shadow-[0_0_40px_rgba(183,109,255,0.35)] -translate-y-2'
                    : 'glass-card-interactive border border-[#a855f7]/25'
                }`}
              >
                {/* Popular Recommended Badge from Stitch */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#a855f7] to-[#3b82f6] text-white font-mono text-[11px] font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(183,109,255,0.6)] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>RECOMMENDED</span>
                  </div>
                )}

                <div>
                  <div className="font-mono text-xs text-[#a855f7] font-semibold tracking-wider uppercase mb-2">
                    {tier.tag}
                  </div>

                  <h3 className={`text-2xl font-bold font-['Space_Grotesk'] mb-2 ${isPopular ? 'text-[#ddb7ff]' : 'text-white'}`}>
                    {tier.name}
                  </h3>

                  <p className="text-xs text-[#94a3b8] font-['Inter'] leading-relaxed mb-6">
                    {tier.description}
                  </p>

                  {/* Price */}
                  <div className="mb-6 pb-6 border-b border-[#a855f7]/20">
                    <div className="flex items-baseline gap-2">
                      <span className="font-['Space_Grotesk'] text-4xl font-bold text-white">
                        {price}
                      </span>
                      <span className="font-mono text-xs text-[#94a3b8]">
                        / mo {isAnnual ? '(billed annually)' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Features list */}
                  <div className="space-y-3 mb-8">
                    <div className="text-[11px] font-mono text-[#64748b] uppercase tracking-wider">
                      INCLUDED CAPABILITIES
                    </div>
                    {tier.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-[#e2e0f7] font-['Inter']">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isPopular ? 'text-[#c084fc]' : 'text-[#3b82f6]'}`} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={tier.action}
                  className={`w-full py-3 rounded-lg text-xs font-semibold font-['Space_Grotesk'] flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    isPopular
                      ? 'btn-primary-action'
                      : 'btn-secondary-glass hover:bg-white/10'
                  }`}
                >
                  <span>{tier.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
