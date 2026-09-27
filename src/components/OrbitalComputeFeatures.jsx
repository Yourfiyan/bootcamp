import React, { useRef, useState, useEffect } from 'react';
import { 
  Cpu, 
  Radio, 
  ShieldAlert, 
  Lock, 
  Layers, 
  Satellite, 
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { COMPUTING_CAPABILITIES } from '../data/telemetryData';

gsap.registerPlugin(ScrollTrigger);

const iconMap = {
  Cpu,
  Radio,
  ShieldAlert,
  Lock,
  Layers,
  Satellite,
};

function TiltFeatureCard({ feature }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current || window.matchMedia('(pointer: coarse)').matches) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, glareX, glareY });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  };

  const IconComponent = iconMap[feature.icon] || Cpu;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(${isHovered ? 1.01 : 1}, ${isHovered ? 1.01 : 1}, 1)`,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className="group relative rounded-2xl glass-card-interactive p-6 sm:p-8 flex flex-col justify-between overflow-hidden cursor-default"
    >
      {/* Dynamic Specular Light Glare following cursor */}
      {isHovered && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-30"
          style={{
            background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(192, 132, 252, 0.3) 0%, transparent 60%)`,
          }}
        />
      )}

      {/* Subtle card top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#a855f7]/40 to-transparent group-hover:via-[#c084fc] transition-all"></div>

      <div>
        {/* Top Bar with Icon and Tag */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#151833] border border-[#a855f7]/30 flex items-center justify-center text-[#c084fc] group-hover:border-[#c084fc] group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all">
            <IconComponent className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
          </div>

          <span className="font-mono text-[11px] font-semibold tracking-widest text-[#a855f7] px-2.5 py-1 rounded-full bg-[#a855f7]/10 border border-[#a855f7]/30">
            {feature.tag}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white mb-3 group-hover:text-[#ddb7ff] transition-colors">
          {feature.title}
        </h3>

        <p className="text-sm text-[#94a3b8] font-['Inter'] leading-relaxed mb-6">
          {feature.description}
        </p>
      </div>

      {/* Specs List */}
      <div className="pt-4 border-t border-[#a855f7]/15">
        <div className="text-[11px] font-mono text-[#64748b] uppercase tracking-wider mb-2.5">
          KEY CAPABILITIES
        </div>
        <ul className="space-y-2">
          {feature.specs.map((spec, sIdx) => (
            <li key={sIdx} className="flex items-center gap-2 text-xs font-mono text-[#e2e0f7]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></span>
              <span>{spec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function OrbitalComputeFeatures() {
  const gridRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion && gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.feature-card-entry');
      const anim = gsap.fromTo(
        cards,
        { opacity: 0, y: 40, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.09,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
          },
        }
      );

      return () => {
        anim.scrollTrigger?.kill();
        anim.kill();
      };
    }
  }, []);

  return (
    <section id="features" className="py-24 relative overflow-hidden bg-[#0A0B1A]">
      {/* Background ambient lighting */}
      <div className="glow-orb-violet w-[600px] h-[600px] top-1/4 -right-40 opacity-20"></div>
      <div className="glow-orb-cyan w-[600px] h-[600px] bottom-10 -left-40 opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151833] border border-[#a855f7]/30 text-xs font-mono text-[#c084fc] mb-4 shadow-[0_0_12px_rgba(168,85,247,0.15)]">
            <Cpu className="w-3.5 h-3.5 text-[#a855f7]" />
            <span className="uppercase tracking-wider">AEROSPACE ARCHITECTURE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-['Space_Grotesk'] font-bold text-white tracking-tight leading-tight">
            Orbital Compute &amp; Autonomous Swarm Infrastructure
          </h2>

          <p className="text-sm sm:text-base text-[#94a3b8] font-['Inter'] mt-4 leading-relaxed">
            Eliminate terrestrial round-trip latencies. Execute flight-critical algorithms directly inside the radiation-hardened LEO edge matrix.
          </p>
        </div>

        {/* Feature Cards Grid with Tactile 3D Tilt and Specular Highlight */}
        <div 
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {COMPUTING_CAPABILITIES.map((feature) => (
            <div key={feature.tag} className="feature-card-entry velocity-reactive">
              <TiltFeatureCard feature={feature} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
