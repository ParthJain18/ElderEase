from fastapi import APIRouter, HTTPException
from app.utils.firebase import verify_firebase_token
from app.services.db import users_collection
from app.utils.token import create_access_token
from pydantic import BaseModel

class TokenRequest(BaseModel):
    id_token: str

router = APIRouter()

@router.post("/login")
async def login(request: TokenRequest):
    try:
        decoded_token = verify_firebase_token(request.id_token)
        print("Decoded token is : " + str(decoded_token))
        uid = decoded_token["uid"]
        email = decoded_token["email"]
        name = decoded_token.get("name", "User")

        user = {"uid": uid, "email": email, "name": name, "role": "elder"}
        if not users_collection.find_one({"uid": uid}):
            users_collection.insert_one(user)

        access_token = create_access_token(data={"sub": uid})
        return {"access_token": access_token, "token_type": "bearer"}
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    
