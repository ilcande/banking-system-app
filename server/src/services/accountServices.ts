// src/services/accountService.ts
import { getUniqueAccountNumber } from './accountNumberServices';
import {
  createAccount,
  updateAccount,
  deleteAccount,
  findAccountById,
  updateAccountBalanceInDB
} from '../models/accountModel';
import { RegisterAccountParams } from '../interfaces/accounts/RegisterAccountParams';
import { UpdateAccountParams } from '../interfaces/accounts/UpdateAccountParams';

// Account registration service
export async function registerAccountService({
  userId,
  type,
  balance = 0,
  currency = 'EUR',
}: RegisterAccountParams): Promise<any> {
  try {
    const accountNumber = await getUniqueAccountNumber(); // Generate a unique account number
    const newAccount = await createAccount({
      accountNumber,
      type,
      balance,
      currency,
      userId,
    }); // Store the account in the database
    return newAccount; // Return the newly created account with all properties
  } catch (error: any) {
    console.error('Error in registerAccountService service:', error); // Detailed logging
    throw new Error('Failed to create account');
  }
}

// Account update service
export async function updateAccountService(params: UpdateAccountParams): Promise<void> {
  try {
    const { accountId, type, balance } = params;

    await updateAccount({
      accountId,
      type,
      balance,
    });
  } catch (error: any) {
    console.error('Error in updateAccountService:', error);
    throw new Error('Failed to update account');
  }
}

// Account deletion service
export async function deleteAccountService({ accountId }: { accountId: number }): Promise<void> {
  try {
    await deleteAccount(accountId);
  } catch (error: any) {
    console.error('Error in deleteAccountService:', error);
    throw new Error('Failed to delete account');
  }
}

// Update the account balance
export async function updateAccountBalanceService(accountId: number, amount: number, client:any): Promise<void> {
  try {
    // Fetch the current account
    const account = await findAccountById(accountId);
    if (!account) {
      throw new Error('Account not found');
    }

    // Avoid floating-point issues
    const currentBalance = Math.round(account.balance * 100);
    const amountToUpdate = Math.round(amount * 100);

    // Calculate the new balance
    const newBalance = (currentBalance + amountToUpdate) / 100;

    // Update the balance only
    await updateAccountBalanceInDB(accountId, newBalance, client);

    console.log('Account balance updated successfully');
  } catch (error: any) {
    console.error('Error in updateAccountBalanceService:', error);
    throw new Error('Failed to update account balance');
  }
}
