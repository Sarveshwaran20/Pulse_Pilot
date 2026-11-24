from typing import Dict, List, Optional
from datetime import datetime, timezone

class MockStore:
    def __init__(self):
        self.reset()
        
    def reset(self):
        self.calendar_events = [
            {
                "id": "cal-001",
                "title": "Engineering Sprint Planning",
                "start": "09:30",
                "end": "11:00",
                "duration_minutes": 90,
                "attendees": ["team@pulsepilot.local", "sarvesh@pulsepilot.local"],
                "meeting_type": "high_cognitive",
                "is_rescheduled": False
            },
            {
                "id": "cal-002",
                "title": "Architecture Sync: Decoupled Services",
                "start": "11:15",
                "end": "12:15",
                "duration_minutes": 60,
                "attendees": ["lead@pulsepilot.local"],
                "meeting_type": "medium_cognitive",
                "is_rescheduled": False
            },
            {
                "id": "cal-003",
                "title": "Quick Standup & Daily Blockers",
                "start": "13:00",
                "end": "13:30",
                "duration_minutes": 30,
                "attendees": ["all@pulsepilot.local"],
                "meeting_type": "low_cognitive",
                "is_rescheduled": False
            }
        ]
        self.gmail_drafts = []
        self.spotify_playback = {
            "current_track": "Binaural Alpha Waves 10Hz - Deep Flow",
            "artist": "Circadian Audio Labs",
            "is_playing": True,
            "volume_percent": 65
        }
        self.habit_logs = []

    def get_event(self, event_id: str) -> Optional[dict]:
        for e in self.calendar_events:
            if e["id"] == event_id:
                return e
        return None

    def reschedule_event(self, event_id: str, new_start: str, new_end: str, reason: str) -> dict:
        event = self.get_event(event_id)
        if not event:
            raise ValueError(f"Event {event_id} not found in mock Google Calendar")
        old_time = f"{event['start']} - {event['end']}"
        event["start"] = new_start
        event["end"] = new_end
        event["is_rescheduled"] = True
        event["reschedule_reason"] = reason
        return {
            "event_id": event_id,
            "title": event["title"],
            "previous_time": old_time,
            "new_time": f"{new_start} - {new_end}",
            "reason": reason
        }

    def create_gmail_draft(self, recipient: str, subject: str, body: str) -> dict:
        draft = {
            "draft_id": f"draft-{len(self.gmail_drafts) + 1:03d}",
            "recipient": recipient,
            "subject": subject,
            "body": body,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "status": "DRAFT_SAVED"
        }
        self.gmail_drafts.append(draft)
        return draft

    def log_habit(self, habit_name: str, suggested_action: str, status: str = "ACCEPTED") -> dict:
        record = {
            "habit_id": f"habit-{len(self.habit_logs) + 1:03d}",
            "habit_name": habit_name,
            "action": suggested_action,
            "status": status,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        self.habit_logs.append(record)
        return record

mock_store = MockStore()
