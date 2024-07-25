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

  return (
    <div>
    <h1>Conversations for Agent {agentID}</h1>
    <div className="bubble-container">
      {documents.map(doc => (
        <div key={doc.id} className="bubble">
          <a href={`http://localhost:3000/chat/${doc.id}/agent`}>{doc.id}</a>
        </div>
      ))}
    </div>
  </div>
);
};

export default ConvoList;
