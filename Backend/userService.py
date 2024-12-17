from firebase_admin import firestore
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

    # edited this function, it is pointless to check for userID as all new users are generated with a new userID
    def already_user_exists(self, email: str = None, username: str = None) -> bool:
        try:
            users_ref = self.db.collection("users")

            # Build query conditionally
            if email:
                print(f"Checking for email: {email}")
                query = users_ref.where("email", "==", email)
            elif username:
                print(f"Checking for username: {username}")
                query = users_ref.where("username", "==", username)
            else:
                raise ValueError("Either email or username must be provided to check existence.")

            # Execute the query and fetch results
            docs = query.stream()
            results = [doc.id for doc in docs]  # Get matching document IDs for debugging

            print(f"Matching Documents: {results}")  # Debug print

            # Return True if any matching documents are found
            return len(results) > 0

        except Exception as e:
            print(f"Error checking user existence: {e}")
            return False




    def add_preference(self, perfernce: Preference):
       
        perfernce_dict = perfernce.dict()
        perfernce_ref = self.db.collection("perference").add(perfernce_dict)
        return {"message": "Prefernce added successfully", "pref_id": perfernce_ref[1].id}

    def authenticate_user(self, data:Authorised):
        users_ref = self.db.collection("users")
        query = users_ref.where("email", "==", data.email).where("password", "==", data.password).limit(1)
        docs = query.stream()

        # If no matching user is found
        user_doc = None
        user_id = None
        username = None
        for doc in docs:
            user_doc = doc.to_dict()
            user_id = doc.id  # Get the document ID
            username = user_doc["username"]  # Get the username

        # Check if the user was found
        if user_doc is None:
            raise ValueError("User not found")

        # Return the user_id and username upon successful authentication
        return {"user_id": user_id, "username": username}
