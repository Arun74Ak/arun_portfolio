from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.config import get_settings
from app.database import engine, Base
from app.models import ContactMessage          # noqa: F401 – ensures model is registered
from app.routes.contact import router as contact_router
from app.schemas import HealthResponse

settings = get_settings()


# ─── Lifespan (startup / shutdown) ────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create all tables on startup (safe: won't re-create existing ones)
    Base.metadata.create_all(bind=engine)
    print("✅  Database tables ready.")
    yield
    print("👋  Shutting down.")


# ─── App factory ──────────────────────────────────────────────────────────────
app = FastAPI(
    title       = "Arunkumar J — Portfolio API",
    description = "Backend for the portfolio contact form with MySQL persistence and email notifications.",
    version     = "1.0.0",
    lifespan    = lifespan,
    docs_url    = "/docs",
    redoc_url   = "/redoc",
)


# ─── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins     = [settings.FRONTEND_ORIGIN],   # e.g. http://localhost:3000
    allow_credentials = True,
    allow_methods     = ["*"],
    allow_headers     = ["*"],
)


# ─── Routes ───────────────────────────────────────────────────────────────────
app.include_router(contact_router, prefix="/api/v1")


# ─── Health check ─────────────────────────────────────────────────────────────
@app.get("/health", response_model=HealthResponse, tags=["Health"])
def health_check():
    """Quick liveness / readiness probe."""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as exc:
        db_status = f"error: {exc}"

    return HealthResponse(status="ok", database=db_status)


@app.get("/", tags=["Root"])
def root():
    return {
        "project" : "Arunkumar J Portfolio API",
        "docs"    : "/docs",
        "health"  : "/health",
    }
