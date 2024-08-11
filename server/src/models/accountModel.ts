// src/models/accountModel.ts
const client = require('../config/database');
import { CreateAccountParams } from '../interfaces/accounts/CreateAccountParams';
import { UpdateAccountParams } from '../interfaces/accounts/UpdateAccountParams';

// Async function to create a new account
export async function createAccount({
  accountNumber,
  type,
  balance,
  currency,
  userId,
}: CreateAccountParams): Promise<any> {
  try {
    const query = `
      INSERT INTO accounts (account_number, type, balance, currency, user_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING account_id, account_number, type, balance, currency
    `;

    const result = await client.query(query, [accountNumber, type, balance, currency, userId]);

    console.log('Account created successfully');
    return result.rows[0]; // Return the newly created account with all properties
  } catch (error) {
    console.error('Error creating account:', error);
    throw new Error('Failed to create account');
  }
}

// Async function to update an account
export async function updateAccount({
  accountId,
  type,
  balance,
}: UpdateAccountParams): Promise<void> {
  try {
    const fieldsToUpdate: string[] = [];
    const valuesToUpdate: any[] = [];

    // Dynamically build the query based on the fields provided
    if (type !== undefined) {
      fieldsToUpdate.push(`type = $${fieldsToUpdate.length + 1}`);
      valuesToUpdate.push(type);
    }
    if (balance !== undefined) {
      fieldsToUpdate.push(`balance = $${fieldsToUpdate.length + 1}`);
      valuesToUpdate.push(balance);
    }

    // If no fields are provided, throw an error
    if (fieldsToUpdate.length === 0) {
      throw new Error('No valid fields provided for update');
    }

    // Append accountId as the last parameter
    valuesToUpdate.push(accountId);
    const query = `
      UPDATE accounts 
      SET ${fieldsToUpdate.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE account_id = $${valuesToUpdate.length}
    `;

    await client.query(query, valuesToUpdate);
    console.log('Account updated successfully');
  } catch (error) {
    console.error('Error updating account:', error);
    throw new Error('Failed to update account');
  }
}

// Async function to delete an account
export async function deleteAccount(accountId: number): Promise<void> {
  try {
    const query = `DELETE FROM accounts WHERE account_id = $1`;

    const result = await client.query(query, [accountId]);

    if (result.rowCount === 0) {
      throw new Error('Account not found');
    }

    console.log('Account deleted successfully');
  } catch (error) {
    console.error('Error deleting account:', error);
    throw new Error('Failed to delete account');
  }
}

// Async function to find an account by id
export async function findAccountById(account_id: number): Promise<any> {
  try {
    const result = await client.query(
      `SELECT * FROM accounts WHERE account_id = $1`,
      [account_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error finding account by id:', error);
    throw new Error('Failed to find account by id');
  }
}

// Async function to find an account by account number
export async function findAccountsByUserId(user_id: number): Promise<any[]> {
  try {
    const result = await client.query(
      `SELECT * FROM accounts WHERE user_id = $1`,
      [user_id]
    );
    return result.rows;
  } catch (error) {
    console.error('Error finding accounts by user id:', error);
    throw new Error('Failed to find accounts by user id');
  }
}

// Async function to update the account balance in the database
export async function updateAccountBalanceInDB(accountId: number, balance: number, client: any): Promise<void> {
  try {
    const query = `
      UPDATE accounts 
      SET balance = $1, updated_at = CURRENT_TIMESTAMP
      WHERE account_id = $2
    `;

    await client.query(query, [balance, accountId]);
    console.log('Balance updated in DB successfully');
  } catch (error) {
    console.error('Error updating account balance in DB:', error);
    throw new Error('Failed to update account balance in DB');
  }
}
