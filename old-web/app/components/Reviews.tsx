"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { ProductsAPI } from "@/lib/api/products"
import { Review } from "@/types/product"

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mounted = true

    const fetchReviews = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await ProductsAPI.getReviews()
        const reviewsData = response?.data ?? []
        if (mounted) setReviews(reviewsData)
      } catch (err) {
        console.error("Error fetching reviews:", err)
        if (mounted) setError("Failed to load reviews")
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    fetchReviews()
    return () => {
      mounted = false
    }
  }, [])

  // Auto-scroll functionality
  useEffect(() => {
    if (!isPaused && reviews.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length)
      }, 3000) // Change every 3 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPaused])

  const handleMouseEnter = () => setIsPaused(true)
  const handleMouseLeave = () => setIsPaused(false)

  if (reviews.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-hero text-[#2D3436] dark:text-white mb-4 transition-colors duration-300">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </motion.div>

        {/* Center-Focused Carousel */}
        <div 
          className="relative overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center p-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex justify-center items-center p-16 text-red-500">
              {error}
            </div>
          )}

          {/* Carousel Container with Center Mode */}
          {!error && reviews.length > 0 && (
            <div className="flex justify-center items-center gap-4 px-16 py-8">
              {reviews.map((review, index) => {
              // Calculate position relative to current index
              const position = (index - currentIndex + reviews.length) % reviews.length
              const isCurrent = position === 0
              const isPrev = position === reviews.length - 1
              const isNext = position === 1
              const isVisible = position <= 1 || position >= reviews.length - 1

              if (!isVisible) return null

              return (
                <motion.div
                  key={review._id}
                  className={`flex-shrink-0 transition-all duration-700 ease-out ${
                    isCurrent 
                      ? 'w-96 z-20' 
                      : 'w-64 z-10'
                  }`}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ 
                    opacity: isCurrent ? 1 : 0.6,
                    scale: isCurrent ? 1 : 0.85,
                    y: isCurrent ? 0 : 10,
                    x: isPrev ? -50 : isNext ? 50 : 0
                  }}
                  transition={{ 
                    duration: 0.8, 
                    ease: "easeInOut"
                  }}
                >
                  <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg transition-all duration-500 relative border border-gray-100 dark:border-gray-600 h-full ${
                    isCurrent 
                      ? 'ring-4 ring-primary-main/20 shadow-2xl' 
                      : 'shadow-md'
                  }`}>
                    {/* Quote Icon */}
                    <div className="absolute top-4 right-4">
                      <Quote className={`h-8 w-8 transition-colors duration-300 ${
                        isCurrent 
                          ? 'text-primary-main' 
                          : 'text-primary-main/30'
                      }`} />
                    </div>

                    {/* Rating */}
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < review.rating ? "text-secondary-main fill-current" : "text-gray-300 dark:text-gray-600"}`}
                        />
                      ))}
                    </div>

                    {/* Review Text */}
                    <p className={`text-gray-700 dark:text-gray-300 mb-6 leading-relaxed italic transition-all duration-300 line-clamp-3 ${
                      isCurrent ? 'text-base' : 'text-sm'
                    }`}>
                      "{review.comment}"
                    </p>

                    {/* Cycle Model */}
                    <div className="mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                        isCurrent 
                          ? 'bg-gradient-to-r from-primary-main to-secondary-main text-white' 
                          : 'bg-primary-main/20 text-primary-main'
                      }`}>
                        {review.cycleName}
                      </span>
                    </div>

                    {/* Customer Info */}
                    <div className="flex items-center">
                      <img
                        src="/person.png?height=60&width=60"
                        alt={review.reviewerName}
                        className={`rounded-full object-cover mr-4 transition-all duration-300 ${
                          isCurrent ? 'w-12 h-12' : 'w-10 h-10'
                        }`}
                      />
                      <div>
                        <h4 className={`font-semibold text-[#2D3436] dark:text-white transition-all duration-300 ${
                          isCurrent ? 'text-base' : 'text-sm'
                        }`}>
                          {review.reviewerName}
                        </h4>
                        <p className={`text-gray-600 dark:text-gray-400 transition-all duration-300 ${
                          isCurrent ? 'text-sm' : 'text-xs'
                        }`}>
                          {review.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
          )}

          {/* Navigation Dots */}
          {reviews.length > 0 && (
            <div className="flex justify-center space-x-2 mt-8">
              {reviews.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-gradient-to-r from-primary-main to-secondary-main scale-125' 
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
          )}

          {/* Play/Pause Indicator */}
          {/* {reviews.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isPaused ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2 z-30"
            >
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </motion.div>
          )} */}
        </div>
        
      </div>
    </section>
  )
}
