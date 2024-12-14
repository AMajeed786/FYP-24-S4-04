import axios, { AxiosResponse } from 'axios';
import { BASE_URL } from '../service/config';
import { Planner } from '../model/Planner';




export const PlannerController = {
  async getPlans(plan: Planner): Promise<AxiosResponse> {
    try {
     
      const response = await axios.post<Planner>(`${BASE_URL}/getpreferences/`, plan);
 
      return response;
    } catch (error) {
      console.error('Error getting itinerary:', error);
      throw error;
    }
  },
};
