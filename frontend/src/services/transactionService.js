import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || (import.meta.env.PROD 
  ? 'https://personal-finance-tracker-3-81s9.onrender.com/api'
  : '/api')

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const transactionService = {
  async healthCheck() {
    try {
      const response = await api.get('/health')
      return response.data
    } catch (error) {
      throw error
    }
  },

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

  async getTransaction(id) {
    const response = await api.get(`/transactions/${id}`)
    return response.data
  },

  async createTransaction(transactionData) {
    const response = await api.post('/transactions', transactionData)
    return response.data
  },

  async updateTransaction(id, transactionData) {
    const response = await api.put(`/transactions/${id}`, transactionData)
    return response.data
  },

  async deleteTransaction(id) {
    const response = await api.delete(`/transactions/${id}`)
    return response.data
  },

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

  async healthCheck() {
    const response = await api.get('/health')
    return response.data
  }
}


export default transactionService
