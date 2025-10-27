"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Package, MessageSquare, CheckCircle, Plus, Eye, TrendingUp, RefreshCcw, AlertCircle } from "lucide-react"
import ProtectedRoute from "../components/ProtectedRoute"
import AdminLayout from "../components/AdminLayout"
import StatCard from "../components/StatCard"
import LoadingSpinner from "../components/LoadingSpinner"
import { adminAPI } from "@/lib/api/adminAPI"
import toast from "react-hot-toast"

interface DashboardStats {
  totalProducts: number
  totalRequests: number
  ongoingRequests: number
  completedRequests: number
  totalReviews: number
}

interface RecentActivity {
  id: string
  type: "request" | "review" | "product"
  message: string
  productName: string
  time: string
}

interface DashboardData {
  stats: DashboardStats
  recentActivities: RecentActivity[]
}

export default function AdminDashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchDashboardData = async (useCache: boolean = true) => {
    try {
      setIsLoading(true)
      setHasError(false)

      // If not using cache, clear dashboard cache first
      if (!useCache) {
        adminAPI.invalidateCache('^dashboard')
      }

      const data = await adminAPI.getDashboardData()
      setDashboardData(data)
      setLastUpdated(new Date())
      
      // Log cache statistics in development
      // if (process.env.NODE_ENV === 'development') {
      //   const stats = adminAPI.getCacheStats()
      //   console.log('[Dashboard] Cache Stats:', {
      //     hitRatio: `${adminAPI.getCacheHitRatio().toFixed(1)}%`,
      //     ...stats
      //   })
      // }
      
    } catch (error: any) {
      setHasError(true)
      
      if (error.response?.status === 401) {
        setErrorMessage("Session expired. Please login again.")
        toast.error("Session expired. Redirecting to login...")
        // AdminAPI already handles the redirect, but we can show a message
      } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        setErrorMessage("Request timed out. Please check your connection.")
        toast.error("Request timed out. Please check your connection.")
      } else {
        const message = error.response?.data?.message || "Failed to load dashboard data"
        setErrorMessage(message)
        toast.error(message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleRetry = () => {
    fetchDashboardData(true) // Use cache
  }

  const handleForceRefresh = () => {
    fetchDashboardData(false) // Skip cache
    toast.success("Data refreshed")
  }

  // Skeleton component for loading states
  const StatCardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="h-10 w-10 bg-gray-200 rounded"></div>
      </div>
      <div className="mt-4 h-3 bg-gray-200 rounded w-20"></div>
    </div>
  )

  const ActivitySkeleton = () => (
    <div className="flex items-center space-x-4 p-3 rounded-lg animate-pulse">
      <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
              <div>
                <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <StatCardSkeleton key={i} />
              ))}
            </div>

            {/* Quick Actions Skeleton */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>

            {/* Recent Activity Skeleton */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="h-6 bg-gray-200 rounded w-36 mb-4 animate-pulse"></div>
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <ActivitySkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    )
  }

  if (hasError) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center min-h-96">
              <div className="text-center">
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Dashboard</h2>
                <p className="text-gray-600 mb-6">{errorMessage}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRetry}
                  className="bg-primary-main hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
                >
                  <RefreshCcw className="h-4 w-4" />
                  <span>Try Again</span>
                </motion.button>
              </div>
            </div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    )
  }

  if (!dashboardData) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-96">
            <LoadingSpinner text="Loading dashboard..." />
          </div>
        </AdminLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your store.</p>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleForceRefresh}
                disabled={isLoading}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                title="Force refresh (clears cache)"
              >
                <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </motion.button>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Last updated: </span>
                <span className="text-sm font-medium text-gray-900">
                  {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
          >
            <StatCard
              title="Total Products"
              value={dashboardData.stats.totalProducts}
              icon={Package}
              color="border-blue-500"
              trend={{ value: 12, isPositive: true }}
              onClick={() => router.push("/admin/products")}
            />
            <StatCard
              title="Total Requests"
              value={dashboardData.stats.totalRequests}
              icon={MessageSquare}
              color="border-yellow-500"
              trend={{ value: 8, isPositive: true }}
              onClick={() => router.push("/admin/requests")}
            />
            <StatCard
              title="Ongoing Requests"
              value={dashboardData.stats.ongoingRequests}
              icon={RefreshCcw}
              color="border-orange-500"
              trend={{ value: 3, isPositive: false }}
              onClick={() => router.push("/admin/requests")}
            />
            <StatCard
              title="Completed Requests"
              value={dashboardData.stats.completedRequests}
              icon={CheckCircle}
              color="border-green-500"
              trend={{ value: 15, isPositive: true }}
              onClick={() => router.push("/admin/requests")}
            />
            <StatCard
              title="Total Reviews"
              value={dashboardData.stats.totalReviews}
              icon={TrendingUp}
              color="border-purple-500"
              trend={{ value: 5, isPositive: true }}
              onClick={() => router.push("/admin/reviews")}
            />
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/admin/products/new")}
                className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-main hover:bg-primary-main/5 transition-all duration-200"
              >
                <Plus className="h-6 w-6 text-primary-main" />
                <span className="font-medium text-gray-700">Add New Product</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/admin/products")}
                className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-main hover:bg-primary-main/5 transition-all duration-200"
              >
                <Eye className="h-6 w-6 text-primary-main" />
                <span className="font-medium text-gray-700">View All Products</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/admin/requests")}
                className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-main hover:bg-primary-main/5 transition-all duration-200"
              >
                <MessageSquare className="h-6 w-6 text-primary-main" />
                <span className="font-medium text-gray-700">View All Requests</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {dashboardData.recentActivities.length > 0 ? (
                dashboardData.recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.type === "request"
                          ? "bg-yellow-500"
                          : activity.type === "product"
                            ? "bg-blue-500"
                            : "bg-green-500"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        <span className="font-medium">{activity.productName}</span> • {activity.time}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No recent activities</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}
