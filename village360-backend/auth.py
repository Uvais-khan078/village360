import bcrypt
from jose import jwt
import os
from datetime import datetime, timedelta

SECRET_KEY = os.getenv("JWT_SECRET", "supersecret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Mock user for test mode

test_user = {
    "id": "test-id",
    "username": "testuser",
    "email": "test@123",
    "password": bcrypt.hashpw(b"test@123", bcrypt.gensalt()).decode(),
    "role": "admin"
}


def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())


def authenticate_user(username, password):
    # In mock mode, only allow test user
    if username == "testuser" and verify_password(password, test_user["password"]):
        return test_user
    # TODO: Add DB lookup for real users
    return None


def create_access_token(user):
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": user["id"], "exp": expire}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

