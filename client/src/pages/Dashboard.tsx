import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

import CreateAccountModal from '../components/accounts/CreateAccountModal';

interface User {
  username: string;
  email: string;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
  
      if (!token) {
        navigate('/login');
        return;
      }
  
      try {
        const response = await axios.get('http://localhost:4242/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (err) {
        toast.error('Failed to fetch user data');
        navigate('/login');
      }
    };
  
    fetchUser();
  }, [navigate]);  // Only `navigate` should be here

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const handleCreateAccount = () => {
    setIsModalOpen(true);
  };

  const handleViewAccounts = () => {
    navigate('/view-accounts');
  };

  if (!user) {
    return <div>Loading...</div>; // Show loading state while fetching user data
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
      <p className="text-xl mb-6">Welcome, {user.username}!</p>
      <div className="flex flex-col space-y-4 w-full max-w-xs">
        <button
          onClick={handleCreateAccount}
          className="w-full bg-white text-gray-900 font-bold py-2 px-4 rounded hover:bg-gray-300"
        >
          Create Account
        </button>
        <button
          onClick={handleViewAccounts}
          className="w-full bg-white text-gray-900 font-bold py-2 px-4 rounded hover:bg-gray-300"
        >
          View Accounts
        </button>
        <button
          onClick={handleLogout}
          className="w-full bg-white text-gray-900 font-bold py-2 px-4 rounded hover:bg-gray-300"
        >
          Logout
        </button>
      </div>
      <CreateAccountModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
