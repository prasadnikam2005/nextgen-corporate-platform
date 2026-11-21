from typing import Optional, List
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user, require_staff_or_admin, require_admin
from app.models.profile import Profile
from app.models.enquiry import Enquiry
from app.repositories.enquiry_repo import enquiry_repo
from app.services.enquiry_service import enquiry_service
from app.services.email_service import email_service
from app.services.smtp_notification_service import send_enquiry_confirmation_emails
from app.schemas.enquiry import (
    EnquiryCreate,
    EnquiryOut,
    EnquiryListResponse,
    EnquiryStatusUpdate,
    EnquiryAssignmentUpdate,
    EnquiryNoteCreate,
    EnquiryNoteOut,
    EnquiryEventOut,
)
from app.schemas.ai_analysis import AIAnalysisOut
from app.schemas.email import (
    GenerateDraftRequest,
    GeneratedDraftResponse,
    SendStatusEmailRequest,
    EnquiryEmailOut,
    N8nStatusWebhookPayload,
)

router = APIRouter(prefix="/enquiries", tags=["Enquiries"])


def serialize_enquiry(enquiry: Enquiry) -> EnquiryOut:
    """Helper to convert Enquiry SQLAlchemy model to EnquiryOut schema."""
    latest_analysis = enquiry.ai_analyses[0] if enquiry.ai_analyses else None
    return EnquiryOut(
        id=enquiry.id,
        reference_id=enquiry.reference_id,
        full_name=enquiry.full_name,
        email=enquiry.email,
        phone=enquiry.phone,
        company_name=enquiry.company_name,
        subject=enquiry.subject,
        message=enquiry.message,
        service_interest=enquiry.service_interest,
        status=enquiry.status,
        priority=enquiry.priority,
        category=enquiry.category,
        assigned_team=enquiry.assigned_team,
        assigned_to=enquiry.assigned_to,
        source=enquiry.source,
        created_at=enquiry.created_at,
        updated_at=enquiry.updated_at,
        closed_at=enquiry.closed_at,
        ai_analysis=AIAnalysisOut.model_validate(latest_analysis) if latest_analysis else None,
        notes=[EnquiryNoteOut.model_validate(n) for n in (enquiry.notes or [])],
        events=[EnquiryEventOut.model_validate(e) for e in (enquiry.events or [])],
    )


