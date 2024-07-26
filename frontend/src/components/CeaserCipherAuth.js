import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/CeaserCipherAuth.css';
import axios from 'axios';
/**
 * Method to perform the ceaser cipher authentication by generating random 4 character cipher for the user to decrypt using the Key displayed on the screen
 * Moreover, calls the lambda function to verify the answer and also, records the login timestamp upon suceessful execution. 
 */
const CaesarCipherAuth = ({ userId }) => {
    const [input, setInput] = useState('');
    const [cipherText, setCipherText] = useState('');
    const [key, setKey] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Generates random cipher text for user to perform ceaser cipher
        const generateRandomText = () => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let text = '';
            for (let i = 0; i < 4; i++) {
                text += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return text;
        };
        //  Generate random key and display to user
        const generateRandomKey = () => {
            return Math.floor(Math.random() * 5) + 1;
        };

        const text = generateRandomText();
        const k = generateRandomKey();
        setCipherText(caesarEncrypt(text, k));
        setKey(k);

    }, []);

    const caesarEncrypt = (plainText, shift) => {
        return plainText.replace(/[a-zA-Z]/g, (char) => {
            const base = char <= 'Z' ? 65 : 97;
            return String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base);
        });
    };
    // Handling the submission of the function when a user completes the cipher decryption
    const handleSubmit = async (e) => {
        e.preventDefault();
        //  Call to lambda function to verify the result and return appropriate response 
        const response = await fetch('https://wc3bu5tvwffezdaayd4l46mi4q0rokmk.lambda-url.us-east-1.on.aws/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input, cipherText, key, userId })
        });
        const result = await response.json();
        // If the ceaser cipher decryption is successful the record the login timestamp
        if(result.success) {
            //  Call to lambda function to store timestamp
            const timestamp_response = await axios.post('https://lhtv6qq4lswfsjuykromqdwsme0xatrx.lambda-url.us-east-1.on.aws/', {
                userId
            });
            // Navigate user based on the userRole they signed in
            if (result.userRole === 'RegisteredUser') {
                navigate('/'); 
            } else if (result.userRole === 'PropertyAgent') {
                navigate('/admin_dashboard');
            } else {
                alert('User Role not recognized!');
            }
        } else {
            alert('Incorrect Decryption!');
        }
    };

    return (
        <div className="form-container">
            <form id="authVerify" onSubmit={handleSubmit}>
                <h4><span style={{ color: 'red' }}>Human Verification</span></h4>
                <h3>Decrypt the following text using the key provided</h3>
                <h5>[Hint: If key=2 then A+2=C]</h5>
                <p>Cipher Text:<span style={{ color: 'red' }}>{cipherText}</span></p>
                <p>Key: {key}</p>
                <label>
                    Decrypted Text:
                    <input type="text" id="decryptText" value={input} onChange={(e) => setInput(e.target.value)} />
                </label>
                <button type="submit" id="verify">Verify</button>
            </form>
        </div>
    );
};

export default CaesarCipherAuth;
