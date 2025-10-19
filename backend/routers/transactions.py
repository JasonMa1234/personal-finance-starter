from fastapi import APIRouter, Depends, HTTPException, Header, Query
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db
import crud, schemas, auth_utils
from datetime import datetime

router = APIRouter()

def get_current_user_id(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    token = authorization.split("Bearer ")[-1]
    payload = auth_utils.decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return int(payload.get("sub"))

@router.post("/", response_model=schemas.Transaction)
def create_transaction(tx: schemas.TransactionCreate, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    return crud.create_transaction(db, owner_id=user_id, tx=tx)

@router.get("/", response_model=list[schemas.Transaction])
def list_transactions(category: Optional[str] = Query(None), start: Optional[str] = Query(None), end: Optional[str] = Query(None), db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    # parse dates if provided (ISO format)
    start_date = datetime.fromisoformat(start) if start else None
    end_date = datetime.fromisoformat(end) if end else None
    return crud.get_transactions(db, owner_id=user_id, category=category, start_date=start_date, end_date=end_date)

@router.delete("/{tx_id}")
def delete_transaction(tx_id: int, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    ok = crud.delete_transaction(db, tx_id=tx_id, owner_id=user_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return {"ok": True}
