from sqlalchemy.orm import Session
from . import models, schemas

def create_feedback(db: Session, feedback: schemas.FeedbackCreate):
    new_feedback = models.Feedback(**feedback.dict())
    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)
    return new_feedback

def get_feedback_by_employee(db: Session, emp_id: int):
    return db.query(models.Feedback).filter(models.Feedback.employee_id == emp_id).all()
