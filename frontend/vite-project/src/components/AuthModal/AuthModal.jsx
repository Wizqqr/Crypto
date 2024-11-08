import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Modal.module.scss';
import Register from '../../pages/Register/Register';
import Login from '../../pages/Login/Login';
import ConfirmEmail from '../../pages/ConfirmEmail/Confirm';
import axios from 'axios';

const AuthModal = ({ onClose, onLogin }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isResetCodeSent, setIsResetCodeSent] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage('Please enter a valid email');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage(response.data.message);
      setIsResetCodeSent(true);
    } catch (error) {
      setMessage('Error sending reset link');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetCode || !newPassword) {
      setMessage('Please enter both reset code and new password');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/reset-password', { email, resetCode, newPassword });
      setMessage(response.data.message);
      setIsResetCodeSent(false); 
    } catch (error) {
      setMessage('Error resetting password');
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'register':
        return <Register/>;
      case 'login':
        return <Login onLogin={onLogin} />;
      case 'forgot':
        return (
          <div>
            <h2>Forgot Password</h2>
            <p>Enter your email to reset your password</p>
            {!isResetCodeSent ? (
              <form onSubmit={handleForgotPassword}>
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            ) : (
              <div>
                <h2>Enter Reset Code</h2>
                <p>A reset code has been sent to your email. Please enter it below.</p>
                <form onSubmit={handleResetPassword}>
                  <input
                    type="text"
                    placeholder="Reset Code"
                    required
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button type="submit" disabled={loading}>
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </form>
              </div>
            )}
            {message && <p>{message}</p>}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>Закрыть</button>
        <div className={styles.tabHeader}>
          <button onClick={() => setActiveTab('login')} className={activeTab === 'login' ? styles.activeTab : ''}>
            Login
          </button>
          <button onClick={() => setActiveTab('register')} className={activeTab === 'register' ? styles.activeTab : ''}>
            Register
          </button>
          <button onClick={() => setActiveTab('forgot')} className={activeTab === 'forgot' ? styles.activeTab : ''}>
            Forgot Password
          </button>
        </div>
        <div className={styles.tabContent}>
          {renderTabContent()}
          <button className={styles.googleButton}>Continue with Google</button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
