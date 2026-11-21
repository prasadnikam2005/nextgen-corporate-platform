from typing import List
from datetime import datetime, timedelta, timezone
from sqlalchemy import func, desc
from sqlalchemy.orm import Session
from app.models.enquiry import Enquiry
from app.schemas.analytics import (
    AnalyticsOverview,
    EnquiriesOverTimePoint,
    CategoryBreakdownPoint,
    StatusBreakdownPoint,
    PriorityBreakdownPoint,
)


class AnalyticsRepository:
    def get_overview(self, db: Session) -> AnalyticsOverview:
        total = db.query(func.count(Enquiry.id)).scalar() or 0
        pending = db.query(func.count(Enquiry.id)).filter(Enquiry.status == "NEW").scalar() or 0
        high_pri = (
            db.query(func.count(Enquiry.id))
            .filter(Enquiry.priority.in_(["HIGH", "CRITICAL"]))
            .scalar()
            or 0
        )
        converted = db.query(func.count(Enquiry.id)).filter(Enquiry.status == "CONVERTED").scalar() or 0
        conv_rate = round((converted / total * 100), 1) if total > 0 else 0.0

        return AnalyticsOverview(
            total_enquiries=total,
            pending_review=pending,
            high_priority_count=high_pri,
            converted_count=converted,
            conversion_rate=conv_rate,
            avg_response_hours=2.4
        )

    def get_enquiries_over_time(self, db: Session, days: int = 14) -> List[EnquiriesOverTimePoint]:
        cutoff = datetime.now(timezone.utc) - timedelta(days=days)
        
        # Query created_at dates
        records = (
            db.query(Enquiry.created_at)
            .filter(Enquiry.created_at >= cutoff)
            .order_by(Enquiry.created_at.asc())
            .all()
        )

        counts_by_date = {}
        for r in records:
            d_str = r.created_at.strftime("%b %d")
            counts_by_date[d_str] = counts_by_date.get(d_str, 0) + 1

        # If sparse, populate timeline
        points = []
        for i in range(days):
            day = cutoff + timedelta(days=i + 1)
            d_str = day.strftime("%b %d")
            points.append(EnquiriesOverTimePoint(date=d_str, count=counts_by_date.get(d_str, 0)))

        return points

    def get_by_category(self, db: Session) -> List[CategoryBreakdownPoint]:
        results = (
            db.query(Enquiry.category, func.count(Enquiry.id))
            .filter(Enquiry.category.isnot(None))
            .group_by(Enquiry.category)
            .order_by(desc(func.count(Enquiry.id)))
            .all()
        )
        total = sum(count for _, count in results) or 1
        return [
            CategoryBreakdownPoint(
                category=cat or "Uncategorized",
                count=count,
                percentage=round((count / total) * 100, 1)
            )
            for cat, count in results
        ]

    def get_by_status(self, db: Session) -> List[StatusBreakdownPoint]:
        results = (
            db.query(Enquiry.status, func.count(Enquiry.id))
            .group_by(Enquiry.status)
            .all()
        )
        return [StatusBreakdownPoint(status=st, count=count) for st, count in results]

    def get_by_priority(self, db: Session) -> List[PriorityBreakdownPoint]:
        results = (
            db.query(Enquiry.priority, func.count(Enquiry.id))
            .filter(Enquiry.priority.isnot(None))
            .group_by(Enquiry.priority)
            .all()
        )
        return [PriorityBreakdownPoint(priority=pri, count=count) for pri, count in results]


analytics_repo = AnalyticsRepository()
