import bcrypt from 'bcrypt';
import { createUser } from '../models/userModel';
import { generateToken } from '../utils/authUtils';
const client = require('../config/database');
import { register, login } from '../services/authServices';
import { RegisterParams } from '../interfaces/auth/RegisterParams';
import { LoginParams } from '../interfaces/auth/LoginParams';

// Mock dependencies
jest.mock('bcrypt');
jest.mock('../models/userModel');
jest.mock('../utils/authUtils');
jest.mock('../config/database');

describe('Auth Service', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('register should create a user with hashed password', async () => {
    // Arrange
    (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashedPassword');
    (createUser as jest.Mock).mockResolvedValueOnce(undefined);

    const params: RegisterParams = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    // Act
    await register(params);

    // Assert
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect(bcrypt.hash).toHaveBeenCalledTimes(1);
    expect(createUser).toHaveBeenCalledWith({
      username: 'testuser',
      email: 'test@example.com',
      passwordHash: 'hashedPassword',
    });
    expect(createUser).toHaveBeenCalledTimes(1);
  });

  test('login should return a token for valid credentials', async () => {
    // Arrange
    const mockUser = { id: 1, email: 'test@example.com', password: 'hashedPassword' };
    (client.query as jest.Mock).mockResolvedValueOnce({ rows: [mockUser] });
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
    (generateToken as jest.Mock).mockReturnValueOnce('jwtToken');

    const params: LoginParams = {
      email: 'test@example.com',
      password: 'password123',
    };

    // Act
    const token = await login(params);

    // Assert
    expect(client.query).toHaveBeenCalledWith('SELECT * FROM users WHERE email = $1', ['test@example.com']);
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
    expect(generateToken).toHaveBeenCalledWith(1);
    expect(token).toBe('jwtToken');
  });

  test('login should throw error if user is not found', async () => {
    // Arrange
    (client.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

    const params: LoginParams = {
      email: 'test@example.com',
      password: 'password123',
    };

    // Act & Assert
    await expect(login(params)).rejects.toThrow('Failed to login');
    expect(client.query).toHaveBeenCalledWith('SELECT * FROM users WHERE email = $1', ['test@example.com']);
  });

  test('login should throw error for invalid credentials', async () => {
    // Arrange
    const mockUser = { id: 1, email: 'test@example.com', password: 'hashedPassword' };
    (client.query as jest.Mock).mockResolvedValueOnce({ rows: [mockUser] });
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

    const params: LoginParams = {
      email: 'test@example.com',
      password: 'wrongpassword',
    };

    // Act & Assert
    await expect(login(params)).rejects.toThrow('Failed to login');
    expect(client.query).toHaveBeenCalledWith('SELECT * FROM users WHERE email = $1', ['test@example.com']);
    expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedPassword');
  });
});
