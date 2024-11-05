import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spin } from 'antd';
import axios from 'axios';
import './CryptoDetailPage.css';
import { Line } from 'react-chartjs-2';

const CryptoDetailPage = () => {
  const { id } = useParams();
  const [currencyData, setCurrencyData] = useState(null);
  const fetchCurrency = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/cryptos/${id}`); // Change this line
      setCurrencyData(response.data);
    } catch (error) {
      console.error('Error fetching currency data:', error);
    }
  };
  
  useEffect(() => {
    setCurrencyData(null);
    fetchCurrency();
  }, [id]);


  return (
    <div className="CryptoDetailPage">
      <div className="crypto-detail-content">
        {currencyData ? (
          <div>
            <h2>{currencyData.name} ({currencyData.symbol})</h2>
            <img src={currencyData.logo} alt={`${currencyData.name} logo`} />
            <p><strong>Description:</strong> {currencyData.description}</p>
            <p><strong>Market Cap:</strong> ${currencyData.market_cap.toLocaleString()}</p>
            <p><strong>Price:</strong> ${currencyData.price.toFixed(2)}</p>
            <p><strong>Volume (24h):</strong> ${currencyData.volume_24h.toLocaleString()}</p>
            <p><strong>Circulating Supply:</strong> {currencyData.circulating_supply.toLocaleString()}</p>
            <p><strong>Total Supply:</strong> {currencyData.total_supply.toLocaleString()}</p>
            <p><strong>Max Supply:</strong> {currencyData.max_supply ? currencyData.max_supply.toLocaleString() : 'N/A'}</p>
            <p><strong>CMC Rank:</strong> {currencyData.cmc_rank}</p>
            <p><strong>Last Updated:</strong> {new Date(currencyData.last_updated).toLocaleString()}</p>
          </div>
        ) : (
          <Spin size="large" />
        )}
      </div>
    </div>
  );
};

export default CryptoDetailPage;
