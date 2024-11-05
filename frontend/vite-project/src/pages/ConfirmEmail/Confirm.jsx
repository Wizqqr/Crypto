import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Confirm.css';

const ConfirmEmail = () => {
  const [confirmationCode, setConfirmationCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const code = queryParams.get('confirmation_code'); // Get confirmation code from URL

  const handleConfirm = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`http://127.0.0.1:8000/confirm-email/${code}/`, { confirmation_code: confirmationCode });

      if (response.status === 200) {
        setMessage('Ваш email успешно подтвержден! Теперь вы можете войти в систему.');
        setError('');
        setTimeout(() => navigate('/login'), 3000); // Redirect to login after 3 seconds
      }
    } catch (error) {
      setError('Ошибка: ' + (error.response?.data?.error || error.message));
      setMessage('');
    }
  };

  return (
    <div className="confirm-email-container">
      <h2>Подтверждение Email</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleConfirm}>
        <input
          type="text"
          placeholder="Введите код подтверждения"
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.target.value)}
          required
        />
        <button type="submit">Подтвердить</button>
      </form>
    </div>
  );
};

export default ConfirmEmail;
