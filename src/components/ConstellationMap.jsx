import React, { useState, useRef, useEffect } from 'react';
import { 
  Radio, 
  Globe2, 
  Wifi, 
  Layers, 
  MapPin, 
  Activity, 
  CheckCircle, 
  RefreshCw,
  Send,
  Zap
} from 'lucide-react';
import { animate } from 'animejs';
import { GROUND_STATIONS } from '../data/telemetryData';
import { setupMonochromeTransition, setupViewportTilt } from '../utils/motion';

export default function ConstellationMap() {
  const [activeStationId, setActiveStationId] = useState(GROUND_STATIONS[0].id);
  const [pingResults, setPingResults] = useState({});
  const [isPinging, setIsPinging] = useState(false);
  const globePingRingRef = useRef(null);
  const sectionRef = useRef(null);
  const networkShellRef = useRef(null);

  // Intentional monochrome & viewport 3D tilt transition (Steps 5 & 6)
  useEffect(() => {
    let cleanupMono = () => {};
    let cleanupTilt = () => {};

    if (sectionRef.current && networkShellRef.current) {
      cleanupMono = setupMonochromeTransition(sectionRef.current, networkShellRef.current);
      cleanupTilt = setupViewportTilt(networkShellRef.current, {
        enterRotateX: 3,
        exitRotateX: -2.2,
        enterScale: 0.98,
        exitScale: 0.98,
      });
    }

    return () => {
      cleanupMono();
      cleanupTilt();
    };
  }, []);

  const selectedStation = GROUND_STATIONS.find(g => g.id === activeStationId) || GROUND_STATIONS[0];

  const runOpticalPing = (stationId) => {
    setIsPinging(true);

    if (globePingRingRef.current) {
      animate(globePingRingRef.current, {
        scale: [1, 2.4],
        opacity: [0.9, 0],
        ease: 'outExpo',
        duration: 900,
        loop: 2,
      });
    }

    setTimeout(() => {
      const simulatedPing = (Math.random() * 2 + 3.2).toFixed(1);
      setPingResults(prev => ({
        ...prev,
        [stationId]: `${simulatedPing} ms`
      }));
      setIsPinging(false);
    }, 800);
  };

  return (
    <section 
      ref={sectionRef} 
      id="ground-stations" 
      className="py-24 relative overflow-hidden bg-[#0A0B1A] transition-all duration-700"
    >
      <div className="glow-orb-violet w-[500px] h-[500px] -bottom-32 -right-32 opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151833] border border-[#a855f7]/30 text-xs font-mono text-[#c084fc] mb-3 shadow-[0_0_12px_rgba(168,85,247,0.15)]">
              <Radio className="w-3.5 h-3.5 text-[#a855f7]" />
              <span>GLOBAL GROUND APERTURE MESH</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-['Space_Grotesk'] font-bold text-white tracking-tight">
              Optical Downlink Network
            </h2>
            <p className="text-[#94a3b8] font-['Inter'] mt-2 max-w-xl text-sm sm:text-base">
              Synchronized 1550nm coherent optical receiving apertures across five continents for uninterrupted direct-to-cloud telemetry ingest.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <button
              onClick={() => runOpticalPing(selectedStation.id)}
              disabled={isPinging}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg btn-secondary-glass text-xs font-mono text-white cursor-pointer hover:border-[#c084fc]"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#a855f7] ${isPinging ? 'animate-spin' : ''}`} />
              <span>{isPinging ? 'MEASURING COHERENCE...' : 'TEST OPTICAL LINK PING'}</span>
            </button>
          </div>
        </div>

        {/* Global Network Display Shell with Monochrome Transition & Viewport 3D Tilt */}
        <div 
          ref={networkShellRef}
          className="velocity-reactive grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch transition-[filter] duration-500"
        >
          
          {/* Left Column: Interactive Station List */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-mono text-[#94a3b8] uppercase tracking-wider mb-2">
              ACTIVE APERTURE STATIONS ({GROUND_STATIONS.length})
            </div>

            {GROUND_STATIONS.map((station) => {
              const isSelected = station.id === activeStationId;
              const displayPing = pingResults[station.id] || station.ping;

              return (
                <div
                  key={station.id}
                  onClick={() => setActiveStationId(station.id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#151833] border border-[#c084fc]/60 shadow-[0_0_24px_rgba(168,85,247,0.25)] scale-[1.01]'
                      : 'bg-[#0F1123]/80 border border-[#a855f7]/15 hover:border-[#a855f7]/40 hover:bg-[#0F1123]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span className="font-['Space_Grotesk'] font-bold text-white text-base">
                        {station.name}
                      </span>
                    </div>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#a855f7]/15 text-[#ddb7ff] border border-[#a855f7]/30">
                      {station.status}
                    </span>
                  </div>

                  <div className="text-xs text-[#94a3b8] font-['Inter'] mb-3 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-[#a855f7]" />
                    <span>{station.location}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#a855f7]/15 font-mono text-[11px]">
                    <div>
                      <div className="text-[#64748b]">BANDWIDTH</div>
                      <div className="text-white font-semibold">{station.throughput}</div>
                    </div>
                    <div>
                      <div className="text-[#64748b]">LATENCY</div>
                      <div className="text-emerald-400 font-semibold">{displayPing}</div>
                    </div>
                    <div>
                      <div className="text-[#64748b]">TRACKS</div>
                      <div className="text-[#c084fc] font-semibold">{station.activeTracks} Sats</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Ground Station Inspector & Map Simulation */}
          <div className="lg:col-span-7 rounded-2xl glass-deck-2 p-6 sm:p-8 border border-[#a855f7]/30 flex flex-col justify-between shadow-[0_0_40px_rgba(168,85,247,0.1)]">
            
            <div>
              {/* Station Deep Dive Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#a855f7]/20 gap-4">
                <div>
                  <span className="text-[11px] font-mono text-[#a855f7] uppercase tracking-wider">
                    STATION TELEMETRY INSPECTOR
                  </span>
                  <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-white mt-1">
                    {selectedStation.name}
                  </h3>
                  <p className="text-xs font-mono text-[#94a3b8] mt-0.5">
                    COORDINATES: {selectedStation.lat.toFixed(4)}° N, {selectedStation.lng.toFixed(4)}° E
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    APERTURE TRACKING ACTIVE
                  </span>
                </div>
              </div>

              {/* World Network Graphic Representation */}
              <div className="my-6 p-6 rounded-xl bg-[#0A0B1A]/80 border border-[#a855f7]/20 relative overflow-hidden min-h-[220px] flex flex-col justify-between">
                
                {/* World Map Overlay Dots */}
                <div className="absolute inset-0 opacity-20 bg-grid-pattern pointer-events-none"></div>

                <div className="relative z-10 flex items-center justify-between text-xs font-mono text-[#94a3b8]">
                  <span>OPTICAL BEAM CARRIER FREQUENCY</span>
                  <span className="text-white font-bold">{selectedStation.frequency}</span>
                </div>

                <div className="relative z-10 my-4 flex items-center justify-center">
                  <div className="text-center relative">
                    {/* Anime.js Optical Laser Ping Ripple Wave */}
                    <div 
                      ref={globePingRingRef}
                      className="absolute inset-0 rounded-full border-2 border-[#a855f7] pointer-events-none opacity-0"
                    ></div>

                    <div className="inline-flex p-4 rounded-full bg-[#151833] border border-[#a855f7]/40 shadow-[0_0_30px_rgba(168,85,247,0.3)] mb-2">
                      <Globe2 className="w-10 h-10 text-[#a855f7] animate-spin-slow" />
                    </div>
                    <div className="font-['Space_Grotesk'] font-bold text-white text-base">
                      {selectedStation.location}
                    </div>
                    <div className="text-xs font-mono text-[#3b82f6]">
                      Elevation Angle: {selectedStation.elevationAngle}
                    </div>
                  </div>
                </div>

                <div className="relative z-10 flex items-center justify-between text-[11px] font-mono border-t border-[#a855f7]/15 pt-2 text-[#94a3b8]">
                  <span>Direct Cloud Ingest: AWS Ground Station LEO Region</span>
                  <span className="text-emerald-400">Zero Ingest Dropped</span>
                </div>
              </div>

              {/* Station Hardware Architecture Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-[#0F1123] border border-[#a855f7]/15">
                  <div className="text-[#64748b]">DISH APERTURE</div>
                  <div className="text-white font-semibold mt-1">11.3 Meter</div>
                </div>
                <div className="p-3 rounded-lg bg-[#0F1123] border border-[#a855f7]/15">
                  <div className="text-[#64748b]">CRYOGENIC LNA</div>
                  <div className="text-white font-semibold mt-1">18 Kelvin</div>
                </div>
                <div className="p-3 rounded-lg bg-[#0F1123] border border-[#a855f7]/15">
                  <div className="text-[#64748b]">OPTICAL PING</div>
                  <div className="text-emerald-400 font-semibold mt-1">
                    {pingResults[selectedStation.id] || selectedStation.ping}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#0F1123] border border-[#a855f7]/15">
                  <div className="text-[#64748b]">MODULATION</div>
                  <div className="text-white font-semibold mt-1">DP-QPSK 32QAM</div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
