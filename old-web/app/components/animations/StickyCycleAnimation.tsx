"use client"

import { motion, useAnimation } from "framer-motion"
import { useEffect, useState } from "react"
import { Zap, Star } from "lucide-react"

interface StickyCycleAnimationProps {
  onRequestNow?: () => void
  productName?: string
  price?: number
  isVisible?: boolean
}

export default function StickyCycleAnimation({
  onRequestNow,
  productName = "This Cycle",
  price,
  isVisible = true,
}: StickyCycleAnimationProps) {
  const [isMovingRight, setIsMovingRight] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const cycleControls = useAnimation()
  const wheelControls = useAnimation()
  const riderControls = useAnimation()

  // Main cycle movement animation
  useEffect(() => {
    const animateCycle = async () => {
      while (true) {
        // Move left to right
        setIsMovingRight(true)
        await cycleControls.start({
          x: ["0%", "calc(100vw - 200px)"],
          transition: {
            duration: 4,
            ease: "easeInOut",
          },
        })

        // Pause at right
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Move right to left
        setIsMovingRight(false)
        await cycleControls.start({
          x: ["calc(100vw - 200px)", "0%"],
          transition: {
            duration: 4,
            ease: "easeInOut",
          },
        })

        // Pause at left
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    }

    if (isVisible) {
      animateCycle()
    }

    return () => {
      cycleControls.stop()
    }
  }, [cycleControls, isVisible])

  // Wheel rotation animation
  useEffect(() => {
    if (isVisible) {
      wheelControls.start({
        rotate: [0, 360],
        transition: {
          duration: 1,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        },
      })
    }

    return () => {
      wheelControls.stop()
    }
  }, [wheelControls, isVisible])

  // Rider pedaling animation
  useEffect(() => {
    if (isVisible) {
      riderControls.start({
        rotate: [0, 5, -5, 0],
        transition: {
          duration: 0.8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        },
      })
    }

    return () => {
      riderControls.stop()
    }
  }, [riderControls, isVisible])

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none"
    >
      {/* Background with gradient */}
      <div className="relative h-28 bg-gradient-to-r from-primary-main/90 via-primary-main/95 to-primary-main/90 backdrop-blur-sm shadow-2xl overflow-hidden">
        {/* Animated background pattern */}
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent bg-[length:200%_200%]"
        />

        {/* Moving cycle with rider */}
        <motion.div
          animate={cycleControls}
          className="absolute bottom-2 pointer-events-auto"
          style={{
            transform: isMovingRight ? "scaleX(1)" : "scaleX(-1)",
            transformOrigin: "center",
          }}
        >
          <div className="relative">
            {/* Cycle SVG */}
            <svg width="120" height="60" viewBox="0 0 120 60" className="drop-shadow-lg">
              {/* Bike Frame */}
              <g stroke="#2D3436" strokeWidth="2" fill="none">
                {/* Main frame triangle */}
                <path d="M25 45 L45 20 L70 45 Z" className="stroke-gray-800 dark:stroke-gray-200" />
                {/* Seat post */}
                <line x1="35" y1="32" x2="35" y2="20" className="stroke-gray-800 dark:stroke-gray-200" />
                {/* Handle bar post */}
                <line x1="45" y1="20" x2="50" y2="15" className="stroke-gray-800 dark:stroke-gray-200" />
                {/* Handle bars */}
                <line x1="47" y1="15" x2="53" y2="15" className="stroke-gray-800 dark:stroke-gray-200" />
                {/* Chain stay */}
                <line x1="45" y1="35" x2="70" y2="45" className="stroke-gray-800 dark:stroke-gray-200" />
                </g>

              {/* Front Wheel */}
              <motion.g animate={wheelControls}>
                <circle
                  cx="25"
                  cy="45"
                  r="12"
                  stroke="#2D3436"
                  strokeWidth="3"
                  fill="none"
                  className="stroke-gray-800 dark:stroke-gray-200"
                />
                {/* Wheel spokes */}
                <g stroke="#666" strokeWidth="1">
                  <line x1="25" y1="33" x2="25" y2="57" />
                  <line x1="13" y1="45" x2="37" y2="45" />
                  <line x1="16.5" y1="36.5" x2="33.5" y2="53.5" />
                  <line x1="33.5" y1="36.5" x2="16.5" y2="53.5" />
                </g>
              </motion.g>

              {/* Rear Wheel */}
              <motion.g animate={wheelControls}>
                <circle
                  cx="70"
                  cy="45"
                  r="12"
                  stroke="#2D3436"
                  strokeWidth="3"
                  fill="none"
                  className="stroke-gray-800 dark:stroke-gray-200"
                />
                {/* Wheel spokes */}
                <g stroke="#666" strokeWidth="1">
                  <line x1="70" y1="33" x2="70" y2="57" />
                  <line x1="58" y1="45" x2="82" y2="45" />
                  <line x1="61.5" y1="36.5" x2="78.5" y2="53.5" />
                  <line x1="78.5" y1="36.5" x2="61.5" y2="53.5" />
                </g>
              </motion.g>

              {/* Pedals */}
              <motion.g
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                style={{ transformOrigin: "45px 35px" }}
              >
                <circle cx="45" cy="35" r="3" fill="#666" />
                <rect x="42" y="28" width="6" height="3" rx="1" fill="#444" />
                <rect x="42" y="39" width="6" height="3" rx="1" fill="#444" />
              </motion.g>

              {/* Rider */}
              <motion.g animate={riderControls} style={{ transformOrigin: "40px 25px" }}>
                {/* Head */}
                <circle cx="40" cy="15" r="4" fill="#8B4513" stroke="#654321" strokeWidth="1" />
                {/* Body */}
                <ellipse cx="42" cy="25" rx="3" ry="8" fill="#4A90E2" stroke="#357ABD" strokeWidth="1" />
                {/* Arms */}
                <line x1="42" y1="20" x2="48" y2="18" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" />
                <line x1="48" y1="18" x2="50" y2="15" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" />
                {/* Legs */}
                <motion.g
                  animate={{
                    rotate: [0, 15, -15, 0],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  style={{ transformOrigin: "42px 30px" }}
                >
                  <line x1="42" y1="30" x2="44" y2="40" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" />
                  <line x1="44" y1="40" x2="42" y2="32" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" />
                </motion.g>
              </motion.g>

              {/* Seat */}
              <ellipse cx="35" cy="20" rx="4" ry="2" fill="#654321" />
            </svg>

            {/* Request Now Button */}
            <motion.button
              onClick={onRequestNow}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              whileHover={{
                scale: 1.1,
                boxShadow: "0 0 20px rgba(255, 215, 0, 0.6)",
              }}
              whileTap={{ scale: 0.95 }}
              className="absolute -top-8 -left-10 bg-secondary-main hover:bg-secondary-dark text-[#2D3436] px-4 py-2 rounded-full font-bold text-sm shadow-lg transition-all duration-300 flex items-center space-x-2 border-2 border-white"
            >
              <motion.div
                animate={
                  isHovered
                    ? {
                        rotate: [0, 360],
                        scale: [1, 1.2, 1],
                      }
                    : {}
                }
                transition={{ duration: 0.5 }}
              >
                <Zap className="h-4 w-4" />
              </motion.div>
              <span>Request Now</span>
              {price && (
                <motion.span
                  animate={{
                    color: ["#2D3436", "#8B4513", "#2D3436"],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="font-bold"
                >
                  ₹{price.toLocaleString()}
                </motion.span>
              )}
            </motion.button>

            {/* Floating sparkles */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.7,
                }}
                className="absolute text-secondary-main"
                style={{
                  left: `${20 + i * 30}px`,
                  top: "-10px",
                }}
              >
                <Star className="h-3 w-3" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Product info on the right */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white pointer-events-auto">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-right">
            <p className="text-sm font-medium opacity-90">Ready to ride?</p>
            <p className="text-xs opacity-75 max-w-32 truncate">{productName}</p>
          </motion.div>
        </div>

        {/* Speed lines effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                x: ["-100%", "100%"],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
              className="absolute h-0.5 bg-white/30"
              style={{
                top: `${20 + i * 10}%`,
                width: "20px",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
