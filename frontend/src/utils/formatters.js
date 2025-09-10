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

export const getCategoryLabel = (value) => {
  const category = CATEGORIES.find(cat => cat.value === value)
  return category ? category.label : value
}

export const getCategoryColor = (value) => {
  const category = CATEGORIES.find(cat => cat.value === value)
  return category ? category.color : 'primary'
}
