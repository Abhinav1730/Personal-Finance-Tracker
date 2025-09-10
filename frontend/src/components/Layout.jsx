import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Plus, 
  BarChart3, 
  Menu, 
  X,
  DollarSign
} from 'lucide-react'
import { useState } from 'react'

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Add Transaction', href: '/add', icon: Plus },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-3 rounded-2xl bg-white/90 backdrop-blur-md shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-700" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white/90 backdrop-blur-xl shadow-2xl border-r border-white/20 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-8 py-6 border-b border-gray-100/50">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                <DollarSign className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">Finance Tracker</h1>
                <p className="text-sm text-gray-600 font-medium">Manage your money</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 py-6 space-y-3">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center px-5 py-4 text-sm font-semibold rounded-2xl transition-all duration-300 group
                    ${isActive(item.href)
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-200 transform scale-105'
                      : 'text-gray-700 hover:bg-white/60 hover:text-gray-900 hover:shadow-md hover:transform hover:scale-105'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 mr-4 transition-colors duration-300 ${
                    isActive(item.href) ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                  }`} />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="px-6 py-6 border-t border-gray-100/50">
            <div className="text-xs text-gray-500 text-center space-y-1">
              <p className="font-medium">Personal Finance Tracker</p>
              <p className="text-gray-400">v1.0.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:pl-72">
        <main className="min-h-screen">
          <div className="w-full px-6 sm:px-8 lg:px-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
