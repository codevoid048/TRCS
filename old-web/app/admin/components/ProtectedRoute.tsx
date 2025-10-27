"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import LoadingSpinner from "./LoadingSpinner"
import { useAuthStore } from "../stores/authStore"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, token, loading, hydrate } = useAuthStore()

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    if (!loading && !token && !user) {
      router.replace("/admin/login")
    }
  }, [loading, token, user, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="Verifying authentication..." />
      </div>
    )
  }
  if (!token) {
    return null
  }
  if (user && token && pathname === "/admin/login") {
    router.replace("/admin/dashboard")
  }
  return <>{children}</>
}

