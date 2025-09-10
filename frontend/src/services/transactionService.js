import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`)
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
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const transactionService = {
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
