'use client';

import React, { useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { STATE_THEMES } from '@/lib/tokens';

export function PulseOrb3D({
  className = '',
  scale = 1.0,
}: {
  className?: string;
  scale?: number;
}) {
  const { biometrics } = useAppStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Heart rate drives breathing frequency (e.g. 60-80 bpm)
      const bpm = biometrics.restingHr || 65;
      const breathingFreq = (bpm / 60) * 2.0;
      const stressTurbulence = (biometrics.stressScore || 30) / 100;

      // Color mapping by state
      let primaryColor = '56, 189, 248'; // Aegean Cyan
      let glowColor = 'rgba(56, 189, 248, 0.25)';

      if (biometrics.state === 'DEEP_FOCUS') {
        primaryColor = '16, 185, 129'; // Emerald
        glowColor = 'rgba(16, 185, 129, 0.35)';
      } else if (biometrics.state === 'COGNITIVE_FATIGUE') {
        primaryColor = '245, 158, 11'; // Warm Amber
        glowColor = 'rgba(245, 158, 11, 0.35)';
      } else if (biometrics.state === 'HIGH_STRESS') {
        primaryColor = '239, 68, 68'; // Coral Red
        glowColor = 'rgba(239, 68, 68, 0.45)';
      }

      // Outer Volumetric Ambient Glow
      const ambientGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        15,
        centerX,
        centerY,
        110 * scale
      );
      ambientGrad.addColorStop(0, glowColor);
      ambientGrad.addColorStop(0.5, `rgba(${primaryColor}, 0.08)`);
      ambientGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = ambientGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 115 * scale, 0, Math.PI * 2);
      ctx.fill();

      // Layered Noise-Displaced Biological Rings
      const numLayers = 3;
      for (let layer = 0; layer < numLayers; layer++) {
        const baseRadius = (55 + layer * 14) * scale;
        const breath = Math.sin(t * breathingFreq + layer * 0.8) * 8 * scale;
        const radius = baseRadius + breath;

        ctx.beginPath();
        const numSegments = 60;
        for (let i = 0; i <= numSegments; i++) {
          const angle = (i / numSegments) * Math.PI * 2;
          
          // Multi-frequency harmonic noise displacement
          const noise1 = Math.sin(angle * 4 + t * 2.5 + layer) * (4 + stressTurbulence * 12);
          const noise2 = Math.cos(angle * 7 - t * 3.2) * (2 + stressTurbulence * 8);
          const r = radius + noise1 + noise2;

          const x = centerX + Math.cos(angle) * r;
          const y = centerY + Math.sin(angle) * r;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();

        ctx.strokeStyle = `rgba(${primaryColor}, ${0.75 - layer * 0.22})`;
        ctx.lineWidth = layer === 0 ? 2.5 : 1.5;
        ctx.stroke();

        if (layer === 0) {
          ctx.fillStyle = `rgba(${primaryColor}, 0.12)`;
          ctx.fill();
        }
      }

      // Center High-Density Nucleus
      const nucleusBreath = Math.sin(t * breathingFreq * 1.5) * 4;
      const nucleusRadius = Math.max(12, (20 + nucleusBreath) * scale);
      const nucleusGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        2,
        centerX,
        centerY,
        nucleusRadius
      );
      nucleusGrad.addColorStop(0, '#FFFFFF');
      nucleusGrad.addColorStop(0.3, `rgba(${primaryColor}, 0.9)`);
      nucleusGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = nucleusGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, nucleusRadius, 0, Math.PI * 2);
      ctx.fill();

      // Orbiting Biological Telemetry Nodes
      const numNodes = 4;
      for (let n = 0; n < numNodes; n++) {
        const nodeAngle = t * 0.9 + (n * Math.PI * 2) / numNodes;
        const nodeDist = (90 + Math.sin(t * 1.8 + n) * 8) * scale;
        const nx = centerX + Math.cos(nodeAngle) * nodeDist;
        const ny = centerY + Math.sin(nodeAngle) * nodeDist;

        ctx.fillStyle = `rgba(${primaryColor}, 0.85)`;
        ctx.beginPath();
        ctx.arc(nx, ny, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      t += 0.024;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [biometrics.restingHr, biometrics.stressScore, biometrics.state, scale]);

  return (
    <div
      className={`relative flex items-center justify-center select-none w-full h-full ${className}`}
    >
      <canvas
        ref={canvasRef}
        width={360}
        height={360}
        className="w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] object-contain drop-shadow-[0_0_24px_rgba(56,189,248,0.25)]"
      />
    </div>
  );
}
