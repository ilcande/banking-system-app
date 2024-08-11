import { createUser, findUserById } from '../models/userModel';
const client = require('../config/database');
import { CreateUserParams } from '../interfaces/users/CreateUserParams';

// Mock the client.query method
jest.mock('../config/database', () => ({
  query: jest.fn(),
}));

describe('User Model Tests', () => {
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createUser should successfully create a user', async () => {
    // Arrange
    const mockUser: CreateUserParams = {
      username: 'testuser',
      email: 'test@example.com',
      passwordHash: 'hashedpassword',
    };

    (client.query as jest.Mock).mockResolvedValueOnce({ rowCount: 1 });

    // Act
    await createUser(mockUser);

    // Assert
    expect(client.query).toHaveBeenCalledWith(
      expect.any(String),
      [mockUser.username, mockUser.email, mockUser.passwordHash]
    );
    expect(client.query).toHaveBeenCalledTimes(1);
  });

  test('createUser should throw an error if creation fails', async () => {
    // Arrange
    const mockUser: CreateUserParams = {
      username: 'testuser',
      email: 'test@example.com',
      passwordHash: 'hashedpassword',
    };

    (client.query as jest.Mock).mockRejectedValueOnce(new Error('Failed to create user'));

    // Act & Assert
    await expect(createUser(mockUser)).rejects.toThrow('Failed to create user');
    expect(client.query).toHaveBeenCalledWith(
      expect.any(String),
      [mockUser.username, mockUser.email, mockUser.passwordHash]
    );
    expect(client.query).toHaveBeenCalledTimes(1);
  });

  test('findUserById should return a user if found', async () => {
    // Arrange
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword',
      created_at: new Date(),
      updated_at: new Date(),
    };

    (client.query as jest.Mock).mockResolvedValueOnce({ rows: [mockUser] });

    // Act
    const user = await findUserById(1);

    // Assert
    expect(user).toEqual(mockUser);
    expect(client.query).toHaveBeenCalledWith(
      `SELECT * FROM users WHERE id = $1`,
      [1]
    );
    expect(client.query).toHaveBeenCalledTimes(1);
  });

  test('findUserById should throw an error if failed to find user by id', async () => {
    (client.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

    await expect(findUserById(1)).rejects.toThrow('Failed to find user by id');
    expect(client.query).toHaveBeenCalledWith(
      `SELECT * FROM users WHERE id = $1`,
      [1]
    );
    expect(client.query).toHaveBeenCalledTimes(1);
  });
});
