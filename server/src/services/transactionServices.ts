// services/transactionService.ts

import { createTransaction } from "../models/transactionModel";
import { findAccountById } from "../models/accountModel";
import { updateAccountBalanceService } from "./accountServices";
const client = require('../config/database');

export async function deposit(accountId: number, amount: number): Promise<any> {
  try {
    await client.query('BEGIN'); // Start a transaction

    // Update the account balance
    await updateAccountBalanceService(accountId, amount, client);

    // Create a transaction record
    const transaction = await createTransaction({
      account_id: accountId,
      type: 'deposit',
      amount,
    }, client);

    await client.query('COMMIT'); // Commit the transaction

    return transaction;
  } catch (error) {
    await client.query('ROLLBACK'); // Rollback the transaction on error
    console.error('Deposit error:', error);
    throw new Error('Deposit failed');
  }
}

export async function withdraw(accountId: number, amount: number): Promise<any> {
  try {
    await client.query('BEGIN'); // Start a transaction
    
    // Update the account balance
    await updateAccountBalanceService(accountId, -amount, client);

    // Create a transaction record
    const transaction = await createTransaction({
      account_id: accountId,
      type: 'withdrawal',
      amount: -amount,
    }, client);

    await client.query('COMMIT');

    return transaction;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Withdrawal error:', error);
    throw new Error('Withdrawal failed');
  }
}

export async function transfer(fromAccountId: number, toAccountId: number, amount: number): Promise<any> {
  try {
    await client.query('BEGIN');

    // Check if the source account has enough balance
    const sourceAccount = await findAccountById(fromAccountId);
    if (!sourceAccount || sourceAccount.balance < amount) {
      throw new Error('Insufficient balance or account not found');
    }

    // Update the source account balance
    await updateAccountBalanceService(fromAccountId, -amount, client);

    // Update the target account balance
    await updateAccountBalanceService(toAccountId, amount, client);

    // Create a transaction record for the source account
    const sourceTransaction = await createTransaction({
      account_id: fromAccountId,
      type: 'transfer',
      amount: -amount,
      target_account_id: toAccountId,
    }, client);

    // Create a transaction record for the target account
    const targetTransaction = await createTransaction({
      account_id: toAccountId,
      type: 'transfer',
      amount,
      target_account_id: fromAccountId,
    }, client);

    await client.query('COMMIT');

    return { sourceTransaction, targetTransaction };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Transfer error:', error);
    throw new Error('Transfer failed');
  }
}
