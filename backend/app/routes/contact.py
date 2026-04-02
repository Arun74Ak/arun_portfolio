from fastapi import APIRouter, Depends, Request, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select, func

from app.database import get_db
from app.models import ContactMessage, MessageStatus
from app.schemas import (
    ContactFormRequest,
    ContactFormResponse,
    MessageOut,
    MessagesListResponse,
)
from app.mail import send_contact_notification

router = APIRouter(prefix="/contact", tags=["Contact"])


# ─── POST /contact  ────────────────────────────────────────────────────────────
@router.post(
    "",
    response_model=ContactFormResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit contact form",
)
async def submit_contact(
    payload: ContactFormRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Saves the contact form submission to MySQL, then sends:
    - A notification email to the portfolio owner.
    - A confirmation email back to the sender.
    """
    ip  = request.client.host if request.client else None
    ua  = request.headers.get("user-agent")

    # 1. Persist to DB first (always, even if mail fails)
    msg = ContactMessage(
        name       = payload.name,
        email      = payload.email,
        message    = payload.message,
        status     = MessageStatus.pending,
        ip_address = ip,
        user_agent = ua,
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)

    # 2. Send emails
    try:
        await send_contact_notification(
            name    = payload.name,
            email   = payload.email,
            message = payload.message,
        )
        msg.status = MessageStatus.sent
    except Exception as exc:
        msg.status    = MessageStatus.failed
        msg.mail_error = str(exc)
        db.commit()
        # Still return success to user — message is saved, mail issue is internal
        return ContactFormResponse(
            success = True,
            message = "Message received! (email delivery is being retried)",
            id      = msg.id,
        )

    db.commit()
    return ContactFormResponse(
        success = True,
        message = "Message sent successfully! I'll get back to you soon.",
        id      = msg.id,
    )


# ─── GET /contact/messages  (simple admin listing) ────────────────────────────
@router.get(
    "/messages",
    response_model=MessagesListResponse,
    summary="List all submissions (admin)",
)
def list_messages(
    skip:  int = 0,
    limit: int = 50,
    db:    Session = Depends(get_db),
):
    """Returns paginated contact submissions. Protect this route in production!"""
    total = db.scalar(select(func.count()).select_from(ContactMessage))
    rows  = db.scalars(
        select(ContactMessage)
        .order_by(ContactMessage.created_at.desc())
        .offset(skip)
        .limit(limit)
    ).all()
    return MessagesListResponse(total=total, messages=rows)


# ─── PATCH /contact/messages/{id}/read  ───────────────────────────────────────
@router.patch(
    "/messages/{msg_id}/read",
    response_model=MessageOut,
    summary="Mark message as read",
)
def mark_read(msg_id: int, db: Session = Depends(get_db)):
    msg = db.get(ContactMessage, msg_id)
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    msg.is_read = True
    db.commit()
    db.refresh(msg)
    return msg
