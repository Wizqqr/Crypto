// src/controllers/cryptoController.js
import Crypto from '../models/Crypto.js';
import axios from 'axios';

export const getAllCryptos = async (req, res) => {
    try {
        let cryptocurrencies = await Crypto.find();

        if (!cryptocurrencies.length) {
            console.log("Fetching data from API...");
            const apiKey = process.env.COINMARKETCAP_API_KEY;
            const response = await axios.get("https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest", {
                headers: { 'X-CMC_PRO_API_KEY': apiKey }
            });

            cryptocurrencies = response.data.data.map(crypto => ({
                id: crypto.id,
                name: crypto.name,
                symbol: crypto.symbol,
                slug: crypto.slug,
                logo: `https://s2.coinmarketcap.com/static/img/coins/64x64/${crypto.id}.png`,
                description: crypto.description || '',
                date_added: crypto.date_added,
                tags: crypto.tags,
                max_supply: crypto.max_supply || null,
                circulating_supply: crypto.circulating_supply,
                total_supply: crypto.total_supply,
                cmc_rank: crypto.cmc_rank,
                last_updated: crypto.quote.USD.last_updated,
                price: crypto.quote.USD.price,
                volume_24h: crypto.quote.USD.volume_24h,
                volume_change_24h: crypto.quote.USD.volume_change_24h,
                market_cap: crypto.quote.USD.market_cap,
                market_cap_dominance: crypto.quote.USD.market_cap_dominance,
                fully_diluted_market_cap: crypto.quote.USD.fully_diluted_market_cap,
                percent_change_1h: crypto.quote.USD.percent_change_1h,
                percent_change_24h: crypto.quote.USD.percent_change_24h,
                percent_change_7d: crypto.quote.USD.percent_change_7d,
                percent_change_30d: crypto.quote.USD.percent_change_30d,
                percent_change_60d: crypto.quote.USD.percent_change_60d,
                percent_change_90d: crypto.quote.USD.percent_change_90d
            }));

            await Crypto.insertMany(cryptocurrencies);
            console.log("Data saved to the database.");
        } else {
            console.log("Data retrieved from the database.");
        }

        res.json({ data: cryptocurrencies });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching cryptocurrencies' });
    }
};

// Fetch a single cryptocurrency by ID
export const getCryptoById = async (req, res) => {
    const { id } = req.params;
    try {
        let cryptocurrency = await Crypto.findOne({ id });

        if (!cryptocurrency) {
            console.log("Fetching cryptocurrency from API...");
            const apiKey = process.env.COINMARKETCAP_API_KEY;
            const response = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=${id}`, {
                headers: { 'X-CMC_PRO_API_KEY': apiKey }
            });
            cryptocurrency = response.data.data[id];

            if (cryptocurrency) {
                const cryptoData = {
                    id: cryptocurrency.id,
                    name: cryptocurrency.name,
                    symbol: cryptocurrency.symbol,
                    slug: cryptocurrency.slug,
                    logo: `https://s2.coinmarketcap.com/static/img/coins/64x64/${cryptocurrency.id}.png`,
                    description: cryptocurrency.description || '',
                    date_added: cryptocurrency.date_added,
                    tags: cryptocurrency.tags,
                    max_supply: cryptocurrency.max_supply || null,
                    circulating_supply: cryptocurrency.circulating_supply,
                    total_supply: cryptocurrency.total_supply,
                    cmc_rank: cryptocurrency.cmc_rank,
                    last_updated: cryptocurrency.quote.USD.last_updated,
                    price: cryptocurrency.quote.USD.price,
                    volume_24h: cryptocurrency.quote.USD.volume_24h,
                    volume_change_24h: cryptocurrency.quote.USD.volume_change_24h,
                    market_cap: cryptocurrency.quote.USD.market_cap,
                    market_cap_dominance: cryptocurrency.quote.USD.market_cap_dominance,
                    fully_diluted_market_cap: cryptocurrency.quote.USD.fully_diluted_market_cap,
                    percent_change_1h: cryptocurrency.quote.USD.percent_change_1h,
                    percent_change_24h: cryptocurrency.quote.USD.percent_change_24h,
                    percent_change_7d: cryptocurrency.quote.USD.percent_change_7d,
                    percent_change_30d: cryptocurrency.quote.USD.percent_change_30d,
                    percent_change_60d: cryptocurrency.quote.USD.percent_change_60d,
                    percent_change_90d: cryptocurrency.quote.USD.percent_change_90d
                };

                // Save the fetched cryptocurrency into the database
                await Crypto.create(cryptoData);
                return res.json(cryptoData);
            }

            return res.status(404).json({ message: 'Cryptocurrency not found' });
        }

        res.json(cryptocurrency);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching cryptocurrency' });
    }
};
