// Import React and necessary tools
import React, { useEffect, useRef, useState } from 'react';
// Import Chart.js core
import { Chart } from 'chart.js/auto';
// Axios for API calls
import axios from 'axios';

function StockChart({ symbol }) {
  const canvasRef = useRef(null); // To draw chart
  const chartInstanceRef = useRef(null); // To destroy old chart
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Show "Loading..." temporarily

  useEffect(() => {
    const fetchChart = async () => {
      setError('');
      setLoading(true);

      try {
        // Fetch chart data from backend
        const res = await axios.get(`http://localhost:5000/api/stocks/chart/${symbol}`);
        const { c: prices, t: timestamps } = res.data;

        // Handle missing or empty price data
        if (!prices || prices.length === 0) {
          setError('No chart data available.');
          setLoading(false);
          return;
        }

        // Convert timestamps to readable dates
        const labels = timestamps.map(ts => new Date(ts).toLocaleDateString());


        // If a previous chart exists, destroy it before drawing a new one
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }

        // Draw chart
        const ctx = canvasRef.current.getContext('2d');
        chartInstanceRef.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels,
            datasets: [{
              label: `${symbol} (5-day)`,
              data: prices,
              borderColor: 'blue',
              backgroundColor: 'rgba(0,0,255,0.1)',
              fill: true,
              tension: 0.3
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: false }
            },
            scales: {
              x: { title: { display: true, text: 'Date' } },
              y: { title: { display: true, text: 'Price ($)' } }
            }
          }
        });

        setLoading(false);
      } catch (err) {
        console.error(`Chart error for ${symbol}:`, err.message);
        setError('Error loading chart. Try again.');
        setLoading(false);
      }
    };

    fetchChart();

    // Cleanup chart on component unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [symbol]);

  return (
    <div style={{ maxWidth: '500px', marginTop: '20px' }}>
      {loading && <p>Loading chart...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!error && <canvas ref={canvasRef} />}
    </div>
  );
}

export default StockChart;
