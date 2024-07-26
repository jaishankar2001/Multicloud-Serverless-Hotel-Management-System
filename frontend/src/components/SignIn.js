
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import CryptoJS from 'crypto-js';

/**
 * Mehtod to handle the signin redirection as well as verifying the authentictation code that the cognito sends back upon a user's successful
 * sign in by cognito service. We must validate it inorder to proceed further.
 */
const fetchUserAttributes = async (userId) => {
    // Call to lambda function to fetch the user details that is currently signed in
    const response = await axios.get(`https://xy7ayehjn5prh7ftfyigunnflm0jjbte.lambda-url.us-east-1.on.aws/?userId=${userId}`, {

    });
    return response;
};

const SignIn = ({setUserId}) => {
    const navigate = useNavigate();
  
    useEffect(() => {
      const handleSignInAuthCallback = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
  
        // Check if the code is returned or not
        if (code) {
          try {
            // Check the token with the cognito
            const response = await axios.post('https://register-customers.auth.us-east-1.amazoncognito.com/oauth2/token', 
              new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: '44netf2dipspddsebq3vmq8pmn',
                code: code,
                redirect_uri: 'http://trialbuild-qual5imuuq-uc.a.run.app/signin' // The redirect URI
              }), {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            });
  
            const { id_token, access_token, refresh_token } = response.data;
            // Store tokens in localStorage
            const secretKey = process.env.REACT_APP_SECRET_KEY;
            localStorage.setItem('encrypted_id_token', CryptoJS.AES.encrypt(id_token, secretKey).toString());
            localStorage.setItem('encrypted_access_token', CryptoJS.AES.encrypt(access_token, secretKey).toString());
            localStorage.setItem('encrypted_refresh_token', CryptoJS.AES.encrypt(refresh_token, secretKey).toString());

            // Decode the ID token to get user information
            const decodedToken = jwtDecode(id_token);
            const userId = decodedToken.sub;
  
            // Set user ID in state
            setUserId(userId);
            localStorage.setItem('user_id', userId);

            // Fetch user details from DynamoDB to check if security question is set
            const userAttributesResponse = await fetchUserAttributes(userId);
            console.log(userAttributesResponse);
  
            if (userAttributesResponse.status === 200) {
              // User found, handle user attributes
              const userAttributes = userAttributesResponse.data;
              const hasSecurityQuestion = userAttributes.hasSecurityQuestion === 'true';
  
              if (!hasSecurityQuestion) {
                  navigate('/security-question-setup');
              } else {
                  navigate('/security-question-answer');
              }
            } else if (userAttributesResponse.status === 210) {
                // User not found, then redirect
                navigate('/security-question-setup');
            } else {
                // Handle other errors
                console.error('Error fetching user attributes:', userAttributesResponse.error);
                
            }
            
          } catch (error) {
            console.error('Error exchanging code for tokens', error);
          }
        } else {
          redirectToCognitoUI();
          // handleSignInAuthCallback();
        }
      };
  
      handleSignInAuthCallback();
  
    }, [navigate, setUserId]);
    
    const redirectToCognitoUI = () => {
      window.location.href = 'https://register-customers.auth.us-east-1.amazoncognito.com/signup?client_id=44netf2dipspddsebq3vmq8pmn&response_type=code&scope=aws.cognito.signin.user.admin+email+openid+profile&redirect_uri=https%3A%2F%2Fdalvac-qual5imuuq-uc.a.run.app%2Fsignin';
    };
    return <div>Loading...</div>;

  };
  export default SignIn;
  