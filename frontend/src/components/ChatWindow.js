// ChatWindow.js
import React, { useState, useEffect, useRef } from 'react';
import { sendMessageToLex } from '../lexService'; // Update path as needed
import './ChatWindow.css';

const ChatWindow = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatBodyRef = useRef(null);

  const handleSend = async () => {
    if (input.trim()) {
      const newMessages = [...messages, { text: input, sender: 'user' }];
      setMessages(newMessages);
      setInput('');

      const sessionId = 'defaultSessionId'; 
      const lexResponse = await sendMessageToLex(input, sessionId);

      const botMessage = { text: lexResponse, sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <span>DalBot</span>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
      </div>
      <div className="chat-body" ref={chatBodyRef}>
        <div className="placeholder-text">Start your conversation or ask a question...</div>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <div className="message-content">{msg.text}</div>
          </div>
        ))}
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
