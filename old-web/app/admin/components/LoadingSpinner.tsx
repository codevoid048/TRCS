"use client"

import { motion } from "framer-motion"

interface LoadingSpinnerProps {
  text?: string
  size?: "sm" | "md" | "lg"
}

export default function LoadingSpinner({ text = "Loading...", size = "md" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        className={`${sizeClasses[size]} border-2 border-primary-main border-t-transparent rounded-full`}
      />
      <p className="text-gray-600 text-sm">{text}</p>
    </div>
  )
}
