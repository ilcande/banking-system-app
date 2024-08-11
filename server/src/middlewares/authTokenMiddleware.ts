import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/authUtils';

export async function authTokenMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.substring(7).trim(); // Remove 'Bearer ' prefix

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = verifyToken(token); // Decode the token to get user information

    (req as any).user = decoded; // Attach user information to request object

    console.log('Decoded token:', decoded);
    console.log('params:', req.params);

    next();
  } catch (error: any) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ message: 'Unauthorized' });
  }
}
