import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        cinzel: ['Cinzel', 'Trajan Pro', 'Georgia', 'serif'],
        serif: ['var(--font-fraunces)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        obsidian: 'var(--obsidian)',
        basalt: 'var(--basalt)',
        slate: 'var(--slate)',
        graphite: 'var(--graphite)',
        line: 'var(--line)',
        marble: 'var(--marble)',
        silver: 'var(--silver)',
        pewter: 'var(--pewter)',
        aegean: {
          DEFAULT: 'var(--aegean)',
          deep: '#1E4FA8',
          hover: '#3D7AE8',
        },
        laurel: 'var(--laurel)',
        coral: 'var(--coral)',
        crimson: 'var(--crimson)',
        tyrian: 'var(--tyrian)',

        hud: {
          void: 'var(--hud-void)',
          surface1: 'var(--hud-surface-1)',
          surface2: 'var(--hud-surface-2)',
          surface3: 'var(--hud-surface-3)',
          accent: 'var(--hud-accent)',
          accentGlow: 'var(--hud-accent-glow)',
          inkPrimary: 'var(--hud-ink-primary)',
          inkSecondary: 'var(--hud-ink-secondary)',
          inkMuted: 'var(--hud-ink-muted)',
        },
      },
      animation: {
        'cursor-pulse': 'cursorPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'status-pulse': 'statusPulse 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        cursorPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.25)', opacity: '0.3' },
        },
        statusPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.2)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
