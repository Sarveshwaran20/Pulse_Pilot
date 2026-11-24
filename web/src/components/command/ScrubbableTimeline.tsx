'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';

export function ScrubbableTimeline() {
  const { biometrics } = useAppStore();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // 7-day timeline telemetry dataset
  const days = [
    { label: 'MON 18', sleep: 7.8, rhr: 58, stress: 22, focus: 88, state: 'DEEP_FOCUS' },
    { label: 'TUE 19', sleep: 7.5, rhr: 60, stress: 26, focus: 84, state: 'DEEP_FOCUS' },
    { label: 'WED 20', sleep: 6.8, rhr: 63, stress: 42, focus: 68, state: 'NEUTRAL' },
    { label: 'THU 21', sleep: 7.2, rhr: 61, stress: 31, focus: 74, state: 'DEEP_FOCUS' },
    { label: 'FRI 22', sleep: 6.1, rhr: 66, stress: 58, focus: 48, state: 'COGNITIVE_FATIGUE' },
    { label: 'SAT 23', sleep: 5.4, rhr: 71, stress: 74, focus: 34, state: 'COGNITIVE_FATIGUE' },
    { label: 'TODAY', sleep: biometrics.sleepHours, rhr: biometrics.restingHr, stress: biometrics.stressScore, focus: biometrics.focusScore, state: biometrics.state },
  ];

  const activePoint = hoveredIdx !== null ? days[hoveredIdx] : days[6];

  return (
    <div className="hairline-card p-6 bg-hud-surface1 flex flex-col justify-between select-none">
      {/* Header with Hover Telemetry HUD */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2 mb-4">
        <div>
          <div className="font-mono text-xs text-hud-accent tracking-widest uppercase">
            [03 • 7-DAY SCRUBBABLE BIOMETRIC TIMELINE]
          </div>
          <h3 className="font-serif text-lg font-bold text-hud-inkPrimary">
            Circadian Waveform & Recovery Reserve
          </h3>
        </div>

        {/* Scrub Tooltip HUD */}
        <div className="flex items-center gap-4 font-mono text-xs bg-hud-surface2 px-3 py-1.5 rounded-[2px] border border-white/10">
          <span className="text-hud-inkMuted uppercase">{activePoint.label}:</span>
          <span>
            SLEEP: <strong className="text-hud-inkPrimary">{activePoint.sleep}h</strong>
          </span>
          <span>
            RHR: <strong className="text-hud-accent">{activePoint.rhr} BPM</strong>
          </span>
          <span>
            STATE: <strong className="text-hud-inkPrimary">{activePoint.state}</strong>
          </span>
        </div>
      </div>

      {/* Interactive Bar & Curve Strip */}
      <div className="grid grid-cols-7 gap-3 h-44 items-end pt-6 pb-2">
        {days.map((d, idx) => {
          const isSelected = (hoveredIdx === null && idx === 6) || hoveredIdx === idx;
          const heightPct = Math.round((d.sleep / 8.5) * 100);

          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              data-cursor="SCRUB"
              className="flex-1 flex flex-col items-center justify-end h-full cursor-pointer group"
            >
              {/* Value Pip on Hover */}
              <div
                className={`text-[10px] font-mono mb-1 transition-opacity ${
                  isSelected ? 'text-hud-accent font-bold opacity-100' : 'opacity-0'
                }`}
              >
                {d.sleep}h
              </div>

              {/* Segmented Pillar */}
              <div
                style={{ height: `${heightPct}%` }}
                className={`w-full rounded-[2px] transition-all duration-300 ${
                  isSelected
                    ? 'bg-hud-accent shadow-[0_0_15px_var(--hud-accent-glow)]'
                    : 'bg-hud-surface2 border border-white/10 hover:border-hud-accent/60'
                }`}
              />

              {/* Day Label */}
              <span
                className={`text-[10px] font-mono mt-2 transition-colors ${
                  isSelected ? 'text-hud-accent font-bold' : 'text-hud-inkMuted'
                }`}
              >
                {d.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
