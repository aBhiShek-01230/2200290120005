const axios = require('axios');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 });  

const BASE_URL = 'http://20.244.56.144/evaluation-service';
const AUTH_URL = 'http://20.244.56.144/evaluation-service/auth'; 

const CLIENT_ID = "c390aa96-7da1-4144-a7bf-e66c4e10df46";
const CLIENT_SECRET = "KFZafQdUGwyPVRpG";
const CLIENT_EMAIL = "abhishek.2226cs1080@kiet.edu";
const ROLL_NO = "2200290120005";
const ACCESS_CODE = "SxVeja";
const NAME = "Abhishek kumar Anand";


async function getAccessToken() {
    try {
        
        const response = await axios.post(AUTH_URL, {
    "email": "abhishek.2226cs1080@kiet.edu",
    "name": "abhishek@gmail.com",
    "rollNo": "2200290120005",
    "accessCode": "SxVeja",
    "clientID": "c390aa96-7da1-4144-a7bf-e66c4e10df46",
    "clientSecret": "KFZafQdUGwyPVRpG"
}
);

        console.log('Token received:', response.data);

        if (!response.data.access_token) {
            throw new Error('Token not found in response');
        }

        return response.data.access_token;  
    } catch (error) {
        console.error('Error fetching access token:', error.response?.data || error.message);
        throw new Error('Failed to fetch access token');
    }
}

async function fetchStockPrices(ticker, minutes) {
    const cacheKey = `stock-${ticker}-${minutes}`;
    if (cache.has(cacheKey)) return cache.get(cacheKey);

    try {
        const token = await getAccessToken();  
        console.log('Using token:', token); 

        const url = `${BASE_URL}/stocks/${ticker}?minutes=${minutes}`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

      
        console.log('Stock data received:', response.data);

        cache.set(cacheKey, response.data);
        return response.data;
    } catch (err) {
        console.error(`Error fetching stock prices for ${ticker}:`, err.response?.data || err.message);
        throw new Error('Failed to fetch stock data');
    }
}

module.exports = { fetchStockPrices };
