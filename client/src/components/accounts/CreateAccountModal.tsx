import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing?: boolean; // New prop to differentiate between creating and updating
  accountToEdit?: {
    account_id: number;
    account_number: string;
    type: string;
    balance: number;
    currency: string;
  }; // New prop to pass the account
}

const CreateAccountModal: React.FC<CreateAccountModalProps> = ({
  isOpen,
  onClose,
  isEditing = false,
  accountToEdit,
}) => {
  const [type, setType] = useState<'savings' | 'checking'>('savings');
  const [balance, setBalance] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditing && accountToEdit) {
      setType(accountToEdit.type as 'savings' | 'checking');
      setBalance(accountToEdit.balance);
    }
  }, [isEditing, accountToEdit]);

  const handleSave = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('You must be logged in to perform this action');
      return;
    }

    try {
      if (isEditing && accountToEdit) {
        await axios.patch(
          `http://localhost:4242/accounts/${accountToEdit.account_id}`,
          { type, balance },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        toast.success('Account updated successfully');
        navigate(`/accounts/${accountToEdit.account_id}`);
      } else {
        const response = await axios.post(
          'http://localhost:4242/accounts/new',
          { type, balance, currency: 'EUR' },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        toast.success('Account created successfully');
        navigate(`/accounts/${response.data.account.account_id}`);
      }
      onClose();
    } catch (error) {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} account`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={isEditing ? 'Update Account' : 'Create Account'}
      className="flex flex-col items-center justify-center bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w-md mx-auto relative top-1/2 transform -translate-y-1/2"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Update Account' : 'Create Account'}</h2>
      <label className="block text-lg mb-4">
        <span className="block text-white mb-1">Type:</span>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as 'savings' | 'checking')}
          className="bg-white text-gray-900 border border-gray-300 rounded py-2 px-4 w-full"
        >
          <option value="savings">Savings</option>
          <option value="checking">Checking</option>
        </select>
      </label>
      <label className="block text-lg mb-4">
        <span className="block text-white mb-1">Balance:</span>
        <input
          type="number"
          value={balance}
          onChange={(e) => setBalance(Number(e.target.value))}
          className="bg-white text-gray-900 border border-gray-300 rounded py-2 px-4 w-full"
        />
      </label>
      <button
        onClick={handleSave}
        className="w-full bg-white text-gray-900 font-bold py-2 px-4 rounded hover:bg-gray-300 mt-4"
      >
        {isEditing ? 'Update Account' : 'Create Account'}
      </button>
      <button
        onClick={onClose}
        className="w-full bg-white text-gray-900 font-bold py-2 px-4 rounded hover:bg-gray-300 mt-4"
      >
        Close
      </button>
    </Modal>
  );
};

export default CreateAccountModal;
