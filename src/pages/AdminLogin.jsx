import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Shield } from 'lucide-react'
import { adminLogin } from '../utils/adminAuth'

const AdminLogin = () => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500))

    const success = adminLogin(password)

    if (success) {
      navigate('/blog')
    } else {
      setError('Invalid password. Please try again.')
      setPassword('')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-indigo-600 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse" style={{animationDelay: '1s'}}></div>

      <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin Login</h1>
          <p className="text-slate-600">Enter your password to access admin features</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
                placeholder="Enter admin password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-105 shadow-lg shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/50 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100"
          >
            {loading ? (
              <>
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Logging in...
              </>
            ) : (
              <>
                <Shield className="h-5 w-5" />
                Login as Admin
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/blog')}
            className="text-slate-600 hover:text-emerald-600 transition-colors text-sm font-medium"
          >
            ← Back to Blog
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-slate-500 text-center">
            Default password: <span className="font-mono bg-slate-100 px-2 py-1 rounded">admin123</span>
          </p>
          <p className="text-xs text-slate-400 text-center mt-1">
            Please change this in a production environment
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
