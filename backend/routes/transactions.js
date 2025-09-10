import express from 'express';
const router = express.Router();
import {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionStats
} from '../controllers/transactionController.js';
import { transactionValidation, updateTransactionValidation } from '../middleware/validation.js';

router.get('/', getTransactions);

router.get('/stats/summary', getTransactionStats);

router.get('/:id', getTransaction);

router.post('/', transactionValidation, createTransaction);

router.put('/:id', updateTransactionValidation, updateTransaction);

router.delete('/:id', deleteTransaction);

export default router;
