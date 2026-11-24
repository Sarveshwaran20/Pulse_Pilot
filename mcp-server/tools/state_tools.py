import httpx
from typing import Dict, Any

VAULT_URL = "http://127.0.0.1:8000"

async def get_personal_state_tool() -> Dict[str, Any]:
    """
    Read-only tool: Retrieves the current calculated Personal State from the Local Vault.
    Auto-allowed (read-only, zero side effects, zero external leak).
    """
    async with httpx.AsyncClient(timeout=3.0) as client:
        try:
            resp = await client.get(f"{VAULT_URL}/state")
            if resp.status_code == 200:
                data = resp.json()
                return {
                    "status": "SUCCESS",
                    "personal_state": data.get("state"),
                    "headline": data.get("headline"),
                    "fatigue_score": data.get("fatigue_score"),
                    "stress_score": data.get("stress_score"),
                    "focus_score": data.get("focus_score"),
                    "resting_hr": data.get("resting_hr"),
                    "sleep_debt_hours": data.get("sleep_debt_hours"),
                    "cognitive_load_mode_recommended": data.get("cognitive_load_mode_recommended"),
                    "impulse_buy_shield_recommended": data.get("impulse_buy_shield_recommended"),
                    "recommendations": data.get("recommendations", [])
                }
            return {"status": "ERROR", "message": f"Vault returned {resp.status_code}"}
        except Exception as e:
            return {
                "status": "FALLBACK",
                "personal_state": "COGNITIVE_FATIGUE",
                "headline": "Vault local connection offline, fallback active",
                "fatigue_score": 84,
                "stress_score": 62,
                "focus_score": 28,
                "resting_hr": 74,
                "sleep_debt_hours": 4.8,
                "cognitive_load_mode_recommended": True,
                "impulse_buy_shield_recommended": True,
                "recommendations": [
                    "Protect Morning: Defer complex architecture decisions past 14:00"
                ]
            }
