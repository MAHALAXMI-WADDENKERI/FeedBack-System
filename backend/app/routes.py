
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

router = APIRouter(
    prefix="/feedback",
    tags=["Feedback"],
)

@router.post("/", response_model=schemas.Feedback)
def create_feedback(
    feedback: schemas.FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "manager":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only managers can create feedback"
        )

    db_feedback = models.Feedback(
        manager_id=current_user.id,
        employee_id=feedback.employee_id,
        strengths=feedback.strengths,
        areas_to_improve=feedback.areas_to_improve,
        message=feedback.message,
        sentiment=feedback.sentiment,
        sentiment_score=feedback.sentiment_score,
        tags=feedback.tags 
    )
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback

@router.get("/")
def root():
    return {"message": "Hello from routes!"}

@router.get("/me", response_model=List[FeedbackSchema])
async def read_own_feedback(
    current_user: models.User = Depends(get_current_user),
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

@router.post("/{feedback_id}/comments/", response_model=schemas.FeedbackComment, status_code=status.HTTP_201_CREATED)
async def add_comment_to_feedback(
    feedback_id: int,
    comment: schemas.FeedbackCommentBase, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    feedback_item = db.query(models.Feedback).filter(models.Feedback.id == feedback_id).first()
    if not feedback_item:
        raise HTTPException(status_code=404, detail="Feedback not found")

    if current_user.role == "employee" and feedback_item.employee_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Employees can only comment on feedback directed to them."
        )
    elif current_user.role == "manager" and feedback_item.manager_id != current_user.id:
        
         pass 


    comment_create = schemas.FeedbackCommentCreate(
        feedback_id=feedback_id,
        comment_text=comment.comment_text
    )
    db_comment = crud.create_feedback_comment(db, comment_create, current_user.id)
    return db_comment

@router.get("/{feedback_id}/comments/", response_model=List[schemas.FeedbackComment])
async def get_feedback_comments(
    feedback_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user) 
):
    feedback_item = db.query(models.Feedback).filter(models.Feedback.id == feedback_id).first()
    if not feedback_item:
        raise HTTPException(status_code=404, detail="Feedback not found")

    if current_user.role == "employee" and feedback_item.employee_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Employees can only view comments on their own feedback."
        )

    comments = crud.get_comments_for_feedback(db, feedback_id)
    return comments    
    
@router.get("/all", response_model=List[FeedbackSchema])
def get_all_feedback(
    current_user: models.User = Depends(require_role("manager")),
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


@router.get("/user/{user_id}", response_model=List[schemas.Feedback])
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


@router.get("/manager-given", response_model=List[schemas.Feedback])
async def get_manager_given_feedback(
    current_user: models.User = Depends(require_role("manager")),
    db: Session = Depends(get_db) 
):
    feedback_items = db.query(models.Feedback).filter(models.Feedback.manager_id == current_user.id).all()
    return feedback_items


@router.get("/employee/{employee_id}", response_model=List[schemas.Feedback])
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

@router.get("/detail/{feedback_id}", response_model=schemas.Feedback)
async def get_single_feedback_detail(
    feedback_id: int,
    current_user: models.User = Depends(get_current_user),
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


@router.post("/", response_model=FeedbackSchema, status_code=status.HTTP_201_CREATED)
def create_feedback_entry(
    feedback: FeedbackCreate,
    current_user: models.User = Depends(require_role("manager")),
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
def get_dashboard_data(current_user: models.User = Depends(get_current_user)):
    return {"message": f"Welcome, {current_user.username}!", "role": current_user.role}

