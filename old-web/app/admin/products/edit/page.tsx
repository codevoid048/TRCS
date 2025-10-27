"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import axios from "axios"
import ProtectedRoute from "@/app/admin/components/ProtectedRoute"
import AdminLayout from "@/app/admin/components/AdminLayout"
import ProductForm from "@/app/admin/components/ProductForm"
import LoadingSpinner from "@/app/admin/components/LoadingSpinner"

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

function EditProductContent() {
  const searchParams = useSearchParams()
  const productId = searchParams?.get('id') || null
  const [product, setProduct] = useState<AdminProduct | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError("Product ID is required")
        setNotFound(true)
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
        const token = localStorage.getItem("token")

        const response = await axios.get(`${API_BASE_URL}/admin/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true
        })

        if (response.data && response.data.data) {
          setProduct(response.data.data)
        } else {
          setNotFound(true)
          setError("Product data not found")
        }
      } catch (error: any) {
        console.error("Error fetching product:", error)
        if (error.response?.status === 404) {
          setNotFound(true)
          setError("Product not found")
        } else {
          setError(error.message || "Failed to fetch product")
          setNotFound(true)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  if (isLoading) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-96">
            <LoadingSpinner text="Loading product..." />
          </div>
        </AdminLayout>
      </ProtectedRoute>
    )
  }

  if (notFound) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-red-800 mb-2">Product Not Found</h2>
                <p className="text-red-600 mb-4">
                  {error || "The product you're looking for doesn't exist or has been removed."}
                </p>
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
        {product ? (
          <ProductForm product={product} isEdit={true} />
        ) : (
          <div className="flex items-center justify-center min-h-96">
            <LoadingSpinner text="Loading product..." />
          </div>
        )}
      </AdminLayout>
    </ProtectedRoute>
  )
}

export default function EditProductPage() {
  return (
    <Suspense fallback={
      <ProtectedRoute>
        <AdminLayout>
          <LoadingSpinner text="Loading..." />
        </AdminLayout>
      </ProtectedRoute>
    }>
      <EditProductContent />
    </Suspense>
  )
}