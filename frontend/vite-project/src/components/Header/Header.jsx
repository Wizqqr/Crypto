import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './Header.css';
import { fetchAuthMe } from '../../redux/slices/auth.js';
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import AuthModal from '../AuthModal/AuthModal.jsx';

const Header = ({ toggleMenu, isMenuVisible, isAuthenticated, username, handleLogout, handleLogin }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const userData = useSelector((state) => state.auth.data);
  const userAvatar = userData?.avatarUrl ? `http://localhost:5000${userData.avatarUrl}` : '/noavatar.png';
  const userName = userData?.fullName;

  const [isModalOpen, setModalOpen] = useState(false); 

  const handleOpenModal = () => setModalOpen(true); 
  const handleCloseModal = () => setModalOpen(false); 

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchAuthMe());
    }
  }, [dispatch, isAuthenticated]);

  const onLogout = () => {
    handleLogout();
    navigate('/login');
  };

  return (
    <header className={`header ${isMenuVisible ? '' : 'header-full'}`}>
      <button className="menu-toggle-button" onClick={toggleMenu}>
        {isMenuVisible ? 'Hide Menu' : 'Show Menu'}
      </button>
      <h1>My Crypto App</h1>
      <div className="auth-buttons">
        {isAuthenticated ? (
          <>
            <span>Welcome, {userName}!</span>
            <Avatar size={64} icon={<UserOutlined />} src={userAvatar} />
            <button onClick={onLogout}>Logout</button>
          </>
        ) : (
          <>
            <button className="applyButton" onClick={handleOpenModal}>
              Log In
            </button>
            {isModalOpen && <AuthModal onClose={handleCloseModal} onLogin={handleLogin} />}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
