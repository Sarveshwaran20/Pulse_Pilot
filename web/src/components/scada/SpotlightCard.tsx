'use client';

import React, { useCallback, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  notch?: boolean;
  attention?: boolean;
  onClick?: () => void;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = React.memo(
  ({ children, className = '', notch = true, attention = false, onClick }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const shouldReduce = useReducedMotion();
    const [isHovered, setIsHovered] = useState(false);

    const handlePointerMove = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (shouldReduce || !cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        cardRef.current.style.setProperty('--mx', `${x}px`);
        cardRef.current.style.setProperty('--my', `${y}px`);
      },
      [shouldReduce]
    );

    return (
      <div
        ref={cardRef}
        onClick={onClick}
        onPointerMove={handlePointerMove}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        className={`midnight-card ${notch ? 'stone-notch' : ''} ${
          attention ? 'card-attention' : ''
        } relative group overflow-hidden ${className}`}
      >
        {/* Subtle radial cursor spotlight highlight */}
        {!shouldReduce && (
          <div
            className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
            style={{
              background: `radial-gradient(350px circle at var(--mx, 50%) var(--my, 50%), rgba(76, 141, 246, 0.08), transparent 60%)`,
            }}
          />
        )}
        <div className="relative z-10 w-full h-full">{children}</div>
      </div>
    );
  }
);

SpotlightCard.displayName = 'SpotlightCard';
