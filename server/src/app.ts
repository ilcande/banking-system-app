import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // Import cors middleware

// Import routes
import authRoutes from './routes/authRoutes'; // authentication routes
import accountRoutes from './routes/accountRoutes'; // account routes
import transactionRoutes from './routes/transactionRoutes'; // transaction routes

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
app.use(cors()); // Enable CORS
app.use(express.json());

// Use authentication routes
app.use('/api/auth', authRoutes);

// Use account routes
app.use('/api/accounts', accountRoutes);

// Use transaction routes
app.use('/api/transactions', transactionRoutes);

// Define other routes, e.g., home route
app.get('/', (_req, res) => {
  res.send('Secure, reliable, and easy-to-use banking system.');
});

export default app;
