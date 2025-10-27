"use client"

import { motion } from "framer-motion"

export default function AboutUsSkeleton() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="h-12 md:h-16 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse mx-auto max-w-md mb-4"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-500 rounded-lg animate-pulse mx-auto max-w-3xl"></div>
        </motion.div>

        {/* Story Section Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Side - Story Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse mb-6 max-w-48"></div>

            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-500 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-500 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-500 rounded animate-pulse max-w-80"></div>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-8 pt-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="text-center">
                  <div className="h-8 w-12 bg-gray-300 dark:bg-gray-500 rounded animate-pulse mb-1"></div>
                  <div className="h-3 w-12 bg-gray-200 dark:bg-gray-400 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="w-full h-96 bg-gradient-to-br from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 animate-pulse"></div>
            </div>

            {/* Floating Card Skeleton */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-xs border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-500 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-300 dark:bg-gray-500 rounded animate-pulse mb-1"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-400 rounded animate-pulse max-w-16"></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Features Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[...Array(4)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 rounded-full animate-pulse mx-auto mb-4"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-500 rounded animate-pulse mb-3 mx-auto max-w-32"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-400 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-400 rounded animate-pulse max-w-24 mx-auto"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Values Section Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100 dark:border-gray-700"
        >
          <div className="text-center mb-12">
            <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse mx-auto max-w-48 mb-4"></div>
            <div className="h-5 bg-gray-200 dark:bg-gray-500 rounded-lg animate-pulse mx-auto max-w-2xl"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(2)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="flex items-start space-x-4"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 rounded-full animate-pulse flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-300 dark:bg-gray-500 rounded animate-pulse mb-2 max-w-32"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-400 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-400 rounded animate-pulse max-w-48"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
