# C:\Users\mwmah\Desktop\task\feedback-system\backend\app\models.py

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Float, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base
import json
from sqlalchemy.sql import func
from sqlalchemy.types import TypeDecorator, TEXT

class ListToString(TypeDecorator):
    impl = TEXT
    cache_ok = True

    def process_bind_param(self, value, dialect):
        if value is not None:
            return json.dumps(value)
        return value

    def process_result_value(self, value, dialect):
        if value is not None:
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                return [tag.strip() for tag in value.split(',') if tag.strip()]
        return []
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False) 
    email = Column(String(120), unique=True, index=True) 
    hashed_password = Column(String(255), nullable=False) 
    role = Column(String(50), default="employee", nullable=False) 
    is_active = Column(Boolean, default=True)

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("users.id"))
    manager_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    strengths = Column(String(500), nullable=True)
    areas_to_improve = Column(String(500), nullable=True) 
    message = Column(String(1000), nullable=False) 
    sentiment = Column(String(50), nullable=True) 
    sentiment_score = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    tags = Column(ListToString(255), nullable=True)

    employee = relationship("User", foreign_keys=[employee_id])
    manager = relationship("User", foreign_keys=[manager_id])
    comments = relationship("FeedbackComment", back_populates="feedback", cascade="all, delete-orphan")

class FeedbackComment(Base):
    __tablename__ = "feedback_comments"

    id = Column(Integer, primary_key=True, index=True)
    feedback_id = Column(Integer, ForeignKey("feedback.id"), nullable=False)
    commenter_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    comment_text = Column(String(1000), nullable=False) 
    created_at = Column(DateTime, default=datetime.utcnow)

    feedback = relationship("Feedback", back_populates="comments")
    commenter = relationship("User")