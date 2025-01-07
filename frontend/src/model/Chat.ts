export interface ChatData {
  inputText: string;
  lat: number;
  long: number;
  mode: string;
}

export interface ChatHistory {
  sender: 'user' | 'bot'; // Define sender as either 'user' or 'bot'
  text: string;           // The actual message text
  timestamp: string;      // Timestamp of the message
}
