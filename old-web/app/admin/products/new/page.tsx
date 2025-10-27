"use client"

import ProtectedRoute from "@/app/admin/components/ProtectedRoute"
import AdminLayout from "@/app/admin/components/AdminLayout"
import ProductForm from "@/app/admin/components/ProductForm"

export default function NewProductPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <ProductForm />
      </AdminLayout>
    </ProtectedRoute>
  )
}
