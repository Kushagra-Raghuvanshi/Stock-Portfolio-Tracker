import React from 'react';
import { Navigate } from 'react-router-dom';

// Reusable wrapper to protect any route
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token'); // Read JWT token from localStorage

  // If no token, redirect to /login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists, show the protected component
  return children;
}

export default ProtectedRoute;
