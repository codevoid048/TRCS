"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, User, Mail, Phone, CheckCircle, Loader2 } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import type { Product } from "@/types/product"
import axios from "axios"

// Add this before any usage of window.grecaptcha
declare global {
  interface Window {
    grecaptcha?: {
      reset: (opt_widget_id?: string | number) => void
      getResponse: (opt_widget_id?: string | number) => string
      render: (...args: any[]) => any
      clients?: { [key: string]: any }
    }
  }
}

interface RequestModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product
}

interface FormData {
  name: string
  email: string
  phone: string
  description: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  description?: string
}

export default function RequestModal({ isOpen, onClose, product }: RequestModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    description: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false)
  const [submitError, setSubmitError] = useState<string>("")

  // NEW: container ref + widget id ref
  const recaptchaContainerRef = useRef<HTMLDivElement | null>(null)
  const widgetIdRef = useRef<number | null>(null)

  // Load reCAPTCHA script once (explicit render)
  useEffect(() => {
    // do nothing if already loaded
    if (typeof window === "undefined") return
    if (window.grecaptcha) {
      setRecaptchaLoaded(true)
      return
    }

    // avoid adding script multiple times
    if (document.querySelector('script[src*="recaptcha"]')) {
      // script exists but grecaptcha not yet available
      // wait for it to initialize by polling a few times
      const check = setInterval(() => {
        if (window.grecaptcha) {
          setRecaptchaLoaded(true)
          clearInterval(check)
        }
      }, 200)
      // timeout fallback
      setTimeout(() => clearInterval(check), 5000)
      return
    }

    const script = document.createElement("script")
    // explicit rendering mode so Google doesn't auto-scan the DOM
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit"
    script.async = true
    script.defer = true
    script.onload = () => {
      setRecaptchaLoaded(true)
    }
    script.onerror = () => {
      console.error("Failed to load reCAPTCHA")
      setSubmitError("Failed to load security verification. Please refresh and try again.")
    }
    document.head.appendChild(script)

    // we do not remove the script on cleanup (other components might use it)
  }, [])

  // Render the widget when modal opens and script is ready
  useEffect(() => {
    // only render when modal is open and recaptcha script available
    if (!isOpen) return
    if (!recaptchaLoaded) return
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
    if (!siteKey) {
      setSubmitError("Security verification not configured.")
      return
    }

    const container = recaptchaContainerRef.current
    if (!container) {
      // container might not be in DOM yet (ensure modal mounted)
      return
    }

    // if widget already rendered, do nothing
    if (widgetIdRef.current !== null) return

    try {
      // grecaptcha.render returns a widget id (number)
      const id = window.grecaptcha!.render(container, {
        sitekey: siteKey,
        theme: "light",
        size: "normal",
      })
      widgetIdRef.current = typeof id === "number" ? id : Number(id)
    } catch (err) {
      console.error("reCAPTCHA render error:", err)
      setSubmitError("Security verification failed to initialize. Please refresh.")
    }

    // cleanup handler — runs when modal closes or dependencies change
    return () => {
      try {
        if (window.grecaptcha && widgetIdRef.current !== null) {
          // reset widget state safely before DOM removal
          window.grecaptcha.reset(widgetIdRef.current)
        }
      } catch (err) {
        // swallow errors to avoid unhandled promise exceptions
        console.warn("reCAPTCHA reset error during cleanup:", err)
      } finally {
        // clear widget id so it will re-render next time modal opens
        widgetIdRef.current = null
      }
    }
  }, [isOpen, recaptchaLoaded])

  // Reset form when modal opens/closes (keeps your original behavior)
  useEffect(() => {
    if (!isOpen) {
      setFormData({ name: "", email: "", phone: "", description: "" })
      setErrors({})
      setSubmitError("")
      setIsSubmitting(false)
      setIsSuccess(false)
      // NOTE: explicit reset is already done in the render-effect cleanup, but guard here too
      try {
        if (window.grecaptcha && widgetIdRef.current !== null) {
          window.grecaptcha.reset(widgetIdRef.current)
        }
      } catch (err) {
        // ignore
      }
      widgetIdRef.current = null
    } else {
      // Clear any previous errors when opening
      setSubmitError("")
    }
  }, [isOpen])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    } else if (formData.name.trim().length < 2 || formData.name.trim().length > 100) {
      newErrors.name = "Name must be between 2-100 characters"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Mobile number is required"
    } else {
      const cleanPhone = formData.phone.replace(/[\s\-()]/g, "")
      if (!/^\+?[\d]{10,15}$/.test(cleanPhone)) {
        newErrors.phone = "Please enter a valid mobile number (10-15 digits)"
      }
    }

    if (formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isFormValid = () => {
    return formData.name.trim() && formData.email.trim() && formData.phone.trim()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    // Clear any previous errors
    setSubmitError("")

    // Check reCAPTCHA using explicit widget id
    try {
      if (!window.grecaptcha) {
        setSubmitError("Security verification not loaded. Please refresh and try again.")
        return
      }
      const wid = widgetIdRef.current
      if (wid === null) {
        setSubmitError("reCAPTCHA not initialized. Please try again.")
        return
      }
      const recaptchaResponse = window.grecaptcha.getResponse(wid)
      if (!recaptchaResponse) {
        setSubmitError("Please complete the reCAPTCHA verification")
        return
      }
    } catch (err) {
      console.error("reCAPTCHA getResponse error:", err)
      setSubmitError("Security verification failed. Please try again.")
      return
    }

    setIsSubmitting(true)

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

      const requestData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobileNumber: formData.phone.trim(),
        description: formData.description.trim() || undefined,
        cycleId: product._id,
        recaptchaToken: window.grecaptcha?.getResponse(widgetIdRef.current ?? undefined) || "",
      }

      const response = await axios.post(`${API_BASE_URL}/public/purchase-request`, requestData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
        timeout: 10000, // 10 second timeout
      })

      // Reset reCAPTCHA after successful submission (safe guard)
      try {
        if (window.grecaptcha && widgetIdRef.current !== null) {
          window.grecaptcha.reset(widgetIdRef.current)
        }
      } catch (err) {
        // ignore reset errors
      }

      setIsSubmitting(false)
      setIsSuccess(true)

      // Close modal after 3 seconds
      setTimeout(() => {
        onClose()
      }, 3000)
    } catch (error: any) {
      setIsSubmitting(false)

      // Handle specific API errors
      if (error.response?.status === 400 && error.response?.data?.field) {
        const field = error.response.data.field as keyof FormErrors
        const message = error.response.data.message

        setErrors((prev) => ({
          ...prev,
          [field]: message,
        }))
      } else if (error.response?.status === 404) {
        setSubmitError("Product not found or no longer available")
      } else if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        setSubmitError("Request timed out. Please check your connection and try again.")
      } else {
        // Generic error
        setSubmitError(error.response?.data?.message || "Failed to submit request. Please try again.")
      }

      // Reset reCAPTCHA on error (safe)
      try {
        if (window.grecaptcha && widgetIdRef.current !== null) {
          window.grecaptcha.reset(widgetIdRef.current)
        }
      } catch (err) {
        // ignore
      }
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {!isSuccess ? (
              <>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <h2 className="text-xl font-heading font-bold text-[#2D3436] dark:text-white">
                      Request {product.name}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Fill out the form below and we'll get back to you
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50"
                  >
                    <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <img src={product.images[0]} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <p className="font-medium text-[#2D3436] dark:text-white">{product.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{product.category}</p>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-[#2D3436] dark:text-white mb-2">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-[#2D3436] dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                          errors.name ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                        }`}
                        placeholder="Enter your full name"
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-[#2D3436] dark:text-white mb-2">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-[#2D3436] dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                          errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                        }`}
                        placeholder="Enter your email address"
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label className="block text-sm font-medium text-[#2D3436] dark:text-white mb-2">Phone Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-[#2D3436] dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                          errors.phone ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                        }`}
                        placeholder="Enter your phone number"
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  {/* Description Field */}
                  <div>
                    <label className="block text-sm font-medium text-[#2D3436] dark:text-white mb-2">Additional Message (Optional)</label>
                    <div className="relative">
                      <FaWhatsapp className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        rows={3}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-[#2D3436] dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                        placeholder="Any specific requirements or questions..."
                        disabled={isSubmitting}
                        maxLength={500}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Optional field</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{formData.description.length}/500</p>
                    </div>
                  </div>

                  {/* reCAPTCHA */}
                  {recaptchaLoaded && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
                    <div className="flex justify-center">
                      {/* NEW: explicit container for render */}
                      <div ref={recaptchaContainerRef} />
                    </div>
                  )}

                  {!recaptchaLoaded && (
                    <div className="flex justify-center py-4">
                      <div className="text-gray-500 dark:text-gray-400 text-sm">Loading security verification...</div>
                    </div>
                  )}

                  {recaptchaLoaded && !process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                      <p className="text-yellow-600 dark:text-yellow-400 text-sm">Security verification not configured. Please contact administrator.</p>
                    </div>
                  )}

                  {/* Submit Error */}
                  {submitError && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                      <p className="text-red-600 dark:text-red-400 text-sm">{submitError}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={!isFormValid() || isSubmitting || !recaptchaLoaded || !process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                    className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
                      isFormValid() && !isSubmitting && recaptchaLoaded && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
                        ? "bg-primary-main hover:bg-primary-dark shadow-lg hover:shadow-xl"
                        : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                    }`}
                    whileHover={isFormValid() && !isSubmitting && recaptchaLoaded && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? { scale: 1.02 } : {}}
                    whileTap={isFormValid() && !isSubmitting && recaptchaLoaded && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? { scale: 0.98 } : {}}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Submit Request</span>
                    )}
                  </motion.button>
                </form>
              </>
            ) : (
              /* Success State */
              <div className="p-8 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }} className="mb-6">
                  <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <h3 className="text-xl font-heading font-bold text-[#2D3436] dark:text-white mb-2">Thanks for your request!</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">We'll reach out to you soon with more details about the {product.name}.</p>

                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-[#2D3436] dark:text-white mb-2">What's next?</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 text-left">
                      <li>• Our team will review your request within 24 hours</li>
                      <li>• We'll contact you via phone or email to discuss details</li>
                      <li>• Schedule a test ride or arrange delivery</li>
                    </ul>
                  </div>

                  <button onClick={handleClose} className="bg-primary-main hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition-colors">Continue Shopping</button>
                </motion.div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
