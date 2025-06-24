from sqlalchemy.orm import Session
from . import models, schemas
from app.utils import get_password_hash

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.name == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        name=user.username, 
        email=user.email,
        hashed_password=hashed_password,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_feedback(db: Session, feedback: schemas.FeedbackCreate):
    new_feedback = models.Feedback(**feedback.dict())
    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)
    return new_feedback

def get_feedback_by_employee(db: Session, emp_id: int):
    return db.query(models.Feedback).filter(models.Feedback.employee_id == emp_id).all()

def get_employees(db: Session):
    return db.query(models.User).filter(models.User.role == "employee").all()
