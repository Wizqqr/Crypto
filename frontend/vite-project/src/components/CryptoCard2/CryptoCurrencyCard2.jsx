import React from 'react';
import './CryptoCurrencyCard2.css';

function CryptoCurrencyCard2({ currency }) {
  if (!currency) {
    return <p>Loading...</p>;
  }

  return (
    <div className="crypto-line-card">
      <img src={currency.logo} alt={`${currency.name} logo`} className="crypto-line-logo" />
      <span className="crypto-line-name">{currency.name}</span>
      <span className="crypto-line-symbol">{currency.symbol}</span>
      {currency.price && (
        <span className="crypto-line-price">${currency.price.toFixed(2)}</span>
      )}
      {currency.market_cap && (
        <span className="crypto-line-market-cap">
          Market Cap: ${currency.market_cap.toLocaleString()}
        </span>
      )}
      {currency.date_added && (
        <span className="crypto-line-date">
          Date Added: {new Date(currency.date_added).toLocaleDateString()}
        </span>
      )}
    </div>
  );
}

export default CryptoCurrencyCard2;
