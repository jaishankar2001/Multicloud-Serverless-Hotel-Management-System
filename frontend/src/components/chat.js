// src/components/Chat.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, updateDocument } from './firebase'; // Import db and updateDocument from firebase.js
import '../css/Chat.css';

const Chat = () => {
  const { conversationId } = useParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState('');
  const [agentId, setAgentId] = useState('');
  const {usertype} = useParams();
  const [responseMessage, setResponseMessage] = useState(null);

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const docRef = db.collection('convo').doc(conversationId);
        docRef.onSnapshot((doc) => {

        if (doc.exists) {
          const data = doc.data();
          setUserId(data.user_id);
          setAgentId(data.agent_id);

          const sortedMessages = Object.entries(data)
            .filter(([key, value]) => !['user_id', 'agent_id'].includes(key)) // Exclude userId and agentId fields
            .sort((a, b) => Number(a[0]) - Number(b[0]))
            .map(([timestamp, messageData]) => ({
              ...messageData,
              timestamp: new Date(Number(timestamp)).toLocaleString() // Convert timestamp to readable date format
            }));
          setMessages(sortedMessages);
        } else {
          console.log('No such document!');
        }
        });
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };

    fetchChatData();
  }, [conversationId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        sender: usertype, // Replace with actual sender
        message: message,
        timestamp: new Date().toLocaleString() // Use current time as timestamp
      };

      // Update Firestore document with new message
      await updateDocument('convo', conversationId, {
        [Date.now().toString()]: newMessage
      });

      // Clear message input
      setMessage('');
    }
  };
  const handleChange = (e) => {
    const { value } = e.target;
    setMessage(value);
  };
  const isUserMessage = (msgSender) => {
    console.log(msgSender === 'user')
    return msgSender === 'user';
  };

  return (
    <div id="Chat">
      <div className="container">
        <div className="chat-headers">
          <h2>Chat Interface</h2>
          <p>Communicate in real-time with your agent.</p>
        <p><strong>User ID:</strong> {userId}</p>
        <p><strong>Agent ID:</strong> {agentId}</p>
        </div>
        <div className="chat-window">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${isUserMessage(msg.sender) ? 'user' : 'agent'}`}>
              <p>{msg.message}</p>
              <p className="timestamp">{msg.timestamp}</p>
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="chat-form">
          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <input
              type="text"
              className="form-control"
              id="message"
              value={message}
              onChange={handleChange}
              placeholder="Type your message..."
            />
          </div>
          <button type="submit" className="chat-form button">
            Send
          </button>
        </form>
        {responseMessage && (
          <div className="response-message">
            <p>{responseMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};



export default Chat;
