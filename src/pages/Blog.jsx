import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, ArrowRight, Plus, Trash2, X, Loader2 } from 'lucide-react'
import { supabase } from '../supabaseClient'

const Blog = () => {
  const [showAdminForm, setShowAdminForm] = useState(false)
  const [posts, setPosts] = useState([])
  const [filterLang, setFilterLang] = useState('all')

  const categoryOptions = ['Good Thoughts', 'Health & Ayurveda', 'Motivation']

  // Helper function to safely extract language-specific value
  const getLocalizedValue = (value, lang) => {
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

  // Fetch posts from Supabase on mount
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching posts:', error)
      } else {
        setPosts(data || [])
      }
    }

    fetchPosts()
  }, [])

  // Form state for new blog post with manual multi-language inputs
  const [newPost, setNewPost] = useState({
    titleEn: '',
    titleMr: '',
    titleHi: '',
    excerptEn: '',
    excerptMr: '',
    excerptHi: '',
    contentEn: '',
    contentMr: '',
    contentHi: '',
    image: '',
    category: 'Good Thoughts',
    readTime: '',
    language: 'en'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Helper function to format current date
  const getCurrentDate = () => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date().toLocaleDateString('en-US', options)
  }

  // Handle adding a new blog post to Supabase with manual multi-language inputs
  const handleAddPost = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    console.log('=== Starting blog submission ===')
    console.log('Form data:', newPost)

    try {
      // Map manual inputs directly to database structure
      const { titleEn, titleMr, titleHi, excerptEn, excerptMr, excerptHi, contentEn, contentMr, contentHi, image, category, readTime, language } = newPost
      
      const payload = {
        title: { en: titleEn, mr: titleMr, hi: titleHi },
        excerpt: { en: excerptEn, mr: excerptMr, hi: excerptHi },
        content: { en: contentEn, mr: contentMr, hi: contentHi },
        image_url: convertUnsplashUrl(image),
        category: category,
        read_time: readTime,
        date: new Date().toLocaleDateString(),
        language: language
      }

      console.log('Payload to be sent to Supabase:', JSON.stringify(payload, null, 2))

      const { data, error } = await supabase
        .from('blogs')
        .insert([payload])
        .select()

      if (error) {
        console.error('=== Supabase insert error ===')
        console.error('Error details:', error)
        console.error('Error message:', error.message)
        console.error('Error code:', error.code)
        console.error('Error details:', error.details)
        console.error('Error hint:', error.hint)
        alert(`Failed to add blog post: ${error.message}`)
      } else {
        console.log('=== Blog post added successfully ===')
        console.log('Inserted data:', data)

        // Refresh posts from Supabase
        const { data: refreshedData, error: refreshError } = await supabase
          .from('blogs')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (refreshError) {
          console.error('Error refreshing posts:', refreshError)
        } else {
          console.log('Posts refreshed successfully')
          setPosts(refreshedData)
        }

        // Reset form
        setNewPost({
          titleEn: '',
          titleMr: '',
          titleHi: '',
          excerptEn: '',
          excerptMr: '',
          excerptHi: '',
          contentEn: '',
          contentMr: '',
          contentHi: '',
          image: '',
          category: 'Good Thoughts',
          readTime: '',
          language: 'en'
        })
        setShowAdminForm(false)
        alert('Blog post published successfully!')
      }
    } catch (error) {
      console.error('=== Unexpected error in handleAddPost ===')
      console.error('Error:', error)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      alert(`Failed to add blog post: ${error.message}`)
    } finally {
      setIsSubmitting(false)
      console.log('=== Blog submission process completed ===')
    }
  }

  // Handle deleting a blog post from Supabase
  const handleDeletePost = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting post:', error)
        alert('Failed to delete blog post. Please try again.')
      } else {
        // Refresh posts from Supabase
        const { data: refreshedData } = await supabase
          .from('blogs')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (refreshedData) {
          setPosts(refreshedData)
        }
      }
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-indigo-600 text-white py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse-glow"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse-glow"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-extrabold text-white tracking-wide mb-4">Blog</h1>
          <p className="text-xl text-white/90 max-w-2xl font-light">
            Changle Vichar, Health, Ayurveda, ani Motivation - आयुष्याचा खरा सल्लागार
          </p>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Language Filter Tabs */}
        <div className="mb-8 flex justify-center">
          <div className="bg-slate-900/10 backdrop-blur-sm border border-slate-300 rounded-full p-1 flex gap-2 inline-flex mx-auto">
            <button
              onClick={() => setFilterLang('all')}
              className={`px-4 py-1.5 rounded-full transition-all duration-200 ${
                filterLang === 'all' 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold shadow-md' 
                  : 'text-slate-700 hover:text-emerald-700 font-semibold transition-colors duration-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterLang('en')}
              className={`px-4 py-1.5 rounded-full transition-all duration-200 ${
                filterLang === 'en' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold shadow-md' 
                  : 'text-slate-700 hover:text-emerald-700 font-semibold transition-colors duration-200'
              }`}
            >
              🇬🇧 English
            </button>
            <button
              onClick={() => setFilterLang('mr')}
              className={`px-4 py-1.5 rounded-full transition-all duration-200 ${
                filterLang === 'mr' 
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold shadow-md' 
                  : 'text-slate-700 hover:text-emerald-700 font-semibold transition-colors duration-200'
              }`}
            >
              🇮🇳 मराठी
            </button>
            <button
              onClick={() => setFilterLang('hi')}
              className={`px-4 py-1.5 rounded-full transition-all duration-200 ${
                filterLang === 'hi' 
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold shadow-md' 
                  : 'text-slate-700 hover:text-emerald-700 font-semibold transition-colors duration-200'
              }`}
            >
              🇮🇳 हिंदी
            </button>
          </div>
        </div>

        {/* Admin Toggle Button */}
        <div className="mb-8 flex gap-3">
          <button
            onClick={() => setShowAdminForm(!showAdminForm)}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-5 py-3 rounded-2xl font-semibold transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-105 shadow-lg shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/50"
          >
            {showAdminForm ? (
              <>
                <X className="h-5 w-5" />
                Close Admin Panel
              </>
            ) : (
              <>
                <span className="text-lg">✨</span>
                Write New Blog
              </>
            )}
          </button>
        </div>

        {/* Admin Form */}
        {showAdminForm && (
          <div className="glassmorphism rounded-3xl shadow-xl p-8 mb-12 animate-slide-down">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <span className="text-2xl">✨</span>
              Write New Blog Post
            </h2>
            <form onSubmit={handleAddPost} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Language Selector */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-800 mb-3 text-lg">Primary Language</label>
                  <select
                    required
                    value={newPost.language}
                    onChange={(e) => setNewPost({...newPost, language: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
                  >
                    <option value="en">🇬🇧 English</option>
                    <option value="mr">🇮🇳 मराठी (Marathi)</option>
                    <option value="hi">🇮🇳 हिंदी (Hindi)</option>
                  </select>
                  <p className="text-xs text-slate-500 mt-2">Select the primary language for this blog post</p>
                </div>

                {/* ENGLISH SECTION */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-800 mb-3 text-lg flex items-center gap-2">
                    <span className="text-2xl">🇬🇧</span> English Section
                  </label>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Title (English)</label>
                      <input
                        type="text"
                        required={newPost.language === 'en'}
                        value={newPost.titleEn}
                        onChange={(e) => setNewPost({...newPost, titleEn: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
                        placeholder="Blog title in English"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Excerpt (English)</label>
                      <textarea
                        required={newPost.language === 'en'}
                        value={newPost.excerptEn}
                        onChange={(e) => setNewPost({...newPost, excerptEn: e.target.value})}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
                        placeholder="Short description in English"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Content (English)</label>
                      <textarea
                        required={newPost.language === 'en'}
                        value={newPost.contentEn}
                        onChange={(e) => setNewPost({...newPost, contentEn: e.target.value})}
                        rows="6"
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
                        placeholder="Full blog content in English"
                      />
                    </div>
                  </div>
                </div>

                {/* MARATHI SECTION */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-800 mb-3 text-lg flex items-center gap-2">
                    <span className="text-2xl">🇮🇳</span> मराठी विभाग (Marathi Section)
                  </label>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">शीर्षक (मराठी)</label>
                      <input
                        type="text"
                        required={newPost.language === 'mr'}
                        value={newPost.titleMr}
                        onChange={(e) => setNewPost({...newPost, titleMr: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
                        placeholder="ब्लॉग शीर्षक मराठीत"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">थोडक्यात वर्णन (मराठी)</label>
                      <textarea
                        required={newPost.language === 'mr'}
                        value={newPost.excerptMr}
                        onChange={(e) => setNewPost({...newPost, excerptMr: e.target.value})}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
                        placeholder="थोडक्यात वर्णन मराठीत"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">सामग्री (मराठी)</label>
                      <textarea
                        required={newPost.language === 'mr'}
                        value={newPost.contentMr}
                        onChange={(e) => setNewPost({...newPost, contentMr: e.target.value})}
                        rows="6"
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
                        placeholder="पूर्ण ब्लॉग सामग्री मराठीत"
                      />
                    </div>
                  </div>
                </div>

                {/* HINDI SECTION */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-800 mb-3 text-lg flex items-center gap-2">
                    <span className="text-2xl">🇮🇳</span> हिंदी विभाग (Hindi Section)
                  </label>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">शीर्षक (हिंदी)</label>
                      <input
                        type="text"
                        required={newPost.language === 'hi'}
                        value={newPost.titleHi}
                        onChange={(e) => setNewPost({...newPost, titleHi: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
                        placeholder="ब्लॉग शीर्षक हिंदी में"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">थोड़ा विवरण (हिंदी)</label>
                      <textarea
                        required={newPost.language === 'hi'}
                        value={newPost.excerptHi}
                        onChange={(e) => setNewPost({...newPost, excerptHi: e.target.value})}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
                        placeholder="थोड़ा विवरण हिंदी में"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">सामग्री (हिंदी)</label>
                      <textarea
                        required={newPost.language === 'hi'}
                        value={newPost.contentHi}
                        onChange={(e) => setNewPost({...newPost, contentHi: e.target.value})}
                        rows="6"
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
                        placeholder="पूर्ण ब्लॉग सामग्री हिंदी में"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Image URL (फोटोची लिंक)</label>
                  <input
                    type="url"
                    required
                    value={newPost.image}
                    onChange={(e) => setNewPost({...newPost, image: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                  <select
                    required
                    value={newPost.category}
                    onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
                  >
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Read Time (उदा. 5 min read)</label>
                  <input
                    type="text"
                    required
                    value={newPost.readTime}
                    onChange={(e) => setNewPost({...newPost, readTime: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
                    placeholder="5 min read"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-105 shadow-lg shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      Publish Blog
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdminForm(false)}
                  className="glassmorphism text-slate-700 px-8 py-3 rounded-2xl font-semibold transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-105 shadow-md hover:shadow-xl hover:shadow-emerald-200/50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts
            .filter(post => filterLang === 'all' || post.language === filterLang)
            .map((post) => {
              const postLang = post.language || 'en';
              return (
                <article key={post.id} className="glassmorphism rounded-3xl shadow-md overflow-hidden hover:shadow-2xl hover:shadow-emerald-200/50 transition-all duration-500 ease-out hover:-translate-y-3 hover:scale-[1.02]">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>
                    <img 
                      src={getImageUrl(post)}
                      alt={getLocalizedText(post.title, postLang)}
                      className="w-full h-56 object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800';
                      }}
                    />
                    <div className="absolute top-4 left-4 flex gap-2 z-20">
                      <span className={`px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-sm ${
                        post.category === 'Good Thoughts' || post.category === 'चांगले विचार' || post.category === 'अच्छे विचार' ? 'bg-purple-100/80 text-purple-700' :
                        post.category === 'Health & Ayurveda' || post.category === 'आरोग्य आणि आयुर्वेद' || post.category === 'स्वास्थ्य और आयुर्वेद' ? 'bg-emerald-100/80 text-emerald-700' :
                        'bg-orange-100/80 text-orange-700'
                      }`}>
                        {post.category}
                      </span>
                      <span className={`px-3 py-2 rounded-full text-xs font-semibold backdrop-blur-sm ${
                        postLang === 'en' ? 'bg-blue-100/80 text-blue-700' :
                        postLang === 'mr' ? 'bg-purple-100/80 text-purple-700' :
                        'bg-orange-100/80 text-orange-700'
                      }`}>
                        {postLang === 'en' ? '🇬🇧 EN' : postLang === 'mr' ? '🇮🇳 मराठी' : '🇮🇳 हिंदी'}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="absolute top-4 right-4 bg-red-500/90 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition-all duration-300 z-20 backdrop-blur-sm hover:scale-110"
                      title="Delete blog post"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center text-sm text-slate-500 mb-3">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="mr-4">{post.date}</span>
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{post.read_time || post.readTime}</span>
                    </div>
                    
                    <h2 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 hover:text-emerald-600 transition-colors">
                      <Link to={`/blog/${post.id}`}>
                        {getLocalizedText(post.title, postLang)}
                      </Link>
                    </h2>
                    
                    <p className="text-slate-600 mb-4 line-clamp-3">
                      {getLocalizedText(post.excerpt, postLang)}
                    </p>
                    
                    <Link 
                      to={`/blog/${post.id}`}
                      className="inline-flex items-center text-emerald-600 font-semibold hover:text-emerald-700 transition-colors hover:translate-x-1"
                    >
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full mb-6">
              <span className="text-4xl">📝</span>
            </div>
            <p className="text-2xl font-bold text-emerald-600 mb-3">अजून एकही ब्लॉग उपलब्ध नाही</p>
            <p className="text-lg text-white font-medium bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 rounded-full inline-block shadow-lg">
              नवीन ब्लॉग जोडण्यासाठी 'Write New Blog' वर क्लिक करा!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Blog