@router.post("", response_model=EnquiryOut, status_code=status.HTTP_201_CREATED)
def submit_public_enquiry(
    enquiry_in: EnquiryCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Public enquiry submission endpoint.
    Guarantees persistence into PostgreSQL before attempting automated AI triage.
    AI failure will never cause submission failure or data loss.
    After saving, fires client confirmation + admin notification emails in the background.
    """
    enquiry = enquiry_service.process_public_enquiry(db, enquiry_in)
    # Send emails in background — never blocks the HTTP response
    background_tasks.add_task(send_enquiry_confirmation_emails, enquiry)
    return serialize_enquiry(enquiry)


@router.get("", response_model=EnquiryListResponse)
def list_enquiries(
    status: Optional[str] = Query(None, description="Filter by status: NEW, CONTACTED, IN_DISCUSSION, PROPOSAL_SENT, CONVERTED, CLOSED"),
    priority: Optional[str] = Query(None, description="Filter by priority: LOW, MEDIUM, HIGH, CRITICAL"),
    category: Optional[str] = Query(None, description="Filter by service category"),
    search: Optional[str] = Query(None, description="Search query across reference ID, name, email, company, subject"),
    page: int = Query(1, ge=1, description="Page number (1-indexed)"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_staff_or_admin),
):
    """
    List enquiries with server-side pagination, searching, and multi-parameter filtering.
    Requires authenticated staff or admin role.
    """
    items, total = enquiry_repo.list_enquiries(
        db=db,
        status=status,
        priority=priority,
        category=category,
        search=search,
        page=page,
        limit=limit,
    )
    total_pages = (total + limit - 1) // limit if total > 0 else 1

    return EnquiryListResponse(
        items=[serialize_enquiry(item) for item in items],
        total=total,
        page=page,
        limit=limit,
        total_pages=total_pages,
    )


@router.get("/{id}", response_model=EnquiryOut)
def get_enquiry_details(
    id: str,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_staff_or_admin),
):
    """
    Retrieve full enquiry details by UUID or reference ID.
    Includes latest AI analysis, internal notes, and activity audit events.
    """
    enquiry = enquiry_repo.get_enquiry_by_id(db, id)
    if not enquiry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Enquiry '{id}' not found"
        )
    return serialize_enquiry(enquiry)


@router.patch("/{id}/status", response_model=EnquiryOut)
def update_enquiry_status(
    id: str,
    payload: EnquiryStatusUpdate,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_staff_or_admin),
):
    """
    Update enquiry workflow status with audit tracking.
    """
    enquiry = enquiry_repo.get_enquiry_by_id(db, id)
    if not enquiry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Enquiry '{id}' not found"
        )

    updated = enquiry_repo.update_status(
        db=db,
        enquiry=enquiry,
        new_status=payload.status,
        actor_id=current_user.id
    )
    return serialize_enquiry(updated)


@router.patch("/{id}/assignment", response_model=EnquiryOut)
def update_enquiry_assignment(
    id: str,
    payload: EnquiryAssignmentUpdate,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin),
):
    """
    Reassign an enquiry to a different team or specific staff member.
    Requires ADMIN role.
    """
    enquiry = enquiry_repo.get_enquiry_by_id(db, id)
    if not enquiry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Enquiry '{id}' not found"
        )

    updated = enquiry_repo.update_assignment(
        db=db,
        enquiry=enquiry,
        assigned_to=payload.assigned_to,
        assigned_team=payload.assigned_team,
        actor_id=current_user.id
    )
    return serialize_enquiry(updated)


@router.post("/{id}/notes", response_model=EnquiryNoteOut, status_code=status.HTTP_201_CREATED)
def add_enquiry_note(
    id: str,
    payload: EnquiryNoteCreate,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_staff_or_admin),
):
    """
    Add an internal collaborative note to an enquiry record.
    """
    enquiry = enquiry_repo.get_enquiry_by_id(db, id)
    if not enquiry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Enquiry '{id}' not found"
        )

    author_name = current_user.full_name or current_user.email or "Staff"
    note = enquiry_repo.add_note(
        db=db,
        enquiry_id=enquiry.id,
        content=payload.content,
        author_name=author_name,
        author_id=current_user.id
    )
    return EnquiryNoteOut.model_validate(note)


@router.post("/{id}/analyze", response_model=EnquiryOut)
def trigger_enquiry_reanalysis(
    id: str,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_admin),
):
    """
    Manually re-run AI automated triage on an enquiry.
    Requires ADMIN role.
    """
    try:
        updated = enquiry_service.reanalyze_enquiry(
            db=db,
            enquiry_id=id,
            actor_id=current_user.id
        )
        return serialize_enquiry(updated)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.get("/{id}/events", response_model=List[EnquiryEventOut])
def get_enquiry_events(
    id: str,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_staff_or_admin),
):
    """
    Fetch the complete audit history timeline of an enquiry.
    """
    enquiry = enquiry_repo.get_enquiry_by_id(db, id)
    if not enquiry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Enquiry '{id}' not found"
        )
    return [EnquiryEventOut.model_validate(e) for e in enquiry.events]


def get_or_create_enquiry(
    db: Session,
    id: str,
    recipient_name: Optional[str] = None,
    recipient_email: Optional[str] = None,
    company_name: Optional[str] = None,
    service_interest: Optional[str] = None,
    message: Optional[str] = None,
) -> Enquiry:
    """Finds enquiry by id/ref or automatically seeds a database record if missing."""
    enquiry = enquiry_repo.get_enquiry_by_id(db, id)
    if enquiry:
        return enquiry

    ref = id if id.startswith("ENQ-") else f"ENQ-2026-{abs(hash(id)) % 100000:05d}"
    enquiry = Enquiry(
        reference_id=ref,
        full_name=recipient_name or "Enterprise Partner",
        email=recipient_email or "client@enterprise.com",
        company_name=company_name or "Enterprise Client",
        service_interest=service_interest or "AI & Autonomous Agents",
        subject=f"Enterprise Engagement: {ref}",
        message=message or "Enterprise evaluation and technical architecture consultation inquiry.",
        status="NEW",
        source="WEB_PORTAL"
    )
    db.add(enquiry)
    db.commit()
    db.refresh(enquiry)
    return enquiry


@router.post("/{id}/generate-email-draft", response_model=GeneratedDraftResponse)
def generate_stage_email_draft(
    id: str,
    payload: GenerateDraftRequest,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_staff_or_admin),
):
    """
    Uses Groq LLM to generate an executive-ready email draft matching the target workflow stage.
    """
    enquiry = get_or_create_enquiry(
        db=db,
        id=id,
        recipient_name=payload.recipient_name,
        recipient_email=payload.recipient_email,
        company_name=payload.company_name,
        service_interest=payload.service_interest,
        message=payload.message
    )

    draft = email_service.generate_stage_email_draft(
        enquiry=enquiry,
        target_status=payload.target_status,
        context_note=payload.context_note
    )
    return draft


@router.post("/{id}/status-with-email", response_model=EnquiryOut)
def update_status_with_email(
    id: str,
    payload: SendStatusEmailRequest,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_staff_or_admin),
):
    """
    Transitions enquiry status, logs audit event, and dispatches an automated
    stage-specific email to the client via n8n (or local simulated queue).
    """
    enquiry = get_or_create_enquiry(
        db=db,
        id=id,
        recipient_name=payload.recipient_name,
        recipient_email=payload.recipient_email,
        company_name=payload.company_name,
        service_interest=payload.service_interest,
        message=payload.message
    )

    # 1. Update enquiry status
    target_status = payload.get_status()
    updated = enquiry_repo.update_status(
        db=db,
        enquiry=enquiry,
        new_status=target_status,
        actor_id=current_user.id
    )

    # 2. Queue and dispatch email if requested
    if payload.send_email and payload.subject and payload.body:
        email_service.queue_stage_email(
            db=db,
            enquiry=updated,
            stage=target_status,
            subject=payload.subject,
            body=payload.body,
            send_email=True
        )

    return serialize_enquiry(updated)


@router.get("/{id}/emails", response_model=List[EnquiryEmailOut])
def get_enquiry_emails(
    id: str,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_staff_or_admin),
):
    """
    Retrieves all stage emails and automated communications sent for this enquiry.
    """
    enquiry = enquiry_repo.get_enquiry_by_id(db, id)
    if not enquiry:
        return []

    emails = email_service.list_enquiry_emails(db=db, enquiry_id=enquiry.id)
    return [EnquiryEmailOut.model_validate(e) for e in emails]


@router.patch("/webhooks/n8n/email-status", tags=["Webhooks"])
def n8n_email_status_webhook(
    payload: N8nStatusWebhookPayload,
    db: Session = Depends(get_db),
):
    """
    Callback endpoint for n8n to report message delivery status, message_id, or client reply.
    """
    updated_email = email_service.update_email_status(
        db=db,
        email_id=payload.email_id,
        status=payload.status,
        message_id=payload.message_id,
        n8n_execution_id=payload.n8n_execution_id
    )
    if not updated_email:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Email record '{payload.email_id}' not found"
        )
    return {"status": "ok", "email_id": updated_email.id, "email_status": updated_email.status}
