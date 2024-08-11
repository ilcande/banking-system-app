import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { registerController, loginController, fetchUserController } from '../controllers/authController';
import { register, login } from '../services/authServices';
import { findUserById } from '../models/userModel';

// Initialize express app
const app = express();
app.use(bodyParser.json());

// Define routes
app.post('/auth/register', registerController);
app.post('/auth/login', loginController);

// Mock service and model imports
jest.mock('../services/authServices');
jest.mock('../models/userModel');

describe('Auth Controller', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should register a new user', async () => {
    (register as jest.Mock).mockResolvedValue(undefined);
    const response = await request(app)
      .post('/auth/register')
      .send({ username: 'testuser', email: 'test@example.com', password: 'password123' })
      .expect(201);

    expect(response.body.message).toBe('User registered successfully');
  });

  test('should login and return a token', async () => {
    (login as jest.Mock).mockResolvedValue('fake-jwt-token');
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(200);

    expect(response.body.token).toBe('fake-jwt-token');
  });
});
