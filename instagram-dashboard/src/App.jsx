import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Composer from './pages/Composer'
import Settings from './pages/Settings'
import History from './pages/History'
import Analytics from './pages/Analytics'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import useAuth from './hooks/useAuth'

function App() {
  const { user } = useAuth()

  if (!user) {
    return <Login />
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Topbar />
          <main className="p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/composer" element={<Composer />} />
              <Route path="/history" element={<History />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App
