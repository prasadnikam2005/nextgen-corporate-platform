from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class StructuredAIOutput(BaseModel):
    category: str = Field(description="Primary service category matching the corporate service catalog")
    subcategory: Optional[str] = Field(default=None, description="Specific domain or subfield")
    intent: str = Field(description="Detected customer intent, e.g. NEW_PROJECT, SYSTEM_AUDIT, CONSULTING_ENGAGEMENT, GENERAL_INQUIRY")
    priority: str = Field(description="Assessed priority level: LOW, MEDIUM, HIGH, or CRITICAL")
    summary: str = Field(description="A concise 2-3 sentence executive summary of the enquiry")
    suggested_team: str = Field(description="The internal engineering or solution team best suited to handle this")
    routing_reason: str = Field(description="Technical rationale for the team and priority recommendation")
    confidence: float = Field(ge=0.0, le=1.0, description="Confidence score between 0.0 and 1.0")
    extracted_requirements: List[str] = Field(default_factory=list, description="Key functional, technical, or timeline requirements")
    suggested_response: str = Field(description="A polished, professional email draft addressing the client directly")


class AIAnalysisOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    enquiry_id: str
    model_provider: str
    model_name: str
    category: Optional[str] = None
    subcategory: Optional[str] = None
    intent: Optional[str] = None
    priority: Optional[str] = None
    summary: Optional[str] = None
    suggested_team: Optional[str] = None
    routing_reason: Optional[str] = None
    confidence: Optional[float] = None
    extracted_requirements: Optional[Any] = None
    suggested_response: Optional[str] = None
    processing_status: str
    error_code: Optional[str] = None
    created_at: datetime
