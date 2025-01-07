import axios, { AxiosResponse } from 'axios';
import { BASE_URL } from '../service/config';
import { ChatData, ChatHistory } from '../model/Chat';
import { getAuth } from 'firebase/auth';

interface ChatbotResponse {
  resultInfo: string; 
}

export const chatController = {
  // Get chatbot response
  async getChatResponse(chat: ChatData): Promise<AxiosResponse<ChatbotResponse>> {
    try {
      // Get Firebase token for logged-in users
      const auth = getAuth();
      const currentUser = auth.currentUser;
      const token = currentUser ? await currentUser.getIdToken() : null;

      // Only include the Authorization header if the user is logged in
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Send chat data to the backend
      const response = await axios.post<ChatbotResponse>(
        `${BASE_URL}/chatbot/`,
        chat,
        { headers }
      );
      return response;
    } catch (error) {
      console.error("Error getting chatbot response:", error);
      throw error;
    }
  },

  // Get chat history
async getChatHistory(): Promise<ChatHistory[]> {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) throw new Error("User is not logged in.");

    const token = await currentUser.getIdToken();
    const headers = { Authorization: `Bearer ${token}` };

    const { data } = await axios.get<ChatHistory[]>(`${BASE_URL}/chatHistory`, { headers });

    return data || []; // Return data or an empty array if no data
  } catch (error: any) {
    console.error("Error fetching chat history:", error.message || error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch chat history. Please try again."
    );
  }
}

};





