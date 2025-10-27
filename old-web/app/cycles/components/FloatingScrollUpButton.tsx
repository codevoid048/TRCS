"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronUp } from "lucide-react"

export default function FloatingScrollUpButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          {/* Pulse Rings */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary-main/30"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary-main/20"
            animate={{
              scale: [1, 2, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: 0.5,
              ease: "easeInOut",
            }}
          />

          {/* Main Button */}
          <motion.button
            onClick={scrollToTop}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="relative bg-gradient-to-r from-primary-main to-secondary-main text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 group overflow-hidden"
            animate={{
              y: [0, -8, 0],
              rotate: isHovered ? [0, -5, 5, 0] : 0,
            }}
            transition={{
              y: {
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              },
              rotate: {
                duration: 0.5,
              },
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Lightning Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: isHovered ? [-100, 100] : -100,
              }}
              transition={{
                duration: 0.6,
                ease: "easeInOut",
              }}
            />

            {/* Button Content */}
            <div className="relative flex items-center space-x-2">
              <motion.div 
                animate={{ 
                  rotate: isHovered ? 360 : 0,
                  y: isHovered ? [-2, 2, -2] : 0
                }} 
                transition={{ 
                  rotate: { duration: 0.5 },
                  y: { duration: 1, repeat: isHovered ? Number.POSITIVE_INFINITY : 0 }
                }}
              >
                <ChevronUp className="h-6 w-6" />
              </motion.div>

              {/* Expandable Text */}
              <motion.span
                className="font-semibold whitespace-nowrap overflow-hidden"
                initial={{ width: 0, opacity: 0 }}
                animate={{
                  width: isHovered ? "auto" : 0,
                  opacity: isHovered ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                Scroll Up
              </motion.span>
            </div>

            {/* Ripple Effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-white/20"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: isHovered ? [0, 1.5] : 0,
                opacity: isHovered ? [0.5, 0] : 0,
              }}
              transition={{ duration: 0.6 }}
            />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}