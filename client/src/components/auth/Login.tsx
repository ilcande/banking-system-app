import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4242/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      toast.success('Login successful!'); // Show success toast message
      navigate('/dashboard'); // Redirect to dashboard
    } catch (err) {
      toast.error('Invalid credentials'); // Show error toast
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4">
      <h2 className="text-3xl font-bold mb-6">Login</h2>

      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
        {error && <p className="text-red-500 text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-white hover:bg-gray-300 text-gray-900 font-bold py-2 px-4 rounded"
        >
          Login
        </button>
      </form>

      <p className="mt-4 text-center">
        Don't have an account?{' '}
        <Link to="/signup" className="text-white underline hover:text-gray-300">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;
