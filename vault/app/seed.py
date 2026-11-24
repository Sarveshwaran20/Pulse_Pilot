import json
import csv
from pathlib import Path
from datetime import datetime, timezone
from .models import BiometricSnapshot
from .database import insert_snapshot, get_latest_snapshot, init_db
from .config import settings

def seed_sample_data(force: bool = False):
    init_db()
    existing = get_latest_snapshot()
    if existing and not force:
        return
        
    sample_dir = Path(settings.SAMPLE_DATA_DIR)
    sleep_path = sample_dir / "sleep_export.json"
    rhr_path = sample_dir / "rhr_readings.csv"
    screen_path = sample_dir / "screentime_daily.json"
    cal_path = sample_dir / "calendar_events.json"
    
    sleep_data = {}
    if sleep_path.exists():
        with open(sleep_path, "r") as f:
            sleep_json = json.load(f)
            sleep_data = {r["date"]: r for r in sleep_json.get("records", [])}
            
    screen_data = {}
    if screen_path.exists():
        with open(screen_path, "r") as f:
            screen_json = json.load(f)
            screen_data = {d["date"]: d for d in screen_json.get("days", [])}
            
    cal_density = 4.0
    if cal_path.exists():
        with open(cal_path, "r") as f:
            cal_json = json.load(f)
            cal_density = cal_json.get("metrics", {}).get("total_meeting_hours", 4.0)

    # Read RHR readings and correlate with dates
    if rhr_path.exists():
        with open(rhr_path, "r") as f:
            reader = csv.DictReader(f)
            for row in reader:
                ts = row["timestamp"]
                date_str = ts.split("T")[0]
                sleep_record = sleep_data.get(date_str, {})
                screen_record = screen_data.get(date_str, {})
                
                snapshot = BiometricSnapshot(
                    timestamp=ts,
                    sleep_hours=float(sleep_record.get("duration_hours", 6.5)),
                    deep_sleep_ratio=float(sleep_record.get("deep_hours", 1.2)) / max(0.1, float(sleep_record.get("duration_hours", 6.5))),
                    sleep_debt_hours=float(sleep_record.get("sleep_debt_hours", 1.0)),
                    resting_hr=int(row["resting_heart_rate"]),
                    baseline_rhr=int(row["baseline_rhr"]),
                    hrv_rmssd=int(row["hrv_rmssd"]),
                    screen_time_hours=float(screen_record.get("total_hours", 5.0)),
                    calendar_density_hours=float(cal_density if date_str == "2026-11-24" else 3.5)
                )
                insert_snapshot(snapshot)
