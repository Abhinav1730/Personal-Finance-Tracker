import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTransactions } from '../contexts/TransactionContext'
import { CATEGORIES } from '../services/transactionService'
import { ArrowLeft, Save, DollarSign, Calendar, Tag, FileText } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const AddTransaction = () => {
  const navigate = useNavigate()
  const { addTransaction, loading, error, clearError } = useTransactions()
  
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'expense',
    description: ''
  })
  
  const [validationErrors, setValidationErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required'
    }
    
    if (!formData.amount || parseFloat(formData.amount) === 0) {
      errors.amount = 'Amount is required and cannot be zero'
    }
    
    if (!formData.category) {
      errors.category = 'Category is required'
    }
    
    if (formData.date && new Date(formData.date) > new Date()) {
      errors.date = 'Date cannot be in the future'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    clearError()
    
    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount)
      }
      
      await addTransaction(transactionData)
      navigate('/')
    } catch (error) {
      console.error('Failed to create transaction:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate('/')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Transaction</h1>
          <p className="mt-2 text-gray-600">Record a new income or expense</p>
        </div>
      </div>

      {/* Error Message */}
      {error && <ErrorMessage message={error} onDismiss={clearError} />}

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4" />
              <span>Title *</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Salary, Groceries, Rent"
              className={`input ${validationErrors.title ? 'input-error' : ''}`}
              maxLength={100}
            />
            {validationErrors.title && (
              <p className="mt-1 text-sm text-danger-600">{validationErrors.title}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="h-4 w-4" />
              <span>Amount *</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0.01"
                className={`input pl-8 ${validationErrors.amount ? 'input-error' : ''}`}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Use positive numbers for income, negative for expenses
            </p>
            {validationErrors.amount && (
              <p className="mt-1 text-sm text-danger-600">{validationErrors.amount}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4" />
              <span>Date</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              max={new Date().toISOString().split('T')[0]}
              className={`input ${validationErrors.date ? 'input-error' : ''}`}
            />
            {validationErrors.date && (
              <p className="mt-1 text-sm text-danger-600">{validationErrors.date}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Tag className="h-4 w-4" />
              <span>Category *</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`input ${validationErrors.category ? 'input-error' : ''}`}
            >
              {CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            {validationErrors.category && (
              <p className="mt-1 text-sm text-danger-600">{validationErrors.category}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4" />
              <span>Description</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Optional description or notes"
              rows={3}
              maxLength={500}
              className="input resize-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex items-center space-x-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" text="" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Transaction</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddTransaction
