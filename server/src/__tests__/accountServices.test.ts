import { registerAccountService, updateAccountService, deleteAccountService, updateAccountBalanceService } from '../services/accountServices';
import { createAccount, updateAccount, deleteAccount, findAccountById, updateAccountBalanceInDB } from '../models/accountModel';
import { getUniqueAccountNumber } from '../services/accountNumberServices';
import { RegisterAccountParams } from '../interfaces/accounts/RegisterAccountParams';
import { UpdateAccountParams } from '../interfaces/accounts/UpdateAccountParams';
// Mock dependencies
jest.mock('../models/accountModel');
jest.mock('../services/accountNumberServices');

describe('Account Service', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('registerAccountService should create and return a new account', async () => {
    // Arrange
    const mockAccount = { account_id: 1, account_number: '123456789', type: 'savings', balance: 100, currency: 'EUR' };
    (getUniqueAccountNumber as jest.Mock).mockResolvedValueOnce('123456789');
    (createAccount as jest.Mock).mockResolvedValueOnce(mockAccount);

    const params: RegisterAccountParams = {
      userId: 1,
      type: 'savings',
      balance: 100,
      currency: 'EUR',
    };

    // Act
    const result = await registerAccountService(params);

    // Assert
    expect(result).toEqual(mockAccount);
    expect(getUniqueAccountNumber).toHaveBeenCalledTimes(1);
    expect(createAccount).toHaveBeenCalledWith({
      accountNumber: '123456789',
      type: 'savings',
      balance: 100,
      currency: 'EUR',
      userId: 1,
    });
    expect(createAccount).toHaveBeenCalledTimes(1);
  });

  test('updateAccountService should call updateAccount with correct parameters', async () => {
    // Arrange
    (updateAccount as jest.Mock).mockResolvedValueOnce(undefined);

    const params: UpdateAccountParams = {
      accountId: 1,
      type: 'checking',
      balance: 200,
    };

    // Act
    await updateAccountService(params);

    // Assert
    expect(updateAccount).toHaveBeenCalledWith({
      accountId: 1,
      type: 'checking',
      balance: 200,
    });
    expect(updateAccount).toHaveBeenCalledTimes(1);
  });

  test('deleteAccountService should call deleteAccount with correct accountId', async () => {
    // Arrange
    (deleteAccount as jest.Mock).mockResolvedValueOnce(undefined);

    // Act
    await deleteAccountService({ accountId: 1 });

    // Assert
    expect(deleteAccount).toHaveBeenCalledWith(1);
    expect(deleteAccount).toHaveBeenCalledTimes(1);
  });

  test('updateAccountBalanceService should update the account balance correctly', async () => {
    // Arrange
    const mockAccount = { account_id: 1, balance: 100 };
    (findAccountById as jest.Mock).mockResolvedValueOnce(mockAccount);
    (updateAccountBalanceInDB as jest.Mock).mockResolvedValueOnce(undefined);

    // Act
    await updateAccountBalanceService(1, 50, {});

    // Assert
    expect(findAccountById).toHaveBeenCalledWith(1);
    expect(updateAccountBalanceInDB).toHaveBeenCalledWith(1, 150, {});
    expect(findAccountById).toHaveBeenCalledTimes(1);
    expect(updateAccountBalanceInDB).toHaveBeenCalledTimes(1);
  });

  test('updateAccountBalanceService should throw an error if account is not found', async () => {
    // Arrange
    (findAccountById as jest.Mock).mockResolvedValueOnce(null);

    // Act & Assert
    await expect(updateAccountBalanceService(1, 50, {})).rejects.toThrow('Failed to update account balance');
    expect(findAccountById).toHaveBeenCalledWith(1);
    expect(findAccountById).toHaveBeenCalledTimes(1);
  });
});
