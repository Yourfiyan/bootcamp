import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Terminal, 
  Radio, 
  Battery, 
  Flame, 
  Compass, 
  Thermometer, 
  Wifi, 
  Play, 
  Pause, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Layers,
  ArrowRight
} from 'lucide-react';
import { animate } from 'animejs';
import { SATELLITE_FLEET } from '../data/telemetryData';
import { setupViewportTilt } from '../utils/motion';

export default function MissionTelemetryDisplay() {
  const [selectedSatId, setSelectedSatId] = useState(SATELLITE_FLEET[0].id);
  const [activeTab, setActiveTab] = useState('vectors');
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [satData, setSatData] = useState(SATELLITE_FLEET);
  const [logFilter, setLogFilter] = useState('ALL');
  const wavePathRef = useRef(null);
  const shellRef = useRef(null);

  const [logs, setLogs] = useState([
    { id: 1, time: '14:28:02.102', sat: 'AETHER-1', type: 'INFO', sys: 'EPHEMERIS', msg: 'LEO telemetry packet #99104 decoded successfully. Covariance nominal.' },
    { id: 2, time: '14:28:03.441', sat: 'AETHER-2', type: 'BURN', sys: 'THRUST', msg: 'Hall Thruster Bank #2 ignition confirmed. Delta-V burn delta +0.12 m/s.' },
    { id: 3, time: '14:28:04.890', sat: 'CYGNUS-9', type: 'INFO', sys: 'OPTICAL', msg: 'Laser crosslink lock established with Svalbard GS. Bitrate 120.0 Gbps.' },
    { id: 4, time: '14:28:06.120', sat: 'VORTEX-7', type: 'SUCCESS', sys: 'PAYLOAD', msg: 'SAR radar strip telemetry processed. Zero loss in frame sync.' },
    { id: 5, time: '14:28:07.512', sat: 'AETHER-1', type: 'INFO', sys: 'QKD', msg: 'Quantum-resistant Kyber session renegotiated. Ephemeris ledger committed.' },
  ]);

  // Live simulation tick: micro update coordinates and telemetry values
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      setSatData(prevFleet => 
        prevFleet.map(sat => {
          const jitterAlt = (Math.random() - 0.5) * 0.04;
          const jitterVel = (Math.random() - 0.5) * 0.002;
          const jitterThermal = (Math.random() - 0.5) * 0.1;
          
          return {
            ...sat,
            altitude: Number((sat.altitude + jitterAlt).toFixed(2)),
            velocity: Number((sat.velocity + jitterVel).toFixed(3)),
            thermal: Number((sat.thermal + jitterThermal).toFixed(1)),
          };
        })
      );
    }, 1800);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  // Periodic log stream generator
  useEffect(() => {
    if (!isLiveStreaming) return;

    const logMessages = [
      { type: 'INFO', sys: 'LASER-MESH', msg: 'Optical crosslink routing table updated. Packet loss 0.0001%.' },
      { type: 'SUCCESS', sys: 'AVIONICS', msg: 'Sub-millisecond star-tracker quaternion orientation confirmed.' },
      { type: 'BURN', sys: 'ORBIT-MANEUVER', msg: 'Station-keeping micro-pulse executed. Apogee maintained.' },
      { type: 'INFO', sys: 'QKD-KEYS', msg: 'LEO quantum key synchronized with Kourou Ground Aperture.' },
      { type: 'INFO', sys: 'PAYLOAD-RTOS', msg: 'Container runtime memory load 38.4% on rad-hardened core.' },
      { type: 'SUCCESS', sys: 'THERMAL', msg: 'Radiator loop balance verified at 21.4°C.' }
    ];

    const logTimer = setInterval(() => {
      const now = new Date();
      const timeStr = `${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}:${String(now.getUTCSeconds()).padStart(2, '0')}.${String(Math.floor(Math.random() * 900 + 100))}`;
      const randomMsg = logMessages[Math.floor(Math.random() * logMessages.length)];
      const currentSat = satData[Math.floor(Math.random() * satData.length)];

      setLogs(prev => [
        {
          id: Date.now(),
          time: timeStr,
          sat: currentSat.name.split(' ')[0],
          type: randomMsg.type,
          sys: randomMsg.sys,
          msg: randomMsg.msg
        },
        ...prev.slice(0, 19)
      ]);
    }, 3200);

    return () => clearInterval(logTimer);
  }, [isLiveStreaming, satData]);

  // Viewport 3D perspective tilt (Step 5)
  useEffect(() => {
    if (shellRef.current) {
      return setupViewportTilt(shellRef.current, {
        enterRotateX: 2.5,
        exitRotateX: -2.2,
        enterScale: 0.98,
        exitScale: 0.98,
      });
    }
  }, []);

  const currentSat = satData.find(s => s.id === selectedSatId) || satData[0];

  const filteredLogs = logFilter === 'ALL' 
    ? logs 
    : logs.filter(l => l.type === logFilter);

  return (
    <section id="telemetry" className="py-24 relative overflow-hidden bg-[#0A0B1A]">
      {/* Ambient background glows */}
      <div className="glow-orb-violet w-[500px] h-[500px] top-1/2 -left-48 opacity-20"></div>
      <div className="glow-orb-cyan w-[500px] h-[500px] bottom-10 -right-48 opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151833] border border-[#a855f7]/30 text-xs font-mono text-[#c084fc] mb-3 shadow-[0_0_12px_rgba(168,85,247,0.15)]">
              <Activity className="w-3.5 h-3.5 text-[#a855f7]" />
              <span>LIVE TELEMETRY INTERFACE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-['Space_Grotesk'] font-bold text-white tracking-tight">
              Mission Telemetry Deck
            </h2>
            <p className="text-[#94a3b8] font-['Inter'] mt-2 max-w-xl text-sm sm:text-base">
              Real-time telemetry stream directly from orbiting AETHERIS nodes. Monitored through low-noise optical downlinks and deterministic LEO bus telemetry.
            </p>
          </div>

          {/* Live Stream Controls */}
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <button
              onClick={() => setIsLiveStreaming(!isLiveStreaming)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#151833] border border-[#a855f7]/30 text-xs font-mono text-white hover:border-[#c084fc] transition-colors cursor-pointer"
            >
              {isLiveStreaming ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-400" />
                  <span>PAUSE STREAM</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span>RESUME STREAM</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0F1123] border border-[#a855f7]/20 font-mono text-xs text-[#94a3b8]">
              <span className={`w-2 h-2 rounded-full ${isLiveStreaming ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
              <span>{isLiveStreaming ? '100 Hz SYNC' : 'STREAM FROZEN'}</span>
            </div>
          </div>
        </div>

        {/* Telemetry Dashboard Main Shell */}
        <div 
          ref={shellRef}
          className="velocity-reactive rounded-2xl glass-deck-2 border border-[#a855f7]/30 overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.15)] relative"
        >
          
          {/* Animated Scanline Overlay */}
          <div className="absolute inset-0 scanline-overlay opacity-25 pointer-events-none"></div>

          {/* Top Bar: Satellite Selection Tabs */}
          <div className="relative z-10 bg-[#0F1123]/90 border-b border-[#a855f7]/20 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
              {satData.map(sat => {
                const isSelected = sat.id === selectedSatId;
                return (
                  <button
                    key={sat.id}
                    onClick={() => setSelectedSatId(sat.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-[#a855f7]/20 text-[#ddb7ff] border border-[#c084fc]/50 shadow-[0_0_12px_rgba(168,85,247,0.3)] font-semibold'
                        : 'text-[#94a3b8] hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${sat.burnStatus === 'Burn Active' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></span>
                    <span>{sat.name}</span>
                    <span className="text-[10px] text-[#64748b]">({sat.designation})</span>
                  </button>
                );
              })}
            </div>

            {/* Subsystem Mode Segmented Control */}
            <div className="flex items-center bg-[#0A0B1A] p-1 rounded-lg border border-[#a855f7]/20 text-xs font-mono">
              <button
                onClick={() => setActiveTab('vectors')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${activeTab === 'vectors' ? 'bg-[#a855f7] text-white font-bold' : 'text-[#94a3b8] hover:text-white'}`}
              >
                VECTORS
              </button>
              <button
                onClick={() => setActiveTab('optical')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${activeTab === 'optical' ? 'bg-[#a855f7] text-white font-bold' : 'text-[#94a3b8] hover:text-white'}`}
              >
                OPTICAL
              </button>
              <button
                onClick={() => setActiveTab('avionics')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${activeTab === 'avionics' ? 'bg-[#a855f7] text-white font-bold' : 'text-[#94a3b8] hover:text-white'}`}
              >
                AVIONICS
              </button>
            </div>
          </div>

          {/* Subsystem Telemetry Body */}
          <div className="relative z-10 p-5 sm:p-8">
            
            {/* Active Satellite Summary Row */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 mb-6 border-b border-[#a855f7]/20 gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white">
                    {currentSat.name}
                  </h3>
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[#a855f7]/20 text-[#c084fc] border border-[#a855f7]/40">
                    {currentSat.orbitType}
                  </span>
                  <span className={`font-mono text-xs px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${
                    currentSat.burnStatus === 'Burn Active'
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {currentSat.burnStatus}
                  </span>
                </div>
                <div className="text-xs text-[#94a3b8] font-mono mt-1 flex items-center gap-2">
                  <span>DESIGNATION: {currentSat.designation}</span>
                  <span>•</span>
                  <span>PAYLOAD: {currentSat.payloadStatus}</span>
                </div>
              </div>

              {/* Next Ground Contact countdown */}
              <div className="flex items-center gap-3 font-mono text-xs bg-[#0F1123] px-4 py-2.5 rounded-lg border border-[#a855f7]/20">
                <Radio className="w-4 h-4 text-[#3b82f6] animate-pulse" />
                <span className="text-[#94a3b8]">NEXT APERTURE:</span>
                <span className="text-white font-bold">{currentSat.nextPass}</span>
              </div>
            </div>

            {/* Telemetry Metric Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              
              <div className="p-4 rounded-xl bg-[#0F1123]/80 border border-[#a855f7]/20 hover:border-[#c084fc] transition-colors">
                <div className="flex items-center justify-between text-[#94a3b8] mb-1">
                  <span className="text-[11px] font-mono uppercase">Altitude</span>
                  <Compass className="w-3.5 h-3.5 text-[#a855f7]" />
                </div>
                <div className="font-mono text-xl font-bold text-white">
                  {currentSat.altitude} <span className="text-xs text-[#94a3b8] font-normal">km</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-mono mt-1">±0.02km drift</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0F1123]/80 border border-[#a855f7]/20 hover:border-[#c084fc] transition-colors">
                <div className="flex items-center justify-between text-[#94a3b8] mb-1">
                  <span className="text-[11px] font-mono uppercase">Velocity</span>
                  <Zap className="w-3.5 h-3.5 text-[#3b82f6]" />
                </div>
                <div className="font-mono text-xl font-bold text-white">
                  {currentSat.velocity} <span className="text-xs text-[#94a3b8] font-normal">km/s</span>
                </div>
                <div className="text-[10px] text-[#3b82f6] font-mono mt-1">Mach 22.4</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0F1123]/80 border border-[#a855f7]/20 hover:border-[#c084fc] transition-colors">
                <div className="flex items-center justify-between text-[#94a3b8] mb-1">
                  <span className="text-[11px] font-mono uppercase">Inclination</span>
                  <Activity className="w-3.5 h-3.5 text-[#c084fc]" />
                </div>
                <div className="font-mono text-xl font-bold text-white">
                  {currentSat.inclination}°
                </div>
                <div className="text-[10px] text-[#c084fc] font-mono mt-1">Plane Locked</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0F1123]/80 border border-[#a855f7]/20 hover:border-[#c084fc] transition-colors">
                <div className="flex items-center justify-between text-[#94a3b8] mb-1">
                  <span className="text-[11px] font-mono uppercase">Optical Link</span>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="font-mono text-xl font-bold text-emerald-400">
                  {currentSat.downlinkRate}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono mt-1">1550nm Laser</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0F1123]/80 border border-[#a855f7]/20 hover:border-[#c084fc] transition-colors">
                <div className="flex items-center justify-between text-[#94a3b8] mb-1">
                  <span className="text-[11px] font-mono uppercase">Battery Bus</span>
                  <Battery className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="font-mono text-xl font-bold text-white">
                  {currentSat.battery}%
                </div>
                <div className="text-[10px] text-[#94a3b8] font-mono mt-1">28.4V LiFePO4</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0F1123]/80 border border-[#a855f7]/20 hover:border-[#c084fc] transition-colors">
                <div className="flex items-center justify-between text-[#94a3b8] mb-1">
                  <span className="text-[11px] font-mono uppercase">Thermal Core</span>
                  <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                </div>
                <div className="font-mono text-xl font-bold text-white">
                  {currentSat.thermal}°C
                </div>
                <div className="text-[10px] text-emerald-400 font-mono mt-1">Optimal Range</div>
              </div>

            </div>

            {/* Terminal Live Event Log Stream */}
            <div className="rounded-xl bg-[#0A0B1A]/95 border border-[#a855f7]/25 overflow-hidden">
              <div className="p-3 bg-[#0F1123] border-b border-[#a855f7]/20 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-2 text-white">
                  <Terminal className="w-4 h-4 text-[#a855f7]" />
                  <span className="font-bold">LIVE EPHEMERIS & COMMAND LOG</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#64748b]">FILTER:</span>
                  {['ALL', 'INFO', 'SUCCESS', 'BURN'].map(filter => (
                    <button
                      key={filter}
                      onClick={() => setLogFilter(filter)}
                      className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                        logFilter === filter 
                          ? 'bg-[#a855f7] text-white font-bold' 
                          : 'bg-[#151833] text-[#94a3b8] hover:text-white'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Log List View */}
              <div className="p-4 font-mono text-xs space-y-2 max-h-56 overflow-y-auto">
                {filteredLogs.map(log => {
                  let badgeColor = 'text-[#3b82f6] border-[#3b82f6]/30 bg-[#3b82f6]/10';
                  if (log.type === 'SUCCESS') badgeColor = 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10';
                  if (log.type === 'BURN') badgeColor = 'text-amber-400 border-amber-400/30 bg-amber-400/10';

                  return (
                    <div key={log.id} className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 py-1 border-b border-[#151833]/80 hover:bg-[#151833]/40 px-2 rounded">
                      <span className="text-[#64748b] text-[11px] shrink-0">{log.time}</span>
                      <span className="text-[#c084fc] font-semibold shrink-0">[{log.sat}]</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded border shrink-0 ${badgeColor}`}>
                        {log.type}
                      </span>
                      <span className="text-[#94a3b8] shrink-0 font-semibold">{log.sys}:</span>
                      <span className="text-white/90 truncate">{log.msg}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
