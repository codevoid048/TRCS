"use client"

import type React from "react"
import axios from "axios"
import toast from "react-hot-toast"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Save, ArrowLeft, Upload, X, Search, Plus, Check, Palette } from "lucide-react"

// Updated AdminProduct interface to match API response
interface AdminProduct {
  _id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  brand: string
  category: string
  color: Array<{
    name: string
    hex: string
  }>
  images: string[]
  primaryImage: string
  frameMaterial: string
  weight: number
  gearType: string
  numberOfGears?: number
  brakeType: string
  frameSize: string
  wheelSize: string
  stock: number
  slug: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface ProductFormProps {
  product?: AdminProduct
  isEdit?: boolean
}

// Types for API response
interface ColorOption {
  name: string
  hex: string
  _id?: string
}

interface ProductConfig {
  brands: string[]
  colors: ColorOption[]
  frameMaterials: string[]
  brakeTypes: string[]
  frameSizes: string[]
  wheelSizes: string[]
  categories: string[]
}

// API service to fetch product configuration
const fetchProductConfig = async (): Promise<ProductConfig> => {
  try {
    // Get JWT token from localStorage or your auth system
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
    
    const response = await axios.get(`${API_BASE_URL}/admin/product-config`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      withCredentials: true
    })

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const config = response.data.config
    return config
  } catch (error) {
    console.error('Error fetching product config:', error)
    throw new Error('Failed to load product configuration')
  }
}

// Searchable Dropdown Component
interface SearchableDropdownProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  placeholder: string
  error?: string
  onAddNew?: (newValue: string) => void
}

