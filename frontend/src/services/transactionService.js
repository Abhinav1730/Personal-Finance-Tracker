import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// Transaction service
export const transactionService = {
  // Get all transactions with optional filters
  async getTransactions(filters = {}) {
    const params = new URLSearchParams()
    
    if (filters.category && filters.category !== 'all') {
      params.append('category', filters.category)
    }
    if (filters.startDate) {
      params.append('startDate', filters.startDate)
    }
    if (filters.endDate) {
      params.append('endDate', filters.endDate)
    }
    if (filters.sortBy) {
      params.append('sortBy', filters.sortBy)
    }
    if (filters.sortOrder) {
      params.append('sortOrder', filters.sortOrder)
    }

    const response = await api.get(`/transactions?${params.toString()}`)
    return response.data
  },

  // Get single transaction by ID
  async getTransaction(id) {
    const response = await api.get(`/transactions/${id}`)
    return response.data
  },

  // Create new transaction
  async createTransaction(transactionData) {
    const response = await api.post('/transactions', transactionData)
    return response.data
  },

  // Update transaction
  async updateTransaction(id, transactionData) {
    const response = await api.put(`/transactions/${id}`, transactionData)
    return response.data
  },

  // Delete transaction
  async deleteTransaction(id) {
    const response = await api.delete(`/transactions/${id}`)
    return response.data
  },

  // Get transaction statistics
  async getStats(filters = {}) {
    const params = new URLSearchParams()
    
    if (filters.startDate) {
      params.append('startDate', filters.startDate)
    }
    if (filters.endDate) {
      params.append('endDate', filters.endDate)
    }

    const response = await api.get(`/transactions/stats/summary?${params.toString()}`)
    return response.data
  },

  // Health check
  async healthCheck() {
    const response = await api.get('/health')
    return response.data
  }
}

// Utility functions for formatting
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export const formatDateTime = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

// Category options
export const CATEGORIES = [
  { value: 'income', label: 'Income', color: 'success' },
  { value: 'expense', label: 'Expense', color: 'danger' },
  { value: 'food', label: 'Food', color: 'primary' },
  { value: 'transportation', label: 'Transportation', color: 'primary' },
  { value: 'entertainment', label: 'Entertainment', color: 'primary' },
  { value: 'shopping', label: 'Shopping', color: 'primary' },
  { value: 'bills', label: 'Bills', color: 'primary' },
  { value: 'healthcare', label: 'Healthcare', color: 'primary' },
  { value: 'education', label: 'Education', color: 'primary' },
  { value: 'other', label: 'Other', color: 'primary' },
]

// Get category label
export const getCategoryLabel = (value) => {
  const category = CATEGORIES.find(cat => cat.value === value)
  return category ? category.label : value
}

// Get category color
export const getCategoryColor = (value) => {
  const category = CATEGORIES.find(cat => cat.value === value)
  return category ? category.color : 'primary'
}

export default transactionService
