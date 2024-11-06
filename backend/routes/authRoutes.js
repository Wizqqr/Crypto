import express from 'express';
import { register, verifyCode, login,getMe } from '../controllers/authController.js';
import checkAuth from '../utils/checkAuth.js'
const router = express.Router();

router.post('/register', register);
router.post('/verify', verifyCode); // Route to verify the confirmation code
router.post('/login', login); // Route to log in
router.get('/me', checkAuth, getMe)

export default router;
