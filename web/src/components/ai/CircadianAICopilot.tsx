'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Shield,
  Activity,
  Calendar,
  Zap,
  ArrowRight,
  BrainCircuit,
  Lock,
  RefreshCw
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

export function CircadianAICopilot() {
  const {
    isAICopilotOpen,
    setAICopilotOpen,
    aiMessages,
    sendAIChat,
    biometrics,
    triggerProtectMorning,
    simulateState,
  } = useAppStore();

  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAICopilotOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiMessages, isAICopilotOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isSending) return;
    setInput('');
    setIsSending(true);
    await sendAIChat(text);
    setIsSending(false);
  };

  const handleActionExecute = async (action: string) => {
    if (action === 'reschedule_morning' || action === 'MCP_TRIGGER_MORNING') {
      setActionNotice('Executing Gated MCP Morning Protection Protocol...');
      await triggerProtectMorning();
      setTimeout(() => {
        setActionNotice('✓ 09:30 Sprint rescheduled to 14:00. Calendar protected.');
        setTimeout(() => setActionNotice(null), 3500);
      }, 800);
    } else if (action === 'engage_cognitive_mode') {
      setActionNotice('Engaging Chrome Extension Cognitive Load Filter...');
      setTimeout(() => {
        setActionNotice('✓ DOM de-cluttered. Smart Purchase Shield armed.');
        setTimeout(() => setActionNotice(null), 3500);
      }, 800);
    }
  };

  const quickPrompts = [
    'Should I reschedule my morning meetings?',
    'Evaluate my deep work readiness',
    'Why is my HRV depressed?',
    'Explain my current sleep debt',
  ];

  return (
    <AnimatePresence>
      {isAICopilotOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAICopilotOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Slide-over Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-[#090E17] border-l border-[#1E293B] shadow-2xl z-50 flex flex-col font-sans"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#1E293B] bg-[#0E1522]/80 backdrop-blur flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500/20 to-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-sm">
                  <BrainCircuit className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
                      Circadian AI Copilot
                    </h2>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400">
                      ON-DEVICE
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>0 bytes biometric egress • SQLite Vault Guard</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setAICopilotOpen(false)}
                className="w-8 h-8 rounded-lg bg-[#141C2B] hover:bg-[#1E293B] border border-[#2A374A] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close Copilot"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Autonomic Posture Badge */}
            <div className="px-5 py-3 bg-[#0B111D] border-b border-[#1E293B] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span className="text-zinc-400">State:</span>
                <span className="text-white font-bold">{biometrics.state}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-400">
                <span>Fatigue: <strong className="text-amber-400">{biometrics.fatigueScore}%</strong></span>
                <span>HRV: <strong className="text-sky-400">{biometrics.hrvRmssd}ms</strong></span>
                <span>Debt: <strong className="text-rose-400">{biometrics.sleepDebtHours}h</strong></span>
              </div>
            </div>

            {/* Execution Notice */}
            {actionNotice && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-4 mt-3 px-3 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>{actionNotice}</span>
              </motion.div>
            )}

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {aiMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="w-7 h-7 rounded-md bg-[#162030] border border-[#243347] flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-sky-600 text-white rounded-tr-xs'
                        : 'bg-[#121B2A] border border-[#1E2B3E] text-zinc-200 rounded-tl-xs shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Suggested Action Cards if generated by Copilot */}
                    {msg.suggested_actions && msg.suggested_actions.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-[#1E2B3E] space-y-2">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-sky-400 font-bold block">
                          Recommended Actionable Intervention:
                        </span>
                        {msg.suggested_actions.map((act, i) => (
                          <button
                            key={i}
                            onClick={() => handleActionExecute(act.action)}
                            className="w-full text-left px-3 py-2 rounded-lg bg-gradient-to-r from-sky-500/20 to-indigo-500/20 hover:from-sky-500/30 hover:to-indigo-500/30 border border-sky-500/40 text-sky-200 text-xs font-semibold flex items-center justify-between transition-all group cursor-pointer shadow-sm"
                          >
                            <span className="flex items-center gap-2">
                              <Zap className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition-transform" />
                              {act.label}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-sky-400 group-hover:translate-x-1 transition-transform" />
                          </button>
                        ))}
                      </div>
                    )}

                    <span className="text-[10px] text-zinc-500 block mt-1.5 font-mono">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-md bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-300 shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-4 py-2 border-t border-[#1E293B] bg-[#0A101A] overflow-x-auto flex gap-2 no-scrollbar">
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  disabled={isSending}
                  className="px-2.5 py-1 rounded-full bg-[#131B29] hover:bg-[#1A263B] border border-[#223147] text-zinc-300 hover:text-white text-[11px] whitespace-nowrap transition-colors cursor-pointer shrink-0"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-[#1E293B] bg-[#0E1522]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about recovery debt, focus windows, MCP gating..."
                  disabled={isSending}
                  className="flex-1 px-3.5 py-2.5 rounded-lg bg-[#141C2B] border border-[#223147] focus:border-sky-500 focus:outline-none text-white text-xs sm:text-sm placeholder:text-zinc-500"
                />
                <button
                  type="submit"
                  disabled={isSending || !input.trim()}
                  className="px-4 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-black font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  {isSending ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Ask</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
