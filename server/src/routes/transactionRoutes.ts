// routes/transactionRoutes.ts

import { Router } from 'express';
import {
  depositController,
  withdrawController,
  transferController,
  fetchTransactionsController,
} from '../controllers/transactionController';
import { validateTransactionInput } from '../middlewares/transactionValidationMiddleware';

const router = Router();

// Route for deposits
router.post('/deposit', validateTransactionInput, depositController);

// Route for withdrawals
router.post('/withdraw', validateTransactionInput, withdrawController);

// Route for transfers
router.post('/transfer', validateTransactionInput, transferController);

// Route for fetching transactions by account ID
router.get('/accounts/:accountId/all', fetchTransactionsController);

export default router;
