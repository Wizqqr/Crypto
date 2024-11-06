import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './Header.css';
import { fetchAuthMe } from '../../redux/slices/auth.js'

const Header = ({ toggleMenu, isMenuVisible, isAuthenticated, username, handleLogout }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = useSelector((state) => state.auth.data);
  const userAvatar = userData?.avatarUrl ? `http://localhost:5000${userData.avatarUrl}` : '/noavatar.png';
  const userName = userData?.fullName

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
            <img src={userAvatar} alt="User Avatar" />
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
