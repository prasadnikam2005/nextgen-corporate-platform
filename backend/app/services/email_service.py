import json
import logging
from datetime import datetime, timezone
from typing import Optional, List
import httpx
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.enquiry import Enquiry
from app.models.email import EnquiryEmail
from app.repositories.enquiry_repo import enquiry_repo
from app.schemas.email import GeneratedDraftResponse

logger = logging.getLogger("app.email_service")


STAGE_PROMPTS = {
    "NEW": "Welcome email thanking the client for contacting Nexora Technologies, referencing their inquiry topic, and confirming that our solutions team is reviewing their requirements.",
    "CONTACTED": "Follow-up email acknowledging our initial outreach, confirming receipt of their specifications, and proposing a formal 30-minute technical discovery session.",
    "IN_DISCUSSION": "Technical follow-up summarizing our architecture discussions, validating key technical requirements, and setting expectations for proposal delivery.",
    "PROPOSAL_SENT": "Formal proposal delivery notification confirming that Nexora's custom technical architecture & commercial proposal has been compiled for their review.",
    "CONVERTED": "Executive welcome & kick-off announcement welcoming the organization to Nexora Technologies, introducing their assigned lead architect, and detailing onboarding next steps."
}


class EmailService:
    def generate_stage_email_draft(
        self,
        enquiry: Enquiry,
        target_status: str,
        context_note: Optional[str] = None
    ) -> GeneratedDraftResponse:
        """
        Uses Groq LLM (or OpenAI / local fallback) to generate an executive-ready,
        highly personalized stage update email for the client.
        """
        status_key = target_status.upper().replace(" ", "_")
        stage_goal = STAGE_PROMPTS.get(status_key, f"Status update notification regarding workflow stage '{target_status}'.")

        # Try Groq / OpenAI LLM first
        if settings.LLM_PROVIDER.lower() in ("groq", "openai", "custom_openai_compatible") and settings.LLM_API_KEY:
            try:
                return self._call_llm_draft(enquiry, target_status, stage_goal, context_note)
            except Exception as e:
                logger.error(f"Groq email draft generation failed: {str(e)}. Using contextual heuristic fallback.")
                return self._heuristic_draft(enquiry, target_status)
        else:
            return self._heuristic_draft(enquiry, target_status)

    def _call_llm_draft(
        self,
        enquiry: Enquiry,
        target_status: str,
        stage_goal: str,
        context_note: Optional[str]
    ) -> GeneratedDraftResponse:
        endpoint = f"{settings.LLM_BASE_URL}/chat/completions"
        headers = {
            "Authorization": f"Bearer {settings.LLM_API_KEY}",
            "Content-Type": "application/json"
        }

        system_instruction = """You are the Senior Client Communications Architect at Nexora Technologies, a global enterprise software and AI consultancy.
Your task is to generate a professional, polished, high-context B2B client email matching a workflow stage transition.

Rules:
1. Address the client respectfully by first name.
2. Reference their company name and the specific service/technology they requested.
3. Keep the tone enterprise, clear, reassuring, and consultative.
4. Do NOT use buzzwords or repetitive placeholders.
5. You MUST return ONLY valid JSON matching this schema:
{
  "subject": "Clear, compelling email subject line with Nexora brand & Reference ID",
  "body": "Complete email body text formatted with clean line breaks."
}
"""

        user_content = f"""CLIENT PROFILE:
Name: {enquiry.full_name}
Email: {enquiry.email}
Company: {enquiry.company_name or 'Your Organization'}
Service Requested: {enquiry.service_interest or enquiry.category or 'Enterprise Technology'}
Enquiry Ref ID: {enquiry.reference_id}

CLIENT MESSAGE:
"{enquiry.message}"

TARGET STAGE: {target_status}
STAGE OBJECTIVE: {stage_goal}
OPTIONAL ADMIN INSTRUCTIONS: {context_note or 'None'}

Generate the subject and body as JSON now."""

        payload = {
            "model": settings.LLM_MODEL,
            "messages": [
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": user_content}
            ],
            "temperature": 0.3,
            "response_format": {"type": "json_object"}
        }

        with httpx.Client(timeout=settings.LLM_TIMEOUT_SECONDS) as client:
            resp = client.post(endpoint, headers=headers, json=payload)
            resp.raise_for_status()
            data = resp.json()
            content = data["choices"][0]["message"]["content"]
            parsed = json.loads(content)
            return GeneratedDraftResponse(
                target_status=target_status,
                subject=parsed.get("subject", f"Update regarding your enquiry ({enquiry.reference_id})"),
                body=parsed.get("body", "")
            )

    def _heuristic_draft(self, enquiry: Enquiry, target_status: str) -> GeneratedDraftResponse:
        """
        Reliable local template generator matching enterprise standards.
        """
        status_key = target_status.upper().replace(" ", "_")
        company = enquiry.company_name or "your team"
        name = enquiry.full_name.split()[0] if enquiry.full_name else "Valued Client"
        service = enquiry.service_interest or enquiry.category or "Digital Technology Solutions"

        if status_key == "NEW":
            subject = f"Thank you for contacting Nexora Technologies — Ref: {enquiry.reference_id}"
            body = (
                f"Dear {name},\n\n"
                f"Thank you for reaching out to Nexora Technologies regarding {service} for {company}.\n\n"
                f"We have received your enquiry (Ref: {enquiry.reference_id}). Our solutions architecture team is "
                f"currently reviewing your specifications to align the right technical resources.\n\n"
                f"A member of our team will follow up within 24 business hours to discuss your roadmap.\n\n"
                f"Best regards,\n"
                f"Client Engagement Team\n"
                f"Nexora Technologies Inc."
            )
        elif status_key == "CONTACTED":
            subject = f"Nexora Technologies Follow-up: {service} — Ref: {enquiry.reference_id}"
            body = (
                f"Dear {name},\n\n"
                f"Following up on your initial enquiry regarding {service} for {company}.\n\n"
                f"Our engineering leadership has reviewed your requirements and identified strong capability alignment. "
                f"We would welcome the opportunity to schedule a 30-minute discovery call to dive into your technical priorities.\n\n"
                f"Please let us know what times work best for your team this week.\n\n"
                f"Best regards,\n"
                f"Solutions Architecture Team\n"
                f"Nexora Technologies Inc."
            )
        elif status_key == "IN_DISCUSSION":
            subject = f"Nexora Technologies — Technical Architecture Next Steps (Ref: {enquiry.reference_id})"
            body = (
                f"Dear {name},\n\n"
                f"Thank you for our recent discussions regarding {service} for {company}.\n\n"
                f"We have captured your technical parameters and are currently scoping the recommended architecture, "
                f"integration touchpoints, and timeline estimates.\n\n"
                f"We will compile our findings into a tailored proposal package for your team's review shortly.\n\n"
                f"Best regards,\n"
                f"Enterprise Solutions Group\n"
                f"Nexora Technologies Inc."
            )
        elif status_key == "PROPOSAL_SENT":
            subject = f"Proposal Ready: Nexora Enterprise Solution for {company} (Ref: {enquiry.reference_id})"
            body = (
                f"Dear {name},\n\n"
                f"We are pleased to inform you that our tailored technical and commercial proposal for {service} "
                f"has been finalized for {company}.\n\n"
                f"The documentation covers system architecture, security compliance, milestones, and SLA terms.\n\n"
                f"Please let us know your availability for a walk-through session to review any questions with our lead architects.\n\n"
                f"Best regards,\n"
                f"Executive Partnerships\n"
                f"Nexora Technologies Inc."
            )
        elif status_key == "CONVERTED":
            subject = f"Welcome to Nexora Technologies! Kickoff Alignment (Ref: {enquiry.reference_id})"
            body = (
                f"Dear {name},\n\n"
                f"We are thrilled to officially welcome {company} as an enterprise partner with Nexora Technologies!\n\n"
                f"Our project delivery team is preparing the onboarding environment and scheduling the initial technical kickoff.\n\n"
                f"Your dedicated technical account lead will reach out with the kickoff schedule and collaboration access.\n\n"
                f"Warm regards,\n"
                f"Client Success & Executive Leadership\n"
                f"Nexora Technologies Inc."
            )
        else:
            subject = f"Update on your enquiry with Nexora Technologies — Ref: {enquiry.reference_id}"
            body = (
                f"Dear {name},\n\n"
                f"This is a quick update regarding your enquiry with Nexora Technologies for {company}.\n\n"
                f"Your request has progressed to the '{target_status}' stage in our engineering review.\n\n"
                f"Best regards,\n"
                f"Nexora Technologies Team"
            )

        return GeneratedDraftResponse(
            target_status=target_status,
            subject=subject,
            body=body
        )

    def queue_stage_email(
        self,
        db: Session,
        enquiry: Enquiry,
        stage: str,
        subject: str,
        body: str,
        send_email: bool = True
    ) -> EnquiryEmail:
        """
        Stores email record in PostgreSQL and dispatches to n8n webhook (or simulates delivery).
        """
        email_record = EnquiryEmail(
            enquiry_id=enquiry.id,
            stage=stage,
            recipient_email=enquiry.email,
            recipient_name=enquiry.full_name,
            subject=subject,
            body=body,
            status="PENDING" if send_email else "DRAFT"
        )
        db.add(email_record)
        db.commit()
        db.refresh(email_record)

        if send_email:
            self._dispatch_to_n8n(db, email_record, enquiry)

        return email_record

    def _dispatch_to_n8n(self, db: Session, email_record: EnquiryEmail, enquiry: Enquiry):
        """
        Dispatches email payload to n8n Webhook.
        If webhook is unconfigured (demo mode), marks as SENT with simulated message ID.
        """
        webhook_url = settings.N8N_EMAIL_WEBHOOK_URL
        if webhook_url and webhook_url.startswith("http"):
            payload = {
                "email_id": email_record.id,
                "enquiry_id": enquiry.id,
                "reference_id": enquiry.reference_id,
                "stage": email_record.stage,
                "recipient_name": email_record.recipient_name,
                "recipient_email": email_record.recipient_email,
                "company_name": enquiry.company_name or "Client Organization",
                "subject": email_record.subject,
                "body": email_record.body,
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
            try:
                headers = {"Content-Type": "application/json"}
                if settings.N8N_WEBHOOK_SECRET:
                    headers["X-N8N-Secret"] = settings.N8N_WEBHOOK_SECRET

                with httpx.Client(timeout=10.0) as client:
                    resp = client.post(webhook_url, json=payload, headers=headers)
                    logger.info(f"n8n webhook dispatched for email {email_record.id}: status={resp.status_code}")
                    email_record.status = "SENT"
                    email_record.sent_at = datetime.now(timezone.utc)
                    email_record.message_id = f"<n8n-{email_record.id[:8]}@mail.nexoratech.com>"
            except Exception as e:
                logger.error(f"Failed to post to n8n webhook: {str(e)}. Keeping status PENDING.")
        else:
            # Standalone demo / local automation: Mark as successfully SENT
            logger.info(f"N8N_EMAIL_WEBHOOK_URL not configured. Simulating instant automated dispatch for email {email_record.id}")
            email_record.status = "SENT"
            email_record.sent_at = datetime.now(timezone.utc)
            email_record.message_id = f"<mock-{email_record.id[:8]}@mail.nexoratech.com>"

        db.add(email_record)
        db.commit()
        db.refresh(email_record)

        # Record timeline audit event
        enquiry_repo.record_event(
            db=db,
            enquiry_id=enquiry.id,
            event_type="EMAIL_SENT",
            description=f"Automated stage email for '{email_record.stage}' sent to {email_record.recipient_email} (Subject: {email_record.subject[:60]}...)",
            new_value={"stage": email_record.stage, "subject": email_record.subject}
        )

    def list_enquiry_emails(self, db: Session, enquiry_id: str) -> List[EnquiryEmail]:
        return (
            db.query(EnquiryEmail)
            .filter(EnquiryEmail.enquiry_id == enquiry_id)
            .order_by(EnquiryEmail.created_at.desc())
            .all()
        )

    def update_email_status(
        self,
        db: Session,
        email_id: str,
        status: str,
        message_id: Optional[str] = None,
        n8n_execution_id: Optional[str] = None
    ) -> Optional[EnquiryEmail]:
        email = db.query(EnquiryEmail).filter(EnquiryEmail.id == email_id).first()
        if not email:
            return None
        email.status = status.upper()
        if message_id:
            email.message_id = message_id
        if n8n_execution_id:
            email.n8n_execution_id = n8n_execution_id
        if status.upper() == "SENT" and not email.sent_at:
            email.sent_at = datetime.now(timezone.utc)
        db.add(email)
        db.commit()
        db.refresh(email)
        return email


email_service = EmailService()
