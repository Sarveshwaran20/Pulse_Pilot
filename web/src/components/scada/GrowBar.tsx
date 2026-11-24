'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface GrowBarProps {
  value: number;
  className?: string;
  colorVar?: string;
  height?: number;
}

export const GrowBar: React.FC<GrowBarProps> = React.memo(
  ({ value, className = '', colorVar, height }) => {
    const shouldReduce = useReducedMotion();
    const clamped = Math.max(0, Math.min(100, value));

    return (
      <div
        className="w-full bg-[#101721] rounded-full overflow-hidden border border-[#1E293B]"
        style={{ height: height ? `${height}px` : '6px' }}
      >
        <motion.div
          initial={shouldReduce ? false : { width: '0%' }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className={`h-full rounded-full ${className || 'bg-sky-400'}`}
          style={colorVar ? { backgroundColor: colorVar } : undefined}
        />
      </div>
    );
  }
);

GrowBar.displayName = 'GrowBar';
