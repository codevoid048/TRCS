"use client"

import { motion } from "framer-motion"

export default function ProductDetailsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb Skeleton */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-2 text-sm mb-6"
      >
        <div className="h-4 w-12 bg-gray-300 dark:bg-gray-500 rounded animate-pulse"></div>
        <div className="h-4 w-1 bg-gray-200 dark:bg-gray-400 rounded animate-pulse"></div>
        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-400 rounded animate-pulse"></div>
        <div className="h-4 w-1 bg-gray-200 dark:bg-gray-400 rounded animate-pulse"></div>
        <div className="h-4 w-12 bg-gray-200 dark:bg-gray-400 rounded animate-pulse"></div>
        <div className="h-4 w-1 bg-gray-200 dark:bg-gray-400 rounded animate-pulse"></div>
        <div className="h-4 w-32 bg-gray-300 dark:bg-gray-500 rounded animate-pulse"></div>
      </motion.div>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
        {/* Left Side - Image Gallery Skeleton */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          {/* Main Image */}
          <div className="relative bg-white rounded-xl overflow-hidden shadow-lg">
            <div className="aspect-square bg-gradient-to-br from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 animate-pulse"></div>

            {/* Zoom Button */}
            <div className="absolute top-4 right-4">
              <div className="w-10 h-10 bg-white/50 dark:bg-gray-700/50 rounded-full animate-pulse"></div>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <div className="w-10 h-10 bg-white/50 dark:bg-gray-700/50 rounded-full animate-pulse"></div>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-10 h-10 bg-white/50 dark:bg-gray-700/50 rounded-full animate-pulse"></div>
            </div>

            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-white/50 rounded-full animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-white rounded-lg overflow-hidden shadow-md">
                <div className="w-full h-full bg-gradient-to-br from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 animate-pulse"></div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Product Info Skeleton */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Header Actions */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="h-8 lg:h-10 bg-gray-300 dark:bg-gray-500 rounded animate-pulse mb-2 max-w-80"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-400 rounded animate-pulse max-w-24"></div>
            </div>
            <div className="flex space-x-2 ml-4">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-400 rounded-full animate-pulse"></div>
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-400 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-gray-300 dark:bg-gray-500 rounded animate-pulse"></div>
            <div className="h-5 bg-gray-200 dark:bg-gray-400 rounded animate-pulse max-w-32"></div>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-5 h-5 bg-gray-300 dark:bg-gray-500 rounded animate-pulse"></div>
              ))}
            </div>
            <div className="h-6 w-8 bg-gray-300 dark:bg-gray-500 rounded animate-pulse"></div>
            <div className="h-5 w-24 bg-gray-200 dark:bg-gray-400 rounded animate-pulse"></div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-baseline space-x-3">
              <div className="h-10 w-32 bg-gray-300 dark:bg-gray-500 rounded animate-pulse"></div>
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-400 rounded animate-pulse"></div>
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-400 rounded animate-pulse"></div>
            </div>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-400 rounded animate-pulse"></div>
          </div>

          {/* Product Info Sections */}
          <div className="space-y-6">
            {/* Description */}
            <div>
              <div className="h-6 w-24 bg-gray-300 dark:bg-gray-500 rounded animate-pulse mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-400 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-400 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-400 rounded animate-pulse max-w-80"></div>
              </div>
            </div>

            {/* Key Highlights */}
            <div>
              <div className="h-6 w-32 bg-gray-300 dark:bg-gray-500 rounded animate-pulse mb-3"></div>
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-gray-300 dark:bg-gray-500 rounded-full animate-pulse mt-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-400 rounded animate-pulse flex-1"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Specs */}
            <div>
              <div className="h-6 w-40 bg-gray-300 dark:bg-gray-500 rounded animate-pulse mb-3"></div>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="h-3 w-16 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-1"></div>
                    <div className="h-4 w-20 bg-gray-300 dark:bg-gray-500 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="w-full h-14 bg-gray-300 dark:bg-gray-500 rounded-lg animate-pulse"></div>
            <div className="w-full h-14 bg-gray-200 dark:bg-gray-400 rounded-lg animate-pulse"></div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="w-6 h-6 bg-gray-300 dark:bg-gray-500 rounded animate-pulse mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-1"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-400 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Product Specifications Skeleton */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700"
      >
        <div className="h-8 w-48 bg-gray-300 dark:bg-gray-500 rounded animate-pulse mb-6"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-400 rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-gray-300 dark:bg-gray-500 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Related Products Skeleton */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
      >
        <div className="h-8 w-48 bg-gray-300 dark:bg-gray-500 rounded animate-pulse mb-6"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden">
              <div className="w-full h-48 bg-gradient-to-br from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 animate-pulse"></div>
              <div className="p-4">
                <div className="h-5 bg-gray-300 dark:bg-gray-500 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-3 max-w-16"></div>
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-300 dark:bg-gray-500 rounded animate-pulse max-w-20"></div>
                  <div className="h-8 w-20 bg-gray-200 dark:bg-gray-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
