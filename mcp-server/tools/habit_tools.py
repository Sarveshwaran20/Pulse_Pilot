import sys
from pathlib import Path
from typing import Dict, Any, Optional

_mcp_dir = Path(__file__).resolve().parent.parent
if str(_mcp_dir) not in sys.path:
    sys.path.insert(0, str(_mcp_dir))

try:
    from ..gating import approval_manager
except (ImportError, ValueError):
    from gating import approval_manager

def log_habit_nudge_tool(
    habit_name: str,
    suggested_action: str,
    approve_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Presents a habit nudge card (accept/dismiss).
    """
    if approve_token and approve_token in approval_manager.pending_actions:
        receipt = approval_manager.approve(approve_token)
        return {
            "status": "COMPLETED",
            "receipt": receipt.model_dump()
        }
        
    diff = f"Habit: {habit_name} | Action: {suggested_action}"
    
    return approval_manager.request_approval(
        action_type="log_habit_nudge",
        card_type="HABIT_NUDGE_CARD",
        title=f"Bio-Nudge: {habit_name}",
        summary=f"Cognitive load indicator suggests: {suggested_action}",
        params={
            "habit_name": habit_name,
            "suggested_action": suggested_action
        },
        diff_preview=diff
    )
