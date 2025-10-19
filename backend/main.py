from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routers import auth, transactions

# Ensure tables exist (alembic recommended)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Personal Finance (Local PostgreSQL)")

origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(transactions.router, prefix="/transactions", tags=["transactions"])

@app.get("/")
def root():
    return {"message": "Personal Finance API running"}
