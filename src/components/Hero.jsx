import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Shield, CheckCircle, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import { supabase } from '../supabaseClient'

const Hero = () => {
  // Helper function to safely render localized strings (handles JSON strings and objects)
  const getLocalizedText = (value, lang = 'mr') => {
    if (!value) return '';
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (typeof parsed === 'object' && parsed !== null) {
          return parsed[lang] || parsed.en || parsed.hi || Object.values(parsed)[0] || '';
        }
      } catch (e) {
        return value;
      }
      return value;
    }
    if (typeof value === 'object') {
      return value[lang] || value.en || value.hi || Object.values(value)[0] || '';
    }
    return String(value);
  };

  // Safe State Initialization
  const [blogs, setBlogs] = useState([])
  const [products, setProducts] = useState([])
  const [blogIndex, setBlogIndex] = useState(0)
  const [prodIndex, setProdIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch blogs and products from Supabase
  useEffect(() => {
    let isMounted = true
    
    if (!supabase) {
      console.error('Supabase client not initialized')
      if (isMounted) {
        setBlogs([])
        setProducts([])
        setLoading(false)
      }
      return
    }
    
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch blogs
        const { data: blogData, error: blogError } = await supabase
          .from('blogs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(12)
        
        if (blogError) {
          console.error('Error fetching blogs:', blogError)
          if (isMounted) setBlogs([])
        } else {
          if (isMounted) setBlogs(Array.isArray(blogData) ? blogData : [])
        }
        
        // Fetch products
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(16)
        
        if (productError) {
          console.error('Error fetching products:', productError)
          if (isMounted) setProducts([])
        } else {
          if (isMounted) setProducts(Array.isArray(productData) ? productData : [])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        if (isMounted) {
          setError(error.message)
          setBlogs([])
          setProducts([])
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    
    fetchData()
    return () => { isMounted = false }
  }, [])

  // Safe Auto-Slider Intervals for blogs
  useEffect(() => {
    if (!blogs || blogs.length <= 3) return
    const timer = setInterval(() => {
      setBlogIndex((prev) => (prev + 3 >= blogs.length ? 0 : prev + 3))
    }, 4000)
    return () => clearInterval(timer)
  }, [blogs])

  // Safe Auto-Slider Intervals for products
  useEffect(() => {
    if (!products || products.length <= 4) return
    const timer = setInterval(() => {
      setProdIndex((prev) => (prev + 4 >= products.length ? 0 : prev + 4))
    }, 4000)
    return () => clearInterval(timer)
  }, [products])

  if (error) {
    return (
      <div className="w-full min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="text-slate-400 mb-4">{error}</p>
          <p className="text-sm text-slate-500">Please check your environment configuration and refresh the page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#1e1b2e] via-[#2d2545] to-[#13111c] text-white">
      <section className="relative overflow-hidden pt-6 pb-4 sm:pt-8 sm:pb-6 bg-gradient-to-r from-purple-900/90 via-indigo-900/80 to-purple-950/90">
        
        {/* Ambient Lights */}
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            
            {/* Trust Badge */}
            <div className="inline-flex items-center bg-white/10 backdrop-blur-md border border-purple-500/20 px-5 py-2.5 rounded-full shadow-lg mb-4">
              <Shield className="h-5 w-5 text-purple-300 mr-2" />
              <span className="text-sm font-medium text-white">Trusted by 10,000+ Readers</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-4 tracking-tight drop-shadow-md">
              आयुष्याचा खरा सल्लागार
            </h1>

            {/* Tagline */}
            <p className="text-xl sm:text-2xl text-purple-200 mb-4 max-w-3xl mx-auto font-light">
              Good Thoughts, Health, Ayurveda, ani Motivation
            </p>

            {/* Subheading */}
            <p className="text-base text-purple-200/90 mb-4 max-w-2xl mx-auto leading-relaxed">
              Sallagar helps you discover the path to a better life through positive thoughts, 
              Ayurvedic wisdom, and motivational insights.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-row gap-4 justify-center items-center mb-6">
              <Link to="/blog" className="bg-orange-500 hover:bg-orange-600 text-black font-bold px-6 py-3 rounded-xl transition shadow-md flex items-center">
                Explore Blog <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/categories" className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-3 rounded-xl transition shadow-md">
                Product Sell
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md border border-purple-500/20 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-5 w-5 text-purple-300 fill-current" />
                  <Star className="h-5 w-5 text-purple-300 fill-current" />
                  <Star className="h-5 w-5 text-purple-300 fill-current" />
                  <Star className="h-5 w-5 text-purple-300 fill-current" />
                  <Star className="h-5 w-5 text-purple-300 fill-current" />
                </div>
                <p className="text-sm font-medium text-white">500+ Inspiring Articles</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-purple-500/20 rounded-2xl p-4 shadow-xl">
                <CheckCircle className="h-8 w-8 text-purple-300 mb-2 mx-auto" />
                <p className="text-sm font-medium text-white">100% Authentic Content</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-purple-500/20 rounded-2xl p-4 shadow-xl">
                <Shield className="h-8 w-8 text-purple-300 mb-2 mx-auto" />
                <p className="text-sm font-medium text-white">Expert Wellness Team</p>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="flex flex-col items-center justify-center mt-6 text-purple-300/80 animate-bounce cursor-pointer" onClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })}>
              <span className="text-xs font-semibold tracking-wider uppercase mb-1">Scroll to Explore</span>
              <ChevronDown className="h-5 w-5 text-purple-300"/>
            </div>

            {/* Featured Blogs Slider */}
            <div className="mt-8 max-w-7xl mx-auto text-left">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Featured Blogs</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setBlogIndex((prev) => (prev - 3 < 0 ? Math.max(0, (blogs || []).length - 3) : prev - 3))}
                    disabled={!blogs || blogs.length <= 3}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition disabled:opacity-50"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => setBlogIndex((prev) => (prev + 3 >= (blogs || []).length ? 0 : prev + 3))}
                    disabled={!blogs || blogs.length <= 3}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition disabled:opacity-50"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="text-center text-slate-400 py-8">Loading blogs...</div>
              ) : !Array.isArray(blogs) || blogs.length === 0 ? (
                <div className="text-center text-slate-400 py-8">No blogs found</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(blogs || []).slice(blogIndex, blogIndex + 3).map((blog) => (
                    <Link key={blog.id} to={`/blog/${blog.id}`} className="block">
                      <div className="bg-white/10 backdrop-blur-md border border-purple-500/20 rounded-2xl overflow-hidden shadow-xl hover:scale-105 transition-all duration-300 h-full">
                        {blog.image_url ? (
                          <img src={blog.image_url} alt={getLocalizedText(blog.title)} className="w-full h-48 object-cover object-center" />
                        ) : (
                          <div className="h-40 bg-purple-900/40 flex items-center justify-center">
                            <span className="text-4xl">📝</span>
                          </div>
                        )}
                        <div className="p-5">
                          <span className="text-xs font-semibold px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full">{blog.category || 'Blog'}</span>
                          <h3 className="text-lg font-bold text-white mt-2 mb-2 line-clamp-1">{getLocalizedText(blog.title)}</h3>
                          <p className="text-sm text-slate-300 mb-3 line-clamp-2">{getLocalizedText(blog.excerpt || blog.description) || 'No description'}</p>
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span>{blog.created_at ? new Date(blog.created_at).toLocaleDateString() : ''}</span>
                            <span className="font-semibold text-purple-400 flex items-center">Read More →</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Featured Products Slider */}
            <div className="mt-8 max-w-7xl mx-auto pb-6 text-left">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Featured Products</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setProdIndex((prev) => (prev - 4 < 0 ? Math.max(0, (products || []).length - 4) : prev - 4))}
                    disabled={!products || products.length <= 4}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition disabled:opacity-50"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => setProdIndex((prev) => (prev + 4 >= (products || []).length ? 0 : prev + 4))}
                    disabled={!products || products.length <= 4}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition disabled:opacity-50"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="text-center text-slate-400 py-8">Loading products...</div>
              ) : !Array.isArray(products) || products.length === 0 ? (
                <div className="text-center text-slate-400 py-8">No products found</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(products || []).slice(prodIndex, prodIndex + 4).map((product) => (
                    <Link key={product.id} to="/categories" className="block">
                      <div className="bg-white/10 border border-purple-500/20 hover:border-purple-400/50 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10 group relative">
                        <span className="absolute top-3 right-3 bg-purple-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full z-10 uppercase">Featured</span>
                        <div className="h-36 bg-gradient-to-b from-purple-900/80 to-indigo-800/50 rounded-xl flex items-center justify-center p-3 mb-3 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                          {product.image_url ? (
                            <img src={product.image_url} alt={getLocalizedText(product.name) || getLocalizedText(product.title)} className="max-h-full object-contain" />
                          ) : (
                            <span className="text-5xl">🛍️</span>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-white truncate mb-2">{getLocalizedText(product.name) || getLocalizedText(product.title)}</h3>
                        <div className="flex items-center justify-center mb-2">
                          <Star className="h-3 w-3 text-purple-300 fill-current" />
                          <Star className="h-3 w-3 text-purple-300 fill-current" />
                          <Star className="h-3 w-3 text-purple-300 fill-current" />
                          <Star className="h-3 w-3 text-purple-300 fill-current" />
                          <Star className="h-3 w-3 text-purple-300 fill-current" />
                        </div>
                        <p className="text-purple-300 text-lg font-black mb-3">₹{product.price}</p>
                        <div className="bg-gradient-to-r from-purple-400 to-indigo-500 text-white font-extrabold text-xs py-2 px-3 rounded-xl shadow-lg hover:brightness-110 flex items-center justify-center gap-1 w-full transition">
                          Buy Now 🛒
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}

export default Hero