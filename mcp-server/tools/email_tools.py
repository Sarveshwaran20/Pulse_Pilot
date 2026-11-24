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

DEFAULT_DRAFT_BODY = """Hi Team,

Reviewing our architecture agenda for today: due to high continuous load and scheduled sprint deliverables, I am deferring our 09:30 Sprint Planning to 14:00 this afternoon.

This protects uninterrupted morning focus for core system implementation. Let me know if you have urgent blockers beforehand.

Best,
Sarvesh (via PulsePilot Protect)"""

def draft_status_email_tool(
    recipient: str = "engineering-team@pulsepilot.local",
    subject: str = "Rescheduled: Morning Sprint Planning ➔ 14:00 Today",
    body: str = DEFAULT_DRAFT_BODY,
    approve_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Drafts an explanatory status email.
    Provides an editable preview card with approval toggle before saving to Gmail drafts.
    """
    if approve_token and approve_token in approval_manager.pending_actions:
        receipt = approval_manager.approve(approve_token)
        return {
            "status": "COMPLETED",
            "receipt": receipt.model_dump()
        }
        
    diff = f"To: {recipient}\nSubj: {subject}\nLength: {len(body.split())} words"
    
    return approval_manager.request_approval(
        action_type="draft_status_email",
        card_type="EDITABLE_PREVIEW_CARD",
        title="Draft Status Email: Team Schedule Update",
        summary="Auto-crafted concise status update to notify team of shifted planning block.",
        params={
            "recipient": recipient,
            "subject": subject,
            "body": body
        },
        diff_preview=diff
    )
