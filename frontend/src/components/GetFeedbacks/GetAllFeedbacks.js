import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './GetFeedbacks.css';

/**
 * GetAllFeedbacks Component
 * This component fetches and displays a list of feedbacks with pagination.
 */
const FeedbackList = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const feedbacksPerPage = 5; // Number of feedbacks to display per page

    /**
     * Fetch feedbacks from the API and sort them by date in descending order.
     * This function is called when the component is mounted.
     * 
     * @returns {Promise<void>}
     */
    const fetchFeedbacks = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://2levm8ra85.execute-api.us-east-1.amazonaws.com/v1/feedbacks');
            const sortedFeedbacks = response.data.sort((a, b) => new Date(b.date_time) - new Date(a.date_time));
            setFeedbacks(sortedFeedbacks);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    /**
     * Get the current feedbacks to display based on the current page.
     */
    const indexOfLastFeedback = currentPage * feedbacksPerPage;
    const indexOfFirstFeedback = indexOfLastFeedback - feedbacksPerPage;
    const currentFeedbacks = feedbacks.slice(indexOfFirstFeedback, indexOfLastFeedback);

    /**
     * Handle pagination to the next page.
     */
    const handleNext = () => {
        if (currentPage < Math.ceil(feedbacks.length / feedbacksPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    /**
     * Handle pagination to the previous page.
     */
    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    /**
     * Handle pagination to the first page.
     */
    const handleFirst = () => {
        setCurrentPage(1);
    };

    /**
     * Handle pagination to the last page.
     */
    const handleLast = () => {
        setCurrentPage(Math.ceil(feedbacks.length / feedbacksPerPage));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="feedback-list-container">
            <h1>All Feedbacks</h1>
            <button onClick={fetchFeedbacks} className="refresh-button">Refresh</button>
            <table className="feedback-table">
                <thead>
                    <tr>
                        <th>Date Time</th>
                        <th>Feedback</th>
                        <th>Polarity</th>
                    </tr>
                </thead>
                <tbody>
                    {currentFeedbacks.map((feedback, index) => (
                        <tr key={index}>
                            <td>{new Date(feedback.date_time).toLocaleString()}</td>
                            <td>{feedback.feedback}</td>
                            <td>{feedback.polarity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination-container">
                <button onClick={handleFirst} disabled={currentPage === 1} className="pagination-button">First</button>
                <button onClick={handlePrev} disabled={currentPage === 1} className="pagination-button">Prev</button>
                <span className="current-page">{currentPage}</span>
                <button onClick={handleNext} disabled={currentPage === Math.ceil(feedbacks.length / feedbacksPerPage)} className="pagination-button">Next</button>
                <button onClick={handleLast} disabled={currentPage === Math.ceil(feedbacks.length / feedbacksPerPage)} className="pagination-button">Last</button>
            </div>
        </div>
    );
};

export default FeedbackList;
