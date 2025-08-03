import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' }); // Login form state
  const [error, setError] = useState('');
  const navigate = useNavigate();   // React Router navigation

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/users/login', form);
      const { token, username } = res.data;

      // Set token and username
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);

      // Wait a moment before navigating
      setTimeout(() => {
        navigate('/dashboard');
      }, 100); // small delay to ensure storage is saved
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg); // Display error message
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Login</h2>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {/* Email input */}
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        {/* Password input */}
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-6"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
