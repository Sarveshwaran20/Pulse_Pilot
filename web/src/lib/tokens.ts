export type PersonalState = 'DEEP_FOCUS' | 'NEUTRAL' | 'COGNITIVE_FATIGUE' | 'HIGH_STRESS';

export interface StateTheme {
  void: string;
  surface1: string;
  surface2: string;
  surface3: string;
  borderGradient: string;
  accent: string;
  accentGlow: string;
  volumetricGlow: string;
  inkPrimary: string;
  inkSecondary: string;
  inkMuted: string;
  glslColor: [number, number, number];
}

export const STATE_THEMES: Record<PersonalState, StateTheme> = {
  DEEP_FOCUS: {
    void: '#03090E',
    surface1: '#07141D',
    surface2: '#0C202E',
    surface3: '#122D40',
    borderGradient: 'linear-gradient(135deg, rgba(46,230,168,0.4), rgba(46,230,168,0.05))',
    accent: '#2EE6A8',
    accentGlow: 'rgba(46, 230, 168, 0.35)',
    volumetricGlow: 'radial-gradient(circle, rgba(46,230,168,0.18) 0%, transparent 70%)',
    inkPrimary: '#F0FDF8',
    inkSecondary: '#8BAFA5',
    inkMuted: '#416359',
    glslColor: [0.18, 0.90, 0.66],
  },
  NEUTRAL: {
    void: '#0A0D0F',
    surface1: '#11161A',
    surface2: '#171E24',
    surface3: '#1F2830',
    borderGradient: 'linear-gradient(135deg, rgba(139,170,158,0.35), rgba(139,170,158,0.05))',
    accent: '#8BAA9E',
    accentGlow: 'rgba(139, 170, 158, 0.25)',
    volumetricGlow: 'radial-gradient(circle, rgba(139,170,158,0.14) 0%, transparent 70%)',
    inkPrimary: '#F2F5F3',
    inkSecondary: '#93A29B',
    inkMuted: '#526059',
    glslColor: [0.55, 0.67, 0.62],
  },
  COGNITIVE_FATIGUE: {
    void: '#0E0A09',
    surface1: '#181210',
    surface2: '#231A17',
    surface3: '#31231E',
    borderGradient: 'linear-gradient(135deg, rgba(224,136,56,0.38), rgba(224,136,56,0.05))',
    accent: '#E08838',
    accentGlow: 'rgba(224, 136, 56, 0.30)',
    volumetricGlow: 'radial-gradient(circle, rgba(224,136,56,0.18) 0%, transparent 70%)',
    inkPrimary: '#FAF5F2',
    inkSecondary: '#A8958B',
    inkMuted: '#635147',
    glslColor: [0.88, 0.53, 0.22],
  },
  HIGH_STRESS: {
    void: '#120608',
    surface1: '#1B0B10',
    surface2: '#271118',
    surface3: '#391722',
    borderGradient: 'linear-gradient(135deg, rgba(255,75,85,0.45), rgba(255,75,85,0.05))',
    accent: '#FF4B55',
    accentGlow: 'rgba(255, 75, 85, 0.40)',
    volumetricGlow: 'radial-gradient(circle, rgba(255,75,85,0.22) 0%, transparent 70%)',
    inkPrimary: '#FFF2F4',
    inkSecondary: '#B88A94',
    inkMuted: '#6E414C',
    glslColor: [1.0, 0.29, 0.33],
  },
};

export const MOTION_TOKENS = {
  duration: {
    instant: 0.12,
    micro: 0.2,
    standard: 0.45,
    expressive: 0.75,
    stateMorph: 0.95,
  },
  ease: {
    outExpo: [0.16, 1, 0.3, 1],
    inOutCirc: [0.76, 0, 0.24, 1],
    dampedElastic: [0.34, 1.56, 0.64, 1],
    smooth: [0.22, 1, 0.36, 1],
  },
  spring: {
    needle: { stiffness: 140, damping: 14, mass: 0.7 },
    cardMagnetic: { stiffness: 220, damping: 18, mass: 0.8 },
    cardSwipe: { stiffness: 180, damping: 16, mass: 1.0 },
    cursorLag: { stiffness: 450, damping: 28, mass: 0.4 },
  },
};

export function applyStateTheme(state: PersonalState) {
  if (typeof document === 'undefined') return;
  const t = STATE_THEMES[state] || STATE_THEMES.NEUTRAL;
  const root = document.documentElement;

  root.style.setProperty('--hud-void', t.void);
  root.style.setProperty('--hud-surface-1', t.surface1);
  root.style.setProperty('--hud-surface-2', t.surface2);
  root.style.setProperty('--hud-surface-3', t.surface3);
  root.style.setProperty('--hud-accent', t.accent);
  root.style.setProperty('--hud-accent-glow', t.accentGlow);
  root.style.setProperty('--hud-ink-primary', t.inkPrimary);
  root.style.setProperty('--hud-ink-secondary', t.inkSecondary);
  root.style.setProperty('--hud-ink-muted', t.inkMuted);
}
