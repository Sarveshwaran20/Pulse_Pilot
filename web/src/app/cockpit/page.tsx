'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  ShieldCheck,
  Cpu,
  Layers,
  ChevronDown,
  Download,
  FileText,
  Plus,
  ArrowUpRight,
  ArrowRight,
  Clock,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  SlidersHorizontal,
  ExternalLink,
  Flame,
  ShieldAlert,
  BrainCircuit,
  Lock,
  Heart,
  Moon,
  Compass
} from 'lucide-react';

import { Navbar } from '@/components/common/Navbar';
import { CommandPalette } from '@/components/common/CommandPalette';
import { SpotlightCard } from '@/components/scada/SpotlightCard';
import { RadialGauge } from '@/components/scada/RadialGauge';
import { AnimatedNumber } from '@/components/scada/AnimatedNumber';
import { GrowBar } from '@/components/scada/GrowBar';
import { Sparkline } from '@/components/scada/SparklinePath';
import { ScadaDock } from '@/components/scada/ScadaDock';
import { PulseOrbDynamic } from '@/components/orb/PulseOrbDynamic';
import { ScrubbableTimeline } from '@/components/command/ScrubbableTimeline';
import { PhysicalCardStack } from '@/components/command/PhysicalCardStack';
import { SynapticInterlock } from '@/components/innovations/SynapticInterlock';
import { HardwarePPGLab } from '@/components/innovations/HardwarePPGLab';
import { useAppStore } from '@/lib/store';

