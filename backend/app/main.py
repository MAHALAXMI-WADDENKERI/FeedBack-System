from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router  # or your actual router file

app = FastAPI()

# ✅ ADD THIS BLOCK
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

# ✅ Add a simple test route to verify server is reachable
@app.get("/")
def read_root():
    return {"message": "API is running"}
