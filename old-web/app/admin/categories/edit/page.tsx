"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import CategoryForm from "@/app/admin/components/CategoryForm"
import LoadingSpinner from "@/app/admin/components/LoadingSpinner"
import ProtectedRoute from "@/app/admin/components/ProtectedRoute"
import AdminLayout from "@/app/admin/components/AdminLayout"
import axios from "axios"

interface Category {
  _id: string
  name: string
  description: string
  image: string
}

function EditCategoryContent() {
  const searchParams = useSearchParams()
  const categoryId = searchParams?.get('id') || null
  const [category, setCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) {
        setError("Category ID is required")
        setIsLoading(false)
        return
      }
      
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        const response = await axios.get(`${API_BASE_URL}/admin/categories/${categoryId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true
        })
        setCategory(response.data.data || response.data)
        setError(null)
      } catch (error) {
        console.error('Error fetching category:', error)
        setError('Failed to fetch category')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategory()
  }, [categoryId])

  if (isLoading) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <LoadingSpinner text="Loading category..." />
        </AdminLayout>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <p className="text-red-600 dark:text-red-400 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Try Again
            </button>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <CategoryForm category={category} isEdit={true} />
      </AdminLayout>
    </ProtectedRoute>
  )
}

export default function EditCategoryPage() {
  return (
    <Suspense fallback={
      <ProtectedRoute>
        <AdminLayout>
          <LoadingSpinner text="Loading..." />
        </AdminLayout>
      </ProtectedRoute>
    }>
      <EditCategoryContent />
    </Suspense>
  )
}