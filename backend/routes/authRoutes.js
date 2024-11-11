import express from 'express';
import { register, verifyCode, login, getMe, forgotPassword, resetPassword } from '../controllers/authController.js';
import checkAuth from '../utils/checkAuth.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify', verifyCode);
router.post('/login', login);
router.get('/me', checkAuth, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
