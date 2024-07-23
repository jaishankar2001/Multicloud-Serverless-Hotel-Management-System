import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import * as jose from 'jose';
import CryptoJS from 'crypto-js';


const USER_POOL_ID = 'us-east-1_uBDCBcAXG';
const REGION = 'us-east-1';
const CLIENT_ID = '44netf2dipspddsebq3vmq8pmn';


const getCognitoPublicKeys = async () => {
  const url = `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}/.well-known/jwks.json`;
  const response = await axios.get(url);
  return response.data.keys;
};


const validateToken = async () => {
    try {
        const encrypted_token = localStorage.getItem('encrypted_id_token');
        if(!encrypted_token){
            return false;
        }
        const secretKey = process.env.REACT_APP_SECRET_KEY;
        const token = (CryptoJS.AES.decrypt(encrypted_token, secretKey)).toString(CryptoJS.enc.Utf8);
        // console.log("Encrypted token", encrypted_token);
        // console.log("Decoded token", token);
        
      if (!token) {
        throw new Error('Token not found in localStorage');
      }
  
      const decodedToken = jwtDecode(token);
      const tokenParts = token.split('.');
      const header = JSON.parse(atob(tokenParts[0]));
      const keys = await getCognitoPublicKeys();
      const key = keys.find((key) => key.kid === header.kid);
  
      if (!key) {
        throw new Error('Public key not found');
      }
  
      const publicKey = await jose.importJWK(key, 'RS256');
  
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
