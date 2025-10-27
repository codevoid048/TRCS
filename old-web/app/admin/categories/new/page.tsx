"use client"

import CategoryForm from "@/app/admin/components/CategoryForm"
import ProtectedRoute from "@/app/admin/components/ProtectedRoute"
import AdminLayout from "@/app/admin/components/AdminLayout"

export default function NewCategoryPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <CategoryForm isEdit={false} />
      </AdminLayout>
    </ProtectedRoute>
  )
}