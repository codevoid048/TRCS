"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Settings, 
  Trash2, 
  AlertTriangle, 
  Package, 
  Palette, 
  Hammer, 
  Disc, 
  Ruler, 
  Circle,
  Tag
} from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"
import ProtectedRoute from "../components/ProtectedRoute"
import AdminLayout from "../components/AdminLayout"
import LoadingSpinner from "../components/LoadingSpinner"

// Types for configuration data
interface Color {
  name: string
  hex: string
}

interface ProductConfig {
  brands: string[]
  colors: Color[]
  frameMaterials: string[]
  brakeTypes: string[]
  frameSizes: string[]
  wheelSizes: string[]
  categories: string[]
}

interface ApiResponse {
  message: string
  config: ProductConfig
}

interface DeleteResponse {
  message: string
  data: {
    type: string
    deletedItem: string | Color
    [key: string]: any
  }
}

// Configuration types with their metadata
const configTypes = [
  {
    key: 'brands' as keyof ProductConfig,
    label: 'Brands',
    icon: Package,
    color: 'bg-blue-100 text-blue-600',
    description: 'Manage bicycle brands'
  },
  {
    key: 'colors' as keyof ProductConfig,
    label: 'Colors',
    icon: Palette,
    color: 'bg-purple-100 text-purple-600',
    description: 'Manage available colors'
  },
  {
    key: 'frameMaterials' as keyof ProductConfig,
    label: 'Frame Materials',
    icon: Hammer,
    color: 'bg-green-100 text-green-600',
    description: 'Manage frame materials'
  },
  {
    key: 'brakeTypes' as keyof ProductConfig,
    label: 'Brake Types',
    icon: Disc,
    color: 'bg-red-100 text-red-600',
    description: 'Manage brake types'
  },
  {
    key: 'frameSizes' as keyof ProductConfig,
    label: 'Frame Sizes',
    icon: Ruler,
    color: 'bg-yellow-100 text-yellow-600',
    description: 'Manage frame sizes'
  },
  {
    key: 'wheelSizes' as keyof ProductConfig,
    label: 'Wheel Sizes',
    icon: Circle,
    color: 'bg-indigo-100 text-indigo-600',
    description: 'Manage wheel sizes'
  },
  {
    key: 'categories' as keyof ProductConfig,
    label: 'Categories',
    icon: Tag,
    color: 'bg-pink-100 text-pink-600',
    description: 'Manage product categories'
  }
]

