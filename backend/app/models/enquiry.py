import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Enquiry(Base):
    __tablename__ = "enquiries"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    reference_id = Column(String(30), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), index=True, nullable=False)
    phone = Column(String(50), nullable=True)
    company_name = Column(String(255), nullable=True)
    subject = Column(String(255), nullable=True)
    message = Column(Text, nullable=False)
    service_interest = Column(String(255), nullable=True)
    
    # Status: NEW, CONTACTED, IN_DISCUSSION, PROPOSAL_SENT, CONVERTED, CLOSED
    status = Column(String(30), nullable=False, default="NEW", index=True)
    
    # Priority: LOW, MEDIUM, HIGH, CRITICAL
    priority = Column(String(30), nullable=True, index=True)
    
    # Category determined by AI
    category = Column(String(255), nullable=True, index=True)
    
    # Routing assignment
    assigned_team = Column(String(255), nullable=True)
    assigned_to = Column(String(36), ForeignKey("profiles.id", ondelete="SET NULL"), nullable=True)
    
    source = Column(String(100), default="WEB_PORTAL", nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    closed_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    assignee = relationship("Profile", back_populates="assigned_enquiries", foreign_keys=[assigned_to])
    ai_analyses = relationship(
        "EnquiryAIAnalysis",
        back_populates="enquiry",
        cascade="all, delete-orphan",
        order_by="desc(EnquiryAIAnalysis.created_at)"
    )
    events = relationship(
        "EnquiryEvent",
        back_populates="enquiry",
        cascade="all, delete-orphan",
        order_by="desc(EnquiryEvent.created_at)"
    )
    notes = relationship(
        "EnquiryNote",
        back_populates="enquiry",
        cascade="all, delete-orphan",
        order_by="desc(EnquiryNote.created_at)"
    )
    emails = relationship(
        "EnquiryEmail",
        back_populates="enquiry",
        cascade="all, delete-orphan",
        order_by="desc(EnquiryEmail.created_at)"
    )
