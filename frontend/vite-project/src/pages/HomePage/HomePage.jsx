import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CryptoCurrencyCard from '../../components/CryptoCard/CryptoCurrencyCard';
import './HomePage.css';
import SidebarMenu from '../../components/Menu/Menu';

const HomePage = () => {
  const [currencies, setCurrencies] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 

  const fetchCurrencies = () => {
    axios.get('http://localhost:5000/api/cryptos/')
      .then(r => {
        const currenciesResponse = r.data;
        setCurrencies(currenciesResponse.data);
      })
      .catch(error => {
        console.error('Error fetching currencies:', error);
      });
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  return (
    <div className={`HomePage ${isMenuOpen ? 'menu-open' : ''}`}>
      <SidebarMenu onToggle={() => setIsMenuOpen(!isMenuOpen)} />
      <div className="crypto-list">
        {currencies.map(currency => (
          <Link to={`/crypto/${currency.id}`} key={currency.id}>
            <CryptoCurrencyCard currency={currency} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
