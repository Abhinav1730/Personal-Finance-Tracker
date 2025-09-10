export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
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
  // Income categories
  { value: 'salary', label: 'Salary', color: 'success', type: 'income' },
  { value: 'freelance', label: 'Freelance', color: 'success', type: 'income' },
  { value: 'investment', label: 'Investment', color: 'success', type: 'income' },
  { value: 'business', label: 'Business', color: 'success', type: 'income' },
  { value: 'gift', label: 'Gift', color: 'success', type: 'income' },
  { value: 'other_income', label: 'Other Income', color: 'success', type: 'income' },
  
  // Expense categories
  { value: 'food', label: 'Food & Dining', color: 'danger', type: 'expense' },
  { value: 'transportation', label: 'Transportation', color: 'danger', type: 'expense' },
  { value: 'entertainment', label: 'Entertainment', color: 'danger', type: 'expense' },
  { value: 'shopping', label: 'Shopping', color: 'danger', type: 'expense' },
  { value: 'bills', label: 'Bills & Utilities', color: 'danger', type: 'expense' },
  { value: 'healthcare', label: 'Healthcare', color: 'danger', type: 'expense' },
  { value: 'education', label: 'Education', color: 'danger', type: 'expense' },
  { value: 'rent', label: 'Rent & Housing', color: 'danger', type: 'expense' },
  { value: 'other_expense', label: 'Other Expense', color: 'danger', type: 'expense' },
]

export const getCategoryLabel = (value) => {
  const category = CATEGORIES.find(cat => cat.value === value)
  return category ? category.label : value
}

export const getCategoryColor = (value) => {
  const category = CATEGORIES.find(cat => cat.value === value)
  return category ? category.color : 'primary'
}
