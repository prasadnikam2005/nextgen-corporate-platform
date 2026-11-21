from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class GenerateDraftRequest(BaseModel):
    target_status: str = Field(description="Target workflow status: NEW, CONTACTED, IN_DISCUSSION, PROPOSAL_SENT, CONVERTED")
    context_note: Optional[str] = Field(default=None, description="Optional extra instructions from the administrator")
    recipient_name: Optional[str] = None
    recipient_email: Optional[str] = None
    company_name: Optional[str] = None
    service_interest: Optional[str] = None
    message: Optional[str] = None


class GeneratedDraftResponse(BaseModel):
    target_status: str
    subject: str
    body: str


class SendStatusEmailRequest(BaseModel):
    new_status: Optional[str] = Field(default=None, description="Target workflow status")
    status: Optional[str] = Field(default=None, description="Alternative alias for new_status")
    send_email: bool = Field(default=True, description="Whether to generate and dispatch an email via n8n")
    subject: Optional[str] = Field(default=None, description="Approved or edited email subject")
    body: Optional[str] = Field(default=None, description="Approved or edited email body text")
    recipient_name: Optional[str] = None
    recipient_email: Optional[str] = None
    company_name: Optional[str] = None
    service_interest: Optional[str] = None
    message: Optional[str] = None

    def get_status(self) -> str:
        val = self.new_status or self.status
        if not val:
            raise ValueError("Field 'new_status' or 'status' is required.")
        return val



class EnquiryEmailOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    enquiry_id: str
    stage: str
    recipient_email: str
    recipient_name: str
    subject: str
    body: str
    status: str
    n8n_execution_id: Optional[str] = None
    message_id: Optional[str] = None
    sent_at: Optional[datetime] = None
    created_at: datetime


class N8nStatusWebhookPayload(BaseModel):
    email_id: str
    status: str = Field(description="Updated status: SENT, FAILED, DELIVERED, REPLIED")
    message_id: Optional[str] = None
    n8n_execution_id: Optional[str] = None
