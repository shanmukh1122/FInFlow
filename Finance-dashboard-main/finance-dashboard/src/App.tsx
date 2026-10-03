// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Insights from './pages/Insights'
import Budgets from './pages/Budgets'
import Analytics from './pages/Analytics'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import { useStore } from './store/useStore'
import { CheckCircle, XCircle, Info } from 'lucide-react'
import './index.css'

function App() {
  const { notification, hideNotification } = useStore()

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="insights" element={<Insights />} />
            <Route path="budgets" element={<Budgets />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
      
      {notification && (
        <div className="fixed bottom-4 right-4 bg-gray-900 dark:bg-gray-800 text-white px-6 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-fade-in-up">
          {notification.type === 'success' && <CheckCircle size={20} className="text-green-400" />}
          {notification.type === 'error' && <XCircle size={20} className="text-red-400" />}
          {notification.type === 'info' && <Info size={20} className="text-blue-400" />}
          <span>{notification.message}</span>
        </div>
      )}
    </>
  )
}

export default App