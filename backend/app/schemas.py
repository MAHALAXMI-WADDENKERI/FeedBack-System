from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class FeedbackCreate(BaseModel):
    strengths: str
    improvements: str
    sentiment: str
    manager_id: int
    employee_id: int

class FeedbackOut(FeedbackCreate):
    id: int
    timestamp: datetime
    acknowledged: int

    class Config:
        orm_mode = True

class LoginRequest(BaseModel):
    username: str
    password: str        
