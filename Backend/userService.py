from firebase_admin import firestore, auth
from User import User,Authorised,Preference


class UserService:
    def __init__(self):
        self.db = firestore.client()

    def add_user(self, user: User):
       
        user_dict = user.dict()
        user_ref = self.db.collection("users").add(user_dict)
        return {"message": "User added successfully", "user_id": user_ref[1].id}

    def get_users(self):
       
        users_ref = self.db.collection("users")
        docs = users_ref.stream()
        users = [doc.to_dict() for doc in docs]
        return users

    def delete_user(self, user_id: str):
       
        self.db.collection("users").document(user_id).delete()
        return {"message": f"User with ID {user_id} deleted successfully"}



    def add_preference(self, perfernce: Preference):
       
        perfernce_dict = perfernce.dict()
        perfernce_ref = self.db.collection("perference").add(perfernce_dict)
        return {"message": "Preference added successfully", "pref_id": perfernce_ref[1].id}

    def authenticate_user(self, data: Authorised):
        try:
            # Verify the ID token using Firebase Admin SDK
            decoded_token = auth.verify_id_token(data.idToken)
            user_id = decoded_token.get("uid")
            return {"message": "Authentication successful", "user_id": user_id}
        except Exception as e:
            raise ValueError(f"Authentication failed: {str(e)}")
