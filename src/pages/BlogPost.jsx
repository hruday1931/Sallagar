import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Calendar, Clock, ArrowLeft, Share2, Tag, Heart, Edit2 } from 'lucide-react'
import { supabase } from '../supabaseClient'
import { isAdmin } from '../utils/adminAuth'

const BlogPost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isUserAdmin, setIsUserAdmin] = useState(isAdmin())

  // Helper function to safely extract image URL from various formats
  const getImageUrl = (post) => {
    let imageUrl = post.image_url || post.image
    
    // If it's an object, try to extract URL from it
    if (typeof imageUrl === 'object' && imageUrl !== null) {
      imageUrl = imageUrl.url || imageUrl.src || JSON.stringify(imageUrl)
    }
    
    // If it's a string, convert Unsplash URLs
    if (typeof imageUrl === 'string') {
      return convertUnsplashUrl(imageUrl)
    }
    
    return imageUrl
  }

  // Helper function to safely extract language-specific text
  const getLocalizedText = (value, lang) => {
    if (!value) return ''
    
    // If it's a string, check if it's a JSON string
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value)
        if (typeof parsed === 'object' && parsed !== null) {
          return parsed[lang] || parsed['mr'] || parsed['en'] || value
        }
      } catch (e) {
        // Not a JSON string, return as-is
        return value
      }
      return value
    }
    
    // If it's an object, extract the language-specific value
    if (typeof value === 'object' && value !== null) {
      return value[lang] || value['mr'] || value['en'] || ''
    }
    
    // Fallback to string representation
    return String(value)
  }

  // Helper function to convert Unsplash page URL to direct image URL
  const convertUnsplashUrl = (url) => {
    if (!url || typeof url !== 'string') return 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800'
    
    // Trim whitespace
    url = url.trim()
    
    // If it's already a direct image URL (ends with image extension or has query params), return as-is
    if (url.match(/\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i) || url.includes('images.unsplash.com')) {
      return url
    }
    
    // If it's an Unsplash page URL, try to extract the photo ID and construct direct URL
    const match = url.match(/photos\/.*-([A-Za-z0-9_-]+)$/) || url.match(/photos\/([A-Za-z0-9_-]+)/)
    const id = match ? match[1] : null
    if (id) {
      return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`
    }
    
    // Return original URL if no conversion needed
    return url
  }

  // Fetch post from Supabase on mount
  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching post:', error)
        setError(error)
      } else {
        setPost(data)
      }
      setLoading(false)
    }

    fetchPost()
  }, [id])

  // Update admin status when localStorage changes
  useEffect(() => {
    const checkAdminStatus = () => {
      setIsUserAdmin(isAdmin())
    }
    
    window.addEventListener('storage', checkAdminStatus)
    return () => window.removeEventListener('storage', checkAdminStatus)
  }, [])

  // Handle edit button click
  const handleEditClick = () => {
    navigate('/blog', { state: { editPostId: id } })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#022c22] to-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full mb-6 animate-pulse">
            <span className="text-3xl">📝</span>
          </div>
          <p className="text-xl font-bold text-emerald-400 mb-3">Loading...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#022c22] to-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Post Not Found</h1>
          <Link to="/blog" className="text-emerald-300 hover:text-emerald-200">
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  const postLang = post.language || 'en';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#022c22] to-[#0f172a] text-white">
      {/* Premium Ambient Light Leaks */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse" style={{animationDelay: '1s'}}></div>
      
      {/* Header Image */}
      <div className="relative h-96">
        <img 
          src={getImageUrl(post)}
          alt={getLocalizedText(post.title, postLang)}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#022c22] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <Link 
              to="/blog"
              className="inline-flex items-center text-white hover:text-emerald-300 transition-colors mb-4 hover:translate-x-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold inline-block mb-4">
              {post.category}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              {getLocalizedText(post.title, postLang)}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-8 pb-8 border-b border-white/10">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-emerald-400" />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-emerald-400" />
            <span>{post.read_time || post.readTime}</span>
          </div>
          <div className="flex items-center ml-auto">
            {isUserAdmin && (
              <button 
                onClick={handleEditClick}
                className="flex items-center text-gray-300 hover:text-blue-400 transition-colors hover:scale-110 mr-4"
              >
                <Edit2 className="h-5 w-5 mr-2" />
                Edit
              </button>
            )}
            <button className="flex items-center text-gray-300 hover:text-emerald-400 transition-colors hover:scale-110">
              <Heart className="h-5 w-5 mr-2" />
              Save
            </button>
            <button className="flex items-center text-gray-300 hover:text-emerald-400 transition-colors ml-4 hover:scale-110">
              <Share2 className="h-5 w-5 mr-2" />
              Share
            </button>
          </div>
        </div>

        {/* Affiliate Disclosure */}
        <div className="bg-white/5 backdrop-blur-md border border-amber-500/20 rounded-2xl p-4 mb-8 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300">
          <div className="flex">
            <div className="flex-shrink-0">
              <Tag className="h-5 w-5 text-amber-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-200">
                <strong>Affiliate Disclosure:</strong> This post contains affiliate links. If you make a purchase through these links, we may earn a commission at no extra cost to you.
              </p>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div 
          className="whitespace-pre-line text-slate-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: getLocalizedText(post.content, postLang) }}
        />

        {/* Affiliate CTA Section */}
        <div className="mt-12 mb-8">
          <div className="bg-gradient-to-r from-emerald-500/20 to-amber-500/20 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Buy Recommended Products
            </h3>
            <p className="text-gray-300 mb-6">
              Check out our curated selection of products that align with the principles discussed in this article.
            </p>
            <button className="bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-105 shadow-lg shadow-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/60">
              See Advisor Picks
            </button>
          </div>
        </div>

        {/* Related Posts */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">
            Related Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02]">
                <h3 className="font-semibold text-white mb-2">Related Post Title {i}</h3>
                <p className="text-sm text-gray-300 mb-3">Brief description of related post content goes here.</p>
                <Link to="/blog" className="text-emerald-400 text-sm font-semibold hover:text-emerald-300 hover:translate-x-1 inline-block">
                  Read More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogPost
