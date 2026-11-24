'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';

export interface DockModule {
  id: string;
  label: string;
  fullTitle: string;
  key: string;
  accentColor: string;
  pipColor: string;
  icon: React.ReactNode;
}

interface ScadaDockProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

export const SCADA_MODULES: DockModule[] = [
  {
    id: 'vitals',
    label: 'Vitals',
    fullTitle: 'Live Autonomic & Circadian KPIs',
    key: '1',
    accentColor: 'text-sky-400',
    pipColor: 'bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.95)]',
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path strokeLinecap="round" strokeLinejoin="round" d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    id: 'circadian',
    label: 'Circadian',
    fullTitle: 'Chronos 7-Day Circadian Timeline',
    key: '2',
    accentColor: 'text-emerald-400',
    pipColor: 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.95)]',
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
      </svg>
    ),
  },
  {
    id: 'biometrics',
    label: 'Biometrics',
    fullTitle: 'Decoupled Local Ingest Architecture',
    key: '3',
    accentColor: 'text-cyan-400',
    pipColor: 'bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.95)]',
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
        <rect x="3" y="14" width="18" height="7" rx="2" strokeLinecap="round" />
        <circle cx="7" cy="17.5" r="1" fill="currentColor" />
        <circle cx="11" cy="17.5" r="1" fill="currentColor" />
        <circle cx="15" cy="17.5" r="1" fill="currentColor" />
        <path strokeLinecap="round" d="M12 14V8m-4 3a6 6 0 018 0m-6-4a9 9 0 0110 0" />
      </svg>
    ),
  },
  {
    id: 'cognitive',
    label: 'Cognitive',
    fullTitle: 'In-Browser Sensory Filter & Decision Safeguard',
    key: '4',
    accentColor: 'text-purple-400',
    pipColor: 'bg-purple-400 shadow-[0_0_12px_rgba(192,132,252,0.95)]',
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    id: 'approvals',
    label: 'Approvals',
    fullTitle: 'MCP Gated Agent Physical Approval Queue',
    key: '5',
    accentColor: 'text-indigo-400',
    pipColor: 'bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.95)]',
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3 3L22 4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    id: 'interlock',
    label: 'Interlock',
    fullTitle: 'Synaptic Interlock Biological Circuit Breaker',
    key: '6',
    accentColor: 'text-rose-400',
    pipColor: 'bg-rose-400 shadow-[0_0_12px_rgba(251,113,133,0.95)]',
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    id: 'ppg-lab',
    label: 'PPG Lab',
    fullTitle: 'Live Optical PPG Hardware Oscilloscope',
    key: '7',
    accentColor: 'text-teal-400',
    pipColor: 'bg-teal-400 shadow-[0_0_12px_rgba(45,212,191,0.95)]',
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
        <circle cx="12" cy="12" r="3" />
        <path strokeLinecap="round" d="M4.93 4.93a10 10 0 0 1 14.14 0M7.76 7.76a6 6 0 0 1 8.48 0" />
      </svg>
    ),
  },
  {
    id: 'demo',
    label: '60s Demo',
    fullTitle: '60-Second Full Autonomic Script Runner',
    key: '8',
    accentColor: 'text-amber-400',
    pipColor: 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.95)]',
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z" />
      </svg>
    ),
  },
];

export const ScadaDock: React.FC<ScadaDockProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
      <nav
        aria-label="SCADA Operational Modules Floating Dock"
        className="pointer-events-auto relative flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 px-3 sm:px-4 rounded-3xl sm:rounded-full bg-[#080d17]/95 backdrop-blur-2xl border border-white/[0.16] shadow-[0_24px_70px_rgba(0,0,0,0.85),0_0_40px_rgba(59,130,246,0.22),inset_0_1px_0_rgba(255,255,255,0.2)] max-w-[calc(100vw-24px)] overflow-x-auto no-scrollbar scroll-smooth"
      >
        {SCADA_MODULES.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`group relative flex flex-col items-center justify-center px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl sm:rounded-full transition-all duration-200 cursor-pointer select-none shrink-0 ${
                isActive ? tab.accentColor : 'text-zinc-400 hover:text-white'
              }`}
              title={`${tab.fullTitle} (Press ${tab.key})`}
            >
              {/* Active Capsule Glass Highlight */}
              {isActive && (
                <motion.div
                  layoutId="scada-dock-active-bg"
                  className="absolute inset-0 rounded-2xl sm:rounded-full bg-white/[0.12] border border-white/[0.22] shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_20px_rgba(0,0,0,0.5)] pointer-events-none"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
                />
              )}

              {/* Module Logo / Icon */}
              <div className="relative z-10 transition-transform duration-200 group-hover:-translate-y-1 group-hover:scale-110 flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7">
                {tab.icon}
              </div>

              {/* Label */}
              <span
                className={`relative z-10 text-[10px] sm:text-[11px] font-semibold tracking-normal mt-1 transition-colors ${
                  isActive ? 'text-white font-bold' : 'text-zinc-400 group-hover:text-zinc-200'
                }`}
              >
                {tab.label}
              </span>

              {/* Glowing Neon Status Pip */}
              <div className="h-1.5 flex items-center justify-center mt-0.5">
                {isActive ? (
                  <motion.span
                    layoutId="scada-dock-active-pip"
                    className={`w-1.5 h-1.5 rounded-full ${tab.pipColor}`}
                    transition={{ type: 'spring', bounce: 0.25, duration: 0.35 }}
                  />
                ) : (
                  <span className="w-1.5 h-1.5 opacity-0" />
                )}
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
