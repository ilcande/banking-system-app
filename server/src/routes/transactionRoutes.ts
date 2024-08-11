// routes/transactionRoutes.ts

import { Router } from 'express';
import {
  depositController,
  withdrawController,
  transferController,
  fetchTransactionsController,
} from '../controllers/transactionController';
import { generateStatementController } from '../controllers/statementController';
import { validateTransactionInput } from '../middlewares/transactionValidationMiddleware';
import { authorizeAccountAccess } from '../middlewares/authAccountMiddleware';
import { authTokenMiddleware } from '../middlewares/authTokenMiddleware';
const router = Router();

// Route for deposits
router.post('/deposit', validateTransactionInput, depositController);

// Route for withdrawals
router.post('/withdraw', validateTransactionInput, withdrawController);

// Route for transfers
router.post('/transfer', validateTransactionInput, transferController);

// Route for fetching transactions by account ID
router.get('/accounts/:accountId/all', authTokenMiddleware, authorizeAccountAccess, fetchTransactionsController);

// Route to generate and download a monthly statement
router.get('/accounts/:accountId/statement/:month/:year', authTokenMiddleware, authorizeAccountAccess, generateStatementController);

export default router;
