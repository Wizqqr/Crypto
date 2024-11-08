import express from 'express';
import { register, verifyCode, login, getMe, forgotPassword, resetPassword } from '../controllers/authController.js';
import { validateRegistration, validateLogin } from '../middleware/authMiddleware.js';
import checkAuth from '../utils/checkAuth.js';

const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/verify', verifyCode);
router.post('/login', validateLogin, login);
router.get('/me', checkAuth, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
