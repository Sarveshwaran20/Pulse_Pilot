import React, { useEffect, useRef } from 'react';
import { PersonalState } from '../../types';

interface ECGTimelineProps {
  restingHr: number;
  stressScore: number;
  state: PersonalState;
  height?: number;
}

export const ECGTimeline: React.FC<ECGTimelineProps> = ({
  restingHr = 65,
  stressScore = 40,
  state,
  height = 90,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let step = 0;
    const points: number[] = new Array(canvas.width).fill(height / 2);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background subtle grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 15) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // ECG wave generation (P-Q-R-S-T sequence)
      const period = Math.max(30, Math.round(3600 / restingHr));
      const pos = step % period;
      let yVal = height / 2;

      // P wave (atrial depolarization)
      if (pos > 5 && pos <= 12) {
        yVal -= Math.sin(((pos - 5) / 7) * Math.PI) * 6;
      }
      // Q wave (septal deflection)
      else if (pos > 16 && pos <= 18) {
        yVal += 5;
      }
      // R peak (ventricular depolarization)
      else if (pos > 18 && pos <= 22) {
        const stressMultiplier = 1.0 + (stressScore / 100) * 0.8;
        yVal -= Math.sin(((pos - 18) / 4) * Math.PI) * (28 * stressMultiplier);
      }
      // S wave
      else if (pos > 22 && pos <= 25) {
        yVal += 8;
      }
      // T wave (ventricular repolarization)
      else if (pos > 30 && pos <= 42) {
        yVal -= Math.sin(((pos - 30) / 12) * Math.PI) * 9;
      } else {
        // baseline jitter
        yVal += (Math.random() - 0.5) * 1.2;
      }

      points.push(yVal);
      if (points.length > canvas.width) {
        points.shift();
      }

      // Draw ECG wave
      ctx.save();
      ctx.beginPath();
      for (let i = 0; i < points.length; i++) {
        if (i === 0) ctx.moveTo(i, points[i]);
        else ctx.lineTo(i, points[i]);
      }

      const color =
        state === 'DEEP_FOCUS'
          ? '#2EE6A8'
          : state === 'HIGH_STRESS'
          ? '#FF4B55'
          : state === 'COGNITIVE_FATIGUE'
          ? '#E08838'
          : '#8BAA9E';

      ctx.strokeStyle = color;
      ctx.lineWidth = 1.8;
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;
      ctx.stroke();

      // Lead cursor blip at head
      const headX = points.length - 1;
      const headY = points[headX];
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(headX, headY, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      step += 1;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [restingHr, stressScore, state, height]);

  return (
    <div className="w-full flex flex-col select-none">
      <div className="flex items-center justify-between text-[10px] font-mono text-hud-text-secondary mb-1">
        <span className="tracking-[0.16em] uppercase flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-hud-accent animate-pulse" />
          LEAD-II BIOLOGICAL CARDIAC TELEMETRY
        </span>
        <span className="text-[9px] text-hud-text-muted">60 FPS REALTIME</span>
      </div>
      <div className="w-full bg-hud-surface-elevated/40 border border-hud-border/60 rounded-[2px] overflow-hidden p-1">
        <canvas
          ref={canvasRef}
          width={600}
          height={height}
          className="w-full h-[90px] block"
        />
      </div>
    </div>
  );
};
