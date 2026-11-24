'use client';

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, CheckCircle2, Clock, Mail, ShieldAlert } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function SceneTrack1MCP() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [typedEmail, setTypedEmail] = useState('');

  const fullEmail =
    'Hi Team,\n\nProtecting morning focus block due to cognitive fatigue.\nMoving Sprint Planning to 14:00 today.\n\nBest,\nSarvesh';

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 1,
        },
      });

      // Card physically slides in with magnetic spring
      tl.fromTo(
        cardRef.current,
        { x: 120, opacity: 0, rotateZ: 4 },
        { x: 0, opacity: 1, rotateZ: 0, duration: 0.8, ease: 'power3.out' }
      );

      // Typing simulation on scroll
      tl.to(
        {},
        {
          duration: 1.0,
          onUpdate: function () {
            const count = Math.floor(this.progress() * fullEmail.length);
            setTypedEmail(fullEmail.slice(0, count));
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen bg-hud-surface1 flex flex-col justify-center px-6 py-20 border-b border-white/10 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Story */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="font-mono text-xs text-hud-accent tracking-widest uppercase mb-2">
            TRACK 1 • MAKE MCP MATTER
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-hud-inkPrimary leading-tight mb-6">
            Zero side effects without explicit confirmation.
          </h2>

          <p className="font-sans text-base text-hud-inkSecondary leading-relaxed mb-6">
            PulsePilot uses the official Python MCP SDK. Tools that mutate state—such as rescheduling
            calendar events or dispatching status emails—enter a pending approval gate. Nothing touches
            your calendar or inbox without a verified 1-click confirmation or editable preview card.
          </p>

          <div className="flex items-center gap-2 font-mono text-xs text-hud-accent font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Cryptographic Verification Receipts Generated per Dispatch</span>
          </div>
        </div>

        {/* Right Column: Physical Gated Approval Card */}
        <div className="lg:col-span-7 flex justify-center">
          <div
            ref={cardRef}
            className="w-full max-w-lg bg-hud-surface2 border-2 border-hud-accent p-6 rounded-[2px] shadow-2xl font-mono select-none"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2 text-hud-accent text-xs font-bold uppercase">
                <Clock className="w-4 h-4" />
                <span>GATED ACTION • RESCHEDULE EVENT</span>
              </div>
              <span className="text-[10px] text-hud-inkMuted">ID: act-c385d601</span>
            </div>

            <h3 className="font-serif text-lg font-bold text-hud-inkPrimary mb-2">
              Protect Morning: Sprint Planning
            </h3>

            {/* Time Shift Diff */}
            <div className="p-3 bg-hud-void border border-white/10 rounded-[2px] mb-4">
              <div className="flex items-center justify-between text-xs text-hud-inkPrimary">
                <span className="text-hud-inkMuted line-through">09:30 AM</span>
                <ArrowRight className="w-4 h-4 text-hud-accent" />
                <span className="text-hud-accent font-bold">14:00 PM (+4.5 hours)</span>
              </div>
            </div>

            {/* Auto-Typing Email Preview */}
            <div className="p-3 bg-hud-void border border-white/10 rounded-[2px] mb-5">
              <div className="text-[10px] text-hud-inkMuted mb-2 border-b border-white/10 pb-1">
                PREVIEW: Team Status Notification
              </div>
              <div className="text-xs text-hud-inkPrimary whitespace-pre-wrap min-h-[72px]">
                {typedEmail || 'Waiting for scroll activation...'}
                <span className="inline-block w-1.5 h-3 bg-hud-accent ml-0.5 animate-pulse" />
              </div>
            </div>

            {/* Confirm Execution Button */}
            <button className="w-full py-3 bg-hud-accent text-hud-void font-bold text-xs uppercase rounded-[2px] flex items-center justify-center gap-2 shadow-[0_0_20px_var(--hud-accent-glow)]">
              <CheckCircle2 className="w-4 h-4" />
              CONFIRM & EXECUTE MUTATION
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
