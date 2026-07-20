import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import Footer from './components/Footer'
import { DarkModeProvider } from './contexts/DarkModeContext'

// Lazy load pages for better performance
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const Categories = lazy(() => import('./pages/Categories'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfService = lazy(() => import('./pages/TermsOfService'))
const Disclaimer = lazy(() => import('./pages/Disclaimer'))

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-gradient-to-b from-[#1e1b2e] via-[#2d2545] to-[#13111c] flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
      <p className="text-purple-400 font-medium">Loading...</p>
    </div>
  </div>
)

function App() {
  return (
    <DarkModeProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1e1b2e] via-[#2d2545] to-[#13111c] text-white">
          <Header />
          <main className="flex-grow">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Hero />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogPost />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/disclaimer" element={<Disclaimer />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </DarkModeProvider>
  )
}

export default App
