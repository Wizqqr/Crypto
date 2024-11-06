// src/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatarUrl: {
        type: String,
        default: '/noavatar.png', // Значение по умолчанию
    },
    confirmationCode: {
        type: String,
    },
    codeGeneratedAt: {
        type: Date,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
}
,
{
    timestamps: true,
  },);

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

export default mongoose.model('User', userSchema);
