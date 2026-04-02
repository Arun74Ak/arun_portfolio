from datetime import datetime
from sqlalchemy import String, Text, DateTime, Boolean, Integer, Enum
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base
import enum


class MessageStatus(str, enum.Enum):
    pending   = "pending"
    sent      = "sent"
    failed    = "failed"


class ContactMessage(Base):
    """Stores every contact form submission."""
    __tablename__ = "contact_messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

    name:    Mapped[str]  = mapped_column(String(120), nullable=False)
    email:   Mapped[str]  = mapped_column(String(255), nullable=False)
    message: Mapped[str]  = mapped_column(Text,        nullable=False)

    # Mail delivery tracking
    status:      Mapped[MessageStatus] = mapped_column(
        Enum(MessageStatus), default=MessageStatus.pending, nullable=False
    )
    mail_error:  Mapped[str | None]    = mapped_column(Text, nullable=True)
    is_read:     Mapped[bool]          = mapped_column(Boolean, default=False)

    # Metadata
    ip_address:  Mapped[str | None]    = mapped_column(String(45), nullable=True)
    user_agent:  Mapped[str | None]    = mapped_column(String(512), nullable=True)
    created_at:  Mapped[datetime]      = mapped_column(DateTime, default=datetime.utcnow)
    updated_at:  Mapped[datetime]      = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    def __repr__(self) -> str:
        return f"<ContactMessage id={self.id} from={self.email} status={self.status}>"
