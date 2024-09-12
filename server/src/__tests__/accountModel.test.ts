import { createAccount, updateAccount, deleteAccount, findAccountById, findAccountsByUserId, updateAccountBalanceInDB } from '../models/accountModel';
const client = require('../config/database');
// Mock the client.query method
jest.mock('../config/database', () => ({
  query: jest.fn()
}));

describe('Account Model Tests', () => {
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createAccount should successfully create an account', async () => {
    const mockAccount = {
      account_id: 1,
      account_number: '123456789',
      type: 'checking',
      balance: 1000,
      currency: 'EUR'
    };
    
    (client.query as jest.Mock).mockResolvedValueOnce({ rows: [mockAccount] });

    const result = await createAccount({
      accountNumber: '123456789',
      type: 'checking',
      balance: 1000,
      currency: 'EUR',
      userId: 1
    });

    expect(result).toEqual(mockAccount);
    expect(client.query).toHaveBeenCalledWith(expect.any(String), [
      '123456789', 'checking', 1000, 'EUR', 1
    ]);
  });

  test('updateAccount should update an account successfully', async () => {
    (client.query as jest.Mock).mockResolvedValueOnce({ rowCount: 1 });

    await updateAccount({
      accountId: 1,
      type: 'savings',
      balance: 1500
    });

    expect(client.query).toHaveBeenCalledWith(expect.any(String), [
      'savings', 1500, 1
    ]);
  });

  test('deleteAccount should delete an account successfully', async () => {
    (client.query as jest.Mock).mockResolvedValueOnce({ rowCount: 1 });

    await deleteAccount(1);

    expect(client.query).toHaveBeenCalledWith(expect.any(String), [1]);
  });

  test('findAccountById should return an account', async () => {
    const mockAccount = {
      account_id: 1,
      account_number: '123456789',
      type: 'checking',
      balance: 1000,
      currency: 'EUR'
    };
    
    (client.query as jest.Mock).mockResolvedValueOnce({ rows: [mockAccount] });

    const result = await findAccountById(1);

    expect(result).toEqual(mockAccount);
    expect(client.query).toHaveBeenCalledWith(expect.any(String), [1]);
  });

  test('findAccountsByUserId should return accounts', async () => {
    const mockAccounts = [
      {
        account_id: 1,
        account_number: '123456789',
        type: 'checking',
        balance: 1000,
        currency: 'EUR'
      },
      {
        account_id: 2,
        account_number: '987654321',
        type: 'savings',
        balance: 5000,
        currency: 'EUR'
      }
    ];
    
    (client.query as jest.Mock).mockResolvedValueOnce({ rows: mockAccounts });

    const result = await findAccountsByUserId(1);

    expect(result).toEqual(mockAccounts);
    expect(client.query).toHaveBeenCalledWith(expect.any(String), [1]);
  });

  test('updateAccountBalanceInDB should update the balance in DB', async () => {
    (client.query as jest.Mock).mockResolvedValueOnce({ rowCount: 1 });

    await updateAccountBalanceInDB(1, 2000, client);

    expect(client.query).toHaveBeenCalledWith(expect.any(String), [2000, 1]);
  });
});
