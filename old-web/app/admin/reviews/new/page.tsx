"use client"

import ProtectedRoute from "@/app/admin/components/ProtectedRoute"
import AdminLayout from "@/app/admin/components/AdminLayout"
import ReviewForm from "@/app/admin/components/ReviewForm"

export default function NewReviewPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="max-w-4xl mx-auto">
          <ReviewForm />
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}