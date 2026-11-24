'use client';

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, Eye, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function SceneTrack2Browser() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrubProgress, setScrubProgress] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=150%',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          setScrubProgress(self.progress);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen bg-hud-void flex flex-col justify-center px-6 py-16 border-b border-white/10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-white/10 gap-4">
          <div>
            <div className="font-mono text-xs text-hud-accent tracking-widest uppercase mb-1">
              TRACK 2 • BEYOND THE BROWSER
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-hud-inkPrimary">
              Your browser reacts before you burn out.
            </h2>
          </div>
          <div className="font-mono text-xs text-hud-inkMuted text-right">
            SCROLL SCRUBBER: <span className="text-hud-accent font-bold">{Math.round(scrubProgress * 100)}%</span>
          </div>
        </div>

        {/* Pinned Split-Screen Interactive Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {/* Left Panel: Raw Cluttered Web Page */}
          <div className="hairline-card p-6 flex flex-col bg-[#12151B]">
            <div className="flex items-center justify-between text-xs font-mono text-red-400 mb-4 pb-2 border-b border-red-500/20">
              <span>UNFILTERED HOST DOM (HIGH NOISE)</span>
              <span>NO SENSORY PROTECTION</span>
            </div>

            {/* Loud Banner */}
            <div className="p-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold text-xs text-center rounded-[2px] mb-4">
              FLASH PROMO: 400% NOOTROPIC STIMULANT RUSH (LIMITED BATCH)
            </div>

            {/* Cluttered Text Wall */}
            <div className="text-xs text-gray-400 leading-relaxed space-y-3 mb-6">
              <p>
                NeuroSurge Ultra delivers 450mg anhydrous caffeine co-crystallized with synthetic
                phenylpiracetam to trigger immediate central nervous system hyper-arousal. Adenosine
                receptor antagonism forces prefrontal perfusion regardless of biological exhaustion.
              </p>
              <p>
                WARNING: High autonomic cardiac strain. Ingesting during late-night circadian dips
                elevates resting heart rate by +24 bpm, suppresses REM sleep by 82%, and triggers
                severe cardiovascular rebound anxiety under sympathetic distress.
              </p>
            </div>

            {/* Instant Impulse Checkout */}
            <button className="mt-auto py-3 bg-[#00FFC2] text-black font-bold font-mono text-xs uppercase rounded-[2px]">
              Instant Buy Stimulant Stack ($249.00)
            </button>
          </div>

          {/* Right Panel: In-Browser Cognitive Load Mode (Scrub Reactive) */}
          <div className="hairline-card p-6 flex flex-col bg-hud-surface1 border-hud-accent/40 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-mono text-hud-accent mb-4 pb-2 border-b border-hud-accent/30">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                SHADOW DOM INJECTION
              </span>
              <span>COGNITIVE LOAD MODE ACTIVE</span>
            </div>

            {/* Faded & Blurred Banner */}
            <div
              style={{
                opacity: Math.max(0.04, 1 - scrubProgress * 1.5),
                filter: `blur(${scrubProgress * 6}px)`,
                maxHeight: `${Math.max(20, 60 * (1 - scrubProgress))}px`,
              }}
              className="p-3 bg-pink-900/40 text-pink-300 font-bold text-xs text-center rounded-[2px] mb-4 transition-all duration-200 overflow-hidden pointer-events-none"
            >
              PROMO STRIPPED • SENSORY OVERLOAD BLOCKED
            </div>

            {/* Folded Scannable TL;DR */}
            <div className="p-4 bg-hud-surface2 border border-hud-accent/50 rounded-[2px] mb-6 font-mono">
              <div className="text-xs font-bold text-hud-accent mb-2 flex items-center gap-2">
                <span>◈ CLINICAL CONTRAINDICATION • 3 KEY TAKEAWAYS</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-[1px] bg-hud-accent/20 text-hud-accent">
                  HEALTH ALERT
                </span>
              </div>
              <ul className="text-xs text-hud-inkSecondary space-y-1.5 list-disc pl-4">
                <li>High cardiac risk: Resting HR already elevated (76 bpm) with 4.5h sleep debt.</li>
                <li>Suppresses delta restorative sleep; induces 3.8-hour circadian delay.</li>
                <li>Prefrontal impulse bypass: Compound contra-indicated for current fatigue state.</li>
              </ul>
            </div>

            {/* Hold to Confirm Impulse Safeguard */}
            <div className="mt-auto p-3 bg-hud-surface2 border border-hud-accent rounded-[2px] flex items-center justify-between font-mono text-xs">
              <span className="text-hud-inkSecondary">
                Health Impulsive Checkout Shield:
              </span>
              <span className="text-hud-accent font-bold px-2 py-1 rounded-[1px] bg-hud-accent/15 border border-hud-accent/40">
                HOLD 1.5S TO CONFIRM OVERRIDE
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
