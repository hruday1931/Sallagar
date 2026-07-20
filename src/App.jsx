import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import Footer from './components/Footer'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import AdminLogin from './pages/AdminLogin'
import Categories from './pages/Categories'
import About from './pages/About'
import Contact from './pages/Contact'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import Disclaimer from './pages/Disclaimer'
import { DarkModeProvider } from './contexts/DarkModeContext'

function App() {
  return (
    <DarkModeProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1e1b2e] via-[#2d2545] to-[#13111c] text-white">
          <Header />
          <main className="flex-grow">
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
          </main>
          <Footer />
        </div>
      </Router>
    </DarkModeProvider>
  )
}

export default App
