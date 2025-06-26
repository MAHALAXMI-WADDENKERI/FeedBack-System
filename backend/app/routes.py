
from fastapi import APIRouter, Depends, HTTPException, Form, status
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import Optional, List 
from app import database, models, schemas, crud
from app.database import get_db 
from fastapi.responses import Response 
from weasyprint import HTML
from jinja2 import Environment, FileSystemLoader
from app.models import User, Feedback
from app.schemas import LoginRequest, FeedbackCreate, Feedback as FeedbackSchema, TokenData
from app.utils import get_password_hash, verify_password, create_access_token, get_current_user, require_role
from pydantic import ValidationError
template_env = Environment(loader=FileSystemLoader("app/templates"))
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from io import BytesIO


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
@router.get("/detail/{feedback_id}/pdf", response_class=Response, responses={
    200: {"content": {"application/pdf": {}}},
    404: {"description": "Feedback not found"},
    403: {"description": "Not authorized to download this PDF"}
})
async def export_feedback_as_pdf(
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
            detail="Not authorized to download this PDF."
        )

    manager = crud.get_user(db, feedback_item.manager_id)

    employee = crud.get_user(db, feedback_item.employee_id)

    if not manager or not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Associated manager or employee not found."
        )

    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []

 
    story.append(Paragraph(f"Feedback Details (ID: {feedback_item.id})", styles['h1']))
    story.append(Spacer(1, 0.2 * inch))


    story.append(Paragraph(f"<b>For Employee:</b> {employee.username} (ID: {employee.id}, Email: {employee.email})", styles['Normal']))
    story.append(Paragraph(f"<b>From Manager:</b> {manager.username} (ID: {manager.id}, Email: {manager.email})", styles['Normal']))
    story.append(Spacer(1, 0.1 * inch))
    story.append(Paragraph(f"<b>Date Given:</b> {feedback_item.created_at.strftime('%Y-%m-%d %H:%M:%S') if feedback_item.created_at else 'N/A'}", styles['Normal']))
    story.append(Spacer(1, 0.2 * inch))
    story.append(HRFlowable(width="100%", thickness=1, lineCap='round', color='black'))
    story.append(Spacer(1, 0.2 * inch))

   
    story.append(Paragraph("<b>Feedback Message:</b>", styles['h3']))
    message_text = feedback_item.message if feedback_item.message else "(No feedback message provided)"
    story.append(Paragraph(message_text, styles['Normal']))
    story.append(Spacer(1, 0.2 * inch))

  
    if feedback_item.strengths:
        story.append(Paragraph("<b>Strengths:</b>", styles['h3']))
        story.append(Paragraph(feedback_item.strengths, styles['Normal']))
        story.append(Spacer(1, 0.2 * inch))

  
    if feedback_item.areas_to_improve:
        story.append(Paragraph("<b>Areas to Improve:</b>", styles['h3']))
        story.append(Paragraph(feedback_item.areas_to_improve, styles['Normal']))
        story.append(Spacer(1, 0.2 * inch))

    sentiment_display = feedback_item.sentiment.capitalize() if feedback_item.sentiment else 'N/A'
    sentiment_score_display = f" (Score: {feedback_item.sentiment_score:.2f})" if feedback_item.sentiment_score else ''
    story.append(Paragraph(f"<b>Sentiment:</b> {sentiment_display}{sentiment_score_display}", styles['Normal']))

    if feedback_item.tags:
        tags_display = ", ".join(feedback_item.tags)
        story.append(Paragraph(f"<b>Tags:</b> {tags_display}", styles['Normal']))

    doc.build(story)

    buffer.seek(0)
    return Response(content=buffer.getvalue(), media_type="application/pdf",
                    headers={"Content-Disposition": f"attachment; filename=feedback_{feedback_id}.pdf"})
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







