'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export function CustomCursor() {
  const [hasPointer, setHasPointer] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 400, mass: 0.3 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }
    setHasPointer(true);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      const target = (e.target as HTMLElement)?.closest('[data-cursor]');
      if (target) {
        setIsHovered(true);
        setCursorText(target.getAttribute('data-cursor') || '');
      } else {
        const isInteractive = (e.target as HTMLElement)?.closest('button, a, input, [role="button"]');
        setIsHovered(!!isInteractive);
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  if (!hasPointer) return null;

  return (
    <>
      {/* Central Sharp Dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-hud-accent rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      {/* Outer Lagging Ring / Magnetic Label Pill */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] flex items-center justify-center rounded-full border border-hud-accent/60 bg-hud-accent/5 backdrop-blur-[1px]"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: cursorText ? 84 : isHovered ? 48 : 28,
          height: cursorText ? 30 : isHovered ? 48 : 28,
          borderRadius: cursorText ? 15 : 9999,
          borderColor: isHovered ? 'var(--hud-accent)' : 'rgba(255, 255, 255, 0.25)',
        }}
        transition={{ type: 'spring', damping: 22, stiffness: 350 }}
      >
        {cursorText && (
          <span className="text-[9px] font-mono font-bold tracking-widest text-hud-inkPrimary uppercase px-2">
            {cursorText}
          </span>
        )}
      </motion.div>
    </>
  );
}
