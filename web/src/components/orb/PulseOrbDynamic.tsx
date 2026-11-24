'use client';

import dynamic from 'next/dynamic';

export const PulseOrbDynamic = dynamic(
  () => import('./PulseOrb3D').then((mod) => mod.PulseOrb3D),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-48 h-48 rounded-full bg-hud-surface2 animate-pulse flex items-center justify-center border border-hud-accent/30">
          <span className="font-mono text-xs text-hud-accent uppercase tracking-widest">
            INITIALIZING GLSL ORB...
          </span>
        </div>
      </div>
    ),
  }
);
