import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('API Endpoint URL:', process.env.REACT_APP_API_ENTRYPOINT_URL);
    try {
      await axios.post('http://localhost:4242/api/auth/register', {
        username,
        email,
        password,
      });
      toast.success('Registration successful! Please log in.'); // Show success toast message
      navigate('/login'); // Redirect to login page after successful registration
    } catch (err) {
      toast.error('Failed to create account'); // Show error toast message
      setError('Failed to create account');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4">
      <h2 className="text-3xl font-bold mb-6">Sign Up</h2>
      
      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-white hover:bg-gray-300 text-gray-900 font-bold py-2 px-4 rounded"
        >
          Sign Up
        </button>
      </form>

      <p className="mt-4 text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-white underline hover:text-gray-300">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Signup;
