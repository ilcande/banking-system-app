import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import transactionRoutes from '../routes/transactionRoutes';

// Mock services and models
jest.mock('../services/transactionServices');
jest.mock('../models/transactionModel');

import { deposit, withdraw, transfer } from '../services/transactionServices';
import { fetchTransactionsByAccountId } from '../models/transactionModel';

const app = express();
app.use(bodyParser.json());

// Mock middlewares
const mockAuthTokenMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
  (req as any).user = { userId: 1 }; // Mock authenticated user
  next();
};

const mockAuthorizeAccountAccess = (req: any, res: any, next: () => void) => {
  next(); // Allow access to all accounts for testing
};

// Use mocked middlewares
app.use('/api/transactions', mockAuthTokenMiddleware, mockAuthorizeAccountAccess, transactionRoutes);

// Define mock data
const mockTransactions = [
  { transactionId: 1, amount: 100, accountId: 1, type: 'deposit' },
  { transactionId: 2, amount: 200, accountId: 1, type: 'withdrawal' }
];

describe('Transaction Controller', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should handle successful deposit', async () => {
    (deposit as jest.Mock).mockResolvedValue({ transactionId: 1, amount: 100 });

    const response = await request(app)
      .post('/api/transactions/deposit')
      .send({ accountId: 1, amount: 100 })
      .expect(200);

    expect(response.body.message).toBe('Deposit successful');
    expect(response.body.transaction.transactionId).toBe(1);
  });

  test('should handle successful withdrawal', async () => {
    (withdraw as jest.Mock).mockResolvedValue({ transactionId: 1, amount: 100 });

    const response = await request(app)
      .post('/api/transactions/withdraw')
      .send({ accountId: 1, amount: 100 })
      .expect(200);

    expect(response.body.message).toBe('Withdrawal successful');
    expect(response.body.transaction.transactionId).toBe(1);
  });

  test('should handle successful transfer', async () => {
    (transfer as jest.Mock).mockResolvedValue({
      sourceTransaction: { transactionId: 1, amount: 100 },
      targetTransaction: { transactionId: 2, amount: 100 }
    });

    const response = await request(app)
      .post('/api/transactions/transfer')
      .send({ fromAccountId: 1, toAccountId: 2, amount: 100 })
      .expect(200);

    expect(response.body.message).toBe('Transfer successful');
    expect(response.body.sourceTransaction.transactionId).toBe(1);
    expect(response.body.targetTransaction.transactionId).toBe(2);
  });
});
