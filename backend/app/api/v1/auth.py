from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.models.profile import Profile
from app.schemas.auth import ProfileOut

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.get("/me", response_model=ProfileOut)
def get_current_profile(current_user: Profile = Depends(get_current_user)):
    """
    Returns the authenticated user's trusted profile and role.
    Supabase Auth handles sign-in, while this endpoint verifies and syncs permissions.
    """
    return current_user
