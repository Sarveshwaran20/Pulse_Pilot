'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Play, Shield, Activity } from 'lucide-react';
import { PulseOrbDynamic } from '@/components/orb/PulseOrbDynamic';
import { MagneticButton } from '@/components/common/MagneticButton';
import { useAppStore } from '@/lib/store';

export function SceneHero() {
  const { biometrics } = useAppStore();

  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-28 pb-12 px-6 max-w-7xl mx-auto overflow-hidden">
      {/* Top Telemetry Coordinates */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex items-center justify-between border-b border-white/10 pb-3 font-mono text-[11px] text-hud-inkMuted uppercase tracking-widest"
      >
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-hud-accent animate-pulse" />
          AUTONOMIC POSTURE: {biometrics.state}
        </span>
        <span className="hidden sm:inline">LOCAL ENCLAVE • ZERO NETWORK EGRESS</span>
        <span>LATENCY: 0.4MS (127.0.0.1)</span>
      </motion.div>

      {/* Center 3D Organism with Giant Editorial Headlines */}
      <div className="relative my-auto flex flex-col items-center justify-center text-center py-10">
        {/* Volumetric Pulse Orb */}
        <div className="w-[320px] h-[320px] sm:w-[440px] sm:h-[440px] mx-auto mb-6">
          <PulseOrbDynamic scale={1.2} />
        </div>

        {/* Masked Rising Headline */}
        <div className="overflow-hidden mb-4">
          <motion.h1
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="font-serif text-[clamp(2.75rem,8.5vw,7.5rem)] leading-[0.95] tracking-tight font-bold text-hud-inkPrimary"
          >
            Your body has a signal.
          </motion.h1>
        </div>

        <div className="overflow-hidden mb-8">
          <motion.h2
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
            className="font-serif text-[clamp(2.75rem,8.5vw,7.5rem)] leading-[0.95] tracking-tight font-bold italic text-hud-accent"
          >
            Your browser should listen.
          </motion.h2>
        </div>

        {/* Editorial Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-2xl font-sans text-base sm:text-lg text-hud-inkSecondary leading-relaxed mb-10"
        >
          PulsePilot calculates your personal cognitive state from local health exports,
          executes protected actions through the Model Context Protocol, and transforms the live DOM
          to defend your focus before you burn out.
        </motion.p>

        {/* Magnetic CTAs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link href="/command">
            <MagneticButton variant="primary" cursorText="ENTER">
              Enter Command Center
            </MagneticButton>
          </Link>

          <Link href="/demo">
            <MagneticButton variant="secondary" cursorText="PLAY">
              <span className="flex items-center gap-2">
                <Play className="w-3.5 h-3.5 fill-current text-hud-accent" />
                Run 60s Scripted Demo
              </span>
            </MagneticButton>
          </Link>
        </motion.div>
      </div>

      {/* Bottom Track Anchors */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/10 font-mono text-xs"
      >
        <div>
          <span className="text-hud-accent font-semibold block mb-1">
            [TRACK 3 • KNOW THYSELF]
          </span>
          <span className="text-hud-inkSecondary">
            Local Vault FastAPI & SQLite. Ingests sleep, RHR, screen time. Zero cloud leak.
          </span>
        </div>

        <div>
          <span className="text-hud-accent font-semibold block mb-1">
            [TRACK 2 • BEYOND BROWSER]
          </span>
          <span className="text-hud-inkSecondary">
            In-Browser Cognitive Load Mode. Collapses text walls, shields impulse buys.
          </span>
        </div>

        <div>
          <span className="text-hud-accent font-semibold block mb-1">
            [TRACK 1 • MAKE MCP MATTER]
          </span>
          <span className="text-hud-inkSecondary">
            Official Python MCP Action Server with physical 1-click side-effect gating.
          </span>
        </div>
      </motion.div>
    </section>
  );
}
