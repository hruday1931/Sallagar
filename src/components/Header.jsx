import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Menu, Sparkles, X, Lock, Shield, Sun, Moon } from 'lucide-react'
import { supabase } from '../supabaseClient'
import { useDarkMode } from '../contexts/DarkModeContext'

const Header = () => {
  const navigate = useNavigate()
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [isAdmin, setIsAdmin] = useState(() => {
    const token = localStorage.getItem('is_admin');
    // Strict check: only true if token is exactly the string 'true'
    // This prevents null, undefined, 'null', or any other value from being truthy
    return token === 'true';
  })

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/categories?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setIsSearchOpen(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('admin_password')
        .eq('id', 'config')
        .single();

      if (!error && data) {
        if (password === data.admin_password) {
          localStorage.setItem('is_admin', 'true');
          setIsAdmin(true);
          setIsModalOpen(false);
          setPassword('');
          window.location.href = '/blog';
        } else {
          setError("Wrong admin credentials!");
          setPassword('');
        }
      } else {
        console.error("Supabase connection error:", error);
        setError("Database connection failed. Check your network.");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false)
    }
  }

  const handleAdminClick = () => {
    setClickCount(prev => {
      const newCount = prev + 1;
      if (newCount === 5) {
        setIsModalOpen(true);
        return 0;
      }
      return newCount;
    });

    clearTimeout(window.clickResetTimeout);
    window.clickResetTimeout = setTimeout(() => {
      setClickCount(0);
    }, 2000);
  }

  const handleLogout = () => {
    localStorage.removeItem('is_admin');
    localStorage.clear();
    sessionStorage.clear();
    setIsAdmin(false);
    setIsModalOpen(false);
    // Force a hard reload to the home page to destroy any remaining React states
    window.location.replace('/');
  }

  const isAdminLoggedIn = isAdmin;
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#1e1b2e]/90 border-b border-purple-500/20 shadow-lg shadow-purple-500/20 transition-all duration-500 hover:shadow-xl hover:shadow-purple-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="relative mr-2">
                <Sparkles className="h-7 w-7 text-purple-400 animate-pulse group-hover:text-purple-300 transition-colors duration-200 group-hover:rotate-12 group-hover:scale-110" />
                <div className="absolute inset-0 bg-purple-400/20 blur-xl rounded-full group-hover:bg-purple-300/30 transition-colors duration-200"></div>
              </div>
              <h1 className="text-2xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-300 to-pink-300 drop-shadow-[0_2px_8px_rgba(168,85,247,0.2)] group-hover:scale-105 transition-transform duration-200">
                Sallagar
              </h1>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-1">
            <Link to="/" className="relative text-white hover:text-purple-300 px-5 py-2 rounded-full text-base font-semibold transition-all duration-200 group">
              <span className="relative z-10">Home</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-indigo-400 group-hover:w-full transition-all duration-300 ease-out rounded-full"></span>
            </Link>
            <Link to="/blog" className="relative text-white hover:text-purple-300 px-5 py-2 rounded-full text-base font-semibold transition-all duration-200 group">
              <span className="relative z-10">Blog</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-indigo-400 group-hover:w-full transition-all duration-300 ease-out rounded-full"></span>
            </Link>
            <Link to="/categories" className="relative text-white hover:text-purple-300 px-5 py-2 rounded-full text-base font-semibold transition-all duration-200 group">
              <span className="relative z-10">Product Sell</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-indigo-400 group-hover:w-full transition-all duration-300 ease-out rounded-full"></span>
            </Link>
            <Link to="/about" className="relative text-white hover:text-purple-300 px-5 py-2 rounded-full text-base font-semibold transition-all duration-200 group">
              <span className="relative z-10">About</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-indigo-400 group-hover:w-full transition-all duration-300 ease-out rounded-full"></span>
            </Link>
            <Link to="/contact" className="relative text-white hover:text-purple-300 px-5 py-2 rounded-full text-base font-semibold transition-all duration-200 group">
              <span className="relative z-10">Contact</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-indigo-400 group-hover:w-full transition-all duration-300 ease-out rounded-full"></span>
            </Link>
          </nav>

          {/* Search */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {isSearchOpen && (
                <form onSubmit={handleSearch} className="flex items-center mr-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="ब्लॉग किंवा प्रॉडक्ट्स शोधा..."
                    className="bg-white/10 text-white placeholder-purple-200/50 border border-purple-500/30 rounded-full px-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 w-48 transition-all duration-300"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchOpen(false)
                      setSearchQuery('')
                    }}
                    className="ml-2 p-2 text-white hover:text-purple-300 transition-colors duration-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </form>
              )}
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2.5 text-white hover:text-purple-300 hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-white/20"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-2.5 text-white hover:text-purple-300 hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-white/20"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={handleAdminClick}
              className="p-2.5 text-white hover:text-purple-300 hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-white/20"
              title="Admin Login"
            >
              <Lock className="h-5 w-5" />
            </button>
            <button className="md:hidden p-2.5 text-white hover:text-purple-300 hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-white/20">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 animate-in fade-in zoom-in duration-200">
            {isAdminLoggedIn ? (
              <>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mb-4">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Admin Logged In</h2>
                  <p className="text-slate-600">You are currently logged in as admin</p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-xl font-semibold transition-all duration-200"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Shield className="h-5 w-5" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mb-4">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Admin Login</h2>
                  <p className="text-slate-600">Enter your password to access admin features</p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
                        placeholder="Enter admin password"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false)
                        setPassword('')
                        setError('')
                      }}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-xl font-semibold transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Shield className="h-5 w-5" />
                          Login
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
