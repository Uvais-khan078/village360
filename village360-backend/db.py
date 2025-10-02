import os
from dotenv import load_dotenv
load_dotenv()
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError

DATABASE_URL = os.getenv("DATABASE_URL", "mysql://user:password@host/db")
engine = None
SessionLocal = None
mock_mode = False

try:
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    # Test connection
    with engine.connect():
        pass
except OperationalError:
    mock_mode = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def use_mock():
    return mock_mode

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000)
