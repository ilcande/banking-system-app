// src/routes/accountRoutes.ts
import express from 'express';
import { registerAccountController, fetchAccountController, updateAccountController, deleteAccountController } from '../controllers/accountController';
import { authenticate } from '../services/authServices';

const router = express.Router();

// Route for creating an account
router.post('/new', authenticate, registerAccountController);

// Route for fetching an account by ID
router.get('/:id', authenticate, fetchAccountController);

// Route to update an account
router.patch('/:id', authenticate, updateAccountController);

// Route to delete an account by ID
router.delete('/:id', authenticate, deleteAccountController);

export default router;
