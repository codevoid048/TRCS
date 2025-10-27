"use client"

import { motion } from "framer-motion"
import { Bike } from "lucide-react"

interface LoadingAnimationProps {
  text?: string
  size?: "sm" | "md" | "lg"
}

export default function LoadingAnimation({ text = "Loading...", size = "md" }: LoadingAnimationProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  }

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const dotVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 0.6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  const bikeVariants = {
    animate: {
      rotate: [0, 360],
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  const wheelVariants = {
    animate: {
      rotate: [0, 360],
      transition: {
        duration: 1,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      },
    },
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8">
      {/* Animated Bike */}
      <motion.div
        initial={{ rotate: 0, scale: 1 }}
        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className={`${sizeClasses[size]} text-primary-main relative`}
      >
        <Bike className="w-full h-full" />

        {/* Spinning Wheels Effect */}
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/4 w-3 h-3 border-2 border-primary-main rounded-full"
        />
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 right-1/4 w-3 h-3 border-2 border-primary-main rounded-full"
        />
      </motion.div>

      {/* Loading Text with Animated Dots */}
      <div className="flex items-center space-x-1">
        <span className="text-gray-600 dark:text-gray-300 font-subheading">{text}</span>
        <motion.div variants={containerVariants} animate="animate" className="flex space-x-1">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              variants={dotVariants as any}
              initial="initial"
              animate="animate"
              custom={i}
              className="w-2 h-2 bg-primary-main rounded-full"
            />
          ))}
        </motion.div>
      </div>

      {/* Progress Bar */}
      <div className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="h-full w-1/3 bg-gradient-to-r from-primary-main to-secondary-main rounded-full"
        />
      </div>
    </div>
  )
}
