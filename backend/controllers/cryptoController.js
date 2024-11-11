import Crypto from '../models/Crypto.js';
import axios from 'axios';
import mongoose from 'mongoose';

export const getAllCryptos = async (req, res) => {
    try {
        let cryptocurrencies = await Crypto.find();

        const needsUpdate = !cryptocurrencies.length || 
        (Date.now() - new Date(cryptocurrencies[0].lastUpdated).getTime()) > 1 * 60 * 1000; // 24 hours



        if (needsUpdate) {
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
                percent_change_90d: crypto.quote.USD.percent_change_90d,
                lastUpdated: new Date() 
            }));

            await Crypto.deleteMany({});
            await Crypto.insertMany(cryptocurrencies);
            console.log("Data updated and saved to the database.");
        } else {
            console.log("Using cached data from the database.");
        }

        res.json({ data: cryptocurrencies });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching cryptocurrencies' });
    }
};

export const getCryptoById = async (req, res) => {
    const { id } = req.params;
    try {
        let cryptocurrency = await Crypto.findOne({ id });

        if (!cryptocurrency || (Date.now() - new Date(cryptocurrency.lastUpdated).getTime()) > 24 * 60 * 60 * 1000) {
            console.log("Fetching cryptocurrency from API...");
            const apiKey = process.env.COINMARKETCAP_API_KEY;
            const response = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=${id}`, {
                headers: { 'X-CMC_PRO_API_KEY': apiKey }
            });
            const apiData = response.data.data[id];
        
            if (apiData) {
                const cryptoData = {
                    id: apiData.id,
                    name: apiData.name,
                    symbol: apiData.symbol,
                    slug: apiData.slug,
                    logo: `https://s2.coinmarketcap.com/static/img/coins/64x64/${apiData.id}.png`,
                    description: apiData.description || '',
                    date_added: apiData.date_added,
                    tags: apiData.tags,
                    max_supply: apiData.max_supply || null,
                    circulating_supply: apiData.circulating_supply,
                    total_supply: apiData.total_supply,
                    cmc_rank: apiData.cmc_rank,
                    last_updated: apiData.quote.USD.last_updated,
                    price: apiData.quote.USD.price,
                    volume_24h: apiData.quote.USD.volume_24h,
                    volume_change_24h: apiData.quote.USD.volume_change_24h,
                    market_cap: apiData.quote.USD.market_cap,
                    market_cap_dominance: apiData.quote.USD.market_cap_dominance,
                    fully_diluted_market_cap: apiData.quote.USD.fully_diluted_market_cap,
                    percent_change_1h: apiData.quote.USD.percent_change_1h,
                    percent_change_24h: apiData.quote.USD.percent_change_24h,
                    percent_change_7d: apiData.quote.USD.percent_change_7d,
                    percent_change_30d: apiData.quote.USD.percent_change_30d,
                    percent_change_60d: apiData.quote.USD.percent_change_60d,
                    percent_change_90d: apiData.quote.USD.percent_change_90d,
                    lastUpdated: new Date() 
                };

                await Crypto.findOneAndUpdate({ id: cryptoData.id }, cryptoData, { upsert: true });
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
export const getMostExpensiveCryptos = async (req, res) => {
    try {
        const expensiveCryptos = await Crypto.find().sort({ price: -1 }).limit(5);
        res.json({ data: expensiveCryptos });
    } catch (error) {
        console.error('Error fetching most expensive cryptocurrencies:', error);
        res.status(500).json({ message: 'Error fetching cryptocurrencies' });
    }
};

export const getCheapestCryptos = async (req, res) => {
    try {
        const cheapestCryptos = await Crypto.find().sort({ price: 1 }).limit(5);
        res.json({ data: cheapestCryptos });
    } catch (error) {
        console.error('Error fetching cheapest cryptocurrencies:', error);
        res.status(500).json({ message: 'Error fetching cryptocurrencies' });
    }
};

