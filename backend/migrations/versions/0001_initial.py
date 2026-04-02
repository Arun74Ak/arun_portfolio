"""initial: create contact_messages table

Revision ID: 0001_initial
Revises:
Create Date: 2025-01-01
"""
from alembic import op
import sqlalchemy as sa


revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "contact_messages",
        sa.Column("id",          sa.Integer(),                      nullable=False,  autoincrement=True),
        sa.Column("name",        sa.String(120),                    nullable=False),
        sa.Column("email",       sa.String(255),                    nullable=False),
        sa.Column("message",     sa.Text(),                         nullable=False),
        sa.Column("status",      sa.Enum("pending","sent","failed", name="messagestatus"),
                                                                    nullable=False,  server_default="pending"),
        sa.Column("mail_error",  sa.Text(),                         nullable=True),
        sa.Column("is_read",     sa.Boolean(),                      nullable=False,  server_default="0"),
        sa.Column("ip_address",  sa.String(45),                     nullable=True),
        sa.Column("user_agent",  sa.String(512),                    nullable=True),
        sa.Column("created_at",  sa.DateTime(),                     nullable=False,  server_default=sa.text("NOW()")),
        sa.Column("updated_at",  sa.DateTime(),                     nullable=False,  server_default=sa.text("NOW() ON UPDATE NOW()")),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_contact_messages_email",      "contact_messages", ["email"])
    op.create_index("ix_contact_messages_created_at", "contact_messages", ["created_at"])
    op.create_index("ix_contact_messages_status",     "contact_messages", ["status"])


def downgrade() -> None:
    op.drop_index("ix_contact_messages_status",     table_name="contact_messages")
    op.drop_index("ix_contact_messages_created_at", table_name="contact_messages")
    op.drop_index("ix_contact_messages_email",      table_name="contact_messages")
    op.drop_table("contact_messages")
