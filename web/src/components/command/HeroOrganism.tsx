'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PulseOrbDynamic } from '@/components/orb/PulseOrbDynamic';
import { useAppStore } from '@/lib/store';
import { Activity, Shield, BatteryCharging, Heart, Zap } from 'lucide-react';

export function HeroOrganism() {
  const { biometrics } = useAppStore();

  return (
    <div className="relative w-full min-h-[55vh] flex flex-col lg:flex-row items-center justify-between gap-8 py-8 px-6 hairline-card bg-hud-surface1/70 border-white/10 rounded-[2px] overflow-hidden">
      {/* Background Volumetric Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_30%_50%,var(--hud-accent-glow),transparent_60%)]" />

      {/* Left: 55vh Centerpiece 3D Orb */}
      <div className="relative w-full max-w-[420px] h-[360px] sm:h-[440px] flex items-center justify-center">
        <PulseOrbDynamic scale={1.25} />

        {/* Orbiting Minimal Floating Chips (Fixed Absolute Positions, Zero Collision) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-2 left-0 px-3 py-1.5 rounded-[2px] bg-hud-surface2/90 border border-white/15 backdrop-blur-md font-mono text-[11px] shadow-lg"
        >
          <div className="text-hud-inkMuted text-[9px] uppercase">RHR TEMPO</div>
          <div className="text-hud-inkPrimary font-bold text-sm">
            {biometrics.restingHr} <span className="text-hud-accent text-xs">BPM</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="absolute -bottom-2 left-6 px-3 py-1.5 rounded-[2px] bg-hud-surface2/90 border border-white/15 backdrop-blur-md font-mono text-[11px] shadow-lg"
        >
          <div className="text-hud-inkMuted text-[9px] uppercase">HRV (RMSSD)</div>
          <div className="text-hud-inkPrimary font-bold text-sm">
            {biometrics.hrvRmssd} <span className="text-hud-inkSecondary text-xs">MS</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute top-12 -right-4 px-3 py-1.5 rounded-[2px] bg-hud-surface2/90 border border-white/15 backdrop-blur-md font-mono text-[11px] shadow-lg"
        >
          <div className="text-hud-inkMuted text-[9px] uppercase">SCREEN TIME</div>
          <div className="text-hud-inkPrimary font-bold text-sm">
            {biometrics.screenTimeHours} <span className="text-hud-inkSecondary text-xs">HRS</span>
          </div>
        </motion.div>
      </div>

      {/* Right: Giant Editorial State Announcement */}
      <div className="flex-1 flex flex-col justify-center max-w-xl z-10">
        <div className="flex items-center gap-2 font-mono text-xs text-hud-accent uppercase tracking-widest mb-3">
          <Activity className="w-4 h-4" />
          <span>CURRENT AUTONOMIC POSTURE</span>
          {biometrics.isSimulated && (
            <span className="px-1.5 py-0.5 rounded-[1px] bg-hud-accent/20 border border-hud-accent/40 text-[9px]">
              SIMULATED
            </span>
          )}
        </div>

        {/* Colossal Fraunces State Title */}
        <h1 className="font-serif text-[clamp(2.5rem,5.5vw,5rem)] font-bold tracking-tight text-hud-inkPrimary leading-[1.0] mb-4">
          {biometrics.state}
        </h1>

        <p className="font-sans text-lg text-hud-inkSecondary leading-relaxed mb-6">
          {biometrics.headline}
        </p>

        {/* Safeguard Status Chips */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-2 px-3 py-2 bg-hud-surface2 border border-white/10 rounded-[2px]">
            <Shield className="w-3.5 h-3.5 text-hud-accent" />
            <span className="text-hud-inkSecondary">Browser Cognitive Mode:</span>
            <span
              className={`font-bold ${
                biometrics.cognitiveLoadModeRecommended ? 'text-hud-accent' : 'text-hud-inkMuted'
              }`}
            >
              {biometrics.cognitiveLoadModeRecommended ? 'ENGAGED' : 'STANDBY'}
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 bg-hud-surface2 border border-white/10 rounded-[2px]">
            <Zap className="w-3.5 h-3.5 text-hud-accent" />
            <span className="text-hud-inkSecondary">Impulse Buy Safeguard:</span>
            <span
              className={`font-bold ${
                biometrics.impulseBuyShieldRecommended ? 'text-hud-accent' : 'text-hud-inkMuted'
              }`}
            >
              {biometrics.impulseBuyShieldRecommended ? 'HOLD 1.5S' : 'PASSIVE'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
