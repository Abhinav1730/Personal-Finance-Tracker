import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    validate: {
      validator: function(value) {
        return value !== 0;
      },
      message: 'Amount cannot be zero'
    }
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['income', 'expense', 'food', 'transportation', 'entertainment', 'shopping', 'bills', 'healthcare', 'education', 'other'],
      message: 'Category must be one of: income, expense, food, transportation, entertainment, shopping, bills, healthcare, education, other'
    }
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Index for better query performance
transactionSchema.index({ date: -1 });
transactionSchema.index({ category: 1 });

// Virtual for transaction type based on amount
transactionSchema.virtual('type').get(function() {
  return this.amount > 0 ? 'income' : 'expense';
});

// Ensure virtual fields are serialized
transactionSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Transaction', transactionSchema);
