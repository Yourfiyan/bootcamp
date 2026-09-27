import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsBanner from './components/StatsBanner';
import MissionTelemetryDisplay from './components/MissionTelemetryDisplay';
import OrbitalComputeFeatures from './components/OrbitalComputeFeatures';
import MissionSimulator from './components/MissionSimulator';
import ConstellationMap from './components/ConstellationMap';
import FlightTiers from './components/FlightTiers';
import PreFooterBanner from './components/PreFooterBanner';
import Footer from './components/Footer';
import MissionLaunchModal from './components/MissionLaunchModal';
import CosmicBackground from './components/CosmicBackground';
import CustomCursor from './components/CustomCursor';
import { initSmoothScroll, setupScrollVelocityResponse } from './utils/motion';

export default function App() {
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false);

  useEffect(() => {
    // Initialize Lenis smooth scroll synchronized with GSAP ScrollTrigger (Step 3)
    const { lenis, destroy } = initSmoothScroll();

    // Subtle scroll velocity responsiveness (Step 14)
    const cleanupVelocity = setupScrollVelocityResponse(lenis, '.velocity-reactive');

    return () => {
      if (cleanupVelocity) cleanupVelocity();
      if (destroy) destroy();
    };
  }, []);

  const scrollToTelemetry = () => {
    const el = document.getElementById('telemetry');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B1A] text-[#e2e0f7] selection:bg-[#a855f7]/30 selection:text-white relative overflow-x-hidden">
      
      {/* Precision Custom Cursor for Desktop (Step 11) */}
      <CustomCursor />

      {/* Animated Cosmic Canvas Particle Grid (Step 7 Ambient Layer) */}
      <CosmicBackground />

      {/* Navigation Header with Directional Scroll Awareness (Step 12) */}
      <Navbar onOpenLaunchModal={() => setIsLaunchModalOpen(true)} />

      {/* Main Content Sections with Awwwards Motion Architecture */}
      <main className="relative z-10">
        {/* 1. Hero Section with Masked Kinetic Headline, Ambient Parallax & Magnetic CTA (Steps 4, 7, 8, 10, 13) */}
        <Hero 
          onOpenLaunchModal={() => setIsLaunchModalOpen(true)} 
          onScrollToTelemetry={scrollToTelemetry}
        />

        {/* 2. Live Architecture & Stats Banner with Viewport 3D Tilt & Count Interpolation (Steps 5, 8) */}
        <StatsBanner />

        {/* 3. Live Mission Telemetry Display (Domain-Specific Interface with Radar & Scanlines) */}
        <MissionTelemetryDisplay />

        {/* 4. Three-Column Feature Grid with Specular Cursor Tracking & 3D Cards (Steps 4, 10) */}
        <OrbitalComputeFeatures />

        {/* 5. Real-time Orbital Vector & Delta-V Flight Simulator with 3D Viewport Tilt (Steps 4, 5, 10) */}
        <MissionSimulator onOpenLaunchModal={() => setIsLaunchModalOpen(true)} />

        {/* 6. Global Ground Optical Apertures with Radar Monochrome Transition (Steps 6, 9) */}
        <ConstellationMap />

        {/* 7. Glassmorphism Scale-Up Pricing Table with Viewport Depth (Steps 5, 10) */}
        <FlightTiers onOpenLaunchModal={() => setIsLaunchModalOpen(true)} />

        {/* 8. Flight-Ready Deployment Pre-Footer Banner with Aurora Glow Parallax (Steps 4, 7, 10) */}
        <PreFooterBanner onOpenLaunchModal={() => setIsLaunchModalOpen(true)} />
      </main>

      {/* Footer with Top Telemetry Strip & Compliance Badges */}
      <Footer onOpenLaunchModal={() => setIsLaunchModalOpen(true)} />

      {/* Interactive Launch Mission Modal Dialog */}
      <MissionLaunchModal 
        isOpen={isLaunchModalOpen} 
        onClose={() => setIsLaunchModalOpen(false)} 
      />

    </div>
  );
}
