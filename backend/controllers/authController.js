import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import transporter from '../config/nodemailer.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const generateToken = (user) => {
  return jwt.sign(
    { _id: user._id, email: user.email },
    'secret123',
    { expiresIn: '30d' }
  );
};

export const register = async (req, res) => {
  const { fullName, email, password, avatarUrl } = req.body;

  try {
    const confirmationCode = crypto.randomInt(100000, 999999).toString();
    const user = new User({ fullName, email, password, avatarUrl, confirmationCode, codeGeneratedAt: Date.now() });

    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Confirmation Code',
      html: `<h1>Confirmation Code</h1><p>Your confirmation code is: <strong>${confirmationCode}</strong></p>`,
    });

    res.status(201).json({ message: 'User registered successfully. Please check your email for the confirmation code.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user', error });
  }
};

export const verifyCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isCodeValid = user.confirmationCode === code && (Date.now() - user.codeGeneratedAt) < 10 * 60 * 1000;

    if (!isCodeValid) {
      return res.status(400).json({ message: 'Invalid or expired confirmation code' });
    }

    user.isVerified = true;
    user.confirmationCode = undefined;
    user.codeGeneratedAt = undefined;
    await user.save();

    const token = generateToken(user);

    res.status(200).json({ message: 'Email confirmed successfully!', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error verifying code', error });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    const token = generateToken(user);

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in', error });
  }
};


export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving user information', error });
  }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetCode = crypto.randomInt(100000, 999999).toString();

    user.resetCode = resetCode;
    user.resetCodeGeneratedAt = Date.now();

    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Code',
      html: `<h1>Password Reset Code</h1><p>Your password reset code is: <strong>${resetCode}</strong></p><p>This code is valid for 10 minutes.</p>`,
    });

    res.status(200).json({ message: 'Password reset code sent to your email.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending reset code', error });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { email, resetCode, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.resetCode !== resetCode) {
      return res.status(400).json({ message: 'Invalid reset code' });
    }

    const timeLimit = 10 * 60 * 1000;
    const isCodeExpired = Date.now() - user.resetCodeGeneratedAt > timeLimit;

    if (isCodeExpired) {
      return res.status(400).json({ message: 'Reset code has expired' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetCode = null;
    user.resetCodeGeneratedAt = null;
    await user.save();

    res.status(200).json({ message: 'Password successfully reset' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error resetting password' });
  }
};
