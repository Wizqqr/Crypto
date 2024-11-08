import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import CryptoDetailPage from './pages/CryptoDetailPage/CryptoDetailPage';
import SidebarMenu from './components/Menu/Menu';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import NotFound from './pages/NotFound/NotFound';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuthMe } from './redux/slices/auth';

const App = () => {
  const [isMenuVisible, setMenuVisible] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const dispatch = useDispatch();

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsAuthenticated(true);
      setUsername(localStorage.getItem('username'));
      dispatch(fetchAuthMe()); 
    }
  }, [dispatch]);

  const handleLogin = (username, token) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('username', username);
    setIsAuthenticated(true);
    setUsername(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setUsername('');
  };

  return (
    <Router>
      <div className={`App ${isMenuVisible ? 'menu-visible' : 'menu-hidden'}`}>
        <Header
          toggleMenu={toggleMenu}
          isMenuVisible={isMenuVisible}
          isAuthenticated={isAuthenticated}
          username={username}
          handleLogout={handleLogout}
          handleLogin={handleLogin}
        />  
        {isMenuVisible && (
          <div className="menu">
            <SidebarMenu />
          </div>
        )}
        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />

            {/* Crypto */}
            <Route path="/crypto/:id" element={<CryptoDetailPage />} />

            {/* NotFound */}
            <Route path='*' element={<NotFound/>}></Route>
            </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
