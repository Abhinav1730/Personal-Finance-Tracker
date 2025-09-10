import express from 'express';
const router = express.Router();
const {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionStats
} = require('../controllers/transactionController');
const { transactionValidation, updateTransactionValidation } = require('../middleware/validation');

router.get('/', getTransactions);

router.get('/stats/summary', getTransactionStats);

router.get('/:id', getTransaction);

router.post('/', transactionValidation, createTransaction);

router.put('/:id', updateTransactionValidation, updateTransaction);

router.delete('/:id', deleteTransaction);

module.exports = router;
