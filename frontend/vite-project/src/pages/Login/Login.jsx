import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import {isAuthSelector} from '../../redux/slices/auth.js'
import { Navigate } from 'react-router-dom'

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token } = response.data;
      setLoading(true)
      onLogin(email, token); 
      navigate('/');
    } catch (error) {
      if (error.response && error.response.data) {
        const backendErrors = error.response.data;
        const errorMessages = {};
        if (backendErrors.message.includes('User not found')) {
          errorMessages.email = 'User not found';
        }
        if (backendErrors.message.includes('Invalid password')) {
          errorMessages.password = 'Invalid password';
        }
        setLoading(false)
        setErrors(errorMessages);
      } else {
        setLoading(false)
        console.error('Login failed:', error);
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors({ ...errors, email: '' });
            }}
            required
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors({ ...errors, password: '' });
            }}
            required
          />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>
        <button type="submit" >
                  {loading ? 'Sending...' : 'Login'}
      </button>      
       </form>
    </div>
  );
};


export default Login