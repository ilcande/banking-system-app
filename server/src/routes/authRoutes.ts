import express from 'express';
import { registerController, loginController, getUserDetails } from '../controllers/authController';
import { authenticate } from '../services/authServices';

const router = express.Router();

// Route for user registration
router.post('/register', registerController);

// Route for user login
router.post('/login', loginController);

// route to fetch logged in user
router.get('/me', authenticate, getUserDetails);

export default router;
