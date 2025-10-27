"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import axios from "axios"
import ProtectedRoute from "@/app/admin/components/ProtectedRoute"
import AdminLayout from "@/app/admin/components/AdminLayout"
import ReviewForm from "@/app/admin/components/ReviewForm"
import LoadingSpinner from "@/app/admin/components/LoadingSpinner"

interface AdminProduct {
  _id: string
  name: string
  brand: string
  price: number
  images: string[]
  category: string
  description: string
  specifications: Record<string, any>
  isActive: boolean
  createdAt: string
  updatedAt: string
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

function EditReviewContent() {
  const searchParams = useSearchParams()
  const reviewId = searchParams?.get('id') || null
  const [review, setReview] = useState<AdminReview | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReview = async () => {
      if (!reviewId) {
        setError("Review ID is required")
        setIsLoading(false)
        return
      }

      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
        const token = localStorage.getItem("token")

        const response = await axios.get(`${API_BASE_URL}/admin/reviews/${reviewId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true
        })

        if (response.data && response.data.data) {
          setReview(response.data.data)
        } else if (response.data) {
          setReview(response.data)
        } else {
          setError("Review data not found")
        }
      } catch (error: any) {
        console.error("Error fetching review:", error)
        if (error.response?.status === 404) {
          setError("Review not found")
        } else {
          setError(error.message || "Failed to fetch review")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchReview()
  }, [reviewId])

  if (isLoading) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-96">
            <LoadingSpinner text="Loading review..." />
          </div>
        </AdminLayout>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Review</h2>
                <p className="text-red-600 mb-4">{error}</p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => window.history.back()}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        {review ? (
          <ReviewForm review={review} isEdit={true} />
        ) : (
          <div className="flex items-center justify-center min-h-96">
            <LoadingSpinner text="Loading review..." />
          </div>
        )}
      </AdminLayout>
    </ProtectedRoute>
  )
}

export default function EditReviewPage() {
  return (
    <Suspense fallback={
      <ProtectedRoute>
        <AdminLayout>
          <LoadingSpinner text="Loading..." />
        </AdminLayout>
      </ProtectedRoute>
    }>
      <EditReviewContent />
    </Suspense>
  )
}