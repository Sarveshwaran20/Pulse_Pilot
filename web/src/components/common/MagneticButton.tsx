'use client';

import React, { useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  cursorText?: string;
}

export function MagneticButton({
  children,
  onClick,
  className = '',
  variant = 'primary',
  cursorText,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const springConfig = { damping: 15, stiffness: 220, mass: 0.1 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * 0.35;
    const deltaY = (e.clientY - centerY) * 0.35;

    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const variantStyles = {
    primary:
      'bg-hud-accent text-hud-void font-bold shadow-[0_0_20px_var(--hud-accent-glow)] hover:brightness-110',
    secondary:
      'bg-hud-surface2 border border-white/10 text-hud-inkPrimary hover:border-hud-accent',
    ghost:
      'bg-transparent text-hud-inkSecondary hover:text-hud-inkPrimary border border-transparent hover:border-white/10',
  };

  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      data-cursor={cursorText}
      className={`relative inline-flex items-center justify-center px-6 py-3.5 rounded-[2px] font-mono text-xs uppercase tracking-wider overflow-hidden transition-colors ${variantStyles[variant]} ${className}`}
    >
      {/* Roll-up duplicate text swap effect */}
      <span className="relative inline-block overflow-hidden">
        <span
          className={`block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isHovered ? '-translate-y-full' : 'translate-y-0'
          }`}
        >
          {children}
        </span>
        <span
          className={`absolute top-0 left-0 block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isHovered ? 'translate-y-0' : 'translate-y-full'
          }`}
          aria-hidden="true"
        >
          {children}
        </span>
      </span>
    </motion.button>
  );
}
