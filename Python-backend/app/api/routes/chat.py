from fastapi import APIRouter, Depends, UploadFile, File, Form
from app.utils.token import verify_user
from pydantic import BaseModel
from app.core.agent.base_agent import DecisionAgent
from app.core.tools import math_tool, medicine_tool, schedule_tools, tavily_tool
from dotenv import load_dotenv
from PIL import Image
import pytesseract
from io import BytesIO

load_dotenv()
class ChatRequest(BaseModel):
    input_text: str
    userId: str

class ChatResponse(BaseModel):
    message: str
    chat: str

router = APIRouter()

tools = [math_tool, tavily_tool]
tools.extend(schedule_tools)

agent = DecisionAgent(tools=tools)

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, uid: str = Depends(verify_user)):
    try:
        input_text = request.input_text
        print(f"User {uid} sent message: {input_text}")
        
        # Pass userId to the agent.run method
        response = agent.run(input_text, uid)
        return {
            "message": "Success",
            "chat": response
        }
    except Exception as e:
        print(f"Error: {str(e)}")
        return {"message": "Error occurred", "chat": str(e)}
    

@router.post("/upload_image")
async def upload_image(
    image: UploadFile = File(..., alias="image"),  # Changed from 'file' to 'image'
    caption: str = Form(...),
    uid: str = Depends(verify_user)
):
    contents = await image.read()
    img = Image.open(BytesIO(contents))
    img.save("uploaded_image.png")
    extracted_text = pytesseract.image_to_string(img)
    print(f"Extracted text: {extracted_text}")
    
    img.close()
    await image.close()
    
    try:
        input_text = caption + "\n Text extracted from user's uploaded image is: " + extracted_text
        response = agent.run(input_text, uid)
        return {
            "message": "Success",
            "chat": response
        }
    except Exception as e:
        print(f"Error: {str(e)}")
        return {"message": "Error occurred", "chat": str(e)}