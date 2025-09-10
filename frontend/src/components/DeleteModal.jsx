import { formatCurrency, formatDate } from '../services/transactionService'
import { AlertTriangle, X } from 'lucide-react'

const DeleteModal = ({ isOpen, onClose, onConfirm, transaction }) => {
  if (!isOpen || !transaction) return null

  const isIncome = transaction.amount > 0
  const amountColor = isIncome ? 'text-success-600' : 'text-danger-600'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-danger-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-danger-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Delete Transaction</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete this transaction? This action cannot be undone.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{transaction.title}</h3>
                <p className="text-sm text-gray-600">{formatDate(transaction.date)}</p>
              </div>
              <div className={`text-lg font-bold ${amountColor}`}>
                {isIncome ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
              </div>
            </div>
            {transaction.description && (
              <p className="text-sm text-gray-600 mt-2">{transaction.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn btn-danger"
          >
            Delete Transaction
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal
