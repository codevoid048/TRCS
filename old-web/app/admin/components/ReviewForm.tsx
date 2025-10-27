"use client"

import type React from "react"
import axios from "axios"
import toast from "react-hot-toast"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Save, ArrowLeft, Star } from "lucide-react"

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

interface ReviewFormProps {
  review?: AdminReview
  isEdit?: boolean
}

export default function ReviewForm({ review, isEdit = false }: ReviewFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [productsLoading, setProductsLoading] = useState(true)
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [formData, setFormData] = useState({
    reviewerName: "",
    address: "",
    cycleId: "",
    cycleName: "",
    comment: "",
    rating: 5,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
        const response = await axios.get(`${API_BASE_URL}/admin/products`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
          params: {
            limit: 100, // Get all products for dropdown
            page: 1
          }
        })

        if (response.data.data.products) {
          setProducts(response.data.data.products)
        }
      } catch (error: any) {
        console.error('Failed to load products:', error)
        const errorMessage = 'Failed to load products. Please refresh the page.'
        setErrors({ general: errorMessage })
        toast.error(errorMessage)
      } finally {
        setProductsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    if (review && isEdit) {
      setFormData({
        reviewerName: review.reviewerName || "",
        address: review.address || "",
        cycleId: review.cycleId || "",
        cycleName: review.cycleName || "",
        comment: review.comment || "",
        rating: review.rating || 5,
      })
    }
  }, [review, isEdit])

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const handleCycleChange = (cycleId: string) => {
    const selectedProduct = products.find((p: AdminProduct) => p._id === cycleId)
    setFormData((prev) => ({
      ...prev,
      cycleId,
      cycleName: selectedProduct?.name || "",
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.reviewerName.trim()) newErrors.reviewerName = "Reviewer name is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.cycleId) newErrors.cycleId = "Please select a cycle"
    if (!formData.comment.trim()) newErrors.comment = "Comment is required"
    if (formData.comment.trim().length < 10) newErrors.comment = "Comment should be at least 10 characters"
    if (formData.rating < 1 || formData.rating > 5) newErrors.rating = "Rating should be between 1 and 5"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    const loadingToast = toast.loading(
      isEdit ? `Updating review by ${formData.reviewerName}...` : `Creating review by ${formData.reviewerName}...`
    )

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      
      const reviewData = {
        reviewerName: formData.reviewerName,
        address: formData.address,
        cycleId: formData.cycleId,
        cycleName: formData.cycleName,
        comment: formData.comment,
        rating: formData.rating,
      }

      if (isEdit && review) {
        // Update existing review
        await axios.put(`${API_BASE_URL}/admin/reviews/${review._id}`, reviewData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          withCredentials: true
        })
        toast.dismiss(loadingToast)
        toast.success(`Review by ${formData.reviewerName} updated successfully`)
        // console.log("Review updated successfully")
      } else {
        // Create new review
        await axios.post(`${API_BASE_URL}/admin/reviews`, reviewData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          withCredentials: true
        })
        toast.dismiss(loadingToast)
        toast.success(`Review by ${formData.reviewerName} created successfully`)
        // console.log("Review created successfully")
      }

      router.push("/admin/reviews")
    } catch (error: any) {
      console.error("Error saving review:", error)
      
      toast.dismiss(loadingToast)
      
      // Handle specific API errors
      if (error.response?.data?.message) {
        const backendError = error.response.data
        const errorMessage = backendError.message || "Failed to save review"
        toast.error(errorMessage)
        
        if (backendError.field) {
          setErrors({ [backendError.field]: backendError.message })
        } else {
          setErrors({ general: backendError.message })
        }
      } else {
        const errorMessage = "Failed to save review. Please try again."
        toast.error(errorMessage)
        setErrors({ general: errorMessage })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={interactive ? () => handleInputChange("rating", i + 1) : undefined}
        className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
        disabled={!interactive}
      >
        <Star className={`h-6 w-6 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
      </button>
    ))
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.back()}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{isEdit ? "Edit Review" : "Add New Review"}</h1>
                <p className="text-gray-600 mt-1">
                  {isEdit ? "Update review information" : "Fill in the details to add a new customer review"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* General Error */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Loading State for Products */}
          {productsLoading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-blue-800 text-sm">Loading products...</span>
              </div>
            </div>
          )}

          {/* Reviewer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Reviewer Name *</label>
              <input
                type="text"
                value={formData.reviewerName}
                onChange={(e) => handleInputChange("reviewerName", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent transition-all ${
                  errors.reviewerName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter reviewer name"
              />
              {errors.reviewerName && <p className="text-red-500 text-sm mt-1">{errors.reviewerName}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Address *</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent transition-all ${
                  errors.address ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g., Mumbai, Maharashtra"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>
          </div>

          {/* Cycle Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Cycle *</label>
            <select
              value={formData.cycleId}
              onChange={(e) => handleCycleChange(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent transition-all ${
                errors.cycleId ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="" className="text-gray-500">
                {productsLoading ? "Loading cycles..." : "Select a cycle"}
              </option>
              {!productsLoading && products.map((product: AdminProduct) => (
                <option key={product._id} value={product._id} className="text-gray-900">
                  {product.name} - {product.brand} (₹{product.price.toLocaleString()})
                </option>
              ))}
            </select>
            {errors.cycleId && <p className="text-red-500 text-sm mt-1">{errors.cycleId}</p>}
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Rating *</label>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">{renderStars(formData.rating, true)}</div>
              <span className="text-gray-600 ml-4">({formData.rating}/5)</span>
            </div>
            {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Comment *</label>
            <textarea
              value={formData.comment}
              onChange={(e) => handleInputChange("comment", e.target.value)}
              rows={5}
              className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent transition-all resize-none ${
                errors.comment ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Write your review comment here... (minimum 10 characters)"
            />
            <div className="flex justify-between items-center mt-1">
              {errors.comment && <p className="text-red-500 text-sm">{errors.comment}</p>}
              <p className="text-gray-500 text-sm ml-auto">{formData.comment.length} characters</p>
            </div>
          </div>

          {/* Preview */}
          {formData.reviewerName && formData.comment && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Preview</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">{formData.reviewerName}</p>
                  <div className="flex items-center space-x-1">{renderStars(formData.rating)}</div>
                </div>
                <p className="text-sm text-gray-600">{formData.address}</p>
                {formData.cycleName && <p className="text-sm text-primary-main font-medium">{formData.cycleName}</p>}
                <p className="text-gray-700 text-sm leading-relaxed">{formData.comment}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="bg-primary-main hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{isEdit ? "Update Review" : "Add Review"}</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
