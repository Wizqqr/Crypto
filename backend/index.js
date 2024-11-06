// src/server.js
import express from 'express';
import connectDB from './config/db.js';
import cryptoRoutes from './routes/cryptoRoutes.js';
import authRoutes from './routes/authRoutes.js'
import { errorHandler } from './middleware/errorMiddleware.js';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer'
dotenv.config();

const app = express();
connectDB();

const storage = multer.diskStorage({
    destination: (_, __, cb) =>{
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'))

app.post('/upload', upload.single('image'), (req,res)=>{
    res.json({
        url: `/uploads/${req.file.originalname}`,
    })
});


app.use('/api/cryptos', cryptoRoutes);
app.use('/api/auth', authRoutes); // Use the auth routes

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
