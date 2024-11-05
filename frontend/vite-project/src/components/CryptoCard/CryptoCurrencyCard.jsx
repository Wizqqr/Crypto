import { Card } from 'antd';
import './CryptoCurrencyCard.css';

function CryptoCurrencyCard({ currency }) {
  if (!currency) {
    return <p>Loading...</p>;
  }

  return (
    <Card
      title={
        <div className="crypto-card-title">
          <img src={currency.logo} alt={`${currency.name} logo`} className="crypto-logo" />
          <span className="crypto-name">{currency.name}</span>
        </div>
      }
      className="crypto-card"
    >
      <p className="crypto-info"><strong>Symbol:</strong> {currency.symbol}</p>
      {currency.description && <p className="crypto-description">{currency.description}</p>}
      {currency.date_added && (
        <p className="crypto-info">
          <strong>Date Added:</strong> {new Date(currency.date_added).toLocaleDateString()}
        </p>
      )}
      {currency.market_cap && (
        <p className="crypto-info"><strong>Market Cap:</strong> ${currency.market_cap.toLocaleString()}</p>
      )}
      {currency.price && (
        <p className="crypto-info"><strong>Price:</strong> ${currency.price.toFixed(2)}</p>
      )}
    </Card>
  );
}

export default CryptoCurrencyCard;
