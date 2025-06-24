from sqlalchemy import Column,Float, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String, default="employee", nullable=False)  # "manager" or "employee"

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("users.id"))
    manager_id = Column(Integer, ForeignKey("users.id"), nullable=True) # Manager who gave feedback
    strengths = Column(String, nullable=True)
    areas_to_improve = Column(String, nullable=True)
    message = Column(String, nullable=False) # Ensure this field exists and is not nullable if required
    sentiment = Column(String, nullable=True)
    sentiment_score = Column(Float, nullable=True)

    employee = relationship("User", foreign_keys=[employee_id])
    manager = relationship("User", foreign_keys=[manager_id])
