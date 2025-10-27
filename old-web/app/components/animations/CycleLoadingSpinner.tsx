"use client"

import { motion } from "framer-motion"

interface CycleLoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  text?: string
}

export default function CycleLoadingSpinner({ size = "md", text = "Loading..." }: CycleLoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <div className={`${sizeClasses[size]} relative`}>
        {/* Spinning cycle */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute inset-0"
        >
          <svg viewBox="0 0 60 60" className="w-full h-full">
            {/* Simplified cycle for spinner */}
            <circle
              cx="15"
              cy="45"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-primary-main"
            />
            <circle
              cx="45"
              cy="45"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-primary-main"
            />
            <path
              d="M15 45 L30 20 L45 45"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-primary-main"
            />
            <line x1="25" y1="32" x2="25" y2="20" stroke="currentColor" strokeWidth="2" className="text-primary-main" />
          </svg>
        </motion.div>

        {/* Pulsing center */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-2 h-2 bg-secondary-main rounded-full" />
        </motion.div>
      </div>

      {text && (
        <motion.p
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="text-gray-600 dark:text-gray-300 font-subheading"
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}
