from fastapi import APIRouter, Depends
from db import get_db
from services import get_all_users
from sqlalchemy.orm import Session

router = APIRouter()

@router.get("/users")
def api_get_all_users(db: Session = Depends(get_db)):
    return get_all_users(db)
