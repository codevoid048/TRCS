"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Search, Plus, Eye, Edit, Trash2, Package, ChevronLeft, ChevronRight } from "lucide-react"
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
  primaryImage: string
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

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Pagination state
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    limit: 20,
    hasNextPage: false,
    hasPrevPage: false
  })

  // API function to fetch products
  const fetchProducts = async (page: number = 1, search: string = "") => {
    try {
      setError(null)
      if (page === 1 && !search) {
        setIsLoading(true)
      } else {
        setIsSearching(true)
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
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
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true
      })

      setProducts(response.data.data.products)
      setPagination(response.data.data.pagination)
      setSearchTerm(search)

    } catch (error: any) {
      console.error("Error fetching products:", error)
      const errorMessage = error.response?.data?.message || "Failed to load products"
      setError(errorMessage)
      toast.error(errorMessage)
      setProducts([])
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalProducts: 0,
        limit: 20,
        hasNextPage: false,
        hasPrevPage: false
      })
    } finally {
      setIsLoading(false)
      setIsSearching(false)
    }
  }

  // Load products on component mount
  useEffect(() => {
    fetchProducts()
  }, [])

  // Handle search
  const handleSearch = () => {
    fetchProducts(1, searchInput)
  }

  // Handle enter key in search
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    fetchProducts(newPage, searchTerm)
  }

  // Clear search
  const clearSearch = () => {
    setSearchInput("")
    setSearchTerm("")
    fetchProducts(1, "")
  }

  const handleView = (product: AdminProduct) => {
    setSelectedProduct(product)
    setShowViewModal(true)
  }

  const handleEdit = (product: AdminProduct) => {
    router.push(`/admin/products/edit?id=${product._id}`)
  }

  const handleDelete = (product: AdminProduct) => {
    setSelectedProduct(product)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!selectedProduct) return

    const loadingToast = toast.loading(`Deleting ${selectedProduct.name}...`)

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
      const token = localStorage.getItem("token")

      await axios.delete(`${API_BASE_URL}/admin/products/${selectedProduct._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true
      })

      toast.dismiss(loadingToast)
      toast.success(`${selectedProduct.name} deleted successfully`)

      // Refresh the current page to show updated results
      fetchProducts(pagination.currentPage, searchTerm)
      setShowDeleteModal(false)
      setSelectedProduct(null)
    } catch (error: any) {
      console.error("Error deleting product:", error)
      const errorMessage = error.response?.data?.message || "Failed to delete product"
      setError(errorMessage)
      toast.dismiss(loadingToast)
      toast.error(errorMessage)
    }
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-96">
            <LoadingSpinner text="Loading products..." />
          </div>
        </AdminLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-600 mt-1">Manage your cycle inventory</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/admin/products/new")}
              className="bg-primary-main hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-200"
            >
              <Plus className="h-5 w-5" />
              <span>Add New Product</span>
            </motion.button>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products by name, brand, or category..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-primary-main hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-200 disabled:opacity-50"
              >
                {isSearching ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
                <span>{isSearching ? "Searching..." : "Search"}</span>
              </motion.button>
              {searchTerm && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={clearSearch}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-semibold transition-all duration-200"
                >
                  Clear
                </motion.button>
              )}
            </div>
            {searchTerm && (
              <div className="mt-3 text-sm text-gray-600">
                Search results for "{searchTerm}" - {pagination.totalProducts} products found
              </div>
            )}
            {error && (
              <div className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}
          </motion.div>

          {/* Products Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Image</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
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
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleView(product)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(product)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(product)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {products.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchTerm ? `No products found for "${searchTerm}"` : "No products found"}
                </p>
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="mt-2 text-primary-main hover:text-primary-dark font-medium"
                  >
                    Clear search to view all products
                  </button>
                )}
              </div>
            )}
          </motion.div>

          {/* Pagination */}
          {products.length > 0 && pagination.totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                  <div className="text-sm text-gray-700">
                    Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{" "}
                    {Math.min(pagination.currentPage * pagination.limit, pagination.totalProducts)} of{" "}
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
            </motion.div>
          )}

          {/* Empty State */}
          {products.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-12 text-center"
            >
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? "No products match your search criteria." : "Get started by adding your first product."}
              </p>
              {searchTerm ? (
                <button
                  onClick={clearSearch}
                  className="bg-primary-main hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200"
                >
                  Clear search to view all products
                </button>
              ) : (
                <button
                  onClick={() => router.push("/admin/products/new")}
                  className="bg-primary-main hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200"
                >
                  Add Your First Product
                </button>
              )}
            </motion.div>
          )}
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

        {/* Delete Modal */}
        {showDeleteModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Product</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete "{selectedProduct.name}"? This action cannot be undone.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AdminLayout>
    </ProtectedRoute>
  )
}
