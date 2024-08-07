// Description: This file is the entry point of the application. It initializes the express app and connects to the database.
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

const client = require('./config/database');
dotenv.config(); // Load environment variables from .env file

// Connect to database
client.connect((err: Error) => {
  if (err) {
    console.error('connection error', err.stack);
  } else {
    console.log(`Database ${client.connectionParameters.database} connected successfully`);
  }
});


const app = express();

// Middleware
app.use(express.json());

// Define routes
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Banking System API');
});

export default app;
