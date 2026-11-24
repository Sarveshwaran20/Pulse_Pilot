'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Mail,
  User,
  KeyRound,
  Moon,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertCircle,
  Database
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Navbar } from '@/components/common/Navbar';

export default function AuthPage() {
  const router = useRouter();
  const { login, register, authLoading, currentUser } = useAppStore();

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [targetSleep, setTargetSleep] = useState(8.0);
  const [focusGoal, setFocusGoal] = useState(4.0);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const res = await login(email, password);
    if (res.success) {
      setSuccess('Vault unlocked successfully. Loading Circadian Cockpit...');
      setTimeout(() => router.push('/cockpit'), 700);
    } else {
      setError(res.error || 'Invalid credentials');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const res = await register({
      email,
      password,
      full_name: fullName,
      target_sleep_hours: targetSleep,
      focus_goal_hours: focusGoal,
    });

    if (res.success) {
      setSuccess('Profile initialized in local SQLite. Redirecting to Cockpit...');
      setTimeout(() => router.push('/cockpit'), 700);
    } else {
      setError(res.error || 'Registration failed');
    }
  };

  const handleQuickDemo = async () => {
    setEmail('pilot@pulsepilot.local');
    setPassword('demo123');
    setError(null);
    setSuccess('Logging in as verified Demo Pilot...');
    const res = await login('pilot@pulsepilot.local', 'demo123');
    if (res.success) {
      setTimeout(() => router.push('/cockpit'), 600);
    } else {
      setError(res.error || 'Could not log in as demo pilot');
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-24 pb-20 px-4 flex items-center justify-center font-sans">
        <div className="w-full max-w-md">
          {/* Brand Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#141C2B] border border-[#243347] text-sky-400 mb-3 shadow-lg shadow-sky-500/5">
              <Database className="w-6 h-6 animate-pulse" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              PulsePilot Enclave Access
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1.5">
              Local-first biological intelligence • On-device SQLite encryption
            </p>
          </div>

          {/* Card Container */}
          <div className="rounded-2xl bg-[#0C121D]/90 border border-[#1E293B] shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
            {/* Top decorative accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500" />

            {/* Context Notice */}
            <div className="mb-5 p-3 rounded-xl bg-sky-500/10 border border-sky-500/25 text-sky-300 text-xs flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Sign in or create a profile to unlock the Circadian Cockpit</span>
            </div>

            {/* Mode Tabs */}
            <div className="grid grid-cols-2 p-1 bg-[#070B12] rounded-xl border border-[#1A2536] mb-6 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                  setSuccess(null);
                }}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-[#182335] text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Sign In to Vault
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                  setSuccess(null);
                }}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-[#182335] text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Create Profile
              </button>
            </div>

            {/* Feedback messages */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{success}</span>
              </div>
            )}

            {/* Quick Demo Pill */}
            <div className="mb-6">
              <button
                type="button"
                onClick={handleQuickDemo}
                disabled={authLoading}
                className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-sky-500/15 to-indigo-500/15 hover:from-sky-500/25 hover:to-indigo-500/25 border border-sky-500/30 text-sky-300 text-xs font-semibold flex items-center justify-between transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                  <span>1-Click Demo Pilot: Sarvesh K.</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                  Instant Access
                </span>
              </button>
            </div>

            <div className="relative flex items-center justify-center mb-6">
              <div className="border-t border-[#1E293B] w-full" />
              <span className="bg-[#0C121D] px-3 text-[11px] font-mono text-zinc-500 uppercase tracking-widest absolute">
                Or Enter Details
              </span>
            </div>

            {/* Forms */}
            {mode === 'signin' ? (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Pilot Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="pilot@pulsepilot.local"
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-[#090E17] border border-[#1E293B] rounded-lg text-white text-xs sm:text-sm focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Master Password
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-[#090E17] border border-[#1E293B] rounded-lg text-white text-xs sm:text-sm focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full mt-2 py-2.5 px-4 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-black font-semibold text-xs sm:text-sm rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-sky-500/20"
                >
                  <span>{authLoading ? 'Authenticating...' : 'Unlock Vault'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Sarvesh K."
                      required
                      className="w-full pl-9 pr-3 py-2 bg-[#090E17] border border-[#1E293B] rounded-lg text-white text-xs focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="pilot@pulsepilot.local"
                      required
                      className="w-full pl-9 pr-3 py-2 bg-[#090E17] border border-[#1E293B] rounded-lg text-white text-xs focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Set Vault Password
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      required
                      minLength={6}
                      className="w-full pl-9 pr-3 py-2 bg-[#090E17] border border-[#1E293B] rounded-lg text-white text-xs focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-400 mb-1 flex items-center gap-1">
                      <Moon className="w-3 h-3 text-sky-400" />
                      <span>Target Sleep</span>
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="4"
                      max="12"
                      value={targetSleep}
                      onChange={(e) => setTargetSleep(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 bg-[#090E17] border border-[#1E293B] rounded-lg text-white text-xs focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-zinc-400 mb-1 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      <span>Focus Goal (hrs)</span>
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      max="10"
                      value={focusGoal}
                      onChange={(e) => setFocusGoal(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 bg-[#090E17] border border-[#1E293B] rounded-lg text-white text-xs focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full mt-3 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold text-xs sm:text-sm rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <span>{authLoading ? 'Registering...' : 'Initialize Biometric Profile'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Privacy footer guarantee */}
            <div className="mt-6 pt-4 border-t border-[#1E293B] flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero-Egress Protocol</span>
              </span>
              <span>Local SQLite Storage</span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
