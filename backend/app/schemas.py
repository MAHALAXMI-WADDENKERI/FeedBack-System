
from pydantic import BaseModel
from typing import Optional, List

class LoginRequest(BaseModel):
    username: str
    password: str

class UserBase(BaseModel):
    name: str
    role: str
class UserCreate(BaseModel):
    username: str 
    email: Optional[str] = None
    password: str
    role: str 

class UserDisplay(UserBase):
    id: int
    class Config:
        from_attributes = True 

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None
    id: Optional[int] = None

class FeedbackBase(BaseModel):
    employee_id: int
    manager_id: Optional[int] = None
    strengths: Optional[str] = None
    areas_to_improve: Optional[str] = None
    message: Optional[str] = None
    sentiment: Optional[str] = None
    sentiment_score: Optional[float] = None

class FeedbackCreate(FeedbackBase):
    pass

class Feedback(FeedbackBase):
    id: int
    class Config:
        from_attributes = True