"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Eye, Plus, Edit2, Trash2, Package, Tag, Calendar, Image as ImageIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import ProtectedRoute from "@/app/admin/components/ProtectedRoute"
import AdminLayout from "@/app/admin/components/AdminLayout"
import LoadingSpinner from "@/app/admin/components/LoadingSpinner"
import toast from "react-hot-toast"
import axios from "axios"
import Image from "next/image"

interface Category {
  _id: string
  name: string
  description: string
  image: string
  slug: string
}

export default function CategoriesPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      
      const response = await axios.get(`${API_BASE_URL}/admin/categories`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        withCredentials: true
      })

      if (response.status === 200) {
        // Ensure we always get an array
        let categoriesData = response.data.data || response.data || []
        
        // Additional safety check - if it's not an array, make it one
        if (!Array.isArray(categoriesData)) {
          console.warn('Categories data is not an array:', categoriesData)
          categoriesData = []
        }
        
        setCategories(categoriesData)
      }
    } catch (error: any) {
      console.error('Error fetching categories:', error)
      toast.error(error.response?.data?.message || "Failed to fetch categories")
      // Set empty array on error
      setCategories([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // Handle view category
  const handleView = (category: Category) => {
    setSelectedCategory(category)
    setShowViewModal(true)
  }

  // Handle add category - navigate to new page
  const handleAdd = () => {
    router.push('/admin/categories/new')
  }

  // Handle edit category - navigate to edit page
  const handleEdit = (category: Category) => {
    router.push(`/admin/categories/edit?id=${category._id}`)
  }

  // Handle delete category (show confirmation modal)
  const handleDelete = (category: Category) => {
    setCategoryToDelete(category)
    setShowDeleteModal(true)
  }

  // Delete category
  const deleteCategory = async () => {
    if (!categoryToDelete) return

    setIsDeleting(true)
    const loadingToast = toast.loading(`Deleting ${categoryToDelete.name}...`)

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      
      await axios.delete(`${API_BASE_URL}/admin/categories/${categoryToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        withCredentials: true
      })

      // Remove from local state
      setCategories(prevCategories => 
        prevCategories.filter(cat => cat._id !== categoryToDelete._id)
      )
      
      toast.dismiss(loadingToast)
      toast.success(`${categoryToDelete.name} has been successfully deleted`)
      setShowDeleteModal(false)
      setCategoryToDelete(null)
    } catch (error: any) {
      console.error('Error deleting category:', error)
      toast.dismiss(loadingToast)
      toast.error(error.response?.data?.message || "Failed to delete category")
    } finally {
      setIsDeleting(false)
    }
  }

  // Calculate stats safely
  const totalCategories = Array.isArray(categories) ? categories.length : 0
  const categoriesWithImages = Array.isArray(categories) ? categories.filter(cat => cat && cat.image).length : 0

  if (isLoading) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-96">
            <LoadingSpinner text="Loading categories..." />
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
              <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
              <p className="text-gray-600 mt-1">
                Manage product categories ({totalCategories} total)
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAdd}
              className="bg-primary-main text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors flex items-center space-x-2 shadow-lg"
            >
              <Plus className="h-5 w-5" />
              <span>Add Category</span>
            </motion.button>
          </motion.div>

          {/* Categories Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Tag className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Total Categories</h3>
                  <p className="text-2xl font-bold text-blue-600">{totalCategories}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Active</h3>
                  <p className="text-2xl font-bold text-green-600">{totalCategories}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full">
                  <ImageIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">With Images</h3>
                  <p className="text-2xl font-bold text-purple-600">{categoriesWithImages}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Categories Grid */}
          {Array.isArray(categories) && categories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {categories.map((category, index) => (
                <motion.div
                  key={category?._id || `category-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  {/* Category Image */}
                  <div className="h-48 relative overflow-hidden">
                    {category?.image ? (
                      <Image
                        src={category.image}
                        alt={category?.name || 'Category'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <ImageIcon className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                        Category
                      </span>
                    </div>
                  </div>

                  {/* Category Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 truncate">
                      {category?.name || 'Unnamed Category'}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {category?.description || 'No description available'}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleView(category)}
                        className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center space-x-1"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="text-xs font-medium">View</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(category)}
                        className="flex-1 p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors flex items-center justify-center space-x-1"
                        title="Edit Category"
                      >
                        <Edit2 className="h-4 w-4" />
                        <span className="text-xs font-medium">Edit</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(category)}
                        className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center space-x-1"
                        title="Delete Category"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="text-xs font-medium">Delete</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Empty State */}
          {(!Array.isArray(categories) || categories.length === 0) && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 bg-white rounded-xl shadow-lg"
            >
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories yet</h3>
                <p className="text-gray-500 mb-8 leading-relaxed">
                  Categories help organize your products and make it easier for customers to find what they're looking for. 
                  Create your first category to get started.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAdd}
                  className="bg-primary-main text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors inline-flex items-center space-x-2 font-medium"
                >
                  <Plus className="h-5 w-5" />
                  <span>Create First Category</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>

        {/* View Modal */}
        <AnimatePresence>
          {showViewModal && selectedCategory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowViewModal(false)
                }
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Category Preview</h2>
                    <button
                      onClick={() => setShowViewModal(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Category Preview */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-xl overflow-hidden border border-gray-200 mb-6">
                    <div className="flex flex-col md:flex-row">
                      {/* Content Side */}
                      <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left px-6 md:px-12 py-8 md:py-12">
                        <div className="space-y-4 md:space-y-6">
                          <motion.h3
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-3xl md:text-4xl font-bold text-gray-900"
                          >
                            {selectedCategory?.name || 'Unnamed Category'}
                          </motion.h3>

                          <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-gray-600 leading-relaxed"
                          >
                            {selectedCategory?.description || 'No description available'}
                          </motion.p>

                          <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center justify-center md:justify-start space-x-3 text-primary-main font-medium"
                          >
                            <span>Explore Collection</span>
                            <div className="w-6 h-6 rounded-full bg-primary-main flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </motion.div>
                        </div>
                      </div>

                      {/* Image Side */}
                      <div className="w-full md:w-1/2 h-64 md:h-80 relative">
                        {selectedCategory?.image ? (
                          <Image
                            src={selectedCategory.image}
                            alt={selectedCategory?.name || 'Category'}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <ImageIcon className="h-16 w-16 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Category Details */}
                  {/* <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4 text-lg">Category Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <span className="text-gray-500 text-sm font-medium">Category ID:</span>
                          <p className="font-mono text-sm bg-white px-2 py-1 rounded border">{selectedCategory?._id || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <span className="text-gray-500 text-sm font-medium">Has Image:</span>
                          <p className="font-medium">
                            {selectedCategory?.image ? (
                              <span className="text-green-600">✓ Yes</span>
                            ) : (
                              <span className="text-red-600">✗ No</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div> */}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && categoryToDelete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget && !isDeleting) {
                  setShowDeleteModal(false)
                  setCategoryToDelete(null)
                }
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-xl shadow-2xl max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                      <Trash2 className="h-8 w-8 text-red-600" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                    Delete Category
                  </h3>
                  
                  <p className="text-gray-600 text-center mb-6 leading-relaxed">
                    Are you sure you want to delete <strong className="text-gray-900">"{categoryToDelete?.name || 'this category'}"</strong>? 
                    This action cannot be undone and will permanently remove this category.
                  </p>
                  
                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (!isDeleting) {
                          setShowDeleteModal(false)
                          setCategoryToDelete(null)
                        }
                      }}
                      disabled={isDeleting}
                      className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium disabled:opacity-50"
                    >
                      Cancel
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={deleteCategory}
                      disabled={isDeleting}
                      className="flex-1 px-4 py-3 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors font-medium disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                      {isDeleting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Deleting...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4" />
                          <span>Delete Category</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </AdminLayout>
    </ProtectedRoute>
  )
}