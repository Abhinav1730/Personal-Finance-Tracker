import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTransactions } from '../hooks/useTransactions'
import { formatCurrency, formatDate, getCategoryLabel, getCategoryColor } from '../utils/formatters'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Filter, 
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Tag
} from 'lucide-react'
import TransactionCard from '../components/TransactionCard'
import FilterModal from '../components/FilterModal'
import DeleteModal from '../components/DeleteModal'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const Home = () => {
  const { 
    transactions, 
    summary, 
    loading, 
    error, 
    filters, 
    setFilters, 
    clearFilters,
    deleteTransaction 
  } = useTransactions()

  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [transactionToDelete, setTransactionToDelete] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(transaction =>
    transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCategoryLabel(transaction.category).toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteClick = (transaction) => {
    setTransactionToDelete(transaction)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (transactionToDelete) {
      try {
        await deleteTransaction(transactionToDelete._id)
        setShowDeleteModal(false)
        setTransactionToDelete(null)
      } catch (error) {
        console.error('Failed to delete transaction:', error)
      }
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setTransactionToDelete(null)
  }

  const hasActiveFilters = filters.category !== 'all' || filters.startDate || filters.endDate

  if (loading && transactions.length === 0) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Track your income and expenses</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/add"
            className="btn btn-primary btn-lg flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Transaction</span>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-success-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-success-600">
                {formatCurrency(summary.totalIncome)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-danger-100 rounded-lg">
              <TrendingDown className="h-6 w-6 text-danger-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-danger-600">
                {formatCurrency(summary.totalExpenses)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${
              summary.balance >= 0 ? 'bg-success-100' : 'bg-danger-100'
            }`}>
              <DollarSign className={`h-6 w-6 ${
                summary.balance >= 0 ? 'text-success-600' : 'text-danger-600'
              }`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Balance</p>
              <p className={`text-2xl font-bold ${
                summary.balance >= 0 ? 'text-success-600' : 'text-danger-600'
              }`}>
                {formatCurrency(summary.balance)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
            <button
              onClick={() => setShowFilterModal(true)}
              className={`btn btn-secondary flex items-center space-x-2 ${
                hasActiveFilters ? 'bg-primary-100 text-primary-700' : ''
              }`}
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1">
                  Active
                </span>
              )}
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="btn btn-secondary text-sm"
              >
                Clear Filters
              </button>
            )}
          </div>
          <div className="text-sm text-gray-600">
            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && <ErrorMessage message={error} />}

      {/* Transactions List */}
      <div className="space-y-4">
        {loading && transactions.length > 0 ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="card text-center py-12">
            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No transactions found' : 'No transactions yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms or filters'
                : 'Get started by adding your first transaction'
              }
            </p>
            {!searchTerm && (
              <Link to="/add" className="btn btn-primary">
                Add Your First Transaction
              </Link>
            )}
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <TransactionCard
              key={transaction._id}
              transaction={transaction}
              onEdit={() => window.location.href = `/edit/${transaction._id}`}
              onDelete={() => handleDeleteClick(transaction)}
            />
          ))
        )}
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        transaction={transactionToDelete}
      />
    </div>
  )
}

export default Home
