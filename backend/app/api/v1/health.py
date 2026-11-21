from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.core.database import get_db

router = APIRouter()


@router.get("/health", tags=["System"])
def get_health(db: Session = Depends(get_db)):
    """
    Safe health check endpoint validating application and database connectivity.
    Never exposes internal credentials, connection strings, or system paths.
    """
    db_status = "connected"
    try:
        db.execute(text("SELECT 1"))
    except Exception:
        db_status = "disconnected"

    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "database": db_status,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "service": "Nexora Enterprise API",
        "version": "1.0.0"
    }
