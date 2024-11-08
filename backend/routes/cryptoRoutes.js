import express from 'express';
import { getAllCryptos, getCryptoById, getMostExpensiveCryptos, getCheapestCryptos } from '../controllers/cryptoController.js';

const router = express.Router();

router.get('/', getAllCryptos);
router.get('/mostexpensive', getMostExpensiveCryptos);
router.get('/mostcheapest', getCheapestCryptos)
router.get('/:id', getCryptoById);

export default router;