function SearchableDropdown({ options, value, onChange, placeholder, error, onAddNew }: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [localOptions, setLocalOptions] = useState(options)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filteredOptions = localOptions.filter((option) => option.toLowerCase().includes(searchTerm.toLowerCase()))

  const showCreateOption =
    searchTerm && !filteredOptions.some((option) => option.toLowerCase() === searchTerm.toLowerCase())

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue)
    setIsOpen(false)
    setSearchTerm("")
  }

  const handleCreateNew = () => {
    if (searchTerm && onAddNew) {
      const newValue = searchTerm.trim()
      setLocalOptions([...localOptions, newValue])
      onChange(newValue)
      setIsOpen(false)
      setSearchTerm("")
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent transition-all ${error ? "border-red-500" : "border-gray-300"
          }`}
      >
        <div className="flex items-center justify-between">
          <span className={value ? "text-gray-900" : "text-gray-500"}>{value || placeholder}</span>
          <Search className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search or type new..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent"
              autoFocus
            />
          </div>

          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.map((option) => (
              <div
                key={option}
                onClick={() => handleSelect(option)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-900"
              >
                {option}
              </div>
            ))}

            {showCreateOption && onAddNew && (
              <div
                onClick={handleCreateNew}
                className="px-4 py-2 hover:bg-primary-50 cursor-pointer text-primary-main border-t border-gray-200 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create "{searchTerm}"</span>
              </div>
            )}

            {filteredOptions.length === 0 && !showCreateOption && (
              <div className="px-4 py-2 text-gray-500">No options found</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Color Picker Modal Component
interface ColorPickerModalProps {
  colorName: string
  onSubmit: (hex: string) => void
  onCancel: () => void
}

function ColorPickerModal({ colorName, onSubmit, onCancel }: ColorPickerModalProps) {
  const [selectedColor, setSelectedColor] = useState("#000000")

  const handleSubmit = () => {
    onSubmit(selectedColor)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Choose color for "{colorName}"
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-12 h-12 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent"
                placeholder="#000000"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div
              className="w-8 h-8 rounded border border-gray-300"
              style={{ backgroundColor: selectedColor }}
            />
            <span className="text-sm text-gray-600">
              Preview: {selectedColor}
            </span>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary-main text-white rounded hover:bg-primary-dark transition-colors flex items-center space-x-2"
          >
            <Palette className="h-4 w-4" />
            <span>Create Color</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// Multi-Select Color Dropdown Component
interface MultiSelectColorDropdownProps {
  options: { name: string; hex: string }[]
  values: string[]
  onChange: (values: string[]) => void
  placeholder: string
  error?: string
  onAddNew?: (newValue: string, hex: string) => void
}

function MultiSelectColorDropdown({
  options,
  values,
  onChange,
  placeholder,
  error,
  onAddNew,
}: MultiSelectColorDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [localOptions, setLocalOptions] = useState(options)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [pendingColorName, setPendingColorName] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filteredOptions = localOptions.filter((option) => option.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const showCreateOption =
    searchTerm && !filteredOptions.some((option) => option.name.toLowerCase() === searchTerm.toLowerCase())

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm("")
        setShowColorPicker(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleToggle = (option: string) => {
    if (values.includes(option)) {
      onChange(values.filter((v) => v !== option))
    } else {
      onChange([...values, option])
    }
  }

  const handleCreateNew = () => {
    if (searchTerm) {
      setPendingColorName(searchTerm.trim())
      setShowColorPicker(true)
    }
  }

  const handleColorPickerSubmit = (hex: string) => {
    if (pendingColorName && onAddNew) {
      const newColor = { name: pendingColorName, hex }
      setLocalOptions([...localOptions, newColor])
      onChange([...values, pendingColorName])
      setShowColorPicker(false)
      setPendingColorName("")
      setSearchTerm("")
    }
  }

  const handleColorPickerCancel = () => {
    setShowColorPicker(false)
    setPendingColorName("")
    setSearchTerm("")
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent transition-all min-h-[48px] ${error ? "border-red-500" : "border-gray-300"
          }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {values.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {values.map((value) => {
                  const colorOption = localOptions.find(option => option.name === value)
                  return (
                    <span
                      key={value}
                      className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 text-sm rounded"
                    >
                      {colorOption && (
                        <div
                          className="w-3 h-3 rounded mr-1 border border-gray-300"
                          style={{ backgroundColor: colorOption.hex }}
                        />
                      )}
                      {value}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToggle(value)
                        }}
                        className="ml-1 hover:text-primary-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )
                })}
              </div>
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </div>
          <Search className="h-4 w-4 text-gray-400 ml-2" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search or type new color..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent"
              autoFocus
            />
          </div>

          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.map((option) => (
              <div
                key={option.name}
                onClick={() => handleToggle(option.name)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-900 flex items-center space-x-2"
              >
                <div className="flex items-center space-x-2 flex-1">
                  <div
                    className={`w-4 h-4 border-2 rounded ${values.includes(option.name) ? "bg-primary-main border-primary-main" : "border-gray-300"
                      } flex items-center justify-center`}
                  >
                    {values.includes(option.name) && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <div
                    className="w-4 h-4 rounded border border-gray-300"
                    style={{ backgroundColor: option.hex }}
                  />
                  <span>{option.name}</span>
                </div>
              </div>
            ))}

            {showCreateOption && onAddNew && (
              <div
                onClick={handleCreateNew}
                className="px-4 py-2 hover:bg-primary-50 cursor-pointer text-primary-main border-t border-gray-200 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create "{searchTerm}"</span>
              </div>
            )}

            {filteredOptions.length === 0 && !showCreateOption && (
              <div className="px-4 py-2 text-gray-500">No options found</div>
            )}
          </div>
        </div>
      )}

      {/* Color Picker Modal */}
      {showColorPicker && (
        <ColorPickerModal
          colorName={pendingColorName}
          onSubmit={handleColorPickerSubmit}
          onCancel={handleColorPickerCancel}
        />
      )}
    </div>
  )
}

export default function ProductForm({ product, isEdit = false }: ProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [configLoading, setConfigLoading] = useState(true)
  const [productConfig, setProductConfig] = useState<ProductConfig | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    brand: "",
    category: "",
    color: [] as string[],
    frame: "",
    weight: "",
    gearType: "Non-Geared",
    numberOfGears: "",
    brakeType: "",
    frameSize: "",
    wheelSize: "",
    stock: "",
  })

  const [imageFiles, setImageFiles] = useState<(File | null)[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([]) // Track existing images from server
  const [imagesToRemove, setImagesToRemove] = useState<number[]>([]) // Track indices to remove
  const [imagesToKeep, setImagesToKeep] = useState<number[]>([]) // Track indices to keep
  const [fileInputKeys, setFileInputKeys] = useState<number[]>([0, 1, 2, 3]) // Keys to force re-render of file inputs
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load product configuration on component mount
  useEffect(() => {
    const loadProductConfig = async () => {
      setConfigLoading(true)

      try {
        const config = await fetchProductConfig()
        setProductConfig(config)
      } catch (error: any) {
        console.error('Failed to load product config:', error)
        const errorMessage = 'Failed to load product configuration. Some options may not be available.'
        toast.error(errorMessage)
      } finally {
        setConfigLoading(false)
      }
    }

    loadProductConfig()
  }, [])

  useEffect(() => {
    if (product && isEdit) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price.toString() || "",
        originalPrice: product.originalPrice?.toString() || "",
        brand: product.brand || "",
        category: product.category || "",
        color: product.color ? product.color.map(c => c.name) : [],
        frame: product.frameMaterial || "",
        weight: product.weight?.toString() || "",
        gearType: product.gearType || "Non-Geared",
        numberOfGears: product.numberOfGears?.toString() || "",
        brakeType: product.brakeType || "",
        frameSize: product.frameSize || "",
        wheelSize: product.wheelSize || "",
        stock: product.stock.toString() || "",
      })

      // Set existing images for edit mode
      if (product.images && product.images.length > 0) {
        setExistingImages(product.images)
        setImagePreviews(product.images)
        // Initialize imagesToKeep with all existing image indices
        setImagesToKeep(product.images.map((_, index) => index))
        // Initialize imageFiles array with nulls for existing images
        setImageFiles(new Array(4).fill(null))
      }
    }
  }, [product, isEdit])

  const handleInputChange = (field: string, value: string | string[]) => {
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, slotIndex: number) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, [`image_${slotIndex}`]: "Please select a valid image file" }))
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, [`image_${slotIndex}`]: "Image size should be less than 5MB" }))
        return
      }

      // Clear any previous error
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[`image_${slotIndex}`]
        delete newErrors.images
        return newErrors
      })

      // Update files array - use slot-based approach
      const newFiles = [...imageFiles]
      const newPreviews = [...imagePreviews]
      
      // Ensure arrays are large enough
      while (newFiles.length <= slotIndex) {
        newFiles.push(null)
        newPreviews.push("")
      }
      
      newFiles[slotIndex] = file
      setImageFiles(newFiles)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        const updatedPreviews = [...newPreviews]
        updatedPreviews[slotIndex] = e.target?.result as string
        setImagePreviews(updatedPreviews)
      }
      reader.onerror = () => {
        setErrors((prev) => ({ ...prev, [`image_${slotIndex}`]: "Failed to read image file" }))
      }
      reader.readAsDataURL(file)

      // If this is edit mode and we're replacing an existing image
      if (isEdit && slotIndex < existingImages.length) {
        // Remove this index from imagesToKeep and add to imagesToRemove
        setImagesToKeep(prev => prev.filter(index => index !== slotIndex))
        setImagesToRemove(prev => [...new Set([...prev, slotIndex])])
      }
    }
  }

  const removeImage = (slotIndex: number) => {
    const newFiles = [...imageFiles]
    const newPreviews = [...imagePreviews]

    // Clear the specific slot
    if (newFiles[slotIndex]) {
      newFiles[slotIndex] = null
    }
    if (newPreviews[slotIndex]) {
      newPreviews[slotIndex] = ""
    }

    setImageFiles(newFiles)
    setImagePreviews(newPreviews)

    // Force re-render of the file input by updating its key
    setFileInputKeys(prev => {
      const newKeys = [...prev]
      newKeys[slotIndex] = Date.now() + slotIndex // Unique key
      return newKeys
    })

    // Handle existing image removal in edit mode
    if (isEdit && slotIndex < existingImages.length) {
      // If this was an existing image, mark it for removal
      setImagesToRemove(prev => [...new Set([...prev, slotIndex])])
      setImagesToKeep(prev => prev.filter(index => index !== slotIndex))
    }

    // Clear any related errors
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[`image_${slotIndex}`]
      return newErrors
    })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Cycle name is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.price || Number.parseFloat(formData.price) <= 0) newErrors.price = "Valid price is required"
    if (!formData.brand) newErrors.brand = "Brand is required"
    if (!formData.category) newErrors.category = "Category is required"
    if (formData.color.length === 0) newErrors.color = "At least one color is required"
    if (!formData.frame.trim()) newErrors.frame = "Frame material is required"
    if (!formData.weight || Number.parseFloat(formData.weight) <= 0) newErrors.weight = "Valid weight is required"
    if (!formData.brakeType.trim()) newErrors.brakeType = "Brake type is required"
    if (!formData.frameSize.trim()) newErrors.frameSize = "Frame size is required"
    if (!formData.wheelSize.trim()) newErrors.wheelSize = "Wheel size is required"
    if (!formData.stock || Number.parseInt(formData.stock) < 0) newErrors.stock = "Valid stock quantity is required"

    // Validate images - at least one is required
    const validNewImages = imageFiles.filter(file => file !== null && file !== undefined)
    const remainingExistingImages = isEdit ? imagesToKeep.length : 0
    const totalImages = validNewImages.length + remainingExistingImages
    
    if (totalImages === 0) {
      newErrors.images = "At least one image is required"
    }

    // Validate number of gears if geared
    if (formData.gearType === "Geared" && (!formData.numberOfGears || Number.parseInt(formData.numberOfGears) <= 0)) {
      newErrors.numberOfGears = "Number of gears is required for geared cycles"
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
      submitData.append('name', formData.name)
      submitData.append('description', formData.description)
      submitData.append('price', formData.price)
      submitData.append('brand', formData.brand)
      submitData.append('category', formData.category)
      submitData.append('frameMaterial', formData.frame)
      submitData.append('weight', formData.weight)
      submitData.append('gearType', formData.gearType)
      submitData.append('brakeType', formData.brakeType)
      submitData.append('frameSize', formData.frameSize)
      submitData.append('wheelSize', formData.wheelSize)

      // Add optional fields
      if (formData.originalPrice) {
        submitData.append('originalPrice', formData.originalPrice)
      }
      
      if (formData.gearType === "Geared" && formData.numberOfGears) {
        submitData.append('numberOfGears', formData.numberOfGears)
      }
      
      if (formData.stock) {
        submitData.append('stock', formData.stock)
      }

      submitData.append('isActive', 'true')

      // Handle colors - convert to the backend format
      const colorsForBackend = formData.color.map((colorName: string) => {
        const colorOption = productConfig?.colors.find(c => c.name === colorName)
        return {
          name: colorName,
          hex: colorOption?.hex || '#000000'
        }
      })
      submitData.append('color', JSON.stringify(colorsForBackend))

      // Handle images differently for create vs edit
      if (isEdit && product) {
        // For editing: Use selective image management
        
        // Add new image files
        const validImageFiles = imageFiles.filter(file => file !== null && file !== undefined)
        validImageFiles.forEach((file) => {
          submitData.append('images', file)
        })

        // Add image management instructions for existing images
        if (imagesToRemove.length > 0) {
          submitData.append('removeImages', JSON.stringify(imagesToRemove))
          // console.log('Images to remove:', imagesToRemove)
        }

        if (imagesToKeep.length > 0) {
          submitData.append('keepImages', JSON.stringify(imagesToKeep))
          // console.log('Images to keep:', imagesToKeep)
        }

        // console.log('New images being uploaded:', validImageFiles.length)

        // PUT request for editing
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        const response = await axios.put(`${API_BASE_URL}/admin/products/${product._id}`, submitData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true
        })

        toast.dismiss(loadingToast)
        toast.success(`${formData.name} updated successfully`)
        // console.log("Product updated successfully:", response.data)
      } else {
        // For creating: Add all new images
        const validImageFiles = imageFiles.filter(file => file !== null && file !== undefined)
        validImageFiles.forEach((file) => {
          submitData.append('images', file)
        })

        // POST request for creating
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        const response = await axios.post(`${API_BASE_URL}/admin/products`, submitData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true
        })

        toast.dismiss(loadingToast)
        toast.success(`${formData.name} created successfully`)
        // console.log("Product created successfully:", response.data)
      }
      
      // Navigate back to products list
      router.push("/admin/products")
      
    } catch (error: any) {
      console.error("Error saving product:", error)
      
      toast.dismiss(loadingToast)
      
      // Handle specific API errors
      if (error.response?.data?.message) {
        const backendError = error.response.data
        const errorMessage = backendError.message || "Failed to save product"
        toast.error(errorMessage)
        
        if (backendError.field) {
          setErrors({ [backendError.field]: backendError.message })
        } else {
          setErrors({ general: backendError.message })
        }
      } else {
        const errorMessage = "Failed to save product. Please try again."
        toast.error(errorMessage)
        setErrors({ general: errorMessage })
      }
    } finally {
      setIsLoading(false)
    }
  }

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
                <h1 className="text-2xl font-bold text-gray-900">{isEdit ? "Edit Product" : "Add New Product"}</h1>
                <p className="text-gray-600 mt-1">
                  {isEdit ? "Update product information" : "Fill in the details to add a new cycle"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {configLoading && (
          <div className="p-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-main"></div>
              <span className="text-gray-600">Loading product configuration...</span>
            </div>
          </div>
        )}

        {/* Form */}
        {!configLoading && (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cycle Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Cycle Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent transition-all ${errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Enter cycle name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Brand *</label>
              <SearchableDropdown
                options={productConfig?.brands || []}
                value={formData.brand}
                onChange={(value) => handleInputChange("brand", value)}
                placeholder="Select or create brand"
                error={errors.brand}
                onAddNew={(newValue) => {
                  if (productConfig) {
                    productConfig.brands.push(newValue)
                  }
                }}
              />
              {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent transition-all resize-none ${errors.description ? "border-red-500" : "border-gray-300"
                }`}
              placeholder="Enter product description (1-2 lines)"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Price and Category */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Price (₹) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent transition-all ${errors.price ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="0"
                min="0"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Original Price (₹)</label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => handleInputChange("originalPrice", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent transition-all"
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent transition-all ${errors.category ? "border-red-500" : "border-gray-300"
                  }`}
              >
                <option value="" className="text-gray-500">
                  Select Category
                </option>
                {productConfig?.categories.map((cat) => (
                  <option key={cat} value={cat} className="text-gray-900">
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>
          </div>

          {/* Images Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Product Images * (Upload up to 4 images)
            </label>

            {/* Upload Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {[0, 1, 2, 3].map((index) => {
                const isExistingImage = isEdit && index < existingImages.length
                const isImageMarkedForRemoval = imagesToRemove.includes(index)
                const hasNewImage = imageFiles[index] && imageFiles[index] !== null
                const hasPreview = imagePreviews[index] && imagePreviews[index].trim() !== ""
                
                return (
                  <div key={index} className="relative">
                    <input
                      key={fileInputKeys[index]} // Add key to force re-render
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, index)}
                      className="hidden"
                      id={`image-upload-${index}`}
                    />
                    <label
                      htmlFor={`image-upload-${index}`}
                      className={`block w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                        isImageMarkedForRemoval 
                          ? "border-red-300 bg-red-50" 
                          : "border-gray-300 hover:border-primary-main"
                      }`}
                    >
                      {hasPreview ? (
                        <div className="relative w-full h-full">
                          <img
                            src={imagePreviews[index] || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            className={`w-full h-full object-cover rounded-lg ${
                              isImageMarkedForRemoval ? "opacity-50" : ""
                            }`}
                          />
                          
                          {/* Image status indicators */}
                          <div className="absolute top-1 left-1 flex space-x-1">
                            {isExistingImage && !hasNewImage && (
                              <span className="bg-blue-500 text-white text-xs px-1 py-0.5 rounded">
                                Existing
                              </span>
                            )}
                            {hasNewImage && (
                              <span className="bg-green-500 text-white text-xs px-1 py-0.5 rounded">
                                New
                              </span>
                            )}
                            {isImageMarkedForRemoval && (
                              <span className="bg-red-500 text-white text-xs px-1 py-0.5 rounded">
                                Will Remove
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              removeImage(index)
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                          <Upload className="h-8 w-8 mb-2" />
                          <span className="text-sm">Upload Image {index + 1}</span>
                        </div>
                      )}
                    </label>
                    {errors[`image_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`image_${index}`]}</p>}
                  </div>
                )
              })}
            </div>

            {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}

            {/* Image Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Image Guidelines:</strong> Upload high-quality images (max 5MB each). Supported formats: JPG,
                PNG, WebP. At least one image is required.
              </p>
              {isEdit && (
                <div className="mt-2 text-sm text-blue-700">
                  <p><strong>Edit Mode:</strong></p>
                  <ul className="list-disc list-inside space-y-1 mt-1">
                    <li><span className="bg-blue-500 text-white px-1 py-0.5 rounded text-xs">Existing</span> - Current images from server</li>
                    <li><span className="bg-green-500 text-white px-1 py-0.5 rounded text-xs">New</span> - New images you're uploading</li>
                    <li><span className="bg-red-500 text-white px-1 py-0.5 rounded text-xs">Will Remove</span> - Images that will be deleted</li>
                    <li>Upload new images to add them, or click X to remove existing ones</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Physical Properties */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Color *</label>
              <MultiSelectColorDropdown
                options={productConfig?.colors || []}
                values={formData.color}
                onChange={(values) => handleInputChange("color", values)}
                placeholder="Select or create colors"
                error={errors.color}
                onAddNew={(newValue, hex) => {
                  if (productConfig) {
                    productConfig.colors.push({ name: newValue, hex })
                  }
                }}
              />
              {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Frame Material *</label>
              <SearchableDropdown
                options={productConfig?.frameMaterials || []}
                value={formData.frame}
                onChange={(value) => handleInputChange("frame", value)}
                placeholder="Select or create frame material"
                error={errors.frame}
                onAddNew={(newValue) => {
                  if (productConfig) {
                    productConfig.frameMaterials.push(newValue)
                  }
                }}
              />
              {errors.frame && <p className="text-red-500 text-sm mt-1">{errors.frame}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Weight (kg) *</label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent transition-all ${errors.weight ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="0.0"
                min="0"
                step="0.1"
              />
              {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
            </div>
          </div>

          {/* Gear Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Gear Type *</label>
            <div className="flex space-x-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gearType"
                  value="Geared"
                  checked={formData.gearType === "Geared"}
                  onChange={(e) => handleInputChange("gearType", e.target.value)}
                  className="h-4 w-4 text-primary-main focus:ring-primary-main border-gray-300"
                />
                <span className="ml-2 text-gray-900">Geared</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gearType"
                  value="Non-Geared"
                  checked={formData.gearType === "Non-Geared"}
                  onChange={(e) => handleInputChange("gearType", e.target.value)}
                  className="h-4 w-4 text-primary-main focus:ring-primary-main border-gray-300"
                />
                <span className="ml-2 text-gray-900">Non-Geared</span>
              </label>
            </div>
          </div>

          {/* Number of Gears (conditional) */}
          {formData.gearType === "Geared" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-sm font-semibold text-gray-900 mb-2">Number of Gears *</label>
              <input
                type="number"
                value={formData.numberOfGears}
                onChange={(e) => handleInputChange("numberOfGears", e.target.value)}
                className={`w-full max-w-xs px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent transition-all ${errors.numberOfGears ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="e.g., 21"
                min="1"
              />
              {errors.numberOfGears && <p className="text-red-500 text-sm mt-1">{errors.numberOfGears}</p>}
            </motion.div>
          )}

          {/* Specifications */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Brake Type *</label>
              <SearchableDropdown
                options={productConfig?.brakeTypes || []}
                value={formData.brakeType}
                onChange={(value) => handleInputChange("brakeType", value)}
                placeholder="Select or create brake type"
                error={errors.brakeType}
                onAddNew={(newValue) => {
                  if (productConfig) {
                    productConfig.brakeTypes.push(newValue)
                  }
                }}
              />
              {errors.brakeType && <p className="text-red-500 text-sm mt-1">{errors.brakeType}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Frame Size *</label>
              <SearchableDropdown
                options={productConfig?.frameSizes || []}
                value={formData.frameSize}
                onChange={(value) => handleInputChange("frameSize", value)}
                placeholder="Select or create frame size"
                error={errors.frameSize}
                onAddNew={(newValue) => {
                  if (productConfig) {
                    productConfig.frameSizes.push(newValue)
                  }
                }}
              />
              {errors.frameSize && <p className="text-red-500 text-sm mt-1">{errors.frameSize}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Wheel Size *</label>
              <SearchableDropdown
                options={productConfig?.wheelSizes || []}
                value={formData.wheelSize}
                onChange={(value) => handleInputChange("wheelSize", value)}
                placeholder="Select or create wheel size"
                error={errors.wheelSize}
                onAddNew={(newValue) => {
                  if (productConfig) {
                    productConfig.wheelSizes.push(newValue)
                  }
                }}
              />
              {errors.wheelSize && <p className="text-red-500 text-sm mt-1">{errors.wheelSize}</p>}
            </div>
          </div>

          {/* Stock */}
          <div className="max-w-xs">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Stock Quantity *</label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => handleInputChange("stock", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent transition-all ${errors.stock ? "border-red-500" : "border-gray-300"
                }`}
              placeholder="0"
              min="0"
            />
            {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
          </div>

          {/* Image Management Summary for Edit Mode */}
          {isEdit && (imagesToRemove.length > 0 || imageFiles.some(file => file !== null)) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
            >
              <h4 className="font-semibold text-yellow-800 mb-2">Image Changes Summary:</h4>
              <div className="text-sm text-yellow-700 space-y-1">
                {imagesToKeep.length > 0 && (
                  <p>• Keeping {imagesToKeep.length} existing image(s)</p>
                )}
                {imagesToRemove.length > 0 && (
                  <p>• Removing {imagesToRemove.length} existing image(s)</p>
                )}
                {imageFiles.filter(file => file !== null).length > 0 && (
                  <p>• Adding {imageFiles.filter(file => file !== null).length} new image(s)</p>
                )}
                <p className="font-medium">
                  Total images after save: {imagesToKeep.length + imageFiles.filter(file => file !== null).length}
                </p>
              </div>
            </motion.div>
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
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{isEdit ? "Update Product" : "Add Product"}</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
        )}
      </motion.div>
    </div>
  )
}
