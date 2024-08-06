// src/app.ts
import express, { Request, Response } from 'express';

const app = express();

// Middleware
app.use(express.json());

// Define routes
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Banking System API');
});

export default app;
