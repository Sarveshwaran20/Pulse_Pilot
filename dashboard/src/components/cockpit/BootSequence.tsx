import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BootSequenceProps {
  onComplete: () => void;
}

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [logText, setLogText] = useState('PULSEPILOT CORE v1.0.0 INITIALIZING...');

  useEffect(() => {
    const sequence = [
      { text: 'VERIFYING AUTONOMIC SENSORY CHANNELS...', delay: 350 },
      { text: 'CALIBRATING CARDIAC RHR & SLEEP DEBT GAUGES...', delay: 400 },
      { text: 'CONNECTING LOCAL ENCRYPTED VAULT (PORT 8000)...', delay: 400 },
      { text: 'INITIALIZING MCP ACTION GATEWAY (PORT 8002)...', delay: 400 },
      { text: 'SYSTEM NOMINAL. CIRCADIAN COCKPIT READY.', delay: 450 },
    ];

    let current = 0;
    const runNext = () => {
      if (current < sequence.length) {
        setLogText(sequence[current].text);
        setStep(current + 1);
        setTimeout(runNext, sequence[current].delay);
        current++;
      } else {
        setTimeout(onComplete, 300);
      }
    };

    const timer = setTimeout(runNext, 200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 bg-[#07131B] flex flex-col items-center justify-center font-mono select-none"
    >
      {/* Central Igniting Point */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.8, 1], opacity: [0, 1, 0.85] }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="w-12 h-12 rounded-full bg-[#2EE6A8] shadow-[0_0_40px_#2EE6A8] mb-8"
      />

      <div className="w-80 border border-[#2EE6A8]/40 p-4 bg-[#0C1C26]/90 rounded-[2px] shadow-2xl">
        <div className="flex items-center justify-between text-[10px] text-[#2EE6A8] mb-2 border-b border-[#2EE6A8]/30 pb-1">
          <span>CIRCADIAN_BOOT_SEQ</span>
          <span>STEP {step}/5</span>
        </div>

        <div className="text-xs text-[#E3FAF2] font-mono tracking-wide min-h-[36px] flex items-center">
          <span>{logText}</span>
          <span className="w-2 h-3.5 bg-[#2EE6A8] ml-1 animate-cursor-blink" />
        </div>

        {/* Self-test progress bar */}
        <div className="w-full h-1 bg-[#112634] mt-3 overflow-hidden rounded-[1px]">
          <motion.div
            className="h-full bg-[#2EE6A8]"
            initial={{ width: '0%' }}
            animate={{ width: `${(step / 5) * 100}%` }}
            transition={{ ease: 'easeInOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
};
