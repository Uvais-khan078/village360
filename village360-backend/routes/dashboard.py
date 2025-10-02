from fastapi import APIRouter, Depends
from db import get_db
from services import get_dashboard_stats
from sqlalchemy.orm import Session

router = APIRouter()

@router.get("/stats")
def api_get_dashboard_stats(db: Session = Depends(get_db)):
    return get_dashboard_stats(db)

