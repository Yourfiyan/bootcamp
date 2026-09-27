import React, { useEffect, useRef } from 'react';

export default function CosmicBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      if (prefersReducedMotion) {
        drawStatic();
      }
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes for orbital mesh
    const particleCount = Math.min(50, Math.floor((width * height) / 30000));
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.6 + 0.7,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        color: Math.random() > 0.4 ? 'rgba(168, 85, 247, ' : 'rgba(59, 130, 246, ',
        alpha: Math.random() * 0.45 + 0.15,
      });
    }

    // Floating orbital satellite markers
    const satellites = [
      { x: width * 0.2, y: height * 0.3, radius: 3, angle: 0, speed: 0.007, dist: 120 },
      { x: width * 0.75, y: height * 0.4, radius: 3.2, angle: Math.PI, speed: 0.005, dist: 180 },
      { x: width * 0.5, y: height * 0.75, radius: 2.5, angle: Math.PI / 2, speed: 0.008, dist: 90 }
    ];

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();
      }
    };

    if (prefersReducedMotion) {
      drawStatic();
      return () => window.removeEventListener('resize', handleResize);
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw particle nodes and connecting mesh lines
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#a855f7';
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const lineAlpha = (1 - dist / 120) * 0.12;
            ctx.strokeStyle = `rgba(168, 85, 247, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      // Draw subtle orbital paths
      satellites.forEach(sat => {
        sat.angle += sat.speed;
        const currentX = sat.x + Math.cos(sat.angle) * sat.dist;
        const currentY = sat.y + Math.sin(sat.angle) * sat.dist;

        // Orbital ring
        ctx.beginPath();
        ctx.arc(sat.x, sat.y, sat.dist, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.05)';
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Satellite node
        ctx.beginPath();
        ctx.arc(currentX, currentY, sat.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ddb7ff';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#a855f7';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 opacity-70"
    />
  );
}
