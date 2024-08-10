import { Request, Response } from 'express';
import { register, login } from '../services/authServices';
import { findUserById } from '../models/userModel';

export async function registerController(req: Request, res: Response): Promise<void> {
  try {
    const { username, email, password } = req.body;
    await register({ username, email, password });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error: any) {
    console.error('Error in registerController:', error); // Detailed logging
    res.status(500).json({ message: 'Failed to register user', error: error.message });
  }
}

export async function loginController(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    const token = await login({ email, password });
    res.status(200).json({ token });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
}

// Controller action to fetch the logged-in user's details
export async function fetchUserController(req: Request, res: Response): Promise<void> {
  try {
    // Extract user ID from request object set by the authentication middleware
    const userId = (req as any).user?.userId; // Type assertion to any to access user property

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Fetch user details from the database
    const user = await findUserById(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    // Respond with the user details
    res.json({
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error('Error in fetchUserController controller:', error);
    res.status(500).json({ message: 'Failed to get user details' });
  }
}
