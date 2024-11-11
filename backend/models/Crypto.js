import mongoose from 'mongoose';

const cryptoSchema = new mongoose.Schema({
    id: { type: Number, unique: true, required: true },
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    slug: { type: String, default: null },
    logo: { type: String, default: null },
    description: { type: String, default: null },
    date_added: { type: Date, default: null },
    tags: { type: [String], default: [] },
    max_supply: { type: Number, default: null },
    circulating_supply: { type: Number, default: null },
    total_supply: { type: Number, default: null },
    cmc_rank: { type: Number, default: null },
    last_updated: { type: Date, default: null },
    price: { type: Number, default: null },
    volume_24h: { type: Number, default: null },
    volume_change_24h: { type: Number, default: null },
    market_cap: { type: Number, default: null },
    market_cap_dominance: { type: Number, default: null },
    fully_diluted_market_cap: { type: Number, default: null },
    percent_change_1h: { type: Number, default: null },
    percent_change_24h: { type: Number, default: null },
    percent_change_7d: { type: Number, default: null },
    percent_change_30d: { type: Number, default: null },
    percent_change_60d: { type: Number, default: null },
    percent_change_90d: { type: Number, default: null },
    data_last_fetched: { type: Date, default: null },
    lastUpdated: { type: Date, default: Date.now }

});

const Crypto = mongoose.model('Crypto', cryptoSchema);
export default Crypto;
