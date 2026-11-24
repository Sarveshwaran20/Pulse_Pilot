export type PersonalState = 'DEEP_FOCUS' | 'NEUTRAL' | 'COGNITIVE_FATIGUE' | 'HIGH_STRESS';

export interface ThemeColors {
  bg: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  accent: string;
  accentGlow: string;
  secondary: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  statusBadge: string;
}

export const STATE_THEMES: Record<PersonalState, ThemeColors> = {
  DEEP_FOCUS: {
    bg: '#07131B',
    surface: '#0C1C26',
    surfaceElevated: '#112634',
    border: 'rgba(46, 230, 168, 0.22)',
    accent: '#2EE6A8',
    accentGlow: 'rgba(46, 230, 168, 0.35)',
    secondary: '#00B8D9',
    textPrimary: '#E3FAF2',
    textSecondary: '#7CA19C',
    textMuted: '#3D5954',
    statusBadge: '#0B2A22',
  },
  NEUTRAL: {
    bg: '#121518',
    surface: '#181C20',
    surfaceElevated: '#1F2429',
    border: 'rgba(184, 197, 189, 0.16)',
    accent: '#8BAA9E',
    accentGlow: 'rgba(139, 170, 158, 0.25)',
    secondary: '#88979D',
    textPrimary: '#E8EDEA',
    textSecondary: '#93A09A',
    textMuted: '#535E5A',
    statusBadge: '#1D2622',
  },
  COGNITIVE_FATIGUE: {
    bg: '#181413',
    surface: '#221C1A',
    surfaceElevated: '#2D2422',
    border: 'rgba(224, 136, 56, 0.20)',
    accent: '#E08838',
    accentGlow: 'rgba(224, 136, 56, 0.30)',
    secondary: '#D4713B',
    textPrimary: '#F2EAE4',
    textSecondary: '#A69288',
    textMuted: '#63534B',
    statusBadge: '#2B1E17',
  },
  HIGH_STRESS: {
    bg: '#1D0B0F',
    surface: '#281116',
    surfaceElevated: '#35161D',
    border: 'rgba(255, 75, 85, 0.26)',
    accent: '#FF4B55',
    accentGlow: 'rgba(255, 75, 85, 0.40)',
    secondary: '#FF7A85',
    textPrimary: '#FFEBEF',
    textSecondary: '#B88A94',
    textMuted: '#6E434D',
    statusBadge: '#33141A',
  },
};

export function applyTheme(state: PersonalState) {
  const theme = STATE_THEMES[state] || STATE_THEMES.NEUTRAL;
  const root = document.documentElement;

  root.style.setProperty('--hud-bg', theme.bg);
  root.style.setProperty('--hud-surface', theme.surface);
  root.style.setProperty('--hud-surface-elevated', theme.surfaceElevated);
  root.style.setProperty('--hud-border', theme.border);
  root.style.setProperty('--hud-accent', theme.accent);
  root.style.setProperty('--hud-accent-glow', theme.accentGlow);
  root.style.setProperty('--hud-secondary', theme.secondary);
  root.style.setProperty('--hud-text-primary', theme.textPrimary);
  root.style.setProperty('--hud-text-secondary', theme.textSecondary);
  root.style.setProperty('--hud-text-muted', theme.textMuted);
  root.style.setProperty('--hud-status-badge', theme.statusBadge);
}
