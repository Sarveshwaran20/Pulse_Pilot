import { create } from 'zustand';
import { PersonalState, applyStateTheme } from './tokens';

export interface UserProfile {
  id: number;
  email: string;
  full_name: string;
  target_sleep_hours: number;
  focus_goal_hours: number;
  created_at?: string;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggested_actions?: Array<{
    type: string;
    label: string;
    action: string;
  }>;
  biometrics_context?: Record<string, any>;
}

export interface BiometricState {
  state: PersonalState;
  headline: string;
  fatigueScore: number;
  stressScore: number;
  focusScore: number;
  restingHr: number;
  hrvRmssd: number;
  sleepHours: number;
  sleepDebtHours: number;
  screenTimeHours: number;
  calendarDensityHours: number;
  cognitiveLoadModeRecommended: boolean;
  impulseBuyShieldRecommended: boolean;
  recommendations: string[];
  isSimulated: boolean;
  timestamp: string;
}

export interface PendingAction {
  action_id: string;
  action_type: string;
  card_type: 'CONFIRMATION_CARD' | 'EDITABLE_PREVIEW_CARD' | 'HABIT_NUDGE_CARD';
  title: string;
  summary: string;
  params: Record<string, any>;
  diff_preview: string;
  created_at: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
}

export interface ActionReceipt {
  receipt_id: string;
  action_id: string;
  action_type: string;
  title: string;
  summary: string;
  result_details: Record<string, any>;
  executed_at: string;
  verification_hash: string;
}

