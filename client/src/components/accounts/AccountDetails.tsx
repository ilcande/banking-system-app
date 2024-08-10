import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface Account {
  account_number: string;
  type: string;
  balance: number;
  currency: string;
}

const AccountDetails: React.FC = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const [account, setAccount] = useState<Account | null>(null);
  // const [transactions, setTransactions] = useState<any[]>([]); Placeholder for transactions - TODO: Implement transactions endpoint
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccountDetails = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('You must be logged in to view account details');
        return;
      }

      if (!accountId) {
        toast.error('Invalid account ID');
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:4242/accounts/${accountId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAccount(response.data);
        // setTransactions(); Fetch transactions if available TODO: Implement transactions endpoint
      } catch (error) {
        toast.error('Failed to fetch account details');
      }
    };

    fetchAccountDetails();
  }, [accountId]);

  if (!account) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Account Details</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mb-4">
        <p className="text-lg mb-2"><strong>Account Number:</strong> {account.account_number}</p>
        <p className="text-lg mb-2"><strong>Type:</strong> {account.type}</p>
        <p className="text-lg mb-2"><strong>Balance:</strong> {account.balance} {account.currency}</p>
        <h2 className="text-2xl font-bold mt-4">Transactions</h2>
        <p>Transactions will be displayed here</p>
      </div>
      <div className="flex flex-col space-y-4 w-full max-w-xs">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full bg-white text-gray-900 font-bold py-2 px-4 rounded hover:bg-gray-300"
        >
          Back to Dashboard
        </button>
        <button
          onClick={() => navigate('/view-accounts')}
          className="w-full bg-white text-gray-900 font-bold py-2 px-4 rounded hover:bg-gray-300"
        >
          View Accounts
        </button>
      </div>
    </div>
  );
};

export default AccountDetails;
