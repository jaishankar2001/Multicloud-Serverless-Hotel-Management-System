import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import * as jose from 'jose';
import CryptoJS from 'crypto-js';

// Cognito configurations
const USER_POOL_ID = 'us-east-1_uBDCBcAXG';
const REGION = 'us-east-1';
const CLIENT_ID = '44netf2dipspddsebq3vmq8pmn';


// Fetch the cognito provided public key for our user pool 
const getCognitoPublicKeys = async () => {
  const url = `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}/.well-known/jwks.json`;
  const response = await axios.get(url);
  return response.data.keys;
};

//  Verify whether the user is authenticated or not
const validateToken = async () => {
    try {
      // Get the encrypted token from the storage
        const encrypted_token = localStorage.getItem('encrypted_id_token');
        if(!encrypted_token){
            return false;
        }
        // Get the secret key fom the env file
        const secretKey = process.env.REACT_APP_SECRET_KEY;
        // Decrypt the tokens
        const token = (CryptoJS.AES.decrypt(encrypted_token, secretKey)).toString(CryptoJS.enc.Utf8);
        // Return error if token not found
      if (!token) {
        throw new Error('Token not found in localStorage');
      }
  
      // Breakdown the decoded token to fetch the required parts
      const decodedToken = jwtDecode(token);
      const tokenParts = token.split('.');
      const header = JSON.parse(atob(tokenParts[0]));
      const keys = await getCognitoPublicKeys();
      const key = keys.find((key) => key.kid === header.kid);
  
      if (!key) {
        throw new Error('Public key not found');
      }
  
      const publicKey = await jose.importJWK(key, 'RS256');
  
      // verifying the token of the current logged in user with that in the cognito
      const { payload } = await jose.jwtVerify(token, publicKey, {
        audience: CLIENT_ID,
        issuer: `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`,
      });
  
      const localUserId = localStorage.getItem('user_id');
      console.log("Local User ID: ",localUserId);
      console.log("Payload user id : ", payload.sub);
      if (payload.sub !== localUserId) {
        throw new Error('Token user_id does not match locally stored user_id');
      }
  
      return true;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  };

export default validateToken;
