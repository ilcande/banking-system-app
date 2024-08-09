import bcrypt from 'bcrypt';
import { createUser } from '../models/userModel';
import { generateToken, verifyToken } from '../utils/authUtils'; // Import the utility functions
const client = require('../config/database'); // Make sure to use the correct path

interface RegisterParams {
  username: string;
  email: string;
  password: string;
}

interface LoginParams {
  email: string;
  password: string;
}

// Registration service
export async function register({ username, email, password }: RegisterParams): Promise<void> {
  try {
    const passwordHash = await bcrypt.hash(password, 10); // Hash the password
    await createUser({ username, email, passwordHash }); // Store the user in the database
  } catch (error: any) {
    console.error('Error in register service:', error); // Detailed logging
    throw new Error('Failed to register user');
  }
}

// Login service
export async function login({ email, password }: LoginParams): Promise<string> {
  try {
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]); // Find the user by email
    const user = result.rows[0];

    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await bcrypt.compare(password, user.password); // Compare the passwords
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate a JWT token using the utility function
    const token = generateToken(user.id);

    return token;
  } catch (error: any) {
    console.error('Login error:', error.message);
    throw new Error('Failed to login');
  }
}

// Middleware to authenticate requests
export async function authenticate(req: any, res: any, next: any): Promise<void> {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Extract the token
    const decoded = verifyToken(token); // Verify the token

    req.user = decoded; // Attach the user object to the request
    next();
  } catch (error: any) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ message: 'Unauthorized' });
  }
}
