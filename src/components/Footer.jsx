import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Sparkles } from 'lucide-react'
import { FaYoutube, FaInstagram, FaPinterest, FaWhatsapp, FaTelegramPlane, FaRegComments } from 'react-icons/fa'

const Footer = () => {
  const categories = ['Electronics', 'Home & Kitchen', 'Fashion', 'Health & Wellness', 'Sports & Outdoors']

  return (
    <footer className="bg-[#13111c] border-t border-purple-500/20 text-purple-200 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse-glow"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse-glow"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="relative mr-2">
                <Sparkles className="h-7 w-7 text-amber-400 animate-pulse" />
                <div className="absolute inset-0 bg-amber-400/20 blur-xl rounded-full"></div>
              </div>
              <h3 className="text-2xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-300 to-emerald-300 drop-shadow-[0_2px_8px_rgba(251,191,36,0.2)]">
                Sallagar
              </h3>
            </div>
            <p className="text-gray-300 mb-4">
              Your trusted product advisor for honest blog posts and expert recommendations.
            </p>
            <div className="flex space-x-4">
              <a 
                href="http://www.youtube.com/@fanu1931" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-red-500 transition-all duration-300 hover:scale-110"
              >
                <FaYoutube className="h-5 w-5" />
              </a>
              <a 
                href="https://www.instagram.com/fanug1931?igsh=YjU1ZGMxd2hweDZn" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-pink-500 transition-all duration-300 hover:scale-110"
              >
                <FaInstagram className="h-5 w-5" />
              </a>
              <a 
                href="https://pin.it/28rYVXl2v" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-red-600 transition-all duration-300 hover:scale-110"
              >
                <FaPinterest className="h-5 w-5" />
              </a>
              <a 
                href="https://sharechat.com/profile/fanu1931?d=n" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:scale-110"
              >
                <FaRegComments className="h-5 w-5" />
              </a>
              <a 
                href="https://whatsapp.com/channel/0029VbCZhw48fewonRkeL034" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-green-500 transition-all duration-300 hover:scale-110"
              >
                <FaWhatsapp className="h-5 w-5" />
              </a>
              <a 
                href="https://t.me/fanu1931" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-110"
              >
                <FaTelegramPlane className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-purple-300">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-purple-300 transition-colors hover:translate-x-1 inline-block">Home</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-purple-300 transition-colors hover:translate-x-1 inline-block">Blog</Link></li>
              <li><Link to="/categories" className="text-gray-400 hover:text-purple-300 transition-colors hover:translate-x-1 inline-block">Categories</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-300 transition-colors hover:translate-x-1 inline-block">Buying Guides</a></li>
              <li><Link to="/about" className="text-gray-400 hover:text-purple-300 transition-colors hover:translate-x-1 inline-block">About Us</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-purple-300">Categories</h4>
            <ul className="space-y-2">
              {categories?.map((category) => (
                <li key={category}>
                  <a 
                    href={`/categories?category=${encodeURIComponent(category)}`}
                    className="text-gray-400 hover:text-purple-300 transition-colors hover:translate-x-1 inline-block"
                  >
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-purple-300">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-400 hover:text-purple-300 transition-colors">
                <Mail className="h-5 w-5 mr-2 text-purple-400" />
                <span>contact@sallagar.com</span>
              </li>
              <li className="flex items-center text-gray-400 hover:text-purple-300 transition-colors">
                <Phone className="h-5 w-5 mr-2 text-purple-400" />
                <span>+91 XXXXX XXXXX</span>
              </li>
              <li className="flex items-start text-gray-400 hover:text-purple-300 transition-colors">
                <MapPin className="h-5 w-5 mr-2 text-purple-400 mt-0.5" />
                <span>Mumbai, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700/50 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 Sallagar. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-purple-300 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-purple-300 transition-colors">Terms of Service</Link>
              <Link to="/disclaimer" className="text-gray-400 hover:text-purple-300 transition-colors">Disclaimer</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
