
# Personal Finance Web App — Local Setup (No Docker) — PostgreSQL

This is a full-stack **Personal Finance Web App** to track and visualize monthly expenses.

- **Frontend:** React + Vite + Material UI + Recharts  
- **Backend:** FastAPI + SQLAlchemy + Alembic + JWT auth  
- **Database:** PostgreSQL  
- **Exports:** CSV and PDF  

---

## Prerequisites

1. **Python 3.10+**  
2. **Node.js 18+ and npm/yarn**  
3. **PostgreSQL** (running locally)  
4. Optional: VSCode or any IDE

---

## Backend Setup

1. **Clone the repo and go to backend:**
```bash
cd backend
```

2. **Create and activate virtual environment:**
```bash
python -m venv .venv
# Mac/Linux
source .venv/bin/activate
# Windows
.venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Create PostgreSQL database and user:**
```sql
-- Run in psql or pgAdmin
CREATE DATABASE finance_db;
CREATE USER finance_user WITH PASSWORD 'finance_pass';
GRANT ALL PRIVILEGES ON DATABASE finance_db TO finance_user;
```

5. **Create `.env` file in backend folder:**
```env
DATABASE_URL=postgresql://finance_user:finance_pass@localhost:5432/finance_db
SECRET_KEY=replace_with_secure_key
```

6. **Run Alembic migrations to create tables:**
```bash
alembic upgrade head
```

7. **Start the backend server:**
```bash
uvicorn main:app --reload --port 8000
```

- API docs available at: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## Frontend Setup

1. Open a new terminal and go to frontend:
```bash
cd frontend
```

2. Install frontend dependencies:
```bash
npm install
# or
yarn
```

3. Create `.env` file (optional, default API URL is `http://localhost:8000`):
```env
VITE_API_URL=http://localhost:8000
```

4. Run frontend server:
```bash
npm run dev
# or
yarn dev
```

- App will be available at: [http://localhost:5173](http://localhost:5173)

---

## Features

- User registration and login with JWT authentication  
- Add, edit, delete transactions  
- Filter transactions by category and date  
- Visualize spending over time (AreaChart)  
- Pie chart of category-wise expenses  
- Export transactions to CSV and PDF  

---

## Running Tests (Backend)

```bash
cd backend
pytest
```

---

## Notes

- Backend default port: **8000**  
- Frontend default port: **5173**  
- Make sure PostgreSQL is running locally  
- Replace `SECRET_KEY` with a secure random string for production
