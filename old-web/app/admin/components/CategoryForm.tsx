"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { X, Upload, Loader2, Save, ArrowLeft } from "lucide-react"
import toast from "react-hot-toast"
import axios from "axios"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface Category {
  _id: string
  name: string
  description: string
  image: string
}

interface CategoryFormProps {
  category?: Category | null
  isEdit?: boolean
}

export default function CategoryForm({ category, isEdit = false }: CategoryFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: category?.name || "",
    description: category?.description || "",
  })
  
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(category?.image || "")
  const [existingImage, setExistingImage] = useState<string>(category?.image || "")
  const [isImageRemoved, setIsImageRemoved] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [fileInputKey, setFileInputKey] = useState(0) // For forcing file input re-render
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, image: "Please select a valid image file" }))
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: "Image size should be less than 5MB" }))
        return
      }

      // Clear any previous error
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.image
        return newErrors
      })

      setImageFile(file)
      
      // If we're in edit mode and there was an existing image, mark for removal
      if (isEdit && existingImage) {
        setIsImageRemoved(true)
      }

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.onerror = () => {
        setErrors((prev) => ({ ...prev, image: "Failed to read image file" }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview("")
    setIsImageRemoved(true)

    // Force re-render of the file input by updating its key
    setFileInputKey(Date.now())

    // Clear any related errors
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors.image
      return newErrors
    })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Category name must be at least 2 characters"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters"
    }

    // For new categories, image is required
    // For edit, image is required if existing image is removed and no new image is added
    if (isEdit) {
      if (isImageRemoved && !imageFile) {
        newErrors.image = "Image is required"
      }
    } else {
      if (!imageFile) {
        newErrors.image = "Image is required"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    const loadingToast = toast.loading(
      isEdit ? `Updating ${formData.name}...` : `Creating ${formData.name}...`
    )

    try {
      // Create FormData for multipart/form-data
      const submitData = new FormData()

      // Add required fields
      submitData.append('name', formData.name.trim())
      submitData.append('description', formData.description.trim())

      // Handle image removal flag
      if (isImageRemoved) {
        submitData.append('removeExistingImage', 'true')
      }

      // Handle new image
      if (imageFile) {
        submitData.append('images', imageFile)
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      
      if (isEdit && category) {
        // PUT request for editing
        const response = await axios.put(`${API_BASE_URL}/admin/categories/${category._id}`, submitData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true
        })

        toast.dismiss(loadingToast)
        toast.success(`${formData.name} updated successfully`)
        console.log("Category updated successfully:", response.data)
      } else {
        // POST request for creating
        const response = await axios.post(`${API_BASE_URL}/admin/categories`, submitData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true
        })

        toast.dismiss(loadingToast)
        toast.success(`${formData.name} created successfully`)
        console.log("Category created successfully:", response.data)
      }
      
      // Navigate back to categories list
      router.push("/admin/categories")
      
    } catch (error: any) {
      console.error("Error saving category:", error)
      
      toast.dismiss(loadingToast)
      
      // Handle specific API errors
      if (error.response?.data?.message) {
        const backendError = error.response.data
        const errorMessage = backendError.message || "Failed to save category"
        toast.error(errorMessage)
        
        if (backendError.field) {
          setErrors({ [backendError.field]: backendError.message })
        } else {
          setErrors({ general: backendError.message })
        }
      } else {
        const errorMessage = "Failed to save category. Please try again."
        toast.error(errorMessage)
        setErrors({ general: errorMessage })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const hasPreview = !!imagePreview
  const isExistingImage = isEdit && !!existingImage
  const hasNewImage = !!imageFile
  const isImageMarkedForRemoval = isImageRemoved

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.back()}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isEdit ? "Edit Category" : "Add New Category"}
                </h1>
                <p className="text-gray-600 mt-1">
                  {isEdit ? "Update category information" : "Fill in the details to add a new category"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Category Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent transition-all ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter category name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent transition-all resize-none ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter category description"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Category Image *
            </label>

            {/* Upload Area */}
            <div className="space-y-4">
              {/* Image Preview and Upload */}
              <div className="relative">
                <input
                  key={fileInputKey}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className={`block w-full h-64 rounded-lg overflow-hidden cursor-pointer hover:border-primary-main hover:bg-primary-50 transition-colors ${
                    isImageMarkedForRemoval ? "border-2 border-red-300 bg-red-50" : hasPreview ? "border-2 border-solid border-gray-200" : "border-2 border-dashed border-gray-300"
                  }`}
                >
                  {hasPreview ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={imagePreview}
                        alt="Category preview"
                        fill
                        className="object-cover"
                      />
                      
                      {/* Image status indicators */}
                      <div className="absolute top-2 left-2 flex space-x-1">
                        {isExistingImage && !hasNewImage && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            Current Image
                          </span>
                        )}
                        {hasNewImage && (
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                            New Image
                          </span>
                        )}
                        {isImageMarkedForRemoval && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                            Will Remove
                          </span>
                        )}
                      </div>

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          removeImage()
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <Upload className="h-12 w-12 mb-4" />
                      <span className="text-lg font-medium">Upload Category Image</span>
                      <span className="text-sm mt-2">Click to browse files</span>
                    </div>
                  )}
                </label>
              </div>

              {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}

              {/* Image Guidelines */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Image Guidelines:</strong> Upload a high-quality image (max 5MB). Supported formats: JPG, PNG, WebP. 
                  Recommended dimensions: 400x300 pixels or higher.
                </p>
                {isEdit && (
                  <div className="mt-2 text-sm text-blue-700">
                    <p><strong>Edit Mode:</strong></p>
                    <ul className="list-disc list-inside space-y-1 mt-1">
                      <li><span className="bg-blue-500 text-white px-1 py-0.5 rounded text-xs">Current Image</span> - Image currently saved</li>
                      <li><span className="bg-green-500 text-white px-1 py-0.5 rounded text-xs">New Image</span> - New image you're uploading</li>
                      <li><span className="bg-red-500 text-white px-1 py-0.5 rounded text-xs">Will Remove</span> - Image that will be deleted</li>
                      <li>Upload a new image to replace the current one, or click X to remove</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview Section */}
          {(formData.name || formData.description) && hasPreview && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Category Preview</h3>
              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {formData.name || "Category Name"}
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                      {formData.description || "Category description will appear here"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Image Management Summary for Edit Mode */}
          {isEdit && (isImageRemoved || imageFile) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
            >
              <h4 className="font-semibold text-yellow-800 mb-2">Image Changes Summary:</h4>
              <div className="text-sm text-yellow-700 space-y-1">
                {!isImageRemoved && !imageFile && (
                  <p>• Keeping current image</p>
                )}
                {isImageRemoved && !imageFile && (
                  <p>• Removing current image (⚠️ Category will have no image)</p>
                )}
                {imageFile && (
                  <p>• {isImageRemoved ? "Replacing" : "Adding"} image with new upload</p>
                )}
              </div>
            </motion.div>
          )}

          {/* General Error */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="bg-primary-main hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{isEdit ? "Update Category" : "Create Category"}</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}