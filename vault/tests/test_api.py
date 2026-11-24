import pytest
from fastapi.testclient import TestClient
from vault.app.main import app
from vault.app.database import init_db
from vault.app.seed import seed_sample_data
from vault.app.models import PersonalStateEnum

@pytest.fixture(autouse=True)
def setup_database():
    init_db()
    seed_sample_data(force=True)

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["local_only"] is True

def test_get_state():
    response = client.get("/state")
    assert response.status_code == 200
    data = response.json()
    assert "state" in data
    assert data["state"] in [e.value for e in PersonalStateEnum]
    assert 0 <= data["fatigue_score"] <= 100
    assert 0 <= data["stress_score"] <= 100
    assert 0 <= data["focus_score"] <= 100
    assert isinstance(data["recommendations"], list)

def test_simulation_toggle():
    # Force state to COGNITIVE_FATIGUE
    sim_res = client.post("/simulate", json={"state": "COGNITIVE_FATIGUE", "fatigue_score": 88})
    assert sim_res.status_code == 200
    assert sim_res.json()["is_simulated"] is True

    # State endpoint should now return simulated state
    state_res = client.get("/state")
    assert state_res.status_code == 200
    data = state_res.json()
    assert data["state"] == "COGNITIVE_FATIGUE"
    assert data["is_simulated"] is True
    assert data["cognitive_load_mode_recommended"] is True

    # Reset back to live
    reset_res = client.post("/simulate", json={"reset_to_live": True})
    assert reset_res.status_code == 200
    assert reset_res.json()["is_simulated"] is False

    live_res = client.get("/state")
    assert live_res.status_code == 200
    assert live_res.json()["is_simulated"] is False

def test_timeline_endpoint():
    response = client.get("/timeline")
    assert response.status_code == 200
    data = response.json()
    assert "points" in data
    assert "summary_7d" in data
    assert len(data["points"]) > 0

def test_nudge_log_flow():
    post_res = client.post("/nudge-log", json={
        "nudge_id": "nudge-test-1",
        "action_type": "reschedule_morning",
        "status": "accepted",
        "context": {"event": "Sprint Planning"}
    })
    assert post_res.status_code == 200
    assert "id" in post_res.json()

    get_res = client.get("/nudge-log")
    assert get_res.status_code == 200
    logs = get_res.json()
    assert len(logs) >= 1
    assert any(l["nudge_id"] == "nudge-test-1" for l in logs)
