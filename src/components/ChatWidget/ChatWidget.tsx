import React, { useState, useEffect } from "react";
import "./ChatWidget.css";
import { io, Socket } from 'socket.io-client';
import axios from "axios";

const ChatWidget: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [agentReply, setAgentReply] = useState<string>("");
  const [userSend, setUserSend] = useState<string>("");

  // Simulated backend function to fetch chat messages
  const fetchChatMessages = () => {
    const socket: Socket = io('https://stg.api.convoportal.com');
    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('sendAgentNotification', (data) => {
      console.log(data);
      setUserSend(data);
    });

    socket.on('sendAgentReplyNotification', (data) => {
      setTimeout(() => {
        const botMessage = {
          id: Date.now(),
          text: data,
          sender: "bot",
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      }, 1000);
    });

    // Simulated chat messages
    const mockMessages = [
      { id: 1, text: userSend, sender: "user" },
      // { id: 2, text: agentReply, sender: "bot" },
      // { id: 3, text: "How can I help you?", sender: "bot" },
      // { id: 3, text: "console.log(repair).maps.string.reverse().join(_)" },
    ];

    // Simulate a slight delay (in milliseconds) for API call
    setTimeout(() => {
      setMessages(mockMessages);
    }, 500);
  };

  // Simulated backend function to send user message
  const sendUserMessage = async () => {
    try {
      const res = await axios.post('https://stg.api.convoportal.com/api/v1/chat/recivechatWidgetMsg', {
        name: "sheraz",
        email: "amol@gmail.com",
        question: inputMessage,
      });
      console.log(res.data);
    } catch (e) {
      console.log(e);
    }
    if (inputMessage.trim() === "") return;

    const userMessage = { id: Date.now(), text: inputMessage, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputMessage("");
  };

  // Fetch chat messages on component mount
  useEffect(() => {
    fetchChatMessages();
  }, []);

  const [isExpanded, setIsExpanded] = useState(false);

  return !isExpanded ? (
    <div className="chat-widget-base">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ background: "black", borderRadius: "8px", border: "none" }}
      >
        <img
          src="https://stg-convoportal.s3.eu-west-2.amazonaws.com/public/chat-app/images/Expand.svg"
          height="30px"
          width="30px"
          alt="Shrink"
        />
      </button>
    </div>
  ) : (
    <div className="chat-widget-container">
      <div className="chat-widget-header" style={{ position: "relative" }}>
        <div>Chat Widget</div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: "transparent",
            borderRadius: "8px",
            border: "none",
            position: "absolute",
            right: "5px",
            top: "2px",
          }}
        >
          <img
            src="https://stg-convoportal.s3.eu-west-2.amazonaws.com/public/chat-app/images/Shrink.svg"
            height="30px"
            width="30px"
            alt="Shrink"
          />
        </button>
      </div>
      <div className="chat-widget-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-message ${message.sender === "user" ? "user" : "bot"}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="chat-widget-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendUserMessage();
            }
          }}
        />
        <button onClick={sendUserMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWidget;
