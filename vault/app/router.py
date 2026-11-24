import json
from pathlib import Path
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException
from .models import (
    PersonalStateResponse,
    PersonalStateEnum,
    SimulateRequest,
    NudgeLogRequest,
    NudgeLogEntry,
    TimelineResponse,
    TimelinePoint
)
from pydantic import BaseModel, EmailStr
from .database import (
    get_latest_snapshot,
    get_all_snapshots,
    get_simulation_override,
    set_simulation_override,
    log_nudge,
    get_nudge_logs,
    create_user,
    authenticate_user,
    get_user_by_email,
    get_user_by_id
)

class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str
    target_sleep_hours: float = 8.0
    focus_goal_hours: float = 4.0

class LoginRequest(BaseModel):
    email: str
    password: str

class AIChatRequest(BaseModel):
    message: str
    user_id: Optional[int] = None
    context: Optional[dict] = None
from .calculator import evaluate_personal_state
from .seed import seed_sample_data
from .config import settings

router = APIRouter()

def get_scenarios_dict() -> dict:
    scenarios_path = Path(settings.SAMPLE_DATA_DIR) / "scenarios.json"
    if scenarios_path.exists():
        with open(scenarios_path, "r") as f:
            return json.load(f).get("scenarios", {})
    return {}

@router.get("/state", response_model=PersonalStateResponse)
def get_personal_state():
    """
    Returns the current Personal State computed from local biometric data.
    If a simulation override is currently set (via /simulate), returns that preset.
    Zero raw patient data leaks externally.
    """
    override = get_simulation_override()
    if override.get("is_active"):
        forced_state_str = override.get("forced_state", "COGNITIVE_FATIGUE")
        scenarios = get_scenarios_dict()
        preset = scenarios.get(forced_state_str)
        
        state_enum = PersonalStateEnum(forced_state_str)
        fatigue = override.get("fatigue_score") or (preset["fatigue_score"] if preset else 84)
        stress = override.get("stress_score") or (preset["stress_score"] if preset else 62)
        focus = override.get("focus_score") or (preset["focus_score"] if preset else 28)
        
        cog_rec = state_enum in [PersonalStateEnum.COGNITIVE_FATIGUE, PersonalStateEnum.HIGH_STRESS]
        impulse_rec = cog_rec
        
        recs = preset.get("recommendations", []) if preset else [
            "Active state simulated for demonstration"
        ]
        headline = preset.get("headline", "Simulated Telemetry State") if preset else "Simulated State"
        
        return PersonalStateResponse(
            state=state_enum,
            headline=headline,
            fatigue_score=fatigue,
            stress_score=stress,
            focus_score=focus,
            resting_hr=preset.get("resting_hr", 74) if preset else 74,
            hrv_rmssd=preset.get("hrv_rmssd", 28) if preset else 28,
            sleep_hours=preset.get("sleep_hours", 4.5) if preset else 4.5,
            sleep_debt_hours=preset.get("sleep_debt_hours", 4.8) if preset else 4.8,
            screen_time_hours=preset.get("screen_time_hours", 6.8) if preset else 6.8,
            calendar_density_hours=preset.get("calendar_density_hours", 5.2) if preset else 5.2,
            cognitive_load_mode_recommended=cog_rec,
            impulse_buy_shield_recommended=impulse_rec,
            recommendations=recs,
            is_simulated=True,
            timestamp=datetime.now(timezone.utc).isoformat()
        )
        
    latest = get_latest_snapshot()
    if not latest:
        seed_sample_data()
        latest = get_latest_snapshot()
        
    if not latest:
        raise HTTPException(status_code=500, detail="No biometric snapshot available")
        
    return evaluate_personal_state(latest)

