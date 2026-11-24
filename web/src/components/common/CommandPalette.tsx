'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Activity, Shield, Clock, Compass, Zap } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { PersonalState } from '@/lib/tokens';

export function CommandPalette() {
  const router = useRouter();
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    biometrics,
    simulateState,
    triggerProtectMorning,
  } = useAppStore();

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const actions = [
    {
      id: 'state-fatigue',
      title: 'Force State: COGNITIVE_FATIGUE (Demo Trigger)',
      category: 'BIOMETRIC STATE',
      run: () => simulateState('COGNITIVE_FATIGUE'),
    },
    {
      id: 'state-focus',
      title: 'Force State: DEEP_FOCUS (Peak Flow)',
      category: 'BIOMETRIC STATE',
      run: () => simulateState('DEEP_FOCUS'),
    },
    {
      id: 'state-stress',
      title: 'Force State: HIGH_STRESS (Autonomic Surge)',
      category: 'BIOMETRIC STATE',
      run: () => simulateState('HIGH_STRESS'),
    },
    {
      id: 'state-neutral',
      title: 'Reset to Live Vault Telemetry',
      category: 'BIOMETRIC STATE',
      run: () => simulateState(null),
    },
    {
      id: 'mcp-morning',
      title: 'Trigger "Protect My Morning" MCP Workflow',
      category: 'AGENT ACTIONS',
      run: () => triggerProtectMorning(),
    },
    {
      id: 'nav-command',
      title: 'Navigate: Command Center Dashboard',
      category: 'NAVIGATION',
      run: () => router.push('/command'),
    },
    {
      id: 'nav-demo',
      title: 'Navigate: Full-Screen 60s Demo Director',
      category: 'NAVIGATION',
      run: () => router.push('/demo'),
    },
    {
      id: 'nav-shop',
      title: 'Open Stimulant Test Store (In-Browser Decision Shield)',
      category: 'TEST PAGES',
      run: () => window.open('http://127.0.0.1:8000/test/shop', '_blank'),
    },
  ];

  const filtered = actions.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="w-full max-w-xl bg-hud-surface1 border border-white/20 rounded-[2px] shadow-2xl overflow-hidden font-mono"
        >
          {/* Input Header */}
          <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
            <Search className="w-4 h-4 text-hud-accent" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type an action or command..."
              className="flex-1 bg-transparent text-sm text-hud-inkPrimary placeholder-hud-inkMuted focus:outline-none font-mono"
            />
            <button
              onClick={() => setCommandPaletteOpen(false)}
              className="text-hud-inkMuted hover:text-hud-inkPrimary text-xs"
            >
              [ESC]
            </button>
          </div>

          {/* Action List */}
          <div className="max-h-80 overflow-y-auto p-2 divide-y divide-white/5">
            {filtered.length === 0 ? (
              <div className="p-4 text-center text-xs text-hud-inkMuted">
                No matching commands found.
              </div>
            ) : (
              filtered.map((action) => (
                <button
                  key={action.id}
                  onClick={() => {
                    action.run();
                    setCommandPaletteOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-2.5 text-left rounded-[2px] hover:bg-hud-surface2 hover:border-hud-accent/40 text-xs transition-colors group"
                >
                  <span className="font-mono text-hud-inkPrimary group-hover:text-hud-accent">
                    {action.title}
                  </span>
                  <span className="text-[10px] text-hud-inkMuted uppercase">
                    {action.category}
                  </span>
                </button>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
