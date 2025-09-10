import { useState, useEffect } from 'react'
import { useTransactions } from '../hooks/useTransactions'
import { formatCurrency, getCategoryLabel } from '../utils/formatters'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  Filter,
  Download
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import FilterModal from '../components/FilterModal'

const Analytics = () => {
  const { getStats, error, clearError } = useTransactions()
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: ''
  })

  const COLORS = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6b7280'
  ]

  useEffect(() => {
    loadStats()
  }, [filters])

  const loadStats = async () => {
    try {
      setIsLoading(true)
      const response = await getStats(filters)
      setStats(response.data)
    } catch (error) {
      console.error('Failed to load statistics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const prepareCategoryData = () => {
    if (!stats?.categoryStats) return []
    
    return Object.entries(stats.categoryStats).map(([category, data]) => ({
      name: getCategoryLabel(category),
      income: data.income,
      expenses: data.expenses,
      net: data.income - data.expenses,
      count: data.count
    })).sort((a, b) => b.net - a.net)
  }

  const preparePieData = () => {
    if (!stats?.categoryStats) return []
    
    return Object.entries(stats.categoryStats)
      .filter(([, data]) => data.expenses > 0)
      .map(([category, data]) => ({
        name: getCategoryLabel(category),
        value: data.expenses
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8) // Top 8 categories
  }

  const prepareMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    return months.map(month => ({
      month,
      income: Math.floor(Math.random() * 5000) + 2000,
      expenses: Math.floor(Math.random() * 4000) + 1000
    }))
  }

  const handleExportData = () => {
    if (!stats) return
    
    const dataStr = JSON.stringify(stats, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `finance-stats-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return <LoadingSpinner text="Loading analytics..." />
  }

  if (error) {
    return <ErrorMessage message={error} onDismiss={clearError} />
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No data available for analytics</p>
      </div>
    )
  }

  const categoryData = prepareCategoryData()
  const pieData = preparePieData()
  const monthlyData = prepareMonthlyData()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-2 text-gray-600">Insights into your financial data</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={() => setShowFilterModal(true)}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
          <button
            onClick={handleExportData}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-success-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-success-600">
                {formatCurrency(stats.summary.totalIncome)}
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
                {formatCurrency(stats.summary.totalExpenses)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${
              stats.summary.balance >= 0 ? 'bg-success-100' : 'bg-danger-100'
            }`}>
              <DollarSign className={`h-6 w-6 ${
                stats.summary.balance >= 0 ? 'text-success-600' : 'text-danger-600'
              }`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Net Balance</p>
              <p className={`text-2xl font-bold ${
                stats.summary.balance >= 0 ? 'text-success-600' : 'text-danger-600'
              }`}>
                {formatCurrency(stats.summary.balance)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-lg">
              <Calendar className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Transactions</p>
              <p className="text-2xl font-bold text-primary-600">
                {stats.summary.transactionCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    formatCurrency(value), 
                    name === 'income' ? 'Income' : name === 'expenses' ? 'Expenses' : 'Net'
                  ]}
                />
                <Bar dataKey="income" fill="#10b981" name="income" />
                <Bar dataKey="expenses" fill="#ef4444" name="expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trend</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  formatCurrency(value), 
                  name === 'income' ? 'Income' : 'Expenses'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#10b981" 
                strokeWidth={3}
                name="income"
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="#ef4444" 
                strokeWidth={3}
                name="expenses"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Details Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Details</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Income
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expenses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Count
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categoryData.map((category, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-success-600">
                    {formatCurrency(category.income)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-danger-600">
                    {formatCurrency(category.expenses)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    category.net >= 0 ? 'text-success-600' : 'text-danger-600'
                  }`}>
                    {formatCurrency(category.net)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onFiltersChange={setFilters}
        showCategoryFilter={false}
      />
    </div>
  )
}

export default Analytics
