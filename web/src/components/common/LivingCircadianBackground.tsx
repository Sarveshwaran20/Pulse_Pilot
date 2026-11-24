'use client';

import React, { useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';

export function LivingCircadianBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { biometrics } = useAppStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
    }));

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let time = 0;

    const render = () => {
      time += 0.007;

      // Smooth mouse follow
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Determine palette based on active personal state
      const state = biometrics.state;
      let primaryColor = { r: 56, g: 189, b: 248 }; // Cyan/Deep Focus default
      let secondaryColor = { r: 99, g: 102, b: 241 }; // Indigo

      if (state === 'COGNITIVE_FATIGUE') {
        primaryColor = { r: 245, g: 158, b: 11 }; // Amber
        secondaryColor = { r: 217, g: 119, b: 6 }; // Warm Ochre
      } else if (state === 'HIGH_STRESS') {
        primaryColor = { r: 244, g: 63, b: 94 }; // Rose/Crimson
        secondaryColor = { r: 168, g: 85, b: 247 }; // Purple
      } else if (state === 'DEEP_FOCUS') {
        primaryColor = { r: 16, g: 185, b: 129 }; // Emerald
        secondaryColor = { r: 56, g: 189, b: 248 }; // Cyan
      }

      // Base clear with subtle vignette
      ctx.clearRect(0, 0, width, height);

      // Deep radial glow behind center / cursor
      const bgGrad = ctx.createRadialGradient(
        mouseX,
        mouseY,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.85
      );
      bgGrad.addColorStop(
        0,
        `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, 0.05)`
      );
      bgGrad.addColorStop(
        0.5,
        `rgba(${secondaryColor.r}, ${secondaryColor.g}, ${secondaryColor.b}, 0.02)`
      );
      bgGrad.addColorStop(1, 'rgba(6, 10, 16, 0.95)');

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Living Circadian Wave Ribbons
      const waveCount = 3;
      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        const baseOffset = height * (0.35 + w * 0.2);
        const waveSpeed = time * (0.8 + w * 0.3);

        ctx.moveTo(0, height);
        ctx.lineTo(0, baseOffset);

        for (let x = 0; x <= width; x += 15) {
          const sine1 = Math.sin(x * 0.003 + waveSpeed) * 35;
          const sine2 = Math.cos(x * 0.0015 - waveSpeed * 0.7) * 20;
          const mouseInfluence =
            Math.exp(-Math.pow((x - mouseX) / (width * 0.4), 2)) * 25;
          const y = baseOffset + sine1 + sine2 - mouseInfluence;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        const waveGrad = ctx.createLinearGradient(0, baseOffset - 60, width, height);
        const alpha = 0.015 + w * 0.012;
        waveGrad.addColorStop(
          0,
          `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, ${alpha})`
        );
        waveGrad.addColorStop(
          1,
          `rgba(${secondaryColor.r}, ${secondaryColor.g}, ${secondaryColor.b}, 0.005)`
        );

        ctx.fillStyle = waveGrad;
        ctx.fill();
      }

      // Floating bio-telemetry particle field
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
        ctx.fillStyle = `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, ${p.alpha})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [biometrics.state]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-10 w-full h-full"
    />
  );
}
