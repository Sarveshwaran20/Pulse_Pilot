import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Sliders,
  Shield,
  Zap,
  Calendar,
  Layers,
  ChevronRight,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

import { PersonalState, PersonalStateResponse, TimelineResponse, PendingAction, ActionReceipt } from './types';
import { applyTheme } from './styles/themes';
import { PulseOrb } from './components/cockpit/PulseOrb';
import { ArcGauge } from './components/cockpit/ArcGauge';
import { ECGTimeline } from './components/cockpit/ECGTimeline';
import { SleepDebtBar } from './components/cockpit/SleepDebtBar';
import { BentoPod } from './components/cockpit/BentoGrid';
import { ApprovalCard } from './components/mcp/ApprovalCard';
import { HistoryRail } from './components/mcp/HistoryRail';
import { DemoDirector } from './components/demo/DemoDirector';
import { BootSequence } from './components/cockpit/BootSequence';

const VAULT_URL = 'http://127.0.0.1:8000';
const MCP_BRIDGE_URL = 'http://127.0.0.1:8002';

export const App: React.FC = () => {
  const [isBooting, setIsBooting] = useState(true);
  const [stateData, setStateData] = useState<PersonalStateResponse | null>(null);
  const [timelineData, setTimelineData] = useState<TimelineResponse | null>(null);
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  const [actionReceipts, setActionReceipts] = useState<ActionReceipt[]>([]);
  const [isDemoDirectorOpen, setIsDemoDirectorOpen] = useState(false);
  const [isStateMorphing, setIsStateMorphing] = useState(false);

  // Fetch state from Vault
  const fetchState = useCallback(async () => {
    try {
      const res = await fetch(`${VAULT_URL}/state`);
      if (res.ok) {
        const data: PersonalStateResponse = await res.json();
        setStateData((prev) => {
          if (prev && prev.state !== data.state) {
            // Trigger state morph radial wipe
            setIsStateMorphing(true);
            setTimeout(() => setIsStateMorphing(false), 850);
          }
          return data;
        });
        applyTheme(data.state);
      }
    } catch (err) {
      console.warn('Vault offline or loading:', err);
    }
  }, []);

  // Fetch timeline from Vault
  const fetchTimeline = useCallback(async () => {
    try {
      const res = await fetch(`${VAULT_URL}/timeline`);
      if (res.ok) {
        const data = await res.json();
        setTimelineData(data);
      }
    } catch (err) {
      console.warn('Timeline offline:', err);
    }
  }, []);

  // Fetch MCP pending actions and receipts
  const fetchMCPQueue = useCallback(async () => {
    try {
      const [pendingRes, receiptsRes] = await Promise.all([
        fetch(`${MCP_BRIDGE_URL}/actions/pending`),
        fetch(`${MCP_BRIDGE_URL}/actions/receipts`),
      ]);
      if (pendingRes.ok) {
        const pending = await pendingRes.json();
        setPendingActions(pending);
      }
      if (receiptsRes.ok) {
        const receipts = await receiptsRes.json();
        setActionReceipts(receipts);
      }
    } catch (err) {
      // MCP server loading
    }
  }, []);

  // Poll intervals
  useEffect(() => {
    fetchState();
    fetchTimeline();
    fetchMCPQueue();

    const interval = setInterval(() => {
      fetchState();
      fetchMCPQueue();
    }, 1500);

    return () => clearInterval(interval);
  }, [fetchState, fetchTimeline, fetchMCPQueue]);

  // Hotkey 'D' listener for Demo Director
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'd' || e.key === 'D') {
        if (!['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
          setIsDemoDirectorOpen((prev) => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle action approval
  const handleApproveAction = async (actionId: string, updatedParams?: Record<string, any>) => {
    try {
      const res = await fetch(`${MCP_BRIDGE_URL}/actions/approve/${actionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updated_params: updatedParams }),
      });
      if (res.ok) {
        fetchMCPQueue();
      }
    } catch (err) {
      console.error('Approval failed:', err);
    }
  };

  // Handle action rejection
  const handleRejectAction = async (actionId: string) => {
    try {
      await fetch(`${MCP_BRIDGE_URL}/actions/reject/${actionId}`, {
        method: 'POST',
      });
      fetchMCPQueue();
    } catch (err) {
      console.error('Rejection failed:', err);
    }
  };

  // State simulate override
  const handleSimulateState = async (targetState: PersonalState | null) => {
    try {
      if (!targetState) {
        await fetch(`${VAULT_URL}/simulate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reset_to_live: true }),
        });
      } else {
        await fetch(`${VAULT_URL}/simulate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ state: targetState }),
        });
      }
      fetchState();
    } catch (err) {
      console.error('Simulation toggle failed:', err);
    }
  };

  // Trigger "Protect My Morning" MCP workflow
  const handleTriggerMorningProtection = async () => {
    try {
      await fetch(`${MCP_BRIDGE_URL}/workflow/protect-morning`, {
        method: 'POST',
      });
      fetchMCPQueue();
    } catch (err) {
      console.error('Workflow trigger failed:', err);
    }
  };

  const currentState = stateData?.state || 'NEUTRAL';

  return (
    <div className="min-h-screen bg-hud-bg cockpit-grid cockpit-grain text-hud-text-primary flex flex-col relative select-none">
      {/* Boot sequence overlay */}
      <AnimatePresence>
        {isBooting && <BootSequence onComplete={() => setIsBooting(false)} />}
      </AnimatePresence>

      {/* State Morph Radial Wipe */}
      <AnimatePresence>
        {isStateMorphing && (
          <motion.div
            initial={{ opacity: 0.8, scale: 0.3 }}
            animate={{ opacity: 0, scale: 2.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="state-wipe"
          />
        )}
      </AnimatePresence>

      {/* Demo Director Floating Modal */}
      <DemoDirector
        isOpen={isDemoDirectorOpen}
        onClose={() => setIsDemoDirectorOpen(false)}
        currentState={currentState}
        onSimulateState={handleSimulateState}
        onTriggerMorningProtection={handleTriggerMorningProtection}
      />

      {/* Top Cockpit Telemetry Banner */}
      <header className="border-b border-hud-border/60 bg-hud-surface/80 backdrop-blur-sm px-6 py-2.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-hud-accent shadow-[0_0_8px_var(--hud-accent)]" />
          <h1 className="font-serif text-lg font-bold tracking-wider text-hud-text-primary">
            PULSEPILOT <span className="text-hud-accent text-sm font-mono font-normal">// CIRCADIAN COCKPIT</span>
          </h1>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded-[2px] bg-hud-status-badge text-hud-accent border border-hud-border">
            LOCAL-FIRST ENCLAVE ACTIVE
          </span>
        </div>

        {/* Global HUD Status & Demo Hotkey Button */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-2 text-hud-text-secondary">
            <span>VAULT:</span>
            <span className="text-hud-accent font-semibold">127.0.0.1:8000 (0 EGRESS)</span>
          </div>

          <button
            onClick={() => setIsDemoDirectorOpen(true)}
            className="flex items-center gap-1.5 py-1 px-2.5 rounded-[2px] border border-hud-accent text-hud-accent hover:bg-hud-accent/15 transition-all text-xs font-semibold"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>DEMO DIRECTOR [D]</span>
          </button>
        </div>
      </header>

      {/* Main Bento Cockpit Grid */}
      <main className="flex-1 p-6 grid grid-cols-12 gap-5 max-w-[1600px] w-full mx-auto">
        {/* COL 1-4: The Biological HUD & Pulse Orb */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">
          {/* Hero State Indicator & Organism */}
          <BentoPod
            idPrefix="01 // BIOMETRIC ORGANISM"
            title="Autonomic Equilibrium"
            statusBadge={stateData?.is_simulated ? 'SIMULATED' : 'LIVE TELEMETRY'}
          >
            <div className="flex flex-col items-center justify-center py-2">
              <PulseOrb
                restingHr={stateData?.resting_hr || 65}
                stressScore={stateData?.stress_score || 40}
                state={currentState}
                size={260}
              />

              {/* State Title Banner */}
              <div className="w-full mt-3 p-3 bg-hud-bg/70 border border-hud-border rounded-[2px] text-center">
                <span className="text-[10px] font-mono tracking-widest text-hud-text-secondary uppercase">
                  CLASSIFIED PERSONAL STATE
                </span>
                <h2 className="font-serif text-2xl font-bold tracking-wide text-hud-accent mt-0.5">
                  {currentState}
                </h2>
                <p className="font-mono text-xs text-hud-text-secondary mt-1">
                  {stateData?.headline || 'Nominal autonomic baseline'}
                </p>
              </div>
            </div>
          </BentoPod>

          {/* Sleep Reserve & Recovery Pod */}
          <BentoPod idPrefix="02 // CIRCADIAN RESERVE" title="Sleep Stages & Debt">
            <SleepDebtBar
              sleepHours={stateData?.sleep_hours || 7.0}
              sleepDebtHours={stateData?.sleep_debt_hours || 1.2}
            />

            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-hud-border/40 font-mono text-xs">
              <div>
                <span className="text-[10px] text-hud-text-muted block">HRV (RMSSD)</span>
                <span className="text-hud-text-primary font-bold text-sm">
                  {stateData?.hrv_rmssd || 52} ms
                </span>
              </div>
              <div>
                <span className="text-[10px] text-hud-text-muted block">SCREEN TIME</span>
                <span className="text-hud-text-primary font-bold text-sm">
                  {stateData?.screen_time_hours || 4.5} h
                </span>
              </div>
            </div>
          </BentoPod>
        </div>

        {/* COL 5-8: Precision Arc Gauges & ECG Telemetry */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">
          {/* Dual Precision Arc Tachometers */}
          <BentoPod idPrefix="03 // COGNITIVE METRICS" title="Neural Load Indices">
            <div className="grid grid-cols-2 gap-2">
              <ArcGauge
                value={stateData?.focus_score ?? 65}
                title="FOCUS INDEX"
                statusLabel={stateData?.focus_score && stateData.focus_score > 70 ? 'OPTIMAL' : 'REDUCED'}
                color="var(--hud-accent)"
              />
              <ArcGauge
                value={stateData?.fatigue_score ?? 35}
                title="FATIGUE LOAD"
                statusLabel={stateData?.fatigue_score && stateData.fatigue_score > 60 ? 'DEPLETED' : 'NOMINAL'}
                color={stateData?.fatigue_score && stateData.fatigue_score > 60 ? '#E08838' : 'var(--hud-accent)'}
              />
            </div>
          </BentoPod>

          {/* Realtime Lead-II ECG Waveform */}
          <BentoPod idPrefix="04 // CARDIAC TEMPO" title="ECG Physiological Wave">
            <ECGTimeline
              restingHr={stateData?.resting_hr || 65}
              stressScore={stateData?.stress_score || 40}
              state={currentState}
            />
          </BentoPod>

          {/* Active Biological Protections */}
          <BentoPod idPrefix="05 // PROACTIVE GUARDS" title="Cognitive Safeguards">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-[2px] bg-hud-surface-elevated/70 border border-hud-border/60">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-hud-accent" />
                  <span className="font-mono text-xs text-hud-text-primary">
                    Browser Cognitive Load Mode
                  </span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-[1px] ${
                  stateData?.cognitive_load_mode_recommended
                    ? 'bg-hud-accent text-hud-bg'
                    : 'bg-hud-surface text-hud-text-muted border border-hud-border'
                }`}>
                  {stateData?.cognitive_load_mode_recommended ? 'ENGAGED' : 'STANDBY'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-[2px] bg-hud-surface-elevated/70 border border-hud-border/60">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-hud-accent" />
                  <span className="font-mono text-xs text-hud-text-primary">
                    Late-Night Impulse Buy Shield
                  </span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-[1px] ${
                  stateData?.impulse_buy_shield_recommended
                    ? 'bg-hud-accent text-hud-bg'
                    : 'bg-hud-surface text-hud-text-muted border border-hud-border'
                }`}>
                  {stateData?.impulse_buy_shield_recommended ? 'ACTIVE (HOLD 1.5S)' : 'PASSIVE'}
                </span>
              </div>
            </div>
          </BentoPod>
        </div>

        {/* COL 9-12: MCP Action Server Approval Queue & History */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">
          {/* Action Approval Gate */}
          <BentoPod
            idPrefix="06 // MCP ACTION GATE"
            title="Side-Effect Approvals"
            statusBadge={`${pendingActions.length} PENDING`}
            actionSlot={
              <button
                onClick={handleTriggerMorningProtection}
                className="text-[10px] font-mono text-hud-accent hover:underline flex items-center gap-1"
                title="Stage Morning Protection Cards"
              >
                <Sparkles className="w-3 h-3" />
                Protect Morning
              </button>
            }
          >
            {pendingActions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-hud-text-muted font-mono text-xs">
                <Shield className="w-7 h-7 mb-2 opacity-30 text-hud-accent" />
                <span>NO PENDING ACTIONS REQUIRING APPROVAL</span>
                <span className="text-[10px] opacity-70 mt-1 max-w-[240px]">
                  Side-effecting MCP tools stage interactive cards here for explicit user confirmation.
                </span>
                <button
                  onClick={handleTriggerMorningProtection}
                  className="mt-4 py-1.5 px-3 rounded-[2px] border border-hud-accent text-hud-accent hover:bg-hud-accent/15 transition-all text-xs font-semibold"
                >
                  STAGE DEMO ACTIONS
                </button>
              </div>
            ) : (
              <AnimatePresence>
                {pendingActions.map((action) => (
                  <ApprovalCard
                    key={action.action_id}
                    action={action}
                    onApprove={handleApproveAction}
                    onReject={handleRejectAction}
                  />
                ))}
              </AnimatePresence>
            )}
          </BentoPod>

          {/* Executed Receipts History Rail */}
          <BentoPod idPrefix="07 // AUDIT RAIL" title="Executed Dispatch Receipts">
            <HistoryRail receipts={actionReceipts} />
          </BentoPod>
        </div>
      </main>
    </div>
  );
};
