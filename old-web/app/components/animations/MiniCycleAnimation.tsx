"use client"

import { motion } from "framer-motion"
import { useState } from "react"

interface MiniCycleAnimationProps {
  size?: "sm" | "md" | "lg"
  color?: string
  showRider?: boolean
  className?: string
}

export default function MiniCycleAnimation({
  size = "md",
  color = "#8B4513",
  showRider = true,
  className = "",
}: MiniCycleAnimationProps) {
  const [isMoving, setIsMoving] = useState(true)

  const sizeMap = {
    sm: { width: 60, height: 30, scale: 0.5 },
    md: { width: 80, height: 40, scale: 0.7 },
    lg: { width: 120, height: 60, scale: 1 },
  }

  const currentSize = sizeMap[size]

  return (
    <div className={`inline-block ${className}`}>
      <motion.div
        animate={
          isMoving
            ? {
                x: [0, 20, 0],
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <svg
          width={currentSize.width}
          height={currentSize.height}
          viewBox="0 0 120 60"
          className="drop-shadow-sm"
          style={{ transform: `scale(${currentSize.scale})` }}
        >
          {/* Bike Frame */}
          <g stroke={color} strokeWidth="2" fill="none">
            <path d="M25 45 L45 20 L70 45 Z" />
            <line x1="35" y1="32" x2="35" y2="20" />
            <line x1="45" y1="20" x2="50" y2="15" />
            <line x1="50" y1="15" x2="53" y2="15" />
            <line x1="45" y1="35" x2="70" y2="45" />
          </g>

          {/* Wheels with rotation */}
          <motion.g
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            style={{ transformOrigin: "25px 45px" }}
          >
            <circle cx="25" cy="45" r="12" stroke={color} strokeWidth="2" fill="none" />
            <g stroke={color} strokeWidth="1" opacity="0.6">
              <line x1="25" y1="33" x2="25" y2="57" />
              <line x1="13" y1="45" x2="37" y2="45" />
            </g>
          </motion.g>

          <motion.g
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            style={{ transformOrigin: "70px 45px" }}
          >
            <circle cx="70" cy="45" r="12" stroke={color} strokeWidth="2" fill="none" />
            <g stroke={color} strokeWidth="1" opacity="0.6">
              <line x1="70" y1="33" x2="70" y2="57" />
              <line x1="58" y1="45" x2="82" y2="45" />
            </g>
          </motion.g>

          {/* Rider (if enabled) */}
          {showRider && (
            <motion.g
              animate={{
                rotate: [0, 2, -2, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              style={{ transformOrigin: "40px 25px" }}
            >
              <circle cx="40" cy="15" r="3" fill={color} />
              <ellipse cx="42" cy="25" rx="2" ry="6" fill={color} />
              <line x1="42" y1="20" x2="48" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" />
              <line x1="42" y1="28" x2="44" y2="35" stroke={color} strokeWidth="2" strokeLinecap="round" />
            </motion.g>
          )}

          {/* Seat */}
          <ellipse cx="35" cy="20" rx="3" ry="1.5" fill={color} />
        </svg>
      </motion.div>
    </div>
  )
}
