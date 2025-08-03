// Import required modules
const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController'); // CRUD functions
const authMiddleware = require('../middleware/authMiddleware'); // JWT auth middleware
const axios = require('axios');

// ==========================
// Protected Routes (Require JWT)
// ==========================

// POST /api/stocks → Add a stock to the user's portfolio
router.post('/', authMiddleware, stockController.addStock);

// GET /api/stocks → Get all stocks for logged-in user
router.get('/', authMiddleware, stockController.getStocks);

// DELETE /api/stocks/:id → Delete a stock by its ID
router.delete('/:id', authMiddleware, stockController.deleteStock);

// ==========================
// Public Route (Live price)
// ==========================

// GET /api/stocks/price/:symbol → Fetch live price from Finnhub
router.get('/price/:symbol', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();

  try {
    // Call Finnhub quote endpoint
    const response = await axios.get('https://finnhub.io/api/v1/quote', {
      params: {
        symbol,
        token: process.env.FINNHUB_API_KEY,
      },
    });

    const currentPrice = response.data.c; // 'c' is the current price

    if (!currentPrice || currentPrice === 0) {
      return res.status(404).json({ error: `No price data found for ${symbol}` });
    }

    res.json({ symbol, currentPrice });
  } catch (err) {
    console.error(`Finnhub price fetch error for ${symbol}:`, err.message);
    res.status(500).json({ error: 'Failed to fetch price from Finnhub' });
  }
});

// // GET /api/stocks/price/:symbol → Fetch live price from Twelve Data
// router.get('/price/:symbol', async (req, res) => {
//   const symbol = req.params.symbol.toUpperCase();

//   try {
//     // Request real-time price from Twelve Data
//     const response = await axios.get('https://api.twelvedata.com/price', {
//       params: {
//         symbol,
//         apikey: process.env.TWELVE_DATA_API_KEY,
//       },
//     });

//     const currentPrice = parseFloat(response.data.price);

//     if (!currentPrice || isNaN(currentPrice)) {
//       return res.status(404).json({ error: `No price data found for ${symbol}` });
//     }

//     res.json({ symbol, currentPrice });
//   } catch (err) {
//     console.error(`Twelve Data price error for ${symbol}:`, err.message);
//     res.status(500).json({ error: 'Failed to fetch live price from Twelve Data' });
//   }
// });

// ==========================
// Past 5 day Chart
// ==========================

// FINNHUB NOT FREE
// router.get('/chart/:symbol', async (req, res) => {
//   const symbol = req.params.symbol.toUpperCase();
//   const now = Math.floor(Date.now() / 1000);
//   const fiveDaysAgo = now - 60 * 60 * 24 * 5;

//   console.log('Getting chart for:', symbol);
//   console.log('Date range:', fiveDaysAgo, 'to', now);
//   console.log('Using API key:', process.env.FINNHUB_API_KEY);

//   try {
//     const response = await axios.get('https://finnhub.io/api/v1/stock/candle', {
//       params: {
//         symbol,
//         resolution: 'D',
//         from: fiveDaysAgo,
//         to: now,
//         token: process.env.FINNHUB_API_KEY,
//       }
//     });

//     console.log('Finnhub raw response:', response.data);

//     if (response.data.s !== 'ok') {
//       return res.status(404).json({ error: 'No valid chart data returned from Finnhub.' });
//     }

//     res.json(response.data);
//   } catch (err) {
//     console.error('Axios/Finnhub error:', err.message);
//     res.status(500).json({ error: 'Failed to fetch chart data' });
//   }
// });

// Route to get chart data for a stock from Twelve Data
router.get('/chart/:symbol', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();

  try {
    // Request 5 days of daily data from Twelve Data
    const response = await axios.get('https://api.twelvedata.com/time_series', {
      params: {
        symbol: symbol,
        interval: '1day',
        outputsize: 5,
        apikey: process.env.TWELVE_DATA_API_KEY
      }
    });

    const { values, status } = response.data;

    // Check for errors
    if (status === 'error' || !values) {
      return res.status(404).json({ error: 'Chart data unavailable.' });
    }

    // Format data for frontend
    const prices = values.map(point => parseFloat(point.close)).reverse();
    const timestamps = values.map(point => point.datetime).reverse();

    res.json({
      c: prices,
      t: timestamps,
      s: 'ok'
    });
  } catch (err) {
    console.error('Twelve Data error:', err.message);
    res.status(500).json({ error: 'Failed to fetch chart data from Twelve Data' });
  }
});

module.exports = router;

