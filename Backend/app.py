import firebase_admin
from firebase_admin import credentials, firestore, auth
from User import User,ChatbotRequest,Authorised,Preference, UserProfile, EditUsername, UpdateUsernameRequest, EditEmail, UpdateEmailRequest, UpdatePasswordRequest, UpdateContactRequest, ChatMessage
from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.responses import JSONResponse
from userService import UserService
import os
from tensorflow.keras.models import load_model
import google.generativeai as genai
import keras
import tensorflow as tf
from tensorflow.keras.preprocessing.text import Tokenizer
from keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.callbacks import EarlyStopping ,ModelCheckpoint,ReduceLROnPlateau,CSVLogger
import pandas as pd
import numpy as np
from typing import List
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from keras.models import Sequential
from keras.layers import Embedding,Flatten,Dense
from fastapi.middleware.cors import CORSMiddleware

#added new import
from pydantic import BaseModel
from typing import Optional




try:
    print("Initializing Firebase...")
    cred = credentials.Certificate("firebase_cred.json")
    firebase_app = firebase_admin.initialize_app(cred)
    print("Firebase initialized successfully!")
except Exception as e:
    print(f"Error initializing Firebase: {e}")
    

myapi ="fsq31Xao86Sk9UoGcO10uO3RnU/4/3KbBZEBsBE+g0T/zYk="
url = "https://api.foursquare.com/v3/places/search"
headers = {
    "Accept": "application/json",
    "Authorization": myapi
} 

genai.configure(api_key="AIzaSyCGe_KIgS-Mb3ZOXQzeLJusfCtJMCHjoao")
import requests
preferable_places = ["resturant", "cafe", "tourist destination", "shopping malls","theathers", "hotels", "spa", "emergency service", "outdoor(park)"]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
user_service = UserService()


@app.get("/")
def read_root():
    try:
        return {"message": "Welcome to the User API"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

# create user and validation whether email/username is validated
import firebase_admin
from firebase_admin import auth, firestore
from fastapi import HTTPException

# Initialize Firebase Admin SDK
if not firebase_admin._apps:
    firebase_admin.initialize_app()

# Get a reference to Firestore
db = firestore.client()


#registration of new user and store details in firebase
@app.post("/users/", status_code=201)
async def create_user(user: User):

    try:
        # Check if email is already registered in Firebase Authentication
        try:
            firebase_user = auth.get_user_by_email(user.email)
            if firebase_user:
                raise HTTPException(status_code=409, detail="This email is already registered!")
        except firebase_admin.exceptions.NotFoundError:
            pass  # Email is not registered, proceed to create user

        # Check if the username already exists in Firestore
        user_query = db.collection('users').where('username', '==', user.username).stream()
        if any(user_doc for user_doc in user_query):
            raise HTTPException(status_code=409, detail="This username is already taken!")

        # Create user in Firebase Authentication
        firebase_user = auth.create_user(
            email=user.email,
            password=user.password,
            display_name=user.username,
        )

        # Add the user to the Firestore 'users' collection
        user_ref = db.collection('users').document(firebase_user.uid)
        user_ref.set({
            'uid': firebase_user.uid,
            'email': user.email,
            'username': user.username,
            'contact': user.contact,  # Assuming 'contact' is part of the user model
            # Add any other fields you want to store in Firestore
        })

        return {"message": "User registered successfully!", "user_id": firebase_user.uid}

    except HTTPException as http_exc:
        # Reraise HTTP-specific exceptions
        raise http_exc
    except Exception as e:
        # Catch other errors
        raise HTTPException(status_code=500, detail=f"Error registering user: {str(e)}")

#login
@app.post("/authentication/")
async def authorised(data: Authorised):
    try:
        # Authenticate user and generate session ID
        res = user_service.authenticate_user(data)

        # Return user info and session ID
        return {"message": res["message"], "user_id": res["user_id"], "session_id": res["session_id"]}

    except Exception as e:
        raise HTTPException(status_code=401, detail=str("User information incorrect, please try again"))


@app.post("/preference/", status_code=201) 
async def add_preference(perfernce: Preference):
    try:
        created_perfernce = user_service.add_preference(perfernce)
        return created_perfernce  
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# system admin not implemented yet
@app.get("/users/", response_model=List[User])
async def list_users():
    try:
        users = user_service.get_users()
        return users
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



# system admin deactivate/delete account
# @app.delete("/users/{user_id}", status_code=204)  
async def remove_user(user_id: str):
    try:
        success = user_service.delete_user(user_id)
        if success:  
            return {"message": "User deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


#fetch user profile information for user
@app.get("/users/{user_id}", response_model=UserProfile)
async def fetch_user_profile(user_id: str):
    print(f"Received user_id: {user_id}")  # Log the received user ID
    
    try:
        # Query Firestore for the document with the matching user_id
        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()

        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="User not found in Firestore")

        # Fetch user data from the Firestore document
        user_data = user_doc.to_dict()

        # Only extract the fields needed for the UserProfile response
        user_response_data = {
            "username": user_data.get("username"),
            "email": user_data.get("email"),
            "contact": user_data.get("contact")
        }

        # Return a UserProfile model with only the necessary fields
        return UserProfile(**user_response_data)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching user profile: {str(e)}")

# Update username for a given user ID
@app.patch("/users/{user_id}/updateUsername", response_model=EditUsername)
async def update_username(user_id: str, request: UpdateUsernameRequest):
   
        # Log the received username for debugging
        print(f"Received username: {request.username}")

        username = request.username

        # Check if the username already exists in Firestore
        user_query = db.collection('users').where('username', '==', username).stream()
        if any(user_doc for user_doc in user_query):
            raise HTTPException(status_code=409, detail="This username is already taken")

        # Fetch the user document from Firestore using the user_id
        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()
        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="User not found!")

        # Update the username in the Firestore user document
        user_ref.update({'username': username})

        # Return the updated username in the response
        return EditUsername(username=username)
        

