from unittest.mock import patch
from app.services.ai_service import ai_service


def test_health_endpoint(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

    response_v1 = client.get("/api/v1/health")
    assert response_v1.status_code == 200
    data_v1 = response_v1.json()
    assert data_v1["status"] == "healthy"
    assert data_v1["database"] == "connected"


def test_submit_public_enquiry_success(client):
    payload = {
        "full_name": "Dr. Sarah Chen",
        "email": "sarah.chen@novabiotech.com",
        "company_name": "Nova Biotech",
        "subject": "Autonomous Multi-Agent Clinical Data Pipeline",
        "message": "We need an autonomous multi-agent RAG system to index clinical trials data with strict HIPAA compliance.",
        "service_interest": "AI & Autonomous Agents",
        "honeypot": ""
    }
    response = client.post("/api/v1/enquiries", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["full_name"] == "Dr. Sarah Chen"
    assert data["reference_id"].startswith("ENQ-")
    assert data["status"] == "NEW"
    assert data["category"] == "AI & Autonomous Agents"
    assert data["ai_analysis"] is not None
    assert data["ai_analysis"]["processing_status"] == "COMPLETED"
    assert len(data["events"]) >= 1


def test_save_first_guarantee_on_ai_failure(client):
    """
    Critical requirement: If AI analysis fails or times out,
    the enquiry MUST still be saved into the database without loss.
    """
    payload = {
        "full_name": "Marcus Vance",
        "email": "marcus@vancecloud.io",
        "company_name": "Vance Cloud",
        "subject": "Kubernetes migration",
        "message": "Looking to migrate our entire on-premise infrastructure to Kubernetes.",
        "service_interest": "Cloud Architecture & DevOps"
    }

    with patch.object(ai_service, "analyze_enquiry", side_effect=Exception("External LLM connection timed out")):
        response = client.post("/api/v1/enquiries", json=payload)
        assert response.status_code == 201
        data = response.json()
        assert data["email"] == "marcus@vancecloud.io"
        assert data["reference_id"].startswith("ENQ-")
        assert data["ai_analysis"]["processing_status"] == "FAILED"
        assert data["ai_analysis"]["error_code"] == "AI_PROCESSING_ERROR"


def test_auth_protection_on_admin_routes(client):
    # Unauthenticated request must return 401
    response = client.get("/api/v1/enquiries")
    assert response.status_code == 401

    # Invalid token must return 401
    response = client.get(
        "/api/v1/enquiries",
        headers={"Authorization": "Bearer invalid_garbage_token"}
    )
    assert response.status_code == 401


def test_staff_and_admin_permissions(client, admin_headers, staff_headers):
    # Submit an enquiry
    submit_res = client.post("/api/v1/enquiries", json={
        "full_name": "Elena Rostova",
        "email": "elena@fintechglobal.de",
        "company_name": "Fintech Global",
        "subject": "Real-time fraud streaming",
        "message": "We require high-throughput streaming architecture with sub-second latency.",
        "service_interest": "Data Platforms & Intelligence"
    })
    enquiry_id = submit_res.json()["id"]

    # Both Staff and Admin can view enquiries
    res_staff = client.get(f"/api/v1/enquiries/{enquiry_id}", headers=staff_headers)
    assert res_staff.status_code == 200

    res_admin = client.get(f"/api/v1/enquiries/{enquiry_id}", headers=admin_headers)
    assert res_admin.status_code == 200

    # Staff can update status
    patch_res = client.patch(
        f"/api/v1/enquiries/{enquiry_id}/status",
        headers=staff_headers,
        json={"status": "IN_DISCUSSION"}
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["status"] == "IN_DISCUSSION"

    # Staff CANNOT reassign (admin only)
    reassign_staff = client.patch(
        f"/api/v1/enquiries/{enquiry_id}/assignment",
        headers=staff_headers,
        json={"assigned_team": "Data Engineering"}
    )
    assert reassign_staff.status_code == 403

    # Admin CAN reassign
    reassign_admin = client.patch(
        f"/api/v1/enquiries/{enquiry_id}/assignment",
        headers=admin_headers,
        json={"assigned_team": "Data Engineering"}
    )
    assert reassign_admin.status_code == 200
    assert reassign_admin.json()["assigned_team"] == "Data Engineering"


def test_internal_notes_and_timeline(client, staff_headers):
    # Submit enquiry
    submit_res = client.post("/api/v1/enquiries", json={
        "full_name": "Kenji Sato",
        "email": "kenji@tokyosystems.jp",
        "company_name": "Tokyo Systems",
        "subject": "Enterprise ERP Integration",
        "message": "Modernizing legacy SAP ERP systems into cloud-native APIs."
    })
    enquiry_id = submit_res.json()["id"]

    # Add a note
    note_res = client.post(
        f"/api/v1/enquiries/{enquiry_id}/notes",
        headers=staff_headers,
        json={"content": "Scheduled initial discovery call with engineering lead."}
    )
    assert note_res.status_code == 201
    assert note_res.json()["content"] == "Scheduled initial discovery call with engineering lead."

    # Fetch audit events
    events_res = client.get(f"/api/v1/enquiries/{enquiry_id}/events", headers=staff_headers)
    assert events_res.status_code == 200
    event_types = [e["event_type"] for e in events_res.json()]
    assert "ENQUIRY_CREATED" in event_types
    assert "NOTE_ADDED" in event_types


def test_analytics_aggregates(client, admin_headers):
    # Fetch overview analytics
    res = client.get("/api/v1/analytics/overview", headers=admin_headers)
    assert res.status_code == 200
    data = res.json()
    assert "total_enquiries" in data
    assert "conversion_rate" in data

    # Fetch by-category
    cat_res = client.get("/api/v1/analytics/by-category", headers=admin_headers)
    assert cat_res.status_code == 200
    assert isinstance(cat_res.json(), list)

    # Fetch enquiries over time
    time_res = client.get("/api/v1/analytics/enquiries-over-time?days=7", headers=admin_headers)
    assert time_res.status_code == 200
    assert len(time_res.json()) == 7


def test_automated_stage_email_workflow_and_webhook(client, staff_headers):
    # 1. Create an enquiry
    submit_res = client.post("/api/v1/enquiries", json={
        "full_name": "Aarav Sharma",
        "email": "aarav.sharma@tataenterprise.com",
        "company_name": "Tata Enterprise",
        "subject": "Cloud Data Platform Architecture",
        "message": "We need to scale our real-time streaming pipeline to handle 50M daily events with 99.99% reliability.",
        "service_interest": "Cloud Architecture & DevOps"
    })
    assert submit_res.status_code == 201
    enquiry_id = submit_res.json()["id"]

    # 2. Test generate email draft endpoint
    draft_res = client.post(
        f"/api/v1/enquiries/{enquiry_id}/generate-email-draft",
        headers=staff_headers,
        json={"target_status": "IN_DISCUSSION"}
    )
    assert draft_res.status_code == 200
    draft_data = draft_res.json()
    assert "subject" in draft_data
    assert "body" in draft_data
    assert len(draft_data["subject"]) > 5
    assert len(draft_data["body"]) > 20

    # 3. Test status transition with email dispatch
    status_email_res = client.post(
        f"/api/v1/enquiries/{enquiry_id}/status-with-email",
        headers=staff_headers,
        json={
            "status": "IN_DISCUSSION",
            "send_email": True,
            "subject": draft_data["subject"],
            "body": draft_data["body"]
        }
    )
    assert status_email_res.status_code == 200
    updated_enquiry = status_email_res.json()
    assert updated_enquiry["status"] == "IN_DISCUSSION"

    # 4. Verify email record exists and is retrieved
    emails_res = client.get(
        f"/api/v1/enquiries/{enquiry_id}/emails",
        headers=staff_headers
    )
    assert emails_res.status_code == 200
    emails_list = emails_res.json()
    assert len(emails_list) >= 1
    email_record = emails_list[0]
    assert email_record["stage"] == "IN_DISCUSSION"
    assert email_record["recipient_email"] == "aarav.sharma@tataenterprise.com"
    assert email_record["status"] in ["SENT", "PENDING"]

    # 5. Test n8n delivery callback webhook
    webhook_res = client.patch(
        "/api/v1/enquiries/webhooks/n8n/email-status",
        headers={"X-N8N-Webhook-Secret": "n8n_secret_stage_change_webhook"},
        json={
            "email_id": email_record["id"],
            "status": "DELIVERED",
            "message_id": "msg-test-n8n-12345"
        }
    )
    assert webhook_res.status_code == 200
    assert webhook_res.json()["email_status"] == "DELIVERED"

