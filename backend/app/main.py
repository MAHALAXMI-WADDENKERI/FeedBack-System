from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router  

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

app.include_router(router)

@app.get("/")
def read_root():
    print("### DEBUG: Root endpoint '/' was HIT! ###") 
    return {"message": "API is running"}

@app.get("/test-connection")
def test_connection():
    print("### DEBUG: /test-connection endpoint was HIT! ###")
    return {"status": "Backend connection successful!"}