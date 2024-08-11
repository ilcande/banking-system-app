import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { registerAccountController, fetchAccountController, updateAccountController, deleteAccountController, fetchAccountsController } from '../controllers/accountController';
import { registerAccountService, updateAccountService, deleteAccountService } from '../services/accountServices';
import { findAccountById, findAccountsByUserId } from '../models/accountModel';

// Initialize express app
const app = express();
app.use(bodyParser.json());

// Mock authTokenMiddleware
const mockAuthTokenMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  (req as any).user = { userId: 1 }; // Simulate authenticated user
  next();
};

// Use the mock middleware
app.use('/accounts', mockAuthTokenMiddleware);
app.post('/accounts/new', registerAccountController);
app.get('/accounts/:id', fetchAccountController);
app.patch('/accounts/:id', updateAccountController);
app.delete('/accounts/:id', deleteAccountController);
app.get('/accounts', fetchAccountsController);

// Mock service and model imports
jest.mock('../services/accountServices');
jest.mock('../models/accountModel');

describe('Account Controller', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should register a new account', async () => {
    (registerAccountService as jest.Mock).mockResolvedValue({ accountId: 1 });
    const response = await request(app)
      .post('/accounts/new')
      .send({ type: 'Savings', balance: 1000, currency: 'EUR' })
      .expect(201);

    expect(response.body.message).toBe('Account created successfully');
  });

  test('should fetch an account', async () => {
    (findAccountById as jest.Mock).mockResolvedValue({ accountId: 1, type: 'Savings', balance: 1000, currency: 'EUR' });
    const response = await request(app)
      .get('/accounts/1')
      .expect(200);

    expect(response.body.accountId).toBe(1);
  });

  test('should update an account', async () => {
    (updateAccountService as jest.Mock).mockResolvedValue(null);
    const response = await request(app)
      .patch('/accounts/1')
      .send({ balance: 1500 })
      .expect(200);

    expect(response.body.message).toBe('Account updated successfully');
  });

  test('should delete an account', async () => {
    (deleteAccountService as jest.Mock).mockResolvedValue(null);
    const response = await request(app)
      .delete('/accounts/1')
      .expect(200);

    expect(response.body.message).toBe('Account 1 deleted successfully');
  });

  test('should fetch all accounts for a user', async () => {
    (findAccountsByUserId as jest.Mock).mockResolvedValue([{ accountId: 1, type: 'Savings', balance: 1000, currency: 'EUR' }]);
    const response = await request(app)
      .get('/accounts')
      .expect(200);

    expect(response.body.length).toBe(1);
  });
});
