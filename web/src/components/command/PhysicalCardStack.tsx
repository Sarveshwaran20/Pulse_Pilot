'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Clock, Mail, ShieldAlert, Sparkles, Hash } from 'lucide-react';
import { useAppStore, PendingAction } from '@/lib/store';

export function PhysicalCardStack() {
  const { pendingActions, actionReceipts, approveAction, rejectAction, triggerProtectMorning } =
    useAppStore();

  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  const handleApprove = async (actionId: string) => {
    setActiveActionId(actionId);
    await approveAction(actionId);
    setActiveActionId(null);
  };

  return (
    <div className="hairline-card p-6 bg-hud-surface1 flex flex-col font-mono select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
        <div>
          <div className="text-xs text-hud-accent font-bold tracking-widest uppercase">
            [04 • MCP PHYSICAL APPROVAL STACK]
          </div>
          <span className="text-[11px] text-hud-inkMuted">
            {pendingActions.length} PENDING MUTATIONS
          </span>
        </div>

        <button
          onClick={() => triggerProtectMorning()}
          data-cursor="STAGE"
          className="text-xs text-hud-accent hover:underline flex items-center gap-1.5 font-bold"
        >
          <Sparkles className="w-3.5 h-3.5" />
          STAGE DEMO CARDS
        </button>
      </div>

      {/* Card Stack Area */}
      <div className="flex-1 min-h-[260px] flex flex-col justify-center relative">
        {pendingActions.length === 0 ? (
          <div className="text-center py-10 text-hud-inkMuted text-xs flex flex-col items-center">
            <ShieldAlert className="w-8 h-8 opacity-30 text-hud-accent mb-2" />
            <span>ZERO PENDING SIDE-EFFECTS</span>
            <span className="text-[10px] opacity-70 mt-1 max-w-[260px]">
              Mutating tools pause execution until verified by physical user confirmation.
            </span>
          </div>
        ) : (
          <AnimatePresence>
            {pendingActions.map((action, idx) => (
              <motion.div
                key={action.action_id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 200, scale: 0.9 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 100) handleApprove(action.action_id);
                  else if (info.offset.x < -100) rejectAction(action.action_id);
                }}
                className="p-4 bg-hud-surface2 border-2 border-hud-accent/60 rounded-[2px] shadow-2xl mb-3 cursor-grab active:cursor-grabbing"
              >
                <div className="flex items-center justify-between text-xs text-hud-accent font-bold mb-2">
                  <span className="flex items-center gap-1.5 uppercase">
                    <Clock className="w-3.5 h-3.5" />
                    {action.action_type}
                  </span>
                  <span className="text-[10px] text-hud-inkMuted">ID: {action.action_id}</span>
                </div>

                <div className="text-sm font-serif font-bold text-hud-inkPrimary mb-1">
                  {action.title}
                </div>

                <div className="text-xs text-hud-inkSecondary mb-3">{action.summary}</div>

                <div className="p-2.5 bg-hud-void border border-white/10 rounded-[2px] text-xs text-hud-accent mb-3">
                  {action.diff_preview}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApprove(action.action_id)}
                    className="flex-1 py-2 bg-hud-accent text-hud-void font-bold text-xs uppercase rounded-[2px] flex items-center justify-center gap-1.5 shadow-[0_0_15px_var(--hud-accent-glow)]"
                  >
                    <Check className="w-3.5 h-3.5" />
                    CONFIRM & EXECUTE
                  </button>

                  <button
                    onClick={() => rejectAction(action.action_id)}
                    className="p-2 border border-white/10 rounded-[2px] text-hud-inkMuted hover:text-hud-inkPrimary"
                    title="Dismiss"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Executed Receipts Dock */}
      {actionReceipts.length > 0 && (
        <div className="mt-4 pt-3 border-t border-white/10 text-xs">
          <div className="text-[10px] text-hud-inkMuted uppercase mb-2">
            RECENT VERIFIED RECEIPTS
          </div>
          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
            {actionReceipts.slice(0, 3).map((r) => (
              <div
                key={r.receipt_id}
                className="p-2 bg-hud-surface2 border border-white/10 rounded-[2px] text-[11px] flex items-center justify-between"
              >
                <span className="text-hud-inkPrimary font-semibold">{r.title}</span>
                <span className="text-hud-accent text-[9px] flex items-center gap-0.5">
                  <Hash className="w-2.5 h-2.5" />
                  {r.verification_hash}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
