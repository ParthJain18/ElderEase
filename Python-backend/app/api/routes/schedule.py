from fastapi import APIRouter, HTTPException, Depends
from app.utils.firebase import verify_firebase_token
from app.utils.token import verify_user
from app.models.user import User
from app.services.db import users_collection
from app.utils.token import create_access_token

router = APIRouter()

@router.get("/schedule")
async def get_schedule(uid: str = Depends(verify_user)):
    # Retrieve schedule from MongoDB based on UID
    user_schedule = users_collection.find_one({"uid": uid}, {"schedule": 1, "_id": 0})
    return user_schedule or {"message": "No schedule found"}
