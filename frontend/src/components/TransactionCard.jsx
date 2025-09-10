import { formatCurrency, formatDate, getCategoryLabel } from '../utils/formatters'
import { Edit, Trash2, Calendar, Tag } from 'lucide-react'

const TransactionCard = ({ transaction, onEdit, onDelete }) => {
  const isIncome = transaction.amount > 0
  const amountColor = isIncome ? 'text-success-600' : 'text-danger-600'
  const amountBg = isIncome ? 'bg-success-50' : 'bg-danger-50'
  const amountIcon = isIncome ? '+' : '-'

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {transaction.title}
              </h3>
              {transaction.description && (
                <p className="text-gray-600 text-sm mb-2">
                  {transaction.description}
                </p>
              )}
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(transaction.date)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Tag className="h-4 w-4" />
                  <span className={`badge badge-category`}>
                    {getCategoryLabel(transaction.category)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className={`px-4 py-2 rounded-lg ${amountBg} ml-4`}>
              <div className={`text-lg font-bold ${amountColor}`}>
                {amountIcon}{formatCurrency(Math.abs(transaction.amount))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
            title="Edit transaction"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors duration-200"
            title="Delete transaction"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default TransactionCard
