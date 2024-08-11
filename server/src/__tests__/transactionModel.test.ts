// __tests__/transactionModel.test.ts
import { createTransaction, fetchTransactionsByAccountId, findTransactionsByAccountAndDate } from '../models/transactionModel';
const client = require('../config/database');
import { CreateTransactionParams } from '../interfaces/transactions/CreateTransactionParams';

// Mock the client.query method
jest.mock('../config/database', () => ({
  query: jest.fn()
}));

describe('Transaction Model Tests', () => {
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createTransaction should create a new transaction', async () => {
    const mockTransaction: CreateTransactionParams = {
      transaction_id: 1,
      account_id: 1,
      type: 'deposit',
      amount: 100,
      date: new Date(),
      target_account_id: undefined,
      created_at: new Date()
    };

    (client.query as jest.Mock).mockResolvedValueOnce({ rows: [mockTransaction] });

    const result = await createTransaction({
      account_id: 1,
      type: 'deposit',
      amount: 100,
      target_account_id: undefined
    }, client);

    expect(result).toEqual(mockTransaction);
    expect(client.query).toHaveBeenCalledWith(expect.any(String), [
      1, 'deposit', 100, null
    ]);
  });

  test('fetchTransactionsByAccountId should return transactions', async () => {
    const mockTransactions: CreateTransactionParams[] = [
      {
        transaction_id: 1,
        account_id: 1,
        type: 'deposit',
        amount: 100,
        date: new Date(),
        target_account_id: undefined,
        created_at: new Date()
      },
      {
        transaction_id: 2,
        account_id: 1,
        type: 'withdrawal',
        amount: 50,
        date: new Date(),
        target_account_id: undefined,
        created_at: new Date()
      }
    ];

    (client.query as jest.Mock).mockResolvedValueOnce({ rows: mockTransactions });

    const result = await fetchTransactionsByAccountId(1);

    expect(result).toEqual(mockTransactions);
    expect(client.query).toHaveBeenCalledWith(expect.any(String), [1]);
  });

  test('findTransactionsByAccountAndDate should return transactions for a specific month and year', async () => {
    const mockTransactions: CreateTransactionParams[] = [
      {
        transaction_id: 1,
        account_id: 1,
        type: 'deposit',
        amount: 100,
        date: new Date('2024-08-15'),
        target_account_id: undefined,
        created_at: new Date()
      }
    ];

    (client.query as jest.Mock).mockResolvedValueOnce({ rows: mockTransactions });

    const result = await findTransactionsByAccountAndDate(1, 8, 2024);

    expect(result).toEqual(mockTransactions);
    expect(client.query).toHaveBeenCalledWith(expect.any(String), [1, 8, 2024]);
  });

});
