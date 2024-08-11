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

interface AccountOption {
  account_id: number;
  account_number: string;
}

const AccountDetails: React.FC = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const [account, setAccount] = useState<Account | null>(null);
  const [amount, setAmount] = useState<number | ''>('');
  const [targetAccountId, setTargetAccountId] = useState<number | ''>('');
  const [action, setAction] = useState<'deposit' | 'withdraw' | 'transfer' | ''>('');
  const [accountOptions, setAccountOptions] = useState<AccountOption[]>([]);
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
      } catch (error) {
        toast.error('Failed to fetch account details');
      }
    };

    const fetchAccountOptions = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('You must be logged in to fetch account options');
        return;
      }

      try {
        const response = await axios.get(
          'http://localhost:4242/accounts',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Exclude the current account from the list
        const options = response.data.filter((acc: AccountOption) => acc.account_id !== parseInt(accountId!, 10));
        setAccountOptions(options);
      } catch (error) {
        toast.error('Failed to fetch account options');
      }
    };

    fetchAccountDetails();
    fetchAccountOptions();
  }, [accountId]);

  const handleDeposit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You must be logged in to deposit');
      return;
    }
  
    try {
      await axios.post(
        `http://localhost:4242/transactions/deposit`,
        {
          accountId: parseInt(accountId!, 10),
          amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setAccount(prevAccount => {
        if (!prevAccount) return null;
  
        // Ensure amount is a number
        const depositAmount = typeof amount === 'number' ? amount : parseFloat(amount);
        if (isNaN(depositAmount)) {
          toast.error('Invalid amount');
          return prevAccount;
        }
  
        // Ensure balance is a number
        const currentBalance = typeof prevAccount.balance === 'number' ? prevAccount.balance : parseFloat(prevAccount.balance);
        if (isNaN(currentBalance)) {
          toast.error('Invalid balance');
          return prevAccount;
        }
  
        // Calculate new balance and format it
        const newBalance = (currentBalance + depositAmount).toFixed(2);
        return { ...prevAccount, balance: parseFloat(newBalance) };
      });

      setAmount('');
  
      toast.success('Deposit successful');
    } catch (error) {
      toast.error('Failed to deposit');
    }
  };
  
  const handleWithdraw = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You must be logged in to withdraw');
      return;
    }
  
    try {
      await axios.post(
        `http://localhost:4242/transactions/withdraw`,
        {
          accountId: parseInt(accountId!, 10),
          amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setAccount(prevAccount => {
        if (!prevAccount) return null;
  
        // Ensure amount is a number
        const withdrawAmount = typeof amount === 'number' ? amount : parseFloat(amount);
        if (isNaN(withdrawAmount)) {
          toast.error('Invalid amount');
          return prevAccount;
        }
  
        // Ensure balance is a number
        const currentBalance = typeof prevAccount.balance === 'number' ? prevAccount.balance : parseFloat(prevAccount.balance);
        if (isNaN(currentBalance)) {
          toast.error('Invalid balance');
          return prevAccount;
        }
  
        // Calculate new balance and format it
        const newBalance = (currentBalance - withdrawAmount).toFixed(2);
        return { ...prevAccount, balance: parseFloat(newBalance) };
      });

      setAmount('');
  
      toast.success('Withdrawal successful');
    } catch (error) {
      toast.error('Failed to withdraw');
    }
  };
  
  const handleTransfer = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You must be logged in to transfer');
      return;
    }
  
    try {
      await axios.post(
        `http://localhost:4242/transactions/transfer`,
        {
          fromAccountId: parseInt(accountId!, 10),
          toAccountId: targetAccountId,
          amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setAccount(prevAccount => {
        if (!prevAccount) return null;
  
        // Ensure amount is a number
        const transferAmount = typeof amount === 'number' ? amount : parseFloat(amount);
        if (isNaN(transferAmount)) {
          toast.error('Invalid amount');
          return prevAccount;
        }
  
        // Ensure balance is a number
        const currentBalance = typeof prevAccount.balance === 'number' ? prevAccount.balance : parseFloat(prevAccount.balance);
        if (isNaN(currentBalance)) {
          toast.error('Invalid balance');
          return prevAccount;
        }
  
        // Calculate new balance and format it
        const newBalance = (currentBalance - transferAmount).toFixed(2);
        return { ...prevAccount, balance: parseFloat(newBalance) };
      });

      setAmount('');
  
      toast.success('Transfer successful');
    } catch (error) {
      toast.error('Failed to transfer');
    }
  };

  if (!account) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Account Details</h1>
      
      <div className="flex justify-between items-center bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mb-4">
        <div className="text-sm">
          <p>{`${account.type} account nª ${account.account_number}`}</p>
        </div>
        <div className="text-lg font-bold">
          <p>{`${account.balance} ${account.currency}`}</p>
        </div>
      </div>

      <div className="flex flex-col space-y-4 w-full max-w-xs mb-4">
        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={() => setAction('deposit')}
            className="w-full bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400"
          >
            Deposit
          </button>
          <button
            onClick={() => setAction('withdraw')}
            className="w-full bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-500"
          >
            Withdraw
          </button>
          <button
            onClick={() => setAction('transfer')}
            className="w-full bg-gray-500 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-600"
          >
            Transfer
          </button>
        </div>

        {/* Action-Specific Inputs */}
        {action && (
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                placeholder="Amount"
                className="w-full p-2 rounded bg-gray-800 text-white"
              />
            </div>

            {action === 'transfer' && (
              <div className="flex justify-between">
                <select
                  value={targetAccountId}
                  onChange={(e) => setTargetAccountId(parseInt(e.target.value, 10) || '')}
                  className="w-full p-2 rounded bg-gray-800 text-white"
                >
                  <option value="">Select Target Account</option>
                  {accountOptions.map((acc) => (
                    <option key={acc.account_id} value={acc.account_id}>
                      {acc.account_number}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={action === 'deposit' ? handleDeposit : action === 'withdraw' ? handleWithdraw : handleTransfer}
              className="w-full bg-green-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-green-400"
            >
              {action.charAt(0).toUpperCase() + action.slice(1)}
            </button>
          </div>
        )}
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
        <button
          onClick={() => navigate(`/accounts/${accountId}/transactions`)}
          className="w-full bg-white text-gray-900 font-bold py-2 px-4 rounded hover:bg-gray-300"
        >
          View Transactions
        </button>
      </div>

      <div className="mt-4 text-gray-400 text-sm">
        <p className='p-6 text-center'>
          Select an action (Deposit, Withdraw, or Transfer) to proceed. Enter the amount and, if applicable, the target account ID. Click the respective button to perform the action.
        </p>
      </div>
    </div>
  );
};

export default AccountDetails;
