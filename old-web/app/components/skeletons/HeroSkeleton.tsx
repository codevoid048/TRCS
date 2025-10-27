"use client"

import { motion } from "framer-motion"

export default function HeroSkeleton() {
  return (
    <section className="relative min-h-screen h-screen flex items-center justify-center overflow-hidden">
      {/* Background Skeleton */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-pulse">
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
      </div>

      {/* Hero Content Skeleton */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Title Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4 mb-6"
        >
          <div className="h-16 md:h-20 bg-white/20 dark:bg-gray-600/30 rounded-lg animate-pulse mx-auto max-w-4xl"></div>
          <div className="h-12 md:h-16 bg-white/20 dark:bg-gray-600/30 rounded-lg animate-pulse mx-auto max-w-3xl"></div>
        </motion.div>

        {/* Subtitle Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="h-6 md:h-8 bg-white/15 dark:bg-gray-600/25 rounded-lg animate-pulse mx-auto max-w-2xl"></div>
        </motion.div>

        {/* Button Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="h-14 w-48 bg-white/20 dark:bg-gray-600/30 rounded-full animate-pulse mx-auto"></div>
        </motion.div>
      </div>

      {/* Scroll Indicator Skeleton */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-8 h-8 bg-white/20 dark:bg-gray-600/30 rounded-full animate-pulse"></div>
      </motion.div>
    </section>
  )
}
