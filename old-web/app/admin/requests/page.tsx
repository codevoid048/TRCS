"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Eye, Calendar, Phone, User, Package, CheckCircle, XCircle, Trash2, Mail } from "lucide-react"
import ProtectedRoute from "@/app/admin/components/ProtectedRoute"
import AdminLayout from "@/app/admin/components/AdminLayout"
import LoadingSpinner from "@/app/admin/components/LoadingSpinner"
import toast from "react-hot-toast"
import { Badge } from "@/components/ui/badge"
import { adminAPI } from "@/lib/api/adminAPI"

interface PurchaseRequest {
  _id: string
  name: string
  email: string
  mobileNumber: string
  description?: string
  cycle?: {
    _id: string
    name: string
    brand: string
    price: number
    image: string
  }
  status: "ongoing" | "user bought" | "not bought"
  createdAt: string
  updatedAt: string
}

interface PaginationData {
  currentPage: number
  totalPages: number
  totalRequests: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

interface StatusCounts {
  ongoing: number
  "user bought": number
  "not bought": number
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<PurchaseRequest[]>([])
  const [pagination, setPagination] = useState<PaginationData | null>(null)
  const [statusCounts, setStatusCounts] = useState<StatusCounts | null>(null)
  const [activeTab, setActiveTab] = useState<"ongoing" | "completed">("ongoing")
  const [isLoading, setIsLoading] = useState(true)
  const [totalRequests, setTotalRequests] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [selectedRequest, setSelectedRequest] = useState<PurchaseRequest | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [requestToDelete, setRequestToDelete] = useState<PurchaseRequest | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch requests from API
  const fetchRequests = async (status?: string, page: number = 1) => {
    try {
      setIsLoading(true)
      
      if (status === 'completed') {
        // For completed tab, get both 'user bought' and 'not bought' requests
        const [userBoughtData, notBoughtData] = await Promise.all([
          adminAPI.getRequests('user bought', page),
          adminAPI.getRequests('not bought', page)
        ])
        
        // Combine the requests and sort by updatedAt (most recent first)
        const combinedRequests = [...userBoughtData.requests, ...notBoughtData.requests]
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        
        // Calculate combined pagination
        const totalItems = userBoughtData.pagination.totalItems + notBoughtData.pagination.totalItems
        
        setRequests(combinedRequests)
        setTotalRequests(totalItems)
        setTotalPages(Math.ceil(totalItems / 10))
        
        // Set combined status counts
        if (userBoughtData.statusCounts && notBoughtData.statusCounts) {
          setStatusCounts({
            ongoing: userBoughtData.statusCounts.ongoing || notBoughtData.statusCounts.ongoing || 0,
            "user bought": userBoughtData.statusCounts["user bought"] || 0,
            "not bought": notBoughtData.statusCounts["not bought"] || 0
          })
        }
      } else {
        // For ongoing tab or specific status
        const data = await adminAPI.getRequests(status, page)
        
        setRequests(data.requests)
        setTotalRequests(data.pagination.totalItems)
        setTotalPages(Math.ceil(data.pagination.totalItems / 10))
        
        if (data.statusCounts) {
          setStatusCounts(data.statusCounts)
        }
      }
      
      // Log cache statistics in development
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('Admin Requests Cache Stats:', adminAPI.getCacheStats())
      // }
      
    } catch (error) {
      console.error('Error fetching requests:', error)
      toast.error("Failed to fetch requests")
    } finally {
      setIsLoading(false)
    }
  }

  // Update request status
  const updateRequestStatus = async (requestId: string, status: "user bought" | "not bought") => {
    try {
      const updatedRequest = await adminAPI.updateRequestStatus(requestId, status)
      
      // Update local state
      setRequests(prevRequests => 
        prevRequests.map(req => 
          req._id === requestId ? updatedRequest : req
        )
      )
      
      // Show success toast
      toast.success(`Request status changed to "${status}"`)
      
      // Refresh requests to get updated counts
      fetchRequests(activeTab === 'ongoing' ? 'ongoing' : 'completed', currentPage)
      setShowViewModal(false)
    } catch (error) {
      console.error('Error updating request status:', error)
      toast.error("Failed to update request status")
    }
  }

  // Handle status change (wrapper function)
  const handleStatusChange = async (requestId: string, status: "user bought" | "not bought") => {
    await updateRequestStatus(requestId, status)
  }

  // Handle delete request (show confirmation modal)
  const handleDelete = (request: PurchaseRequest) => {
    setRequestToDelete(request)
    setShowDeleteModal(true)
  }

  // Delete request
  const deleteRequest = async () => {
    if (!requestToDelete) return

    try {
      await adminAPI.deleteRequest(requestToDelete._id)

      // Remove from local state
      setRequests(prevRequests => 
        prevRequests.filter(req => req._id !== requestToDelete._id)
      )
      
      // Show success toast
      toast.success("The request has been successfully deleted")
      
      // Close modal and reset state
      setShowDeleteModal(false)
      setRequestToDelete(null)
      
      // Refresh to get updated counts
      fetchRequests(activeTab === 'ongoing' ? 'ongoing' : 'completed', currentPage)
    } catch (error) {
      console.error('Error deleting request:', error)
      toast.error("Failed to delete request")
    }
  }

