from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from app.config import get_settings

settings = get_settings()

# ─── SMTP Connection Config ────────────────────────────────────────────────────
mail_config = ConnectionConfig(
    MAIL_USERNAME   = settings.MAIL_USERNAME,
    MAIL_PASSWORD   = settings.MAIL_PASSWORD,
    MAIL_FROM       = settings.MAIL_FROM,
    MAIL_FROM_NAME  = settings.MAIL_FROM_NAME,
    MAIL_PORT       = 587,
    MAIL_SERVER     = "smtp.gmail.com",
    MAIL_STARTTLS   = True,
    MAIL_SSL_TLS    = False,
    USE_CREDENTIALS = True,
    VALIDATE_CERTS  = True,
)

fast_mail = FastMail(mail_config)


# ─── HTML Templates ────────────────────────────────────────────────────────────

def _owner_email_html(name: str, email: str, message: str) -> str:
    """Email sent to the portfolio owner when someone submits the form."""
    return f"""
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <style>
    body {{ font-family: 'Segoe UI', Arial, sans-serif; background:#0a0a0f; margin:0; padding:0; }}
    .wrapper {{ max-width:600px; margin:40px auto; background:#13131e; border-radius:16px;
                border:1px solid rgba(99,102,241,0.3); overflow:hidden; }}
    .header {{ background:linear-gradient(135deg,#6366f1,#a855f7); padding:32px 40px; }}
    .header h1 {{ color:#fff; margin:0; font-size:22px; font-weight:800; }}
    .header p  {{ color:rgba(255,255,255,0.8); margin:6px 0 0; font-size:13px; }}
    .body  {{ padding:32px 40px; }}
    .field {{ margin-bottom:24px; }}
    .label {{ font-size:11px; font-weight:700; letter-spacing:.1em; text-transform:uppercase;
              color:#6366f1; margin-bottom:6px; }}
    .value {{ font-size:15px; color:#e8e8f0; background:rgba(255,255,255,0.04);
              border:1px solid rgba(255,255,255,0.07); border-radius:8px;
              padding:12px 16px; line-height:1.6; word-break:break-word; }}
    .footer {{ padding:20px 40px; border-top:1px solid rgba(255,255,255,0.07);
               font-size:12px; color:#666; text-align:center; }}
    a {{ color:#6366f1; }}
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>📬 New Portfolio Message</h1>
      <p>Someone reached out via your contact form</p>
    </div>
    <div class="body">
      <div class="field">
        <div class="label">Name</div>
        <div class="value">{name}</div>
      </div>
      <div class="field">
        <div class="label">Email</div>
        <div class="value"><a href="mailto:{email}">{email}</a></div>
      </div>
      <div class="field">
        <div class="label">Message</div>
        <div class="value">{message.replace(chr(10), '<br/>')}</div>
      </div>
    </div>
    <div class="footer">
      Sent from <strong>arunkumar-portfolio.com</strong> contact form
    </div>
  </div>
</body>
</html>
"""


def _sender_confirm_html(name: str) -> str:
    """Confirmation email sent back to the person who filled the form."""
    return f"""
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <style>
    body {{ font-family:'Segoe UI',Arial,sans-serif; background:#0a0a0f; margin:0; padding:0; }}
    .wrapper {{ max-width:600px; margin:40px auto; background:#13131e; border-radius:16px;
                border:1px solid rgba(99,102,241,0.3); overflow:hidden; }}
    .header {{ background:linear-gradient(135deg,#6366f1,#a855f7); padding:40px; text-align:center; }}
    .header h1 {{ color:#fff; margin:0 0 8px; font-size:26px; font-weight:800; }}
    .header p  {{ color:rgba(255,255,255,0.85); margin:0; font-size:14px; }}
    .body {{ padding:36px 40px; text-align:center; }}
    .emoji {{ font-size:48px; margin-bottom:16px; display:block; }}
    .body h2 {{ color:#e8e8f0; font-size:20px; margin:0 0 12px; }}
    .body p  {{ color:#8888aa; font-size:15px; line-height:1.7; margin:0 0 24px; }}
    .btn {{ display:inline-block; background:linear-gradient(135deg,#6366f1,#a855f7);
            color:#fff; text-decoration:none; padding:14px 32px; border-radius:8px;
            font-weight:700; font-size:14px; }}
    .footer {{ padding:20px 40px; border-top:1px solid rgba(255,255,255,0.07);
               font-size:12px; color:#555; text-align:center; }}
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Arunkumar J</h1>
      <p>Full Stack Developer · Madurai, India</p>
    </div>
    <div class="body">
      <span class="emoji">✅</span>
      <h2>Thanks, {name}!</h2>
      <p>
        Your message has been received. I'll review it and get back to you
        as soon as possible — usually within 24 hours.
      </p>
      <a href="https://www.linkedin.com/in/arunkumar-techie/" class="btn">Connect on LinkedIn</a>
    </div>
    <div class="footer">
      You're receiving this because you submitted the contact form at arunkumar-portfolio.com
    </div>
  </div>
</body>
</html>
"""


# ─── Send Helpers ──────────────────────────────────────────────────────────────

async def send_contact_notification(name: str, email: str, message: str) -> None:
    """Fire two emails: one to owner, one confirmation to sender."""
    # 1. Notify portfolio owner
    owner_msg = MessageSchema(
        subject=f"New contact from {name} — Portfolio",
        recipients=[settings.MAIL_TO],
        body=_owner_email_html(name, email, message),
        subtype=MessageType.html,
    )
    await fast_mail.send_message(owner_msg)

    # 2. Confirm to sender
    confirm_msg = MessageSchema(
        subject="Got your message! — Arunkumar J",
        recipients=[email],
        body=_sender_confirm_html(name),
        subtype=MessageType.html,
    )
    await fast_mail.send_message(confirm_msg)
