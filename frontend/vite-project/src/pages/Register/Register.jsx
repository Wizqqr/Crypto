import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcQg-lr5__zRqY3mRg6erzAD9n4BGp3G8VfA&s');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const previewImage = (event) => {
    const file = event.target.files[0];
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('avatar', avatar);
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/register/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status === 201) { 
        setMessage('Регистрация прошла успешно! Пожалуйста, проверьте свою почту для подтверждения аккаунта.');
        setError('');
        
        // Assuming the API sends back the confirmation code
        const confirmationCode = response.data.confirmation_code; 
        navigate(`/confirm?code=${confirmationCode}`); // Navigate to confirm page with code
      } else {
        setError('Ошибка при регистрации');
      }
    } catch (error) {
      setError('Ошибка: ' + (error.response?.data?.message || error.message));
    }
  };
  
  return (
    <div className="register-container">
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="avatar-container">
          <img
            src={avatarPreview}
            alt="Avatar Preview"
            className="avatar-img"
            onClick={() => document.getElementById('avatarInput').click()}
          />
          <input
            type="file"
            id="avatarInput"
            style={{ display: 'none' }}
            accept="image/*"
            onChange={previewImage}
          />
        </div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
