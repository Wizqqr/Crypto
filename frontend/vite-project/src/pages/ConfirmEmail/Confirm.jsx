import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ConfirmEmail = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/verify', { email, code });
      alert('Email confirmed successfully! You can now log in.');
      navigate('/login');
    } catch (error) {
      console.error('Confirmation failed:', error);
      alert('Invalid or expired code.');
    }
  };

  return (
    <div>
      <h2>Confirm Email</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Confirmation Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button type="submit">Confirm Email</button>
      </form>
    </div>
  );
};

export default ConfirmEmail;
