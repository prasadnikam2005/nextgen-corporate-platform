import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Float, JSON, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class EnquiryAIAnalysis(Base):
    __tablename__ = "enquiry_ai_analyses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    enquiry_id = Column(
        String(36),
        ForeignKey("enquiries.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    model_provider = Column(String(50), nullable=False, default="mock")
    model_name = Column(String(100), nullable=False, default="builtin-heuristic")
    
    category = Column(String(100), nullable=True)
    subcategory = Column(String(100), nullable=True)
    intent = Column(String(100), nullable=True)
    priority = Column(String(30), nullable=True)
    summary = Column(Text, nullable=True)
    suggested_team = Column(String(100), nullable=True)
    routing_reason = Column(Text, nullable=True)
    confidence = Column(Float, nullable=True)
    extracted_requirements = Column(JSON, nullable=True)
    suggested_response = Column(Text, nullable=True)
    
    # PENDING, COMPLETED, FAILED
    processing_status = Column(String(30), nullable=False, default="PENDING", index=True)
    error_code = Column(String(50), nullable=True)
    
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    enquiry = relationship("Enquiry", back_populates="ai_analyses")
