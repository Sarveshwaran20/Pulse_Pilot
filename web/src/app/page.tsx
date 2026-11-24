'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Activity,
  ShieldCheck,
  BrainCircuit,
  Lock,
  ArrowRight,
  Zap,
  Play,
  Layers,
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
  Clock,
  Eye,
  Database,
  User,
  Heart,
  Scale,
  FileText,
  Cpu,
  Usb,
  Bluetooth,
  Terminal,
  ShieldAlert,
  Sun,
  Moon,
  ChevronRight
} from 'lucide-react';

import { Navbar } from '@/components/common/Navbar';
import { CommandPalette } from '@/components/common/CommandPalette';
import { PulseOrbDynamic } from '@/components/orb/PulseOrbDynamic';
import { SynapticInterlock } from '@/components/innovations/SynapticInterlock';
import { HardwarePPGLab } from '@/components/innovations/HardwarePPGLab';
import { useAppStore } from '@/lib/store';

export default function LandingPage() {
  const {
    biometrics,
    fetchState,
    simulateState,
    currentUser,
    setAICopilotOpen,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'FOCUS' | 'FATIGUE' | 'STRESS'>('FATIGUE');

  useEffect(() => {
    fetchState();
  }, [fetchState]);

  const isFatigued = biometrics.state === 'COGNITIVE_FATIGUE';
  const isStressed = biometrics.state === 'HIGH_STRESS';

  const handleSimulate = async (stateKey: 'FOCUS' | 'FATIGUE' | 'STRESS') => {
    setActiveTab(stateKey);
    if (stateKey === 'FOCUS') {
      await simulateState('DEEP_FOCUS');
    } else if (stateKey === 'FATIGUE') {
      await simulateState('COGNITIVE_FATIGUE');
    } else {
      await simulateState('HIGH_STRESS');
    }
  };

  return (
    <>
      <Navbar />
      <CommandPalette />

      <main className="min-h-screen pt-20 pb-28 px-4 sm:px-6 max-w-[1400px] mx-auto w-full space-y-28 font-sans select-none">
        
        {/* =========================================================================
            SECTION 1: HERO SCENE — EDITORIAL SCALE CONTRAST & 3D PULSE ORB
           ========================================================================= */}
        <section className="min-h-[85vh] flex flex-col justify-center items-center text-center relative pt-8 pb-12">
          
          {/* Top Technology Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D1522]/90 border border-sky-500/30 text-sky-300 text-xs font-mono shadow-lg shadow-sky-500/10 mb-6 backdrop-blur"
          >
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            <span>Circadian Intelligence • Local Vault Architecture</span>
            <span className="text-zinc-600">|</span>
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <Lock className="w-3 h-3" /> 0 Bytes Egress Guaranteed
            </span>
          </motion.div>

          {/* Extreme Scale Editorial Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-serif font-normal tracking-tight text-white max-w-5xl leading-[1.08]"
          >
            Your body has a signal. <br />
            <span className="italic font-light text-zinc-300">
              Your browser should listen.
            </span>
          </motion.h1>

          {/* Refined Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg text-zinc-400 max-w-2xl mt-6 leading-relaxed font-sans"
          >
            PulsePilot is an on-device personal biological intelligence enclave and agentic action system.
            It ingests your sleep debt, resting heart rate, and HRV strictly in local SQLite, guards your prefrontal
            bandwidth with a Chrome extension, and gates agentic mutations behind physical human consent.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-8"
          >
            <Link
              href={currentUser ? "/cockpit" : "/auth"}
              className="px-6 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-sm flex items-center gap-2 transition-all shadow-xl shadow-sky-500/25 hover:shadow-sky-500/40 hover:-translate-y-0.5 cursor-pointer"
            >
              <span>{currentUser ? "Launch Circadian Cockpit" : "Sign In to Enter Cockpit"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/demo"
              className="px-5 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500/20 via-sky-500/20 to-indigo-500/20 hover:from-emerald-500/30 hover:via-sky-500/30 hover:to-indigo-500/30 border border-emerald-500/40 text-emerald-200 font-bold text-sm flex items-center gap-2 transition-all backdrop-blur cursor-pointer shadow-lg shadow-emerald-500/10 group"
            >
              <Play className="w-4 h-4 text-emerald-400 fill-current group-hover:scale-110 transition-transform" />
              <span>Enter Demo Mode</span>
            </Link>

            {!currentUser && (
              <Link
                href="/auth"
                className="px-5 py-3.5 rounded-xl bg-[#0F1726]/70 hover:bg-[#162235] border border-zinc-800 text-zinc-300 hover:text-white font-medium text-sm flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <User className="w-4 h-4 text-zinc-400" />
                <span>Sign In or Register</span>
              </Link>
            )}
          </motion.div>

          {/* Central Harmonic Pulse Orb */}
          <div className="w-full max-w-md h-72 sm:h-80 mx-auto mt-10 relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className={`w-64 h-64 rounded-full blur-3xl opacity-20 transition-colors duration-1000 ${
                  isFatigued ? 'bg-amber-500' : isStressed ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
              />
            </div>
            <PulseOrbDynamic scale={1.1} className="w-full h-full relative z-10" />
          </div>

          {/* Live Autonomic State Telemetry Ribbon */}
          <div className="mt-4 flex items-center justify-center gap-4 text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>{biometrics.restingHr} bpm</span>
            </span>
            <span>•</span>
            <span className="text-sky-400 font-medium">HRV: {biometrics.hrvRmssd}ms</span>
            <span>•</span>
            <span className="text-amber-400 font-medium">Fatigue: {biometrics.fatigueScore}%</span>
            <span>•</span>
            <span className="text-white font-semibold">{biometrics.state}</span>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: INDUSTRY-FIRST FEATURE — THE SYNAPTIC INTERLOCK
           ========================================================================= */}
        <section id="section-synaptic-interlock" className="space-y-4">
          <SynapticInterlock />
        </section>

        {/* =========================================================================
            SECTION 3: HARDWARE TELEMETRY LAB & PPG OSCILLOSCOPE
           ========================================================================= */}
        <section id="section-hardware-lab" className="space-y-4">
          <HardwarePPGLab />
        </section>

        {/* =========================================================================
            SECTION 4: INTERACTIVE STATE PLAYGROUND (SANDBOX)
           ========================================================================= */}
        <section className="rounded-2xl bg-[#090F19]/90 border border-[#1E293B] p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#1A2536]">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-sky-400 font-bold block mb-1">
                Autonomic Simulation Sandbox
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Preview Biological State Transitions
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Observe how PulsePilot instantly shifts its defense posture, cognitive filters, and agentic workflows.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-[#05080E] p-1.5 rounded-xl border border-[#1A2536]">
              <button
                onClick={() => handleSimulate('FOCUS')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'FOCUS'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Deep Focus
              </button>
              <button
                onClick={() => handleSimulate('FATIGUE')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'FATIGUE'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Cognitive Fatigue
              </button>
              <button
                onClick={() => handleSimulate('STRESS')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'STRESS'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                High Stress
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="p-4 rounded-xl bg-[#0D1522] border border-[#1E2B3E]">
              <span className="text-[11px] font-mono text-zinc-500 uppercase block mb-1">
                Autonomic Headline
              </span>
              <p className="text-sm font-semibold text-white">{biometrics.headline}</p>
              <div className="mt-4 pt-3 border-t border-[#1A2536] text-xs font-mono flex justify-between text-zinc-400">
                <span>Focus Capacity</span>
                <span className="text-white font-bold">{biometrics.focusScore}%</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0D1522] border border-[#1E2B3E]">
              <span className="text-[11px] font-mono text-zinc-500 uppercase block mb-1">
                Chrome Extension Posture
              </span>
              <p className="text-sm font-semibold text-white">
                {isFatigued
                  ? 'Cognitive Load Mode Armed • 1.5s Purchase Shield'
                  : 'Transparent Standard DOM • Monitoring Telemetry'}
              </p>
              <div className="mt-4 pt-3 border-t border-[#1A2536] text-xs font-mono flex justify-between text-zinc-400">
                <span>Clutter Shield</span>
                <span className={isFatigued ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                  {isFatigued ? 'Engaged' : 'Standby'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0D1522] border border-[#1E2B3E]">
              <span className="text-[11px] font-mono text-zinc-500 uppercase block mb-1">
                Gated MCP Action Gating
              </span>
              <p className="text-sm font-semibold text-white">
                {isFatigued
                  ? 'Reschedule Morning Sprint (09:30 → 14:00)'
                  : 'Nominal schedule posture • No rescheduling needed'}
              </p>
              <div className="mt-4 pt-3 border-t border-[#1A2536] text-xs font-mono flex justify-between text-zinc-400">
                <span>Confirmation Gate</span>
                <span className="text-sky-400 font-bold">Physical Card Required</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 5: 24-HOUR ULTRADIAN BIORHYTHM HEATMAP
           ========================================================================= */}
        <section className="rounded-2xl bg-[#0B111D] border border-[#1E293B] p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1A2536]">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-sky-400 font-semibold">
                Ultradian Waveform Analysis
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                24-Hour Circadian Biological Readiness Rhythm
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                How cortisol awakening, body temperature, and prefrontal bandwidth fluctuate across 24 hours.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-1.5"><Sun className="w-4 h-4 text-amber-400" /> Diurnal Peak</span>
              <span className="flex items-center gap-1.5"><Moon className="w-4 h-4 text-sky-400" /> Nocturnal Reset</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs font-mono">
            {[
              { time: '06:00 - 09:00', title: 'Cortisol Awaken', tag: 'Vulnerable', color: 'border-amber-500/40 text-amber-300 bg-amber-500/5', desc: 'Sleep inertia clears. Autonomic strain high if sleep debt > 4h.' },
              { time: '09:00 - 12:30', title: 'Ultradian Peak 1', tag: 'Deep Flow', color: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/5', desc: 'Maximum prefrontal executive capacity. Target hard code architecture.' },
              { time: '12:30 - 14:30', title: 'Postprandial Dip', tag: 'Low Bandwidth', color: 'border-zinc-700 text-zinc-400 bg-[#0E1522]', desc: 'Core body temp dips. Ideal for PR reviews, email status notices.' },
              { time: '14:30 - 17:30', title: 'Ultradian Peak 2', tag: 'Focus Rebound', color: 'border-sky-500/40 text-sky-300 bg-sky-500/5', desc: 'Circadian alertness returns. Rescheduled meetings land here.' },
              { time: '17:30 - 21:00', title: 'Metabolic Taper', tag: 'Decompress', color: 'border-zinc-700 text-zinc-400 bg-[#0E1522]', desc: 'Screen time friction engages. Work wind-down initiated.' },
              { time: '21:00 - 06:00', title: 'Nocturnal Enclave', tag: 'Impulse Shield', color: 'border-purple-500/40 text-purple-300 bg-purple-500/5', desc: 'Melatonin surge. 1.5s Hold-to-Confirm active on late-night commerce.' },
            ].map((slot, idx) => (
              <div key={idx} className={`p-3.5 rounded-xl border ${slot.color} flex flex-col justify-between space-y-2`}>
                <div>
                  <span className="text-[10px] text-zinc-500 block">{slot.time}</span>
                  <span className="font-bold text-white block mt-0.5">{slot.title}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 font-semibold inline-block mt-1">
                    {slot.tag}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 font-sans leading-tight">{slot.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            SECTION 6: 3 ARCHITECTURAL PILLARS (DECOUPLED LAYERS)
           ========================================================================= */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-sky-400 font-semibold">
              Decoupled Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">
              Three Independent Layers. Zero Data Leakage.
            </h2>
            <p className="text-sm text-zinc-400 mt-2">
              Engineered with physical separation between biological ingestion, agentic action execution, and DOM augmentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl bg-[#0C121D] border border-[#1E293B] hover:border-emerald-500/40 transition-colors shadow-lg flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                  <Database className="w-5 h-5" />
                </div>
                <div className="text-[11px] font-mono text-emerald-400 font-semibold uppercase">
                  Layer 01 • Local Vault
                </div>
                <h3 className="text-lg font-bold text-white mt-1 mb-2">
                  On-Device SQLite Enclave
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Ingests sleep cycles, resting heart rate, and screen time strictly on localhost. Raw biometric metrics never leave your machine — exactly 0 bytes egress.
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-[#1A2536] flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Storage</span>
                <span className="text-white font-semibold">SQLite WAL Mode</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl bg-[#0C121D] border border-[#1E293B] hover:border-sky-500/40 transition-colors shadow-lg flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-[11px] font-mono text-sky-400 font-semibold uppercase">
                  Layer 02 • Action Server
                </div>
                <h3 className="text-lg font-bold text-white mt-1 mb-2">
                  Gated Model Context Protocol
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Real MCP server exposes tools to Claude Code or Cursor. Side-effects (calendar rescheduling, status email drafts) require a physical approval card before execution.
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-[#1A2536] flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Protocol</span>
                <span className="text-white font-semibold">Model Context Protocol</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl bg-[#0C121D] border border-[#1E293B] hover:border-purple-500/40 transition-colors shadow-lg flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
                  <Eye className="w-5 h-5" />
                </div>
                <div className="text-[11px] font-mono text-purple-400 font-semibold uppercase">
                  Layer 03 • Chrome Extension
                </div>
                <h3 className="text-lg font-bold text-white mt-1 mb-2">
                  Attention Sentinel
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Manifest V3 extension polls local Vault. During fatigue, it injects a clean reader layout and binds a 1.5-second hold-to-confirm barrier over destructive purchase buttons.
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-[#1A2536] flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Injection</span>
                <span className="text-white font-semibold">Shadow DOM Isolation</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 7: SCRIPTED DEMO MODE & SIMULATION DIRECTOR
           ========================================================================= */}
        <section className="rounded-2xl bg-gradient-to-br from-[#0F1829] to-[#0A101C] border border-[#22354E] p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Full Scripted Flow • Zero Account Needed</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Instant 60-Second Demo Director
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Launch into full Demo Mode to experience the complete 3-phase journey: morning fatigue ingestion,
              automatic browser decluttering with the 1.5s purchase filter, and gated MCP calendar protection cards.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <Link
              href="/demo"
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/25"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Demo Mode</span>
            </Link>
            <Link
              href={currentUser ? "/cockpit" : "/auth"}
              className="px-5 py-3 rounded-xl bg-[#131E30] hover:bg-[#1A2840] border border-[#23354E] text-zinc-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
            >
              <span>{currentUser ? "Launch Cockpit" : "Sign In or Register"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* =========================================================================
            SECTION 8: FOOTER WITH LEGAL LINKS & GIANT WORDMARK
           ========================================================================= */}
        <footer className="pt-16 pb-12 border-t border-[#1A2536] space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs text-zinc-400">
            {/* Col 1: Brand */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-cinzel text-base font-bold text-white">PULSEPILOT</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                Local-first personal biological intelligence enclave and agentic action system. Zero bytes egress.
              </p>
              <span className="text-[10px] font-mono text-emerald-400 block">
                Localhost 127.0.0.1 • SQLite Encrypted
              </span>
            </div>

            {/* Col 2: Navigation */}
            <div className="space-y-2">
              <span className="text-white font-semibold font-mono uppercase text-[11px] block">Architecture</span>
              <ul className="space-y-1.5 font-sans">
                <li><Link href="/" className="hover:text-white transition-colors">Home Landing</Link></li>
                <li><Link href={currentUser ? "/cockpit" : "/auth"} className="hover:text-white transition-colors">Circadian Cockpit</Link></li>
                <li><Link href="/demo" className="hover:text-emerald-400 transition-colors">60s Demo Mode</Link></li>
                <li><Link href="/auth" className="hover:text-white transition-colors">User Sign In or Register</Link></li>
              </ul>
            </div>

            {/* Col 3: Innovations */}
            <div className="space-y-2">
              <span className="text-white font-semibold font-mono uppercase text-[11px] block">Inventions</span>
              <ul className="space-y-1.5 font-sans">
                <li><a href="#section-synaptic-interlock" className="hover:text-white transition-colors">The Synaptic Interlock</a></li>
                <li><a href="#section-hardware-lab" className="hover:text-white transition-colors">Hardware PPG Oscilloscope</a></li>
                <li><span className="text-zinc-500">1.5s Smart Decision Filter</span></li>
                <li><span className="text-zinc-500">Gated MCP Approval Cards</span></li>
              </ul>
            </div>

            {/* Col 4: Legal & Sovereignty */}
            <div className="space-y-2">
              <span className="text-white font-semibold font-mono uppercase text-[11px] block">Data Sovereignty</span>
              <ul className="space-y-1.5 font-sans">
                <li>
                  <Link href="/privacy" className="hover:text-sky-400 transition-colors flex items-center gap-1.5 font-semibold text-zinc-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Privacy Policy (0-Egress)</span>
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-sky-400 transition-colors flex items-center gap-1.5 font-semibold text-zinc-300">
                    <Scale className="w-3.5 h-3.5 text-sky-400" />
                    <span>Terms & Conditions</span>
                  </Link>
                </li>
                <li><span className="text-zinc-500 text-[11px]">MIT & Open Hardware License</span></li>
              </ul>
            </div>
          </div>

          {/* Huge Editorial Wordmark */}
          <div className="text-center pt-8 overflow-hidden select-none">
            <span className="font-cinzel text-5xl sm:text-7xl md:text-9xl font-bold tracking-widest text-[#101726] hover:text-[#162235] transition-colors duration-500 block">
              PULSEPILOT
            </span>
          </div>
        </footer>

      </main>
    </>
  );
}
