const client = require('../config/database');
import { CreateUserParams } from '../interfaces/users/CreateUserParams';

// Async function to create a new user
export async function createUser({ username, email, passwordHash }: CreateUserParams): Promise<void> {
  try {
    const query = `
      INSERT INTO users (username, email, password, created_at, updated_at) 
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;
    await client.query(query, [username, email, passwordHash]);
    console.log('User created successfully');
  } catch (error) {
    console.log('Error creating user:', error);
    throw new Error('Failed to create user');
  }
}

// Async function to find a user by id
export async function findUserById(id: number): Promise<any> {
  try {
    const result = await client.query(
      `SELECT * FROM users WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    return result.rows[0];
  } catch (error) {
    console.log('Error finding user by id:', error);
    throw new Error('Failed to find user by id');
  }
}
