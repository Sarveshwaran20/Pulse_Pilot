import pytest
from vault.app.models import BiometricSnapshot, PersonalStateEnum
from vault.app.calculator import (
    calculate_fatigue_score,
    calculate_stress_score,
    calculate_focus_score,
    evaluate_personal_state
)

def test_fatigue_scoring_bounds():
    # Extreme low fatigue: 9h sleep, 0 debt, optimal deep ratio, 1h screen time
    low_fatigue = calculate_fatigue_score(
        sleep_hours=9.0,
        sleep_debt_hours=0.0,
        deep_sleep_ratio=0.25,
        screen_time_hours=1.0
    )
    assert 0 <= low_fatigue <= 15

    # Extreme high fatigue: 4h sleep, 5h debt, 5% deep sleep, 8h screen time
    high_fatigue = calculate_fatigue_score(
        sleep_hours=4.0,
        sleep_debt_hours=5.0,
        deep_sleep_ratio=0.05,
        screen_time_hours=8.0
    )
    assert high_fatigue >= 75
    assert high_fatigue <= 100

def test_stress_scoring_bounds():
    # Low stress: RHR at baseline, high HRV 80, low calendar density
    low_stress = calculate_stress_score(
        resting_hr=58,
        baseline_rhr=58,
        hrv_rmssd=80,
        calendar_density_hours=1.0
    )
    assert 0 <= low_stress <= 20

    # High stress: RHR +20bpm spike, low HRV 18, 6.5h meetings
    high_stress = calculate_stress_score(
        resting_hr=78,
        baseline_rhr=58,
        hrv_rmssd=18,
        calendar_density_hours=6.5
    )
    assert high_stress >= 70
    assert high_stress <= 100

def test_focus_score_derivation():
    # High focus when fatigue and stress are minimal
    focus = calculate_focus_score(fatigue_score=10, stress_score=15)
    assert focus >= 85

    # Low focus when fatigue and stress are heavy
    exhausted_focus = calculate_focus_score(fatigue_score=85, stress_score=80)
    assert exhausted_focus <= 25

def test_state_classification_cognitive_fatigue():
    # Scenario: Demo trigger (4.5h sleep, high debt, heavy screen time)
    snapshot = BiometricSnapshot(
        timestamp="2026-11-24T08:00:00Z",
        sleep_hours=4.5,
        deep_sleep_ratio=0.10,
        sleep_debt_hours=4.8,
        resting_hr=66,
        baseline_rhr=60,
        hrv_rmssd=35,
        screen_time_hours=6.5,
        calendar_density_hours=3.5
    )
    result = evaluate_personal_state(snapshot)
    assert result.state == PersonalStateEnum.COGNITIVE_FATIGUE
    assert result.cognitive_load_mode_recommended is True
    assert result.impulse_buy_shield_recommended is True
    assert result.fatigue_score >= 65

def test_state_classification_high_stress():
    # Scenario: Autonomic overdrive
    snapshot = BiometricSnapshot(
        timestamp="2026-11-24T08:00:00Z",
        sleep_hours=6.5,
        deep_sleep_ratio=0.18,
        sleep_debt_hours=1.0,
        resting_hr=85,
        baseline_rhr=60,
        hrv_rmssd=18,
        screen_time_hours=4.0,
        calendar_density_hours=6.5
    )
    result = evaluate_personal_state(snapshot)
    assert result.state == PersonalStateEnum.HIGH_STRESS
    assert result.stress_score >= 70

def test_state_classification_deep_focus():
    # Scenario: Optimal biological recovery
    snapshot = BiometricSnapshot(
        timestamp="2026-11-24T08:00:00Z",
        sleep_hours=8.2,
        deep_sleep_ratio=0.25,
        sleep_debt_hours=0.0,
        resting_hr=58,
        baseline_rhr=59,
        hrv_rmssd=75,
        screen_time_hours=2.5,
        calendar_density_hours=1.5
    )
    result = evaluate_personal_state(snapshot)
    assert result.state == PersonalStateEnum.DEEP_FOCUS
    assert result.focus_score >= 70
    assert result.cognitive_load_mode_recommended is False
