from fastapi import APIRouter
from pydantic import BaseModel
from app.services.db import users_collection

class LocationRequest(BaseModel):
    userId: str
    latitude: float
    longitude: float

router = APIRouter()

@router.post("/location")
async def get_location(request: LocationRequest):
    print("Received location request")
    return {"message": "Location received"}
