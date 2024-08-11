import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface Transaction {
  transaction_id: number;
  account_id: number;
  type: string;
  amount: number;
  date: string;
  target_account_id: number | null;
}

const Transactions: React.FC = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('You must be logged in to view transactions');
        return;
      }

      console.log('accountId:', accountId);

      if (!accountId) {
        toast.error('Invalid account ID');
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:4242/transactions/accounts/${accountId}/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTransactions(response.data);
      } catch (error) {
        toast.error('Failed to fetch transactions');
      }
    };

    fetchTransactions();
  }, [accountId]);

  if (!transactions.length) {
    return <div>No transactions found</div>;
  }

  return (
    <div className="flex flex-col items-center p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Transactions</h1>
      
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-3xl">
        {transactions.map(transaction => (
          <div key={transaction.transaction_id} className="mb-4 border-b border-gray-700 pb-2">
            <p><strong>Type:</strong> {transaction.type}</p>
            <p><strong>Amount:</strong> {transaction.amount}</p>
            <p><strong>Date:</strong> {new Date(transaction.date).toLocaleString()}</p>
            <p><strong>Target Account ID:</strong> {transaction.target_account_id || 'N/A'}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate(-1)}
        className="mt-6 w-full max-w-xs bg-white text-gray-900 font-bold py-2 px-4 rounded hover:bg-gray-300"
      >
        Back to Account Details
      </button>
    </div>
  );
};

export default Transactions;
