// src/server.js
import express from 'express';
import connectDB from './config/db.js';
import cryptoRoutes from './routes/cryptoRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/cryptos', cryptoRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
