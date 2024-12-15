import firebase_admin
from firebase_admin import credentials, firestore, auth
from User import User,ChatbotRequest,Authorised,Preference
from fastapi import FastAPI, HTTPException
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
genai.configure(api_key="AIzaSyCGe_KIgS-Mb3ZOXQzeLJusfCtJMCHjoao")
import requests
preferable_places = ["resturant", "cafe", "tourist destination", "shopping malls","theathers", "hotels", "spa", "emergency service", "outdoor(park)"]


myapi ="fsq31Xao86Sk9UoGcO10uO3RnU/4/3KbBZEBsBE+g0T/zYk="
url = "https://api.foursquare.com/v3/places/search"
headers = {
    "Accept": "application/json",
    "Authorization": myapi
}




cred = credentials.Certificate("tourism-89192-firebase-adminsdk-7cynn-d73dee9e5c.json")
firebase_app = firebase_admin.initialize_app(cred)


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


@app.post("/users/", status_code=201) 
async def create_user(user: User):
    try:
        
        created_user = user_service.add_user(user)
        return created_user  
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/preference/", status_code=201) 
async def add_preference(perfernce: Preference):
    try:
        created_perfernce = user_service.add_preference(perfernce)
        return created_perfernce  
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/users/", response_model=List[User])
async def list_users():
    try:
        users = user_service.get_users()
        return users
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/authentication/", status_code=201)  
async def authorised(data: Authorised):
    try:
        res = user_service.authenticate_user(data)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/users/{user_id}", status_code=204)  
async def remove_user(user_id: str):
    try:
        success = user_service.delete_user(user_id)
        if success:  
            return {"message": "User deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/preferences/{user_id}", status_code=200)  
async def isExist(user_id: str):
    try:
        success = user_service.already_id_exist(user_id)
        return {"exists": success}  
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
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
@app.post("/chatbot/")
async def chatbot_response(request: ChatbotRequest):
    mode = request.mode
    lat = request.lat
    long = request.long
    print(f'{mode}:{lat}:{long}')
    extra = "give one response (this chat must be related with singapore and travel plan's. if any content is out of this then tell the message this is complete chat for singapore travel tourism chat. for any enquire contact +678955666 tourism management)"
    try:
        words = request.inputText.split()
        
        if mode == "basic":
            if "location" in words:
                my_currentlatandlong =f'{lat},{long} use it and answer the query'
                response = general_chat(request.inputText,my_currentlatandlong+extra)
            elif "mood" in words:
                mood_info = mood_detection(request.inputText)
                data = mood_info+"(mention that this mood is detected)"
                response =general_chat(request.inputText,mood_info+extra) 
            else:
                response = general_chat(request.inputText,extra)
        elif mode=="location":
             print(words)
             matched_words = [word for word in words if word in preferable_places]
             print(matched_words[0])
             if matched_words:
                 datainfo = get_location_info(lat,long,matched_words[0])
                 response =datainfo
                 print(datainfo)
             else:
                 response = "Sorry those location api not support"
             
        elif mode == "mood":
            mood_info = mood_detection(request.inputText)
            response =general_chat(request.inputText,f"Mentioned that {mood_info} detected then answer it")
        return {"resultInfo": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))