import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, X, Activity, Radio, FastForward } from 'lucide-react';
import { PersonalState } from '../../types';

interface DemoDirectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentState: PersonalState;
  onSimulateState: (state: PersonalState | null) => Promise<void>;
  onTriggerMorningProtection: () => Promise<void>;
}

export const DemoDirector: React.FC<DemoDirectorProps> = ({
  isOpen,
  onClose,
  currentState,
  onSimulateState,
  onTriggerMorningProtection,
}) => {
  const [isRunning60s, setIsRunning60s] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [demoPhase, setDemoPhase] = useState<'IDLE' | 'TRIGGER' | 'ADAPT' | 'ACT'>('IDLE');

  // Scripted 60-second automated demo
  useEffect(() => {
    let interval: any;
    if (isRunning60s) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => {
          const next = prev + 1;
          // Phase 1 (0:00 - 0:15): TRIGGER (Cognitive Fatigue)
          if (next === 1) {
            setDemoPhase('TRIGGER');
            onSimulateState('COGNITIVE_FATIGUE');
          }
          // Phase 2 (0:15 - 0:38): ADAPT (In-Browser Cognitive Load & Impulse Filter)
          else if (next === 15) {
            setDemoPhase('ADAPT');
          }
          // Phase 3 (0:38 - 0:60): ACT (Protect Morning MCP Tool Flow)
          else if (next === 38) {
            setDemoPhase('ACT');
            onTriggerMorningProtection();
          } else if (next >= 60) {
            setIsRunning60s(false);
            setDemoPhase('IDLE');
            clearInterval(interval);
            return 60;
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning60s, onSimulateState, onTriggerMorningProtection]);

  const handleStart60sDemo = () => {
    setSecondsElapsed(0);
    setIsRunning60s(true);
  };

  const handleStopDemo = () => {
    setIsRunning60s(false);
    setSecondsElapsed(0);
    setDemoPhase('IDLE');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        className="fixed top-16 right-6 z-50 w-96 bg-hud-surface-elevated border-2 border-hud-accent p-4 rounded-[2px] shadow-2xl font-mono select-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-hud-border pb-2 mb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-hud-accent animate-pulse" />
            <h3 className="font-serif text-base font-bold text-hud-text-primary">
              Demo Director
            </h3>
            <span className="text-[10px] px-1 py-0.5 rounded-[2px] bg-hud-status-badge text-hud-accent border border-hud-border">
              HOTKEY: D
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-hud-text-muted hover:text-hud-text-primary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 60s Scripted Run Hero Card */}
        <div className="p-3 bg-hud-bg/90 border border-hud-border rounded-[2px] mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] tracking-widest text-hud-text-secondary uppercase font-semibold">
              ONE-CLICK SCRIPTED 60S DEMO
            </span>
            <div className="font-mono text-xs font-bold text-hud-accent">
              [{String(Math.floor(secondsElapsed / 60)).padStart(2, '0')}:
              {String(secondsElapsed % 60).padStart(2, '0')} / 01:00]
            </div>
          </div>

          <div className="text-xs text-hud-text-primary mb-2.5">
            Current Stage:{' '}
            <span className="font-bold text-hud-accent">
              {demoPhase === 'IDLE' && 'Ready for Launch'}
              {demoPhase === 'TRIGGER' && '0:00-0:15 TRIGGER (Degraded Sleep Ingested)'}
              {demoPhase === 'ADAPT' && '0:15-0:38 ADAPT (Browser Cognitive Mode & Shield)'}
              {demoPhase === 'ACT' && '0:38-0:60 ACT (Protect My Morning MCP Gated Flow)'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isRunning60s ? (
              <button
                onClick={handleStart60sDemo}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-[2px] bg-hud-accent text-hud-bg font-mono text-xs font-bold hover:brightness-110 active:scale-95 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                RUN 60-SECOND DEMO
              </button>
            ) : (
              <button
                onClick={handleStopDemo}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-[2px] bg-red-600 text-white font-mono text-xs font-bold hover:bg-red-500 transition-all"
              >
                HALT DEMO SCRIPT
              </button>
            )}
          </div>
        </div>

        {/* State Toggle Simulator */}
        <div className="space-y-1.5">
          <span className="text-[10px] tracking-widest text-hud-text-secondary uppercase font-semibold block mb-1">
            MANUAL BIOMETRIC STATE OVERRIDES
          </span>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => onSimulateState('COGNITIVE_FATIGUE')}
              className={`p-2 rounded-[2px] border text-left text-xs transition-all ${
                currentState === 'COGNITIVE_FATIGUE'
                  ? 'border-[#E08838] bg-[#E08838]/15 text-[#E08838] font-bold'
                  : 'border-hud-border/70 text-hud-text-secondary hover:text-hud-text-primary'
              }`}
            >
              COGNITIVE_FATIGUE
            </button>

            <button
              onClick={() => onSimulateState('DEEP_FOCUS')}
              className={`p-2 rounded-[2px] border text-left text-xs transition-all ${
                currentState === 'DEEP_FOCUS'
                  ? 'border-[#2EE6A8] bg-[#2EE6A8]/15 text-[#2EE6A8] font-bold'
                  : 'border-hud-border/70 text-hud-text-secondary hover:text-hud-text-primary'
              }`}
            >
              DEEP_FOCUS
            </button>

            <button
              onClick={() => onSimulateState('HIGH_STRESS')}
              className={`p-2 rounded-[2px] border text-left text-xs transition-all ${
                currentState === 'HIGH_STRESS'
                  ? 'border-[#FF4B55] bg-[#FF4B55]/15 text-[#FF4B55] font-bold'
                  : 'border-hud-border/70 text-hud-text-secondary hover:text-hud-text-primary'
              }`}
            >
              HIGH_STRESS
            </button>

            <button
              onClick={() => onSimulateState('NEUTRAL')}
              className={`p-2 rounded-[2px] border text-left text-xs transition-all ${
                currentState === 'NEUTRAL'
                  ? 'border-[#8BAA9E] bg-[#8BAA9E]/15 text-[#8BAA9E] font-bold'
                  : 'border-hud-border/70 text-hud-text-secondary hover:text-hud-text-primary'
              }`}
            >
              NEUTRAL
            </button>
          </div>

          <button
            onClick={() => onSimulateState(null)}
            className="w-full mt-2 py-1.5 px-3 rounded-[2px] border border-hud-border flex items-center justify-center gap-1 text-xs text-hud-text-muted hover:text-hud-text-primary transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset to Live Biometric Telemetry
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
