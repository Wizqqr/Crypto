import User from '../models/User.js';
import bcrypt from 'bcryptjs'
export const validateRegistration = async (req, res, next) => {
  const { email, password, username } = req.body;

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long' });
  }
  
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and be at least 8 characters long',
    });
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return res.status(400).json({ message: 'Email is already in use' });
  }

  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    return res.status(400).json({ message: 'Username is already taken' });
  }

  next();
};


export const validateLogin = async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({email})

    if (!user){
        return res.status(404).json({message: 'User not found'})
    }

    if(!user.isVerified){
        return res.status(400).json({ message: 'Please verify your email first' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }
}

export const validateVerifyCode = async (req, res, next) => {

}

export const validateGetMe = async (req,res,next) => {

}

export const validateForgotPassword = async (req, res, next) => {

}

export const validateResetPassword = async (req,res,next) => {
    
}
