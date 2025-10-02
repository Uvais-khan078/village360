from sqlalchemy import Column, String, Integer, Text, Enum, DateTime, ForeignKey, DECIMAL
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import enum

Base = declarative_base()

class RoleEnum(enum.Enum):
    admin = "admin"
    district_officer = "district_officer"
    block_officer = "block_officer"
    public_viewer = "public_viewer"

class StatusEnum(enum.Enum):
    planning = "planning"
    ongoing = "ongoing"
    completed = "completed"
    delayed = "delayed"
    cancelled = "cancelled"

class ReportTypeEnum(enum.Enum):
    progress = "progress"
    completion = "completion"
    gap_analysis = "gap_analysis"
    monthly = "monthly"

class User(Base):
    __tablename__ = "users"
    id = Column(String(36), primary_key=True)
    username = Column(String(255), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(Text, nullable=False)
    role = Column(Enum(RoleEnum), default=RoleEnum.public_viewer, nullable=False)
    district = Column(Text)
    block = Column(Text)
    created_at = Column(DateTime)

    projects = relationship("Project", back_populates="created_by_user")
    reports = relationship("Report", back_populates="created_by_user")

class Village(Base):
    __tablename__ = "villages"
    id = Column(String(36), primary_key=True)
    name = Column(Text, nullable=False)
    district = Column(Text, nullable=False)
    block = Column(Text, nullable=False)
    latitude = Column(DECIMAL(10, 8), nullable=False)
    longitude = Column(DECIMAL(11, 8), nullable=False)
    population = Column(Integer)
    created_at = Column(DateTime)

    projects = relationship("Project", back_populates="village")
    amenities = relationship("Amenity", back_populates="village")

class Project(Base):
    __tablename__ = "projects"
    id = Column(String(36), primary_key=True)
    village_id = Column(String(36), ForeignKey("villages.id"), nullable=False)
    title = Column(Text, nullable=False)
    description = Column(Text, nullable=False)
    status = Column(Enum(StatusEnum), default=StatusEnum.planning, nullable=False)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    budget = Column(DECIMAL(12, 2))
    progress = Column(Integer, default=0)
    created_by = Column(String(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

    village = relationship("Village", back_populates="projects")
    created_by_user = relationship("User", back_populates="projects")
    reports = relationship("Report", back_populates="project")

class Report(Base):
    __tablename__ = "reports"
    id = Column(String(36), primary_key=True)
    project_id = Column(String(36), ForeignKey("projects.id"))
    report_type = Column(Enum(ReportTypeEnum), nullable=False)
    title = Column(Text, nullable=False)
    content = Column(Text)
    file_url = Column(Text)
    created_by = Column(String(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime)

    project = relationship("Project", back_populates="reports")
    created_by_user = relationship("User", back_populates="reports")

class Amenity(Base):
    __tablename__ = "amenities"
    id = Column(String(36), primary_key=True)
    village_id = Column(String(36), ForeignKey("villages.id"), nullable=False)
    amenity_type = Column(Text, nullable=False)
    available = Column(Integer, default=0)
    required = Column(Integer, default=0)
    updated_at = Column(DateTime)

    village = relationship("Village", back_populates="amenities")

