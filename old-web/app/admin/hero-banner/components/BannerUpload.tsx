"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { X, Upload, Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import axios from "axios"
import Image from "next/image"

interface BannerUploadProps {
  onClose: () => void
  onSuccess: () => void
}

export default function BannerUpload({ onClose, onSuccess }: BannerUploadProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    imageAlt: "",
    metadata: {
      campaign: "",
    },
  })
  
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [dragActive, setDragActive] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      // Handle nested fields like metadata.campaign
      const [parent, child] = field.split('.')
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as any,
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const handleImageUpload = (file: File) => {
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

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.onerror = () => {
      setErrors((prev) => ({ ...prev, image: "Failed to read image file" }))
    }
    reader.readAsDataURL(file)

    // Auto-fill title if empty
    if (!formData.title) {
      const fileName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")
      setFormData(prev => ({ ...prev, title: fileName }))
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0])
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors.image
      return newErrors
    })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Banner title is required"
    } else if (formData.title.trim().length > 255) {
      newErrors.title = "Title must be 255 characters or less"
    }

    if (!imageFile) {
      newErrors.image = "Hero banner image is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    const loadingToast = toast.loading(`Uploading ${formData.title}...`)

    try {
      // Create FormData for multipart/form-data
      const submitData = new FormData()

      // Add required fields
      submitData.append('title', formData.title.trim())
      submitData.append('images', imageFile!)

      // Add optional fields
      if (formData.imageAlt.trim()) {
        submitData.append('imageAlt', formData.imageAlt.trim())
      }

      // Add metadata if provided
      const metadata = {
        campaign: formData.metadata.campaign.trim(),
      }
      if (metadata.campaign) {
        submitData.append('metadata', JSON.stringify(metadata))
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      
      const response = await axios.post(`${API_BASE_URL}/admin/hero-banners`, submitData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true
      })

      toast.dismiss(loadingToast)
      toast.success(`${formData.title} uploaded successfully`)
      onSuccess()
      
    } catch (error: any) {
      console.error("Error uploading hero banner:", error)
      toast.dismiss(loadingToast)
      
      if (error.response?.data?.message) {
        const backendError = error.response.data
        toast.error(backendError.message)
        
        if (backendError.field) {
          setErrors({ [backendError.field]: backendError.message })
        }
      } else {
        toast.error("Failed to upload banner. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Upload Hero Banner</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banner Image *
            </label>
            
            {!imagePreview ? (
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? "border-blue-500 bg-blue-50" 
                    : errors.image 
                    ? "border-red-300 bg-red-50" 
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  Drag and drop your banner image here, or{" "}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    browse files
                  </button>
                </p>
                <p className="text-sm text-gray-500">
                  JPEG, PNG, WebP, GIF up to 5MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden">
                <div className="aspect-video relative">
                  <Image
                    src={imagePreview}
                    alt="Banner preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            
            {errors.image && (
              <p className="text-red-600 text-sm mt-1">{errors.image}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banner Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                errors.title ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter banner title"
              maxLength={255}
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">{errors.title}</p>
            )}
            <p className="text-gray-500 text-sm mt-1">
              {formData.title.length}/255 characters
            </p>
          </div>

          {/* Image Alt Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alt Text (for accessibility)
            </label>
            <textarea
              value={formData.imageAlt}
              onChange={(e) => handleInputChange("imageAlt", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
              placeholder="Describe the banner image for screen readers"
              rows={3}
            />
            <p className="text-gray-500 text-sm mt-1">
              Optional but recommended for accessibility
            </p>
          </div>

          {/* Campaign (Metadata) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Name
            </label>
            <input
              type="text"
              value={formData.metadata.campaign}
              onChange={(e) => handleInputChange("metadata.campaign", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="e.g., summer2025, holiday-sale"
            />
            <p className="text-gray-500 text-sm mt-1">
              Optional: Associate this banner with a campaign
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Upload Banner
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
