from typing import Tuple, List
from .models import BiometricSnapshot, PersonalStateEnum, PersonalStateResponse

def calculate_fatigue_score(
    sleep_hours: float,
    sleep_debt_hours: float,
    deep_sleep_ratio: float,
    screen_time_hours: float
) -> int:
    """
    Computes a 0-100 Fatigue Score.
    Higher score means more severe fatigue.
    """
    # Baseline penalty for sleep deficit: <7h starts building fatigue
    sleep_deficit = max(0.0, 7.5 - sleep_hours)
    sleep_penalty = (sleep_deficit / 4.0) * 45.0  # Up to 45 pts
    
    # Accumulated 7-day sleep debt penalty
    debt_penalty = min(30.0, (sleep_debt_hours / 5.0) * 30.0) # Up to 30 pts
    
    # Poor deep sleep quality penalty (< 15% is poor)
    quality_penalty = max(0.0, (0.20 - deep_sleep_ratio) / 0.20) * 15.0 # Up to 15 pts
    
    # Extended screen time fatigue multiplier
    screen_penalty = max(0.0, (screen_time_hours - 5.0) / 4.0) * 15.0 # Up to 15 pts
    
    total = sleep_penalty + debt_penalty + quality_penalty + screen_penalty
    return int(min(100, max(0, round(total))))

def calculate_stress_score(
    resting_hr: int,
    baseline_rhr: int,
    hrv_rmssd: int,
    calendar_density_hours: float
) -> int:
    """
    Computes a 0-100 Stress Score.
    Driven by sympathetic arousal (elevated RHR, depressed HRV, heavy meeting load).
    """
    # Resting heart rate deviation from baseline
    delta_rhr = resting_hr - baseline_rhr
    rhr_penalty = max(0.0, (delta_rhr / 15.0) * 40.0) # Up to 40 pts
    
    # Low HRV (RMSSD < 30ms indicates sympathetic stress)
    if hrv_rmssd < 60:
        hrv_penalty = ((60 - hrv_rmssd) / 45.0) * 35.0
    else:
        hrv_penalty = 0.0
    hrv_penalty = min(35.0, max(0.0, hrv_penalty))
    
    # High meeting density / fragmentation
    density_penalty = min(25.0, (calendar_density_hours / 6.0) * 25.0)
    
    total = rhr_penalty + hrv_penalty + density_penalty
    return int(min(100, max(0, round(total))))

def calculate_focus_score(fatigue_score: int, stress_score: int) -> int:
    """
    Focus Score [0-100]: Cognitive availability.
    Diminished heavily by fatigue and stress.
    """
    drain = (fatigue_score * 0.58) + (stress_score * 0.42)
    score = 100.0 - drain
    return int(min(100, max(0, round(score))))

def evaluate_personal_state(snapshot: BiometricSnapshot) -> PersonalStateResponse:
    """
    Evaluates physiological snapshot into live personal state and safe recommendations.
    """
    fatigue = calculate_fatigue_score(
        snapshot.sleep_hours,
        snapshot.sleep_debt_hours,
        snapshot.deep_sleep_ratio,
        snapshot.screen_time_hours
    )
    
    stress = calculate_stress_score(
        snapshot.resting_hr,
        snapshot.baseline_rhr,
        snapshot.hrv_rmssd,
        snapshot.calendar_density_hours
    )
    
    focus = calculate_focus_score(fatigue, stress)
    
    delta_rhr = snapshot.resting_hr - snapshot.baseline_rhr
    
    # State classification precedence
    if stress >= 70 or (delta_rhr >= 14 and stress >= 55):
        state = PersonalStateEnum.HIGH_STRESS
        headline = "Sympathetic Autonomic Overdrive"
        recs = [
            "Visually declutter HUD and peripheral alerts",
            "Reschedule high-stakes afternoon reviews",
            "Initiate 4-7-8 parasympathetic down-regulation"
        ]
        cog_mode = True
        impulse_shield = True
    elif fatigue >= 65 or (snapshot.sleep_hours <= 4.8 and snapshot.screen_time_hours >= 5.0):
        state = PersonalStateEnum.COGNITIVE_FATIGUE
        headline = "Cognitive Bandwidth Depleted"
        recs = [
            "Enable Browser Cognitive Load Mode (collapse text walls)",
            "Engage Late-Night & Fatigue Impulse Purchase Shield",
            "Protect Morning: Defer complex architecture decisions past 14:00"
        ]
        cog_mode = True
        impulse_shield = True
    elif focus >= 70 and stress < 40 and fatigue < 35:
        state = PersonalStateEnum.DEEP_FOCUS
        headline = "Peak Biological Flow State"
        recs = [
            "Defend uninterrupted deep work block",
            "Suppress ambient communications",
            "Tackle high-complexity core logic"
        ]
        cog_mode = False
        impulse_shield = False
    else:
        state = PersonalStateEnum.NEUTRAL
        headline = "Steady Circadian Baseline"
        recs = [
            "Nominal operating parameters",
            "Standard break intervals active"
        ]
        cog_mode = False
        impulse_shield = False
        
    return PersonalStateResponse(
        state=state,
        headline=headline,
        fatigue_score=fatigue,
        stress_score=stress,
        focus_score=focus,
        resting_hr=snapshot.resting_hr,
        hrv_rmssd=snapshot.hrv_rmssd,
        sleep_hours=snapshot.sleep_hours,
        sleep_debt_hours=snapshot.sleep_debt_hours,
        screen_time_hours=snapshot.screen_time_hours,
        calendar_density_hours=snapshot.calendar_density_hours,
        cognitive_load_mode_recommended=cog_mode,
        impulse_buy_shield_recommended=impulse_shield,
        recommendations=recs,
        is_simulated=False,
        timestamp=snapshot.timestamp
    )
