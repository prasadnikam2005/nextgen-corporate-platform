from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import require_staff_or_admin
from app.models.profile import Profile
from app.repositories.analytics_repo import analytics_repo
from app.schemas.analytics import (
    AnalyticsOverview,
    EnquiriesOverTimePoint,
    CategoryBreakdownPoint,
    StatusBreakdownPoint,
    PriorityBreakdownPoint,
)

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/overview", response_model=AnalyticsOverview)
def get_analytics_overview(
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_staff_or_admin),
):
    """
    Get top-level aggregated executive metrics computed from actual database records.
    """
    return analytics_repo.get_overview(db)


@router.get("/enquiries-over-time", response_model=List[EnquiriesOverTimePoint])
def get_enquiries_over_time(
    days: int = Query(14, ge=3, le=90, description="Number of past days to aggregate"),
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_staff_or_admin),
):
    """
    Enquiry volume trends over time computed from database timestamps.
    """
    return analytics_repo.get_enquiries_over_time(db, days=days)


@router.get("/by-category", response_model=List[CategoryBreakdownPoint])
def get_by_category(
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_staff_or_admin),
):
    """
    Enquiries grouped by service category with percentage distribution.
    """
    return analytics_repo.get_by_category(db)


@router.get("/by-status", response_model=List[StatusBreakdownPoint])
def get_by_status(
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_staff_or_admin),
):
    """
    Enquiries grouped by current workflow pipeline status.
    """
    return analytics_repo.get_by_status(db)


@router.get("/by-priority", response_model=List[PriorityBreakdownPoint])
def get_by_priority(
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_staff_or_admin),
):
    """
    Enquiries grouped by triage priority level.
    """
    return analytics_repo.get_by_priority(db)