@router.get("/timeline", response_model=TimelineResponse)
def get_timeline():
    """
    Returns 7-day historical telemetry and trend metrics for the dashboard cockpit.
    """
    snapshots = get_all_snapshots(limit=7)
    points: list[TimelinePoint] = []
    
    for s in snapshots:
        state_eval = evaluate_personal_state(s)
        # Format label as Day name (e.g., "Mon", "Tue")
        try:
            dt = datetime.fromisoformat(s.timestamp.replace("Z", "+00:00"))
            label = dt.strftime("%a %d")
        except Exception:
            label = s.timestamp[:10]
            
        points.append(TimelinePoint(
            timestamp=s.timestamp,
            label=label,
            state=state_eval.state,
            fatigue_score=state_eval.fatigue_score,
            stress_score=state_eval.stress_score,
            focus_score=state_eval.focus_score,
            resting_hr=s.resting_hr,
            sleep_hours=s.sleep_hours,
            screen_time_hours=s.screen_time_hours,
            meeting_hours=s.calendar_density_hours
        ))
        
    avg_sleep = round(sum(p.sleep_hours for p in points) / max(1, len(points)), 1)
    avg_stress = round(sum(p.stress_score for p in points) / max(1, len(points)), 0)
    avg_focus = round(sum(p.focus_score for p in points) / max(1, len(points)), 0)
    
    return TimelineResponse(
        points=points,
        summary_7d={
            "avg_sleep_hours": avg_sleep,
            "avg_stress_score": int(avg_stress),
            "avg_focus_score": int(avg_focus),
            "total_points": len(points)
        }
    )

@router.post("/simulate")
def simulate_state(req: SimulateRequest):
    """
    Demo state toggle: overrides live computation with a target state or resets.
    """
    if req.reset_to_live or req.state is None:
        set_simulation_override(None)
        return {"status": "reset", "is_simulated": False, "message": "Reverted to live biometric vault"}
        
    set_simulation_override(
        state=req.state,
        fatigue=req.fatigue_score,
        stress=req.stress_score,
        focus=req.focus_score
    )
    return {
        "status": "simulated",
        "is_simulated": True,
        "forced_state": req.state.value,
        "message": f"Vault forced into {req.state.value}"
    }

@router.post("/nudge-log")
def create_nudge_log(req: NudgeLogRequest):
    """
    Logs user interactions with cognitive suggestions or extension automations.
    """
    entry_id = log_nudge(
        nudge_id=req.nudge_id,
        action_type=req.action_type,
        status=req.status,
        context=req.context
    )
    return {"status": "recorded", "id": entry_id}

@router.get("/nudge-log", response_model=list[NudgeLogEntry])
def list_nudge_logs(limit: int = 20):
    return get_nudge_logs(limit=limit)

@router.get("/scenarios")
def list_scenarios():
    return get_scenarios_dict()

@router.post("/ingest/reset")
def reset_vault():
    seed_sample_data(force=True)
    set_simulation_override(None)
    return {"status": "reseeded", "message": "Biometric vault re-initialized with sample exports"}

# =========================================================================
# USER AUTHENTICATION & SQLite STORAGE
# =========================================================================

@router.post("/auth/register")
def register(req: RegisterRequest):
    existing = get_user_by_email(req.email)
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists in local vault.")
    user = create_user(
        email=req.email,
        password=req.password,
        full_name=req.full_name,
        target_sleep_hours=req.target_sleep_hours,
        focus_goal_hours=req.focus_goal_hours
    )
    return {
        "status": "success",
        "user": user,
        "token": f"vault-tok-{user['id']}-{int(datetime.now().timestamp())}",
        "message": "User registered and profile stored in SQLite."
    }

