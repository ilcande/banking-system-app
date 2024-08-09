import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await axios.get('http://localhost:4242');
        setMessage(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMessage();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Welcome to the Banking System</h1>
      <p className="text-xl mb-8 text-center">{message || 'loading'}</p>

      <div className="flex flex-col space-y-4 w-full max-w-xs">
        <Link
          to="/login"
          className="bg-white hover:bg-gray-300 text-gray-900 font-bold py-2 px-4 rounded text-center"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-white hover:bg-gray-300 text-gray-900 font-bold py-2 px-4 rounded text-center"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Home;
