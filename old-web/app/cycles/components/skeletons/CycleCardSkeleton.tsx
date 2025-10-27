"use client"

import { motion } from "framer-motion"

interface CycleCardSkeletonProps {
  index?: number
}

export default function CycleCardSkeleton({ index = 0 }: CycleCardSkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
    >
      {/* Image Skeleton */}
      <div className="relative overflow-hidden">
        <div className="w-full h-64 bg-gradient-to-br from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 animate-pulse"></div>

        {/* Heart Icon Skeleton */}
        <div className="absolute top-4 right-4">
          <div className="w-10 h-10 bg-white/50 dark:bg-gray-700/50 rounded-full animate-pulse"></div>
        </div>

        {/* Category Badge Skeleton */}
        <div className="absolute top-4 left-4">
          <div className="h-6 w-16 bg-gray-400/50 dark:bg-gray-500/50 rounded-full animate-pulse"></div>
        </div>

        {/* Stock Badge Skeleton */}
        <div className="absolute bottom-4 left-4">
          <div className="h-6 w-20 bg-gray-400/50 dark:bg-gray-500/50 rounded-full animate-pulse"></div>
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

        {/* Name and Brand Skeleton */}
        <div className="h-6 bg-gray-300 dark:bg-gray-500 rounded animate-pulse mb-1 max-w-40"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-400 rounded animate-pulse mb-4 max-w-20"></div>

        {/* Specs Skeleton */}
        <div className="space-y-2 mb-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 bg-gray-200 dark:bg-gray-400 rounded animate-pulse max-w-20"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-500 rounded animate-pulse max-w-16"></div>
            </div>
          ))}
        </div>

        {/* Stock Status Skeleton */}
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-300 dark:bg-gray-500 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-400 rounded animate-pulse max-w-24"></div>
          </div>
        </div>

        {/* Price and Button Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-8 bg-gray-300 dark:bg-gray-500 rounded animate-pulse max-w-24"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-400 rounded animate-pulse max-w-20"></div>
          </div>
          <div className="h-10 w-28 bg-gray-300 dark:bg-gray-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </motion.div>
  )
}
