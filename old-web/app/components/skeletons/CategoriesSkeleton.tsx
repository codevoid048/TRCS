"use client"

import { motion } from "framer-motion"

export default function CategoriesSkeleton() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="h-12 md:h-16 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse mx-auto max-w-md mb-4"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse mx-auto max-w-2xl"></div>
        </motion.div>

        {/* Categories Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg h-full border border-gray-100 dark:border-gray-700"
            >
              {/* Icon Skeleton */}
              <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 rounded-full animate-pulse mb-6"></div>

              {/* Title Skeleton */}
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse mb-3 max-w-32"></div>

              {/* Description Skeleton */}
              <div className="space-y-2 mb-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-500 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-500 rounded animate-pulse max-w-24"></div>
              </div>

              {/* Progress Bar Skeleton */}
              <div className="h-1 bg-gray-200 dark:bg-gray-500 rounded-full animate-pulse"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
