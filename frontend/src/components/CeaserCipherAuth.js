import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/CeaserCipherAuth.css';

const CaesarCipherAuth = ({ userId }) => {
    const [input, setInput] = useState('');
    const [cipherText, setCipherText] = useState('');
    const [key, setKey] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const generateRandomText = () => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let text = '';
            for (let i = 0; i < 4; i++) {
                text += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return text;
        };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('https://wc3bu5tvwffezdaayd4l46mi4q0rokmk.lambda-url.us-east-1.on.aws/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input, cipherText, key, userId })
        });
        const result = await response.json();
        if(result.success) {
            if (result.userRole === 'RegisteredUser') {
                navigate('/'); 
            } else if (result.userRole === 'PropertyAgents') {
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
