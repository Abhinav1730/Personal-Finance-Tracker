import { createContext, useReducer, useEffect } from 'react'
import { transactionService } from '../services/transactionService'

const TransactionContext = createContext()

const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_TRANSACTIONS: 'SET_TRANSACTIONS',
  SET_SUMMARY: 'SET_SUMMARY',
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  UPDATE_TRANSACTION: 'UPDATE_TRANSACTION',
  DELETE_TRANSACTION: 'DELETE_TRANSACTION',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_FILTERS: 'SET_FILTERS',
  CLEAR_FILTERS: 'CLEAR_FILTERS'
}

// Initial state
const initialState = {
  transactions: [],
  summary: {
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    transactionCount: 0
  },
  loading: false,
  error: null,
  filters: {
    category: 'all',
    startDate: '',
    endDate: '',
    sortBy: 'date',
    sortOrder: 'desc'
  }
}

// Reducer function
function transactionReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload }
    
    case ACTIONS.SET_TRANSACTIONS:
      return { 
        ...state, 
        transactions: action.payload.transactions,
        summary: action.payload.summary,
        loading: false,
        error: null
      }
    
    case ACTIONS.SET_SUMMARY:
      return { ...state, summary: action.payload }
    
    case ACTIONS.ADD_TRANSACTION:
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
        summary: {
          ...state.summary,
          totalIncome: action.payload.amount > 0 
            ? state.summary.totalIncome + action.payload.amount
            : state.summary.totalIncome,
          totalExpenses: action.payload.amount < 0
            ? state.summary.totalExpenses + Math.abs(action.payload.amount)
            : state.summary.totalExpenses,
          balance: state.summary.balance + action.payload.amount,
          transactionCount: state.summary.transactionCount + 1
        }
      }
    
    case ACTIONS.UPDATE_TRANSACTION: {
      const updatedTransactions = state.transactions.map(transaction =>
        transaction._id === action.payload._id ? action.payload : transaction
      )
      return { ...state, transactions: updatedTransactions }
    }
    
    case ACTIONS.DELETE_TRANSACTION: {
      const filteredTransactions = state.transactions.filter(
        transaction => transaction._id !== action.payload
      )
      return { ...state, transactions: filteredTransactions }
    }
    
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false }
    
    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null }
    
    case ACTIONS.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } }
    
    case ACTIONS.CLEAR_FILTERS:
      return { ...state, filters: initialState.filters }
    
    default:
      return state
  }
}

export function TransactionProvider({ children }) {
  const [state, dispatch] = useReducer(transactionReducer, initialState)

  // Load transactions on component mount
  useEffect(() => {
    loadTransactions()
  }, [state.filters])

  const loadTransactions = async () => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true })
      const response = await transactionService.getTransactions(state.filters)
      dispatch({ 
        type: ACTIONS.SET_TRANSACTIONS, 
        payload: {
          transactions: response.data.transactions,
          summary: response.data.summary
        }
      })
    } catch (error) {
      dispatch({ 
        type: ACTIONS.SET_ERROR, 
        payload: error.response?.data?.message || 'Failed to load transactions'
      })
    }
  }

  // Add new transaction
  const addTransaction = async (transactionData) => {
    try {
      const response = await transactionService.createTransaction(transactionData)
      dispatch({ type: ACTIONS.ADD_TRANSACTION, payload: response.data })
      return response
    } catch (error) {
      dispatch({ 
        type: ACTIONS.SET_ERROR, 
        payload: error.response?.data?.message || 'Failed to create transaction'
      })
      throw error
    }
  }

  // Update transaction
  const updateTransaction = async (id, transactionData) => {
    try {
      const response = await transactionService.updateTransaction(id, transactionData)
      dispatch({ type: ACTIONS.UPDATE_TRANSACTION, payload: response.data })
      return response
    } catch (error) {
      dispatch({ 
        type: ACTIONS.SET_ERROR, 
        payload: error.response?.data?.message || 'Failed to update transaction'
      })
      throw error
    }
  }

  // Delete transaction
  const deleteTransaction = async (id) => {
    try {
      await transactionService.deleteTransaction(id)
      dispatch({ type: ACTIONS.DELETE_TRANSACTION, payload: id })
    } catch (error) {
      dispatch({ 
        type: ACTIONS.SET_ERROR, 
        payload: error.response?.data?.message || 'Failed to delete transaction'
      })
      throw error
    }
  }

  // Get single transaction
  const getTransaction = async (id) => {
    try {
      const response = await transactionService.getTransaction(id)
      return response
    } catch (error) {
      dispatch({ 
        type: ACTIONS.SET_ERROR, 
        payload: error.response?.data?.message || 'Failed to get transaction'
      })
      throw error
    }
  }

  // Set filters
  const setFilters = (filters) => {
    dispatch({ type: ACTIONS.SET_FILTERS, payload: filters })
  }

  // Clear filters
  const clearFilters = () => {
    dispatch({ type: ACTIONS.CLEAR_FILTERS })
  }

  // Clear error
  const clearError = () => {
    dispatch({ type: ACTIONS.CLEAR_ERROR })
  }

  // Get transaction statistics
  const getStats = async (filters = {}) => {
    try {
      const response = await transactionService.getStats(filters)
      return response
    } catch (error) {
      dispatch({ 
        type: ACTIONS.SET_ERROR, 
        payload: error.response?.data?.message || 'Failed to get statistics'
      })
      throw error
    }
  }

  const value = {
    ...state,
    loadTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransaction,
    setFilters,
    clearFilters,
    clearError,
    getStats
  }

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  )
}

export { TransactionContext }
