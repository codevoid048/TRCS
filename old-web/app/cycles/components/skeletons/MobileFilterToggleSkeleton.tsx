"use client"

import { motion } from "framer-motion"

export default function MobileFilterToggleSkeleton() {
  return (
    <div className="lg:hidden mb-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between bg-white dark:bg-gray-800 px-4 py-3 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-gray-300 dark:bg-gray-500 rounded animate-pulse"></div>
          <div className="h-5 w-16 bg-gray-300 dark:bg-gray-500 rounded animate-pulse"></div>
          <div className="w-8 h-5 bg-gray-200 dark:bg-gray-400 rounded-full animate-pulse"></div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-400 rounded animate-pulse"></div>
            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-400 rounded animate-pulse"></div>
          </div>
          <div className="w-4 h-4 bg-gray-300 dark:bg-gray-500 rounded animate-pulse"></div>
        </div>
      </motion.div>
    </div>
  )
}
