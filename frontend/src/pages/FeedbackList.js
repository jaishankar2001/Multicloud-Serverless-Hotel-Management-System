import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import validateToken from '../components/validateToken';

import GetAllFeedbacks from '../components/GetFeedbacks/GetAllFeedbacks';
import GiveFeedback from '../components/GiveFeedback/GiveFeedback';
import GetOwnFeedbacks from '../components/GetFeedbacks/GetOwnFeedbacks';
import Navigation from '../components/navigation';

import './FeedbackList.css';

/**
 * FeedbackList Component
 * This component handles the display of feedback-related components based on user authentication status.
 * 
 * @param {Object} props - The component props
 * @param {string} props.userId - The ID of the user
 * @param {Function} props.handleSignOut - Function to handle user sign out
 */
const FeedbackList = ({ userId, handleSignOut }) => {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    // console.log("User ID (FeedbackList):", userId);

    /**
     * Check the validity of the token.
     * This function is called when the component is mounted.
     * 
     * @returns {Promise<void>}
     */
    const checkTokenValidity = async () => {
      const tokenIsValid = await validateToken();
      setIsValid(tokenIsValid);
    };

    checkTokenValidity();
  }, [userId]);

  return (
    <>
      <Navigation />
      <div className="feedback-list-container" style={{ paddingTop: '8%' }}>
        <header className="feedback-list-header">
        <Link to="/" className="nav-link">Home</Link>
          {isValid && (
            <button onClick={handleSignOut} className="sign-out-button">Sign Out</button>
          )}
        </header>
        <GetAllFeedbacks />
        <div className="feedback-list-content">
          {isValid === null ? (
            <h1>Checking validity...</h1>
          ) : isValid ? (
            <div className="feedback-container">
              <GiveFeedback userId={userId} />
              <GetOwnFeedbacks userId={userId} />
            </div>
          ) : (
            <h1>Log in to give feedback</h1>
          )}
        </div>
      </div>
    </>
  );
};

export default FeedbackList;
