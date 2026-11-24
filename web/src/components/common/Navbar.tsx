'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Search,
  Sparkles,
  BrainCircuit,
  User,
  LogOut,
  ChevronDown,
  Activity,
  ShieldCheck,
  Zap,
  Home,
  LayoutDashboard,
  Play
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

export function Navbar() {
  const pathname = usePathname();
  const {
    biometrics,
    currentUser,
    logout,
    setCommandPaletteOpen,
    setAICopilotOpen,
    fetchState
  } = useAppStore();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isFatigued = biometrics.state === 'COGNITIVE_FATIGUE';
  const isStressed = biometrics.state === 'HIGH_STRESS';

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#070C15]/85 backdrop-blur-xl border-b border-[#1A2636] text-xs font-sans select-none">
      <div className="w-full px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* Left: Brand & Navigation */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* Glowing bio-harmonic pulse node */}
            <div className="relative w-8 h-8 rounded-lg bg-[#0F1724] border border-[#243347] flex items-center justify-center group-hover:border-sky-400 transition-colors shadow-sm">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isFatigued
                    ? 'bg-amber-400 shadow-[0_0_8px_#F59E0B]'
                    : isStressed
                    ? 'bg-rose-400 shadow-[0_0_8px_#F43F5E]'
                    : 'bg-emerald-400 shadow-[0_0_8px_#10B981]'
                } animate-pulse`}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-cinzel text-sm sm:text-base font-bold tracking-wider text-white leading-tight">
                PULSEPILOT
              </span>
              <span className="text-[9px] font-mono tracking-widest text-sky-400 uppercase leading-none">
                CIRCADIAN COCKPIT
              </span>
            </div>
          </Link>

          {/* Core Route Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                pathname === '/'
                  ? 'bg-[#142032] text-white font-medium border border-sky-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-[#0D1522]'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>

            <Link
              href={currentUser ? "/cockpit" : "/auth"}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                pathname === '/cockpit' || pathname === '/command'
                  ? 'bg-[#142032] text-white font-medium border border-sky-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-[#0D1522]'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Cockpit</span>
            </Link>
          </nav>
        </div>

        {/* Center: Quick Omnibar Search */}
        <div className="flex-1 max-w-md mx-2 sm:mx-4">
          <button
            onClick={() => setCommandPaletteOpen(true)}
            type="button"
            className="w-full h-8 px-3 rounded-lg bg-[#0C121D] hover:bg-[#111A29] border border-[#1E2B3E] hover:border-sky-500/40 text-zinc-400 hover:text-zinc-200 flex items-center justify-between text-xs transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-zinc-500 group-hover:text-sky-400 transition-colors shrink-0" />
              <span className="truncate text-zinc-400 text-[11px] sm:text-xs">
                Search telemetry, biometrics, MCP actions...
              </span>
            </div>
            <span className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-[#172335] text-zinc-400 font-mono text-[10px] border border-zinc-700/60">
              Cmd+K
            </span>
          </button>
        </div>

        {/* Right: AI Copilot (Dashboard only), Demo Mode, Live State & Pilot Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* AI Copilot Button - Strictly available inside dashboard */}
          {pathname === '/cockpit' || pathname === '/command' || pathname === '/demo' ? (
            <button
              type="button"
              onClick={() => setAICopilotOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500/15 via-sky-500/15 to-emerald-500/15 hover:from-indigo-500/25 hover:via-sky-500/25 hover:to-emerald-500/25 border border-sky-500/30 hover:border-sky-400 text-sky-200 font-medium text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm group"
            >
              <BrainCircuit className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Circadian AI Copilot</span>
              <span className="sm:hidden">AI</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </button>
          ) : (
            <Link
              href="/demo"
              className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm group"
            >
              <Play className="w-3.5 h-3.5 text-emerald-400 fill-current group-hover:scale-110 transition-transform" />
              <span>Demo Mode</span>
            </Link>
          )}

          {/* Autonomic State Pill */}
          <div
            className={`hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono text-[11px] ${
              isFatigued
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : isStressed
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            <span>{biometrics.state}</span>
          </div>

          {/* Pilot Auth & Profile Dropdown */}
          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#0E1522] hover:bg-[#141E30] border border-[#1E2B3E] text-zinc-200 text-xs transition-colors cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
                  {currentUser.full_name?.charAt(0) || 'P'}
                </div>
                <span className="hidden sm:inline font-medium text-xs">
                  {currentUser.full_name || 'Pilot'}
                </span>
                <ChevronDown className="w-3 h-3 text-zinc-500" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0B111D] border border-[#1E2B3E] shadow-2xl p-2 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-[#1A2536]">
                    <p className="font-semibold text-white">{currentUser.full_name}</p>
                    <p className="text-[11px] font-mono text-zinc-400 truncate">
                      {currentUser.email}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-[10px] font-mono text-emerald-400">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Local SQLite Enclave</span>
                    </div>
                  </div>
                  <div className="pt-1 border-b border-[#1A2536] pb-1 space-y-0.5">
                    <Link
                      href="/privacy"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-[#141F32] flex items-center gap-2 transition-colors cursor-pointer text-xs"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Privacy Policy (0-Egress)</span>
                    </Link>
                    <Link
                      href="/terms"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-[#141F32] flex items-center gap-2 transition-colors cursor-pointer text-xs"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                      <span>Terms & Operating Charter</span>
                    </Link>
                  </div>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Lock Vault or Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth"
              className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-black font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
