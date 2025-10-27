"use client"

import { motion } from "framer-motion"

export default function FeaturedCyclesSkeleton() {
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
          <div className="h-12 md:h-16 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse mx-auto max-w-md mb-4"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-500 rounded-lg animate-pulse mx-auto max-w-2xl"></div>
        </motion.div>

        {/* Cycles Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-600"
            >
              {/* Image Skeleton */}
              <div className="relative overflow-hidden">
                <div className="w-full h-64 bg-gradient-to-br from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 animate-pulse"></div>

                {/* Heart Icon Skeleton */}
                <div className="absolute top-4 right-4">
                  <div className="w-10 h-10 bg-white/50 dark:bg-gray-700/50 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Content Skeleton */}
              <div className="p-6">
                {/* Rating Skeleton */}
                <div className="flex items-center mb-2">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-4 h-4 bg-gray-300 dark:bg-gray-500 rounded animate-pulse"></div>
                    ))}
                  </div>
                  <div className="w-12 h-4 bg-gray-200 dark:bg-gray-500 rounded animate-pulse ml-2"></div>
                </div>

                {/* Title Skeleton */}
                <div className="h-6 bg-gray-300 dark:bg-gray-500 rounded animate-pulse mb-2 max-w-40"></div>

                {/* Brand Skeleton */}
                <div className="h-4 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-4 max-w-20"></div>

                {/* Description Skeleton */}
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-400 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-400 rounded animate-pulse max-w-32"></div>
                </div>

                {/* Price and Button Skeleton */}
                <div className="flex items-center justify-between">
                  <div className="h-8 bg-gray-300 dark:bg-gray-500 rounded animate-pulse max-w-24"></div>
                  <div className="h-10 w-28 bg-gray-300 dark:bg-gray-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
