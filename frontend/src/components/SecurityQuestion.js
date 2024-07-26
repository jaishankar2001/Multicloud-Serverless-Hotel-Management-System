import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../css/SecurityQuestion.css";
/**
 * Method to perform the setup of security question once the user has successfully authenticated with cognito
 * Here, they will need to setup a security question that they will need to answer during signin
 */
const SecurityForm = ({userId}) => {
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [userRole, setUserRole] = useState('RegisteredUser');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Hamdling the questionchange state
  const handleQuestionChange = (e) => {
    setSecurityQuestion(e.target.value);
  };

  // Hamdling the answer input state
  const handleAnswerChange = (e) => {
    setSecurityAnswer(e.target.value);
  };

  // Hamdling the role selection dropdown
  const handleUserRoleChange = (e) => {
    setUserRole(e.target.value);
  };

  //  Handling the submit event
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // POST request using Axios to the database to store details
      const response = await axios.post('https://we5eb66yfo4o7nbvf3j5bisrgm0cgcxj.lambda-url.us-east-1.on.aws/', {
        'securityQuestion' : securityQuestion,
        'securityAnswer' : securityAnswer,
        'userId' : userId,
        'userRole' : userRole
      });
    
    console.log('Server Response:', response.data);
    // Reset the form fields
    setSecurityQuestion('');
    setSecurityAnswer('');
    setUserRole('');
    setMessage('Form submitted successfully!');
    navigate('/signin');

  } catch (error) {
    console.log("Error submitting the security questions: ", error);
  }
  };

  return (
    <div class="form-container">
      <form id="securityQuestionForm" onSubmit={handleSubmit}>
        <div id="logo">
          <img src="/img/companyLogo.png" alt="Company Logo"/>
        </div>
        <div class="Securitycomponent">
          <label htmlFor="securityQuestion">Security Question:</label>
          <input
            type="text"
            id="securityQuestionInput"
            value={securityQuestion}
            onChange={handleQuestionChange}
            required
          />
          <label htmlFor="securityAnswer">Security Answer:</label>
          <input
            type="text"
            id="securityAnswerInput"
            value={securityAnswer}
            onChange={handleAnswerChange}
            required
          />
        </div>
        <div>
          <label htmlFor="userRole">Select User Role:</label>
          <select
            id="userRole"
            value={userRole}
            onChange={handleUserRoleChange}
            required
          >
            <option value="RegisteredUser">Registered User</option>
            <option value="PropertyAgent">Property Agent</option>
          </select>
        </div>
        <button type="submit">Submit</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default SecurityForm;
