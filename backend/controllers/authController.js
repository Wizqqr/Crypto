import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import transporter from '../config/nodemailer.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs'

const generateToken = (user) => {
  return jwt.sign(
    { _id: user._id, email: user.email },
    'secret123', // Use a secure secret key from your environment variables in production
    { expiresIn: '30d' }
  );
};

export const register = async (req, res) => {
  const { fullName, email, password, avatarUrl } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const confirmationCode = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit code
    const user = new User({ fullName, email, password, avatarUrl, confirmationCode, codeGeneratedAt: Date.now() });

    await user.save();

    // Send the confirmation code via email
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

    // Check if the code is correct and not expired (e.g., valid for 10 minutes)
    const isCodeValid = user.confirmationCode === code && (Date.now() - user.codeGeneratedAt) < 10 * 60 * 1000;

    if (!isCodeValid) {
      return res.status(400).json({ message: 'Invalid or expired confirmation code' });
    }

    user.isVerified = true;
    user.confirmationCode = undefined; // Clear the confirmation code
    user.codeGeneratedAt = undefined; // Clear the timestamp
    await user.save();

    // Generate JWT for the verified user
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
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your email first' });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate JWT for the verified user
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