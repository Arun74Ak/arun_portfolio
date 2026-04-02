from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, field_validator
from app.models import MessageStatus


# ─── Request ──────────────────────────────────────────────────────────────────

class ContactFormRequest(BaseModel):
    name:    str      = Field(..., min_length=2, max_length=120,  examples=["Arunkumar J"])
    email:   EmailStr = Field(...,                                 examples=["hello@example.com"])
    message: str      = Field(..., min_length=10, max_length=4000, examples=["Hi, I'd love to collaborate!"])

    @field_validator("name")
    @classmethod
    def name_no_special_chars(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("Name cannot be blank.")
        return stripped

    @field_validator("message")
    @classmethod
    def message_strip(cls, v: str) -> str:
        return v.strip()


# ─── Response ─────────────────────────────────────────────────────────────────

class ContactFormResponse(BaseModel):
    success: bool
    message: str
    id:      int | None = None


class MessageOut(BaseModel):
    id:         int
    name:       str
    email:      str
    message:    str
    status:     MessageStatus
    is_read:    bool
    created_at: datetime

    model_config = {"from_attributes": True}


class MessagesListResponse(BaseModel):
    total:    int
    messages: list[MessageOut]


class HealthResponse(BaseModel):
    status:   str
    database: str
    version:  str = "1.0.0"
