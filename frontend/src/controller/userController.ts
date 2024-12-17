import axios, { AxiosResponse } from 'axios';
import { BASE_URL } from '../service/config';
import { User } from '../model/User';
import { Authorise } from '../model/Authorise';
import { Preference } from '../model/preference';
import { ErrorResponse } from '../model/ErrorResponse';


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

  async listUsers(): Promise<AxiosResponse<User[]>> {
    try {
      const response = await axios.get<User[]>(`${BASE_URL}/users/`);
      return response;  
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  async deleteUser(userId: string): Promise<AxiosResponse<void>> {
    try {
      const response = await axios.delete(`${BASE_URL}/users/${userId}`);
      return response; 
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  async authenticateUser(authorised:Authorise): Promise<AxiosResponse<any>> {
    try {
      const response = await axios.post<Authorise>(`${BASE_URL}/authentication/`, authorised);
      return response;
    } catch (error) {
      console.error('Error during authentication:', error);
      throw error;
    }
  }
};
