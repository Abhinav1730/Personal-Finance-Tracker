import { AlertCircle, X } from 'lucide-react'

const ErrorMessage = ({ message, onDismiss }) => {
  return (
    <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-danger-400" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-danger-800">{message}</p>
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <button
              onClick={onDismiss}
              className="inline-flex text-danger-400 hover:text-danger-600 transition-colors duration-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ErrorMessage
