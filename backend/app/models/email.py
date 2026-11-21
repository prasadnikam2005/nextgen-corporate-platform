import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class EnquiryEmail(Base):
    __tablename__ = "enquiry_emails"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    enquiry_id = Column(
        String(36),
        ForeignKey("enquiries.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    stage = Column(String(30), nullable=False, index=True)
    recipient_email = Column(String(255), nullable=False)
    recipient_name = Column(String(255), nullable=False)
    subject = Column(String(255), nullable=False)
    body = Column(Text, nullable=False)
    # Status: DRAFT, PENDING, SENT, FAILED, REPLIED
    status = Column(String(30), nullable=False, default="PENDING", index=True)
    n8n_execution_id = Column(String(100), nullable=True)
    message_id = Column(String(255), nullable=True)
    
    sent_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    enquiry = relationship("Enquiry", back_populates="emails")
