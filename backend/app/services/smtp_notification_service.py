"""
smtp_notification_service.py
---------------------------------------------------------------------
Sends enquiry confirmation emails via n8n webhook (cloud-hosted).
Replaced direct SMTP (which is blocked on college/restricted networks)
with an httpx POST to the n8n enquiry-confirmation webhook.

n8n then sends two parallel Gmail emails:
  1. Client confirmation  → email from the enquiry form
  2. Admin notification   → chopadeprajwal2026@gmail.com
---------------------------------------------------------------------
"""
import logging
import httpx
from app.core.config import settings
from app.models.enquiry import Enquiry

logger = logging.getLogger("app.smtp_notification_service")


def send_enquiry_confirmation_emails(enquiry: Enquiry) -> None:
    """
    Triggers the n8n enquiry-confirmation workflow via webhook.
    Sends client confirmation + admin notification emails in parallel via Gmail.

    Designed to run inside FastAPI BackgroundTasks — failures are logged
    but will NEVER bubble up to break the HTTP response.
    """
    webhook_url = settings.N8N_ENQUIRY_CONFIRMATION_WEBHOOK_URL.strip()

    if not webhook_url or not webhook_url.startswith("http"):
        logger.warning(
            "N8N_ENQUIRY_CONFIRMATION_WEBHOOK_URL not configured. "
            "Skipping enquiry confirmation emails for %s", enquiry.reference_id
        )
        return

    payload = {
        "reference_id":    enquiry.reference_id,
        "full_name":       enquiry.full_name,
        "email":           enquiry.email,
        "phone":           enquiry.phone or "",
        "company_name":    enquiry.company_name or "",
        "service_interest": enquiry.service_interest or "",
        "subject":         enquiry.subject or "",
        "message":         enquiry.message or "",
    }

    try:
        with httpx.Client(timeout=15.0) as client:
            resp = client.post(webhook_url, json=payload)
            if resp.status_code in (200, 201):
                logger.info(
                    "Enquiry confirmation emails triggered via n8n for %s",
                    enquiry.reference_id
                )
            else:
                logger.error(
                    "n8n confirmation webhook returned %s for %s: %s",
                    resp.status_code, enquiry.reference_id, resp.text[:200]
                )
    except httpx.TimeoutException:
        logger.error(
            "n8n confirmation webhook timed out for %s", enquiry.reference_id
        )
    except Exception as exc:
        logger.error(
            "Failed to trigger confirmation emails for %s: %s",
            enquiry.reference_id, str(exc)
        )
