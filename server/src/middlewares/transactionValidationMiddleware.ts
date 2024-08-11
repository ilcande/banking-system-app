import { Request, Response, NextFunction } from 'express';

export function validateTransactionInput(req: Request, res: Response, next: NextFunction): void {
  const accountId = Number(req.body.accountId);
  const fromAccountId = Number(req.body.fromAccountId);
  const toAccountId = Number(req.body.toAccountId);
  const amount = Number(req.body.amount);

  if (accountId && (!Number.isInteger(accountId) || accountId <= 0)) {
    res.status(400).json({ message: 'Invalid accountId' });
    return; // Ensure the function stops executing after sending a response
  }

  if (fromAccountId && (!Number.isInteger(fromAccountId) || fromAccountId <= 0)) {
    res.status(400).json({ message: 'Invalid fromAccountId' });
    return; // Stop further execution
  }

  if (toAccountId && (!Number.isInteger(toAccountId) || toAccountId <= 0)) {
    res.status(400).json({ message: 'Invalid toAccountId' });
    return; // Stop further execution
  }

  if (!amount || typeof amount !== 'number' || amount <= 0) {
    res.status(400).json({ message: 'Invalid amount' });
    return; // Stop further execution
  }

  next(); // Pass control to the next middleware or controller
}
