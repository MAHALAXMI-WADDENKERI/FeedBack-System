from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String)  # "manager" or "employee"

class Feedback(Base):
    __tablename__ = 'feedback'
    id = Column(Integer, primary_key=True, index=True)
    strengths = Column(Text)
    improvements = Column(Text)
    sentiment = Column(String(20))
    timestamp = Column(DateTime, default=datetime.utcnow)
    acknowledged = Column(Integer, default=0)
    manager_id = Column(Integer, ForeignKey('users.id'))
    employee_id = Column(Integer, ForeignKey('users.id'))
