import express from 'express';
import {
  registerAccountController,
  fetchAccountController,
  fetchAccountsController,
  updateAccountController,
  deleteAccountController
} from '../controllers/accountController';
import { authTokenMiddleware } from '../middlewares/authTokenMiddleware';
import { authorizeAccountAccess } from '../middlewares/authAccountMiddleware';

const router = express.Router();

// Route for creating an account (only auth is needed)
router.post('/new', authTokenMiddleware, registerAccountController);

// Route for fetching an account by ID (auth + authorization)
router.get('/:id', authTokenMiddleware, authorizeAccountAccess, fetchAccountController);

// Route for fetching all accounts (only auth is needed)
router.get('/', authTokenMiddleware, fetchAccountsController);

// Route to update an account (auth + authorization)
router.patch('/:id', authTokenMiddleware, authorizeAccountAccess, updateAccountController);

// Route to delete an account by ID (auth + authorization)
router.delete('/:id', authTokenMiddleware, authorizeAccountAccess, deleteAccountController);

export default router;
