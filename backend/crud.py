from sqlalchemy.orm import Session
import models, schemas
from passlib.context import CryptContext
from datetime import datetime

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed = pwd_context.hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def create_transaction(db: Session, owner_id: int, tx: schemas.TransactionCreate):
    data = tx.dict()
    if data.get("date") is None:
        data["date"] = datetime.utcnow()
    db_tx = models.Transaction(**data, owner_id=owner_id)
    db.add(db_tx)
    db.commit()
    db.refresh(db_tx)
    return db_tx

def get_transactions(db: Session, owner_id: int, category: str = None, start_date = None, end_date = None):
    q = db.query(models.Transaction).filter(models.Transaction.owner_id == owner_id)
    if category:
        q = q.filter(models.Transaction.category == category)
    if start_date:
        q = q.filter(models.Transaction.date >= start_date)
    if end_date:
        q = q.filter(models.Transaction.date <= end_date)
    return q.order_by(models.Transaction.date.desc()).all()

def delete_transaction(db: Session, tx_id: int, owner_id: int):
    tx = db.query(models.Transaction).filter(models.Transaction.id==tx_id, models.Transaction.owner_id==owner_id).first()
    if tx:
        db.delete(tx)
        db.commit()
        return True
    return False
