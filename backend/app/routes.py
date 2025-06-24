
from fastapi import APIRouter, Depends, HTTPException, Form, status
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import Optional, List 
from app import database, models, schemas, crud
from app.database import get_db 
from app.models import User, Feedback
from app.schemas import LoginRequest, FeedbackCreate, Feedback as FeedbackSchema, TokenData
from app.utils import get_password_hash, verify_password, create_access_token, get_current_user, require_role
from pydantic import ValidationError

router = APIRouter()

@router.get("/")
def root():
    return {"message": "Hello from routes!"}

@router.get("/feedback/me", response_model=List[FeedbackSchema])
async def read_own_feedback(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db) 
):
    if current_user.role == "employee":
        feedback_items = db.query(models.Feedback).filter(models.Feedback.employee_id == current_user.id).all()
        return feedback_items
    else: 
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This endpoint is for employees to view their received feedback."
        )

@router.get("/verify-token")
def verify_token(current_user: User = Depends(get_current_user)):
    return {"status": "Token is valid", "user": {"username": current_user.name, "role": current_user.role}}

@router.get("/feedback/all", response_model=List[FeedbackSchema])
def get_all_feedback(
    current_user: User = Depends(require_role("manager")),
    db: Session = Depends(get_db)
):
    all_feedback = db.query(models.Feedback).all()
    return all_feedback

@router.get("/users/employees", response_model=List[schemas.UserDisplay])
async def get_employees(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("manager"))
):
    
    try:
        employees = crud.get_employees(db)
        print(f"--- DEBUG: Fetched {len(employees)} employees for response_model validation ---")
        validated_employees = []
        for emp in employees:
            try:
                validated_employee = schemas.UserDisplay.model_validate(emp, from_attributes=True)
                validated_employees.append(validated_employee)
            except ValidationError as e:
                print(f"--- DEBUG: Pydantic Validation Failed for Employee ID {emp.id if hasattr(emp, 'id') else 'N/A'}: {e.errors()} ---")
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail={"message": "Failed to validate employee data for response.", "errors": e.errors()}
                )
        return validated_employees
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        print(f"--- DEBUG: Unexpected error in get_employees: {e} ---")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {e}"
        )

@router.get("/users/{user_id}", response_model=schemas.UserDisplay)
async def get_user_by_id(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user) 
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/feedback/user/{user_id}", response_model=List[schemas.Feedback])
async def get_feedback_for_user(
    user_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db) 
):
    
    if current_user.role == "employee" and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="As an employee, you are not authorized to view other users' feedback lists."
        )

    feedback_items = db.query(models.Feedback).filter(models.Feedback.employee_id == user_id).all()
    return feedback_items


@router.get("/feedback/manager-given", response_model=List[schemas.Feedback])
async def get_manager_given_feedback(
    current_user: models.User = Depends(require_role("manager")),
    db: Session = Depends(get_db) 
):
    feedback_items = db.query(models.Feedback).filter(models.Feedback.manager_id == current_user.id).all()
    return feedback_items


@router.get("/feedback/employee/{employee_id}", response_model=List[schemas.Feedback])
async def get_all_feedback_for_specific_employee(
    employee_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    if current_user.role == "employee" and current_user.id != employee_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="As an employee, you are not authorized to view other employees' feedback lists."
        )

    feedback_items = db.query(models.Feedback).filter(models.Feedback.employee_id == employee_id).all()
    return feedback_items
@router.post("/register", response_model=schemas.UserDisplay, status_code=status.HTTP_201_CREATED)
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

@router.get("/feedback/detail/{feedback_id}", response_model=schemas.Feedback)
async def get_single_feedback_detail(
    feedback_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    feedback_item = db.query(models.Feedback).filter(models.Feedback.id == feedback_id).first()

    if not feedback_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Feedback not found."
        )

    if current_user.role == "employee" and feedback_item.employee_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this specific feedback detail."
        )
    
    return feedback_item


@router.post("/feedback/", response_model=FeedbackSchema, status_code=status.HTTP_201_CREATED)
def create_feedback_entry(
    feedback: FeedbackCreate,
    current_user: User = Depends(require_role("manager")),
    db: Session = Depends(get_db) 
):
    db_feedback = models.Feedback(
        employee_id=feedback.employee_id,
        manager_id=current_user.id,
        strengths=feedback.strengths,
        areas_to_improve=feedback.areas_to_improve,
        message=feedback.message,
        sentiment=feedback.sentiment,
        sentiment_score=feedback.sentiment_score
    )
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback

@router.get("/dashboard")
def get_dashboard_data(current_user: User = Depends(get_current_user)):
    return {"message": f"Welcome, {current_user.name}!", "role": current_user.role}

@router.post("/login")
def login(form_data: LoginRequest, db: Session = Depends(get_db)): 
   
    try:
        user = db.query(models.User).filter(models.User.name == form_data.username).first()
        if not user:
            raise HTTPException(status_code=401, detail="Invalid username or password")

        if not verify_password(form_data.password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid username or password")

        access_token = create_access_token(data={"sub": user.name, "role": user.role, "id": user.id})
       
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "username": user.name,
                "role": user.role
            }
        }

    except Exception as e:
        print(f"Backend: An unexpected error occurred in /login: {e}")
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An internal server error occurred during login.")