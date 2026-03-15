from sqlalchemy import create_engine, Column, String, Integer, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import uuid

DATABASE_URL = "sqlite:///./sentinel.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id       = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email    = Column(String, unique=True, index=True)
    password = Column(String)

class Scan(Base):
    __tablename__ = "scans"
    id        = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id   = Column(String)
    scan_type = Column(String)
    result    = Column(String)
    input     = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()