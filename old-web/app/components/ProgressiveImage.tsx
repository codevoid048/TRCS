"use client"
import { motion } from "framer-motion"
import { useImageLoading } from "../hooks/useImageLoading"

interface ProgressiveImageProps {
  src: string
  alt: string
  className?: string
  skeletonClassName?: string
}

export default function ProgressiveImage({ src, alt, className = "", skeletonClassName = "" }: ProgressiveImageProps) {
  const { isLoading, hasError } = useImageLoading(src)

  if (isLoading) {
    return (
      <div
        className={`bg-gradient-to-br from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 animate-pulse ${skeletonClassName}`}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-gray-400 dark:text-gray-500">Loading...</div>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}>
        <div className="text-gray-500 dark:text-gray-400">Failed to load</div>
      </div>
    )
  }

  return (
    <motion.img
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
    />
  )
}
