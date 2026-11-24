'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

interface PrecisionGaugeProps {
  value: number; // 0 to 100
  title: string;
  statusLabel?: string;
  unit?: string;
  color?: string;
  size?: number;
}

export function PrecisionGauge({
  value,
  title,
  statusLabel,
  unit = '%',
  color = 'var(--hud-accent)',
  size = 210,
}: PrecisionGaugeProps) {
  // Correct directional sweep: 150° to 390° (240° clockwise sweep)
  const startAngle = 150;
  const sweepAngle = 240;
  const clampedValue = Math.min(100, Math.max(0, value));
  const targetRotation = startAngle + (clampedValue / 100) * sweepAngle;

  const springRotation = useSpring(targetRotation, {
    stiffness: 140,
    damping: 14,
    mass: 0.7,
  });

  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    springRotation.set(targetRotation);
  }, [targetRotation, springRotation]);

  useEffect(() => {
    setDisplayValue(Math.round(clampedValue));
  }, [clampedValue]);

  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.38;

  // Major and minor tick marks projected outward
  const ticks = [];
  const numTicks = 24;
  for (let i = 0; i <= numTicks; i++) {
    const angleDeg = startAngle + (i / numTicks) * sweepAngle;
    const angleRad = (angleDeg * Math.PI) / 180;
    const isMajor = i % 4 === 0;
    const tickLen = isMajor ? 10 : 5;

    const x1 = cx + Math.cos(angleRad) * radius;
    const y1 = cy + Math.sin(angleRad) * radius;
    const x2 = cx + Math.cos(angleRad) * (radius - tickLen);
    const y2 = cy + Math.sin(angleRad) * (radius - tickLen);

    ticks.push(
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={isMajor ? 'var(--hud-accent)' : 'rgba(255,255,255,0.2)'}
        strokeWidth={isMajor ? 2 : 1}
      />
    );
  }

  return (
    <div className="hairline-card p-4 flex flex-col items-center justify-between bg-hud-surface1 select-none">
      <div className="w-full flex items-center justify-between font-mono text-[11px] mb-2">
        <span className="text-hud-inkSecondary tracking-wider uppercase">{title}</span>
        {statusLabel && (
          <span className="px-1.5 py-0.5 rounded-[1px] bg-hud-surface2 text-hud-accent border border-hud-accent/30 text-[9px] font-bold">
            {statusLabel}
          </span>
        )}
      </div>

      <div className="relative" style={{ width: size, height: size * 0.82 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Calibrated Ticks */}
          {ticks}

          {/* Needle Pivot Hub */}
          <circle cx={cx} cy={cy} r={6} fill="var(--hud-surface2)" stroke={color} strokeWidth={2} />
          <circle cx={cx} cy={cy} r={2} fill={color} />

          {/* Mechanical Needle Pointer */}
          <motion.g
            animate={{ rotate: targetRotation }}
            transition={{ type: 'spring', stiffness: 140, damping: 14, mass: 0.7 }}
            style={{ originX: `${cx}px`, originY: `${cy}px` }}
          >
            <polygon
              points={`${cx - 2},${cy} ${cx},${cy - radius + 10} ${cx + 2},${cy}`}
              fill={color}
              filter="drop-shadow(0px 0px 6px var(--hud-accent))"
            />
          </motion.g>
        </svg>

        {/* Tabular Odometer Readout (No Collision) */}
        <div className="absolute inset-x-0 bottom-1 flex flex-col items-center justify-center font-mono">
          <div className="text-3xl font-bold tracking-tight text-hud-inkPrimary tabular-nums">
            {displayValue}
            <span className="text-xs text-hud-accent ml-0.5">{unit}</span>
          </div>
          <span className="text-[9px] text-hud-inkMuted tracking-widest uppercase mt-0.5">
            CALIBRATED PRECISION
          </span>
        </div>
      </div>
    </div>
  );
}
