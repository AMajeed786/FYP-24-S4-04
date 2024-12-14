import axios, { AxiosResponse } from 'axios';
import { BASE_URL } from '../service/config';
import { ChatData } from '../model/Chat';

interface ChatbotResponse {
  resultInfo: string; 
}

export const chatController = {
  async getChatResponse(chat: ChatData): Promise<AxiosResponse<ChatbotResponse>> {
    try {
      const response = await axios.post<ChatbotResponse>(`${BASE_URL}/chatbot/`, chat);
      return response;  
    } catch (error) {
      console.error('Error getting chatbot response:', error);
      throw error;
    }
  },
};
