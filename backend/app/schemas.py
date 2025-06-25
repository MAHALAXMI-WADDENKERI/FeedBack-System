
from pydantic import BaseModel, EmailStr, Field 
from typing import Optional, List
from datetime import datetime


class LoginRequest(BaseModel):
    username: str
    password: str

class UserBase(BaseModel):
    username: str 
    email: Optional[EmailStr] = None 

class UserCreate(UserBase):
    password: str
    role: str 

class User(UserBase):
    id: int
    role: str 
    is_active: bool = True 
    class Config:
        from_attributes = True 
class UserDisplay(User): 
    pass 

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None
    id: Optional[int] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User 



class FeedbackCommentBase(BaseModel):
    comment_text: str = Field(..., min_length=1) 
class FeedbackCommentCreate(FeedbackCommentBase):
    feedback_id: int 

class FeedbackComment(FeedbackCommentBase):
    id: int
    feedback_id: int
    commenter_id: int 
    created_at: datetime

    class Config:
        from_attributes = True



class FeedbackBase(BaseModel):
    employee_id: int
    strengths: Optional[str] = None
    areas_to_improve: Optional[str] = None
    message: str 
    sentiment: Optional[str] = None
    sentiment_score: Optional[float] = None
    tags: Optional[List[str]] = []


class FeedbackCreate(FeedbackBase):
    pass

class Feedback(FeedbackBase): 
    id: int
    manager_id: int 
    created_at: datetime
    comments: List[FeedbackComment] = [] 

    class Config:
        from_attributes = True