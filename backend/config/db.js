// src/config/db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    await mongoose.connect(process.env.DATABASE_URI)
    .then(() => console.log('MongoDB has been connected'))
.catch((err) =>console.log('DB Error', err))
};

export default connectDB;
