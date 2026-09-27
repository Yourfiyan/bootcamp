import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Menu, 
  X, 
  ChevronRight,
  Rocket
} from 'lucide-react';
import { setupMagneticElement } from '../utils/motion';

export default function Navbar({ onOpenLaunchModal }) {
  const [zuluTime, setZuluTime] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ctaBtnRef = useRef(null);

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

  // Smart directional scroll hiding & revealing (Step 12)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);

      if (currentScrollY > 120) {
        if (currentScrollY > lastScrollY.current && !isMobileMenuOpen) {
          // Scrolling down: hide navbar smoothly
          setVisible(false);
        } else {
          // Scrolling up: reveal navbar
          setVisible(true);
        }
      } else {
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen]);

  // Setup magnetic interaction on CTA button
  useEffect(() => {
    if (ctaBtnRef.current) {
      return setupMagneticElement(ctaBtnRef.current, 0.25);
    }
  }, []);

  const navLinks = [
    { name: 'Mission Deck', href: '#telemetry' },
    { name: 'Capabilities', href: '#features' },
    { name: 'Flight Simulator', href: '#simulator' },
    { name: 'Ground Relays', href: '#ground-stations' },
    { name: 'Pricing', href: '#pricing' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible ? 'translate-y-0' : '-translate-y-full pointer-events-none'
      } ${
        scrolled 
          ? 'glass-deck-1 border-b border-[#a855f7]/20 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.6)] backdrop-blur-2xl' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-auto">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo with tactile hover */}
          <a href="#" className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-[#a855f7] rounded-lg">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-[#151833] border border-[#a855f7]/40 group-hover:border-[#c084fc] transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.3)] group-hover:shadow-[0_0_22px_rgba(168,85,247,0.5)]">
              <Rocket className="w-5 h-5 text-[#a855f7] group-hover:text-[#c084fc] transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#3b82f6] rounded-full animate-ping opacity-75"></div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#3b82f6] rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-['Space_Grotesk'] font-bold text-lg tracking-wider text-white flex items-center gap-1.5">
                Launch<span className="text-[#a855f7] group-hover:text-[#c084fc] transition-colors">Pad</span>
              </span>
              <span className="font-mono text-[10px] tracking-widest text-[#94a3b8] uppercase">
                Autonomous Orbital OS
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links with active highlight */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-[#94a3b8] hover:text-white transition-colors duration-200 relative py-1 group font-['Inter'] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#a855f7] rounded"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#a855f7] to-[#3b82f6] transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Telemetry pill & Magnetic CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Live Status Chip */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#151833]/90 border border-[#a855f7]/30 text-xs font-mono text-[#c084fc] shadow-[0_0_12px_rgba(168,85,247,0.15)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span>LIVE UPLINK STABLE</span>
              <span className="text-[#64748b]">|</span>
              <span className="text-[#94a3b8]">{zuluTime || '00:00:00 ZULU'}</span>
            </div>

            {/* Launch Console Button with Magnetic Physics */}
            <button
              ref={ctaBtnRef}
              onClick={onOpenLaunchModal}
              className="btn-primary-action px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 cursor-pointer font-['Space_Grotesk'] focus-visible:ring-2 focus-visible:ring-white transition-shadow"
            >
              <Terminal className="w-4 h-4" />
              <span>Launch Console</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={onOpenLaunchModal}
              className="btn-primary-action px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 font-['Space_Grotesk']"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Console</span>
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-[#151833] border border-[#a855f7]/30 text-[#e2e0f7] hover:text-white focus-visible:ring-2 focus-visible:ring-[#a855f7]"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 p-4 rounded-xl glass-deck-2 border border-[#a855f7]/30 shadow-2xl animate-in fade-in slide-in-from-top duration-200">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#a855f7]/20 font-mono text-xs text-[#c084fc]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>UPLINK NOMINAL</span>
                </div>
                <span className="text-[#94a3b8]">{zuluTime}</span>
              </div>
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-[#e2e0f7] hover:bg-[#a855f7]/10 hover:text-[#c084fc] transition-colors font-['Inter']"
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-[#64748b]" />
                </a>
              ))}
              <div className="pt-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenLaunchModal();
                  }}
                  className="w-full btn-primary-action py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 font-['Space_Grotesk']"
                >
                  <Terminal className="w-4 h-4" />
                  <span>Open Mission Console</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
