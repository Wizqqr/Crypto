// src/server.js
import express from 'express';
import connectDB from './config/db.js';
import cryptoRoutes from './routes/cryptoRoutes.js';
import authRoutes from './routes/authRoutes.js'
import { errorHandler } from './middleware/errorMiddleware.js';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer'
import redis from 'redis';
// import redisClient from './config/redis.js';

dotenv.config();

const app = express();

// (async () => {
//     try {
//         await redisClient.connect(); 
//         console.log('Redis client connected');
//     } catch (err) {
//         console.error('Error connecting to Redis:', err);
//     }
// })();

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
app.use(cors({
    origin: 'http://localhost:5173' // Укажите домен фронтенда
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'))

app.post('/upload', upload.single('image'), (req,res)=>{
    res.json({
        url: `/uploads/${req.file.originalname}`,
    })
});


app.use('/api/cryptos', cryptoRoutes);
app.use('/api/auth', authRoutes); 

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
