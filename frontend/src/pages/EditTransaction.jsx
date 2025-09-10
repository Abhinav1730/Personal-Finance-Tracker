import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTransactions } from '../hooks/useTransactions'
import { CATEGORIES } from '../utils/formatters'
import { ArrowLeft, Save, DollarSign, Calendar, Tag, FileText } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const EditTransaction = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getTransaction, updateTransaction, error, clearError } = useTransactions()
  
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense', // 'income' or 'expense'
    date: '',
    category: 'expense',
    description: ''
  })
  
  const [validationErrors, setValidationErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTransaction = async () => {
      try {
        setIsLoading(true)
        const response = await getTransaction(id)
        const transaction = response.data
        
        setFormData({
          title: transaction.title,
          amount: Math.abs(transaction.amount).toString(),
          type: transaction.amount > 0 ? 'income' : 'expense',
          date: new Date(transaction.date).toISOString().split('T')[0],
          category: transaction.category,
          description: transaction.description || ''
        })
      } catch (error) {
        console.error('Failed to load transaction:', error)
        navigate('/')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      loadTransaction()
    }
  }, [id, getTransaction, navigate])

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

  const handleTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      type,
      // Set default category based on type if current category doesn't match
      category: type === 'income' ? 'salary' : 'food'
    }))
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
        amount: formData.type === 'expense' 
          ? -Math.abs(parseFloat(formData.amount)) 
          : Math.abs(parseFloat(formData.amount))
      }
      
      await updateTransaction(id, transactionData)
      navigate('/')
    } catch (error) {
      console.error('Failed to update transaction:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate('/')
  }

  if (isLoading) {
    return <LoadingSpinner text="Loading transaction..." />
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
          <h1 className="text-3xl font-bold text-gray-900">Edit Transaction</h1>
          <p className="mt-2 text-gray-600">Update transaction details</p>
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

          {/* Transaction Type */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Tag className="h-4 w-4" />
              <span>Transaction Type *</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  formData.type === 'income'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-300 hover:bg-emerald-25'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="font-semibold">Income</span>
                </div>
                <p className="text-xs mt-1 opacity-75">Money coming in</p>
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  formData.type === 'expense'
                    ? 'border-red-500 bg-red-50 text-red-700 shadow-lg'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-red-300 hover:bg-red-25'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="font-semibold">Expense</span>
                </div>
                <p className="text-xs mt-1 opacity-75">Money going out</p>
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="h-4 w-4" />
              <span>Amount *</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm font-semibold">₹</span>
              </div>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0.01"
                className={`input pl-10 ${validationErrors.amount ? 'input-error' : ''}`}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Enter the amount (always positive). The type above determines if it's income or expense.
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
              {CATEGORIES
                .filter(category => category.type === formData.type)
                .map((category) => (
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
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Update Transaction</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditTransaction
