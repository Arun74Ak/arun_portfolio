# Arunkumar J — Portfolio (Full Stack)

A production-ready developer portfolio with a **React** frontend and a **FastAPI + MySQL** backend.

---

## Project Structure

```
arunkumar-portfolio/
├── portfolio/          ← React frontend
│   ├── public/
│   ├── src/
│   │   ├── App.jsx     ← All UI components
│   │   ├── App.css     ← Styles
│   │   ├── api.js      ← API call helpers
│   │   └── index.js
│   ├── .env.example
│   └── package.json
│
└── backend/            ← FastAPI backend
    ├── app/
    │   ├── config.py       ← Settings (reads .env)
    │   ├── database.py     ← SQLAlchemy engine + session
    │   ├── models.py       ← ORM models
    │   ├── schemas.py      ← Pydantic request/response schemas
    │   ├── mail.py         ← Email logic (HTML templates + FastAPI-Mail)
    │   └── routes/
    │       └── contact.py  ← /api/v1/contact endpoints
    ├── migrations/         ← Alembic migrations
    │   └── versions/
    │       └── 0001_initial.py
    ├── main.py             ← FastAPI app entry point
    ├── requirements.txt
    ├── alembic.ini
    └── .env.example
```

---

## Prerequisites

| Tool | Version |
|------|---------|
| Python | 3.11+ |
| Node.js | 18+ |
| MySQL | 8.0+ |

---

## Backend Setup

### 1. Create MySQL database

```sql
CREATE DATABASE portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configure environment

```bash
cd backend
cp .env.example .env
# Edit .env with your DB credentials and Gmail App Password
```

**Getting a Gmail App Password:**
1. Go to your Google Account → Security → 2-Step Verification (must be ON)
2. Search "App Passwords" → Create one for "Mail"
3. Paste the 16-character code into `MAIL_PASSWORD` in `.env`

### 3. Install dependencies

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 4. Run database migrations

```bash
# Option A: Let the app auto-create tables on first startup (default)
# Tables are created automatically via SQLAlchemy on startup.

# Option B: Use Alembic for version-controlled migrations
alembic upgrade head
```

### 5. Start the server

```bash
uvicorn main:app --reload --port 8000
```

API docs available at: http://localhost:8000/docs

---

## Frontend Setup

### 1. Configure environment

```bash
cd portfolio
cp .env.example .env
# REACT_APP_API_URL is already set to http://localhost:8000/api/v1 for dev
```

### 2. Install and run

```bash
npm install
npm start
```

Frontend runs at: http://localhost:3000

---

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| `GET`  | `/health` | DB health check |
| `POST` | `/api/v1/contact` | Submit contact form |
| `GET`  | `/api/v1/contact/messages` | List all submissions |
| `PATCH`| `/api/v1/contact/messages/{id}/read` | Mark as read |

### POST /api/v1/contact — Request body

```json
{
  "name":    "Jane Doe",
  "email":   "jane@example.com",
  "message": "Hi, I'd love to collaborate on a project!"
}
```

### POST /api/v1/contact — Response

```json
{
  "success": true,
  "message": "Message sent successfully! I'll get back to you soon.",
  "id": 1
}
```

---

## Email Flow

When a contact form is submitted:

```
User submits form
       │
       ▼
  FastAPI saves to MySQL (status = "pending")
       │
       ▼
  Sends 2 emails via Gmail SMTP:
  ┌────────────────────────────────┐
  │  1. Owner notification email   │  → itsarun1404@gmail.com
  │     (name, email, message)     │
  └────────────────────────────────┘
  ┌────────────────────────────────┐
  │  2. Sender confirmation email  │  → user's email
  │     (thank you + LinkedIn CTA) │
  └────────────────────────────────┘
       │
       ▼
  Updates status in MySQL: "sent" or "failed"
  (form still shows success if DB save worked)
```

---

## Production Deployment Tips

### Backend (e.g. Railway / Render / EC2)
- Set all `.env` variables in the hosting platform's environment settings
- Change `FRONTEND_ORIGIN` to your actual frontend domain
- Use `uvicorn main:app --host 0.0.0.0 --port 8000 --workers 2`

### Frontend (e.g. Netlify / Vercel)
- Set `REACT_APP_API_URL` to your backend's public URL
- Run `npm run build` → deploy the `build/` folder

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, CSS3, Google Fonts |
| Backend | FastAPI, Python 3.11 |
| Database | MySQL 8 via SQLAlchemy ORM |
| Migrations | Alembic |
| Email | FastAPI-Mail (Gmail SMTP) |
| Validation | Pydantic v2 |
