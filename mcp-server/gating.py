import uuid
import sys
from pathlib import Path
from typing import Dict, List, Optional, Any
from datetime import datetime, timezone
from pydantic import BaseModel, Field

_current_dir = Path(__file__).resolve().parent
if str(_current_dir) not in sys.path:
    sys.path.insert(0, str(_current_dir))

try:
    from .mocks.mock_store import mock_store
except (ImportError, ValueError):
    from mocks.mock_store import mock_store

class PendingAction(BaseModel):
    action_id: str
    action_type: str  # "reschedule_event" | "draft_status_email" | "log_habit_nudge"
    card_type: str    # "CONFIRMATION_CARD" | "EDITABLE_PREVIEW_CARD" | "HABIT_NUDGE_CARD"
    title: str
    summary: str
    params: Dict[str, Any]
    diff_preview: str
    created_at: str
    status: str = "PENDING_APPROVAL" # "PENDING_APPROVAL" | "APPROVED" | "REJECTED"

class ActionReceipt(BaseModel):
    receipt_id: str
    action_id: str
    action_type: str
    title: str
    summary: str
    result_details: Dict[str, Any]
    executed_at: str
    verification_hash: str

class ApprovalManager:
    def __init__(self):
        self.pending_actions: Dict[str, PendingAction] = {}
        self.receipts: List[ActionReceipt] = []

    def request_approval(
        self,
        action_type: str,
        card_type: str,
        title: str,
        summary: str,
        params: Dict[str, Any],
        diff_preview: str
    ) -> Dict[str, Any]:
        """
        Creates a pending action card. Zero mutation occurs until approved.
        """
        action_id = f"act-{uuid.uuid4().hex[:8]}"
        now_iso = datetime.now(timezone.utc).isoformat()
        
        pending = PendingAction(
            action_id=action_id,
            action_type=action_type,
            card_type=card_type,
            title=title,
            summary=summary,
            params=params,
            diff_preview=diff_preview,
            created_at=now_iso,
            status="PENDING_APPROVAL"
        )
        self.pending_actions[action_id] = pending
        
        return {
            "status": "PENDING_APPROVAL",
            "action_id": action_id,
            "requires_approval": True,
            "card_type": card_type,
            "title": title,
            "summary": summary,
            "diff_preview": diff_preview,
            "params": params,
            "message": "Action paused. Explicit user confirmation required before execution."
        }

    def approve(self, action_id: str, updated_params: Optional[Dict[str, Any]] = None) -> ActionReceipt:
        if action_id not in self.pending_actions:
            raise KeyError(f"Pending action {action_id} not found or expired")
            
        pending = self.pending_actions[action_id]
        if pending.status != "PENDING_APPROVAL":
            raise ValueError(f"Action {action_id} is already {pending.status}")
            
        params = updated_params if updated_params is not None else pending.params
        
        # Dispatch side effect to mock store
        result_details = {}
        if pending.action_type == "reschedule_event":
            new_end = params.get("new_end_time", "15:30")
            result_details = mock_store.reschedule_event(
                event_id=params["event_id"],
                new_start=params["new_start_time"],
                new_end=new_end,
                reason=params.get("reason", "Cognitive load protection")
            )
        elif pending.action_type == "draft_status_email":
            result_details = mock_store.create_gmail_draft(
                recipient=params["recipient"],
                subject=params["subject"],
                body=params["body"]
            )
        elif pending.action_type == "log_habit_nudge":
            result_details = mock_store.log_habit(
                habit_name=params["habit_name"],
                suggested_action=params["suggested_action"],
                status="ACCEPTED"
            )
        else:
            raise ValueError(f"Unknown action type: {pending.action_type}")
            
        pending.status = "APPROVED"
        now_iso = datetime.now(timezone.utc).isoformat()
        
        # Build cryptographically deterministic receipt hash
        verification_hash = f"0x{uuid.uuid5(uuid.NAMESPACE_DNS, action_id + now_iso).hex[:12].upper()}"
        receipt = ActionReceipt(
            receipt_id=f"rcpt-{uuid.uuid4().hex[:8]}",
            action_id=action_id,
            action_type=pending.action_type,
            title=pending.title,
            summary=pending.summary,
            result_details=result_details,
            executed_at=now_iso,
            verification_hash=verification_hash
        )
        self.receipts.insert(0, receipt)
        del self.pending_actions[action_id]
        return receipt

    def reject(self, action_id: str, reason: str = "Dismissed by user") -> Dict[str, Any]:
        if action_id not in self.pending_actions:
            raise KeyError(f"Pending action {action_id} not found")
        pending = self.pending_actions[action_id]
        pending.status = "REJECTED"
        del self.pending_actions[action_id]
        return {
            "status": "REJECTED",
            "action_id": action_id,
            "reason": reason
        }

    def list_pending(self) -> List[PendingAction]:
        return list(self.pending_actions.values())

    def list_receipts(self) -> List[ActionReceipt]:
        return self.receipts

    def reset(self):
        self.pending_actions.clear()
        self.receipts.clear()
        mock_store.reset()

approval_manager = ApprovalManager()
