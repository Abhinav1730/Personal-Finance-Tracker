import { body } from 'express-validator';

const transactionValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  
  body('amount')
    .isNumeric()
    .withMessage('Amount must be a valid number')
    .custom((value) => {
      if (parseFloat(value) === 0) {
        throw new Error('Amount cannot be zero');
      }
      return true;
    })
    .withMessage('Amount cannot be zero'),
  
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date format')
    .custom((value) => {
      if (value && new Date(value) > new Date()) {
        throw new Error('Date cannot be in the future');
      }
      return true;
    })
    .withMessage('Date cannot be in the future'),
  
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['income', 'expense', 'food', 'transportation', 'entertainment', 'shopping', 'bills', 'healthcare', 'education', 'other'])
    .withMessage('Category must be one of: income, expense, food, transportation, entertainment, shopping, bills, healthcare, education, other'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
];

const updateTransactionValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty if provided')
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  
  body('amount')
    .optional()
    .isNumeric()
    .withMessage('Amount must be a valid number')
    .custom((value) => {
      if (value !== undefined && parseFloat(value) === 0) {
        throw new Error('Amount cannot be zero');
      }
      return true;
    })
    .withMessage('Amount cannot be zero'),
  
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date format')
    .custom((value) => {
      if (value && new Date(value) > new Date()) {
        throw new Error('Date cannot be in the future');
      }
      return true;
    })
    .withMessage('Date cannot be in the future'),
  
  body('category')
    .optional()
    .isIn(['income', 'expense', 'food', 'transportation', 'entertainment', 'shopping', 'bills', 'healthcare', 'education', 'other'])
    .withMessage('Category must be one of: income, expense, food, transportation, entertainment, shopping, bills, healthcare, education, other'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
];

module.exports = {
  transactionValidation,
  updateTransactionValidation
};