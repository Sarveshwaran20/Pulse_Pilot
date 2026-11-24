'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const { setPreloaderFinished } = useAppStore();

  useEffect(() => {
    const duration = 1200; // ms
    const start = performance.now();

    const frame = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setCount(Math.floor(progress * 100));

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        setTimeout(() => {
          setPreloaderFinished(true);
          onComplete();
        }, 300);
      }
    };

    const animId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animId);
  }, [onComplete, setPreloaderFinished]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-50 bg-hud-void flex flex-col items-center justify-center font-mono select-none"
    >
      {/* Central Igniting Point */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 2, 1], opacity: [0, 1, 0.9] }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="w-16 h-16 rounded-full bg-hud-accent shadow-[0_0_60px_var(--hud-accent)] mb-8"
      />

      <div className="flex flex-col items-center">
        <span className="text-4xl font-mono font-bold tracking-tight text-hud-inkPrimary tabular-nums">
          {count}
          <span className="text-lg text-hud-accent ml-0.5">%</span>
        </span>
        <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-hud-inkMuted mt-2">
          CALIBRATING AUTONOMIC TELEMETRY
        </span>
      </div>
    </motion.div>
  );
}
