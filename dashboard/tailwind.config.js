/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        cockpit: '2px',
      },
      colors: {
        hud: {
          bg: 'var(--hud-bg)',
          surface: 'var(--hud-surface)',
          'surface-elevated': 'var(--hud-surface-elevated)',
          border: 'var(--hud-border)',
          accent: 'var(--hud-accent)',
          'accent-glow': 'var(--hud-accent-glow)',
          secondary: 'var(--hud-secondary)',
          'text-primary': 'var(--hud-text-primary)',
          'text-secondary': 'var(--hud-text-secondary)',
          'text-muted': 'var(--hud-text-muted)',
          'status-badge': 'var(--hud-status-badge)',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'cursor-blink': 'blink 1s step-start infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
