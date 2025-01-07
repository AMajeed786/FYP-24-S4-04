from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class User(BaseModel):
    username: str
    email: str
    password: str
    contact: str
    created_at: Optional[datetime] = datetime.utcnow()
    
class UserProfile(BaseModel):
    username: str
    email: str
    contact: str
    
class EditUsername(BaseModel):
    username: str

# Request model by updating username
class UpdateUsernameRequest(BaseModel):
    username: str
    
class EditEmail(BaseModel):
    email: str   
    
# Define the request model
class UpdateEmailRequest(BaseModel):
    email: str 
    
# Request model for updating password
class UpdatePasswordRequest(BaseModel):
    password: str
    
# Request body model for updating contact
class UpdateContactRequest(BaseModel):
    contact: str

class ChatbotRequest(BaseModel):
    inputText: str
    lat: float = 37.7749  
    long: float = -122.4194 
    mode:str
    
# Model for chat history response
class ChatMessage(BaseModel):
    sender: str  # 'user' or 'bot'
    text: str    # The message content
    timestamp: str  # Timestamp in human-readable format

    

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
    
    

