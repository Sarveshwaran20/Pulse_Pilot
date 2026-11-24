'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Play, Terminal, Sparkles } from 'lucide-react';
import { MagneticButton } from '@/components/common/MagneticButton';

export function SceneFinale() {
  const marqueeItems = [
    'LOCAL-FIRST ENCLAVE',
    'CIRCADIAN COCKPIT',
    'ZERO NETWORK EGRESS',
    'MODEL CONTEXT PROTOCOL',
    'COGNITIVE LOAD MODE',
    'PULSE ORB GLSL',
    'IMPULSE BUY SAFEGUARD',
  ];

  return (
    <footer className="relative bg-hud-void pt-20 pb-12 px-6 border-t border-white/10 overflow-hidden">
      {/* Velocity Reactive Marquee */}
      <div className="w-full overflow-hidden border-b border-white/10 pb-6 mb-16 select-none">
        <div className="flex gap-12 whitespace-nowrap animate-[marquee_25s_linear_infinite]">
          {[...marqueeItems, ...marqueeItems].map((item, idx) => (
            <span
              key={idx}
              className="font-mono text-sm tracking-[0.25em] text-hud-inkMuted uppercase flex items-center gap-4"
            >
              <span>{item}</span>
              <span className="text-hud-accent">◈</span>
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center mb-16">
        <h2 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-hud-inkPrimary mb-6">
          Experience the biological HUD live.
        </h2>

        <p className="max-w-xl font-sans text-base text-hud-inkSecondary mb-10">
          Run the full 60-second automated demo or inspect the Command Center dashboard.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/command">
            <MagneticButton variant="primary" cursorText="OPEN">
              Launch Command Center
            </MagneticButton>
          </Link>

          <Link href="/demo">
            <MagneticButton variant="secondary" cursorText="PLAY">
              <span className="flex items-center gap-2">
                <Play className="w-3.5 h-3.5 fill-current text-hud-accent" />
                Run 60s Demo Director
              </span>
            </MagneticButton>
          </Link>
        </div>
      </div>

      {/* Giant Outlined Wordmark (Fills on Hover) */}
      <div className="max-w-7xl mx-auto border-t border-white/10 pt-10 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-hud-inkMuted gap-4">
        <div>PULSEPILOT • 2026 ANTIGRAVITY AGENT CHALLENGE</div>
        <div className="flex items-center gap-6">
          <a
            href="http://127.0.0.1:8000/docs"
            target="_blank"
            rel="noreferrer"
            className="hover:text-hud-accent transition-colors"
          >
            Vault API Docs ➔
          </a>
          <a
            href="http://127.0.0.1:8000/test/shop"
            target="_blank"
            rel="noreferrer"
            className="hover:text-hud-accent transition-colors"
          >
            Stimulant Shield Test Page ➔
          </a>
        </div>
      </div>
    </footer>
  );
}
