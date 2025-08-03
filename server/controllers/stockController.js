// Import the Stock model
const Stock = require('../models/Stock');

// ==========================
// Add a new stock
// POST /api/stocks
// ==========================
exports.addStock = async (req, res) => {
  const { symbol, shares, purchasePrice } = req.body;

  try {
    // Create a new stock for the authenticated user
    const stock = await Stock.create({
      userId: req.user.id, // req.user is set by authMiddleware
      symbol,
      shares,
      purchasePrice,
    });

    res.status(201).json(stock); // Send back the saved stock
  } catch (err) {
    console.error('Add stock failed:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// ==========================
// Get all stocks for user
// GET /api/stocks
// ==========================
exports.getStocks = async (req, res) => {
  try {
    // Find all stocks that belong to the logged-in user
    const stocks = await Stock.find({ userId: req.user.id });
    res.json(stocks);
  } catch (err) {
    console.error('Fetch stocks failed:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// ==========================
// Delete a stock
// DELETE /api/stocks/:id
// ==========================
exports.deleteStock = async (req, res) => {
  try {
    // Find and delete the stock only if it belongs to the user
    await Stock.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Stock deleted' });
  } catch (err) {
    console.error('Delete stock failed:', err.message);
    res.status(500).json({ error: err.message });
  }
};
