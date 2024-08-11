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
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const navigate = useNavigate();

  const handleDownloadStatement = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:4242/transactions/accounts/${accountId}/statement/${month}/${year}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob',
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `statement_${accountId}_${month}_${year}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      toast.error('Failed to download statement');
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('You must be logged in to view transactions');
        return;
      }

      if (!accountId) {
        toast.error('Invalid account ID');
        return;
      }

      console.log('Fetching transactions for account:', accountId);

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
        {/* Statement Download Section */}
        <div className="flex flex-col gap-4 mt-6">
          <div className="flex justify-around">
            <div className="flex flex-col">
              <label className="block mb-2">Select Month:</label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="p-2 rounded bg-gray-700 text-white"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="block mb-2">Select Year:</label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="p-2 rounded bg-gray-700 text-white"
              >
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleDownloadStatement}
            className="bg-white text-gray-900 font-bold py-2 px-4 rounded hover:bg-gray-300"
          >
            Download Statement as PDF
          </button>
        </div>
      </div>
      
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
