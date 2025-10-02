from fastapi import APIRouter, Depends, HTTPException
from db import get_db
from services import get_villages, get_village_with_amenities, create_village, update_village, get_amenities_by_village, update_amenity
from sqlalchemy.orm import Session

router = APIRouter()

@router.get("")
def api_get_villages(db: Session = Depends(get_db)):
    return get_villages(db)

@router.get("/{id}")
def api_get_village(id: str, db: Session = Depends(get_db)):
    village = get_village_with_amenities(db, id)
    if not village:
        raise HTTPException(status_code=404, detail="Village not found")
    return village

@router.post("")
def api_create_village(data: dict, db: Session = Depends(get_db)):
    return create_village(db, data)

