import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfirmEmail from '../ConfirmEmail/Confirm.jsx';
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
  const [showConfirmEmail, setShowConfirmEmail] = useState(false);
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
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
      if (avatarFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('image', avatarFile);

        const response = await axios.post('http://localhost:5000/upload', uploadFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        formData.avatarUrl = response.data.url;
      }

      await axios.post('http://localhost:5000/api/auth/register', formData);
      setShowConfirmEmail(true);
      setLoading(true)
    } catch (error) {
      if (error.response && error.response.data) {
        const backendErrors = error.response.data;

        const errorMessages = {};
        if (backendErrors.message.includes('Email')) {
          errorMessages.email = backendErrors.message;
        }
        if (backendErrors.message.includes('Password')) {
          errorMessages.password = backendErrors.message;
        }
        if (backendErrors.message.includes('Username')) {
          errorMessages.fullName = backendErrors.message;
        }

        setErrors(errorMessages);
        setLoading(false)
      } else {
        console.error('Error registering user:', error);
      }
    }
  };

  return (
    <div>
      {!showConfirmEmail ? (
        <>
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
            <div>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                onChange={handleInputChange}
                required
              />
              {errors.fullName && <p className="error-text">{errors.fullName}</p>}
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleInputChange}
                required
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleInputChange}
                required
              />
              {errors.password && <p className="error-text">{errors.password}</p>}
            </div>
            <button type="submit" disabled={loading}>
                  {loading ? 'Sending...' : 'Register'}
            </button>         
          </form>
        </>
      ) : (
<ConfirmEmail errors={errors} />
      )}
    </div>
  );
};

export default Register;
