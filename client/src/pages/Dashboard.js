// Import React hooks for state and lifecycle
import React, { useEffect, useState } from 'react';
// Import Axios for HTTP requests
import axios from 'axios';

import StockChart from '../components/StockChart';

function Dashboard() {
  // Get logged-in username and JWT token from localStorage
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');

  // State: list of user's stocks
  const [stocks, setStocks] = useState([]);
  // State: form inputs for adding a new stock
  const [form, setForm] = useState({ symbol: '', shares: '', purchasePrice: '' });
  // State: error message to show in UI
  const [error, setError] = useState('');
  // State: success message to show in UI
  const [success, setSuccess] = useState('');
  // State: live prices fetched from the backend API
  const [currentPrices, setCurrentPrices] = useState({});

  // On page load: fetch stocks and live prices
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setError(''); // Clear any previous errors

        // Request saved stocks from backend
        const res = await axios.get('http://localhost:5000/api/stocks', {
          headers: { Authorization: `Bearer ${token}` } // Auth header
        });

        const stockData = res.data;
        setStocks(stockData); // Set the list of stocks

        const prices = {};
        // Fetch live price for each stock
        for (let stock of stockData) {
          try {
            const priceRes = await axios.get(`http://localhost:5000/api/stocks/price/${stock.symbol}`);
            prices[stock.symbol] = priceRes.data.currentPrice;
          } catch (err) {
            // Catch per-symbol errors without crashing everything
            console.error(`Price fetch failed for ${stock.symbol}:`, err.message);
            setError(prev => prev + ` | Failed to get price for ${stock.symbol}`);
          }
        }

        // Save all prices in state
        setCurrentPrices(prices);
      } catch (err) {
        // Backend unavailable or token invalid
        console.error('Stock fetch error:', err.message);
        setError('Could not load stocks. Is the backend running?');
      }
    };

    fetchStocks(); // Run the function
  }, [token]); // Only re-run if token changes

  // Handle form submission to add a new stock
  const handleAddStock = async (e) => {
    e.preventDefault(); // Prevent page reload
    setError('');
    setSuccess('');

    try {
      // Send POST request to backend to save new stock
      const res = await axios.post('http://localhost:5000/api/stocks', form, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const newStock = res.data;

      // Add new stock to the current list
      setStocks(prev => [...prev, newStock]);

      // Clear the form inputs
      setForm({ symbol: '', shares: '', purchasePrice: '' });

      // Show success message
      setSuccess(`Stock ${newStock.symbol} added successfully.`);

      // Immediately fetch live price for the new stock
      const priceRes = await axios.get(`http://localhost:5000/api/stocks/price/${newStock.symbol}`);
      setCurrentPrices(prev => ({
        ...prev,
        [newStock.symbol]: priceRes.data.currentPrice
      }));

    } catch (err) {
      console.error('Add stock failed:', err.message);
      setError('Failed to add stock. Check input or server connection.');
    }
  };

  // Handle stock deletion
  const handleDelete = async (id) => {
    setError('');
    setSuccess('');

    try {
      // Send DELETE request to backend
      await axios.delete(`http://localhost:5000/api/stocks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Remove the deleted stock from the state
      setStocks(prev => prev.filter(s => s._id !== id));
      setSuccess('Stock deleted.');
    } catch (err) {
      console.error('Delete failed:', err.message);
      setError('Failed to delete stock. Try again.');
    }
  };

//   // Handle logout: clear storage and redirect to login
//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('username');
//     window.location.href = '/login';
//   };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Welcome, {username}!</h2>
        {/* <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button> */}
      </div>

      {/* Add Stock Form */}
      <div className="bg-white shadow-md p-4 rounded mb-6">
        <h3 className="text-xl font-semibold mb-4">Add Stock</h3>
        <form onSubmit={handleAddStock} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <input
            placeholder="Symbol (e.g., AAPL)"
            className="border p-2 rounded flex-1"
            value={form.symbol}
            onChange={e => setForm({ ...form, symbol: e.target.value })}
            required
          />
          <input
            placeholder="Shares"
            type="number"
            className="border p-2 rounded w-32"
            value={form.shares}
            onChange={e => setForm({ ...form, shares: e.target.value })}
            required
          />
          <input
            placeholder="Purchase Price"
            type="number"
            className="border p-2 rounded w-40"
            value={form.purchasePrice}
            onChange={e => setForm({ ...form, purchasePrice: e.target.value })}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </form>
        {/* Show error/success messages */}
        {error && <p className="text-red-600 mt-3">{error}</p>}
        {success && <p className="text-green-600 mt-3">{success}</p>}
      </div>

      {/* User's stock list */}
      <div>
        <h3 className="text-xl font-semibold mb-3">Your Stocks</h3>
        {stocks.length === 0 ? (
          <p className="text-gray-600">No stocks added yet.</p>
        ) : (
          <ul className="space-y-6">
            {stocks.map(stock => {
              const gainLoss = currentPrices[stock.symbol]
                ? ((currentPrices[stock.symbol] - stock.purchasePrice) * stock.shares).toFixed(2)
                : null;
              const isProfit = parseFloat(gainLoss) >= 0;

              return (
                <li key={stock._id} className="bg-white p-4 rounded shadow">
                  <div className="font-semibold text-lg">
                    {stock.symbol} — {stock.shares} shares @ ${stock.purchasePrice}
                  </div>

                  {currentPrices[stock.symbol] && (
                    <div className="mt-1">
                      Current: ${currentPrices[stock.symbol].toFixed(2)}, Gain/Loss:{' '}
                      <span className={isProfit ? 'text-green-600' : 'text-red-600'}>
                        ${gainLoss}
                      </span>
                    </div>
                  )}

                  {/* Chart Component */}
                  <div className="mt-3">
                    <StockChart symbol={stock.symbol} />
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(stock._id)}
                    className="mt-3 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
