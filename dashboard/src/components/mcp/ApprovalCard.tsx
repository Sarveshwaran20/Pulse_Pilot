import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Clock, Mail, ShieldAlert, ArrowRight, X, Edit3 } from 'lucide-react';
import { PendingAction, ActionReceipt } from '../../types';

interface ApprovalCardProps {
  action: PendingAction;
  onApprove: (actionId: string, updatedParams?: Record<string, any>) => Promise<void>;
  onReject: (actionId: string) => Promise<void>;
}

export const ApprovalCard: React.FC<ApprovalCardProps> = ({
  action,
  onApprove,
  onReject,
}) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [emailBody, setEmailBody] = useState(action.params.body || '');
  const [typedChars, setTypedChars] = useState(0);

  // Self-typing preview for email draft
  useEffect(() => {
    if (action.action_type === 'draft_status_email' && action.params.body) {
      const fullText = action.params.body;
      let curr = 0;
      const interval = setInterval(() => {
        curr += 3;
        if (curr >= fullText.length) {
          curr = fullText.length;
          clearInterval(interval);
        }
        setTypedChars(curr);
      }, 15);
      return () => clearInterval(interval);
    }
  }, [action]);

  const handleApprove = async () => {
    setIsExecuting(true);
    const updatedParams = isEditing ? { ...action.params, body: emailBody } : undefined;
    await onApprove(action.action_id, updatedParams);
    setIsExecuting(false);
  };

  const getIcon = () => {
    switch (action.action_type) {
      case 'reschedule_event':
        return <Clock className="w-4 h-4 text-hud-accent" />;
      case 'draft_status_email':
        return <Mail className="w-4 h-4 text-hud-accent" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-hud-accent" />;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: 15 }}
      transition={{ type: 'spring', stiffness: 180, damping: 20, mass: 0.9 }}
      className="hud-card p-3.5 mb-3 bg-hud-surface-elevated/90 border-hud-accent/40 shadow-lg relative overflow-hidden"
    >
      {/* Glow pulse header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getIcon()}
          <span className="font-mono text-[10px] tracking-widest text-hud-accent font-semibold uppercase">
            {action.card_type.replace('_', ' ')}
          </span>
        </div>
        <span className="font-mono text-[9px] text-hud-text-muted">
          ID: {action.action_id}
        </span>
      </div>

      <h4 className="font-serif text-sm font-semibold text-hud-text-primary mb-1">
        {action.title}
      </h4>

      <p className="font-mono text-xs text-hud-text-secondary leading-relaxed mb-3">
        {action.summary}
      </p>

      {/* Diff Preview / Content Details */}
      {action.card_type === 'CONFIRMATION_CARD' && (
        <div className="p-2.5 bg-hud-bg/80 border border-hud-border/70 rounded-[2px] mb-3">
          <div className="flex items-center justify-between font-mono text-xs text-hud-text-primary">
            <span className="text-hud-text-muted line-through">09:30 - 11:00 AM</span>
            <ArrowRight className="w-3.5 h-3.5 text-hud-accent" />
            <span className="text-hud-accent font-semibold">14:00 - 15:30 PM</span>
          </div>
          <div className="text-[10px] font-mono text-hud-text-secondary mt-1">
            Reason: {action.params.reason || 'Cognitive energy preservation'}
          </div>
        </div>
      )}

      {action.card_type === 'EDITABLE_PREVIEW_CARD' && (
        <div className="p-2.5 bg-hud-bg/80 border border-hud-border/70 rounded-[2px] mb-3">
          <div className="flex items-center justify-between text-[10px] font-mono text-hud-text-muted mb-1 border-b border-hud-border/40 pb-1">
            <span>TO: {action.params.recipient}</span>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1 text-hud-accent hover:underline"
            >
              <Edit3 className="w-2.5 h-2.5" />
              {isEditing ? 'Preview' : 'Edit Body'}
            </button>
          </div>

          {isEditing ? (
            <textarea
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              className="w-full bg-hud-surface border border-hud-border p-1.5 text-xs font-mono text-hud-text-primary rounded-[2px] focus:border-hud-accent focus:outline-none"
              rows={4}
            />
          ) : (
            <div className="font-mono text-[11px] text-hud-text-primary whitespace-pre-wrap leading-relaxed max-h-28 overflow-y-auto pr-1">
              {action.params.body
                ? action.params.body.slice(0, typedChars)
                : 'Preparing draft...'}
              {typedChars < (action.params.body?.length || 0) && (
                <span className="inline-block w-1.5 h-3 bg-hud-accent ml-0.5 animate-cursor-blink" />
              )}
            </div>
          )}
        </div>
      )}

      {/* Action Gating Controls */}
      <div className="flex items-center gap-2 pt-1 border-t border-hud-border/30">
        <button
          onClick={handleApprove}
          disabled={isExecuting}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-[2px] bg-hud-accent text-hud-bg font-mono text-xs font-bold hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 relative overflow-hidden"
        >
          {isExecuting ? (
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 border-2 border-hud-bg border-t-transparent rounded-full animate-spin" />
              EXECUTING DISPATCH...
            </span>
          ) : (
            <>
              <Check className="w-3.5 h-3.5" />
              CONFIRM & EXECUTE
            </>
          )}
        </button>

        <button
          onClick={() => onReject(action.action_id)}
          disabled={isExecuting}
          className="py-1.5 px-2.5 rounded-[2px] border border-hud-border text-hud-text-muted hover:text-hud-text-primary hover:border-hud-text-secondary font-mono text-xs transition-colors"
          title="Dismiss action"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};
