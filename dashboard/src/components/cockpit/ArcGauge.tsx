import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

interface ArcGaugeProps {
  value: number; // 0 to 100
  title: string;
  unit?: string;
  min?: number;
  max?: number;
  statusLabel?: string;
  color?: string;
  size?: number;
}

export const ArcGauge: React.FC<ArcGaugeProps> = ({
  value,
  title,
  unit = '%',
  min = 0,
  max = 100,
  statusLabel,
  color = 'var(--hud-accent)',
  size = 200,
}) => {
  // Spring animated needle with physical overshoot & damping
  const springValue = useSpring(value, {
    stiffness: 140,
    damping: 14,
    mass: 0.8,
  });

  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    springValue.set(value);
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return () => unsubscribe();
  }, [value, springValue]);

  // Gauge geometry: 240-degree sweep (from -120° to +120°)
  const startAngle = -120;
  const endAngle = 120;
  const totalSweep = endAngle - startAngle;

  const needleAngle = startAngle + ((Math.min(max, Math.max(min, value)) - min) / (max - min)) * totalSweep;

  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.38;

  // Generate tick marks
  const ticks = [];
  const numTicks = 25;
  for (let i = 0; i <= numTicks; i++) {
    const angleDeg = startAngle + (i / numTicks) * totalSweep;
    const angleRad = (angleDeg - 90) * (Math.PI / 180);
    const isMajor = i % 5 === 0;
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
        stroke={isMajor ? 'var(--hud-accent)' : 'var(--hud-border)'}
        strokeWidth={isMajor ? 2 : 1}
        opacity={isMajor ? 0.9 : 0.5}
      />
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center p-3 select-none">
      <div className="flex items-center justify-between w-full mb-1">
        <span className="text-[10px] font-mono tracking-[0.18em] uppercase text-hud-text-secondary">
          {title}
        </span>
        {statusLabel && (
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-[2px] bg-hud-status-badge text-hud-accent border border-hud-border">
            {statusLabel}
          </span>
        )}
      </div>

      <div className="relative" style={{ width: size, height: size * 0.85 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
          {/* Background Track Arc */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="var(--hud-border)"
            strokeWidth="3"
            strokeDasharray={`${radius * 1.8} ${radius * 10}`}
            transform={`rotate(150 ${cx} ${cy})`}
            opacity="0.4"
          />

          {/* Ticks */}
          {ticks}

          {/* Pivot Center Hub */}
          <circle cx={cx} cy={cy} r="6" fill="var(--hud-surface-elevated)" stroke="var(--hud-accent)" strokeWidth="2" />
          <circle cx={cx} cy={cy} r="2" fill="var(--hud-accent)" />

          {/* Spring-Driven Needle */}
          <motion.g
            animate={{ rotate: needleAngle }}
            transition={{ type: 'spring', stiffness: 140, damping: 14, mass: 0.8 }}
            style={{ originX: `${cx}px`, originY: `${cy}px` }}
          >
            {/* Tapered pointer */}
            <polygon
              points={`${cx - 2},${cy} ${cx},${cy - radius + 8} ${cx + 2},${cy}`}
              fill={color}
              filter="drop-shadow(0px 0px 4px var(--hud-accent))"
            />
          </motion.g>
        </svg>

        {/* Digital Odometer Value Counter */}
        <div className="absolute inset-x-0 bottom-2 flex flex-col items-center justify-center">
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-3xl font-bold tracking-tight text-hud-text-primary hud-glow">
              {displayValue}
            </span>
            <span className="text-xs font-mono text-hud-text-secondary">{unit}</span>
          </div>
          <div className="text-[9px] font-mono text-hud-text-muted tracking-wider uppercase mt-0.5">
            CALIBRATED TELEMETRY
          </div>
        </div>
      </div>
    </div>
  );
};
