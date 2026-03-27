from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router

from database import engine
from models import db_models
db_models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="SyncMail API")

# Allow React frontend to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")
 