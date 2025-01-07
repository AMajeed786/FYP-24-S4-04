from firebase_admin import firestore, auth
from User import User,Authorised,Preference
from fastapi import HTTPException
import uuid
from datetime import datetime, timedelta, timezone
from typing import List, Dict  # Add this import at the top of your file



class UserService:
    def __init__(self):
        self.db = firestore.client()
        self.sessions = {}


    def add_preference(self, perfernce: Preference):
       
        perfernce_dict = perfernce.dict()
        perfernce_ref = self.db.collection("perference").add(perfernce_dict)
        return {"message": "Preference added successfully", "pref_id": perfernce_ref[1].id}

    def authenticate_user(self, data: Authorised):
        try:
            # Step 1: Verify the ID token using Firebase Admin SDK
            decoded_token = auth.verify_id_token(data.idToken)
            user_id = decoded_token.get("uid")

            # Step 2: Create a session ID
            session_id = self.create_session(user_id)

            return {"message": "Authentication successful", "user_id": user_id, "session_id": session_id}
        except Exception as e:
            raise HTTPException(status_code=401, detail="Invalid ID token")

    def create_session(self, user_id: str):
        # Get a reference to Firestore
        db = firestore.client()

        # Generate a session ID
        session_id = str(uuid.uuid4())

        # Store session data in Firestore
        session_ref = db.collection('sessions').document(session_id)
        session_ref.set({
            'user_id': user_id,
            'created_at': firestore.SERVER_TIMESTAMP,  # Automatically set timestamp
        })

        # Optionally store session in memory for debugging
        self.sessions[session_id] = {"user_id": user_id}

        return session_id

    def validate_session(self, session_id: str) -> str:
        try:
            # Get a reference to Firestore
            db = firestore.client()

            # Retrieve session data
            session_ref = db.collection("sessions").document(session_id).get()
            if not session_ref.exists:
                raise HTTPException(status_code=401, detail="Session not found")

            session_data = session_ref.to_dict()
            user_id = session_data.get("user_id")
            if not user_id:
                raise HTTPException(status_code=401, detail="Invalid session")

            return user_id
        except Exception as e:
            print(f"Error validating session: {e}")
            raise HTTPException(status_code=500, detail="Error validating session")
        
        
    def get_chat_history(self, user_id: str) -> List[Dict]:

        db = firestore.client()
        try:
            # Reference the user's chat collection in Firestore
            chats_ref = db.collection("users").document(user_id).collection("chats")
            chats = chats_ref.order_by("timestamp", direction=firestore.Query.DESCENDING).stream()

            chat_history = []
            for chat in chats:
                chat_data = chat.to_dict()
                
                # Transform Firestore data to match ChatMessage model
                chat_history.append({
                    "sender": "user",  # Assuming "inputText" is always from the user
                    "text": chat_data.get("inputText", ""),  # User's message
                    "timestamp": chat_data.get("timestamp").strftime('%Y-%m-%d %H:%M:%S') if chat_data.get("timestamp") else "",
                })

                # Add bot's response if available
                if chat_data.get("response"):
                    chat_history.append({
                        "sender": "bot",  # Assuming "response" is always from the bot
                        "text": chat_data["response"],  # Bot's reply
                        "timestamp": chat_data.get("timestamp").strftime('%Y-%m-%d %H:%M:%S') if chat_data.get("timestamp") else "",
                    })
            return chat_history
        
            

        except Exception as e:
            print(f"Error fetching chat history: {e}")
            raise HTTPException(status_code=500, detail="Failed to fetch chat history")
        
        

