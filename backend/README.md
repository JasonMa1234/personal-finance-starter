# Backend — Personal Finance (Local PostgreSQL)

## Prerequisites
- Python 3.10+
- PostgreSQL (running locally)
- Node/npm only needed for frontend

## Setup (local, no Docker)

1. Create and activate virtual environment
```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

2. Create PostgreSQL database and user (example):
```sql
-- run in psql or pgAdmin
CREATE DATABASE finance_db;
CREATE USER finance_user WITH PASSWORD 'finance_pass';
GRANT ALL PRIVILEGES ON DATABASE finance_db TO finance_user;
```

3. Create `.env` file in `backend/` (see `.env.example`):
```
DATABASE_URL=postgresql://finance_user:finance_pass@localhost:5432/finance_db
SECRET_KEY=replace_with_secure_key
```

4. Run Alembic migrations to create tables:
```bash
alembic upgrade head
```

5. Start the backend:
```bash
uvicorn main:app --reload --port 8000
```

Backend API docs: http://localhost:8000/docs
