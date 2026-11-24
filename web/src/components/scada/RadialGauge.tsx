'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

export interface RadialGaugeProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  colorVar?: string;
  trackColorVar?: string;
  showLabel?: boolean;
  labelClassName?: string;
  className?: string;
}

export const RadialGauge: React.FC<RadialGaugeProps> = React.memo(
  ({
    value,
    size = 54,
    strokeWidth = 4.5,
    colorVar = 'var(--aegean)',
    trackColorVar = 'rgba(255, 255, 255, 0.1)',
    showLabel = false,
    labelClassName = '',
    className = '',
  }) => {
    const pct = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const targetOffset = circumference * (1 - pct / 100);

    const ref = useRef<HTMLDivElement>(null);
    const shouldReduce = useReducedMotion();
    const isInView = useInView(ref, { once: true });

    return (
      <div
        ref={ref}
        className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
        style={{ width: size, height: size }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90 overflow-visible"
          aria-hidden="true"
        >
          {/* Background track circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={trackColorVar}
            strokeWidth={strokeWidth}
            strokeOpacity={0.4}
          />
          {/* Animated Value Arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colorVar}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: isInView ? targetOffset : circumference }}
            transition={{
              duration: shouldReduce ? 0.2 : 0.85,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              filter: `drop-shadow(0 0 6px ${colorVar})`,
            }}
          />
        </svg>

        {showLabel && (
          <span
            className={`absolute font-mono text-[11px] font-bold tracking-tight text-white ${labelClassName}`}
          >
            {Math.round(pct)}%
          </span>
        )}
      </div>
    );
  }
);

RadialGauge.displayName = 'RadialGauge';
