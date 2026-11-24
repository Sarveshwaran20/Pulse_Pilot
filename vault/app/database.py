import sqlite3
import json
import hashlib
import os
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from .config import settings
from .models import BiometricSnapshot, NudgeLogEntry, PersonalStateEnum

def get_db_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(settings.DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL;")
    return conn

def hash_password(password: str, salt: Optional[str] = None) -> tuple[str, str]:
    if not salt:
        salt = os.urandom(16).hex()
    hashed = hashlib.sha256((salt + password).encode("utf-8")).hexdigest()
    return hashed, salt

def verify_password(password: str, hashed: str, salt: str) -> bool:
    expected, _ = hash_password(password, salt)
    return expected == hashed

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        password_salt TEXT NOT NULL,
        full_name TEXT NOT NULL,
        target_sleep_hours REAL DEFAULT 8.0,
        focus_goal_hours REAL DEFAULT 4.0,
        created_at TEXT NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS biometric_snapshots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        sleep_hours REAL NOT NULL,
        deep_sleep_ratio REAL NOT NULL,
        sleep_debt_hours REAL NOT NULL,
        resting_hr INTEGER NOT NULL,
        baseline_rhr INTEGER NOT NULL,
        hrv_rmssd INTEGER NOT NULL,
        screen_time_hours REAL NOT NULL,
        calendar_density_hours REAL NOT NULL
    );
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS nudge_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nudge_id TEXT NOT NULL,
        action_type TEXT NOT NULL,
        status TEXT NOT NULL,
        context_json TEXT,
        created_at TEXT NOT NULL
    );
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS simulation_override (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        is_active INTEGER NOT NULL DEFAULT 0,
        forced_state TEXT,
        fatigue_score INTEGER,
        stress_score INTEGER,
        focus_score INTEGER,
        updated_at TEXT NOT NULL
    );
    """)
    
    # Initialize default simulation row if not exists
    cursor.execute("""
    INSERT OR IGNORE INTO simulation_override (id, is_active, forced_state, updated_at)
    VALUES (1, 0, NULL, ?);
    """, (datetime.now(timezone.utc).isoformat(),))
    
    conn.commit()
    conn.close()

    # Seed default demo pilot user if not existing
    seed_default_user()

def seed_default_user():
    try:
        user = get_user_by_email("pilot@pulsepilot.local")
        if not user:
            create_user(
                email="pilot@pulsepilot.local",
                password="demo123",
                full_name="Sarvesh K.",
                target_sleep_hours=8.0,
                focus_goal_hours=4.0
            )
    except Exception as e:
        print(f"[Vault DB] Default user seed notice: {e}")

def create_user(
    email: str,
    password: str,
    full_name: str,
    target_sleep_hours: float = 8.0,
    focus_goal_hours: float = 4.0
) -> Dict[str, Any]:
    hashed, salt = hash_password(password)
    now_iso = datetime.now(timezone.utc).isoformat()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO users (email, password_hash, password_salt, full_name, target_sleep_hours, focus_goal_hours, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (email.lower().strip(), hashed, salt, full_name.strip(), target_sleep_hours, focus_goal_hours, now_iso))
    user_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return {
        "id": user_id,
        "email": email.lower().strip(),
        "full_name": full_name.strip(),
        "target_sleep_hours": target_sleep_hours,
        "focus_goal_hours": focus_goal_hours,
        "created_at": now_iso
    }

def authenticate_user(email: str, password: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email.lower().strip(),))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    if verify_password(password, row["password_hash"], row["password_salt"]):
        return {
            "id": row["id"],
            "email": row["email"],
            "full_name": row["full_name"],
            "target_sleep_hours": row["target_sleep_hours"],
            "focus_goal_hours": row["focus_goal_hours"],
            "created_at": row["created_at"]
        }
    return None

def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, email, full_name, target_sleep_hours, focus_goal_hours, created_at FROM users WHERE email = ?", (email.lower().strip(),))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    return dict(row)

def get_user_by_id(user_id: int) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, email, full_name, target_sleep_hours, focus_goal_hours, created_at FROM users WHERE id = ?", (user_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    return dict(row)

def insert_snapshot(snapshot: BiometricSnapshot):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO biometric_snapshots (
        timestamp, sleep_hours, deep_sleep_ratio, sleep_debt_hours,
        resting_hr, baseline_rhr, hrv_rmssd, screen_time_hours, calendar_density_hours
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        snapshot.timestamp,
        snapshot.sleep_hours,
        snapshot.deep_sleep_ratio,
        snapshot.sleep_debt_hours,
        snapshot.resting_hr,
        snapshot.baseline_rhr,
        snapshot.hrv_rmssd,
        snapshot.screen_time_hours,
        snapshot.calendar_density_hours
    ))
    conn.commit()
    conn.close()

def get_latest_snapshot() -> Optional[BiometricSnapshot]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM biometric_snapshots ORDER BY id DESC LIMIT 1")
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    return BiometricSnapshot(
        timestamp=row["timestamp"],
        sleep_hours=row["sleep_hours"],
        deep_sleep_ratio=row["deep_sleep_ratio"],
        sleep_debt_hours=row["sleep_debt_hours"],
        resting_hr=row["resting_hr"],
        baseline_rhr=row["baseline_rhr"],
        hrv_rmssd=row["hrv_rmssd"],
        screen_time_hours=row["screen_time_hours"],
        calendar_density_hours=row["calendar_density_hours"]
    )

def get_all_snapshots(limit: int = 14) -> List[BiometricSnapshot]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM biometric_snapshots ORDER BY id DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [
        BiometricSnapshot(
            timestamp=r["timestamp"],
            sleep_hours=r["sleep_hours"],
            deep_sleep_ratio=r["deep_sleep_ratio"],
            sleep_debt_hours=r["sleep_debt_hours"],
            resting_hr=r["resting_hr"],
            baseline_rhr=r["baseline_rhr"],
            hrv_rmssd=r["hrv_rmssd"],
            screen_time_hours=r["screen_time_hours"],
            calendar_density_hours=r["calendar_density_hours"]
        ) for r in reversed(rows)
    ]

def log_nudge(nudge_id: str, action_type: str, status: str, context: Optional[dict] = None) -> int:
    conn = get_db_connection()
    cursor = conn.cursor()
    now_iso = datetime.now(timezone.utc).isoformat()
    context_str = json.dumps(context) if context else None
    cursor.execute("""
    INSERT INTO nudge_logs (nudge_id, action_type, status, context_json, created_at)
    VALUES (?, ?, ?, ?, ?)
    """, (nudge_id, action_type, status, context_str, now_iso))
    conn.commit()
    last_id = cursor.lastrowid
    conn.close()
    return last_id

def get_nudge_logs(limit: int = 20) -> List[NudgeLogEntry]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM nudge_logs ORDER BY id DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()
    results = []
    for r in rows:
        ctx = json.loads(r["context_json"]) if r["context_json"] else None
        results.append(NudgeLogEntry(
            id=r["id"],
            nudge_id=r["nudge_id"],
            action_type=r["action_type"],
            status=r["status"],
            context=ctx,
            created_at=r["created_at"]
        ))
    return results

def set_simulation_override(
    state: Optional[PersonalStateEnum],
    fatigue: Optional[int] = None,
    stress: Optional[int] = None,
    focus: Optional[int] = None
):
    conn = get_db_connection()
    cursor = conn.cursor()
    now_iso = datetime.now(timezone.utc).isoformat()
    is_active = 1 if state is not None else 0
    state_val = state.value if state else None
    cursor.execute("""
    UPDATE simulation_override
    SET is_active = ?, forced_state = ?, fatigue_score = ?, stress_score = ?, focus_score = ?, updated_at = ?
    WHERE id = 1
    """, (is_active, state_val, fatigue, stress, focus, now_iso))
    conn.commit()
    conn.close()

def get_simulation_override() -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM simulation_override WHERE id = 1")
    row = cursor.fetchone()
    conn.close()
    if not row or not row["is_active"]:
        return {"is_active": False}
    return {
        "is_active": True,
        "forced_state": row["forced_state"],
        "fatigue_score": row["fatigue_score"],
        "stress_score": row["stress_score"],
        "focus_score": row["focus_score"]
    }
