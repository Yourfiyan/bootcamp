import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  Terminal, 
  ShieldCheck, 
  Radio, 
  Satellite, 
  Globe2, 
  Check, 
  ArrowRight 
} from 'lucide-react';

export default function Footer({ onOpenLaunchModal }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [zuluTime, setZuluTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      setZuluTime(`${hours}:${minutes}:${seconds} ZULU`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="relative z-10 w-full bg-[#070814]/95 backdrop-blur-xl border-t border-[#a855f7]/20 text-[#94a3b8] font-['Inter']">
      
      {/* Top Telemetry Strip matching Stitch */}
      <div className="w-full bg-[#0F1123]/80 border-b border-white/5 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-[#c084fc] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#c084fc] animate-pulse"></span>
              LEO CONSTELLATION TELEMETRY
            </span>
            <span className="text-white/20 hidden sm:inline">|</span>
            <span className="text-[#94a3b8] hidden sm:inline">SV-ORBIT: 520KM INCL: 51.64°</span>
            <span className="text-white/20 hidden md:inline">|</span>
            <span className="text-emerald-400 hidden md:inline">UPLINK: 42.8 GBPS [NOMINAL]</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#94a3b8]">ACTIVE APOGEE BURNS:</span>
            <span className="text-[#a855f7] font-bold">04 STABLE</span>
            <span className="text-white/20">|</span>
            <span className="text-white">{zuluTime}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 sm:gap-12 mb-12">
          
          {/* Brand & Description */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#151833] border border-[#a855f7]/40 flex items-center justify-center text-[#c084fc] shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <Rocket className="w-5 h-5 text-[#a855f7]" />
              </div>
              <span className="font-['Space_Grotesk'] font-bold text-xl text-white tracking-wider">
                Launch<span className="text-[#a855f7]">Pad</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed max-w-sm">
              Deterministic aerospace orchestration, autonomous orbital bus computing, and telemetry pipeline infrastructure for high-consequence space-tech operations.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <a 
                href="#telemetry"
                className="w-8 h-8 rounded-lg bg-[#151833] border border-[#a855f7]/30 flex items-center justify-center text-[#94a3b8] hover:text-[#c084fc] hover:border-[#c084fc] transition-colors"
                title="Mission Terminal"
              >
                <Terminal className="w-4 h-4" />
              </a>
              <a 
                href="#ground-stations"
                className="w-8 h-8 rounded-lg bg-[#151833] border border-[#a855f7]/30 flex items-center justify-center text-[#94a3b8] hover:text-[#c084fc] hover:border-[#c084fc] transition-colors"
                title="Ground Apertures"
              >
                <Satellite className="w-4 h-4" />
              </a>
              <a 
                href="#simulator"
                className="w-8 h-8 rounded-lg bg-[#151833] border border-[#a855f7]/30 flex items-center justify-center text-[#94a3b8] hover:text-[#c084fc] hover:border-[#c084fc] transition-colors"
                title="Global Orbit Mesh"
              >
                <Globe2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 1: Platform */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold text-[#a855f7] uppercase tracking-widest">
              Platform
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-mono text-[#94a3b8]">
              <li><a href="#telemetry" className="hover:text-white transition-colors">Orbital Bus Core</a></li>
              <li><a href="#simulator" className="hover:text-white transition-colors">Trajectory Solver</a></li>
              <li><a href="#telemetry" className="hover:text-white transition-colors">Propulsion Telemetry</a></li>
              <li><a href="#ground-stations" className="hover:text-white transition-colors">RF Link Matrix</a></li>
            </ul>
          </div>

          {/* Column 2: Architecture */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold text-[#a855f7] uppercase tracking-widest">
              Architecture
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-mono text-[#94a3b8]">
              <li><a href="#features" className="hover:text-white transition-colors">Zero-Trust Payload</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Radiation-Hard VM</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Edge Compute SDK</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Flight API Specs</a></li>
            </ul>
          </div>

          {/* Column 3: Enterprise */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold text-[#a855f7] uppercase tracking-widest">
              Enterprise
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-mono text-[#94a3b8]">
              <li><a href="#pricing" className="hover:text-white transition-colors">ITAR Controls</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">SLA Guarantees</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Security Center</a></li>
              <li>
                <button onClick={onOpenLaunchModal} className="hover:text-white transition-colors text-left cursor-pointer">
                  Contact Ground Crew
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Compliance Badges & Copyright matching Stitch */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#151833] border border-[#a855f7]/30 text-[#a855f7]">
              SOC2 TYPE II
            </span>
            <span className="px-3 py-1 rounded-full bg-[#151833] border border-[#a855f7]/30 text-[#a855f7]">
              ITAR READY
            </span>
            <span className="px-3 py-1 rounded-full bg-[#151833] border border-[#a855f7]/30 text-[#a855f7]">
              ISO 27001
            </span>
            <span className="px-3 py-1 rounded-full bg-[#151833] border border-[#3b82f6]/30 text-[#3b82f6]">
              AEROSPACE AS9100D
            </span>
          </div>

          <p className="text-[#64748b] text-center md:text-right">
            © 2025 LaunchPad Systems Corp. All mission parameters reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
