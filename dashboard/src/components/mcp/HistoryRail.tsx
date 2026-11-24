import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Hash } from 'lucide-react';
import { ActionReceipt } from '../../types';

interface HistoryRailProps {
  receipts: ActionReceipt[];
}

export const HistoryRail: React.FC<HistoryRailProps> = ({ receipts }) => {
  if (receipts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center text-hud-text-muted font-mono text-xs">
        <ShieldCheck className="w-6 h-6 mb-1.5 opacity-40 text-hud-accent" />
        <span>ZERO GATED DISPATCHES EXECUTED</span>
        <span className="text-[10px] opacity-70 mt-0.5">
          Explicit approval required for all side effects
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 max-h-[320px] overflow-y-auto pr-1 select-none">
      {receipts.map((rcpt) => (
        <motion.div
          key={rcpt.receipt_id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-2.5 bg-hud-surface-elevated/60 border border-hud-border/70 rounded-[2px] flex flex-col font-mono"
        >
          <div className="flex items-center justify-between text-[10px] mb-1">
            <div className="flex items-center gap-1.5 text-hud-accent font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>DISPATCH EXECUTED</span>
            </div>
            <span className="text-[9px] text-hud-text-muted flex items-center gap-0.5">
              <Hash className="w-2.5 h-2.5" />
              {rcpt.verification_hash}
            </span>
          </div>

          <span className="text-xs font-semibold text-hud-text-primary">
            {rcpt.title}
          </span>

          <span className="text-[10px] text-hud-text-secondary mt-0.5">
            {rcpt.summary}
          </span>

          <div className="flex items-center justify-between text-[9px] text-hud-text-muted mt-1.5 pt-1 border-t border-hud-border/30">
            <span>Action: {rcpt.action_type}</span>
            <span>{new Date(rcpt.executed_at).toLocaleTimeString()}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
