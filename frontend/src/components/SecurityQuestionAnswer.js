import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/securityQuestionAnswer.css';

/**
 * Method to verify whether the input security answer matches the record we have in database and take 
 * further actions accordingly based on the verification status
 */
const SecurityQuestionAnswer = ({ userId }) => {
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSecurityQuestion = async () => {
      try {
        // Call thelambda function and check for the response by passing userid as a querystring parameter
        const response = await axios.get(`https://xy7ayehjn5prh7ftfyigunnflm0jjbte.lambda-url.us-east-1.on.aws/?userId=${userId}`);
        // Set the security question state with the question fetched from lambda
        setSecurityQuestion(response.data.securityQuestion);
      } catch (error) {
        console.log("Error fetching the security question: ", error);
      }
    };

    fetchSecurityQuestion();
  }, [userId]);

  // Handling the answer input state
  const handleAnswerChange = (e) => {
    setSecurityAnswer(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      //  Call to lambda function with the answer and user id to verify if they match the records
      const response = await axios.post('https://ghh7gplfvjzevyurajatrq5zq40uuune.lambda-url.us-east-1.on.aws/', {
        securityAnswer,
        userId
      });

      console.log('Server Response:', response.data);
      setMessage(response.data.message);

      if (response.data.verified) {
        // Redirect to home or another page after successful verification
        navigate('/solveceaser');
      }
    } catch (error) {
      console.log("Error verifying the security answer: ", error);
      setMessage('Error verifying the security answer.');
    }
  };

  return (
    <form id="securityAnswerForm" onSubmit={handleSubmit}>
      <div id="logo">
        <img src="/img/companyLogo.png" alt="Company Logo"/>
      </div>
      <div id="formData">
        <br/><br/>
        <h3>Please answer the below question</h3>
        <label htmlFor="securityQuestion" id="questionDisplay">Your Security Question:</label>
        <input
          type="text"
          id="securityQuestion"
          value={securityQuestion}
          readOnly
        />
        <label htmlFor="securityAnswer" id="answerInput">Provide Security Answer:</label>
        <input
          type="text"
          id="securityAnswerInput"
          value={securityAnswer}
          onChange={handleAnswerChange}
          required
        />
        <button type="submit">Submit</button>
        {message && <p>{message}</p>}
      </div>
    </form>
  );
};

export default SecurityQuestionAnswer;
