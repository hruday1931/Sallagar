import React, { useState, useEffect } from 'react'
import { ShoppingBag, ExternalLink, Plus, Trash2, X, Edit, XCircle, Shield, Edit2 } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { isAdmin, adminLogout } from '../utils/adminAuth'

const Categories = () => {
  const [searchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showAdminForm, setShowAdminForm] = useState(false)
  const [products, setProducts] = useState([])
  const [isUserAdmin, setIsUserAdmin] = useState(isAdmin())
  const [editingProduct, setEditingProduct] = useState(null)
  const [showProductDetails, setShowProductDetails] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const categories = ['All', 'Electronics', 'Home & Kitchen', 'Fashion', 'Health & Wellness', 'Sports & Outdoors']
  const storeOptions = ['Amazon', 'Flipkart', 'Meesho', 'Myntra', 'AJIO']

  // Fetch products from Supabase on mount
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching products:', error)
      } else {
        setProducts(data || [])
      }
    }

    fetchProducts()
  }, [])

  // Set selected category from URL query param on mount
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam)
    }
  }, [searchParams, categories])

  // Check admin status on mount
  useEffect(() => {
    // Development bypass: set admin to true on localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      localStorage.setItem('is_admin', 'true')
    }
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
        setProducts(refreshedData)
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
          setProducts(refreshedData)
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

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory)

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-indigo-600 text-white py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse-glow"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse-glow"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <ShoppingBag className="h-10 w-10 mr-4" />
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">Categories</h1>
          </div>
          <p className="text-xl text-white/90 max-w-2xl font-light">
            Browse our recommended products by category
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Admin Toggle Button */}
        <div className="mb-8 flex gap-3">
          {isUserAdmin ? (
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
                    Add New Product
                  </>
                )}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-5 py-3 rounded-2xl font-semibold transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-105 shadow-lg shadow-red-500/30 hover:shadow-2xl hover:shadow-red-500/50"
              >
                <Shield className="h-5 w-5" />
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => window.location.href = '/admin-login'}
              className="flex items-center gap-2 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white px-5 py-3 rounded-2xl font-semibold transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-105 shadow-lg shadow-slate-500/30 hover:shadow-2xl hover:shadow-slate-500/50"
            >
              <Shield className="h-5 w-5" />
              Admin Login
            </button>
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
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
                  <input
                    type="text"
                    required
                    value={newProduct.title}
                    onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
                    placeholder="Product title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProductImageUpload}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
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
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Category (optional)</label>
                  <input
                    type="text"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
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
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Store</label>
                  <select
                    required
                    value={newProduct.store}
                    onChange={(e) => setNewProduct({...newProduct, store: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
                  >
                    {storeOptions.map((store) => (
                      <option key={store} value={store}>{store}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Price</label>
                  <input
                    type="text"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
                    placeholder="₹9,999"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Affiliate Link</label>
                  <input
                    type="url"
                    required
                    value={newProduct.affiliateLink}
                    onChange={(e) => setNewProduct({...newProduct, affiliateLink: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
                    placeholder="https://amazon.in/dp/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Discount % (Optional)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newProduct.discount_percent}
                    onChange={(e) => setNewProduct({...newProduct, discount_percent: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
                    placeholder="Discount % (e.g. 10)"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                <textarea
                  required
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
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

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-500 ease-out ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 scale-105 hover:scale-110'
                  : 'glassmorphism text-slate-700 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-600 shadow-md border border-white/50 hover:shadow-emerald-200/50 hover:-translate-y-1'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div 
              key={product.id}
              className="glassmorphism rounded-3xl shadow-md overflow-hidden hover:shadow-2xl hover:shadow-emerald-200/50 transition-all duration-500 ease-out hover:-translate-y-3 hover:scale-[1.02] cursor-pointer"
              onClick={() => handleViewProduct(product)}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>
                <img 
                  src={product.image_url || product.image} 
                  alt={product.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2 z-20">
                  {product.discount_percent && product.discount_percent > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
                      {product.discount_percent}% OFF
                    </span>
                  )}
                  <span className="bg-emerald-100/80 backdrop-blur-sm text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {product.category}
                  </span>
                </div>
                {isUserAdmin && (
                  <div className="absolute top-4 right-4 flex gap-2 z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditProduct(product)
                      }}
                      className="bg-blue-500/90 hover:bg-blue-600 text-white p-2 rounded-full shadow-md transition-all duration-300 backdrop-blur-sm hover:scale-110"
                      title="Edit product"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteProduct(product.id)
                      }}
                      className="bg-red-500/90 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition-all duration-300 backdrop-blur-sm hover:scale-110"
                      title="Delete product"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="p-5">
                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">
                  {product.title}
                </h3>
                
                <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price)}
                  </span>
                </div>
                
                <a
                  href={product.affiliate_link || product.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className={`w-full text-white py-3 px-4 rounded-2xl font-semibold flex items-center justify-center transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-105 ${getStoreButtonStyle(product.store).bgClass}`}
                >
                  {getStoreButtonStyle(product.store).buttonText}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg font-medium">No products found in this category.</p>
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
                className="w-full h-64 md:h-80 object-cover rounded-t-3xl"
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
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                {selectedProduct.title}
              </h2>
              <p className="text-slate-600 text-lg mb-6 leading-relaxed">
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
