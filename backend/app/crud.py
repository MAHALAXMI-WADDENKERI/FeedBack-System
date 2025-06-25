
from sqlalchemy.orm import Session
from . import models, schemas, auth
from app.utils import get_password_hash 
def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if not user:
        return None
    if not auth.verify_password(password, user.hashed_password):
        return None
    return user

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        username=user.username, 
        email=user.email,
        hashed_password=hashed_password,
        role=user.role,
        is_active=True 
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_feedback(db: Session, feedback: schemas.FeedbackCreate):
    new_feedback = models.Feedback(
        employee_id=feedback.employee_id,
        manager_id=feedback.manager_id,
        strengths=feedback.strengths,
        areas_to_improve=feedback.areas_to_improve,
        message=feedback.message,
        sentiment=feedback.sentiment,
        sentiment_score=feedback.sentiment_score,
        tags=feedback.tags
    )
    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)
    return new_feedback

def create_feedback_comment(db: Session, comment: schemas.FeedbackCommentCreate, commenter_id: int):
    db_comment = models.FeedbackComment(
        feedback_id=comment.feedback_id,
        commenter_id=commenter_id,
        comment_text=comment.comment_text
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

def get_comments_for_feedback(db: Session, feedback_id: int):
    return db.query(models.FeedbackComment).filter(models.FeedbackComment.feedback_id == feedback_id).all()

def get_feedback_by_employee(db: Session, emp_id: int):
    return db.query(models.Feedback).filter(models.Feedback.employee_id == emp_id).all()

def get_employees(db: Session):
    return db.query(models.User).filter(models.User.role == "employee").all()