# Update email for a given user ID
@app.patch("/users/{user_id}/updateEmail", response_model=EditEmail)
async def update_email(user_id: str, request: UpdateEmailRequest):
    # Log the received email for debugging
    print(f"Received email: {request.email}")
    
    email = request.email

    # Check if the email already exists in Firestore
    user_query = db.collection('users').where('email', '==', email).stream()
    if any(user_doc for user_doc in user_query):
        raise HTTPException(status_code=409, detail="This email is already taken")

    # Fetch the user document from Firestore using the user_id
    user_ref = db.collection('users').document(user_id)
    user_doc = user_ref.get()
    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="User not found!")

    # Update the email in the Firestore user document
    user_ref.update({'email': email})

    # Return the updated email in the response
    return EditEmail(email=email)

# Update Password for a given user ID
@app.patch("/users/{user_id}/updatePassword")
async def update_password(user_id: str, request: UpdatePasswordRequest):
    # Validate the new password (optional, you can add more checks here)
    new_password = request.password

    try:
        # Update the password in Firebase Authentication
        user = auth.update_user(user_id, password=new_password)

        # If successful, return a success message
        return {"message": "Password updated successfully."}

    except auth.UserNotFoundError:
        # Handle the case where the user ID is invalid or the user doesn't exist
        raise HTTPException(status_code=404, detail="User not found.")

    except auth.InvalidPasswordError:
        # Handle invalid password errors (if any)
        raise HTTPException(status_code=400, detail="The new password is invalid.")

    except Exception as e:
        # Catch any other unexpected errors
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")


# Update contact for a given user ID
@app.patch("/users/{user_id}/updateContact")
async def update_contact(user_id: str, request: UpdateContactRequest):
    # Validate the new contact (optional, you can add more checks here)
    new_contact = request.contact

    try:
        # Fetch the user document from Firestore using the user_id
        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            # Handle the case where the user ID is invalid or the user doesn't exist
            raise HTTPException(status_code=404, detail="User not found!")

        # Update the contact in the Firestore user document
        user_ref.update({'contact': new_contact})

        # If successful, return a success message
        return {"message": "Contact updated successfully."}

    except Exception as e:
        # Catch any other unexpected errors
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")



# ------------------------------------------------------------------------------------Below Chatbot related
def get_allinfo(latitude,longitude,query):
    radius = 2500  
    limit = 20  
    params = {
        "query": query,
        "ll": f"{latitude},{longitude}",
        "radius": radius,
        "limit": limit
    }
   
    response = requests.get(url, headers=headers, params=params)
    
    try:
        response = requests.get(url, headers=headers, params=params)


        if response.status_code == 200:
            return JSONResponse(content=response.json())  
        else:
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch data")

    except requests.exceptions.RequestException as e:
      
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    
 

def get_location_info(latitude,longitude,query):
    radius = 2500  
    limit = 20  
    params = {
        "query": query,
        "ll": f"{latitude},{longitude}",
        "radius": radius,
        "limit": limit
    }
    location_data = []
    #print(f'{query}, {params},{headers}')
    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    #print(f'Response: {response.json()}')
    if response.status_code == 200:
        results = response.json()
        names = [place['name'] for place in results['results']]
        lat = [place['geocodes']['main']['latitude'] for place in results['results']]
        long = [place['geocodes']['main']['longitude'] for place in results['results']]
        distance = [place['distance']for place in results['results']]
        location_data.append(names)
        #print(names)
        #print(results)
        
        return location_data
    else:
        print(f"Error: {response.status_code}")
        return jsonify({"error": "Failed to fetch restaurants"}), response.status_code

