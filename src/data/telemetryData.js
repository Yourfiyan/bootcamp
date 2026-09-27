export const SATELLITE_FLEET = [
  {
    id: "aether-1",
    name: "AETHER-1 Polaris",
    designation: "LEO-OBS-0941",
    orbitType: "Sun-Synchronous Orbit (SSO)",
    altitude: 542.8, // km
    velocity: 7.61, // km/s
    inclination: 97.4, // deg
    battery: 98.4, // %
    thermal: 21.2, // °C
    propellant: 84.1, // %
    downlinkRate: "24.8 Gbps",
    status: "Nominal",
    burnStatus: "Standby",
    nextPass: "00:14:22",
    coordinates: { lat: 48.8566, lng: 2.3522, alt: 542.8 },
    payloadStatus: "Quantum Lidar Sensing Active"
  },
  {
    id: "aether-2",
    name: "AETHER-2 Helios",
    designation: "LEO-CMP-1102",
    orbitType: "Polar LEO",
    altitude: 580.4,
    velocity: 7.58,
    inclination: 88.2,
    battery: 94.6,
    thermal: 23.8,
    propellant: 76.5,
    downlinkRate: "32.4 Gbps",
    status: "Nominal",
    burnStatus: "Burn Active",
    nextPass: "00:08:45",
    coordinates: { lat: -23.5505, lng: -46.6333, alt: 580.4 },
    payloadStatus: "PFLOPS Neural Matrix Edge Inference"
  },
  {
    id: "vortex-7",
    name: "VORTEX-7 Recon",
    designation: "LEO-SAR-4490",
    orbitType: "Equatorial Orbit",
    altitude: 495.1,
    velocity: 7.64,
    inclination: 12.1,
    battery: 89.2,
    thermal: 18.5,
    propellant: 62.0,
    downlinkRate: "48.0 Gbps",
    status: "Nominal",
    burnStatus: "Standby",
    nextPass: "00:29:10",
    coordinates: { lat: 1.3521, lng: 103.8198, alt: 495.1 },
    payloadStatus: "Synthetic Aperture Radar Sweep"
  },
  {
    id: "cygnus-9",
    name: "CYGNUS Deep Horizon",
    designation: "MEO-RELAY-008",
    orbitType: "Medium Earth Orbit (MEO)",
    altitude: 20180.0,
    velocity: 3.87,
    inclination: 55.0,
    battery: 99.8,
    thermal: 14.1,
    propellant: 91.4,
    downlinkRate: "120.0 Gbps",
    status: "Nominal",
    burnStatus: "Standby",
    nextPass: "02:11:04",
    coordinates: { lat: 37.7749, lng: -122.4194, alt: 20180.0 },
    payloadStatus: "Inter-Constellation Optical Mesh Router"
  }
];

export const GROUND_STATIONS = [
  {
    id: "gs-svl",
    name: "Svalbard Satellite Station",
    location: "Spitsbergen, Norway",
    lat: 78.2298,
    lng: 15.4078,
    frequency: "Ka/Optical 1550nm",
    throughput: "84.2 Gbps",
    elevationAngle: "14.2°",
    ping: "4.1 ms",
    status: "Online",
    activeTracks: 4
  },
  {
    id: "gs-fbx",
    name: "Fairbanks Ground Complex",
    location: "Alaska, USA",
    lat: 64.8378,
    lng: -147.7164,
    frequency: "X/Ka-band Dual",
    throughput: "56.8 Gbps",
    elevationAngle: "28.6°",
    ping: "5.8 ms",
    status: "Online",
    activeTracks: 3
  },
  {
    id: "gs-kou",
    name: "Kourou Deep Relay",
    location: "French Guiana",
    lat: 5.2514,
    lng: -52.8099,
    frequency: "Optical Laser Crosslink",
    throughput: "120.0 Gbps",
    elevationAngle: "64.0°",
    ping: "3.9 ms",
    status: "Online",
    activeTracks: 6
  },
  {
    id: "gs-hrt",
    name: "Hartebeesthoek Station",
    location: "Gauteng, South Africa",
    lat: -25.8872,
    lng: 27.7072,
    frequency: "Ka-band Optical",
    throughput: "68.4 Gbps",
    elevationAngle: "41.5°",
    ping: "6.2 ms",
    status: "Online",
    activeTracks: 2
  },
  {
    id: "gs-per",
    name: "Dongara Optical Terminal",
    location: "Western Australia",
    lat: -29.2553,
    lng: 114.9317,
    frequency: "Terabit Laser Ground Link",
    throughput: "144.0 Gbps",
    elevationAngle: "52.1°",
    ping: "4.4 ms",
    status: "Online",
    activeTracks: 5
  }
];

