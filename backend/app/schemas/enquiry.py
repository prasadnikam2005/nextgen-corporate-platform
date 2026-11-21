from typing import Optional, List, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, field_validator, ConfigDict
from app.schemas.ai_analysis import AIAnalysisOut


ALLOWED_STATUSES = {
    "NEW",
    "CONTACTED",
    "IN_DISCUSSION",
    "PROPOSAL_SENT",
    "CONVERTED",
    "CLOSED",
}

ALLOWED_PRIORITIES = {"LOW", "MEDIUM", "HIGH", "CRITICAL"}


class EnquiryCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=150)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=50)
    company_name: Optional[str] = Field(default=None, max_length=150)
    subject: Optional[str] = Field(default=None, max_length=255)
    message: str = Field(min_length=5, max_length=5000)
    service_interest: Optional[str] = Field(default=None, max_length=150)
    # Honeypot spam trap
    honeypot: Optional[str] = Field(default="", max_length=50)


class EnquiryStatusUpdate(BaseModel):
    status: str = Field(description="New status value")

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        v_upper = v.upper().strip()
        if v_upper not in ALLOWED_STATUSES:
            raise ValueError(f"Invalid status '{v}'. Allowed values: {', '.join(sorted(ALLOWED_STATUSES))}")
        return v_upper


class EnquiryAssignmentUpdate(BaseModel):
    assigned_to: Optional[str] = None
    assigned_team: Optional[str] = None


class EnquiryNoteCreate(BaseModel):
    content: str = Field(min_length=1, max_length=3000)
    author_name: Optional[str] = "Admin"


class EnquiryNoteOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    enquiry_id: str
    author_name: str
    content: str
    created_at: datetime


class EnquiryEventOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    enquiry_id: str
    actor_user_id: Optional[str] = None
    event_type: str
    previous_value: Optional[Any] = None
    new_value: Optional[Any] = None
    description: Optional[str] = None
    created_at: datetime


class EnquiryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    reference_id: str
    full_name: str
    email: str
    phone: Optional[str] = None
    company_name: Optional[str] = None
    subject: Optional[str] = None
    message: str
    service_interest: Optional[str] = None
    status: str
    priority: Optional[str] = None
    category: Optional[str] = None
    assigned_team: Optional[str] = None
    assigned_to: Optional[str] = None
    source: str
    created_at: datetime
    updated_at: datetime
    closed_at: Optional[datetime] = None
    
    # Nested relations
    ai_analysis: Optional[AIAnalysisOut] = None
    notes: List[EnquiryNoteOut] = []
    events: List[EnquiryEventOut] = []


class EnquiryListResponse(BaseModel):
    items: List[EnquiryOut]
    total: int
    page: int
    limit: int
    total_pages: int
