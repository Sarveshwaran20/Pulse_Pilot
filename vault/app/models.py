from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field

class PersonalStateEnum(str, Enum):
    DEEP_FOCUS = "DEEP_FOCUS"
    NEUTRAL = "NEUTRAL"
    COGNITIVE_FATIGUE = "COGNITIVE_FATIGUE"
    HIGH_STRESS = "HIGH_STRESS"

class BiometricSnapshot(BaseModel):
    timestamp: str
    sleep_hours: float = Field(..., ge=0.0, le=24.0)
    deep_sleep_ratio: float = Field(default=0.20, ge=0.0, le=1.0)
    sleep_debt_hours: float = Field(default=0.0, ge=0.0)
    resting_hr: int = Field(..., ge=30, le=220)
    baseline_rhr: int = Field(default=60, ge=30, le=120)
    hrv_rmssd: int = Field(default=50, ge=5, le=200)
    screen_time_hours: float = Field(default=4.0, ge=0.0)
    calendar_density_hours: float = Field(default=3.0, ge=0.0)

class PersonalStateResponse(BaseModel):
    state: PersonalStateEnum
    headline: str
    fatigue_score: int = Field(..., ge=0, le=100)
    stress_score: int = Field(..., ge=0, le=100)
    focus_score: int = Field(..., ge=0, le=100)
    
    # High-level indices exposed safely (no raw longitudinal health records leak)
    resting_hr: int
    hrv_rmssd: int
    sleep_hours: float
    sleep_debt_hours: float
    screen_time_hours: float
    calendar_density_hours: float
    
    # Active protections & recommendations
    cognitive_load_mode_recommended: bool
    impulse_buy_shield_recommended: bool
    recommendations: List[str]
    
    # Simulator indicator
    is_simulated: bool = False
    timestamp: str

class SimulateRequest(BaseModel):
    state: Optional[PersonalStateEnum] = None
    fatigue_score: Optional[int] = Field(default=None, ge=0, le=100)
    stress_score: Optional[int] = Field(default=None, ge=0, le=100)
    focus_score: Optional[int] = Field(default=None, ge=0, le=100)
    reset_to_live: bool = False

class NudgeLogRequest(BaseModel):
    nudge_id: str
    action_type: str  # e.g. "reschedule_morning", "take_break", "cognitive_mode_enabled"
    status: str       # "accepted" | "dismissed" | "auto_activated"
    context: Optional[dict] = None

class NudgeLogEntry(BaseModel):
    id: int
    nudge_id: str
    action_type: str
    status: str
    context: Optional[dict] = None
    created_at: str

class TimelinePoint(BaseModel):
    timestamp: str
    label: str
    state: PersonalStateEnum
    fatigue_score: int
    stress_score: int
    focus_score: int
    resting_hr: int
    sleep_hours: float
    screen_time_hours: float
    meeting_hours: float

class TimelineResponse(BaseModel):
    points: List[TimelinePoint]
    summary_7d: dict
