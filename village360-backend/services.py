from sqlalchemy.orm import Session
from models import User, Village, Project, Report, Amenity, RoleEnum, StatusEnum, ReportTypeEnum
from datetime import datetime
import uuid

# User CRUD

def get_user(db: Session, user_id: str):
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user_data: dict):
    user = User(
        id=str(uuid.uuid4()),
        username=user_data["username"],
        email=user_data["email"],
        password=user_data["password"],
        role=user_data.get("role", RoleEnum.public_viewer),
        district=user_data.get("district", ""),
        block=user_data.get("block", ""),
        created_at=datetime.utcnow(),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_all_users(db: Session):
    return db.query(User).order_by(User.created_at).all()

def delete_user(db: Session, user_id: str):
    user = get_user(db, user_id)
    if user:
        db.delete(user)
        db.commit()
        return True
    return False

# Village CRUD

def get_villages(db: Session):
    return db.query(Village).order_by(Village.name).all()

def get_village(db: Session, village_id: str):
    return db.query(Village).filter(Village.id == village_id).first()

def get_village_with_amenities(db: Session, village_id: str):
    village = get_village(db, village_id)
    if not village:
        return None
    amenities = db.query(Amenity).filter(Amenity.village_id == village_id).all()
    return {**village.__dict__, "amenities": amenities}

def create_village(db: Session, village_data: dict):
    village = Village(
        id=str(uuid.uuid4()),
        name=village_data["name"],
        district=village_data["district"],
        block=village_data["block"],
        latitude=village_data["latitude"],
        longitude=village_data["longitude"],
        population=village_data.get("population", 0),
        created_at=datetime.utcnow(),
    )
    db.add(village)
    db.commit()
    db.refresh(village)
    return village

def update_village(db: Session, village_id: str, update_data: dict):
    village = get_village(db, village_id)
    if not village:
        return None
    for key, value in update_data.items():
        setattr(village, key, value)
    db.commit()
    db.refresh(village)
    return village

# Project CRUD

def get_projects(db: Session):
    return db.query(Project).order_by(Project.created_at.desc()).all()

def get_project(db: Session, project_id: str):
    return db.query(Project).filter(Project.id == project_id).first()

def get_projects_by_village(db: Session, village_id: str):
    return db.query(Project).filter(Project.village_id == village_id).order_by(Project.created_at.desc()).all()

def get_projects_by_user(db: Session, user_id: str):
    return db.query(Project).filter(Project.created_by == user_id).order_by(Project.created_at.desc()).all()

def create_project(db: Session, project_data: dict):
    project = Project(
        id=str(uuid.uuid4()),
        village_id=project_data["village_id"],
        title=project_data["title"],
        description=project_data["description"],
        status=project_data.get("status", StatusEnum.planning),
        start_date=project_data.get("start_date"),
        end_date=project_data.get("end_date"),
        budget=project_data.get("budget", 0),
        progress=project_data.get("progress", 0),
        created_by=project_data["created_by"],
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

def update_project(db: Session, project_id: str, update_data: dict):
    project = get_project(db, project_id)
    if not project:
        return None
    for key, value in update_data.items():
        setattr(project, key, value)
    project.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(project)
    return project

def delete_project(db: Session, project_id: str):
    project = get_project(db, project_id)
    if project:
        db.delete(project)
        db.commit()
        return True
    return False

# Report CRUD

def get_reports(db: Session):
    return db.query(Report).order_by(Report.created_at.desc()).all()

def get_reports_by_project(db: Session, project_id: str):
    return db.query(Report).filter(Report.project_id == project_id).order_by(Report.created_at.desc()).all()

def create_report(db: Session, report_data: dict):
    report = Report(
        id=str(uuid.uuid4()),
        project_id=report_data.get("project_id"),
        report_type=report_data.get("report_type", ReportTypeEnum.progress),
        title=report_data["title"],
        content=report_data.get("content", ""),
        file_url=report_data.get("file_url", ""),
        created_by=report_data["created_by"],
        created_at=datetime.utcnow(),
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report

# Amenity CRUD

def get_amenities_by_village(db: Session, village_id: str):
    return db.query(Amenity).filter(Amenity.village_id == village_id).all()

def update_amenity(db: Session, amenity_data: dict):
    amenity = db.query(Amenity).filter(
        Amenity.village_id == amenity_data["village_id"],
        Amenity.amenity_type == amenity_data["amenity_type"]
    ).first()
    if not amenity:
        amenity = Amenity(
            id=str(uuid.uuid4()),
            village_id=amenity_data["village_id"],
            amenity_type=amenity_data["amenity_type"],
            available=amenity_data.get("available", 0),
            required=amenity_data.get("required", 0),
            updated_at=datetime.utcnow(),
        )
        db.add(amenity)
    else:
        amenity.available = amenity_data.get("available", amenity.available)
        amenity.required = amenity_data.get("required", amenity.required)
        amenity.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(amenity)
    return amenity

# Dashboard stats

def get_dashboard_stats(db: Session):
    total_villages = db.query(Village).count()
    active_projects = db.query(Project).filter(Project.status == StatusEnum.ongoing).count()
    completed_projects = db.query(Project).filter(Project.status == StatusEnum.completed).count()
    delayed_projects = db.query(Project).filter(Project.status == StatusEnum.delayed).count()
    return {
        "totalVillages": total_villages,
        "activeProjects": active_projects,
        "completedProjects": completed_projects,
        "delayedProjects": delayed_projects,
    }
