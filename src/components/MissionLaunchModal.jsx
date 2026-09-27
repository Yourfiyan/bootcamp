import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Terminal, 
  Orbit, 
  ShieldCheck, 
  Key, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  Radio, 
  Cpu
} from 'lucide-react';
import { animate } from 'animejs';

export default function MissionLaunchModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1); // 1: Config, 2: Deploying, 3: Success
  const [missionName, setMissionName] = useState('ORION-IX-DEEP');
  const [orbitRegime, setOrbitRegime] = useState('LEO-SSO');
  const [rtosSandbox, setRtosSandbox] = useState('wasm-ebpf');
  const [groundStation, setGroundStation] = useState('gs-svl');
  const [enableQKD, setEnableQKD] = useState(true);
  const [itarCompliant, setItarCompliant] = useState(true);
  const [deployProgress, setDeployProgress] = useState(0);

  const modalContainerRef = useRef(null);

  useEffect(() => {
    if (isOpen && modalContainerRef.current) {
      animate(modalContainerRef.current, {
        scale: [0.92, 1],
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 350,
        ease: 'outQuad',
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDeploy = (e) => {
    e.preventDefault();
    setStep(2);
    setDeployProgress(15);

    const progressObj = { progress: 0 };
    animate(progressObj, {
      progress: 100,
      duration: 2200,
      ease: 'inOutQuad',
      onUpdate: () => {
        setDeployProgress(Math.floor(progressObj.progress));
      },
      onComplete: () => {
        setStep(3);
      }
    });
  };

  const handleReset = () => {
    setStep(1);
    setDeployProgress(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div 
        ref={modalContainerRef}
        className="relative w-full max-w-2xl rounded-2xl glass-deck-2 border border-[#a855f7]/40 shadow-[0_0_50px_rgba(168,85,247,0.3)] overflow-hidden"
      >
        {/* Scanline overlay */}
        <div className="absolute inset-0 scanline-overlay opacity-20 pointer-events-none"></div>

        {/* Modal Top Header */}
        <div className="relative z-10 p-5 bg-[#0F1123]/95 border-b border-[#a855f7]/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#151833] border border-[#a855f7]/40 flex items-center justify-center text-[#c084fc]">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-['Space_Grotesk'] text-base font-bold text-white tracking-wide">
                AETHERIS FLIGHT CONSOLE
              </h3>
              <p className="font-mono text-[10px] text-[#94a3b8]">
                PROVISION ORBITAL COMPUTATION NODE & TELEMETRY UPLINK
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94a3b8] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="relative z-10 p-6 sm:p-8">
          
          {step === 1 && (
            <form onSubmit={handleDeploy} className="space-y-5">
              
              {/* Field 1: Mission Designation Call-sign */}
              <div>
                <label className="block text-xs font-mono text-[#94a3b8] uppercase tracking-wider mb-1.5">
                  MISSION CALL-SIGN / SATELLITE DESIGNATION
                </label>
                <input
                  type="text"
                  required
                  value={missionName}
                  onChange={(e) => setMissionName(e.target.value)}
                  placeholder="e.g. AETHER-X-PRIME"
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0A0B1A]/80 border border-white/12 text-white font-mono text-sm placeholder:text-[#64748B] focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] focus:shadow-[0_0_12px_rgba(168,85,247,0.25)] transition-all"
                />
              </div>

              {/* Field 2 & 3: Orbit Regime & Ground Terminal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#94a3b8] uppercase tracking-wider mb-1.5">
                    ORBITAL INJECTION REGIME
                  </label>
                  <select
                    value={orbitRegime}
                    onChange={(e) => setOrbitRegime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0A0B1A]/80 border border-white/12 text-white font-mono text-xs focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] transition-all cursor-pointer"
                  >
                    <option value="LEO-SSO">Sun-Synchronous (550 km, 97.4°)</option>
                    <option value="LEO-POLAR">Polar Orbit (600 km, 88.2°)</option>
                    <option value="LEO-EQUATORIAL">Equatorial LEO (490 km, 12.0°)</option>
                    <option value="MEO-RELAY">MEO High Swarm (20,200 km, 55°)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#94a3b8] uppercase tracking-wider mb-1.5">
                    PRIMARY OPTICAL APERTURE
                  </label>
                  <select
                    value={groundStation}
                    onChange={(e) => setGroundStation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0A0B1A]/80 border border-white/12 text-white font-mono text-xs focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] transition-all cursor-pointer"
                  >
                    <option value="gs-svl">Svalbard Optical Station (Norway)</option>
                    <option value="gs-kou">Kourou Deep Laser Aperture (Fr. Guiana)</option>
                    <option value="gs-per">Dongara Terabit Terminal (Australia)</option>
                    <option value="gs-fbx">Fairbanks Dual X/Ka Terminal (Alaska)</option>
                  </select>
                </div>
              </div>

              {/* Field 4: Payload RTOS Runtime */}
              <div>
                <label className="block text-xs font-mono text-[#94a3b8] uppercase tracking-wider mb-1.5">
                  PAYLOAD ISOLATION SANDBOX RUNTIME
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    rtosSandbox === 'wasm-ebpf'
                      ? 'bg-[#151833] border-[#a855f7] shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                      : 'bg-[#0A0B1A]/60 border-white/10'
                  }`}>
                    <input 
                      type="radio" 
                      name="rtos" 
                      value="wasm-ebpf" 
                      checked={rtosSandbox === 'wasm-ebpf'} 
                      onChange={() => setRtosSandbox('wasm-ebpf')}
                      className="accent-[#a855f7]"
                    />
                    <div className="font-mono text-xs">
                      <div className="text-white font-semibold">Wasm / eBPF Sandbox</div>
                      <div className="text-[#94a3b8] text-[10px]">Zero flight controller contamination</div>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    rtosSandbox === 'posix-rtos'
                      ? 'bg-[#151833] border-[#a855f7] shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                      : 'bg-[#0A0B1A]/60 border-white/10'
                  }`}>
                    <input 
                      type="radio" 
                      name="rtos" 
                      value="posix-rtos" 
                      checked={rtosSandbox === 'posix-rtos'} 
                      onChange={() => setRtosSandbox('posix-rtos')}
                      className="accent-[#a855f7]"
                    />
                    <div className="font-mono text-xs">
                      <div className="text-white font-semibold">POSIX RTOS Native</div>
                      <div className="text-[#94a3b8] text-[10px]">Raw hardware tensor core access</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Checkboxes matching DESIGN.md */}
              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={enableQKD}
                    onChange={(e) => setEnableQKD(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#0A0B1A] border-white/20 text-[#a855f7] focus:ring-[#a855f7] accent-[#a855f7] cursor-pointer"
                  />
                  <span className="font-mono text-xs text-[#e2e0f7] group-hover:text-white">
                    Synchronize Post-Quantum Kyber-1024 encryption keys
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={itarCompliant}
                    onChange={(e) => setItarCompliant(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#0A0B1A] border-white/20 text-[#a855f7] focus:ring-[#a855f7] accent-[#a855f7] cursor-pointer"
                  />
                  <span className="font-mono text-xs text-[#e2e0f7] group-hover:text-white">
                    Enforce ITAR & NASA-STD-8739 spaceflight compliance validation
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#a855f7]/20">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-lg btn-secondary-glass text-xs font-mono text-[#94a3b8] hover:text-white cursor-pointer"
                >
                  ABORT
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg btn-primary-action text-xs font-mono font-bold flex items-center gap-2 cursor-pointer font-['Space_Grotesk']"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>INITIALIZE MISSION UPLINK</span>
                </button>
              </div>

            </form>
          )}

          {step === 2 && (
            <div className="py-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-[#151833] border border-[#a855f7]/50 mx-auto flex items-center justify-center text-[#c084fc] shadow-[0_0_30px_rgba(168,85,247,0.4)] animate-pulse">
                <Orbit className="w-8 h-8 animate-spin-slow" />
              </div>

              <div>
                <h4 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                  Provisioning Node: {missionName}
                </h4>
                <p className="font-mono text-xs text-[#94a3b8] mt-1">
                  Negotiating optical crosslinks with Svalbard Gateway...
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#0A0B1A] rounded-full h-3 border border-[#a855f7]/30 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#a855f7] to-[#3b82f6] shadow-[0_0_12px_#a855f7]"
                  style={{ width: `${deployProgress}%` }}
                ></div>
              </div>

              <div className="font-mono text-xs text-emerald-400">
                STATUS: {deployProgress}% COMPLETED
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="py-6 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-400 mx-auto flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.3)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
                  Mission Successfully Initialized!
                </h4>
                <p className="font-mono text-xs text-[#94a3b8] mt-1.5 max-w-md mx-auto">
                  Node <span className="text-[#c084fc] font-bold">[{missionName}]</span> is now provisioned in {orbitRegime} and transmitting telemetry on 1550nm coherent laser frequency.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0A0B1A] border border-[#a855f7]/30 text-left font-mono text-xs space-y-1.5">
                <div className="text-[#a855f7] font-bold">EPHEMERIS HANDSHAKE:</div>
                <div className="text-white">NODE ID: AETH-NODE-99042-X</div>
                <div className="text-white">TELEMETRY CARRIER: 1550nm OPTICAL LINK</div>
                <div className="text-emerald-400">ENCRYPTION: KYBER-1024 QUANTUM-LOCKED</div>
              </div>

              <button
                onClick={handleReset}
                className="btn-primary-action px-6 py-2.5 rounded-lg text-xs font-mono font-bold cursor-pointer font-['Space_Grotesk']"
              >
                RETURN TO MISSION CONTROL DECK
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
