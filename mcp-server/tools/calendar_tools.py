import sys
from pathlib import Path
from typing import Dict, Any, Optional

_mcp_dir = Path(__file__).resolve().parent.parent
if str(_mcp_dir) not in sys.path:
    sys.path.insert(0, str(_mcp_dir))

try:
    from ..gating import approval_manager
    from ..mocks.mock_store import mock_store
except (ImportError, ValueError):
    from gating import approval_manager
    from mocks.mock_store import mock_store

def reschedule_event_tool(
    event_id: str,
    new_start_time: str,
    new_end_time: str = "15:30",
    reason: str = "Defending morning focus due to cognitive fatigue",
    approve_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Reschedules a calendar event.
    Requires explicit 1-click approval card before touching mock calendar.
    """
    event = mock_store.get_event(event_id)
    title = event["title"] if event else "Engineering Meeting"
    old_time = f"{event['start']} - {event['end']}" if event else "09:30 - 11:00"
    
    # If approve token is provided, execute immediately
    if approve_token and approve_token in approval_manager.pending_actions:
        receipt = approval_manager.approve(approve_token)
        return {
            "status": "COMPLETED",
            "receipt": receipt.model_dump()
        }
        
    diff = f"{old_time}  ➔  {new_start_time} - {new_end_time} (Deferred +4.5h)"
    
    return approval_manager.request_approval(
        action_type="reschedule_event",
        card_type="CONFIRMATION_CARD",
        title=f"Protect Morning: Reschedule '{title}'",
        summary=f"Move {title} from morning to afternoon to alleviate cognitive fatigue.",
        params={
            "event_id": event_id,
            "new_start_time": new_start_time,
            "new_end_time": new_end_time,
            "reason": reason
        },
        diff_preview=diff
    )
