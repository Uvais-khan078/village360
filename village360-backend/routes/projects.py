from fastapi import APIRouter, Depends, HTTPException
from db import get_db
from services import get_projects, get_project, create_project, update_project, delete_project
from sqlalchemy.orm import Session

router = APIRouter()

@router.get("")
def api_get_projects(db: Session = Depends(get_db)):
    return get_projects(db)

@router.get("/{id}")
def api_get_project(id: str, db: Session = Depends(get_db)):
    project = get_project(db, id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.post("")
def api_create_project(data: dict, db: Session = Depends(get_db)):
    return create_project(db, data)

