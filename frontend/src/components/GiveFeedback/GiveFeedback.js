import React, { useState } from 'react';
import axios from 'axios';
import './GiveFeedback.css';

/**
 * GiveFeedback Component
 * This component allows a user to submit feedback.
 * 
 * @param {Object} props - The component props
 * @param {string} props.userId - The ID of the user submitting feedback
 */
const GiveFeedback = ({ userId }) => {
    const [feedback, setFeedback] = useState('');
    const [message, setMessage] = useState('');

    const username = userId;

    /**
     * Handle the submission of feedback.
     * 
     * @param {Object} e - The event object
     * @returns {Promise<void>}
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const feedbackData = {
            feedback: feedback,
            username: username,
            date_time: currentDateTime
        };

        try {
            const response = await axios.post('https://mx9uotjgz8.execute-api.us-east-1.amazonaws.com/v2/feedback', feedbackData);
            if (response.status === 200) {
                setMessage('Feedback submitted successfully!');
                setFeedback('');
            } else {
                setMessage('Failed to submit feedback.');
            }
        } catch (error) {
            setMessage('Error submitting feedback.');
            console.error('Error:', error);
        }
    };

    return (
        <div className="custom-feedback-form-container">
            <h1>Submit Feedback</h1>
            <form onSubmit={handleSubmit} className="custom-feedback-form">
                <div className="custom-form-group">
                    <label htmlFor="feedback">Feedback:</label>
                    <textarea
                        id="feedback"
                        rows="5"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        required
                        className="custom-form-control"
                    />
                </div>
                <button type="submit" className="custom-submit-button">
                    Submit
                </button>
            </form>
            {message && (
                <div className={`custom-alert ${message.includes('successfully') ? 'custom-alert-success' : 'custom-alert-danger'}`}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default GiveFeedback;