export default function ProductConfigPage() {
  const [config, setConfig] = useState<ProductConfig | null>(null)
  const [selectedType, setSelectedType] = useState<keyof ProductConfig>('brands')
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{
    type: keyof ProductConfig
    value: string
    displayValue: string
  } | null>(null)

  // Fetch configuration data
  const fetchConfig = async () => {
    try {
      setError(null)
      setIsLoading(true)

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
      const token = localStorage.getItem("token")

      const response = await axios.get<ApiResponse>(`${API_BASE_URL}/admin/product-config`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        withCredentials: true
      })

      if (response.data && response.data.config) {
        setConfig(response.data.config)
      }
    } catch (error: any) {
      console.error("Error fetching config:", error)
      const errorMessage = error.response?.data?.message || "Failed to fetch product configuration"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Delete configuration item
  const deleteConfigItem = async () => {
    if (!itemToDelete) return

    const loadingToast = toast.loading(`Deleting ${itemToDelete.displayValue}...`)

    try {
      setDeleteError(null)
      setIsDeleting(itemToDelete.value)

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
      const token = localStorage.getItem("token")

      const response = await axios.delete<DeleteResponse>(`${API_BASE_URL}/admin/product-config`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        withCredentials: true,
        data: {
          type: itemToDelete.type,
          value: itemToDelete.value
        }
      })

      if (response.data && response.data.data) {
        // Update the config state with the new data
        setConfig(prevConfig => {
          if (!prevConfig) return null
          return {
            ...prevConfig,
            [itemToDelete.type]: response.data.data[itemToDelete.type]
          }
        })
        
        toast.dismiss(loadingToast)
        toast.success(`${itemToDelete.displayValue} deleted successfully`)
        
        setShowDeleteModal(false)
        setItemToDelete(null)
      }
    } catch (error: any) {
      console.error("Error deleting config item:", error)
      const errorMessage = error.response?.data?.message || "Failed to delete configuration item"
      setDeleteError(errorMessage)
      toast.dismiss(loadingToast)
      toast.error(errorMessage)
    } finally {
      setIsDeleting(null)
    }
  }

  useEffect(() => {
    fetchConfig()
  }, [])

  // Handle delete confirmation
  const handleDeleteClick = (type: keyof ProductConfig, value: string) => {
    const displayValue = typeof value === 'string' ? value : (value as any).name || value
    setItemToDelete({ type, value, displayValue })
    setShowDeleteModal(true)
    setDeleteError(null)
  }

  // Render configuration items based on type
  const renderConfigItems = () => {
    if (!config || !config[selectedType]) return null

    const items = config[selectedType]
    const selectedConfig = configTypes.find(ct => ct.key === selectedType)

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.isArray(items) && items.map((item, index) => {
          const isColor = selectedType === 'colors' && typeof item === 'object'
          const displayValue = isColor ? (item as Color).name : (item as string)
          const itemValue = isColor ? (item as Color).name : (item as string)

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {isColor && (
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0"
                      style={{ backgroundColor: (item as Color).hex }}
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 truncate">{displayValue}</p>
                    {isColor && (
                      <p className="text-xs text-gray-500 truncate">{(item as Color).hex}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteClick(selectedType, itemValue)}
                  disabled={isDeleting === itemValue}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 opacity-0 group-hover:opacity-100 flex-shrink-0 ml-2"
                  title={`Delete ${displayValue}`}
                >
                  {isDeleting === itemValue ? (
                    <div className="w-3.5 h-3.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>
    )
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-96">
            <LoadingSpinner text="Loading product configuration..." />
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
              <h1 className="text-3xl font-bold text-gray-900">Product Configuration</h1>
              <p className="text-gray-600 mt-1">Manage dropdown options for product creation</p>
            </div>
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-900">Configuration Manager</span>
            </div>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          {/* Main Content */}
          <div className="flex gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-6 h-fit"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuration Types</h2>
              <div className="space-y-2">
                {configTypes.map((configType) => {
                  const Icon = configType.icon
                  const isSelected = selectedType === configType.key
                  const itemCount = config?.[configType.key]?.length || 0

                  return (
                    <motion.button
                      key={configType.key}
                      onClick={() => setSelectedType(configType.key)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                        isSelected
                          ? 'border-primary-main bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${configType.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className={`font-medium ${isSelected ? 'text-primary-main' : 'text-gray-900'}`}>
                              {configType.label}
                            </p>
                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              {itemCount}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{configType.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>

            {/* Content Area */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 bg-white rounded-xl shadow-lg border border-gray-200"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  {(() => {
                    const selectedConfig = configTypes.find(ct => ct.key === selectedType)
                    const Icon = selectedConfig?.icon || Settings
                    return (
                      <>
                        <div className={`p-2 rounded-lg ${selectedConfig?.color || 'bg-gray-100 text-gray-600'}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">
                            {selectedConfig?.label || 'Configuration'}
                          </h2>
                          <p className="text-gray-600 text-sm">
                            {config?.[selectedType]?.length || 0} items configured
                          </p>
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>

              <div className="p-6">
                {config && config[selectedType] && config[selectedType].length > 0 ? (
                  renderConfigItems()
                ) : (
                  <div className="text-center py-12">
                    <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No items configured for this type</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-blue-50 rounded-xl p-6 border border-blue-200"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                  <AlertTriangle className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-900">Configuration Management</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>These configurations control the dropdown options in product creation</li>
                    <li>Deleting items will remove them from future product forms</li>
                    <li>Categories cannot be completely deleted - at least one must remain</li>
                    <li>Changes take effect immediately for new products</li>
                    <li>Existing products with deleted values will retain their current data</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && itemToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full"
            >
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-100">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Confirm Deletion</h3>
                    <p className="text-sm text-gray-600">This action cannot be undone</p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-gray-700">
                    Are you sure you want to delete <span className="font-semibold">"{itemToDelete.displayValue}"</span> from{" "}
                    <span className="font-semibold">{configTypes.find(ct => ct.key === itemToDelete.type)?.label}</span>?
                  </p>
                </div>

                {deleteError && (
                  <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                    {deleteError}
                  </div>
                )}

                <div className="flex space-x-3 justify-end">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false)
                      setItemToDelete(null)
                      setDeleteError(null)
                    }}
                    disabled={isDeleting !== null}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={deleteConfigItem}
                    disabled={isDeleting !== null}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    {isDeleting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AdminLayout>
    </ProtectedRoute>
  )
}
