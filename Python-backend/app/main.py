from fastapi import FastAPI
from app.api.routes import schedule_router, auth_router, chat_router, location_router

app = FastAPI(title="Elderly Care Backend", version="1.0")

# Include routers
app.include_router(schedule_router, prefix="/schedule", tags=["Schedules"])
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(chat_router, prefix="/chat", tags=["Chat"])
app.include_router(location_router, prefix="/location", tags=["Location"])

@app.get("/")
def root():
    return {"message": "Welcome to Elder Ease Server"}
