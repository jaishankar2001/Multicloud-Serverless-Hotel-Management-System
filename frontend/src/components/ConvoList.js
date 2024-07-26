// ConvoList.js
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import '../css/ConvoList.css';

const ConvoList = () => {
  const [documents, setDocuments] = useState([]);
  const agentID = localStorage.getItem('user_id');

  useEffect(() => {
    if (!agentID) return;

    const fetchConvoData = async () => {
      const q = query(collection(db, 'convo'), where('agent_id', '==', agentID));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDocuments(docs);
    };

    fetchConvoData();
  }, [agentID]);
  const makeAvailable = async () => {
    try {
      const response = await fetch('https://foiiqhsc96.execute-api.us-east-1.amazonaws.com/development/end-convo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ agentID, type: 'available' }), // Added type field
      });

      if (response.ok) {
        alert('Agent marked as available.');
      } else {
        alert('Failed to mark agent as available.');
      }
    } catch (error) {
      console.error('Error making agent available:', error);
      alert('Error making agent available.');
    }
  };

  const makeUnavailable = async () => {
    try {
      const response = await fetch('https://foiiqhsc96.execute-api.us-east-1.amazonaws.com/development/end-convo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ agentID, type: 'unavailable' }), // Added type field
      });

      if (response.ok) {
        alert('Agent marked as unavailable.');
      } else {
        alert('Failed to mark agent as unavailable.');
      }
    } catch (error) {
      console.error('Error making agent unavailable:', error);
      alert('Error making agent unavailable.');
    }
  };

  return (
    <div className="flex-container">
      <div className="convo-list-container">
        <h1>Conversations for Agent {agentID}</h1>
        <div className="bubble-container">
          {documents.map(doc => (
            <div key={doc.id} className="bubble">
              <a href={`http://trialbuild-qual5imuuq-uc.a.run.app/chat/${doc.id}/agent`}>{doc.id}</a>
            </div>
          ))}
        </div>
      </div>
      <div className="status-buttons-container">
        <button onClick={makeAvailable} className="status-button available">
          Make Available
        </button>
        <button onClick={makeUnavailable} className="status-button unavailable">
          Make Unavailable
        </button>
      </div>
    </div>
  );
};

export default ConvoList;
