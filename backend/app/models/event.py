import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, JSON, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class EnquiryEvent(Base):
    __tablename__ = "enquiry_events"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    enquiry_id = Column(
        String(36),
        ForeignKey("enquiries.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    actor_user_id = Column(
        String(36),
        ForeignKey("profiles.id", ondelete="SET NULL"),
        nullable=True
    )
    
    # Event types: ENQUIRY_CREATED, AI_ANALYSIS_COMPLETED, AI_ANALYSIS_FAILED, STATUS_CHANGED, ASSIGNMENT_CHANGED, NOTE_ADDED
    event_type = Column(String(100), nullable=False, index=True)
    previous_value = Column(JSON, nullable=True)
    new_value = Column(JSON, nullable=True)
    description = Column(Text, nullable=True)
    
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    enquiry = relationship("Enquiry", back_populates="events")
    actor = relationship("Profile", back_populates="events", foreign_keys=[actor_user_id])


class EnquiryNote(Base):
    __tablename__ = "enquiry_notes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    enquiry_id = Column(
        String(36),
        ForeignKey("enquiries.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    author_id = Column(
        String(36),
        ForeignKey("profiles.id", ondelete="SET NULL"),
        nullable=True
    )
    author_name = Column(String(255), nullable=False, default="Admin")
    content = Column(Text, nullable=False)
    
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    enquiry = relationship("Enquiry", back_populates="notes")
    author = relationship("Profile", foreign_keys=[author_id])
