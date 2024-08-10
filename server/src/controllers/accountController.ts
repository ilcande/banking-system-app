// src/controllers/accountController.ts
import { Request, Response } from 'express';
import { registerAccountService, updateAccountService, deleteAccountService } from '../services/accountServices';
import { findAccountById, findAccountsByUserId } from '../models/accountModel';
import { UpdateAccountParams } from '../interfaces/accounts/UpdateAccountParams';

export async function registerAccountController(req: Request, res: Response): Promise<void> {
  try {
    // The user ID should come from the authenticated user (middleware)
    const userId = (req as any).user?.userId; // Type assertion to any to access user property
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { type, balance, currency } = req.body;
    const account = await registerAccountService({ userId, type, balance, currency });

    res.status(201).json({ message: 'Account created successfully', account });
  } catch (error: any) {
    console.error('Error in registerAccountController:', error); // Detailed logging
    res.status(500).json({ message: 'Failed to create account', error: error.message });
  }
}

export async function fetchAccountController(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const accountId = Number(id);
    const account = await findAccountById(accountId);

    if (!account) {
      res.status(404).json({ message: 'Account not found' });
      return;
    }

    res.json(account);
  } catch (error: any) {
    console.error('Error in fetchAccountController:', error);
    res.status(500).json({ message: 'Failed to get account', error: error.message });
  }
}

export async function updateAccountController(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { type, balance } = req.body;

    const updateParams: UpdateAccountParams = {
      accountId: parseInt(id, 10),
      type: type !== undefined ? type : undefined,
      balance: balance !== undefined ? balance : undefined,
    };

    await updateAccountService(updateParams);

    res.json({ message: 'Account updated successfully' });
  } catch (error: any) {
    console.error('Error in updateAccountController:', error);
    res.status(500).json({ message: 'Failed to update account', error: error.message });
  }
}

export async function deleteAccountController(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    
    // Delete the account from the database
    await deleteAccountService({ accountId: Number(id) });
    res.json({ message: `Account ${id} deleted successfully` });
  } catch (error: any) {
    console.error('Error in deleteAccountController:', error);
    res.status(500).json({ message: 'Failed to delete account', error: error.message });
  }
}

export async function fetchAccountsController(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).user?.userId; // Type assertion to any to access user property
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Fetch accounts from the database
    const accounts = await findAccountsByUserId(userId);
    res.json(accounts);
  } catch (error: any) {
    console.error('Error in fetchAccountsController:', error);
    res.status(500).json({ message: 'Failed to get accounts', error: error.message });
  }
}