interface AppStore {
  biometrics: BiometricState;
  pendingActions: PendingAction[];
  actionReceipts: ActionReceipt[];
  currentUser: UserProfile | null;
  authLoading: boolean;
  isDemoMode: boolean;
  isAICopilotOpen: boolean;
  aiMessages: AIMessage[];
  isCommandPaletteOpen: boolean;
  isDemoDirectorOpen: boolean;
  isPreloaderFinished: boolean;
  setPreloaderFinished: (finished: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setDemoDirectorOpen: (open: boolean) => void;
  setAICopilotOpen: (open: boolean) => void;
  enableDemoMode: () => void;
  disableDemoMode: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    email: string;
    password: string;
    full_name: string;
    target_sleep_hours?: number;
    focus_goal_hours?: number;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkCurrentUser: () => Promise<void>;
  sendAIChat: (message: string) => Promise<void>;
  fetchState: () => Promise<void>;
  simulateState: (state: PersonalState | null) => Promise<void>;
  fetchMCPQueue: () => Promise<void>;
  approveAction: (actionId: string, updatedParams?: Record<string, any>) => Promise<void>;
  rejectAction: (actionId: string) => Promise<void>;
  triggerProtectMorning: () => Promise<void>;
}

const VAULT_URL = 'http://127.0.0.1:8000';
const MCP_URL = 'http://127.0.0.1:8002';

const DEFAULT_STATE: BiometricState = {
  state: 'NEUTRAL',
  headline: 'Autonomic Equilibrium Maintained',
  fatigueScore: 35,
  stressScore: 38,
  focusScore: 68,
  restingHr: 62,
  hrvRmssd: 58,
  sleepHours: 7.4,
  sleepDebtHours: 0.6,
  screenTimeHours: 4.2,
  calendarDensityHours: 3.0,
  cognitiveLoadModeRecommended: false,
  impulseBuyShieldRecommended: false,
  recommendations: ['Nominal operating posture active'],
  isSimulated: false,
  timestamp: new Date().toISOString(),
};

const INITIAL_AI_MESSAGES: AIMessage[] = [
  {
    id: 'init-1',
    sender: 'assistant',
    text: "Greetings Pilot. I am your local Circadian AI Copilot running on-device. I continuously correlate your autonomic telemetry (HRV RMSSD, sleep debt, resting heart rate) against your calendar density to protect your cognitive bandwidth. How can I optimize your posture right now?",
    timestamp: new Date().toISOString(),
  },
];

export const useAppStore = create<AppStore>((set, get) => ({
  biometrics: DEFAULT_STATE,
  pendingActions: [],
  actionReceipts: [],
  currentUser: typeof window !== 'undefined' && localStorage.getItem('pulsepilot_user')
    ? JSON.parse(localStorage.getItem('pulsepilot_user') || 'null')
    : null,
  authLoading: false,
  isDemoMode: false,
  isAICopilotOpen: false,
  aiMessages: INITIAL_AI_MESSAGES,
  isCommandPaletteOpen: false,
  isDemoDirectorOpen: false,
  isPreloaderFinished: false,

  setPreloaderFinished: (finished) => set({ isPreloaderFinished: finished }),
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  setDemoDirectorOpen: (open) => set({ isDemoDirectorOpen: open }),
  setAICopilotOpen: (open) => set({ isAICopilotOpen: open }),

  enableDemoMode: () => {
    const demoUser: UserProfile = {
      id: 999,
      email: 'pilot.demo@pulsepilot.local',
      full_name: 'Demo Pilot (Guest)',
      target_sleep_hours: 8.0,
      focus_goal_hours: 4.0,
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('pulsepilot_user', JSON.stringify(demoUser));
    }
    set({ isDemoMode: true, currentUser: demoUser });
  },

  disableDemoMode: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pulsepilot_user');
    }
    set({ isDemoMode: false, currentUser: null });
  },

  login: async (email, password) => {
    set({ authLoading: true });
    try {
      const res = await fetch(`${VAULT_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        set({ authLoading: false });
        return { success: false, error: data.detail || 'Authentication failed' };
      }
      const user: UserProfile = data.user;
      if (typeof window !== 'undefined') {
        localStorage.setItem('pulsepilot_user', JSON.stringify(user));
      }
      set({ currentUser: user, authLoading: false });
      return { success: true };
    } catch (err: any) {
      set({ authLoading: false });
      return { success: false, error: err.message || 'Vault connection error' };
    }
  },

  register: async (payload) => {
    set({ authLoading: true });
    try {
      const res = await fetch(`${VAULT_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        set({ authLoading: false });
        return { success: false, error: data.detail || 'Registration failed' };
      }
      const user: UserProfile = data.user;
      if (typeof window !== 'undefined') {
        localStorage.setItem('pulsepilot_user', JSON.stringify(user));
      }
      set({ currentUser: user, authLoading: false });
      return { success: true };
    } catch (err: any) {
      set({ authLoading: false });
      return { success: false, error: err.message || 'Vault connection error' };
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pulsepilot_user');
    }
    set({ currentUser: null });
  },

  checkCurrentUser: async () => {
    try {
      const current = get().currentUser;
      const email = current?.email || 'pilot@pulsepilot.local';
      const res = await fetch(`${VAULT_URL}/auth/me?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          set({ currentUser: data.user });
          if (typeof window !== 'undefined') {
            localStorage.setItem('pulsepilot_user', JSON.stringify(data.user));
          }
        }
      }
    } catch {
      // Offline fallback
    }
  },

  sendAIChat: async (message: string) => {
    const userMsg: AIMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: message,
      timestamp: new Date().toISOString(),
    };
    set((s) => ({ aiMessages: [...s.aiMessages, userMsg] }));

    try {
      const res = await fetch(`${VAULT_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      if (res.ok) {
        const data = await res.json();
        const assistantMsg: AIMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: data.reply,
          timestamp: data.timestamp || new Date().toISOString(),
          suggested_actions: data.suggested_actions || [],
          biometrics_context: data.biometrics_context || {},
        };
        set((s) => ({ aiMessages: [...s.aiMessages, assistantMsg] }));
      } else {
        const fallbackMsg: AIMessage = {
          id: `ai-err-${Date.now()}`,
          sender: 'assistant',
          text: "Local Vault AI copilot encountered a synchronization pause. Current biometrics remain guarded in SQLite.",
          timestamp: new Date().toISOString(),
        };
        set((s) => ({ aiMessages: [...s.aiMessages, fallbackMsg] }));
      }
    } catch (err: any) {
      const offlineMsg: AIMessage = {
        id: `ai-off-${Date.now()}`,
        sender: 'assistant',
        text: `Vault AI telemetry bridge offline: ${err.message}. Local biological enclave is isolated.`,
        timestamp: new Date().toISOString(),
      };
      set((s) => ({ aiMessages: [...s.aiMessages, offlineMsg] }));
    }
  },

  fetchState: async () => {
    try {
      const res = await fetch(`${VAULT_URL}/state`);
      if (res.ok) {
        const data = await res.json();
        const mapped: BiometricState = {
          state: data.state,
          headline: data.headline,
          fatigueScore: data.fatigue_score,
          stressScore: data.stress_score,
          focusScore: data.focus_score,
          restingHr: data.resting_hr,
          hrvRmssd: data.hrv_rmssd,
          sleepHours: data.sleep_hours,
          sleepDebtHours: data.sleep_debt_hours,
          screenTimeHours: data.screen_time_hours,
          calendarDensityHours: data.calendar_density_hours,
          cognitiveLoadModeRecommended: data.cognitive_load_mode_recommended,
          impulseBuyShieldRecommended: data.impulse_buy_shield_recommended,
          recommendations: data.recommendations || [],
          isSimulated: data.is_simulated,
          timestamp: data.timestamp,
        };
        set({ biometrics: mapped });
        applyStateTheme(mapped.state);
      }
    } catch {
      // Vault offline fallback
    }
  },

  simulateState: async (state) => {
    try {
      if (!state) {
        await fetch(`${VAULT_URL}/simulate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reset_to_live: true }),
        });
      } else {
        await fetch(`${VAULT_URL}/simulate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ state }),
        });
      }
      await get().fetchState();
    } catch {
      if (state) {
        set((s) => ({
          biometrics: { ...s.biometrics, state, isSimulated: true },
        }));
        applyStateTheme(state);
      }
    }
  },

  fetchMCPQueue: async () => {
    try {
      const [pendingRes, receiptsRes] = await Promise.all([
        fetch(`${MCP_URL}/actions/pending`),
        fetch(`${MCP_URL}/actions/receipts`),
      ]);
      if (pendingRes.ok) {
        const pending = await pendingRes.json();
        set({ pendingActions: pending });
      }
      if (receiptsRes.ok) {
        const receipts = await receiptsRes.json();
        set({ actionReceipts: receipts });
      }
    } catch {
      // MCP offline
    }
  },

  approveAction: async (actionId, updatedParams) => {
    try {
      await fetch(`${MCP_URL}/actions/approve/${actionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updated_params: updatedParams }),
      });
      await get().fetchMCPQueue();
    } catch (err) {
      console.error('Approve failed:', err);
    }
  },

  rejectAction: async (actionId) => {
    try {
      await fetch(`${MCP_URL}/actions/reject/${actionId}`, { method: 'POST' });
      await get().fetchMCPQueue();
    } catch (err) {
      console.error('Reject failed:', err);
    }
  },

  triggerProtectMorning: async () => {
    try {
      await fetch(`${MCP_URL}/workflow/protect-morning`, { method: 'POST' });
      await get().fetchMCPQueue();
    } catch (err) {
      console.error('Protect morning failed:', err);
    }
  },
}));
