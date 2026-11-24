import React from 'react';

interface SleepDebtBarProps {
  sleepHours: number;
  sleepDebtHours: number;
}

export const SleepDebtBar: React.FC<SleepDebtBarProps> = ({
  sleepHours,
  sleepDebtHours,
}) => {
  const maxCap = 8.0;
  const segments = 10;
  const filledRatio = Math.max(0, Math.min(1, (maxCap - sleepDebtHours) / maxCap));
  const activeSegments = Math.round(filledRatio * segments);

  const getSegmentColor = (index: number) => {
    if (index >= activeSegments) return 'bg-hud-surface border-hud-border/30';
    if (activeSegments <= 3) return 'bg-[#FF4B55] border-[#FF4B55] shadow-[0_0_8px_#FF4B55]';
    if (activeSegments <= 6) return 'bg-[#E08838] border-[#E08838] shadow-[0_0_8px_#E08838]';
    return 'bg-[#2EE6A8] border-[#2EE6A8] shadow-[0_0_8px_#2EE6A8]';
  };

  return (
    <div className="flex flex-col select-none">
      <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
        <span className="text-hud-text-secondary tracking-[0.15em] uppercase">
          CIRCADIAN SLEEP RESERVE
        </span>
        <span className="font-mono text-xs text-hud-text-primary">
          {sleepHours}h / <span className="text-hud-accent">{sleepDebtHours}h debt</span>
        </span>
      </div>

      <div className="grid grid-cols-10 gap-1.5 h-3">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className={`h-full border rounded-[1px] transition-all duration-500 ${getSegmentColor(i)}`}
          />
        ))}
      </div>

      <div className="flex items-center justify-between text-[9px] font-mono text-hud-text-muted mt-1">
        <span>CRITICAL DEFICIT</span>
        <span>EQUILIBRIUM</span>
        <span>OPTIMAL RECOVERY</span>
      </div>
    </div>
  );
};
