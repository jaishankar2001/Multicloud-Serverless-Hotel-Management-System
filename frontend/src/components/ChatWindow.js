// src/components/ChatWindow.js
import React, { useState, useEffect, useRef } from 'react';
import './ChatWindow.css';

const ChatWindow = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatBodyRef = useRef(null);

  const botResponses = [
    'This is a simulated response from the bot.',
    'How can I help you today?',
    'Please provide more details.',
    'I am here to assist you.',
  ];

  const handleSend = () => {
    if (input.trim()) {
      const newMessages = [...messages, { text: input, sender: 'user' }];
      setMessages(newMessages);
      setInput('');

      // Simulate bot response
      setTimeout(() => {
        const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
        const botMessage = { text: randomResponse, sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      }, 1000);
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
