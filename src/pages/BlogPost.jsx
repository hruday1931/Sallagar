import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Calendar, Clock, ArrowLeft, Share2, Tag, Heart, Edit2, Eye } from 'lucide-react'
import { supabase } from '../supabaseClient'
import { isAdmin } from '../utils/adminAuth'
import { useDarkMode } from '../contexts/DarkModeContext'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

const BlogPost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isDarkMode } = useDarkMode()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isUserAdmin, setIsUserAdmin] = useState(() => {
    const token = localStorage.getItem('is_admin');
    // Strict check: only true if token is exactly the string 'true'
    // This prevents null, undefined, 'null', or any other value from being truthy
    return token === 'true';
  })
  const [relatedPosts, setRelatedPosts] = useState([])
  const [liked, setLiked] = useState(false)

  // Helper function to safely extract image URL from various formats
  const getImageUrl = (post) => {
    let imageUrl = post.image_url || post.image
    
    // If it's an object, try to extract URL from it
    if (typeof imageUrl === 'object' && imageUrl !== null) {
      imageUrl = imageUrl.url || imageUrl.src || JSON.stringify(imageUrl)
    }
    
    // If it's a string, process it
    if (typeof imageUrl === 'string') {
      const convertedUrl = convertUnsplashUrl(imageUrl)
      
      // If it's already a full URL (http/https), return it
      if (convertedUrl && (convertedUrl.startsWith('http://') || convertedUrl.startsWith('https://'))) {
        return convertedUrl
      }
      
      // If it's just a filename (from Supabase Storage), construct the public URL
      if (convertedUrl && !convertedUrl.startsWith('http://') && !convertedUrl.startsWith('https://')) {
        return `${supabaseUrl}/storage/v1/object/public/blog-images/${convertedUrl}`
      }
      
      // Fallback for invalid URLs
      return 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200'
    }
    
    // Fallback for invalid or missing images
    return 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200'
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
        
        // Increment views count
        await supabase
          .from('blogs')
          .update({ views: (data.views || 0) + 1 })
          .eq('id', id)
        
        // Update local state with new view count
        setPost(prev => ({ ...prev, views: (data.views || 0) + 1 }))
        
        // Fetch related posts
        if (data.category) {
          const { data: relatedData } = await supabase
            .from('blogs')
            .select('*')
            .eq('category', data.category)
            .neq('id', id)
            .limit(3)
          
          if (relatedData) {
            setRelatedPosts(relatedData)
          }
        }
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

  // Handle like button click
  const handleLike = async () => {
    if (!post) return
    
    const newLikedState = !liked
    setLiked(newLikedState)
    
    // Optimistic update
    const newLikesCount = newLikedState ? (post.likes || 0) + 1 : Math.max((post.likes || 0) - 1, 0)
    setPost(prev => ({ ...prev, likes: newLikesCount }))
    
    // Update in database
    await supabase
      .from('blogs')
      .update({ likes: newLikesCount })
      .eq('id', id)
  }

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-b from-[#022c22] to-[#0f172a]' : 'bg-gradient-to-b from-emerald-50 to-slate-100'} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 ${isDarkMode ? 'bg-gradient-to-br from-emerald-100 to-teal-100' : 'bg-gradient-to-br from-emerald-500 to-teal-600'} rounded-full mb-6 animate-pulse`}>
            <span className="text-3xl">📝</span>
          </div>
          <p className={`text-xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} mb-3`}>Loading...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-b from-[#022c22] to-[#0f172a]' : 'bg-gradient-to-b from-emerald-50 to-slate-100'} flex items-center justify-center`}>
        <div className="text-center">
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-4`}>Post Not Found</h1>
          <Link to="/blog" className={isDarkMode ? 'text-emerald-300 hover:text-emerald-200' : 'text-emerald-600 hover:text-emerald-700'}>
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  const postLang = post.language || 'en';

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-b from-[#022c22] to-[#0f172a] text-white' : 'bg-gradient-to-b from-emerald-50 to-slate-100 text-slate-900'}`}>
      {/* Premium Ambient Light Leaks */}
      {isDarkMode && (
        <>
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse" style={{animationDelay: '1s'}}></div>
        </>
      )}
      
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
        <div className={`absolute inset-0 bg-gradient-to-t ${isDarkMode ? 'from-[#022c22]' : 'from-slate-900/80'} to-transparent`} />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <Link 
              to="/blog"
              className={`inline-flex items-center ${isDarkMode ? 'text-white hover:text-emerald-300' : 'text-white hover:text-emerald-200'} transition-colors mb-4 hover:translate-x-1`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold inline-block mb-4">
              {post.category}
            </span>
            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${isDarkMode ? 'text-white' : 'text-white'} mb-4 drop-shadow-lg`}>
              {getLocalizedText(post.title, postLang)}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        {/* Meta Information */}
        <div className={`flex flex-wrap items-center gap-4 ${isDarkMode ? 'text-gray-300 border-b border-white/10' : 'text-slate-600 border-b border-slate-200'} mb-8 pb-8`}>
          <div className="flex items-center">
            <Calendar className={`h-4 w-4 mr-2 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center">
            <Clock className={`h-4 w-4 mr-2 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <span>{post.read_time || post.readTime}</span>
          </div>
          <div className="flex items-center">
            <Eye className={`h-4 w-4 mr-2 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <span>{post.views || 0} views</span>
          </div>
          <div className="flex items-center ml-auto">
            {isUserAdmin && (
              <button 
                onClick={handleEditClick}
                className={`flex items-center ${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-slate-600 hover:text-blue-600'} transition-colors hover:scale-110 mr-4`}
              >
                <Edit2 className="h-5 w-5 mr-2" />
                Edit
              </button>
            )}
            <button 
              onClick={handleLike}
              className={`flex items-center transition-colors hover:scale-110 mr-4 ${liked ? 'text-red-400' : (isDarkMode ? 'text-gray-300 hover:text-red-400' : 'text-slate-600 hover:text-red-600')}`}
            >
              <Heart className={`h-5 w-5 mr-2 ${liked ? 'fill-current' : ''}`} />
              {post.likes || 0}
            </button>
            <button className={`flex items-center ${isDarkMode ? 'text-gray-300 hover:text-emerald-400' : 'text-slate-600 hover:text-emerald-600'} transition-colors hover:scale-110`}>
              <Share2 className="h-5 w-5 mr-2" />
              Share
            </button>
          </div>
        </div>

        {/* Affiliate Disclosure */}
        {post?.has_affiliate === true && (
          <div className={`${isDarkMode ? 'bg-white/5 border-amber-500/20' : 'bg-amber-50 border-amber-200'} backdrop-blur-md border rounded-2xl p-4 mb-8 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300`}>
            <div className="flex">
              <div className="flex-shrink-0">
                <Tag className={`h-5 w-5 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
              </div>
              <div className="ml-3">
                <p className={`text-sm ${isDarkMode ? 'text-amber-200' : 'text-amber-800'}`}>
                  <strong>Affiliate Disclosure:</strong> This post contains affiliate links. If you make a purchase through these links, we may earn a commission at no extra cost to you.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Article Content */}
        <div 
          className={`whitespace-pre-line leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}
          dangerouslySetInnerHTML={{ __html: getLocalizedText(post.content, postLang) }}
        />

        {/* Affiliate CTA Section */}
        {post?.has_affiliate === true && post?.recommended_products && post.recommended_products.length > 0 && (
          <div className="mt-12 mb-8">
            <div className={`${isDarkMode ? 'bg-gradient-to-r from-emerald-500/20 to-amber-500/20 border-white/10' : 'bg-gradient-to-r from-emerald-100 to-amber-100 border-emerald-200'} backdrop-blur-md border rounded-2xl p-8`}>
              <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2 text-center`}>
                ⚡ Recommended Products for You
              </h3>
              <p className={`text-center ${isDarkMode ? 'text-gray-300' : 'text-slate-600'} mb-6`}>
                तुमच्यासाठी शिफारस केलेले प्रोडक्ट्स
              </p>
              
              {/* Product Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {post.recommended_products.map((product, index) => (
                  <div 
                    key={index}
                    className={`${isDarkMode ? 'bg-white/10 border-white/20 hover:border-emerald-400/50' : 'bg-white border-slate-200 hover:border-emerald-300'} backdrop-blur-md border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-2 hover:scale-[1.02]`}
                  >
                    {/* Product Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={product.image || product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400';
                        }}
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="p-5">
                      <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-3 line-clamp-2 text-lg`}>
                        {product.name}
                      </h4>
                      
                      <a 
                        href={product.link || product.affiliateLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-105 shadow-lg shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/50"
                      >
                        Buy Now 🛒
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className={`mt-12 pt-8 border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-6`}>
              Related Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => {
                const relatedPostLang = relatedPost.language || 'en';
                return (
                  <Link 
                    key={relatedPost.id} 
                    to={`/blog/${relatedPost.id}`}
                    className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'} backdrop-blur-md border rounded-2xl p-4 hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] block`}
                  >
                    <div className="relative mb-3">
                      <img 
                        src={getImageUrl(relatedPost)}
                        alt={getLocalizedText(relatedPost.title, relatedPostLang)}
                        className="w-full h-32 object-cover rounded-xl"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800';
                        }}
                      />
                    </div>
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2 line-clamp-2`}>
                      {getLocalizedText(relatedPost.title, relatedPostLang)}
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-600'} mb-3 line-clamp-2`}>
                      {getLocalizedText(relatedPost.excerpt, relatedPostLang)}
                    </p>
                    <span className={`text-sm font-semibold inline-block ${isDarkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'}`}>
                      Read More →
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogPost
