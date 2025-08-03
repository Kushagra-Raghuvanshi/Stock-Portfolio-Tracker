import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' }); // State for form input
  const [error, setError] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();              // Prevent default form submission
    setError('');

    try {
      await axios.post('http://localhost:5000/api/users/register', form);  // Send registration data
      alert('Registered successfully!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);                 // Show error if it exists
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-green-700">Register</h2>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {/* Username input */}
        <input
          placeholder="Username"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />

        {/* Email input */}
        <input
          placeholder="Email"
          type="email"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        {/* Password input */}
        <input
          placeholder="Password"
          type="password"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-6"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
