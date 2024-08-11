import { Request, Response, NextFunction } from 'express';
import { findAccountById } from '../models/accountModel';

export async function authorizeAccountAccess(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id, accountId = null } = req.params;
  const userId = (req as any).user?.userId; // Ensure this matches the JWT payload

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const newId = accountId ? accountId : id;
    const account = await findAccountById(Number(newId));
    
    if (account && account.user_id === userId) {
      next(); // User is authorized
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Error checking account access', error: error.message });
  }
}