export default function CircadianCockpit() {
  const {
    biometrics,
    pendingActions,
    actionReceipts,
    fetchState,
    fetchMCPQueue,
    simulateState,
    triggerProtectMorning,
    setAICopilotOpen,
    currentUser,
    isDemoMode,
    disableDemoMode,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<string>('vitals');

  // 60-Second Demo Engine State
  const [isRunning60s, setIsRunning60s] = useState(false);
  const [demoSeconds, setDemoSeconds] = useState(0);
  const [demoPhase, setDemoPhase] = useState<'IDLE' | 'PHASE_1_TRIGGER' | 'PHASE_2_ADAPT' | 'PHASE_3_ACT'>('IDLE');

  // Interactive Smart Decision Filter Preview in Cockpit
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [purchaseBlocked, setPurchaseBlocked] = useState(false);
  const [cognitiveDeclutterActive, setCognitiveDeclutterActive] = useState(true);

  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // If not authenticated in store or localStorage, redirect to /auth
    const stored = typeof window !== 'undefined' ? localStorage.getItem('pulsepilot_user') : null;
    if (!currentUser && !stored) {
      router.push('/auth');
    } else {
      setAuthChecked(true);
    }
  }, [currentUser, router]);

  useEffect(() => {
    fetchState();
    fetchMCPQueue();
    const interval = setInterval(() => {
      fetchState();
      fetchMCPQueue();
    }, 2000);
    return () => clearInterval(interval);
  }, [fetchState, fetchMCPQueue]);

  // Automated 60-Second Script Runner
  useEffect(() => {
    let timer: any;
    if (isRunning60s) {
      timer = setInterval(() => {
        setDemoSeconds((prev) => {
          const next = prev + 1;
          if (next === 1) {
            setDemoPhase('PHASE_1_TRIGGER');
            simulateState('COGNITIVE_FATIGUE');
          } else if (next === 16) {
            setDemoPhase('PHASE_2_ADAPT');
            setCognitiveDeclutterActive(true);
          } else if (next === 38) {
            setDemoPhase('PHASE_3_ACT');
            triggerProtectMorning();
          } else if (next >= 60) {
            setIsRunning60s(false);
            setDemoPhase('IDLE');
            clearInterval(timer);
            return 60;
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning60s, simulateState, triggerProtectMorning]);

  // Hold-to-confirm timer for Decision Shield
  useEffect(() => {
    let interval: any;
    if (isHolding && !purchaseBlocked) {
      interval = setInterval(() => {
        setHoldProgress((p) => {
          if (p >= 100) {
            clearInterval(interval);
            setPurchaseBlocked(true);
            return 100;
          }
          return p + 4; // ~1.5s total hold duration
        });
      }, 60);
    } else if (!isHolding && !purchaseBlocked) {
      setHoldProgress(0);
    }
    return () => clearInterval(interval);
  }, [isHolding, purchaseBlocked]);

  const start60sDemo = () => {
    setDemoSeconds(0);
    setIsRunning60s(true);
  };

  const resetAll = async () => {
    setIsRunning60s(false);
    setDemoSeconds(0);
    setDemoPhase('IDLE');
    setPurchaseBlocked(false);
    setHoldProgress(0);
    await simulateState(null);
  };

  const isFatigued = biometrics.state === 'COGNITIVE_FATIGUE';
  const isStressed = biometrics.state === 'HIGH_STRESS';

  if (!currentUser && !authChecked) {
    return (
      <div className="min-h-screen bg-[#070C15] flex flex-col items-center justify-center font-mono text-xs text-zinc-400 space-y-3">
        <Lock className="w-8 h-8 text-sky-400 animate-pulse" />
        <span>AUTHENTICATION REQUIRED • REDIRECTING TO SIGN IN...</span>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <CommandPalette />

      <main className="flex-1 pt-20 pb-32 px-4 sm:px-6 max-w-[1480px] mx-auto w-full space-y-6 text-sans">
        
        {/* =========================================================================
            DEMO MODE CONTROLLER BAR (When Demo Mode is Active)
           ========================================================================= */}
        {isDemoMode && (
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/15 via-sky-500/15 to-purple-500/15 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono shadow-xl">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold text-emerald-300 uppercase tracking-wider">
                DEMO MODE ACTIVE
              </span>
              <span className="text-zinc-500">|</span>
              <span className="text-zinc-300">Guest Sandbox • Simulated Telemetry Active</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => simulateState('COGNITIVE_FATIGUE')}
                className="px-2.5 py-1 rounded bg-[#101721] hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-semibold cursor-pointer transition-colors"
              >
                1. Fatigue (84%)
              </button>
              <button
                onClick={() => simulateState('DEEP_FOCUS')}
                className="px-2.5 py-1 rounded bg-[#101721] hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold cursor-pointer transition-colors"
              >
                2. Focus (92%)
              </button>
              <button
                onClick={() => simulateState('HIGH_STRESS')}
                className="px-2.5 py-1 rounded bg-[#101721] hover:bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[11px] font-semibold cursor-pointer transition-colors"
              >
                3. Stress (88%)
              </button>
              <button
                onClick={() => {
                  disableDemoMode();
                  router.push('/');
                }}
                className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-[11px] font-bold cursor-pointer transition-colors ml-2"
              >
                Exit Demo
              </button>
            </div>
          </div>
        )}
        
        {/* =========================================================================
            HEADER TITLE & ENCLAVE POSTURE BAR
           ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1A2636]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono tracking-widest text-sky-400 uppercase font-semibold">
                Autonomous Biometric Sentinel
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>Local SQLite Enclave (0 Bytes Egress)</span>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
              Circadian Telemetry & Gated Action Cockpit
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setAICopilotOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-500/20 to-indigo-500/20 hover:from-sky-500/30 hover:to-indigo-500/30 border border-sky-500/30 text-sky-300 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm group"
            >
              <BrainCircuit className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
              <span>Ask AI Copilot</span>
            </button>

            <button
              onClick={start60sDemo}
              disabled={isRunning60s}
              className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-black text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-sky-500/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run 60s Demo</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            SECTION 1: 4 REFINED BIOMETRIC KPI CARDS
           ========================================================================= */}
        <section id="section-vitals" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* KPI 1: Biometric Harmony Index */}
            <SpotlightCard className="p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[13px] text-zinc-400 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-[#101721] border border-[#1E293B] text-zinc-300 font-semibold">
                    01
                  </span>
                  <span className="font-sans font-semibold tracking-wide text-white truncate text-xs sm:text-sm">
                    BIOMETRIC HARMONY INDEX
                  </span>
                </div>
                <span className="text-[11px] font-mono text-zinc-500 px-2 py-0.5 rounded bg-[#101721] border border-[#1E293B] shrink-0">
                  Target: 85.0%
                </span>
              </div>

              <div className="my-3 flex items-center justify-between gap-3">
                <div className="flex flex-col gap-1.5">
                  <AnimatedNumber
                    value={biometrics.focusScore}
                    decimals={1}
                    suffix="%"
                    className={`font-sans text-3xl sm:text-4xl font-bold tracking-tight leading-none ${
                      isFatigued ? 'text-amber-400' : isStressed ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  />
                  <span
                    className={`inline-block w-fit text-[11px] font-medium px-2 py-0.5 rounded-md border ${
                      biometrics.focusScore >= 75
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : isFatigued
                        ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                        : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {biometrics.focusScore >= 75 ? 'Optimal Equilibrium' : isFatigued ? 'Cognitive Fatigue' : 'High Autonomic Stress'}
                  </span>
                </div>
                <RadialGauge
                  value={biometrics.focusScore}
                  size={58}
                  strokeWidth={5}
                  colorVar={isFatigued ? '#F59E0B' : isStressed ? '#EF4444' : '#10B981'}
                />
              </div>

              <div className="text-[11px] text-zinc-400 pt-3 border-t border-[#1E293B] flex items-center justify-between font-mono">
                <span>Avail <strong className="text-white font-semibold">98.1%</strong></span>
                <span className="text-zinc-600">|</span>
                <span>Focus <strong className="text-white font-semibold">{biometrics.focusScore}%</strong></span>
                <span className="text-zinc-600">|</span>
                <span>Fatigue <strong className="text-white font-semibold">{biometrics.fatigueScore}%</strong></span>
              </div>
            </SpotlightCard>

            {/* KPI 2: Sleep Recovery Accumulator */}
            <SpotlightCard className="p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[13px] text-zinc-400 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-[#101721] border border-[#1E293B] text-zinc-300 font-semibold">
                    02
                  </span>
                  <span className="font-sans font-semibold tracking-wide text-white truncate text-xs sm:text-sm">
                    SLEEP RECOVERY ACCUMULATOR
                  </span>
                </div>
                <span className="text-[11px] font-mono text-zinc-500 px-2 py-0.5 rounded bg-[#101721] border border-[#1E293B] shrink-0">
                  Target: 8.0h
                </span>
              </div>

              <div className="my-3 flex items-center justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-baseline gap-1.5">
                    <AnimatedNumber
                      value={biometrics.sleepHours}
                      decimals={1}
                      className="font-sans text-3xl sm:text-4xl font-bold text-white tracking-tight leading-none"
                    />
                    <span className="text-sm text-zinc-400 font-sans">hrs</span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400">
                    <span className="text-sky-400 font-bold">
                      {Math.round((biometrics.sleepHours / 8.0) * 100)}%
                    </span>{' '}
                    Recovery Met
                  </span>
                </div>
                <RadialGauge
                  value={Math.round((biometrics.sleepHours / 8.0) * 100)}
                  size={58}
                  strokeWidth={5}
                  colorVar="#38BDF8"
                />
              </div>

              <div className="text-[11px] text-zinc-400 pt-3 border-t border-[#1E293B] flex items-center justify-between font-mono">
                <span>Deep: <strong className="text-white font-semibold">2.2h</strong></span>
                <span className="text-zinc-600">|</span>
                <span>REM: <strong className="text-white font-semibold">1.9h</strong></span>
                <span className="text-zinc-600">|</span>
                <span>Debt: <strong className="text-rose-400 font-semibold">+{biometrics.sleepDebtHours}h</strong></span>
              </div>
            </SpotlightCard>

            {/* KPI 3: Cognitive Bandwidth Capacity */}
            <SpotlightCard className="p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[13px] text-zinc-400 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-[#101721] border border-[#1E293B] text-zinc-300 font-semibold">
                    03
                  </span>
                  <span className="font-sans font-semibold tracking-wide text-white truncate text-xs sm:text-sm">
                    COGNITIVE BANDWIDTH CAPACITY
                  </span>
                </div>
                <span className="text-[11px] font-mono text-zinc-500 px-2 py-0.5 rounded bg-[#101721] border border-[#1E293B] shrink-0">
                  Prefrontal
                </span>
              </div>

              <div className="my-3 flex items-center justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-baseline gap-1.5">
                    <AnimatedNumber
                      value={100 - biometrics.fatigueScore}
                      decimals={0}
                      suffix="%"
                      className="font-sans text-3xl sm:text-4xl font-bold text-white tracking-tight leading-none"
                    />
                    <span className="text-xs text-zinc-400 font-sans">Realized Capacity</span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400">
                    Stress Surge:{' '}
                    <span className={isStressed ? 'text-rose-400 font-bold' : 'text-zinc-300'}>
                      {biometrics.stressScore} of 100
                    </span>
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-zinc-400 pt-3 border-t border-[#1E293B] flex items-center justify-between font-mono">
                <span>Screen: <strong className="text-white font-semibold">{biometrics.screenTimeHours}h</strong></span>
                <span className="text-zinc-600">|</span>
                <span>Meetings: <strong className="text-white font-semibold">{biometrics.calendarDensityHours}h</strong></span>
                <span className="text-zinc-600">|</span>
                <span>Sentinel: <strong className="text-emerald-400 font-semibold">Active</strong></span>
              </div>
            </SpotlightCard>

            {/* KPI 4: Autonomic System Power */}
            <SpotlightCard className="p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[13px] text-zinc-400 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-[#101721] border border-[#1E293B] text-zinc-300 font-semibold">
                    04
                  </span>
                  <span className="font-sans font-semibold tracking-wide text-white truncate text-xs sm:text-sm">
                    AUTONOMIC SYSTEM POWER
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                  0 Bytes Egress
                </span>
              </div>

              <div className="my-3 flex items-center justify-between gap-3">
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-baseline justify-between">
                    <span className="font-sans text-3xl sm:text-4xl font-bold text-white tracking-tight leading-none">
                      {biometrics.restingHr}
                      <span className="text-xs font-normal text-zinc-400 ml-1">bpm RHR</span>
                    </span>
                    <span className="text-xs font-mono text-sky-400">
                      {biometrics.hrvRmssd} ms HRV
                    </span>
                  </div>
                  <div className="mt-2 w-full">
                    <GrowBar
                      value={Math.max(10, 100 - biometrics.stressScore)}
                      colorVar={isStressed ? '#F43F5E' : '#10B981'}
                      height={6}
                    />
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-zinc-400 pt-3 border-t border-[#1E293B] flex items-center justify-between font-mono">
                <span>3 Decoupled Layers</span>
                <span className="text-zinc-600">|</span>
                <span>SQLite DB</span>
                <span className="text-zinc-600">|</span>
                <span className="text-emerald-400">Strict Gating</span>
              </div>
            </SpotlightCard>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: 60-SECOND AUTOMATED SCRIPT RUNNER
           ========================================================================= */}
        <section id="section-demo" className="rounded-xl bg-[#0B111D] border border-[#1E293B] p-5 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1A2536]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>60-Second Automated Script Runner</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    ALL-IN-ONE
                  </span>
                </h3>
                <p className="text-xs text-zinc-400">
                  {isRunning60s
                    ? `Executing: ${demoPhase} (T+${demoSeconds}s of 60s)`
                    : 'Standby. Click "RUN 60S DEMO" to execute the full biometric, browser & MCP script.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-lg bg-[#111A29] border border-[#1E2B3E] font-mono text-xs text-white">
                [{String(Math.floor(demoSeconds / 60)).padStart(2, '0')}:
                {String(demoSeconds % 60).padStart(2, '0')} of 01:00]
              </div>

              {!isRunning60s ? (
                <button
                  onClick={start60sDemo}
                  className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>RUN 60S DEMO</span>
                </button>
              ) : (
                <button
                  onClick={resetAll}
                  className="px-3 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#2A374A] text-zinc-200 text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Stop & Reset</span>
                </button>
              )}

              {/* State overrides for live inspection */}
              <div className="hidden sm:flex items-center gap-1 ml-2 border-l border-[#1E293B] pl-2">
                <button
                  onClick={() => simulateState('DEEP_FOCUS')}
                  className="px-2 py-1 rounded bg-[#101721] hover:bg-emerald-500/15 border border-[#1E293B] hover:border-emerald-500/30 text-emerald-400 text-[11px] font-mono transition-colors cursor-pointer"
                >
                  Focus
                </button>
                <button
                  onClick={() => simulateState('COGNITIVE_FATIGUE')}
                  className="px-2 py-1 rounded bg-[#101721] hover:bg-amber-500/15 border border-[#1E293B] hover:border-amber-500/30 text-amber-400 text-[11px] font-mono transition-colors cursor-pointer"
                >
                  Fatigue
                </button>
                <button
                  onClick={() => simulateState('HIGH_STRESS')}
                  className="px-2 py-1 rounded bg-[#101721] hover:bg-rose-500/15 border border-[#1E293B] hover:border-rose-500/30 text-rose-400 text-[11px] font-mono transition-colors cursor-pointer"
                >
                  Stress
                </button>
              </div>
            </div>
          </div>

          {/* 3 Step Progress Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
            <div
              className={`p-3 rounded-lg border transition-all ${
                demoPhase === 'PHASE_1_TRIGGER'
                  ? 'bg-sky-500/10 border-sky-500 text-white'
                  : 'bg-[#0E1522] border-[#1E2B3E] text-zinc-400'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono font-semibold">
                <span>01. INGESTION & TRIGGER</span>
                <span>00-15s</span>
              </div>
              <p className="text-[11px] mt-1 text-zinc-400">
                Autonomic state morph to Cognitive Fatigue
              </p>
            </div>

            <div
              className={`p-3 rounded-lg border transition-all ${
                demoPhase === 'PHASE_2_ADAPT'
                  ? 'bg-sky-500/10 border-sky-500 text-white'
                  : 'bg-[#0E1522] border-[#1E2B3E] text-zinc-400'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono font-semibold">
                <span>02. ATTENTION SENTINEL</span>
                <span>15-38s</span>
              </div>
              <p className="text-[11px] mt-1 text-zinc-400">
                Shadow DOM de-clutter & 1.5s friction hold
              </p>
            </div>

            <div
              className={`p-3 rounded-lg border transition-all ${
                demoPhase === 'PHASE_3_ACT'
                  ? 'bg-sky-500/10 border-sky-500 text-white'
                  : 'bg-[#0E1522] border-[#1E2B3E] text-zinc-400'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono font-semibold">
                <span>03. GATED MCP SHIELD</span>
                <span>38-60s</span>
              </div>
              <p className="text-[11px] mt-1 text-zinc-400">
                1-click confirmation card & email draft
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: 3 DECOUPLED ARCHITECTURE ENGINES
           ========================================================================= */}
        <section id="section-biometrics" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>Decoupled Architecture Engines [Layer 01 • 02 • 03]</span>
            </h2>
            <span className="text-[11px] font-mono text-emerald-400">3 of 3 Engines Nominal</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* Engine 1: Biometric Telemetry Vault */}
            <SpotlightCard className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-white tracking-wide">
                      BIOMETRIC TELEMETRY VAULT
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-400 px-1.5 py-0.5 rounded bg-[#101721] border border-[#1E293B]">
                    VAULT-CORE
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 font-mono mt-2">
                  Layer 01 - Local Vault: SQLite/DuckDB [0 Bytes Egress]
                </p>

                <div className="my-4 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-zinc-500 font-mono block">AUTONOMIC STATE</span>
                    <span className="text-xl font-bold text-white font-sans">{biometrics.state}</span>
                  </div>
                  <RadialGauge
                    value={biometrics.fatigueScore}
                    size={48}
                    strokeWidth={4}
                    colorVar={isFatigued ? '#F59E0B' : '#10B981'}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                    <span>Biometric Ingest</span>
                    <span className="text-white">172 of 250 records</span>
                  </div>
                  <GrowBar value={68} colorVar="#10B981" height={4} />
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#1E293B] grid grid-cols-3 gap-2 text-center font-mono text-[11px]">
                <div className="p-2 rounded bg-[#0A101A] border border-[#1A2536]">
                  <span className="text-zinc-500 block text-[9px]">TEMP</span>
                  <span className="text-white font-bold">36.6°C</span>
                </div>
                <div className="p-2 rounded bg-[#0A101A] border border-[#1A2536]">
                  <span className="text-zinc-500 block text-[9px]">RHR</span>
                  <span className="text-white font-bold">{biometrics.restingHr} bpm</span>
                </div>
                <div className="p-2 rounded bg-[#0A101A] border border-[#1A2536]">
                  <span className="text-zinc-500 block text-[9px]">HRV</span>
                  <span className="text-sky-400 font-bold">{biometrics.hrvRmssd}ms</span>
                </div>
              </div>
            </SpotlightCard>

            {/* Engine 2: Agentic Action Server (MCP) */}
            <SpotlightCard className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                    <span className="text-xs font-bold text-white tracking-wide">
                      AGENTIC ACTION SERVER
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-400 px-1.5 py-0.5 rounded bg-[#101721] border border-[#1E293B]">
                    MCP-GATEWAY
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 font-mono mt-2">
                  Layer 02 - Approval Gateway: Python MCP SDK [Strict Gating]
                </p>

                <div className="my-4 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-zinc-500 font-mono block">GATED SAFETY</span>
                    <span className="text-xl font-bold text-sky-400 font-sans">100% GATED</span>
                  </div>
                  <RadialGauge value={100} size={48} strokeWidth={4} colorVar="#38BDF8" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                    <span>Action Pipeline</span>
                    <span className="text-white">{pendingActions.length} pending • {actionReceipts.length} sealed</span>
                  </div>
                  <GrowBar value={pendingActions.length > 0 ? 100 : 25} colorVar="#38BDF8" height={4} />
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#1E293B] grid grid-cols-3 gap-2 text-center font-mono text-[11px]">
                <div className="p-2 rounded bg-[#0A101A] border border-[#1A2536]">
                  <span className="text-zinc-500 block text-[9px]">GATING</span>
                  <span className="text-emerald-400 font-bold">100%</span>
                </div>
                <div className="p-2 rounded bg-[#0A101A] border border-[#1A2536]">
                  <span className="text-zinc-500 block text-[9px]">PENDING</span>
                  <span className="text-amber-400 font-bold">{pendingActions.length} cards</span>
                </div>
                <div className="p-2 rounded bg-[#0A101A] border border-[#1A2536]">
                  <span className="text-zinc-500 block text-[9px]">LATENCY</span>
                  <span className="text-white font-bold">14ms</span>
                </div>
              </div>
            </SpotlightCard>

            {/* Engine 3: Attention Sentinel (Chrome Extension) */}
            <SpotlightCard className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                    <span className="text-xs font-bold text-white tracking-wide">
                      ATTENTION SENTINEL
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-400 px-1.5 py-0.5 rounded bg-[#101721] border border-[#1E293B]">
                    SENTINEL-DOM
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 font-mono mt-2">
                  Layer 03 - Cognitive Load Agent: Manifest V3 [Shadow DOM]
                </p>

                <div className="my-4 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-zinc-500 font-mono block">DOM CLARITY</span>
                    <span className="text-xl font-bold text-purple-400 font-sans">92.9% SHIELD</span>
                  </div>
                  <RadialGauge value={93} size={48} strokeWidth={4} colorVar="#A855F7" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                    <span>DOM Friction Shield</span>
                    <span className="text-white">118 of 168 units</span>
                  </div>
                  <GrowBar value={90} colorVar="#A855F7" height={4} />
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#1E293B] grid grid-cols-3 gap-2 text-center font-mono text-[11px]">
                <div className="p-2 rounded bg-[#0A101A] border border-[#1A2536]">
                  <span className="text-zinc-500 block text-[9px]">ADS BLOCKED</span>
                  <span className="text-white font-bold">14</span>
                </div>
                <div className="p-2 rounded bg-[#0A101A] border border-[#1A2536]">
                  <span className="text-zinc-500 block text-[9px]">READING</span>
                  <span className="text-emerald-400 font-bold">-42%</span>
                </div>
                <div className="p-2 rounded bg-[#0A101A] border border-[#1A2536]">
                  <span className="text-zinc-500 block text-[9px]">FRICTION</span>
                  <span className="text-purple-400 font-bold">1.5s Hold</span>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: CHRONOS 7-DAY TIMELINE & MCP PHYSICAL GATED QUEUE
           ========================================================================= */}
        <section id="section-circadian" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: 7-Day Scrubbable Timeline (8 Cols) */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                <span>Chronos 7-Day Circadian Timeline [Autonomic Waveform & Recovery]</span>
              </h2>
              <span className="text-[11px] font-mono text-zinc-500">Live Scrub Active</span>
            </div>

            <div className="rounded-xl bg-[#090F18] border border-[#1E293B] p-5 shadow-lg">
              <ScrubbableTimeline />
            </div>

            {/* Smart Decision Filter Simulation Card */}
            <div id="section-cognitive" className="rounded-xl bg-[#0B111D] border border-[#1E293B] p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#1A2536]">
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs font-bold text-white tracking-wide">
                    In-Browser Sensory Safeguard: High-Risk Health & Stimulant Decision Filter
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/15 border border-purple-500/30 text-purple-300">
                  Circadian Contraindication Shield
                </span>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                When Autonomic Fatigue exceeds 60% and sleep debt is acute, the Chrome Extension dynamically binds a 1.5s hold-to-confirm barrier over impulsive late-night chemical orders (e.g. unverified stimulant & high-dose nootropic stacks) that would trigger cardiac arrhythmia and destroy restorative sleep.
              </p>

              <div className="p-4 rounded-xl bg-[#070B12] border border-[#1A2536] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-mono text-zinc-500 block">HEALTH CONTRAINDICATION SIMULATION</span>
                  <span className="text-sm font-bold text-white">High-Dose Nootropic & Stimulant Stack ($149.00)</span>
                  <span className="text-[10px] font-mono text-amber-400 block mt-0.5">Cardiac Alert: Tachycardia risk under fatigue (RHR 76 bpm)</span>
                </div>

                {!purchaseBlocked ? (
                  <button
                    onMouseDown={() => setIsHolding(true)}
                    onMouseUp={() => setIsHolding(false)}
                    onTouchStart={() => setIsHolding(true)}
                    onTouchEnd={() => setIsHolding(false)}
                    className="relative overflow-hidden px-6 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer select-none transition-transform active:scale-95 shadow-md"
                  >
                    <div
                      className="absolute inset-0 bg-emerald-500 transition-all"
                      style={{ width: `${holdProgress}%`, opacity: 0.85 }}
                    />
                    <span className="relative z-10">
                      {isHolding ? `Holding (${holdProgress}%)` : 'Hold 1.5s to Override Caution'}
                    </span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Clinical Caution Overridden Consciously</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Gated MCP Physical Approval Queue (4 Cols) */}
          <div id="section-approvals" className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                <span>MCP Action Approval [Strict Gating]</span>
              </h2>
              <button
                onClick={triggerProtectMorning}
                className="text-[11px] font-mono text-sky-400 hover:text-sky-300 hover:underline cursor-pointer"
              >
                + Stage Morning Cards
              </button>
            </div>

            <div className="rounded-xl bg-[#090F18] border border-[#1E293B] p-4 shadow-lg min-h-[420px]">
              <PhysicalCardStack />
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 5: THE SYNAPTIC INTERLOCK AGENTIC FIREWALL
           ========================================================================= */}
        <section id="section-interlock" className="space-y-4">
          <SynapticInterlock />
        </section>

        {/* =========================================================================
            SECTION 6: HARDWARE TELEMETRY LAB & PPG OSCILLOSCOPE
           ========================================================================= */}
        <section id="section-ppg-lab" className="space-y-4">
          <HardwarePPGLab />
        </section>

      </main>

      <ScadaDock
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          const el = document.getElementById(`section-${tab}`);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />
    </>
  );
}
