// controllers/transactionController.ts

import { Request, Response } from 'express';
import { deposit, withdraw, transfer } from '../services/transactionServices';
import { fetchTransactionsByAccountId } from '../models/transactionModel';

export async function depositController(req: Request, res: Response): Promise<void> {
  try {
    const { accountId, amount } = req.body;

    // Call the deposit service
    const transaction = await deposit(accountId, amount);

    res.status(200).json({ message: 'Deposit successful', transaction });
  } catch (error: any) {
    console.error('Deposit error:', error);
    res.status(500).json({ message: 'Failed to deposit', error: error.message });
  }
}

export async function withdrawController(req: Request, res: Response): Promise<void> {
  try {
    const { accountId, amount } = req.body;

    // Call the withdrawal service
    const transaction = await withdraw(accountId, amount);

    res.status(200).json({ message: 'Withdrawal successful', transaction });
  } catch (error: any) {
    console.error('Withdrawal error:', error);
    res.status(500).json({ message: 'Failed to withdraw', error: error.message });
  }
}

export async function transferController(req: Request, res: Response): Promise<void> {
  try {
    const { fromAccountId, toAccountId, amount } = req.body;

    // Call the transfer service
    const { sourceTransaction, targetTransaction } = await transfer(fromAccountId, toAccountId, amount);

    res.status(200).json({ message: 'Transfer successful', sourceTransaction, targetTransaction });
  } catch (error: any) {
    console.error('Transfer error:', error);
    res.status(500).json({ message: 'Failed to transfer', error: error.message });
  }
}

export async function fetchTransactionsController(req: Request, res: Response) {
  const { accountId } = req.params;

  try {
    const transactions = await fetchTransactionsByAccountId(Number(accountId));
    res.status(200).json(transactions);
  } catch (error: any) {
    console.error('Fetch transactions error:', error);
    res.status(500).json({ message: 'Failed to fetch transactions', error: error.message });
  }
}
