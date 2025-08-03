import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

import Register from './pages/Register';     // Registration page
import Login from './pages/Login';           // Login page
import Dashboard from './pages/Dashboard';   // Protected user dashboard
import ProtectedRoute from './ProtectedRoute'; // Route wrapper to block unauth users

// Reusable Navbar component
function Navbar() {
  const isLoggedIn = !!localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gray-100 shadow">
      <div className="text-xl font-bold text-blue-700">📈 Stock Tracker</div>
      <div className="space-x-4">
        {!isLoggedIn ? (
          <>
            <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
            <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="text-green-700 hover:underline">Dashboard</Link>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:underline"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <Navbar /> {/* Reusable top nav */}

      <div className="p-4">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

