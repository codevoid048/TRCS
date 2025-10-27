"use client"

import { motion } from "framer-motion"

export default function ReviewsSkeleton() {
  return (
    <section className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="h-12 md:h-16 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse mx-auto max-w-lg mb-4"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-500 rounded-lg animate-pulse mx-auto max-w-2xl"></div>
        </motion.div>

        {/* Reviews Carousel Skeleton */}
        <div className="relative mb-16 overflow-hidden">
          <div className="flex justify-center items-center gap-4 px-16 py-8">
            {/* Center card (larger) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-shrink-0 w-96 z-20"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-gray-600 h-full ring-4 ring-primary-main/20">
                {/* Quote Icon Skeleton */}
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-500 rounded animate-pulse"></div>
                </div>

                {/* Rating Skeleton */}
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-5 h-5 bg-gray-300 dark:bg-gray-500 rounded animate-pulse mr-1"></div>
                  ))}
                </div>

                {/* Review Text Skeleton */}
                <div className="space-y-3 mb-6">
                  <div className="h-4 bg-gray-300 dark:bg-gray-500 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-500 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-500 rounded animate-pulse max-w-32"></div>
                </div>

                {/* Cycle Model Badge Skeleton */}
                <div className="mb-4">
                  <div className="h-6 w-32 bg-gradient-to-r from-primary-main to-secondary-main rounded-full animate-pulse"></div>
                </div>

                {/* Customer Info Skeleton */}
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-300 dark:bg-gray-500 rounded-full animate-pulse mr-4"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-300 dark:bg-gray-500 rounded animate-pulse mb-1 max-w-28"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-400 rounded animate-pulse max-w-36"></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Side card (smaller) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 0.6, scale: 0.85, y: 10 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-shrink-0 w-64 z-10"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-600 h-full">
                {/* Quote Icon Skeleton */}
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-500 rounded animate-pulse opacity-30"></div>
                </div>

                {/* Rating Skeleton */}
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-gray-300 dark:bg-gray-500 rounded animate-pulse mr-1"></div>
                  ))}
                </div>

                {/* Review Text Skeleton */}
                <div className="space-y-2 mb-4">
                  <div className="h-3 bg-gray-300 dark:bg-gray-500 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-500 rounded animate-pulse"></div>
                </div>

                {/* Cycle Model Badge Skeleton */}
                <div className="mb-4">
                  <div className="h-5 w-24 bg-primary-main/20 rounded-full animate-pulse"></div>
                </div>

                {/* Customer Info Skeleton */}
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 dark:bg-gray-500 rounded-full animate-pulse mr-3"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 dark:bg-gray-500 rounded animate-pulse mb-1 max-w-20"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-400 rounded animate-pulse max-w-24"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Navigation Dots Skeleton */}
          <div className="flex justify-center space-x-2 mt-8">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full animate-pulse ${
                  index === 0
                    ? 'bg-gradient-to-r from-primary-main to-secondary-main scale-125'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {[...Array(4)].map((_, index) => (
            <div key={index}>
              <div className="h-10 md:h-12 bg-gray-300 dark:bg-gray-500 rounded animate-pulse mb-2 mx-auto max-w-24"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mx-auto max-w-32"></div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
