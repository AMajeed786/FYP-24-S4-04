import React, { useState } from 'react';
import { chatController } from '../controller/chatController';
import { ChatData } from '../model/Chat';

const Chat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([]); // Update state to track sender
  const [newMessage, setNewMessage] = useState("");
  const [mode, setMode] = useState("basic");
  const [welcomeMessageSent, setWelcomeMessageSent] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const getLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => reject(error),
          { timeout: 10000 }
        );
      } else {
        reject("Geolocation is not supported by this browser.");
      }
    });
  };
  const sendMessage = async () => {
    if (newMessage.trim()) {
      try {
        
        const location = await getLocation();
        const lat = location.lat;
        const long = location.lng;
  
        
        const chat: ChatData = {
          inputText: newMessage,
          lat: lat,
          long: long,
          mode:mode
        };
  
     
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: newMessage, sender: 'user' },
        ]);
  
        setNewMessage("");
  
        
        const response = await chatController.getChatResponse(chat);
        console.log(response)
       
        if (response.data && response.data.resultInfo) {
          const botResponse = response.data.resultInfo;
          console.log(botResponse)
       
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: botResponse, sender: 'bot' },
          ]);
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (error) {
        console.error("Error sending message or fetching response:", error);
  
     
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Sorry, something went wrong. Please try again.", sender: 'bot' },
        ]);
      }
    }
  };

  const handleButtonClick = (message: string) => {
    setMode(message);
    setMessages([...messages, { text: message, sender: 'user' }]);
  };

  const sendWelcomeMessage = () => {
    if (!welcomeMessageSent) {
      setMessages([
        { text: "Welcome to Holly Tourism! How can I help you?", sender: 'bot' },
        { text: "Please choose one of the options below:", sender: 'bot' },
      ]);
      setWelcomeMessageSent(true);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
      <button
        onClick={() => {
          toggleChat();
          sendWelcomeMessage();
        }}
        style={{
          backgroundColor: '#007BFF',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: '60px', // Set icon size to 60px
          height: '60px', // Set icon size to 60px
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
        }}
        aria-label="Chat"
      >
        💬
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: '90px',
            right: '0',
            width: '400px', // Increase width of the chatbot
            height: '500px', // Increase height of the chatbot
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px',
              backgroundColor: '#007BFF',
              color: '#fff',
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px',
            }}
          >
            <strong>Chatbot</strong>
            <button
              onClick={toggleChat}
              style={{
                backgroundColor: 'transparent',
                color: '#fff',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
              }}
              aria-label="Close Chat"
            >
              ✖
            </button>
          </div>

          <div
            style={{
              flex: '1',
              padding: '15px',
              overflowY: 'auto',
              maxHeight: '350px',
              background: '#34495e', // Dark background for the chat body
            }}
          >
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: '10px',
                    padding: '12px',
                    background: message.sender === 'user' ? '#f1f1f1' : '#007BFF',
                    color: message.sender === 'user' ? '#000' : '#fff',
                    borderRadius: '8px',
                    textAlign: message.sender === 'user' ? 'left' : 'left', // Left align text for both user and bot
                    maxWidth: '85%',
                    marginLeft: message.sender === 'user' ? '0' : 'auto', // Bot message aligned to the right
                    marginRight: message.sender === 'bot' ? '0' : 'auto', // Bot message aligned to the right
                  }}
                >
                  {message.text}
                </div>
              ))
            ) : (
              <p style={{ fontStyle: 'italic', color: '#aaa' }}>
                No messages yet.
              </p>
            )}
            {!welcomeMessageSent && (
              <p style={{ fontStyle: 'italic', color: '#aaa' }}>
                Loading initial conversation...
              </p>
            )}
          </div>

          {isOpen && welcomeMessageSent && (
            <>
              <button
                onClick={() => handleButtonClick("location")}
                style={{
                  backgroundColor: '#f1f1f1',
                  border: 'none',
                  padding: '12px',
                  width: '100%',
                  marginBottom: '10px',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  textAlign: 'left', // Align the button text to the left
                }}
              >
                Location Recommendation
              </button>
              <button
                onClick={() => handleButtonClick("mood")}
                style={{
                  backgroundColor: '#f1f1f1',
                  border: 'none',
                  padding: '12px',
                  width: '100%',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  textAlign: 'left', // Align the button text to the left
                }}
              >
                Mood Recommendation
              </button>
            </>
          )}

          <div style={{ display: 'flex', borderTop: '1px solid #ddd' }}>
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              style={{
                flex: '1',
                padding: '12px',
                border: 'none',
                outline: 'none',
                borderRadius: '0 0 0 8px',
                textAlign: 'left', // Ensures input text is aligned left
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                padding: '12px',
                background: '#007BFF',
                color: '#fff',
                border: 'none',
                borderRadius: '0 0 8px 0',
                cursor: 'pointer',
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};



export default Chat;
