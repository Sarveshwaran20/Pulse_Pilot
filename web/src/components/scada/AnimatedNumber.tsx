'use client';

import React, { useEffect, useState } from 'react';
import { useSpring, useMotionValue } from 'framer-motion';

export interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = React.memo(
  ({ value, decimals = 0, prefix = '', suffix = '', className = '' }) => {
    const springValue = useSpring(value, {
      stiffness: 75,
      damping: 18,
      mass: 0.8,
    });
    const [displayStr, setDisplayStr] = useState<string>(() => {
      const formatted = value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
      return `${prefix}${formatted}${suffix}`;
    });

    useEffect(() => {
      springValue.set(value);
    }, [value, springValue]);

    useEffect(() => {
      return springValue.on('change', (latest) => {
        const formatted = latest.toLocaleString('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
        setDisplayStr(`${prefix}${formatted}${suffix}`);
      });
    }, [springValue, decimals, prefix, suffix]);

    return (
      <span className={`tabular-nums select-none ${className}`}>
        {displayStr}
      </span>
    );
  }
);

AnimatedNumber.displayName = 'AnimatedNumber';
