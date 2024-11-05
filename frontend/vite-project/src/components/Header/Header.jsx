import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ toggleMenu, isMenuVisible, isAuthenticated, username, handleLogout }) => {
  const navigate = useNavigate();

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
            <span>Welcome, {username}!</span>
            <button onClick={onLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
