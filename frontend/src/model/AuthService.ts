// services/authService.ts
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Authorise } from '../model/Authorise';  // Import the Authorise interface
import axios, { AxiosResponse } from 'axios';
import { BASE_URL } from '../service/config';


// Authenticate the user with Firebase and get their ID token
export const authenticateUser = async (user: Authorise): Promise<string> => {
    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, user.email, user.password);
      const idToken = await userCredential.user.getIdToken();
      return idToken; // Return the Firebase ID token
    } catch (error) {
      console.error('Firebase Authentication Error:', error);
      throw new Error('Authentication failed');
    }
  };
  
  // Send the Firebase ID token to the backend for verification and session creation
  export const sendTokenToBackend = async (idToken: string): Promise<AxiosResponse> => {
    try {
      const response = await axios.post(`${BASE_URL}/authentication/`, { idToken });
      return response; // Return the backend response containing session info
    } catch (error) {
      console.error('Backend Authentication Error:', error);
      throw new Error('Backend verification failed');
    }
  };