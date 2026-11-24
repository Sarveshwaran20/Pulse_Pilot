import pytest
from mcp_server.gating import approval_manager
from mcp_server.mocks.mock_store import mock_store
from mcp_server.tools.calendar_tools import reschedule_event_tool
from mcp_server.tools.email_tools import draft_status_email_tool
from mcp_server.tools.habit_tools import log_habit_nudge_tool

@pytest.fixture(autouse=True)
def clean_state():
    approval_manager.reset()
    mock_store.reset()

def test_no_side_effect_without_approval_calendar():
    """
    Calling reschedule_event MUST NOT modify calendar until explicit approval.
    """
    initial_event = mock_store.get_event("cal-001")
    assert initial_event["start"] == "09:30"
    assert initial_event["is_rescheduled"] is False

    # Invoke tool without approval
    res = reschedule_event_tool(
        event_id="cal-001",
        new_start_time="14:00",
        new_end_time="15:30"
    )

    assert res["status"] == "PENDING_APPROVAL"
    assert res["requires_approval"] is True
    assert "action_id" in res
    assert res["card_type"] == "CONFIRMATION_CARD"

    # Verify mock calendar remains UNCHANGED
    unchanged_event = mock_store.get_event("cal-001")
    assert unchanged_event["start"] == "09:30"
    assert unchanged_event["is_rescheduled"] is False

    # Now provide approval
    action_id = res["action_id"]
    receipt = approval_manager.approve(action_id)
    assert receipt.action_type == "reschedule_event"
    assert receipt.verification_hash.startswith("0x")

    # Verify mock calendar IS NOW updated
    updated_event = mock_store.get_event("cal-001")
    assert updated_event["start"] == "14:00"
    assert updated_event["is_rescheduled"] is True

def test_no_side_effect_without_approval_email():
    """
    Calling draft_status_email MUST NOT write to drafts until explicit approval.
    """
    assert len(mock_store.gmail_drafts) == 0

    res = draft_status_email_tool(
        recipient="team@pulsepilot.local",
        subject="Sprint Notice",
        body="Delaying meeting"
    )
    assert res["status"] == "PENDING_APPROVAL"
    assert len(mock_store.gmail_drafts) == 0

    # User modifies email body before approving
    modified_body = "Delaying meeting by 4 hours to preserve cognitive energy."
    receipt = approval_manager.approve(
        res["action_id"],
        updated_params={
            "recipient": "team@pulsepilot.local",
            "subject": "Sprint Notice",
            "body": modified_body
        }
    )
    assert receipt.action_type == "draft_status_email"
    assert len(mock_store.gmail_drafts) == 1
    assert mock_store.gmail_drafts[0]["body"] == modified_body

def test_reject_action_cancels_without_mutation():
    res = log_habit_nudge_tool(
        habit_name="Screen Break",
        suggested_action="Stand up for 3 minutes"
    )
    action_id = res["action_id"]
    assert len(approval_manager.list_pending()) == 1

    rej_result = approval_manager.reject(action_id, reason="User in middle of deep compile")
    assert rej_result["status"] == "REJECTED"
    assert len(approval_manager.list_pending()) == 0
    assert len(mock_store.habit_logs) == 0
