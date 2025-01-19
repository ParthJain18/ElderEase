from pydantic import BaseModel

class User(BaseModel):
    uid: str
    email: str
    name: str
    role: str
    phone: str
