import React from 'react';
import './ChatbotIcon.css';

const ChatbotIcon = ({ onClick }) => {
  return (
    <div className="chatbot-icon" onClick={onClick}>
      <img src="/img/chatbot.png" alt="Chatbot" />
    </div>
  );
};

export default ChatbotIcon;