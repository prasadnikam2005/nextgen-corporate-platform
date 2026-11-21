import random
from datetime import datetime, timezone
from typing import Optional, List, Tuple
from sqlalchemy import or_, desc, asc
from sqlalchemy.orm import Session, joinedload
from app.models.enquiry import Enquiry
from app.models.ai_analysis import EnquiryAIAnalysis
from app.models.event import EnquiryEvent, EnquiryNote
from app.schemas.enquiry import EnquiryCreate


def generate_reference_id(db: Session) -> str:
    """Generates a unique reference ID e.g. ENQ-2026-00428."""
    current_year = datetime.now(timezone.utc).year
    for _ in range(10):
        random_num = random.randint(10000, 99999)
        ref = f"ENQ-{current_year}-{random_num}"
        existing = db.query(Enquiry).filter(Enquiry.reference_id == ref).first()
        if not existing:
            return ref
    return f"ENQ-{current_year}-{int(datetime.now(timezone.utc).timestamp()) % 100000:05d}"


class EnquiryRepository:
    def create_enquiry(self, db: Session, enquiry_in: EnquiryCreate) -> Enquiry:
        ref_id = generate_reference_id(db)
        enquiry = Enquiry(
            reference_id=ref_id,
            full_name=enquiry_in.full_name,
            email=enquiry_in.email,
            phone=enquiry_in.phone,
            company_name=enquiry_in.company_name,
            subject=enquiry_in.subject,
            message=enquiry_in.message,
            service_interest=enquiry_in.service_interest,
            status="NEW",
            source="WEB_PORTAL"
        )
        db.add(enquiry)
        db.commit()
        db.refresh(enquiry)

        # Record initial event
        self.record_event(
            db=db,
            enquiry_id=enquiry.id,
            event_type="ENQUIRY_CREATED",
            description=f"Enquiry submitted by {enquiry.full_name} ({enquiry.email})",
            new_value={"status": "NEW", "reference_id": ref_id}
        )

        return enquiry

    def record_event(
        self,
        db: Session,
        enquiry_id: str,
        event_type: str,
        description: Optional[str] = None,
        previous_value: Optional[dict] = None,
        new_value: Optional[dict] = None,
        actor_user_id: Optional[str] = None
    ) -> EnquiryEvent:
        event = EnquiryEvent(
            enquiry_id=enquiry_id,
            actor_user_id=actor_user_id,
            event_type=event_type,
            previous_value=previous_value,
            new_value=new_value,
            description=description
        )
        db.add(event)
        db.commit()
        db.refresh(event)
        return event

    def save_ai_analysis(
        self,
        db: Session,
        enquiry_id: str,
        analysis_data: dict,
        status: str = "COMPLETED",
        error_code: Optional[str] = None
    ) -> EnquiryAIAnalysis:
        analysis = EnquiryAIAnalysis(
            enquiry_id=enquiry_id,
            model_provider=analysis_data.get("model_provider", "mock"),
            model_name=analysis_data.get("model_name", "builtin-heuristic"),
            category=analysis_data.get("category"),
            subcategory=analysis_data.get("subcategory"),
            intent=analysis_data.get("intent"),
            priority=analysis_data.get("priority"),
            summary=analysis_data.get("summary"),
            suggested_team=analysis_data.get("suggested_team"),
            routing_reason=analysis_data.get("routing_reason"),
            confidence=analysis_data.get("confidence"),
            extracted_requirements=analysis_data.get("extracted_requirements"),
            suggested_response=analysis_data.get("suggested_response"),
            processing_status=status,
            error_code=error_code
        )
        db.add(analysis)

        # Update parent enquiry category, priority, and assigned_team
        enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
        if enquiry and status == "COMPLETED":
            enquiry.category = analysis.category
            enquiry.priority = analysis.priority
            enquiry.assigned_team = analysis.suggested_team
            enquiry.updated_at = datetime.now(timezone.utc)
            db.add(enquiry)

        db.commit()
        db.refresh(analysis)

        # Log AI analysis event
        event_type = "AI_ANALYSIS_COMPLETED" if status == "COMPLETED" else "AI_ANALYSIS_FAILED"
        self.record_event(
            db=db,
            enquiry_id=enquiry_id,
            event_type=event_type,
            description=f"AI automated triage: Category '{analysis.category}', Priority '{analysis.priority}', Team '{analysis.suggested_team}'",
            new_value={"priority": analysis.priority, "category": analysis.category}
        )

        return analysis

    def get_enquiry_by_id(self, db: Session, enquiry_id: str) -> Optional[Enquiry]:
        return (
            db.query(Enquiry)
            .options(
                joinedload(Enquiry.ai_analyses),
                joinedload(Enquiry.events),
                joinedload(Enquiry.notes)
            )
            .filter(or_(Enquiry.id == enquiry_id, Enquiry.reference_id == enquiry_id))
            .first()
        )

    def list_enquiries(
        self,
        db: Session,
        status: Optional[str] = None,
        priority: Optional[str] = None,
        category: Optional[str] = None,
        search: Optional[str] = None,
        page: int = 1,
        limit: int = 20,
    ) -> Tuple[List[Enquiry], int]:
        query = db.query(Enquiry).options(
            joinedload(Enquiry.ai_analyses),
            joinedload(Enquiry.events),
            joinedload(Enquiry.notes)
        )

        if status and status != "ALL":
            query = query.filter(Enquiry.status == status.upper())
        if priority and priority != "ALL":
            query = query.filter(Enquiry.priority == priority.upper())
        if category and category != "ALL":
            query = query.filter(Enquiry.category == category)
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                or_(
                    Enquiry.reference_id.ilike(search_term),
                    Enquiry.full_name.ilike(search_term),
                    Enquiry.email.ilike(search_term),
                    Enquiry.company_name.ilike(search_term),
                    Enquiry.subject.ilike(search_term),
                )
            )

        total = query.count()
        offset = (page - 1) * limit
        items = query.order_by(desc(Enquiry.created_at)).offset(offset).limit(limit).all()
        return items, total

    def update_status(
        self,
        db: Session,
        enquiry: Enquiry,
        new_status: str,
        actor_id: Optional[str] = None
    ) -> Enquiry:
        old_status = enquiry.status
        enquiry.status = new_status
        enquiry.updated_at = datetime.now(timezone.utc)
        if new_status in ("CLOSED", "CONVERTED"):
            enquiry.closed_at = datetime.now(timezone.utc)
        db.add(enquiry)
        db.commit()
        db.refresh(enquiry)

        self.record_event(
            db=db,
            enquiry_id=enquiry.id,
            actor_user_id=actor_id,
            event_type="STATUS_CHANGED",
            description=f"Status changed from {old_status} to {new_status}",
            previous_value={"status": old_status},
            new_value={"status": new_status}
        )
        return enquiry

    def update_assignment(
        self,
        db: Session,
        enquiry: Enquiry,
        assigned_to: Optional[str],
        assigned_team: Optional[str],
        actor_id: Optional[str] = None
    ) -> Enquiry:
        old_assigned = {"assigned_to": enquiry.assigned_to, "assigned_team": enquiry.assigned_team}
        enquiry.assigned_to = assigned_to
        if assigned_team:
            enquiry.assigned_team = assigned_team
        enquiry.updated_at = datetime.now(timezone.utc)
        db.add(enquiry)
        db.commit()
        db.refresh(enquiry)

        self.record_event(
            db=db,
            enquiry_id=enquiry.id,
            actor_user_id=actor_id,
            event_type="ASSIGNMENT_CHANGED",
            description=f"Assignment updated to team '{enquiry.assigned_team}'",
            previous_value=old_assigned,
            new_value={"assigned_to": assigned_to, "assigned_team": enquiry.assigned_team}
        )
        return enquiry

    def add_note(
        self,
        db: Session,
        enquiry_id: str,
        content: str,
        author_name: str,
        author_id: Optional[str] = None
    ) -> EnquiryNote:
        note = EnquiryNote(
            enquiry_id=enquiry_id,
            author_id=author_id,
            author_name=author_name,
            content=content
        )
        db.add(note)
        db.commit()
        db.refresh(note)

        self.record_event(
            db=db,
            enquiry_id=enquiry_id,
            actor_user_id=author_id,
            event_type="NOTE_ADDED",
            description=f"Internal note added by {author_name}"
        )
        return note


enquiry_repo = EnquiryRepository()
