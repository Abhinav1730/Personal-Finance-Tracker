import { Routes, Route } from 'react-router-dom'
import { TransactionProvider } from './contexts/TransactionContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import AddTransaction from './pages/AddTransaction'
import EditTransaction from './pages/EditTransaction'
import Analytics from './pages/Analytics'

function App() {
  return (
    <TransactionProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddTransaction />} />
          <Route path="/edit/:id" element={<EditTransaction />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Layout>
    </TransactionProvider>
  )
}

export default App