export const COMPUTING_CAPABILITIES = [
  {
    icon: "Cpu",
    tag: "EDGE-LEO",
    title: "Deterministic LEO Edge Computing",
    description: "Execute containerized microservices and zero-latency computer vision payloads directly in orbit on rad-hardened tensor cores.",
    specs: ["Sub-5ms Inference Latency", "14.8 PFLOPS Constellation Swarm", "Automated Load Balancing"]
  },
  {
    icon: "Radio",
    tag: "INTER-SAT",
    title: "Autonomous Optical Mesh Routing",
    description: "Dynamic laser crosslinks create a high-resilience topological mesh, routing exabytes across orbital planes without terrestrial relay.",
    specs: ["100 Gbps Laser Inter-Satellite Links", "Self-Healing Dynamic Graphs", "< 1e-12 Bit Error Rate"]
  },
  {
    icon: "ShieldAlert",
    tag: "COLLISION-AVOID",
    title: "Autonomous Orbital Deconfliction",
    description: "Real-time covariance analysis and electric propulsion vectoring neutralize orbital debris threats 18 minutes prior to closest approach.",
    specs: ["Deterministic Trajectory Covariance", "Electric Hall Thruster Auto-Fires", "Zero Ground Intervention"]
  },
  {
    icon: "Lock",
    tag: "CRYPTO-ZERO",
    title: "Post-Quantum Space Zero-Trust",
    description: "Kyber-1024 encryption keys synchronized via orbital quantum key distribution (QKD) shield telemetry uplinks against nation-state threat vectors.",
    specs: ["NIST PQC Approved Standards", "Hardware Security Module (HSM) Level 4", "Immutable Ephemeris Ledger"]
  },
  {
    icon: "Layers",
    tag: "PAYLOAD-VIRT",
    title: "Payload Hypervisor & Space OS",
    description: "Isolate customer telemetry and scientific payload workloads across multi-tenant hardware with hard memory isolation guarantees.",
    specs: ["POSIX Compliant RTOS", "Wasm/eBPF Safe Sandbox", "Zero Flight Control Contamination"]
  },
  {
    icon: "Satellite",
    tag: "OPTICAL-DL",
    title: "Terabit Optical Downlink Grids",
    description: "Adaptive optics steer narrow-beam lasers through atmospheric turbulence into global direct-to-cloud optical receiving terminals.",
    specs: ["200 Gbps Per Ground Aperture", "Atmospheric Scintillation AI Filter", "Direct AWS/GCP Ingest"]
  }
];

export const PRICING_TIERS = [
  {
    name: "Sub-Orbital Pathfinder",
    tag: "RESEARCH & PROTOTYPING",
    priceMonthly: "$4,500",
    priceAnnual: "$3,800",
    description: "For aerospace research teams and cube-sat developers launching pilot payloads and validating algorithms.",
    popular: false,
    features: [
      "Up to 2 Concurrent Satellites",
      "50 GB/day Optical Downlink Bandwidth",
      "Standard Telemetry Frequency (1 Hz)",
      "Automated Collision Alert Notifications",
      "Access to 3 Global Ground Stations",
      "Standard Rest APIs & Webhooks",
      "Community SLA (99.8%)"
    ],
    cta: "Deploy Pathfinder"
  },
  {
    name: "Constellation Tier",
    tag: "COMMERCIAL FLEET ORCHESTRATION",
    priceMonthly: "$18,500",
    priceAnnual: "$15,200",
    description: "Production-scale orchestration for commercial constellations requiring continuous edge compute and laser mesh routing.",
    popular: true,
    features: [
      "Up to 36 Satellites in Mesh Constellation",
      "1.2 TB/day Multi-Ground Optical Downlink",
      "Real-time Telemetry Streaming (100 Hz)",
      "Autonomous Auto-Avoidance Thrust Maneuvers",
      "Full Access to All 5 Global Optical Stations",
      "LEO Tensor Edge Compute Sandbox",
      "24/7 Flight Operations SLA (99.99%)"
    ],
    cta: "Launch Constellation Deck"
  },
  {
    name: "Deep Space Enterprise",
    tag: "DEFENSE & SOVEREIGN SPACE",
    priceMonthly: "Custom",
    priceAnnual: "Custom",
    description: "Dedicated orbital infrastructure for defense contractors, sovereign space commands, and mega-constellations.",
    popular: false,
    features: [
      "Unlimited Constellation Nodes & Relay Assets",
      "Unmetered Dedicated Optical Spectrum",
      "Post-Quantum Zero-Trust Key Synchronization",
      "Air-Gapped Sovereign Ground Station Relays",
      "Custom Rad-Tolerant RTOS Image Builds",
      "Dedicated Mission Flight Director On-Call",
      "Deterministic Zero-Fault SLA (99.999%)"
    ],
    cta: "Engage Flight Director"
  }
];
