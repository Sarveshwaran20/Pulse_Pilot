'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, Lock, Database, ArrowDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function SceneTrack3Vault() {
  const containerRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<HTMLDivElement>(null);
  const stateWordRef = useRef<HTMLHeadingElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pinned scroll section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 1,
        },
      });

      // Stream data points into vault
      tl.from('.vault-point', {
        y: 80,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
      });

      // Collapse into state morph
      tl.to('.vault-point', {
        scale: 0.6,
        opacity: 0.2,
        duration: 0.5,
      });

      // State word scramble morph
      tl.to(stateWordRef.current, {
        color: '#E08838',
        duration: 0.4,
        onUpdate: function () {
          const prog = this.progress();
          if (stateWordRef.current) {
            stateWordRef.current.innerText =
              prog > 0.5 ? 'COGNITIVE_FATIGUE' : 'DEEP_FOCUS';
          }
        },
      });

      // Byte counter locked at 0
      tl.to(counterRef.current, {
        innerText: '0 BYTES',
        snap: { innerText: 1 },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen bg-hud-surface1 flex flex-col justify-center px-6 py-20 border-t border-b border-white/10 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Story Prose */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="flex items-center gap-2 font-mono text-xs text-hud-accent tracking-widest uppercase mb-3">
            <Lock className="w-3.5 h-3.5" />
            <span>TRACK 3 • KNOW THYSELF</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-hud-inkPrimary leading-tight mb-6">
            Raw biometrics never leave localhost.
          </h2>

          <p className="font-sans text-base text-hud-inkSecondary leading-relaxed mb-6">
            PulsePilot ingests raw Oura sleep stages, Garmin resting heart rates, and RescueTime
            application logs directly into a secure local SQLite enclave. Your longitudinal health
            history is strictly private.
          </p>

          <div className="p-4 bg-hud-surface2 border border-white/10 rounded-[2px] font-mono text-xs mb-6">
            <div className="flex items-center justify-between text-hud-inkMuted mb-2">
              <span>EGRESS TELEMETRY COUNTER:</span>
              <span ref={counterRef} className="text-hud-accent font-bold">
                0 BYTES
              </span>
            </div>
            <div className="text-[11px] text-hud-inkSecondary">
              Only high-level categorical flags (`COGNITIVE_FATIGUE`, `FOCUS_SCORE`) are exposed to
              agent workflows.
            </div>
          </div>
        </div>

        {/* Right Column: Visual Vault Pipeline */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-8 bg-hud-void/60 border border-white/10 rounded-[2px] relative">
          <div className="text-[10px] font-mono tracking-widest text-hud-inkMuted mb-6 uppercase">
            LOCAL BIOMETRIC PIPELINE STREAM
          </div>

          <div ref={streamRef} className="w-full space-y-3 mb-8">
            <div className="vault-point p-3 bg-hud-surface2/80 border border-white/10 rounded-[2px] flex items-center justify-between font-mono text-xs">
              <span className="text-hud-inkSecondary">Sleep Duration (Oura Export):</span>
              <span className="text-[#FF4B55] font-bold">4.5h (Debt: +4.8h)</span>
            </div>

            <div className="vault-point p-3 bg-hud-surface2/80 border border-white/10 rounded-[2px] flex items-center justify-between font-mono text-xs">
              <span className="text-hud-inkSecondary">Resting Heart Rate (Garmin CSV):</span>
              <span className="text-[#E08838] font-bold">74 BPM (+15 delta)</span>
            </div>

            <div className="vault-point p-3 bg-hud-surface2/80 border border-white/10 rounded-[2px] flex items-center justify-between font-mono text-xs">
              <span className="text-hud-inkSecondary">Screen Time & Pickups:</span>
              <span className="text-hud-accent font-bold">6.8h • 128 pickups</span>
            </div>
          </div>

          {/* Morphing State Target */}
          <div className="w-full text-center p-6 bg-hud-surface2 border border-hud-accent/40 rounded-[2px]">
            <span className="text-[10px] font-mono tracking-widest text-hud-inkMuted uppercase block mb-1">
              DERIVED AUTONOMIC POSTURE
            </span>
            <h3
              ref={stateWordRef}
              className="font-serif text-3xl sm:text-4xl font-bold tracking-wide text-hud-accent transition-colors"
            >
              COGNITIVE_FATIGUE
            </h3>
            <span className="text-xs font-mono text-hud-inkSecondary mt-2 block">
              Calculated locally in 0.8ms
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
