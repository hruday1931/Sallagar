import React, { useState, useEffect } from 'react'
import { ShoppingBag, ExternalLink, Plus, Trash2, X, Edit, XCircle, Shield, Edit2, Search, Home } from 'lucide-react'
import { useSearchParams, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { isAdmin, adminLogout } from '../utils/adminAuth'

const Categories = () => {
  const [searchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showAdminForm, setShowAdminForm] = useState(false)
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isUserAdmin, setIsUserAdmin] = useState(() => {
    const token = localStorage.getItem('is_admin');
    // Strict check: only true if token is exactly the string 'true'
    // This prevents null, undefined, 'null', or any other value from being truthy
    return token === 'true';
  })
  const [editingProduct, setEditingProduct] = useState(null)
  const [showProductDetails, setShowProductDetails] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const categories = ['All', 'Electronics', 'Home & Kitchen', 'Fashion', 'Health & Wellness', 'Sports & Outdoors']
  const storeOptions = ['Amazon', 'Flipkart', 'Meesho', 'Myntra', 'AJIO']

  // Fetch all products from Supabase once on mount with caching
  useEffect(() => {
    const fetchProducts = async () => {
      // Check cache first
      const cachedProducts = localStorage.getItem('cached_products')
      const cacheTime = localStorage.getItem('products_cache_time')
      const now = Date.now()
      const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
      
      if (cachedProducts && cacheTime && (now - parseInt(cacheTime)) < CACHE_DURATION) {
        setAllProducts(JSON.parse(cachedProducts))
        setLoading(false)
        return
      }
      
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) {
          console.error('Error fetching products:', error)
        } else {
          const productsData = data || []
          setAllProducts(productsData)
          
          // Cache the results
          localStorage.setItem('cached_products', JSON.stringify(productsData))
          localStorage.setItem('products_cache_time', now.toString())
        }
      } catch (err) {
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, []) // Run ONLY once on mount

  // Set selected category from URL query param on mount
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam)
    }
  }, [searchParams, categories])

  // Check admin status on mount
  useEffect(() => {
    setIsUserAdmin(isAdmin())
  }, [])

  // Update admin status when localStorage changes
  useEffect(() => {
    const checkAdminStatus = () => {
      setIsUserAdmin(isAdmin())
    }
    
    window.addEventListener('storage', checkAdminStatus)
    return () => window.removeEventListener('storage', checkAdminStatus)
  }, [])


  // Form state for new product
  const [newProduct, setNewProduct] = useState({
    title: '',
    image_url: '',
    category: '',
    store: 'Amazon',
    price: '',
    description: '',
    affiliateLink: '',
    discount_percent: ''
  })

  // State for file upload
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  // Handle image file upload to Supabase Storage
  const handleProductImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setSelectedFile(file)
    setUploading(true)

    try {
      console.log('Starting image upload for file:', file.name, file.type, file.size)

      // Generate unique file name with clean characters
      const fileExt = file.name.split('.').pop()
      const cleanFileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
      const filePath = `product-images/${cleanFileName}`

      console.log('Generated file path:', filePath)

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file)

      if (error) {
        console.error('Supabase upload error details:', error)
        alert(`Upload Failed: ${error.message}`)
        return
      }

      console.log('Upload successful, data:', data)

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      console.log('Public URL generated:', publicUrl)

      // Update form with public URL
      setNewProduct({ ...newProduct, image_url: publicUrl })
    } catch (error) {
      console.error('Error during image upload:', error)
      alert(`Upload Failed: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  // Handle adding or editing a product
  const handleAddProduct = async (e) => {
    e.preventDefault()
    
    // Route protection: Check if user is admin
    if (!isUserAdmin) {
      alert('Access denied. Only admins can create or edit products.')
      setShowAdminForm(false)
      setEditingProduct(null)
      return
    }
    
    if (!newProduct.image_url) {
      alert('Please upload an image for the product.')
      return
    }
    
    try {
      console.log('Submitting product with data:', newProduct)

      // Safely sanitize price - handle both string and number types
      const cleanPrice = typeof newProduct.price === 'string' 
        ? parseFloat(newProduct.price.replace(/[^0-9.]/g, '')) 
        : parseFloat(newProduct.price);

      // Safely parse discount percent
      const cleanDiscount = newProduct.discount_percent ? parseInt(newProduct.discount_percent, 10) : null;

      const productToAdd = {
        title: newProduct.title,
        description: newProduct.description,
        price: cleanPrice || 0,
        image_url: newProduct.image_url,
        category: newProduct.category || null,
        store: newProduct.store,
        affiliate_link: newProduct.affiliateLink,
        discount_percent: cleanDiscount
      }

      console.log('Payload to be inserted:', productToAdd)

      let result
      if (editingProduct) {
        // Update existing product
        result = await supabase
          .from('products')
          .update(productToAdd)
          .eq('id', editingProduct.id)
          .select()
      } else {
        // Insert new product
        result = await supabase
          .from('products')
          .insert([productToAdd])
          .select()
      }

      const { data, error } = result

      if (!error) {
        console.log('Product saved successfully:', data)
        alert(editingProduct ? 'Product Updated Successfully! 🎉' : 'Product Saved Successfully! 🎉')
      } else {
        console.error('Supabase insert/update error details:', error)
        alert(`Error: ${error.message}`)
        return
      }

      // Refresh products from Supabase
      const { data: refreshedData, error: refreshError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (refreshError) {
        console.error('Error refreshing products:', refreshError)
      } else if (refreshedData) {
        setAllProducts(refreshedData)
      }

      // Reset form
      setNewProduct({
        title: '',
        image_url: '',
        category: '',
        store: 'Amazon',
        price: '',
        description: '',
        affiliateLink: '',
        discount_percent: ''
      })
      setSelectedFile(null)
      setEditingProduct(null)
      setShowAdminForm(false)
    } catch (error) {
      console.error('Error during product submission:', error)
      alert('Failed to save product: ' + error.message)
    }
  }

  // Handle edit product
  const handleEditProduct = (product) => {
    // Route protection: Check if user is admin
    if (!isUserAdmin) {
      alert('Access denied. Only admins can edit products.')
      return
    }
    
    setEditingProduct(product)
    setNewProduct({
      title: product.title,
      image_url: product.image_url || product.image,
      category: product.category || '',
      store: product.store || 'Amazon',
      price: product.price,
      description: product.description,
      affiliateLink: product.affiliate_link || '',
      discount_percent: product.discount_percent || ''
    })
    setShowAdminForm(true)
  }

  // Handle admin logout
  const handleLogout = () => {
    adminLogout()
    setIsUserAdmin(false)
    setShowAdminForm(false)
    setEditingProduct(null)
  }

  // Handle view product details
  const handleViewProduct = (product) => {
    setSelectedProduct(product)
    setShowProductDetails(true)
  }

  // Handle deleting a product from Supabase
  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting product:', error)
        alert('Failed to delete product. Please try again.')
      } else {
        // Refresh products from Supabase
        const { data: refreshedData } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (refreshedData) {
          setAllProducts(refreshedData)
        }
      }
    }
  }

  // Store-specific button styling configuration
  const getStoreButtonStyle = (store) => {
    const styles = {
      Amazon: {
        bgClass: 'bg-orange-500 hover:bg-orange-600',
        buttonText: 'Buy on Amazon'
      },
      Flipkart: {
        bgClass: 'bg-gradient-to-r from-blue-500 to-yellow-400 hover:from-blue-600 hover:to-yellow-500',
        buttonText: 'Buy on Flipkart'
      },
      Meesho: {
        bgClass: 'bg-pink-500 hover:bg-pink-600',
        buttonText: 'Buy on Meesho'
      },
      Myntra: {
        bgClass: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600',
        buttonText: 'Buy on Myntra'
      },
      AJIO: {
        bgClass: 'bg-gray-800 hover:bg-gray-900',
        buttonText: 'Buy on AJIO'
      }
    }
    return styles[store] || styles.Amazon // Default to Amazon if store not found
  }

  // Filter instantly in memory for instant category switching and search
  const filteredProducts = allProducts.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category?.toLowerCase() === selectedCategory.toLowerCase()
    const matchesSearch = (product.name || product.title || '').toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900/90 via-indigo-900/80 to-purple-950/90 text-white py-6 sm:py-8">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse-glow"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse-glow"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <ShoppingBag className="h-7 w-7 sm:h-8 sm:w-8 mr-3" />
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">Categories</h1>
            </div>
            <Link to="/" className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Home</span>
            </Link>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl font-light">
            Browse our recommended products by category
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Toggle Button */}
        <div className="my-3 flex gap-3">
          {isUserAdmin && (
            <>
              <button
                onClick={() => {
                  setEditingProduct(null)
                  setNewProduct({
                    title: '',
                    image_url: '',
                    category: '',
                    store: 'Amazon',
                    price: '',
                    description: '',
                    affiliateLink: '',
                    discount_percent: ''
                  })
                  setSelectedFile(null)
                  setShowAdminForm(!showAdminForm)
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-2 px-4 text-xs font-bold rounded-2xl transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-105 shadow-lg shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/50"
              >
                {showAdminForm ? (
                  <>
                    <X className="h-5 w-5" />
                    Close Admin Panel
                  </>
                ) : (
                  <>
                    <span className="text-lg">✨</span>
                    Add New Product
                  </>
                )}
              </button>
            </>
          )}
        </div>

        {/* Admin Form */}
        {showAdminForm && isUserAdmin && (
          <div className="glassmorphism rounded-3xl shadow-xl p-8 mb-12 animate-slide-down">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <span className="text-2xl">✨</span>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleAddProduct} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Title</label>
                  <input
                    type="text"
                    required
                    value={newProduct.title}
                    onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white text-slate-900 placeholder-gray-400"
                    placeholder="Product title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProductImageUpload}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white text-slate-900 placeholder-gray-400"
                  />
                  {uploading && (
                    <p className="text-sm text-emerald-600 mt-2">Uploading image...</p>
                  )}
                  {selectedFile && !uploading && (
                    <p className="text-sm text-slate-600 mt-2">Selected: {selectedFile.name}</p>
                  )}
                  {newProduct.image_url && (
                    <div className="mt-3">
                      <img 
                        src={newProduct.image_url} 
                        alt="Preview" 
                        className="w-full h-32 object-cover rounded-xl border border-gray-200"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Category (optional)</label>
                  <input
                    type="text"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white text-slate-900 placeholder-gray-400"
                    placeholder="Enter or select category"
                    list="category-options"
                  />
                  <datalist id="category-options">
                    {categories.filter(cat => cat !== 'All').map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Store</label>
                  <select
                    required
                    value={newProduct.store}
                    onChange={(e) => setNewProduct({...newProduct, store: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white text-slate-900 placeholder-gray-400"
                  >
                    {storeOptions.map((store) => (
                      <option key={store} value={store}>{store}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Price</label>
                  <input
                    type="text"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white text-slate-900 placeholder-gray-400"
                    placeholder="₹9,999"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Affiliate Link</label>
                  <input
                    type="url"
                    required
                    value={newProduct.affiliateLink}
                    onChange={(e) => setNewProduct({...newProduct, affiliateLink: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white text-slate-900 placeholder-gray-400"
                    placeholder="https://amazon.in/dp/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Discount % (Optional)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newProduct.discount_percent}
                    onChange={(e) => setNewProduct({...newProduct, discount_percent: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white text-slate-900 placeholder-gray-400"
                    placeholder="Discount % (e.g. 10)"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Description</label>
                <textarea
                  required
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white text-slate-900 placeholder-gray-400"
                  placeholder="Short product description"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-105 shadow-lg shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/50 flex items-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  {editingProduct ? 'Update Product' : 'Add Product'}
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

        {/* Search Bar */}
        <div className="relative mb-4 max-w-xl">
          <input
            type="text"
            placeholder="Search products by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"/>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-3 my-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`py-1.5 px-3.5 text-xs font-medium rounded-full transition-colors ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-500/30'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-medium transition-colors'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Skeleton Loader */}
        {loading && (
          <div className="mt-4 grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-purple-950/40 border border-purple-500/20 rounded-3xl shadow-md overflow-hidden">
                <div className="h-32 sm:h-56 bg-slate-200 dark:bg-slate-700 animate-pulse" />
                <div className="p-1 sm:p-5 dark:bg-slate-800">
                  <div className="h-2 sm:h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-1 sm:mb-2" />
                  <div className="h-2 sm:h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-1 sm:mb-2" />
                  <div className="h-2 sm:h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <div className="mt-4 grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5 sm:gap-6">
            {filteredProducts?.map((product) => (
            <div 
              key={product.id}
              className="bg-purple-950/40 border border-purple-500/20 hover:border-purple-400/50 rounded-3xl shadow-md overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 ease-out hover:-translate-y-3 hover:scale-[1.02] cursor-pointer"
              onClick={() => handleViewProduct(product)}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>
                <img 
                  src={product.image_url || product.image} 
                  alt={product.title}
                  className="w-full h-32 sm:h-56 object-contain bg-slate-900/20 dark:bg-slate-700/30"
                />
                <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex gap-1 sm:gap-2 z-20">
                  {product.discount_percent && product.discount_percent > 0 && (
                    <span className="bg-red-500 text-white text-[8px] sm:text-xs font-bold px-1 sm:px-2 py-0.5 sm:py-1 rounded-md z-10">
                      {product.discount_percent}% OFF
                    </span>
                  )}
                  <span className="bg-emerald-100/80 backdrop-blur-sm text-emerald-700 px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-xs font-semibold">
                    {product.category}
                  </span>
                </div>
                {isUserAdmin && (
                  <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-1 sm:gap-2 z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditProduct(product)
                      }}
                      className="bg-blue-500/90 hover:bg-blue-600 text-white p-1 sm:p-2 rounded-full shadow-md transition-all duration-300 backdrop-blur-sm hover:scale-110"
                      title="Edit product"
                    >
                      <Edit2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteProduct(product.id)
                      }}
                      className="bg-red-500/90 hover:bg-red-600 text-white p-1 sm:p-2 rounded-full shadow-md transition-all duration-300 backdrop-blur-sm hover:scale-110"
                      title="Delete product"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="p-1 sm:p-5 dark:bg-slate-800">
                <h3 className="text-[10px] sm:text-lg font-bold text-slate-900 dark:text-slate-100 mb-1 sm:mb-2 line-clamp-1 sm:line-clamp-2">
                  {product.title}
                </h3>
                
                <p className="text-[8px] sm:text-sm text-slate-600 dark:text-slate-300 mb-1 sm:mb-3 line-clamp-1 sm:line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <span className="text-sm sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price)}
                  </span>
                </div>
                
                <a
                  href={product.affiliate_link || product.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className={`w-full text-white py-1 sm:py-3 px-1.5 sm:px-4 rounded-2xl text-[8px] sm:text-sm font-semibold flex items-center justify-center transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-105 ${getStoreButtonStyle(product.store).bgClass}`}
                >
                  {getStoreButtonStyle(product.store).buttonText}
                  <ExternalLink className="ml-0.5 sm:ml-2 h-2 w-2 sm:h-4 sm:w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">No products found in this category.</p>
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      {showProductDetails && selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowProductDetails(false)}>
          <div className="glassmorphism rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <button
                onClick={() => setShowProductDetails(false)}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white text-slate-700 p-2 rounded-full shadow-md transition-all duration-300 z-10 hover:scale-110"
              >
                <XCircle className="h-6 w-6" />
              </button>
              <img 
                src={selectedProduct.image_url || selectedProduct.image} 
                alt={selectedProduct.title}
                className="w-full h-64 md:h-80 object-contain bg-slate-900/20 dark:bg-slate-700/30 rounded-t-3xl"
              />
            </div>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                {selectedProduct.category && (
                  <span className="bg-emerald-100/80 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold">
                    {selectedProduct.category}
                  </span>
                )}
                {selectedProduct.store && (
                  <span className="bg-blue-100/80 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                    {selectedProduct.store}
                  </span>
                )}
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                {selectedProduct.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-lg mb-6 leading-relaxed">
                {selectedProduct.description}
              </p>
              <div className="flex items-center justify-between mb-8">
                <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(selectedProduct.price)}
                </span>
              </div>
              <a
                href={selectedProduct.affiliate_link || selectedProduct.affiliateLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full text-white py-4 px-6 rounded-2xl font-semibold flex items-center justify-center transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-105 text-lg ${getStoreButtonStyle(selectedProduct.store).bgClass}`}
              >
                {getStoreButtonStyle(selectedProduct.store).buttonText}
                <ExternalLink className="ml-3 h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Categories
