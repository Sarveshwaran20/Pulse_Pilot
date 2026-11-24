import asyncio
import sys
from pathlib import Path
from typing import Optional, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from mcp.server.mcpserver import MCPServer

_current_dir = Path(__file__).resolve().parent
_parent_dir = _current_dir.parent
if str(_current_dir) not in sys.path:
    sys.path.insert(0, str(_current_dir))
if str(_parent_dir) not in sys.path:
    sys.path.insert(0, str(_parent_dir))

try:
    from .gating import approval_manager, ActionReceipt, PendingAction
    from .mocks.mock_store import mock_store
    from .tools.state_tools import get_personal_state_tool
    from .tools.calendar_tools import reschedule_event_tool
    from .tools.email_tools import draft_status_email_tool
    from .tools.habit_tools import log_habit_nudge_tool
except (ImportError, ValueError):
    from gating import approval_manager, ActionReceipt, PendingAction
    from mocks.mock_store import mock_store
    from tools.state_tools import get_personal_state_tool
    from tools.calendar_tools import reschedule_event_tool
    from tools.email_tools import draft_status_email_tool
    from tools.habit_tools import log_habit_nudge_tool

# Initialize official MCPServer
mcp_app = MCPServer("PulsePilot-Action-Server")

@mcp_app.tool()
async def get_personal_state() -> Dict[str, Any]:
    """
    Read-only personal biological state from the local vault.
    Zero side-effects, auto-approved.
    """
    return await get_personal_state_tool()

@mcp_app.tool()
def reschedule_event(
    event_id: str,
    new_start_time: str,
    new_end_time: str = "15:30",
    reason: str = "Cognitive load protection",
    approve_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Reschedules a calendar meeting.
    Requires explicit 1-click approval card before executing.
    """
    return reschedule_event_tool(
        event_id=event_id,
        new_start_time=new_start_time,
        new_end_time=new_end_time,
        reason=reason,
        approve_token=approve_token
    )

@mcp_app.tool()
def draft_status_email(
    recipient: str = "engineering-team@pulsepilot.local",
    subject: str = "Rescheduled: Morning Sprint Planning ➔ 14:00 Today",
    body: str = "",
    approve_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Drafts an explanatory status email with editable preview before committing to drafts.
    """
    return draft_status_email_tool(
        recipient=recipient,
        subject=subject,
        body=body or "Hi Team,\n\nProtecting morning focus block due to cognitive fatigue.\n\nBest,\nSarvesh",
        approve_token=approve_token
    )

@mcp_app.tool()
def log_habit_nudge(
    habit_name: str,
    suggested_action: str,
    approve_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Presents an interactive habit nudge card (accept or dismiss).
    """
    return log_habit_nudge_tool(
        habit_name=habit_name,
        suggested_action=suggested_action,
        approve_token=approve_token
    )

# FastAPI REST & SSE Bridge for Web Dashboard & Chrome Extension
bridge = FastAPI(
    title="PulsePilot MCP Bridge",
    version="1.0.0",
    description="Local HTTP Bridge & Approval Gating Gateway for PulsePilot MCP Server"
)

bridge.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:8002",
        "http://127.0.0.1:8002"
    ],
    allow_origin_regex=r"^chrome-extension://.*$",
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

class ApproveRequest(BaseModel):
    updated_params: Optional[Dict[str, Any]] = None

class RejectRequest(BaseModel):
    reason: Optional[str] = "Dismissed by user"

class TriggerWorkflowRequest(BaseModel):
    workflow: str = "PROTECT_MORNING"

@bridge.get("/health")
def health():
    return {"status": "healthy", "service": "pulsepilot-mcp-bridge", "port": 8002}

@bridge.get("/actions/pending", response_model=list[PendingAction])
def get_pending_actions():
    return approval_manager.list_pending()

@bridge.post("/actions/approve/{action_id}")
def approve_action(action_id: str, req: ApproveRequest = ApproveRequest()):
    try:
        receipt = approval_manager.approve(action_id, req.updated_params)
        return {"status": "SUCCESS", "receipt": receipt}
    except (KeyError, ValueError) as e:
        raise HTTPException(status_code=400, detail=str(e))

@bridge.post("/actions/reject/{action_id}")
def reject_action(action_id: str, req: RejectRequest = RejectRequest()):
    try:
        return approval_manager.reject(action_id, req.reason or "Dismissed by user")
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))

@bridge.get("/actions/receipts", response_model=list[ActionReceipt])
def get_action_receipts():
    return approval_manager.list_receipts()

@bridge.get("/mock/calendar")
def get_calendar():
    return {"events": mock_store.calendar_events}

@bridge.get("/mock/drafts")
def get_drafts():
    return {"drafts": mock_store.gmail_drafts}

@bridge.get("/mock/spotify")
def get_spotify():
    return mock_store.spotify_playback

@bridge.post("/workflow/protect-morning")
def trigger_protect_morning():
    """
    Demo trigger: Injects the two high-leverage morning protection actions into the queue:
    1. 1-click confirmation card to move Sprint Planning from 09:30 to 14:00
    2. Editable preview card to craft the team status notice
    """
    card1 = reschedule_event_tool(
        event_id="cal-001",
        new_start_time="14:00",
        new_end_time="15:30",
        reason="Preserving high-capacity morning block during cognitive fatigue"
    )
    
    card2 = draft_status_email_tool(
        recipient="engineering-team@pulsepilot.local",
        subject="Rescheduled: Morning Sprint Planning ➔ 14:00 Today",
        body="Hi Team,\n\nI am moving our 09:30 Sprint Planning to 14:00 this afternoon to protect our deep architecture flow block.\n\nLet me know if you have urgent blockers beforehand.\n\nBest,\nSarvesh (via PulsePilot)"
    )
    
    return {
        "status": "QUEUED",
        "actions_created": [card1["action_id"], card2["action_id"]],
        "message": "Morning protection approval cards staged."
    }

@bridge.post("/actions/reset")
def reset_all():
    approval_manager.reset()
    return {"status": "RESET", "message": "Pending actions and mock state cleared."}

def run_bridge():
    import uvicorn
    uvicorn.run(bridge, host="127.0.0.1", port=8002)

if __name__ == "__main__":
    run_bridge()
