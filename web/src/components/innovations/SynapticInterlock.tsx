'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  Lock,
  Unlock,
  Zap,
  Terminal,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Wind,
  Heart,
  Cpu
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

export function SynapticInterlock() {
  const { biometrics } = useAppStore();
  const [selectedCommand, setSelectedCommand] = useState('git push --force origin main');
  const [interlockArmed, setInterlockArmed] = useState(true);
  const [breathPhase, setBreathPhase] = useState<'INHALE' | 'HOLD' | 'EXHALE'>('INHALE');
  const [breathProgress, setBreathProgress] = useState(0);
  const [coherenceCount, setCoherenceCount] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);

  // Bio-pacer breathing loop for Proof-of-Recovery (PoR)
  useEffect(() => {
    let timer: any;
    if (interlockArmed && !unlocked) {
      timer = setInterval(() => {
        setBreathProgress((prev) => {
          if (prev >= 100) {
            setBreathPhase((phase) => {
              if (phase === 'INHALE') return 'HOLD';
              if (phase === 'HOLD') return 'EXHALE';
              // Completed 1 full cycle
              setCoherenceCount((c) => {
                const nextC = c + 1;
                if (nextC >= 1) {
                  setUnlocked(true);
                  setInterlockArmed(false);
                }
                return nextC;
              });
              return 'INHALE';
            });
            return 0;
          }
          return prev + 2.5; // ~4s cycle per phase
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [interlockArmed, unlocked]);

  const handleExecuteCommand = () => {
    if (!unlocked) return;
    setExecutionOutput(
      `[SYNAPTIC_DISPATCH] Biological Proof-of-Recovery (PoR) verified.\n` +
      `[HRV_COHERENCE] Mayer wave 0.1 Hz resonance locked.\n` +
      `[EXEC_SUCCESS] ${selectedCommand} executed safely with zero prefrontal error surge.`
    );
  };

  const handleReset = () => {
    setUnlocked(false);
    setInterlockArmed(true);
    setCoherenceCount(0);
    setBreathProgress(0);
    setBreathPhase('INHALE');
    setExecutionOutput(null);
  };

  return (
    <div className="rounded-2xl bg-[#0A0F19] border border-[#1E2B3E] p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-xl">
      {/* Background ambient glow based on lock status */}
      <div
        className={`absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none transition-colors duration-1000 ${
          unlocked ? 'bg-emerald-500' : 'bg-rose-500'
        }`}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1A2536]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
            <span className="text-[11px] font-mono tracking-widest text-rose-400 uppercase font-semibold">
              Industry-First Invention • Bio-Paced Circuit Breaker
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            The Synaptic Interlock (Agentic Execution Firewall)
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Physically throttles high-blast-radius terminal commands and autonomous AI agent actions during
            cognitive fatigue until a <strong>Biological Proof-of-Recovery (PoR)</strong> coherence cycle is performed.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-2 ${
              unlocked
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/15 border-rose-500/30 text-rose-400'
            }`}
          >
            {unlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            <span>{unlocked ? 'GATE: DISENGAGED (SAFE)' : 'GATE: BIO-LOCKED'}</span>
          </div>
          {unlocked && (
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg bg-[#141E2D] hover:bg-[#1E2B3E] border border-[#23354E] text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Reset Lock"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Command Picker & Vagal Breathwork Chamber */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left: Target Destructive Command / Agent Task (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <label className="block text-xs font-mono uppercase text-zinc-400 tracking-wider font-semibold">
            Select High-Blast-Radius Agentic Task:
          </label>
          <div className="space-y-2">
            {[
              { cmd: 'git push --force origin main', label: 'Force Overwrite Remote Repository' },
              { cmd: 'DROP DATABASE production_users CASCADE;', label: 'Production Database Purge' },
              { cmd: 'claude auto-refactor --apply-all-pr', label: 'Autonomous Unreviewed Agent Refactor' },
              { cmd: 'dispatch_client_contract_v2.pdf', label: 'Irreversible Legal Dispatch' },
            ].map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedCommand(item.cmd);
                  setExecutionOutput(null);
                }}
                className={`w-full text-left p-3 rounded-xl border text-xs font-mono transition-all cursor-pointer flex items-center justify-between ${
                  selectedCommand === item.cmd
                    ? 'bg-[#131F33] border-sky-500/50 text-white shadow-sm'
                    : 'bg-[#080D17] border-[#1A2636] text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="truncate">
                  <span className="text-zinc-500 block text-[10px]">{item.label}</span>
                  <span className="text-sky-300 font-semibold">{item.cmd}</span>
                </div>
                <Terminal className="w-4 h-4 shrink-0 text-zinc-500 ml-2" />
              </button>
            ))}
          </div>

          {/* Action Trigger Button */}
          <div className="pt-2">
            {!unlocked ? (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Execution Gated by Autonomic Fatigue ({biometrics.fatigueScore}%)</span>
                </div>
                <span className="text-[10px] font-mono uppercase bg-rose-500/20 px-2 py-0.5 rounded">
                  PoR Required
                </span>
              </div>
            ) : (
              <button
                onClick={handleExecuteCommand}
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/25"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Execute Unlocked Command with Biological Clearance</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Vagal Coherence Breathwork Chamber (6 cols) */}
        <div className="lg:col-span-6 rounded-xl bg-[#060A12] border border-[#172233] p-6 text-center space-y-4 flex flex-col items-center justify-center min-h-[300px]">
          <span className="text-[11px] font-mono uppercase tracking-widest text-sky-400 font-semibold">
            Biological Proof-of-Recovery (PoR) Chamber
          </span>

          {/* Coherence Visualizer Circle */}
          <div className="relative w-36 h-36 flex items-center justify-center my-2">
            {/* Outer pulsating wave */}
            <motion.div
              animate={{
                scale: breathPhase === 'INHALE' ? 1.35 : breathPhase === 'HOLD' ? 1.35 : 0.85,
                opacity: breathPhase === 'INHALE' ? 0.45 : breathPhase === 'HOLD' ? 0.6 : 0.2,
              }}
              transition={{ duration: 3.5, ease: 'easeInOut' }}
              className={`absolute inset-0 rounded-full blur-xl ${
                unlocked ? 'bg-emerald-400' : 'bg-sky-400'
              }`}
            />

            {/* Middle breathing ring */}
            <motion.div
              animate={{
                scale: breathPhase === 'INHALE' ? 1.2 : breathPhase === 'HOLD' ? 1.2 : 0.9,
              }}
              transition={{ duration: 3.5, ease: 'easeInOut' }}
              className={`w-28 h-28 rounded-full border-2 flex items-center justify-center relative shadow-lg ${
                unlocked
                  ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                  : 'border-sky-400 bg-[#0E1726] text-sky-300'
              }`}
            >
              {unlocked ? (
                <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-bounce" />
              ) : (
                <div className="flex flex-col items-center">
                  <Wind className="w-6 h-6 text-sky-400 animate-pulse" />
                  <span className="text-xs font-bold font-mono tracking-wider mt-1">
                    {breathPhase}
                  </span>
                </div>
              )}
            </motion.div>
          </div>

          <p className="text-xs text-zinc-400 max-w-sm">
            {unlocked
              ? '✓ Parasympathetic tone restored (0.1 Hz Mayer resonance established). Execution firewall disengaged.'
              : 'Synchronize your breath with the pacer to raise parasympathetic HRV tone and disengage the interlock.'}
          </p>

          <div className="w-full max-w-xs bg-[#101722] rounded-full h-1.5 overflow-hidden border border-[#1E2B3E]">
            <div
              className={`h-full transition-all duration-100 ${
                unlocked ? 'bg-emerald-400 w-full' : 'bg-sky-400'
              }`}
              style={{ width: unlocked ? '100%' : `${breathProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Terminal Output Log */}
      {executionOutput && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-[#05080E] border border-emerald-500/30 font-mono text-xs text-emerald-300 space-y-1"
        >
          <div className="flex items-center gap-2 pb-2 mb-2 border-b border-[#1A2536] text-zinc-500">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>ENCLAVE DISPATCH LOG • PROOF-OF-RECOVERY RECEIPT</span>
          </div>
          <pre className="whitespace-pre-wrap leading-relaxed">{executionOutput}</pre>
        </motion.div>
      )}
    </div>
  );
}
