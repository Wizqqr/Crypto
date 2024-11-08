import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CryptoCurrencyCard from '../../components/CryptoCard/CryptoCurrencyCard';
import './HomePage.css';
import CryptoCurrencyCard2 from '../../components/CryptoCard2/CryptoCurrencyCard2';
const HomePage = () => {
  const [currencies, setCurrencies] = useState([]);
  const [expensiveCurrencies, setExpensiveCurrencies] = useState([]);
  const [cheapCurrencies, setCheapCurrencies] = useState([]);
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

  const fetchMostExpensiveCurrencies = () => {
    axios.get('http://localhost:5000/api/cryptos/mostexpensive')
      .then(r => {
        const currenciesResponse = r.data;
        setExpensiveCurrencies(currenciesResponse.data);
      })
      .catch(error => {
        console.error('Error fetching most expensive currencies:', error);
      });
  };

  const fetchMostCheapestCurrencies = () => {
    axios.get('http://localhost:5000/api/cryptos/mostcheapest')
    .then(r => {
      const currenciesResponse = r.data;
      setCheapCurrencies(currenciesResponse.data)
    })
    .catch(error => {
      console.erorr(`Error fetching cheapest currencies:`, error)
    }) 
  }

  useEffect(() => {
    fetchCurrencies();
    fetchMostExpensiveCurrencies();
    fetchMostCheapestCurrencies();
  }, []);

  return (
    <div className={`HomePage ${isMenuOpen ? 'menu-open' : ''}`}>
      <div className='grid'>
      <div className='cryptos'>
      <section className="expensive-cryptos">
        {expensiveCurrencies.length > 0 ? (
          expensiveCurrencies.map((currency) => (
            <CryptoCurrencyCard2 key={currency.id} currency={currency} />
          ))
        ) : (
          <p>Loading most expensive cryptocurrencies...</p>
        )}
      </section>

      <section className="cheap-cryptos">
        {cheapCurrencies.length > 0 ? (
          cheapCurrencies.map((currency) => (
            <CryptoCurrencyCard2 key={currency.id} currency={currency} />
          ))
        ) : (
          <p>Loading most expensive cryptocurrencies...</p>
        )}
      </section>
      </div>
      <section className="crypto-list">
        {currencies.length > 0 ? (
          currencies.map((currency) => (
            <Link to={`/crypto/${currency.id}`} key={currency.id}>
              <CryptoCurrencyCard currency={currency} />
            </Link>
          ))
        ) : (
          <p>Loading cryptocurrencies...</p>
        )}
      </section>
    </div>
    </div>
  );
};

export default HomePage;
