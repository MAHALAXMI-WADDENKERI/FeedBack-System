
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm 
from sqlalchemy.orm import Session
from datetime import timedelta


from . import crud, models, schemas, auth
from .database import SessionLocal, engine

from app.routes import router as feedback_router 
from app.auth import auth_router 

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app.include_router(auth_router) 
app.include_router(feedback_router) 

@app.get("/")
def read_root():
    print("### DEBUG: Root endpoint '/' was HIT! ###")
    return {"message": "API is running"}

@app.get("/test-connection")
def test_connection():
    print("### DEBUG: /test-connection endpoint was HIT! ###")
    return {"status": "Backend connection successful!"}

