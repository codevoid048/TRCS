"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Star, Eye, Edit, Trash2, Plus, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import ProtectedRoute from "../components/ProtectedRoute"
import AdminLayout from "../components/AdminLayout"
import LoadingSpinner from "../components/LoadingSpinner"
import { adminAPI } from "@/lib/api/adminAPI"

// Updated interfaces to match API response
interface AdminProduct {
  _id: string
  name: string
  brand: string
  category: string
  price: number
  images: string[]
}

interface AdminReview {
  _id: string
  reviewerName: string
  address: string
  cycleId: string
  cycleName: string
  comment: string
  rating: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  cycle?: AdminProduct
}

interface ReviewsResponse {
  message: string
  data: {
    reviews: AdminReview[]
    pagination: {
      currentPage: number
      totalPages: number
      totalReviews: number
      limit: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
    filters: {
      cycleId: string | null
      rating: number | null
      sortBy: string
      sortOrder: string
    }
  }
}

export default function ReviewsPage() {
  const router = useRouter()
  const [reviews, setReviews] = useState<AdminReview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedReview, setSelectedReview] = useState<AdminReview | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  
  // Pagination and filters
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalReviews, setTotalReviews] = useState(0)
  const [filterRating, setFilterRating] = useState<number | "">("")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState("desc")

  const fetchReviews = async (page = 1) => {
    try {
      setIsLoading(true)
      
      const data = await adminAPI.getReviews(
        page,
        10,
        filterRating !== "" ? Number(filterRating) : undefined,
        sortBy,
        sortOrder
      )
      
      // Log cache statistics in development
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('Admin Reviews Cache Stats:', adminAPI.getCacheStats())
      // }
      
      setReviews(data.reviews)
      setCurrentPage(data.pagination.currentPage)
      setTotalPages(data.pagination.totalPages)
      setTotalReviews(data.pagination.totalItems)
    } catch (error: any) {
      console.error("Error fetching reviews:", error)
      const errorMessage = error.response?.data?.message || "Failed to load reviews"
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews(currentPage)
  }, [currentPage])

  // Separate effect for filters that resets to page 1
  useEffect(() => {
    if (currentPage === 1) {
      fetchReviews(1)
    } else {
      setCurrentPage(1)
    }
  }, [filterRating, sortBy, sortOrder])

  const handleView = async (review: AdminReview) => {
    try {
      const reviewDetails = await adminAPI.getReview(review._id)
      setSelectedReview(reviewDetails)
      setShowViewModal(true)
    } catch (error: any) {
      console.error("Error fetching review details:", error)
      const errorMessage = error.response?.data?.message || "Failed to load review details"
      toast.error(errorMessage)
      // Fallback to current review data
      setSelectedReview(review)
      setShowViewModal(true)
    }
  }

  const handleEdit = (review: AdminReview) => {
    router.push(`/admin/reviews/edit?id=${review._id}`)
  }

  const handleDelete = (review: AdminReview) => {
    setSelectedReview(review)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!selectedReview) return

    const loadingToast = toast.loading(`Deleting review by ${selectedReview.reviewerName}...`)

    try {
      await adminAPI.deleteReview(selectedReview._id)
      
      toast.dismiss(loadingToast)
      toast.success(`Review by ${selectedReview.reviewerName} deleted successfully`)
      
      // Refresh the reviews list
      fetchReviews(currentPage)
      setShowDeleteModal(false)
      setSelectedReview(null)
    } catch (error: any) {
      console.error("Error deleting review:", error)
      const errorMessage = error.response?.data?.message || "Failed to delete review"
      toast.dismiss(loadingToast)
      toast.error(errorMessage)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-96">
            <LoadingSpinner text="Loading reviews..." />
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
              <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
              <p className="text-gray-600 mt-1">Manage customer reviews and feedback ({totalReviews} total)</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/admin/reviews/new")}
              className="bg-primary-main hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-200"
            >
              <Plus className="h-5 w-5" />
              <span>Add New Review</span>
            </motion.button>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating Filter</label>
                  <select
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value ? Number(e.target.value) : "")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main"
                  >
                    <option value="">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main"
                  >
                    <option value="createdAt">Date Created</option>
                    <option value="rating">Rating</option>
                    <option value="reviewerName">Reviewer Name</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
              </div>
          </motion.div>

          {/* Reviews Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Reviewer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Address</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Cycle</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Comment Preview</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rating</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reviews.map((review, index) => (
                    <motion.tr
                      key={review._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{review.reviewerName}</p>
                          <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{review.address}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={review.cycle?.images?.[0] || "/placeholder.svg"}
                            alt={review.cycleName}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{review.cycleName}</p>
                            <p className="text-sm text-gray-500">{review.cycle?.brand || "Unknown Brand"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900 max-w-xs truncate">
                          {review.comment.length > 50 ? `${review.comment.substring(0, 50)}...` : review.comment}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1">{renderStars(review.rating)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleView(review)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(review)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(review)}
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

            {reviews.length === 0 && (
              <div className="text-center py-12">
                <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No reviews found</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                  <div className="text-sm text-gray-700">
                    Showing {((currentPage - 1) * 10) + 1} to{' '}
                    {Math.min(currentPage * 10, totalReviews)} of{' '}
                    {totalReviews} reviews
                  </div>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      Previous
                    </motion.button>
                    
                    <div className="flex space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum: number
                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }
                        
                        return (
                          <motion.button
                            key={pageNum}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                              pageNum === currentPage
                                ? 'bg-primary-main text-white shadow-sm'
                                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </motion.button>
                        )
                      })}
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      Next
                    </motion.button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* View Modal */}
        {showViewModal && selectedReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Review Details</h2>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Reviewer Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Reviewer Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-500 text-sm">Name:</span>
                        <p className="font-medium text-gray-900">{selectedReview.reviewerName}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-sm">Address:</span>
                        <p className="font-medium text-gray-900">{selectedReview.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Cycle Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Cycle Information</h3>
                    <div className="flex items-center space-x-4">
                      <img
                        src={selectedReview.cycle?.images?.[0] || "/placeholder.svg"}
                        alt={selectedReview.cycleName}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{selectedReview.cycleName}</p>
                        <p className="text-gray-600">{selectedReview.cycle?.brand || "Unknown Brand"}</p>
                        <p className="text-lg font-bold text-primary-main">
                          ₹{selectedReview.cycle?.price?.toLocaleString() || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Rating</h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">{renderStars(selectedReview.rating)}</div>
                      <span className="text-gray-600">({selectedReview.rating}/5)</span>
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Comment</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 leading-relaxed">{selectedReview.comment}</p>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Created:</span>
                      <p className="font-medium text-gray-900">{formatDate(selectedReview.createdAt)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Updated:</span>
                      <p className="font-medium text-gray-900">{formatDate(selectedReview.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && selectedReview && (
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Review</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this review from "{selectedReview.reviewerName}"? This action cannot
                  be undone.
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
