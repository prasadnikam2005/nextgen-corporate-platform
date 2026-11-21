import logging
from typing import Optional
from sqlalchemy.orm import Session
from app.models.enquiry import Enquiry
from app.repositories.enquiry_repo import enquiry_repo
from app.services.ai_service import ai_service
from app.schemas.enquiry import EnquiryCreate

logger = logging.getLogger("app.enquiry_service")


class EnquiryService:
    def process_public_enquiry(self, db: Session, enquiry_in: EnquiryCreate) -> Enquiry:
        """
        Processes an incoming public enquiry with the mandatory SAVE FIRST guarantee:
        1. Validate honeypot spam guard.
        2. Persist the enquiry into the database immediately.
        3. Attempt AI automated triage.
        4. If AI succeeds, update category, priority, and store analysis.
        5. If AI fails, record failure status without losing or rolling back the enquiry.
        """
        # Honeypot spam defense
        if enquiry_in.honeypot and enquiry_in.honeypot.strip():
            logger.warning(f"Spam bot detected via honeypot trap: email={enquiry_in.email}")
            # Silently accept to mislead spambot, but return dummy or drop
            return enquiry_repo.create_enquiry(db, enquiry_in)

        # 1. Save original enquiry FIRST
        enquiry = enquiry_repo.create_enquiry(db, enquiry_in)
        logger.info(f"Enquiry persisted successfully: id={enquiry.id}, ref={enquiry.reference_id}")

        # 2. Attempt AI analysis
        try:
            ai_output = ai_service.analyze_enquiry(
                full_name=enquiry.full_name,
                email=enquiry.email,
                company=enquiry.company_name,
                subject=enquiry.subject,
                message=enquiry.message
            )
            
            analysis_dict = {
                "model_provider": ai_service.provider,
                "model_name": ai_service.model,
                "category": ai_output.category,
                "subcategory": ai_output.subcategory,
                "intent": ai_output.intent,
                "priority": ai_output.priority,
                "summary": ai_output.summary,
                "suggested_team": ai_output.suggested_team,
                "routing_reason": ai_output.routing_reason,
                "confidence": ai_output.confidence,
                "extracted_requirements": ai_output.extracted_requirements,
                "suggested_response": ai_output.suggested_response
            }

            enquiry_repo.save_ai_analysis(
                db=db,
                enquiry_id=enquiry.id,
                analysis_data=analysis_dict,
                status="COMPLETED"
            )
            logger.info(f"AI analysis completed for enquiry {enquiry.reference_id}: {ai_output.category} / {ai_output.priority}")

        except Exception as e:
            logger.error(f"AI analysis failed for enquiry {enquiry.id}: {str(e)}. Preserving enquiry in database.")
            enquiry_repo.save_ai_analysis(
                db=db,
                enquiry_id=enquiry.id,
                analysis_data={
                    "model_provider": ai_service.provider,
                    "model_name": ai_service.model,
                    "summary": "Automated triage pending or temporarily unavailable.",
                    "priority": "MEDIUM",
                    "category": enquiry.service_interest or "General Enquiry"
                },
                status="FAILED",
                error_code="AI_PROCESSING_ERROR"
            )

        # Return the refreshed enquiry with all relations
        return enquiry_repo.get_enquiry_by_id(db, enquiry.id) or enquiry

    def reanalyze_enquiry(self, db: Session, enquiry_id: str, actor_id: Optional[str] = None) -> Enquiry:
        """
        Manually trigger AI re-analysis on an existing enquiry.
        """
        enquiry = enquiry_repo.get_enquiry_by_id(db, enquiry_id)
        if not enquiry:
            raise ValueError(f"Enquiry {enquiry_id} not found")

        ai_output = ai_service.analyze_enquiry(
            full_name=enquiry.full_name,
            email=enquiry.email,
            company=enquiry.company_name,
            subject=enquiry.subject,
            message=enquiry.message
        )

        analysis_dict = {
            "model_provider": ai_service.provider,
            "model_name": ai_service.model,
            "category": ai_output.category,
            "subcategory": ai_output.subcategory,
            "intent": ai_output.intent,
            "priority": ai_output.priority,
            "summary": ai_output.summary,
            "suggested_team": ai_output.suggested_team,
            "routing_reason": ai_output.routing_reason,
            "confidence": ai_output.confidence,
            "extracted_requirements": ai_output.extracted_requirements,
            "suggested_response": ai_output.suggested_response
        }

        enquiry_repo.save_ai_analysis(
            db=db,
            enquiry_id=enquiry.id,
            analysis_data=analysis_dict,
            status="COMPLETED"
        )

        enquiry_repo.record_event(
            db=db,
            enquiry_id=enquiry.id,
            actor_user_id=actor_id,
            event_type="MANUAL_REANALYSIS",
            description="Manual AI re-analysis triggered by administrator"
        )

        return enquiry_repo.get_enquiry_by_id(db, enquiry.id)


enquiry_service = EnquiryService()
