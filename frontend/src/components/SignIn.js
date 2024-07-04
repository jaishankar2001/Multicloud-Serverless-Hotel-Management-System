
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';


const fetchUserAttributes = async (userId) => {
    const response = await axios.get(`https://xy7ayehjn5prh7ftfyigunnflm0jjbte.lambda-url.us-east-1.on.aws/?userId=${userId}`, {
      // headers: {
      //   Authorization: `Bearer ${idToken}`,
      // },
    });
    return response;
};

const SignIn = ({setUserId}) => {
    const navigate = useNavigate();
  
    useEffect(() => {
      const handleSignInAuthCallback = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
  
        if (code) {
          try {
            const response = await axios.post('https://register-customers.auth.us-east-1.amazoncognito.com/oauth2/token', 
              new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: '44netf2dipspddsebq3vmq8pmn',
                code: code,
                redirect_uri: 'http://localhost:3000/signin' // The redirect URI
              }), {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            });
  
            const { id_token, access_token, refresh_token } = response.data;
            // Store tokens in localStorage or sessionStorage
            localStorage.setItem('id_token', id_token);
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
  
            // Decode the ID token to get user information
            const decodedToken = jwtDecode(id_token);
            const userId = decodedToken.sub; // Assuming 'sub' is the user ID
  
            // Set user ID in state or pass it as prop to components
            setUserId(userId);
  
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
                // User not found, redirect or handle accordingly
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
          window.location.href = 'https://register-customers.auth.us-east-1.amazoncognito.com/signup?client_id=44netf2dipspddsebq3vmq8pmn&response_type=code&scope=aws.cognito.signin.user.admin+email+openid+profile&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fsignin';
    };
    return <div>Loading...</div>;

    // const isAuthenticated = localStorage.getItem('id_token') !== null;
  };
  export default SignIn;
  