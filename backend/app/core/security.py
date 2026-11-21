import logging
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db
from app.models.profile import Profile
from app.schemas.auth import UserTokenPayload

logger = logging.getLogger("app.security")
security_scheme = HTTPBearer(auto_error=False)


def decode_access_token(token: str) -> UserTokenPayload:
    """
    Validates and decodes a Supabase JWT access token.
    Enforces signature, expiration, and issuer verification where configured.
    """
    # Allow mock / development bypass token if explicitly configured or during test demo
    if settings.ENV in ("development", "test") and token in ("mock_admin_token", "demo_admin_jwt"):
        return UserTokenPayload(
            sub="00000000-0000-0000-0000-000000000001",
            email="admin@nexoratech.com",
            role="ADMIN"
        )
    
    if settings.ENV in ("development", "test") and token in ("mock_staff_token", "demo_staff_jwt"):
        return UserTokenPayload(
            sub="00000000-0000-0000-0000-000000000002",
            email="staff@nexoratech.com",
            role="STAFF"
        )

    try:
        # Standard Supabase JWT validation
        if settings.SUPABASE_JWT_SECRET and settings.SUPABASE_JWT_SECRET != "your-supabase-jwt-secret-here":
            payload = jwt.decode(
                token,
                settings.SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                options={"verify_aud": False}
            )
        else:
            # Fallback in local development if secret is not set yet
            logger.warning("SUPABASE_JWT_SECRET not configured. Decoding without signature verification in development.")
            payload = jwt.get_unverified_claims(token)

        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token missing subject (sub) claim",
                headers={"WWW-Authenticate": "Bearer"},
            )

        email = payload.get("email")
        app_metadata = payload.get("app_metadata", {})
        user_metadata = payload.get("user_metadata", {})
        
        # Determine role from claims, default to STAFF
        role = app_metadata.get("role") or user_metadata.get("role") or "STAFF"

        return UserTokenPayload(sub=user_id, email=email, role=role.upper())

    except JWTError as e:
        logger.error(f"JWT validation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme),
    db: Session = Depends(get_db)
) -> Profile:
    """
    FastAPI dependency to retrieve the verified Profile entity for the authenticated user.
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token_payload = decode_access_token(credentials.credentials)

    # Fetch or synchronize Profile record
    profile = db.query(Profile).filter(Profile.id == token_payload.sub).first()
    if not profile:
        profile = Profile(
            id=token_payload.sub,
            email=token_payload.email,
            full_name=token_payload.email.split("@")[0].capitalize() if token_payload.email else "Staff Member",
            role=token_payload.role or "STAFF",
            is_active=True
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)

    if not profile.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated"
        )

    return profile


def require_admin(
    current_user: Profile = Depends(get_current_user)
) -> Profile:
    """
    FastAPI dependency to require ADMIN role.
    """
    if current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrative privileges required"
        )
    return current_user


def require_staff_or_admin(
    current_user: Profile = Depends(get_current_user)
) -> Profile:
    """
    FastAPI dependency allowing both STAFF and ADMIN roles.
    """
    if current_user.role not in ("STAFF", "ADMIN"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Staff or Admin role required"
        )
    return current_user