def mood_detection(input_text):
    data=pd.read_csv("train.txt",sep=';')
    data.columns=["Text",'Emotions']
    texts=data['Text'].tolist() 
    labels=data['Emotions'].tolist()
    tokenizer=Tokenizer()
    tokenizer.fit_on_texts(texts)
    label_en=LabelEncoder()
    labels = label_en.fit_transform(labels)
    
    one_hot =keras.utils.to_categorical(labels)
    sequences =tokenizer.texts_to_sequences(texts)
    max_len=max(len(seq) for seq in sequences)
    padded_sequences =pad_sequences(sequences,maxlen=max_len)
    loaded_model = load_model('emotion_model.h5')
   # input_text = "A wave of melancholy swept over him as he watched the autumn leaves fall."
    input_seq=tokenizer.texts_to_sequences([input_text])
    padded_input_sequence = pad_sequences(input_seq, maxlen=max_len)
    prediction = loaded_model.predict(padded_input_sequence)
    predicted_label = label_en.inverse_transform([np.argmax(prediction[0])])
    print("Predicted Emotion:", predicted_label[0])
    return predicted_label[0]
def general_chat(inputdata,extra):
    generation_config = {
                "temperature": 1,
                "top_p": 0.95,
                "top_k": 40,
                "max_output_tokens": 8192,
            }
    model = genai.GenerativeModel(
                model_name="gemini-1.5-flash",
                generation_config=generation_config,
            )
    chat_session = model.start_chat(history=[])

    chat_response = chat_session.send_message(f'{inputdata} {extra}')

    response = chat_response.text if hasattr(chat_response, 'text') else str(chat_response)
    return response

@app.post("/nearbyLocation/")
async def nearbyLocation(request: ChatbotRequest):
    mode = request.mode
    lat = request.lat
    long = request.long
    datainfo = get_allinfo(lat,long, request.inputText)
    return datainfo

# Function to save chat data to Firestore
def save_chat_to_firestore(input_text: str, response: str, mode: str, lat: float, long: float, user_id: str):
    try:
        db = firestore.client()

        # Use the user's unique ID in Firestore
        chat_ref = db.collection('users').document(user_id).collection('chats').document()
        chat_ref.set({
            'inputText': input_text,
            'response': response,
            'mode': mode,
            'lat': lat,
            'long': long,
            'timestamp': firestore.SERVER_TIMESTAMP,  # Automatically set timestamp
        })

        print(f"Chat saved successfully under user ID: {user_id}")
    except Exception as e:
        print(f"Error saving chat to Firestore for user_id {user_id}: {e}")



@app.post("/chatbot/")
async def chatbot_response(request: ChatbotRequest, authorization: Optional[str] = Header(None)):
    mode = request.mode
    lat = request.lat
    long = request.long
    input_text = request.inputText
    print(f'{mode}:{lat}:{long}')

    user_id = None
    if authorization:
        try:
            # Verify Firebase ID token
            decoded_token = auth.verify_id_token(authorization.split("Bearer ")[1])
            user_id = decoded_token.get("uid")
        except Exception as e:
            print(f"Authentication error: {e}")

    extra = "give one response (this chat must be related with Singapore and travel plans. If any content is out of this, then tell the message: 'This is a complete chat for Singapore travel tourism chat. For any inquiries, contact +678955666 tourism management.')"

    try:
        words = input_text.split()
        response = ""

        if mode == "basic":
            if "location" in words:
                my_currentlatandlong = f'{lat},{long} use it and answer the query'
                response = general_chat(input_text, my_currentlatandlong + extra)
            elif "mood" in words:
                mood_info = mood_detection(input_text)
                response = general_chat(input_text, mood_info + extra)
            else:
                response = general_chat(input_text, extra)

        elif mode == "location":
            matched_words = [word for word in words if word in preferable_places]
            if matched_words:
                datainfo = get_location_info(lat, long, matched_words[0])
                response = datainfo
            else:
                response = "Sorry, those locations are not supported."

        elif mode == "mood":
            mood_info = mood_detection(input_text)
            response = general_chat(input_text, f"Mentioned that {mood_info} detected, then answer it.")

        # Save chat interaction to Firestore if the user is logged in
        if user_id:
            save_chat_to_firestore(input_text, response, mode, lat, long, user_id)

        return {"resultInfo": response}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    
# FastAPI route to fetch chat history
@app.get("/chatHistory/", response_model=List[ChatMessage])
async def get_chat_history(
    authorization: str = Header(None),
    user_service: UserService = Depends(UserService),
):
 
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header is missing")

    try:
        # Extract and verify Firebase token
        token = authorization.split("Bearer ")[1]
        decoded_token = auth.verify_id_token(token)
        user_id = decoded_token.get("uid")

        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid user ID")

        # Fetch chat history for the user
        return user_service.get_chat_history(user_id)

    except Exception as e:
        print(f"Error fetching chat history: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch chat history")

