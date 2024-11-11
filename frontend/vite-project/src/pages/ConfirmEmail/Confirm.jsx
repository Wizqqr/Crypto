import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ConfirmEmail = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState({}); // Initialize errors

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/verify', { email, code });
    } catch (error) {
      if (error.response && error.response.data) {
        const backendErrors = error.response.data;
        const errorMessages = {};
        if (backendErrors.message.includes('Email')) {
          errorMessages.email = 'Email already exists';
        }
        if(backendErrors.message.includes('Code')) {
          errorMessages.code = 'Invalid or Expired code'
        }
        setErrors(errorMessages);
      } else {
        console.error('Error registering user:', error);
      }
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
        {errors.email && <p>{errors.email}</p>}
        <input
          type="text"
          placeholder="Confirmation Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        {errors.code && <p>{errors.code}</p>}
        <button type="submit">Confirm Email</button>
      </form>
    </div>
  );
};

export default ConfirmEmail;
