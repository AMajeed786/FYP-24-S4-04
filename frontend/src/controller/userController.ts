import axios, { AxiosResponse } from 'axios';
import { BASE_URL } from '../service/config';
import { User } from '../model/User';
import { Authorise } from '../model/Authorise';
import { Preference } from '../model/preference';

export const userController = {
  async createUser(user: User): Promise<AxiosResponse<User>> {
    try {
      const response = await axios.post<User>(`${BASE_URL}/users/`, user);
      return response;  
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
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



  async checkUserExists(userId: string): Promise<{ exists: boolean }> {
    try {
      const response: AxiosResponse<{ exists: boolean }> = await axios.get(`${BASE_URL}/preferences/${userId}`);
      return response.data;  
    } catch (error) {
      console.error('Error checking user existence:', error);
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
