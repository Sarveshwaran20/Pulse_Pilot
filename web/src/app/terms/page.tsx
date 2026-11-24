'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, FileText, ArrowLeft, Lock, Scale, AlertTriangle, Cpu } from 'lucide-react';
import { Navbar } from '@/components/common/Navbar';

export default function TermsPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-24 pb-28 px-4 sm:px-6 max-w-4xl mx-auto font-sans text-zinc-300">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-sky-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to PulsePilot Home</span>
          </Link>
        </div>

        {/* Title Header */}
        <div className="border-b border-[#1E293B] pb-8 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-mono mb-3">
            <Scale className="w-3.5 h-3.5" />
            <span>Legal Agreement & Operating Charter</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Terms & Conditions of Service
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2 font-mono">
            Version 2.4 • Effective Date: November 24, 2026 • Local-First Architecture Protocol
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-sm leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#101721] border border-[#1E293B] text-sky-400">
                01
              </span>
              <span>Acceptance of Terms & The Local-First Covenant</span>
            </h2>
            <p>
              By accessing, deploying, or utilizing the PulsePilot software suite—including the Local Vault
              microservice, the Model Context Protocol (MCP) Action Server, the Chrome Attention Sentinel, and
              the Circadian Cockpit—you expressly agree to be bound by these Terms and Conditions.
            </p>
            <p>
              PulsePilot is engineered as an on-device personal biological intelligence system. Operating the
              platform implies your acceptance that all biometric calculations, state evaluations, and agentic
              gating occur on your local physical machine without cloud intermediary custody.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#101721] border border-[#1E293B] text-sky-400">
                02
              </span>
              <span>Biometric Telemetry & Medical Disclaimer</span>
            </h2>
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <div>
                <strong className="block font-semibold mb-1">Non-Medical Informational Tool:</strong>
                PulsePilot calculations—including Heart Rate Variability (HRV RMSSD), Autonomic Fatigue Score,
                Stress Surge Index, and Cognitive Bandwidth Capacity—are algorithmic heuristic estimations. They
                do not constitute medical diagnosis, neurological examination, or clinical healthcare advice.
              </div>
            </div>
            <p>
              You agree not to rely upon PulsePilot for emergency health decisions or treatment planning. Always
              consult licensed physicians or medical specialists for clinical evaluations.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#101721] border border-[#1E293B] text-sky-400">
                03
              </span>
              <span>Simulated Data & Future Hardware Ingest Pipeline</span>
            </h2>
            <p>
              The current deployment utilizes synthesized and simulated biometric telemetry streams
              (photoplethysmography simulations, resting heart rate intervals, and synthetic sleep architecture)
              for development, demonstration, and interface calibration purposes.
            </p>
            <p>
              As the platform evolves to support physical hardware (including custom ESP32/MAX30102 PPG pulse
              sensors, WearOS smartwatches, Apple Watch Bluetooth LE streams, or serial USB interfaces), you retain
              exclusive ownership and responsibility for hardware baud rates, serial permissions, and physical
              sensor calibration.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#101721] border border-[#1E293B] text-sky-400">
                04
              </span>
              <span>Model Context Protocol (MCP) & Gated Side-Effects</span>
            </h2>
            <p>
              PulsePilot interfaces with autonomous AI agents (such as Claude Code, Cursor, and custom LLM runtimes)
              via the Model Context Protocol. By design, all side-effecting mutations—including calendar event
              rescheduling, team status email dispatches, and shell command executions—are gated behind explicit
              physical confirmation cards.
            </p>
            <p>
              You acknowledge that once you click “Approve” on an MCP Confirmation Card, the resulting side-effects
              are final and executed at your sole instruction. PulsePilot assumes no liability for unintended
              communications or meeting conflicts resulting from user-approved actions.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#101721] border border-[#1E293B] text-sky-400">
                05
              </span>
              <span>The Synaptic Interlock & Friction Barriers</span>
            </h2>
            <p>
              PulsePilot includes autonomous friction mechanisms, such as the 1.5-second Hold-to-Confirm Smart
              Decision Filter and the Synaptic Interlock. These tools are designed to encourage conscious
              decision-making during periods of elevated fatigue. PulsePilot does not intercept financial
              transactions outside the local browser DOM scope and does not process payments directly.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#101721] border border-[#1E293B] text-sky-400">
                06
              </span>
              <span>Intellectual Property & Open Architecture</span>
            </h2>
            <p>
              The PulsePilot brand, Circadian Cockpit user interface, custom canvas shaders, and proprietary
              autonomic evaluation logic are the intellectual property of the creators. Community extensions and
              local database schemas are subject to their respective open-source licenses.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#101721] border border-[#1E293B] text-sky-400">
                07
              </span>
              <span>Modifications to Terms</span>
            </h2>
            <p>
              We reserve the right to revise these Terms as new hardware connectors and agentic protocols are
              integrated. Continued use of PulsePilot following modifications signifies your acceptance of updated terms.
            </p>
          </section>
        </div>

        {/* Footer Guarantee */}
        <div className="mt-12 pt-6 border-t border-[#1E293B] flex items-center justify-between text-xs font-mono text-zinc-500">
          <span>PulsePilot Operating System</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <Lock className="w-3 h-3" />
            <span>Zero-Egress Guaranteed</span>
          </span>
        </div>
      </main>
    </>
  );
}
