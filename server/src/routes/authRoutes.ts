import express from 'express';
import { registerController, loginController, fetchUserController } from '../controllers/authController';
import { authTokenMiddleware } from '../middlewares/authTokenMiddleware';

const router = express.Router();

// Route for user registration
router.post('/register', registerController);

// Route for user login
router.post('/login', loginController);

// route to fetch logged in user
router.get('/me', authTokenMiddleware, fetchUserController);

export default router;
