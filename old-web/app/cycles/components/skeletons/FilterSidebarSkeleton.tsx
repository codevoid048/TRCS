"use client"

import { motion } from "framer-motion"

export default function FilterSidebarSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl lg:shadow-lg border lg:border-gray-200 lg:dark:border-gray-700 lg:rounded-xl w-80">
      <div className="flex flex-col h-full">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-16 bg-gray-300 dark:bg-gray-500 rounded animate-pulse"></div>
            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-400 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-20 bg-gray-200 dark:bg-gray-400 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Filter Sections Skeleton */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {[...Array(6)].map((_, sectionIndex) => (
            <div key={sectionIndex} className="border-b border-gray-200 dark:border-gray-600 pb-4 last:border-b-0">
              {/* Section Header */}
              <div className="flex items-center justify-between w-full py-3 px-2">
                <div className="flex items-center space-x-2">
                  <div className="h-5 w-24 bg-gray-300 dark:bg-gray-500 rounded animate-pulse"></div>
                  <div className="w-6 h-5 bg-gray-200 dark:bg-gray-400 rounded-full animate-pulse"></div>
                </div>
                <div className="w-4 h-4 bg-gray-200 dark:bg-gray-400 rounded animate-pulse"></div>
              </div>

              {/* Filter Options */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: sectionIndex * 0.1 }}
                className="space-y-3 mt-3 px-2"
              >
                {[...Array(Math.floor(Math.random() * 4) + 2)].map((_, optionIndex) => (
                  <div key={optionIndex} className="flex items-center space-x-3 p-2">
                    <div className="w-5 h-5 bg-gray-300 dark:bg-gray-500 rounded border-2 animate-pulse"></div>
                    <div
                      className={`h-4 bg-gray-200 dark:bg-gray-400 rounded animate-pulse ${
                        optionIndex % 3 === 0 ? "w-20" : optionIndex % 3 === 1 ? "w-16" : "w-24"
                      }`}
                    ></div>
                  </div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>

        {/* Action Buttons Skeleton */}
        <div className="p-6 space-y-3 border-t border-gray-200 dark:border-gray-700">
          {/* Apply Button */}
          <div className="w-full h-12 bg-gray-300 dark:bg-gray-500 rounded-lg animate-pulse"></div>

          {/* Secondary Actions */}
          <div className="flex space-x-2">
            <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-400 rounded-lg animate-pulse"></div>
            <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-400 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
