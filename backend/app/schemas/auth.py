from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict


class UserTokenPayload(BaseModel):
    sub: str
    email: Optional[str] = None
    role: Optional[str] = "STAFF"


class ProfileOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    role: str
    is_active: bool
    created_at: datetime


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    role: Optional[str] = None
