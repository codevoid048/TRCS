"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Eye, Trash2, Check, Upload, Image as ImageIcon } from "lucide-react"
import ProtectedRoute from "@/app/admin/components/ProtectedRoute"
import AdminLayout from "@/app/admin/components/AdminLayout"
import LoadingSpinner from "@/app/admin/components/LoadingSpinner"
import toast from "react-hot-toast"
import axios from "axios"
import Image from "next/image"
import BannerUpload from "@/app/admin/hero-banner/components/BannerUpload"
import BannerPreview from "@/app/admin/hero-banner/components/BannerPreview"

interface HeroBanner {
  _id: string
  title: string
  imageUrl: string
  imageAlt: string
  isActive: boolean
  createdBy: {
    _id: string
    email: string
  }
  metadata: {
    originalFilename: string
    fileSize: number
    mimeType: string
    campaign?: string
    [key: string]: any
  }
  createdAt: string
  updatedAt: string
}

export default function HeroBannerPage() {
  const [banners, setBanners] = useState<HeroBanner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedBanner, setSelectedBanner] = useState<HeroBanner | null>(null)
  const [bannerToDelete, setBannerToDelete] = useState<HeroBanner | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch banners from API
  const fetchBanners = async () => {
    try {
      setIsLoading(true)
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      
      const response = await axios.get(`${API_BASE_URL}/admin/hero-banners`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        withCredentials: true
      })

      if (response.status === 200) {
        const bannersData = response.data.data?.banners || []
        setBanners(bannersData)
      }
    } catch (error: any) {
      console.error('Error fetching hero banners:', error)
      toast.error('Failed to load hero banners')
    } finally {
      setIsLoading(false)
    }
  }

  // Activate banner
  const activateBanner = async (bannerId: string) => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      
      const response = await axios.put(
        `${API_BASE_URL}/admin/hero-banners/${bannerId}/activate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          withCredentials: true
        }
      )

      if (response.status === 200) {
        toast.success('Banner activated successfully')
        fetchBanners() // Refresh the list
      }
    } catch (error: any) {
      console.error('Error activating banner:', error)
      toast.error('Failed to activate banner')
    }
  }

  // Delete banner
  const deleteBanner = async (bannerId: string) => {
    try {
      setIsDeleting(true)
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      
      const response = await axios.delete(`${API_BASE_URL}/admin/hero-banners/${bannerId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true
      })

      if (response.status === 200) {
        toast.success('Banner deleted successfully')
        setBanners(banners.filter(banner => banner._id !== bannerId))
        setShowDeleteModal(false)
        setBannerToDelete(null)
      }
    } catch (error: any) {
      console.error('Error deleting banner:', error)
      toast.error('Failed to delete banner')
    } finally {
      setIsDeleting(false)
    }
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  useEffect(() => {
    fetchBanners()
  }, [])

  if (isLoading) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner />
          </div>
        </AdminLayout>
      </ProtectedRoute>
    )
  }

  const activeBanner = banners.find(banner => banner.isActive)

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hero Banner Management</h1>
              <p className="text-gray-600 mt-1">
                Manage hero banners for the website homepage
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowUploadModal(true)}
              className="bg-primary-main text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Upload New Banner
            </motion.button>
          </div>

          {/* Active Banner Section */}
          {activeBanner && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                <Check className="h-5 w-5" />
                Currently Active Banner
              </h2>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden">
                  <Image
                    src={activeBanner.imageUrl}
                    alt={activeBanner.imageAlt}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{activeBanner.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{activeBanner.imageAlt}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                    <span>Size: {formatFileSize(activeBanner.metadata.fileSize)}</span>
                    <span>Created: {formatDate(activeBanner.createdAt)}</span>
                    <span>By: {activeBanner.createdBy.email}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Banners Grid */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                All Banners ({banners.length})
              </h2>
            </div>
            
            {banners.length === 0 ? (
              <div className="p-12 text-center">
                <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No banners yet</h3>
                <p className="text-gray-600 mb-6">Upload your first hero banner to get started</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowUploadModal(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Upload Banner
                </motion.button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {banners.map((banner) => (
                  <motion.div
                    key={banner._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Banner Image */}
                    <div className="relative h-48 bg-gray-100">
                      <Image
                        src={banner.imageUrl}
                        alt={banner.imageAlt}
                        fill
                        className="object-cover"
                      />
                      {banner.isActive && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          Active
                        </div>
                      )}
                    </div>

                    {/* Banner Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">
                        {banner.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {banner.imageAlt}
                      </p>
                      
                      <div className="flex flex-col gap-2 text-xs text-gray-500 mb-4">
                        <div className="flex justify-between">
                          <span>Size:</span>
                          <span>{formatFileSize(banner.metadata.fileSize)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Created:</span>
                          <span>{formatDate(banner.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>By:</span>
                          <span className="truncate ml-2">{banner.createdBy.email}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedBanner(banner)
                            setShowPreviewModal(true)
                          }}
                          className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          Preview
                        </motion.button>
                        
                        {!banner.isActive && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => activateBanner(banner._id)}
                            className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded text-sm font-medium hover:bg-green-200 transition-colors flex items-center justify-center gap-1"
                          >
                            <Check className="h-4 w-4" />
                            Activate
                          </motion.button>
                        )}
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setBannerToDelete(banner)
                            setShowDeleteModal(true)
                          }}
                          className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm font-medium hover:bg-red-200 transition-colors flex items-center justify-center"
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upload Modal */}
        <AnimatePresence>
          {showUploadModal && (
            <BannerUpload
              onClose={() => setShowUploadModal(false)}
              onSuccess={() => {
                setShowUploadModal(false)
                fetchBanners()
              }}
            />
          )}
        </AnimatePresence>

        {/* Preview Modal */}
        <AnimatePresence>
          {showPreviewModal && selectedBanner && (
            <BannerPreview
              banner={selectedBanner}
              onClose={() => {
                setShowPreviewModal(false)
                setSelectedBanner(null)
              }}
            />
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && bannerToDelete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => {
                setShowDeleteModal(false)
                setBannerToDelete(null)
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg p-6 w-full max-w-md"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Delete Banner
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete "{bannerToDelete.title}"? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false)
                      setBannerToDelete(null)
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteBanner(bannerToDelete._id)}
                    disabled={isDeleting}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isDeleting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </AdminLayout>
    </ProtectedRoute>
  )
}
