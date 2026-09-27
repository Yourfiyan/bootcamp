import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Sliders, 
  Orbit, 
  Flame, 
  Compass, 
  Gauge, 
  Zap, 
  RotateCw, 
  CheckCircle2, 
  Sparkles,
  Info
} from 'lucide-react';
import { setupViewportTilt } from '../utils/motion';

export default function MissionSimulator({ onOpenLaunchModal }) {
  const [altitude, setAltitude] = useState(550); // km
  const [payloadMass, setPayloadMass] = useState(1250); // kg
  const [inclination, setInclination] = useState(53.2); // degrees
  const [isp, setIsp] = useState(1800); // seconds (Electric Hall Thruster)
  const previewCardRef = useRef(null);

  // Orbital physics calculations
  const physics = useMemo(() => {
    const G = 6.67430e-11;
    const M_EARTH = 5.9722e24; // kg
    const R_EARTH = 6371; // km
    const r = (R_EARTH + altitude) * 1000; // meters

    const velocityMs = Math.sqrt((G * M_EARTH) / r);
    const velocityKms = velocityMs / 1000;

    const periodSeconds = 2 * Math.PI * Math.sqrt(Math.pow(r, 3) / (G * M_EARTH));
    const periodMinutes = periodSeconds / 60;

    const r1 = (R_EARTH + 200) * 1000;
    const r2 = r;
    const dv1 = Math.sqrt((G * M_EARTH) / r1) * (Math.sqrt((2 * r2) / (r1 + r2)) - 1);
    const dv2 = Math.sqrt((G * M_EARTH) / r2) * (1 - Math.sqrt((2 * r1) / (r1 + r2)));
    const totalDeltaV = Math.abs(dv1) + Math.abs(dv2);

    const angleRad = Math.acos(R_EARTH / (R_EARTH + altitude));
    const swathKm = 2 * R_EARTH * angleRad;
    const eclipseMinutes = (periodMinutes / 2) * (Math.asin(R_EARTH / (R_EARTH + altitude)) / Math.PI);

    const g0 = 9.80665;
    const massRatio = Math.exp(totalDeltaV / (isp * g0));
    const propMassRequired = payloadMass * (massRatio - 1);

    return {
      velocity: velocityKms.toFixed(2),
      period: periodMinutes.toFixed(1),
      deltaV: Math.round(totalDeltaV),
      swath: Math.round(swathKm),
      eclipse: eclipseMinutes.toFixed(1),
      propMass: Math.round(propMassRequired)
    };
  }, [altitude, payloadMass, inclination, isp]);

  useEffect(() => {
    if (previewCardRef.current) {
      return setupViewportTilt(previewCardRef.current, {
        enterRotateX: 3,
        exitRotateX: -2,
        enterScale: 0.98,
        exitScale: 0.98,
      });
    }
  }, []);

  const applyPreset = (presetAlt, presetInc, presetIsp, presetMass) => {
    setAltitude(presetAlt);
    setInclination(presetInc);
    setIsp(presetIsp);
    if (presetMass) setPayloadMass(presetMass);
  };

  return (
    <section id="simulator" className="py-24 relative overflow-hidden bg-[#0A0B1A]">
      {/* Glow Orbs */}
      <div className="glow-orb-violet w-[500px] h-[500px] -top-32 right-1/4 opacity-20"></div>
      <div className="glow-orb-cyan w-[500px] h-[500px] -bottom-32 left-1/4 opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151833] border border-[#a855f7]/30 text-xs font-mono text-[#c084fc] mb-4 shadow-[0_0_12px_rgba(168,85,247,0.15)]">
            <Sliders className="w-3.5 h-3.5 text-[#a855f7]" />
            <span className="uppercase tracking-wider">REAL-TIME TRAJECTORY ENGINE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-['Space_Grotesk'] font-bold text-white tracking-tight">
            Orbital Vector & Mission Simulator
          </h2>

          <p className="text-[#94a3b8] font-['Inter'] mt-3 text-sm sm:text-base">
            Simulate delta-V budgets, orbital insertion periods, and ground station swaths with real gravitational models.
          </p>
        </div>

        {/* Simulator Main Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Controls */}
          <div className="lg:col-span-6 rounded-2xl glass-deck-2 p-6 sm:p-8 border border-[#a855f7]/30 space-y-6 shadow-[0_0_40px_rgba(168,85,247,0.1)]">
            
            {/* Presets Row */}
            <div>
              <div className="text-xs font-mono text-[#94a3b8] uppercase tracking-wider mb-2.5 flex items-center justify-between">
                <span>MISSION TRAJECTORY PRESETS</span>
                <span className="text-[#a855f7] text-[10px]">HOHMANN OPTIMAL</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => applyPreset(410, 51.6, 1800, 1800)}
                  className="px-3 py-2 rounded-lg bg-[#0F1123] border border-[#a855f7]/20 hover:border-[#c084fc] text-xs font-mono text-left transition-all hover:bg-white/5 cursor-pointer focus-visible:ring-1 focus-visible:ring-[#a855f7]"
                >
                  <div className="text-white font-semibold">ISS Orbit</div>
                  <div className="text-[#94a3b8] text-[10px]">410 km • 51.6° Inclination</div>
                </button>

                <button
                  onClick={() => applyPreset(550, 53.2, 2200, 1250)}
                  className="px-3 py-2 rounded-lg bg-[#0F1123] border border-[#a855f7]/20 hover:border-[#c084fc] text-xs font-mono text-left transition-all hover:bg-white/5 cursor-pointer focus-visible:ring-1 focus-visible:ring-[#a855f7]"
                >
                  <div className="text-white font-semibold">Starlink LEO Swarm</div>
                  <div className="text-[#94a3b8] text-[10px]">550 km • 53.2° Inclination</div>
                </button>

                <button
                  onClick={() => applyPreset(800, 98.6, 2600, 850)}
                  className="px-3 py-2 rounded-lg bg-[#0F1123] border border-[#a855f7]/20 hover:border-[#c084fc] text-xs font-mono text-left transition-all hover:bg-white/5 cursor-pointer focus-visible:ring-1 focus-visible:ring-[#a855f7]"
                >
                  <div className="text-white font-semibold">Sun-Sync (SSO)</div>
                  <div className="text-[#94a3b8] text-[10px]">800 km • 98.6° Inclination</div>
                </button>

                <button
                  onClick={() => applyPreset(20200, 55.0, 3100, 2400)}
                  className="px-3 py-2 rounded-lg bg-[#0F1123] border border-[#a855f7]/20 hover:border-[#c084fc] text-xs font-mono text-left transition-all hover:bg-white/5 cursor-pointer focus-visible:ring-1 focus-visible:ring-[#a855f7]"
                >
                  <div className="text-white font-semibold">MEO Navigation</div>
                  <div className="text-[#94a3b8] text-[10px]">20,200 km • GPS Orbit</div>
                </button>
              </div>
            </div>

            {/* Slider 1: Altitude */}
            <div className="space-y-2">
              <div className="flex justify-between items-center font-mono text-xs">
                <span className="text-[#94a3b8]">ORBITAL ALTITUDE</span>
                <span className="text-white font-bold bg-[#151833] px-2 py-0.5 rounded border border-[#a855f7]/30">
                  {altitude.toLocaleString()} km
                </span>
              </div>
              <input 
                type="range" 
                min="300" 
                max="25000" 
                step="50"
                value={altitude} 
                onChange={(e) => setAltitude(Number(e.target.value))}
                className="w-full accent-[#a855f7] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#64748b]">
                <span>LEO (300 km)</span>
                <span>SSO (800 km)</span>
                <span>MEO (20,000 km)</span>
              </div>
            </div>

            {/* Slider 2: Payload Mass */}
            <div className="space-y-2">
              <div className="flex justify-between items-center font-mono text-xs">
                <span className="text-[#94a3b8]">PAYLOAD WET MASS</span>
                <span className="text-white font-bold bg-[#151833] px-2 py-0.5 rounded border border-[#a855f7]/30">
                  {payloadMass.toLocaleString()} kg
                </span>
              </div>
              <input 
                type="range" 
                min="100" 
                max="10000" 
                step="50"
                value={payloadMass} 
                onChange={(e) => setPayloadMass(Number(e.target.value))}
                className="w-full accent-[#a855f7] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#64748b]">
                <span>CubeSat (100 kg)</span>
                <span>Standard Bus (1,250 kg)</span>
                <span>Heavy Relays (10,000 kg)</span>
              </div>
            </div>

            {/* Slider 3: Inclination */}
            <div className="space-y-2">
              <div className="flex justify-between items-center font-mono text-xs">
                <span className="text-[#94a3b8]">ORBITAL INCLINATION</span>
                <span className="text-white font-bold bg-[#151833] px-2 py-0.5 rounded border border-[#a855f7]/30">
                  {inclination}°
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="110" 
                step="0.5"
                value={inclination} 
                onChange={(e) => setInclination(Number(e.target.value))}
                className="w-full accent-[#a855f7] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#64748b]">
                <span>0° (Equatorial)</span>
                <span>51.6° (ISS)</span>
                <span>98° (Retrograde/SSO)</span>
              </div>
            </div>

            {/* Slider 4: Specific Impulse */}
            <div className="space-y-2">
              <div className="flex justify-between items-center font-mono text-xs">
                <span className="text-[#94a3b8]">PROPULSION EFFICIENCY (ISP)</span>
                <span className="text-white font-bold bg-[#151833] px-2 py-0.5 rounded border border-[#a855f7]/30">
                  {isp} s
                </span>
              </div>
              <input 
                type="range" 
                min="310" 
                max="3500" 
                step="50"
                value={isp} 
                onChange={(e) => setIsp(Number(e.target.value))}
                className="w-full accent-[#a855f7] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#64748b]">
                <span>Chemical (310s)</span>
                <span>Hall Electric (1,800s)</span>
                <span>Ion Grid (3,500s)</span>
              </div>
            </div>

          </div>

          {/* Right Column: Calculated Vector Readouts & Visual */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Visual Orbit Profile Card with Viewport Tilt */}
            <div 
              ref={previewCardRef}
              className="velocity-reactive rounded-2xl glass-deck-2 p-6 border border-[#a855f7]/30 relative overflow-hidden shadow-[0_0_40px_rgba(168,85,247,0.1)] transition-shadow duration-500 hover:shadow-[0_0_55px_rgba(168,85,247,0.25)]"
            >
              <div className="flex items-center justify-between border-b border-[#a855f7]/20 pb-3 mb-4">
                <div className="flex items-center gap-2 font-mono text-xs text-white">
                  <Orbit className="w-4 h-4 text-[#a855f7]" />
                  <span>SIMULATED ORBITAL DYNAMICS PROFILE</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>TRAJECTORY CONVERGED</span>
                </div>
              </div>

              {/* Dynamic Orbit Ring Preview */}
              <div className="relative h-48 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#1e3a8a] border border-[#a855f7]/40 flex items-center justify-center text-[10px] font-mono text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] z-10">
                  EARTH
                </div>

                {/* Animated Dynamic Orbit Path */}
                <div 
                  className="absolute rounded-full border border-dashed border-[#c084fc]/70 transition-all duration-700 ease-out"
                  style={{
                    width: `${Math.min(94, 38 + (altitude / 25000) * 52)}%`,
                    height: `${Math.min(94, 38 + (altitude / 25000) * 52)}%`,
                  }}
                >
                  {/* Orbiting Satellite Node container with rotate */}
                  <div 
                    className="absolute inset-0 origin-center pointer-events-none animate-orbit-medium"
                  >
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#a855f7] border border-white shadow-[0_0_12px_#a855f7]"></div>
                  </div>
                </div>
              </div>

              <div className="text-center font-mono text-xs text-[#94a3b8] mt-2">
                Simulated Orbital Track • Mean Velocity {physics.velocity} km/s
              </div>
            </div>

            {/* Calculated Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              
              <div className="p-4 rounded-xl bg-[#0F1123]/90 border border-[#a855f7]/20">
                <div className="text-[10px] font-mono text-[#94a3b8] uppercase">Delta-V Budget</div>
                <div className="font-mono text-xl font-bold text-white mt-1">
                  {physics.deltaV.toLocaleString()} <span className="text-xs text-[#94a3b8]">m/s</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Transfer Verified</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0F1123]/90 border border-[#a855f7]/20">
                <div className="text-[10px] font-mono text-[#94a3b8] uppercase">Orbital Period</div>
                <div className="font-mono text-xl font-bold text-[#c084fc] mt-1">
                  {physics.period} <span className="text-xs text-[#94a3b8]">min</span>
                </div>
                <div className="text-[10px] text-[#94a3b8] font-mono mt-0.5">{(1440 / parseFloat(physics.period)).toFixed(1)} revs / day</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0F1123]/90 border border-[#a855f7]/20">
                <div className="text-[10px] font-mono text-[#94a3b8] uppercase">Orbital Velocity</div>
                <div className="font-mono text-xl font-bold text-[#3b82f6] mt-1">
                  {physics.velocity} <span className="text-xs text-[#94a3b8]">km/s</span>
                </div>
                <div className="text-[10px] text-[#3b82f6] font-mono mt-0.5">Vis-Viva Model</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0F1123]/90 border border-[#a855f7]/20">
                <div className="text-[10px] font-mono text-[#94a3b8] uppercase">Ground Swath</div>
                <div className="font-mono text-xl font-bold text-white mt-1">
                  {physics.swath.toLocaleString()} <span className="text-xs text-[#94a3b8]">km</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Line-of-Sight</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0F1123]/90 border border-[#a855f7]/20">
                <div className="text-[10px] font-mono text-[#94a3b8] uppercase">Solar Eclipse</div>
                <div className="font-mono text-xl font-bold text-amber-300 mt-1">
                  {physics.eclipse} <span className="text-xs text-[#94a3b8]">min</span>
                </div>
                <div className="text-[10px] text-amber-400 font-mono mt-0.5">Shadow Period</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0F1123]/90 border border-[#a855f7]/20">
                <div className="text-[10px] font-mono text-[#94a3b8] uppercase">Propellant Needed</div>
                <div className="font-mono text-xl font-bold text-white mt-1">
                  {physics.propMass} <span className="text-xs text-[#94a3b8]">kg</span>
                </div>
                <div className="text-[10px] text-purple-400 font-mono mt-0.5">Tsiolkovsky Calc</div>
              </div>

            </div>

            {/* Launch Plan Action CTA */}
            <div className="p-4 rounded-xl bg-[#151833] border border-[#a855f7]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <div className="text-sm font-semibold text-white font-['Space_Grotesk']">
                  Ready to deploy this orbital trajectory?
                </div>
                <div className="text-xs text-[#94a3b8] font-mono mt-0.5">
                  Export ephemeris vectors directly to your mission schedule.
                </div>
              </div>

              <button
                onClick={onOpenLaunchModal}
                className="w-full sm:w-auto btn-primary-action px-5 py-2.5 rounded-lg text-xs font-semibold cursor-pointer shrink-0 font-['Space_Grotesk'] focus-visible:ring-2 focus-visible:ring-white"
              >
                Provision Trajectory In Console
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
