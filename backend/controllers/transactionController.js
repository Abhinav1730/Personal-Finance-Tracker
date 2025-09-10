import Transaction from '../models/Transaction';
import { validationResult } from 'express-validator';

const getTransactions = async (req, res) => {
  try {
    const { category, startDate, endDate, sortBy = 'date', sortOrder = 'desc' } = req.query;
    
    const filter = {};
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const transactions = await Transaction.find(filter)
      .sort(sort)
      .limit(100);
    
    const totalIncome = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = Math.abs(transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0));
    
    const balance = totalIncome - totalExpenses;
    
    res.json({
      success: true,
      data: {
        transactions,
        summary: {
          totalIncome,
          totalExpenses,
          balance,
          transactionCount: transactions.length
        }
      }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching transactions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }
    
    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while fetching transaction',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const createTransaction = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const { title, amount, date, category, description } = req.body;
    
    const transaction = new Transaction({
      title,
      amount: parseFloat(amount),
      date: date ? new Date(date) : new Date(),
      category,
      description
    });
    
    const savedTransaction = await transaction.save();
    
    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: savedTransaction
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating transaction',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const { title, amount, date, category, description } = req.body;
    
    const updateData = {
      title,
      amount: parseFloat(amount),
      date: date ? new Date(date) : undefined,
      category,
      description
    };
    
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );
    
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Transaction updated successfully',
      data: transaction
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction ID format'
      });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating transaction',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Transaction deleted successfully',
      data: transaction
    });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while deleting transaction',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getTransactionStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const filter = {};
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    
    const transactions = await Transaction.find(filter);
    
    
    const categoryStats = {};
    let totalIncome = 0;
    let totalExpenses = 0;
    
    transactions.forEach(transaction => {
      const category = transaction.category;
      if (!categoryStats[category]) {
        categoryStats[category] = { income: 0, expenses: 0, count: 0 };
      }
      
      categoryStats[category].count++;
      
      if (transaction.amount > 0) {
        categoryStats[category].income += transaction.amount;
        totalIncome += transaction.amount;
      } else {
        categoryStats[category].expenses += Math.abs(transaction.amount);
        totalExpenses += Math.abs(transaction.amount);
      }
    });
    
    res.json({
      success: true,
      data: {
        summary: {
          totalIncome,
          totalExpenses,
          balance: totalIncome - totalExpenses,
          transactionCount: transactions.length
        },
        categoryStats
      }
    });
  } catch (error) {
    console.error('Error fetching transaction stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionStats
};
