from fastapi import APIRouter, Depends, HTTPException,Form,status
from sqlalchemy.orm import Session
from . import database, models,schemas, crud
from app.database import get_db
from app.models import User
from app.schemas import LoginRequest
from app.utils import get_password_hash,verify_password, create_access_token,get_current_user, require_role



router = APIRouter()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
@router.get("/")
def root():
    return {"message": "Hello from routes!"}

@router.get("/feedback/me")
def read_own_feedback(current_user: User = Depends(get_current_user)):
    return {"user": current_user.name, "role": current_user.role}

@router.get("/verify-token")
def verify_token(current_user: User = Depends(get_current_user)):
    return {"status": "Token is valid", "user": {"username": current_user.name, "role": current_user.role}}


@router.get("/feedback/manager-only")
def manager_data(user=Depends(require_role("manager"))):
    return {"msg": f"Welcome Manager {user['username']}"}

@router.get("/feedback/user/{user_id}")
def get_user_feedback(user_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    # Use current_user["role"] or ["sub"] to verify
    return crud.get_feedback_by_employee(db, user_id)


@router.post("/feedback")
def create_feedback(feedback: schemas.FeedbackCreate, db: Session = Depends(get_db)):
    return crud.create_feedback(db, feedback)

@router.get("/feedback/user/{employee_id}")
def list_feedback(employee_id: int, db: Session = Depends(get_db)):
    return crud.get_feedback_by_employee(db, employee_id)


@router.post("/create-user")
def create_user(name: str, role: str, password: str, db: Session = Depends(get_db)):
    hashed_pw = get_password_hash(password)
    user = User(name=name, role=role, hashed_password=hashed_pw)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.get("/dashboard")
def get_dashboard_data(current_user: User = Depends(get_current_user)):
    return {"message": f"Welcome, {current_user.name}!"}


@router.post("/login")
def login(form_data: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.name == form_data.username).first()
    print("Login request received:", form_data.username)
    print("User from DB:", user)
    print("Password match:", verify_password(form_data.password, user.hashed_password))

    if not user:
        print("No user found") 
        raise HTTPException(status_code=401, detail="Invalid username or password")

    if not verify_password(form_data.password, user.hashed_password):  # Make sure it's user.password or hashed_password
        print("Password mismatch")
        raise HTTPException(status_code=401, detail="Invalid username or password")

    access_token = create_access_token(data={"sub": user.name, "role": user.role})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.name,
            "role": user.role
        }
    }



