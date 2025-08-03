const mongoose = require('mongoose');

// Define the stock schema
const stockSchema = new mongoose.Schema({
  userId: {                         // Which user owns this stock
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  symbol: {                         // Ticker symbol (e.g., AAPL, TSLA)
    type: String,
    required: true,
    uppercase: true,
  },
  shares: {                         // Number of shares owned
    type: Number,
    required: true,
    min: 0,
  },
  purchasePrice: {                 // Price per share when purchased
    type: Number,
    required: true,
    min: 0,
  },
}, { timestamps: true });          // Adds createdAt and updatedAt

module.exports = mongoose.model('Stock', stockSchema);
