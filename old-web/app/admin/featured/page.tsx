"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Star, Eye, X, Search, ChevronLeft, ChevronRight, Package, Save } from "lucide-react"
import Image from "next/image"
import axios from "axios"
import toast from "react-hot-toast"
import ProtectedRoute from "../components/ProtectedRoute"
import AdminLayout from "../components/AdminLayout"
import LoadingSpinner from "../components/LoadingSpinner"

// Updated interface to match API response
interface AdminProduct {
  _id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  brand: string
  category: string
  color: Array<{
    name: string
    hex: string
  }>
  images: string[]
  primaryImage?: string
  frameMaterial: string
  weight: number
  gearType: string
  numberOfGears?: number
  brakeType: string
  frameSize: string
  wheelSize: string
  stock: number
  slug: string
  isActive: boolean
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalProducts: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

interface ApiResponse {
  message: string
  data: {
    products: AdminProduct[]
    pagination: PaginationInfo
    search?: string
  }
}

export default function FeaturedCycles() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [featuredProductIds, setFeaturedProductIds] = useState<Set<string>>(new Set())
  const [originalFeaturedIds, setOriginalFeaturedIds] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Pagination state
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    limit: 20,
    hasNextPage: false,
    hasPrevPage: false
  })

  // Check if there are unsaved changes
  const hasChanges = () => {
    if (featuredProductIds.size !== originalFeaturedIds.size) return true
    for (const id of featuredProductIds) {
      if (!originalFeaturedIds.has(id)) return true
    }
    return false
  }

  // API function to fetch products
  const fetchProducts = async (page: number = 1, search: string = "") => {
    try {
      setError(null)
      if (page === 1 && !search) {
        setIsLoading(true)
      } else {
        setIsSearching(true)
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      const token = localStorage.getItem("token")

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20"
      })

      if (search.trim()) {
        params.append("search", search.trim())
      }

      const response = await axios.get<ApiResponse>(`${API_BASE_URL}/admin/products?${params}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      })

      if (response.data && response.data.data) {
        setProducts(response.data.data.products)
        setPagination(response.data.data.pagination)

        // Initialize featured products on first load
        if (page === 1 && !search && featuredProductIds.size === 0) {
          const featuredIds = new Set(
            response.data.data.products
              .filter(product => product.isFeatured)
              .map(product => product._id)
          )
          setFeaturedProductIds(featuredIds)
          setOriginalFeaturedIds(new Set(featuredIds))
        }
      }
    } catch (error: any) {
      console.error("Error fetching products:", error)
      const errorMessage = error.response?.data?.message || "Failed to fetch products"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
      setIsSearching(false)
    }
  }

  // API function to save featured products
  const saveFeaturedProducts = async () => {
    const loadingToast = toast.loading("Saving featured products...")

    try {
      setIsSaving(true)
      setSaveError(null)

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
      const token = localStorage.getItem("token")

      const response = await axios.post(
        `${API_BASE_URL}/admin/products/featured`,
        {
          featuredProductIds: Array.from(featuredProductIds)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      )

      if (response.data) {
        // Update original featured IDs to reflect saved state
        setOriginalFeaturedIds(new Set(featuredProductIds))

        toast.dismiss(loadingToast)
        toast.success("Featured products saved successfully")

        // Refresh products to ensure data consistency
        await fetchProducts(pagination.currentPage, searchTerm)
      }
    } catch (error: any) {
      console.error("Error saving featured products:", error)
      const errorMessage = error.response?.data?.message || "Failed to save featured products"
      setSaveError(errorMessage)
      toast.dismiss(loadingToast)
      toast.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Search handlers
  const handleSearch = () => {
    setSearchTerm(searchInput)
    fetchProducts(1, searchInput)
  }

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const clearSearch = () => {
    setSearchInput("")
    setSearchTerm("")
    fetchProducts(1, "")
  }

  // Pagination handlers
  const handlePageChange = (page: number) => {
    fetchProducts(page, searchTerm)
  }

  // Featured product handlers
  const handleToggleFeatured = (productId: string) => {
    const newFeaturedIds = new Set(featuredProductIds)
    if (newFeaturedIds.has(productId)) {
      newFeaturedIds.delete(productId)
    } else {
      newFeaturedIds.add(productId)
    }
    setFeaturedProductIds(newFeaturedIds)
  }

  const handleRemoveFromFeatured = (productId: string) => {
    const newFeaturedIds = new Set(featuredProductIds)
    newFeaturedIds.delete(productId)
    setFeaturedProductIds(newFeaturedIds)
  }

  const handleViewProduct = (product: AdminProduct) => {
    setSelectedProduct(product)
    setShowViewModal(true)
  }

  // Get featured products for display
  const featuredProducts = products.filter(product => featuredProductIds.has(product._id))

  if (isLoading) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-96">
            <LoadingSpinner text="Loading featured cycles..." />
          </div>
        </AdminLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Featured Cycles</h1>
              <p className="text-gray-600 mt-1">
                Select cycles to feature on the homepage. Currently selected: {featuredProducts.length}
              </p>
            </div>

            {/* Save Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={saveFeaturedProducts}
              disabled={!hasChanges() || isSaving}
              className={`px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-200 ${hasChanges()
                ? "bg-green-600 hover:bg-green-700 text-white shadow-lg"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                } disabled:opacity-50`}
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="h-5 w-5" />
              )}
              <span>{isSaving ? "Saving..." : "Save Changes"}</span>
            </motion.button>
          </motion.div>

          {/* Search Results Info */}
          {searchTerm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-gray-600"
            >
              Search results for "{searchTerm}" - {pagination.totalProducts} products found
            </motion.div>
          )}

          {/* Error Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          {saveError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
            >
              {saveError}
            </motion.div>
          )}

          {/* Currently Featured Section - Horizontal Scrollable */}
          {featuredProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Star className="h-5 w-5 text-yellow-600" />
                <h2 className="text-xl font-semibold text-gray-900">Currently Featured Cycles ({featuredProducts.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <div className="flex space-x-4 pb-2">
                  {featuredProducts.map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="bg-white rounded-lg p-2 shadow-sm border border-gray-200 relative min-w-[80px] flex-shrink-0"
                    >
                      <div className="absolute top-1 right-1">
                        <button
                          onClick={() => handleRemoveFromFeatured(product._id)}
                          className="p-0.5 rounded-full bg-red-100 hover:bg-red-200 transition-colors"
                          title="Remove from featured"
                        >
                          <X className="h-2.5 w-2.5 text-red-600" />
                        </button>
                      </div>
                      <div className="w-32 h-24 rounded-lg overflow-hidden mb-1">
                        <Image
                          src={product.primaryImage || product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          width={60}
                          height={60}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-semibold text-gray-900 text-[10px] mb-0.5 truncate">{product.name}</h3>
                      <p className="text-[9px] text-gray-600 mb-0.5">{product.category}</p>
                      <p className="text-xs font-bold text-primary-main">₹{product.price.toLocaleString()}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* All Products Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">All Cycles</h2>
                  <p className="text-gray-600 text-sm mt-1">Select cycles to feature on the homepage</p>
                </div>

                {/* Search Bar */}
                <div className="flex space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyPress={handleSearchKeyPress}
                      className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent w-64"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="bg-primary-main hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-all duration-200 disabled:opacity-50"
                  >
                    {isSearching ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </motion.button>
                  {searchTerm && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={clearSearch}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg font-medium transition-all duration-200"
                    >
                      Clear
                    </motion.button>
                  )}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Image</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Featured</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product: AdminProduct, index: number) => (
                    <motion.tr
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <img
                          src={product.primaryImage || product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.brand}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">₹{product.price.toLocaleString()}</p>
                          {product.originalPrice && (
                            <p className="text-sm text-gray-500 line-through">
                              ₹{product.originalPrice.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4 text-gray-400" />
                          <span
                            className={`font-medium ${product.stock === 0
                              ? "text-red-600"
                              : product.stock <= 5
                                ? "text-yellow-600"
                                : "text-green-600"
                              }`}
                          >
                            {product.stock}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={featuredProductIds.has(product._id)}
                            onChange={() => handleToggleFeatured(product._id)}
                            className="h-4 w-4 text-primary-main focus:ring-primary-main border-gray-300 rounded"
                          />
                          {featuredProductIds.has(product._id) && <Star className="h-4 w-4 text-yellow-500 ml-2" />}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <button
                          onClick={() => handleViewProduct(product)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-main transition-colors"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                  <div className="text-sm text-gray-700">
                    Showing {((pagination.currentPage - 1) * 20) + 1} to{" "}
                    {Math.min(pagination.currentPage * 20, pagination.totalProducts)} of{" "}
                    {pagination.totalProducts} products
                  </div>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevPage || isSearching}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      Previous
                    </motion.button>

                    <div className="flex space-x-1">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        let pageNum: number
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1
                        } else if (pagination.currentPage <= 3) {
                          pageNum = i + 1
                        } else if (pagination.currentPage >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i
                        } else {
                          pageNum = pagination.currentPage - 2 + i
                        }

                        return (
                          <motion.button
                            key={pageNum}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handlePageChange(pageNum)}
                            disabled={isSearching}
                            className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${pageNum === pagination.currentPage
                              ? "bg-primary-main text-white shadow-sm"
                              : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                              } disabled:opacity-50`}
                          >
                            {pageNum}
                          </motion.button>
                        )
                      })}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNextPage || isSearching}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      Next
                    </motion.button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-blue-50 rounded-xl p-6 border border-blue-200"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                  <Star className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-900">Featured Cycles Information</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Select any number of cycles to be featured on the homepage</li>
                    <li>Featured cycles appear in the "Featured Cycles" section for customers</li>
                    <li>Use the checkbox to select/deselect cycles as featured</li>
                    <li>Remember to click "Save Changes" to apply your selections</li>
                    <li>Use the search bar to find specific products quickly</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* View Modal */}
        {showViewModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <img
                      src={selectedProduct.primaryImage || selectedProduct.images[0] || "/placeholder.svg"}
                      alt={selectedProduct.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    {selectedProduct.images.length > 1 && (
                      <div className="mt-4 grid grid-cols-4 gap-2">
                        {selectedProduct.images.slice(1, 5).map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`${selectedProduct.name} ${index + 2}`}
                            className="w-full h-16 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{selectedProduct.name}</h3>
                      <p className="text-gray-600">{selectedProduct.brand}</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary-main">₹{selectedProduct.price.toLocaleString()}</p>
                      {selectedProduct.originalPrice && (
                        <p className="text-gray-500 line-through">₹{selectedProduct.originalPrice.toLocaleString()}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Category:</span>
                        <p className="font-medium">{selectedProduct.category}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Stock:</span>
                        <p className="font-medium">{selectedProduct.stock}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Gear Type:</span>
                        <p className="font-medium">{selectedProduct.gearType}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Brake Type:</span>
                        <p className="font-medium">{selectedProduct.brakeType}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Frame Material:</span>
                        <p className="font-medium">{selectedProduct.frameMaterial}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Weight:</span>
                        <p className="font-medium">{selectedProduct.weight} kg</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Frame Size:</span>
                        <p className="font-medium">{selectedProduct.frameSize}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Wheel Size:</span>
                        <p className="font-medium">{selectedProduct.wheelSize}</p>
                      </div>
                    </div>
                    {selectedProduct.color.length > 0 && (
                      <div>
                        <span className="text-gray-500 text-sm">Available Colors:</span>
                        <div className="flex space-x-2 mt-1">
                          {selectedProduct.color.map((color, index) => (
                            <div key={index} className="flex items-center space-x-1">
                              <div
                                className="w-4 h-4 rounded-full border"
                                style={{ backgroundColor: color.hex }}
                              />
                              <span className="text-sm">{color.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600">{selectedProduct.description}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AdminLayout>
    </ProtectedRoute>
  )
}
