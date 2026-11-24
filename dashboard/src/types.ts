export type PersonalState = 'DEEP_FOCUS' | 'NEUTRAL' | 'COGNITIVE_FATIGUE' | 'HIGH_STRESS';

export interface PersonalStateResponse {
  state: PersonalState;
  headline: string;
  fatigue_score: number;
  stress_score: number;
  focus_score: number;
  resting_hr: number;
  hrv_rmssd: number;
  sleep_hours: number;
  sleep_debt_hours: number;
  screen_time_hours: number;
  calendar_density_hours: number;
  cognitive_load_mode_recommended: boolean;
  impulse_buy_shield_recommended: boolean;
  recommendations: string[];
  is_simulated: boolean;
  timestamp: string;
}

export interface TimelinePoint {
  timestamp: string;
  label: string;
  state: PersonalState;
  fatigue_score: number;
  stress_score: number;
  focus_score: number;
  resting_hr: number;
  sleep_hours: number;
  screen_time_hours: number;
  meeting_hours: number;
}

export interface TimelineResponse {
  points: TimelinePoint[];
  summary_7d: {
    avg_sleep_hours: number;
    avg_stress_score: number;
    avg_focus_score: number;
    total_points: number;
  };
}

export interface PendingAction {
  action_id: string;
  action_type: 'reschedule_event' | 'draft_status_email' | 'log_habit_nudge' | string;
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
