
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import Optional, List
from app import crud 
from app.database import get_db
from app import schemas, models
from app.utils import verify_password, create_access_token, get_current_user, require_role
from fastapi.security import OAuth2PasswordRequestForm

auth_router = APIRouter(
    tags=["Authentication"],
)

@auth_router.post("/register", response_model=schemas.User, status_code=status.HTTP_201_CREATED)
async def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already registered")

    if user.email:
        db_user_by_email = db.query(models.User).filter(models.User.email == user.email).first()
        if db_user_by_email:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    new_user = crud.create_user(db=db, user=user)
    return new_user

@auth_router.post("/login", response_model=schemas.Token)
async def login_for_access_token(
    user_credentials: schemas.LoginRequest, 
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.username == user_credentials.username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    ACCESS_TOKEN_EXPIRE_MINUTES = 30 
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "id": user.id, "role": user.role}, 
        expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": schemas.User.model_validate(user) 
    }

@auth_router.get("/verify-token", response_model=schemas.User)
def verify_token(current_user: models.User = Depends(get_current_user)):
    return schemas.User.model_validate(current_user)