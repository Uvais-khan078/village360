from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from db import get_db
from services import get_user_by_username, get_user_by_email, create_user
from models import User
from sqlalchemy.orm import Session
import bcrypt

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    role: str = "public_viewer"
    district: str = ""
    block: str = ""

class LoginRequest(BaseModel):
    username: str
    password: str


from fastapi import Header
router = APIRouter()


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = get_user_by_username(db, data.username)
    if not user or not bcrypt.checkpw(data.password.encode(), user.password.encode()):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    # TODO: Implement JWT token creation
    token = "mock-token"  # Replace with real JWT
    return {"access_token": token, "user": user}

@router.get("/me")
def get_me(authorization: str = Header(None), db: Session = Depends(get_db)):
    # TODO: Replace with real JWT user extraction
    # For now, mock: if token is present, return first user
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing token")
    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    if get_user_by_username(db, data.username):
        raise HTTPException(status_code=400, detail="Username already exists")
    if get_user_by_email(db, data.email):
        raise HTTPException(status_code=400, detail="Email already exists")
    hashed_password = bcrypt.hashpw(data.password.encode(), bcrypt.gensalt()).decode()
    user = create_user(db, {
        "username": data.username,
        "email": data.email,
        "password": hashed_password,
        "role": data.role,
        "district": data.district,
        "block": data.block,
    })
    # TODO: Implement JWT token creation
    token = "mock-token"  # Replace with real JWT
    return {"access_token": token, "user": user}

