import React, { useState, useEffect, useRef } from "react";
import { chatController } from "../controller/chatController";
import { ChatData, ChatHistory } from "../model/Chat";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Chat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "bot"; timestamp?: string }[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [mode, setMode] = useState("basic");
  const [welcomeMessageSent, setWelcomeMessageSent] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const chatBodyRef = useRef<HTMLDivElement>(null);

  // Monitor authentication state
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // Set to true if user exists, false otherwise
    });
    return () => unsubscribe();
  }, []);

  const toggleChat = () => setIsOpen(!isOpen);

  const getLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({ lat: position.coords.latitude, lng: position.coords.longitude });
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
        const chat: ChatData = { inputText: newMessage, lat: location.lat, long: location.lng, mode };

        const timestamp = new Date().toISOString();
        setMessages((prevMessages) => [...prevMessages, { text: newMessage, sender: "user", timestamp }]);
        setNewMessage("");

        const response = await chatController.getChatResponse(chat);
        if (response.data?.resultInfo) {
          const botResponse = response.data.resultInfo;
          setMessages((prevMessages) => [...prevMessages, { text: botResponse, sender: "bot" }]);
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (error) {
        console.error("Error sending message or fetching response:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Sorry, something went wrong. Please try again.", sender: "bot" },
        ]);
      }
    }
  };

  const handleButtonClick = (option: string) => { 
    setMode(option);
    const timestamp = new Date().toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "2-digit", 
      day: "2-digit" 
    }); // Formats to date only (e.g., 01/07/2025)
    setMessages((prevMessages) => [...prevMessages, { text: option, sender: "user", timestamp }]);
  };


  const sendWelcomeMessage = () => {
    if (!welcomeMessageSent) {
      setMessages([
        { text: "Welcome to Holly Tourism! How can I help you?", sender: "bot" },
        { text: "Please choose one of the options below:", sender: "bot" },
      ]);
      setWelcomeMessageSent(true);
    }
  };

  const fetchChatHistory = async () => {
    try {
      const history = await chatController.getChatHistory();
      if (Array.isArray(history)) {
        setChatHistory(history);
      } else {
        throw new Error("Invalid chat history data");
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
      setChatHistory([]);
    }
  };

  useEffect(() => {
    if (showHistory) fetchChatHistory();
  }, [showHistory]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, chatHistory]);

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 1000 }}>
      {/* Chat Toggle Button */}
      <button
        onClick={() => {
          toggleChat();
          sendWelcomeMessage();
        }}
        style={{
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          fontSize: "24px",
          cursor: "pointer",
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
        }}
        aria-label="Chat"
      >
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            bottom: "90px",
            right: "0",
            width: "450px",
            height: "500px",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Chat Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px",
              background: "linear-gradient(to right, #4facfe, #00f2fe)",
              color: "#fff",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
            }}
          >
            <strong style={{ fontSize: "18px", fontWeight: "600" }}>Chatbot</strong>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {isAuthenticated && (
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  style={{
                    background: showHistory
                      ? "linear-gradient(to right, #ff512f, #dd2476)"
                      : "linear-gradient(to right, #4facfe, #00f2fe)",
                    color: "#fff",
                    border: "none",
                    padding: "8px 20px",
                    borderRadius: "20px",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
                  {showHistory ? "Close History" : "View History"}
                </button>
              )}
              <button
                onClick={toggleChat}
                style={{
                  backgroundColor: "transparent",
                  color: "#fff",
                  border: "none",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
                aria-label="Close Chat"
              >
                ✖
              </button>
            </div>
          </div>

          {/* Chat Body */}
          <div
            ref={chatBodyRef}
            style={{
              flex: "1",
              padding: "10px",
              overflowY: "auto",
              maxHeight: "350px",
              background: "#34495e",
              color: "#fff",
              display: "flex",
              flexDirection: "column",
            }}
            className="chat-body"
          >
            {(showHistory ? [...chatHistory].reverse() : messages).map((message, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: message.sender === "user" ? "row" : "row-reverse",
                  alignItems: "flex-start",
                  marginBottom: "10px",
                }}
              >
                {/* Message Bubble */}
                <div
                  style={{
                    padding: "12px",
                    background: message.sender === "user" ? "#f1f1f1" : "#007BFF",
                    color: message.sender === "user" ? "#000" : "#fff",
                    borderRadius: "8px",
                    maxWidth: "70%",
                    textAlign: message.sender === "user" ? "left" : "right",
                    wordBreak: "break-word",
                  }}
                >
                  {message.text}
                  {showHistory && message.timestamp && (
                    <div
                      style={{
                        fontSize: "10px",
                        marginTop: "5px",
                        textAlign: "right",
                        color: "#555", // Darker color for history timestamps
                      }}
                    >
                    {new Date(message.timestamp).toLocaleDateString("en-US", { 
                      year: "numeric", 
                      month: "2-digit", 
                      day: "2-digit" 
                    })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Recommendation Buttons */}
          {isOpen && welcomeMessageSent && !showHistory && (
            <div>
              <button
                onClick={() => handleButtonClick("location")}
                style={{
                  backgroundColor: "#007BFF",
                  border: "none",
                  padding: "12px",
                  width: "100%",
                  marginBottom: "10px",
                  cursor: "pointer",
                  borderRadius: "4px",
                }}
              >
                Location Recommendation
              </button>
              <button
                onClick={() => handleButtonClick("mood")}
                style={{
                  backgroundColor: "#007BFF",
                  border: "none",
                  padding: "12px",
                  width: "100%",
                  cursor: "pointer",
                  borderRadius: "4px",
                }}
              >
                Mood Recommendation
              </button>
            </div>
          )}

          {/* Chat Footer */}
          <div
            style={{
              display: "flex",
              borderTop: "1px solid #ddd",
              padding: "10px",
              backgroundColor: "#fff",
            }}
          >
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              style={{
                flex: "1",
                padding: "12px",
                border: "none",
                outline: "none",
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                padding: "12px",
                background: "#007BFF",
                color: "#fff",
                border: "none",
                cursor: "pointer",
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
