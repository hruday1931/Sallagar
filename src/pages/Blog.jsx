import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Calendar, Clock, ArrowRight, Plus, Trash2, X, Loader2, Shield, Edit2, Lock, Search, Eye, Heart } from 'lucide-react'
import { supabase } from '../supabaseClient'
import { isAdmin, adminLogout } from '../utils/adminAuth'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

const Blog = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [showAdminForm, setShowAdminForm] = useState(false)
  const [posts, setPosts] = useState([])
  const [filterLang, setFilterLang] = useState('all')
  const [isUserAdmin, setIsUserAdmin] = useState(() => {
    const token = localStorage.getItem('is_admin');
    // Strict check: only true if token is exactly the string 'true'
    // This prevents null, undefined, 'null', or any other value from being truthy
    return token === 'true';
  })
  const [editingPost, setEditingPost] = useState(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  const categoryOptions = [
    'Good Thoughts',
    'Health & Ayurveda', 
    'Motivation',
    'निसर्ग / Nature',
    'जीवनशैली / Lifestyle',
    'अध्यात्म / Spirituality',
    'विचार / Thoughts'
  ]

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

  // Filter posts based on category and search query
  const filteredBlogs = posts.filter(blog => {
    const matchesCategory = activeCategory === 'All' || blog.category?.toLowerCase() === activeCategory.toLowerCase();
    const titleText = (blog.title?.en || blog.title?.mr || blog.title?.hi || "").toLowerCase();
    const contentText = (blog.content?.en || blog.content?.mr || blog.content?.hi || "").toLowerCase();
    const matchesSearch = titleText.includes(searchQuery.toLowerCase()) || contentText.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

  // Update admin status when localStorage changes
  useEffect(() => {
    const checkAdminStatus = () => {
      setIsUserAdmin(isAdmin())
    }
    
    window.addEventListener('storage', checkAdminStatus)
    return () => window.removeEventListener('storage', checkAdminStatus)
  }, [])

  // Handle edit from BlogPost page
  useEffect(() => {
    const state = location?.state
    if (state?.editPostId) {
      const postToEdit = posts.find(p => p.id === state.editPostId)
      if (postToEdit && isUserAdmin) {
        handleEditPost(postToEdit)
        // Clear the state to prevent re-triggering
        navigate(location.pathname, { replace: true, state: {} })
      }
    }
  }, [posts, isUserAdmin, location, navigate])

  // Handle admin logout
  const handleLogout = () => {
    adminLogout()
    setIsUserAdmin(false)
    setShowAdminForm(false)
    setEditingPost(null)
  }

  // Handle edit mode
  const handleEditPost = (post) => {
    // Route protection: Check if user is admin
    if (!isUserAdmin) {
      alert('Access denied. Only admins can edit blog posts.')
      navigate('/admin-login')
      return
    }
    
    setEditingPost(post)
    setShowAdminForm(true)
    
    // Parse the post data to populate the form
    const title = typeof post.title === 'string' ? JSON.parse(post.title) : post.title
    const excerpt = typeof post.excerpt === 'string' ? JSON.parse(post.excerpt) : post.excerpt
    const content = typeof post.content === 'string' ? JSON.parse(post.content) : post.content
    
    setNewPost({
      titleEn: title.en || '',
      titleMr: title.mr || '',
      titleHi: title.hi || '',
      excerptEn: excerpt.en || '',
      excerptMr: excerpt.mr || '',
      excerptHi: excerpt.hi || '',
      contentEn: content.en || '',
      contentMr: content.mr || '',
      contentHi: content.hi || '',
      image: post.image_url || post.image || '',
      category: post.category || 'Good Thoughts',
      readTime: post.read_time || post.readTime || '',
      language: post.language || 'en',
      hasAffiliate: post.has_affiliate || false
    })
  }

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
    language: 'en',
    hasAffiliate: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Helper function to format current date
  const getCurrentDate = () => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date().toLocaleDateString('en-US', options)
  }

  // Handle image upload to Supabase Storage
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    try {
      setIsSubmitting(true)
      
      // Generate unique file path
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = fileName

      // Upload to Supabase Storage with options
      const { data, error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) {
        console.error("Supabase Storage Error Details:", uploadError)
        alert(`Upload Failed: ${uploadError.message || JSON.stringify(uploadError)}`)
        setIsSubmitting(false)
        return
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath)

      // Update form state with the public URL
      setNewPost({ ...newPost, image: publicUrl })
      
      console.log('Image uploaded successfully:', publicUrl)
      setIsSubmitting(false)
    } catch (err) {
      console.error("General Upload Catch Block Error:", err)
      alert(`Error: ${err.message || err}`)
      setIsSubmitting(false)
    }
  }

  // Handle adding a new blog post or updating an existing one
  const handleAddPost = async (e) => {
    e.preventDefault()
    
    // Route protection: Check if user is admin
    if (!isUserAdmin) {
      alert('Access denied. Only admins can create or edit blog posts.')
      setShowAdminForm(false)
      setEditingPost(null)
      return
    }
    
    setIsSubmitting(true)

    console.log('=== Starting blog submission ===')
    console.log('Form data:', newPost)
    console.log('Edit mode:', !!editingPost)

    try {
      // Map manual inputs directly to database structure
      const { titleEn, titleMr, titleHi, excerptEn, excerptMr, excerptHi, contentEn, contentMr, contentHi, image, category, readTime, language, hasAffiliate } = newPost
      
      const payload = {
        title: { en: titleEn, mr: titleMr, hi: titleHi },
        excerpt: { en: excerptEn, mr: excerptMr, hi: excerptHi },
        content: { en: contentEn, mr: contentMr, hi: contentHi },
        image_url: image, // Use the image URL directly (already from Supabase Storage or converted URL)
        category: category,
        read_time: readTime,
        language: language,
        has_affiliate: hasAffiliate
      }

      console.log('Payload to be sent to Supabase:', JSON.stringify(payload, null, 2))

      let result
      if (editingPost) {
        // Update existing post
        result = await supabase
          .from('blogs')
          .update(payload)
          .eq('id', editingPost.id)
          .select()
      } else {
        // Insert new post
        payload.date = new Date().toLocaleDateString()
        result = await supabase
          .from('blogs')
          .insert([payload])
          .select()
      }

      const { data, error } = result

      if (error) {
        console.error('=== Supabase error ===')
        console.error('Error details:', error)
        console.error('Error message:', error.message)
        console.error('Error code:', error.code)
        console.error('Error details:', error.details)
        console.error('Error hint:', error.hint)
        alert(`Failed to ${editingPost ? 'update' : 'add'} blog post: ${error.message}`)
      } else {
        console.log(`=== Blog post ${editingPost ? 'updated' : 'added'} successfully ===`)
        console.log('Data:', data)

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
          language: 'en',
          hasAffiliate: false
        })
        setShowAdminForm(false)
        setEditingPost(null)
        alert(`Blog post ${editingPost ? 'updated' : 'published'} successfully!`)
      }
    } catch (error) {
      console.error('=== Unexpected error in handleAddPost ===')
      console.error('Error:', error)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      alert(`Failed to ${editingPost ? 'update' : 'add'} blog post: ${error.message}`)
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

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')
    setIsUpdatingPassword(true)

    try {
      // Validate inputs
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        setPasswordError('All fields are required')
        setIsUpdatingPassword(false)
        return
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordError('New password and confirm password do not match')
        setIsUpdatingPassword(false)
        return
      }

      if (passwordData.newPassword.length < 6) {
        setPasswordError('New password must be at least 6 characters long')
        setIsUpdatingPassword(false)
        return
      }

      // Fetch current password from database
      const { data: currentData, error: fetchError } = await supabase
        .from('admin_settings')
        .select('password')
        .eq('id', 1)
        .single()

      if (fetchError) {
        setPasswordError('Failed to verify current password. Please try again.')
        setIsUpdatingPassword(false)
        return
      }

      // Verify current password
      if (passwordData.currentPassword !== currentData.password) {
        setPasswordError('Current password is incorrect')
        setIsUpdatingPassword(false)
        return
      }

      // Update password in database
      const { error: updateError } = await supabase
        .from('admin_settings')
        .update({ password: passwordData.newPassword })
        .eq('id', 1)

      if (updateError) {
        setPasswordError('Failed to update password. Please try again.')
        setIsUpdatingPassword(false)
        return
      }

      setPasswordSuccess('Password updated successfully!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setShowPasswordForm(false)

      // Auto logout after password change for security
      setTimeout(() => {
        handleLogout()
      }, 2000)

    } catch (error) {
      console.error('Error changing password:', error)
      setPasswordError('An unexpected error occurred. Please try again.')
    } finally {
      setIsUpdatingPassword(false)
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
            Good Thoughts, Health, Ayurveda, ani Motivation - आयुष्याचा खरा सल्लागार
          </p>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Language Filter Tabs */}
        <div className="mb-8 flex justify-center">
          <div className="bg-slate-900/10 dark:bg-slate-700/30 backdrop-blur-sm border border-slate-300 dark:border-slate-600 rounded-full p-1 flex gap-2 inline-flex mx-auto">
            <button
              onClick={() => setFilterLang('all')}
              className={`px-4 py-1.5 rounded-full transition-all duration-200 ${
                filterLang === 'all' 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold shadow-md' 
                  : 'text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 font-semibold transition-colors duration-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterLang('en')}
              className={`px-4 py-1.5 rounded-full transition-all duration-200 ${
                filterLang === 'en' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold shadow-md' 
                  : 'text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 font-semibold transition-colors duration-200'
              }`}
            >
              🇬🇧 English
            </button>
            <button
              onClick={() => setFilterLang('mr')}
              className={`px-4 py-1.5 rounded-full transition-all duration-200 ${
                filterLang === 'mr' 
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold shadow-md' 
                  : 'text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 font-semibold transition-colors duration-200'
              }`}
            >
              🇮🇳 मराठी
            </button>
            <button
              onClick={() => setFilterLang('hi')}
              className={`px-4 py-1.5 rounded-full transition-all duration-200 ${
                filterLang === 'hi' 
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold shadow-md' 
                  : 'text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 font-semibold transition-colors duration-200'
              }`}
            >
              🇮🇳 हिंदी
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="glassmorphism rounded-3xl shadow-lg p-6">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blogs by title or content..."
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all duration-300 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>
          </div>
        </div>

        {/* Category Filter Buttons */}
        <div className="mb-8">
          <div className="glassmorphism rounded-3xl shadow-lg p-6 dark:bg-slate-800/50 dark:border-slate-700">
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => setActiveCategory('All')}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                  activeCategory === 'All'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                All Blogs
              </button>
              <button
                onClick={() => setActiveCategory('Good Thoughts')}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                  activeCategory === 'Good Thoughts'
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                Good Thoughts
              </button>
              <button
                onClick={() => setActiveCategory('Health')}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                  activeCategory === 'Health'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                Health
              </button>
              <button
                onClick={() => setActiveCategory('Ayurveda')}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                  activeCategory === 'Ayurveda'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                Ayurveda
              </button>
              <button
                onClick={() => setActiveCategory('Motivation')}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                  activeCategory === 'Motivation'
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                Motivation
              </button>
            </div>
          </div>
        </div>

        {/* Admin Toggle Button */}
        <div className="mb-8 flex gap-3">
          {isUserAdmin && (
            <>
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
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 py-3 rounded-2xl font-semibold transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-105 shadow-lg shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/50"
              >
                <Lock className="h-5 w-5" />
                Change Password
              </button>
            </>
          )}
        </div>

        {/* Admin Form */}
        {showAdminForm && isUserAdmin && (
          <div className="glassmorphism rounded-3xl shadow-xl p-8 mb-12 animate-slide-down dark:bg-slate-800/80">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-3">
              <span className="text-2xl">✨</span>
              {editingPost ? 'Edit Blog Post' : 'Write New Blog Post'}
            </h2>
            <form onSubmit={handleAddPost} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Language Selector */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 text-lg">Primary Language</label>
                  <select
                    required
                    value={newPost.language}
                    onChange={(e) => setNewPost({...newPost, language: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all duration-300 text-slate-900 dark:text-slate-100"
                  >
                    <option value="en">🇬🇧 English</option>
                    <option value="mr">🇮🇳 मराठी (Marathi)</option>
                    <option value="hi">🇮🇳 हिंदी (Hindi)</option>
                  </select>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Select the primary language for this blog post</p>
                </div>

                {/* ENGLISH SECTION */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 text-lg flex items-center gap-2">
                    <span className="text-2xl">🇬🇧</span> English Section
                  </label>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Title (English)</label>
                      <input
                        type="text"
                        required={newPost.language === 'en'}
                        value={newPost.titleEn}
                        onChange={(e) => setNewPost({...newPost, titleEn: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all duration-300 text-slate-900 dark:text-slate-100"
                        placeholder="Blog title in English"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Excerpt (English)</label>
                      <textarea
                        required={newPost.language === 'en'}
                        value={newPost.excerptEn}
                        onChange={(e) => setNewPost({...newPost, excerptEn: e.target.value})}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all duration-300 text-slate-900 dark:text-slate-100"
                        placeholder="Short description in English"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Content (English)</label>
                      <textarea
                        required={newPost.language === 'en'}
                        value={newPost.contentEn}
                        onChange={(e) => setNewPost({...newPost, contentEn: e.target.value})}
                        rows="6"
                        className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all duration-300 text-slate-900 dark:text-slate-100"
                        placeholder="Full blog content in English"
                      />
                    </div>
                  </div>
                </div>

                {/* MARATHI SECTION */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 text-lg flex items-center gap-2">
                    <span className="text-2xl">🇮🇳</span> मराठी विभाग (Marathi Section)
                  </label>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">शीर्षक (मराठी)</label>
                      <input
                        type="text"
                        required={newPost.language === 'mr'}
                        value={newPost.titleMr}
                        onChange={(e) => setNewPost({...newPost, titleMr: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all duration-300 text-slate-900 dark:text-slate-100"
                        placeholder="ब्लॉग शीर्षक मराठीत"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">थोडक्यात वर्णन (मराठी)</label>
                      <textarea
                        required={newPost.language === 'mr'}
                        value={newPost.excerptMr}
                        onChange={(e) => setNewPost({...newPost, excerptMr: e.target.value})}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all duration-300 text-slate-900 dark:text-slate-100"
                        placeholder="थोडक्यात वर्णन मराठीत"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">सामग्री (मराठी)</label>
                      <textarea
                        required={newPost.language === 'mr'}
                        value={newPost.contentMr}
                        onChange={(e) => setNewPost({...newPost, contentMr: e.target.value})}
                        rows="6"
                        className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all duration-300 text-slate-900 dark:text-slate-100"
                        placeholder="पूर्ण ब्लॉग सामग्री मराठीत"
                      />
                    </div>
                  </div>
                </div>

                {/* HINDI SECTION */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 text-lg flex items-center gap-2">
                    <span className="text-2xl">🇮🇳</span> हिंदी विभाग (Hindi Section)
                  </label>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">शीर्षक (हिंदी)</label>
                      <input
                        type="text"
                        required={newPost.language === 'hi'}
                        value={newPost.titleHi}
                        onChange={(e) => setNewPost({...newPost, titleHi: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all duration-300 text-slate-900 dark:text-slate-100"
                        placeholder="ब्लॉग शीर्षक हिंदी में"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">थोड़ा विवरण (हिंदी)</label>
                      <textarea
                        required={newPost.language === 'hi'}
                        value={newPost.excerptHi}
                        onChange={(e) => setNewPost({...newPost, excerptHi: e.target.value})}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all duration-300 text-slate-900 dark:text-slate-100"
                        placeholder="थोड़ा विवरण हिंदी में"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">सामग्री (हिंदी)</label>
                      <textarea
                        required={newPost.language === 'hi'}
                        value={newPost.contentHi}
                        onChange={(e) => setNewPost({...newPost, contentHi: e.target.value})}
                        rows="6"
                        className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all duration-300 text-slate-900 dark:text-slate-100"
                        placeholder="पूर्ण ब्लॉग सामग्री हिंदी में"
                      />
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Blog Image (ब्लॉग फोटो)</label>
                  
                  {/* Image Upload Section */}
                  <div className="space-y-4">
                    {/* File Upload */}
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={isSubmitting}
                          className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 dark:file:bg-emerald-900/30 file:text-emerald-700 dark:file:text-emerald-300 hover:file:bg-emerald-100 dark:hover:file:bg-emerald-900/50 text-slate-900 dark:text-slate-100"
                        />
                      </div>
                      {isSubmitting && (
                        <div className="flex items-center gap-2 text-emerald-600">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span className="text-sm">Uploading...</span>
                        </div>
                      )}
                    </div>

                    {/* Image Preview */}
                    {newPost.image && (
                      <div className="relative">
                        <img
                          src={newPost.image}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-2xl border border-gray-200"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setNewPost({ ...newPost, image: '' })}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition-all duration-300"
                          title="Remove image"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    {/* Fallback URL Input */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500 dark:text-slate-400">Or paste URL:</span>
                      <input
                        type="url"
                        value={newPost.image}
                        onChange={(e) => setNewPost({ ...newPost, image: e.target.value })}
                        className="flex-1 px-4 py-2 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all duration-300 text-sm text-slate-900 dark:text-slate-100"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Category</label>
                  <select
                    required
                    value={newPost.category}
                    onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all duration-300 text-slate-900 dark:text-slate-100"
                  >
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Read Time (उदा. 5 min read)</label>
                  <input
                    type="text"
                    required
                    value={newPost.readTime}
                    onChange={(e) => setNewPost({...newPost, readTime: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all duration-300 text-slate-900 dark:text-slate-100"
                    placeholder="5 min read"
                  />
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2 my-4">
                    <input 
                      type="checkbox" 
                      id="has_affiliate"
                      checked={newPost.hasAffiliate} 
                      onChange={(e) => setNewPost({...newPost, hasAffiliate: e.target.checked})}
                      className="w-4 h-4 text-emerald-500 rounded border-gray-300 focus:ring-emerald-500 bg-slate-800"
                    />
                    <label htmlFor="has_affiliate" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                      Contains Affiliate Links (Shows Disclosure & Product Banner)
                    </label>
                  </div>
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
                      {editingPost ? 'Updating...' : 'Publishing...'}
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      {editingPost ? 'Update Blog' : 'Publish Blog'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminForm(false)
                    setEditingPost(null)
                  }}
                  className="glassmorphism text-slate-700 px-8 py-3 rounded-2xl font-semibold transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-105 shadow-md hover:shadow-xl hover:shadow-emerald-200/50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Change Password Form */}
        {showPasswordForm && isUserAdmin && (
          <div className="glassmorphism rounded-3xl shadow-xl p-8 mb-12 animate-slide-down">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-3">
              <Lock className="h-6 w-6 text-blue-600" />
              Change Admin Password
            </h2>
            <form onSubmit={handlePasswordChange} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                  placeholder="Enter new password (min 6 characters)"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                  placeholder="Confirm new password"
                  required
                  minLength={6}
                />
              </div>

              {passwordError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
                  {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-2xl text-sm">
                  {passwordSuccess}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-105 shadow-lg shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100"
                >
                  {isUpdatingPassword ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Lock className="h-5 w-5" />
                      Change Password
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false)
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    })
                    setPasswordError('')
                    setPasswordSuccess('')
                  }}
                  className="glassmorphism text-slate-700 px-8 py-3 rounded-2xl font-semibold transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-105 shadow-md hover:shadow-xl hover:shadow-blue-200/50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs
            .filter(post => filterLang === 'all' || post.language === filterLang)
            .map((post) => {
              const postLang = post.language || 'en';
              return (
                <article key={post.id} className="glassmorphism dark:bg-slate-800 rounded-3xl shadow-md overflow-hidden hover:shadow-2xl hover:shadow-emerald-200/50 transition-all duration-500 ease-out hover:-translate-y-3 hover:scale-[1.02]">
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
                    {isUserAdmin && (
                      <div className="absolute top-4 right-4 flex gap-2 z-20">
                        <button
                          onClick={() => handleEditPost(post)}
                          className="bg-blue-500/90 hover:bg-blue-600 text-white p-2 rounded-full shadow-md transition-all duration-300 backdrop-blur-sm hover:scale-110"
                          title="Edit blog post"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="bg-red-500/90 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition-all duration-300 backdrop-blur-sm hover:scale-110"
                          title="Delete blog post"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 dark:bg-slate-800">
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-3">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="mr-4">{post.date}</span>
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{post.read_time || post.readTime}</span>
                    </div>
                    
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 line-clamp-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      <Link to={`/blog/${post.id}`}>
                        {getLocalizedText(post.title, postLang)}
                      </Link>
                    </h2>
                    
                    <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
                      {getLocalizedText(post.excerpt, postLang)}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          <span>{post.views || 0}</span>
                        </div>
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          <span>{post.likes || 0}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Link 
                      to={`/blog/${post.id}`}
                      className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors hover:translate-x-1"
                    >
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
        </div>

        {filteredBlogs.filter(post => filterLang === 'all' || post.language === filterLang).length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full mb-6">
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
