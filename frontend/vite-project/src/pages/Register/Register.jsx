import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    avatarUrl: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcQg-lr5__zRqY3mRg6erzAD9n4BGp3G8VfA&s');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const previewImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // If there's an avatar file, upload it first and get the URL
      if (avatarFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('image', avatarFile);
        
        const response = await axios.post('http://localhost:5000/upload', uploadFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        // Set the avatar URL in the form data
        formData.avatarUrl = response.data.url;
      }
  
      // Now submit the registration data, including the avatar URL if available
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert('Registration successful! Please check your email for the confirmation code.');
      navigate('/confirm');
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Registration failed. Please try again.');
    }
  };
  return (
    <div>
      <h2>Register</h2>
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
          name="fullName"
          placeholder="Full Name"
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleInputChange}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
