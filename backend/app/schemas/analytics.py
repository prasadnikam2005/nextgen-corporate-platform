from typing import List
from pydantic import BaseModel


class AnalyticsOverview(BaseModel):
    total_enquiries: int
    pending_review: int
    high_priority_count: int
    converted_count: int
    conversion_rate: float
    avg_response_hours: float


class EnquiriesOverTimePoint(BaseModel):
    date: str
    count: int


class CategoryBreakdownPoint(BaseModel):
    category: str
    count: int
    percentage: float


class StatusBreakdownPoint(BaseModel):
    status: str
    count: int


class PriorityBreakdownPoint(BaseModel):
    priority: str
    count: int