  useEffect(() => {
    fetchRequests(activeTab === 'ongoing' ? 'ongoing' : 'completed', 1)
    setCurrentPage(1)
  }, [activeTab])

  // No need for client-side filtering since API returns the right requests
  const displayedRequests = requests

  const handleView = (request: PurchaseRequest) => {
    setSelectedRequest(request)
    setShowViewModal(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-96">
            <LoadingSpinner text="Loading requests..." />
          </div>
        </AdminLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Requests</h1>
              <p className="text-gray-600 mt-1">Manage customer cycle requests</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-lg p-1 shadow-lg">
                <div className="flex space-x-1">
                  <button
                    onClick={() => setActiveTab("ongoing")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeTab === "ongoing"
                        ? "bg-primary-main text-white shadow-md"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Ongoing ({statusCounts?.ongoing || 0})
                  </button>
                  <button
                    onClick={() => setActiveTab("completed")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeTab === "completed"
                        ? "bg-primary-main text-white shadow-md"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Completed ({(statusCounts?.["user bought"] || 0) + (statusCounts?.["not bought"] || 0)})
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Requests Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Requester</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Cycle</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      {activeTab === "ongoing" ? "Date Submitted" : "Date Updated"}
                    </th>
                    {activeTab === "completed" && (
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    )}
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {displayedRequests.map((request: PurchaseRequest, index: number) => (
                    <motion.tr
                      key={request._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-primary-main flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <span className="font-medium text-gray-900">{request.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900">{request.mobileNumber}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600 text-sm">{request.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {request.cycle ? (
                          <div className="flex items-center space-x-3">
                            <img
                              src={request.cycle?.image || "/placeholder.svg"}
                              alt={request.cycle?.name}
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                          <div>
                            <p className="font-medium text-gray-900">{request.cycle?.name}</p>
                            <p className="text-sm text-gray-500">₹{request.cycle?.price.toLocaleString()}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <img
                            src="/placeholder.svg"
                            alt="Placeholder"
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">Cycle is Deleted</p>
                          </div>
                        </div>
                      )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">
                            {formatDate(activeTab === "ongoing" ? request.createdAt : request.updatedAt)}
                          </span>
                        </div>
                      </td>
                      {activeTab === "completed" && (
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {request.status === "user bought" ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-green-600 font-medium">Bought</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 text-red-600" />
                                <span className="text-red-600 font-medium">Didn't Buy</span>
                              </>
                            )}
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleView(request)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(request)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {displayedRequests.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No {activeTab} requests found</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* View Modal */}
        {showViewModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Request Details</h2>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Requester Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Requester Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-500 text-sm">Name:</span>
                      <p className="font-medium">{selectedRequest.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Email:</span>
                      <p className="font-medium">{selectedRequest.email}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Mobile:</span>
                      <p className="font-medium">{selectedRequest.mobileNumber}</p>
                    </div>
                    {selectedRequest.description && (
                      <div className="md:col-span-2">
                        <span className="text-gray-500 text-sm">Description:</span>
                        <p className="font-medium">{selectedRequest.description}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cycle Preview */}
                { selectedRequest.cycle ? (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Cycle Details</h3>
                  <div className="flex items-center space-x-4">
                    <img
                      src={selectedRequest.cycle.image || "/placeholder.svg"}
                      alt={selectedRequest.cycle.name}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{selectedRequest.cycle.name}</h4>
                      <p className="text-gray-600">{selectedRequest.cycle.brand}</p>
                      <p className="text-lg font-bold text-primary-main">
                        ₹{selectedRequest.cycle.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Cycle Details</h3>
                    <div className="flex items-center space-x-4">
                      <img
                        src="/placeholder.svg"
                        alt="Placeholder"
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">Cycle is Deleted</h4>
                      </div>
                    </div>
                  </div>
                )}

                {/* Request Timeline */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        Request submitted on {new Date(selectedRequest.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        selectedRequest.status === "user bought" 
                          ? "bg-green-500" 
                          : selectedRequest.status === "not bought" 
                          ? "bg-red-500" 
                          : "bg-yellow-500"
                      }`}></div>
                      <span className="text-sm text-gray-600">
                        Status: {selectedRequest.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedRequest.description && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Additional Description</h3>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedRequest.description}</p>
                  </div>
                )}

                {/* Action Buttons */}
                {selectedRequest.status === "ongoing" && (
                  <div className="flex space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleStatusChange(selectedRequest._id, "user bought")}
                      className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="h-5 w-5" />
                      <span>User Bought</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleStatusChange(selectedRequest._id, "not bought")}
                      className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <XCircle className="h-5 w-5" />
                      <span>User Didn't Buy</span>
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && requestToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full"
            >
              <div className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                  Delete Request
                </h3>
                
                <p className="text-gray-600 text-center mb-6">
                  Are you sure you want to delete the request from <strong>{requestToDelete.name}</strong>? 
                  This action cannot be undone.
                </p>
                
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowDeleteModal(false)
                      setRequestToDelete(null)
                    }}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={deleteRequest}
                    className="flex-1 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AdminLayout>
    </ProtectedRoute>
  )
}
