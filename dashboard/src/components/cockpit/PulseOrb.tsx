import React, { useEffect, useRef } from 'react';
import { PersonalState } from '../../types';

interface PulseOrbProps {
  restingHr: number;
  stressScore: number;
  state: PersonalState;
  size?: number;
}

export const PulseOrb: React.FC<PulseOrbProps> = ({
  restingHr = 65,
  stressScore = 40,
  state,
  size = 280,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;

    // Palette lookup based on state
    const getColor = () => {
      switch (state) {
        case 'DEEP_FOCUS':
          return { main: '#2EE6A8', glow: 'rgba(46, 230, 168, 0.4)', core: '#00FFC2' };
        case 'COGNITIVE_FATIGUE':
          return { main: '#E08838', glow: 'rgba(224, 136, 56, 0.35)', core: '#FFA04D' };
        case 'HIGH_STRESS':
          return { main: '#FF4B55', glow: 'rgba(255, 75, 85, 0.45)', core: '#FF2A38' };
        case 'NEUTRAL':
        default:
          return { main: '#8BAA9E', glow: 'rgba(139, 170, 158, 0.3)', core: '#B8C5BD' };
      }
    };

    const render = () => {
      const { main, glow, core } = getColor();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const baseRadius = size * 0.28;

      // Heartbeat frequency in Hz (60 bpm = 1.0Hz)
      const hrFreq = (restingHr / 60) * 0.045;
      const heartBeat = Math.sin(t * hrFreq);
      const pulseScale = 1 + heartBeat * 0.08;

      // Turbulence based on stress (0 to 100)
      const turbulence = 1.5 + (stressScore / 100) * 7.5;

      // 1. Core ambient glow
      const radialGradient = ctx.createRadialGradient(cx, cy, 5, cx, cy, baseRadius * 1.6);
      radialGradient.addColorStop(0, core);
      radialGradient.addColorStop(0.35, glow);
      radialGradient.addColorStop(1, 'transparent');

      ctx.fillStyle = radialGradient;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // 2. Layered noise-displaced biological ring
      const numPoints = 120;
      ctx.save();
      ctx.beginPath();

      for (let i = 0; i <= numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        // Pseudo-harmonic noise displacement
        const n1 = Math.sin(angle * 4 + t * 0.03);
        const n2 = Math.cos(angle * 7 - t * 0.05);
        const n3 = Math.sin(angle * 12 + t * 0.08);
        const displacement = (n1 * 0.5 + n2 * 0.3 + n3 * 0.2) * turbulence;

        const r = (baseRadius + displacement) * pulseScale;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.strokeStyle = main;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = main;
      ctx.shadowBlur = 14;
      ctx.stroke();

      // Inner biological mesh ring
      ctx.beginPath();
      for (let i = 0; i <= numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        const n = Math.sin(angle * 5 - t * 0.02) * (turbulence * 0.6);
        const r = (baseRadius * 0.72 + n) * (1 + heartBeat * 0.05);
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = glow;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();

      // 3. Periodic concentric cardiac wavefront emission
      const wavePhase = (t * (restingHr / 60) * 0.02) % 1;
      const waveRadius = baseRadius + wavePhase * (size * 0.42);
      const waveAlpha = Math.max(0, 1 - wavePhase);

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, waveRadius, 0, Math.PI * 2);
      ctx.strokeStyle = main;
      ctx.globalAlpha = waveAlpha * 0.5;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      t += 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [restingHr, stressScore, state, size]);

  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: size, height: size }}>
      <canvas
        ref={canvasRef}
        width={size * 2}
        height={size * 2}
        className="w-full h-full"
      />
      {/* Central Heartbeat Odometer & Micro Ticker */}
      <div className="absolute flex flex-col items-center pointer-events-none text-center">
        <span className="text-[10px] tracking-[0.2em] uppercase text-hud-text-secondary opacity-80 font-mono">
          RHR TEMPO
        </span>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="font-mono text-3xl font-bold tracking-tight text-hud-text-primary hud-glow">
            {restingHr}
          </span>
          <span className="text-xs text-hud-accent font-semibold">BPM</span>
        </div>
        <span className="text-[9px] font-mono tracking-widest text-hud-text-muted mt-0.5">
          STRESS FLUX: {stressScore}%
        </span>
      </div>
    </div>
  );
};
