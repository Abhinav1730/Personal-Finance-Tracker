import { formatCurrency, formatDate, getCategoryLabel } from '../utils/formatters'
import { Edit, Trash2, Calendar, Tag } from 'lucide-react'

const TransactionCard = ({ transaction, onEdit, onDelete }) => {
  const isIncome = transaction.amount > 0
  const amountColor = isIncome ? 'text-success-600' : 'text-danger-600'
  const amountBg = isIncome ? 'bg-success-50' : 'bg-danger-50'
  const amountIcon = isIncome ? '+' : '-'

  return (
    <div className="card group hover:scale-[1.02] transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                {transaction.title}
              </h3>
              {transaction.description && (
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                  {transaction.description}
                </p>
              )}
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{formatDate(transaction.date)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <span className={`badge badge-category`}>
                    {getCategoryLabel(transaction.category)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className={`px-6 py-4 rounded-2xl ${amountBg} ml-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
              <div className={`text-2xl font-bold ${amountColor}`}>
                {amountIcon}{formatCurrency(Math.abs(transaction.amount))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 ml-6">
          <button
            onClick={onEdit}
            className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 hover:scale-110"
            title="Edit transaction"
          >
            <Edit className="h-5 w-5" />
          </button>
          <button
            onClick={onDelete}
            className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 hover:scale-110"
            title="Delete transaction"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default TransactionCard
