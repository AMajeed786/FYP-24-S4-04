from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class User(BaseModel):
    username: str
    email: str
    password: str
    contact: str
    created_at: Optional[datetime] = datetime.utcnow()


class ChatbotRequest(BaseModel):
    inputText: str
    lat: float = 37.7749  
    long: float = -122.4194 
    mode:str
    

# Model to handle incoming ID token
class Authorised(BaseModel):
    idToken: str  # Expecting the ID token in the request


class Preference(BaseModel):
    userId: str
    preferredActivity: str
    travelStyle: str
    cuisine: str
    attractions: str
    travelWith: str
    tripPriority: str
    created_at: Optional[datetime] = datetime.utcnow()