@router.post("/auth/login")
def login(req: LoginRequest):
    user = authenticate_user(req.email, req.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid biometric credentials.")
    return {
        "status": "success",
        "user": user,
        "token": f"vault-tok-{user['id']}-{int(datetime.now().timestamp())}",
        "message": "Authenticated into local biometric vault."
    }

@router.get("/auth/me")
def get_me(email: Optional[str] = "pilot@pulsepilot.local"):
    user = get_user_by_email(email)
    if not user:
        user = authenticate_user("pilot@pulsepilot.local", "demo123")
    return {"user": user}

# =========================================================================
# CIRCADIAN AI INTELLIGENCE & COPILOT ENGINE
# =========================================================================

@router.post("/ai/chat")
def circadian_ai_chat(req: AIChatRequest):
    """
    On-device Circadian AI Copilot. Evaluates real-time autonomic state,
    calculates cognitive capacity windows, and recommends gated agentic interventions.
    """
    # Evaluate current personal state
    state_res = get_personal_state()
    msg = req.message.lower().strip()
    
    # Biometric metrics
    state = state_res.state.value
    fatigue = state_res.fatigue_score
    focus = state_res.focus_score
    stress = state_res.stress_score
    rhr = state_res.resting_hr
    hrv = state_res.hrv_rmssd
    sleep_debt = state_res.sleep_debt_hours

    suggested_actions = []

    if "schedule" in msg or "meeting" in msg or "protect" in msg or "calendar" in msg:
        if fatigue >= 60 or state in ["COGNITIVE_FATIGUE", "HIGH_STRESS"]:
            ai_reply = (
                f"Analyzing your schedule against current autonomic fatigue ({fatigue}%). "
                f"Your 09:30 'Engineering Sprint Planning' demands high prefrontal processing, "
                f"which conflicts with your physiological recovery debt ({sleep_debt} hrs). "
                f"I recommend shifting it to 14:00 when circadian alertness rebounds."
            )
            suggested_actions.append({
                "type": "MCP_TRIGGER_MORNING",
                "label": "Protect Morning: Move Sprint to 14:00",
                "action": "reschedule_morning"
            })
        else:
            ai_reply = (
                f"Your autonomic baseline is stable ({state}, Focus: {focus}%). "
                f"Your morning meetings fit well within your current 90-minute ultradian peak."
            )
    elif "code" in msg or "work" in msg or "focus" in msg or "task" in msg:
        if fatigue >= 60:
            ai_reply = (
                f"Notice: High cognitive load detected (Fatigue: {fatigue}%, HRV: {hrv}ms). "
                f"Complex algorithmic tasks or code architecture right now will yield a high error rate. "
                f"Recommended: Low-friction tasks (documentation, pull request reviews) or a 20-minute rest cycle."
            )
            suggested_actions.append({
                "type": "ENGAGE_COGNITIVE_MODE",
                "label": "Activate Browser Cognitive Load Mode",
                "action": "engage_cognitive_mode"
            })
        else:
            ai_reply = (
                f"Optimal physiological readiness detected ({state}, Focus: {focus}%). "
                f"You are currently in a prime deep-flow window. Target high-complexity problem solving for the next 75 minutes."
            )
    elif "fatigue" in msg or "tired" in msg or "sleep" in msg:
        ai_reply = (
            f"Your cumulative sleep debt is currently {sleep_debt} hours with resting heart rate at {rhr} bpm "
            f"(baseline: 62 bpm). Parasympathetic tone (HRV RMSSD) is down at {hrv}ms. "
            f"The Attention Sentinel has automatically engaged the late-night Smart Decision Filter to shield against impulse purchases."
        )
    elif "status" in msg or "how am i" in msg or "summary" in msg or "state" in msg:
        ai_reply = (
            f"PulsePilot Autonomic Status: **{state}**.\n"
            f"• Focus Index: {focus}% | Fatigue Score: {fatigue}%\n"
            f"• Stress Surge: {stress}% | RHR: {rhr} bpm | HRV: {hrv}ms\n"
            f"• Sleep Debt: {sleep_debt}h\n"
            f"{'⚠️ Gated intervention advised to protect morning focus.' if fatigue >= 60 else '✓ Autonomic equilibrium nominal.'}"
        )
    else:
        ai_reply = (
            f"I am your local Circadian AI Copilot. Real-time telemetry shows state **{state}** "
            f"with focus score at {focus}% and fatigue at {fatigue}%. "
            f"You can ask me to evaluate deep work readiness, protect your calendar via MCP, "
            f"or explain your biometric telemetry."
        )

    return {
        "status": "success",
        "reply": ai_reply,
        "biometrics_context": {
            "state": state,
            "fatigue_score": fatigue,
            "focus_score": focus,
            "stress_score": stress,
            "resting_hr": rhr,
            "hrv_rmssd": hrv,
            "sleep_debt_hours": sleep_debt
        },
        "suggested_actions": suggested_actions,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
