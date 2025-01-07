import axios, { AxiosResponse } from 'axios';
import { BASE_URL } from '../service/config';
import { Role, User } from '../model/User';
import { Authorise } from '../model/Authorise';
import { Preference } from '../model/preference';
import { ErrorResponse } from '../model/ErrorResponse';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { authenticateUser, sendTokenToBackend } from '../model/AuthService'; // Assuming these are imported from elsewhere



export const userController = {
  async createUser(user: User): Promise<AxiosResponse<User | ErrorResponse>> {
    try {
      const response = await axios.post<User>(`${BASE_URL}/users/`, user);
      return response;  
    } catch (error: any) {
      // Explicitly handle and rethrow errors
      if (axios.isAxiosError(error) && error.response) {
        const errorResponse = error.response.data as ErrorResponse; // Type assertion
        throw errorResponse; // Rethrow for frontend handling
      } else {
        console.error('Unexpected error:', error);
        throw new Error('An unexpected error occurred.');
      }
    }
  },

  async addprefernce(user: Preference): Promise<AxiosResponse<Preference>> {
    try {
      const response = await axios.post<Preference>(`${BASE_URL}/preference/`, user);
      return response;  
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // system admin list all users
  async listUsers(): Promise<AxiosResponse<User[]>> {
    try {
      const response = await axios.get<User[]>(`${BASE_URL}/users/`);
      return response;  
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // system admin 
  async deleteUser(userId: string): Promise<AxiosResponse<void>> {
    try {
      const response = await axios.delete(`${BASE_URL}/users/${userId}`);
      return response; 
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Login user function
  async loginUser(user: Authorise): Promise<AxiosResponse<any>> {
    try {
      // Step 1: Authenticate with Firebase using the credentials
      const idToken = await authenticateUser(user); // authenticateUser is from authService

      // Step 2: Send the ID token to the backend to validate
      const response = await sendTokenToBackend(idToken); // sendTokenToBackend is from authService

      // Return the response, which should include session data (user_id, session_id)
      return response;
    } catch (error) {
      console.error('Error during login:', error);
      throw new Error('Login failed');
    }
  },


  // Get the user id of the current user
  getCurrentUserId(): string | null {
    const auth = getAuth();
    const currentUser = auth.currentUser;
  
    if (!currentUser) {
      console.error('No user is logged in');
      return null;  // Log error when no user is logged in
    }
  
    console.log('Authenticated user ID:', currentUser.uid);  // Log user ID
    return currentUser.uid;  // Return the user ID if logged in
  },

  // Return user's profile information
  async fetchUserProfile(): Promise<User | null> {
    const userId = this.getCurrentUserId();  // Get the current user ID

    if (!userId) {
      console.error('No user is logged in');
      return null;  // Handle case where user is not authenticated
    }

    // Fetch user profile from backend API using the userId
    try {
      const response = await axios.get(`${BASE_URL}/users/${userId}`);

      if (response.status === 200) {
        const userProfile: User = response.data;  // Assuming the response is the user profile data
        return userProfile;  // Return the user profile data
      } else {
        console.error('Failed to fetch user profile');
        return null;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  },

  // User update username
  async updateUsername(newUsername: string): Promise<boolean> {
    const userId = this.getCurrentUserId();
    const userModel: User = {
      username: newUsername,
      email: '',  
      password: '', 
      contact: '', 
      role: Role.User || Role.Admin,
    };
    try {
      const response = await axios.patch(`${BASE_URL}/users/${userId}/updateUsername`, {
        username: userModel.username, // Use the username from the model
      });
  
      if (response.status === 200) {
        console.info('Username updated successfully');
        return true;
      }
      return false;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const errorResponse = error.response.data as ErrorResponse;
  
        // Check if the error indicates the username already exists
        if (errorResponse.detail && errorResponse.detail.includes('already exist')) {
          throw new Error;
        }
        throw errorResponse; // Rethrow other errors for general handling
      } else {
        console.error('Unexpected error:', error);
        throw new Error('An unexpected error occurred.');
      }
    }
  },

  // Update email
  async updateEmail(newEmail: string): Promise<boolean> {
    const userId = this.getCurrentUserId();
    const userModel: User = {
      username: '',   
      email: newEmail, 
      password: '',   
      contact: '',   
      role: Role.User || Role.Admin, 
    };

    try {
      const response = await axios.patch(`${BASE_URL}/users/${userId}/updateEmail`, {
        email: userModel.email, // Use the email from the model
      });

      if (response.status === 200) {
        console.info('Email updated successfully');
        return true; // Return true if the update succeeds
      }

      return false;  // Explicitly return false for non-200 status codes
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const errorResponse = error.response.data;

        // Check if the error indicates the email already exists
        if (errorResponse.detail && errorResponse.detail.includes('already exist')) {
          throw new Error();
        }
        throw errorResponse; // Rethrow other errors for general handling
      } else {
        throw new Error('Unexpected error');
      }
    }
  },

  // Update contact for User
  async updateContact(newContact: string): Promise<boolean> {
    const userId = this.getCurrentUserId();

    // Define the User model with the new contact value
    const userModel: User = {
      username: '',  
      email: '',     
      password: '',  
      contact: newContact,  
      role: Role.User || Role.Admin,
    };

    try {
      const response = await axios.patch(`${BASE_URL}/users/${userId}/updateContact`, {
        contact: userModel.contact,  // Use the contact from the User model
      });

      if (response.status === 200) {
        console.info('Contact updated successfully');
        return true;  // Return true if the update succeeds
      }

      return false;  // Explicitly return false for non-200 status codes
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const errorResponse = error.response.data;

        // Handle the error details
        throw new Error(errorResponse.detail);
      } else {
        console.error('Unexpected error:', error.message || error);
        throw new Error();
      }
    }
  },


  // Update password
  async updatePassword(newPassword: string): Promise<boolean> {
    const userId = this.getCurrentUserId();
    
    const userModel: User = {
      username: '',   
      email: '',      
      password: newPassword,  // Set the password to the new password value
      contact: '',    
      role: Role.User || Role.Admin,
    };

    try {
      const response = await axios.patch(`${BASE_URL}/users/${userId}/updatePassword`, {
        password: userModel.password,  // Use the password from the model
      });
      if (response.status === 200) {
        console.info('Password updated successfully');
        return true;  // Return true if the update succeeds
      }
      return false;  // Explicitly return false for non-200 status codes
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const errorResponse = error.response.data;

        throw new Error(errorResponse.detail);
      } else {
        console.error('Unexpected error:', error.message || error);
        throw new Error();
      }
    }
  }
};
