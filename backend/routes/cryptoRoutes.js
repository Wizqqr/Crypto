// src/routes/cryptoRoutes.js
import express from 'express';
import { getAllCryptos, getCryptoById } from '../controllers/cryptoController.js';

const router = express.Router();

router.get('/', getAllCryptos);
router.get('/:id', getCryptoById);

export default router;
