const express = require('express');
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

// @route   GET /api/transactions
// @desc    Get all transactions with optional filtering
// @access  Public
router.get('/', getTransactions);

// @route   GET /api/transactions/stats/summary
// @desc    Get transaction statistics and summary
// @access  Public
router.get('/stats/summary', getTransactionStats);

// @route   GET /api/transactions/:id
// @desc    Get single transaction by ID
// @access  Public
router.get('/:id', getTransaction);

// @route   POST /api/transactions
// @desc    Create new transaction
// @access  Public
router.post('/', transactionValidation, createTransaction);

// @route   PUT /api/transactions/:id
// @desc    Update transaction by ID
// @access  Public
router.put('/:id', updateTransactionValidation, updateTransaction);

// @route   DELETE /api/transactions/:id
// @desc    Delete transaction by ID
// @access  Public
router.delete('/:id', deleteTransaction);

module.exports = router;
