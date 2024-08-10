import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import CreateAccountModal from './CreateAccountModal';

interface Account {
  account_id: number;
  account_number: string;
  type: string;
  balance: number;
  currency: string;
}

const Accounts: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [accountToEdit, setAccountToEdit] = useState<Account | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('You must be logged in to view accounts');
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:4242/accounts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAccounts(response.data);
      } catch (error) {
        toast.error('Failed to fetch accounts');
      }
    };

    fetchAccounts();
  }, [navigate]);

  const handleDelete = async (accountId: string) => {
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('You must be logged in to delete an account');
      return;
    }

    try {
      await axios.delete(`http://localhost:4242/accounts/${accountId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Account deleted successfully');
      setAccounts(accounts.filter((account) => account.account_id !== parseInt(accountId)));
    } catch (error) {
      toast.error('Failed to delete account');
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleEdit = (account: Account) => {
    setAccountToEdit(account);
    setIsModalOpen(true);
  };

  if (accounts.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-4">Your Accounts</h1>
      <div className="flex flex-col space-y-4 w-full max-w-xs">
        {accounts.map((account) => (
          <div key={account.account_id} className="flex items-center space-x-2">
            <button
              onClick={() => handleEdit(account)}
              className="text-white hover:text-gray-300"
            >
              <FontAwesomeIcon icon={faEdit} className="text-lg" />
            </button>
            <button
              onClick={() => navigate(`/accounts/${account.account_id}`)}
              className="w-full bg-white text-gray-900 font-bold py-2 px-4 rounded border border-gray-300 hover:bg-gray-100"
            >
              {account.account_number}
            </button>
            <button
              onClick={() => handleDelete(account.account_id.toString())}
              className="text-white hover:text-gray-300"
            >
              <FontAwesomeIcon icon={faTrashAlt} className="text-lg" />
            </button>
          </div>
        ))}
        <button
          onClick={handleBackToDashboard}
          className="w-full bg-white text-gray-900 font-bold py-2 px-4 rounded border border-gray-300 hover:bg-gray-100 mt-4"
        >
          Back to Dashboard
        </button>
      </div>
      {isModalOpen && (
        <CreateAccountModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          isEditing={true}
          accountToEdit={accountToEdit!}
        />
      )}
    </div>
  );
};

export default Accounts;
