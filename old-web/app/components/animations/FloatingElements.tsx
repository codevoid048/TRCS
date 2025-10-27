"use client"
import { useMemo } from "react"
import { motion } from "framer-motion"
import { Bike, Star, Heart, Zap } from "lucide-react"

export default function FloatingElements() {
  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  const sparkleVariants = {
    animate: {
      scale: [0, 1, 0],
      rotate: [0, 180, 360],
      opacity: [0, 1, 0],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
        staggerChildren: 0.2,
      },
    },
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating Bikes */}
      <motion.div
        variants={floatingVariants as any}
        animate="animate"
        className="absolute top-20 left-10 text-primary-main/20"
        style={{ animationDelay: "0s" }}
      >
        <Bike className="h-12 w-12" />
      </motion.div>

      <motion.div
        variants={floatingVariants as any}
        animate="animate"
        className="absolute top-40 right-20 text-secondary-main/20"
        style={{ animationDelay: "1s" }}
      >
        <Bike className="h-8 w-8" />
      </motion.div>

      <motion.div
        variants={floatingVariants as any}
        animate="animate"
        className="absolute bottom-40 left-20 text-primary-main/20"
        style={{ animationDelay: "2s" }}
      >
        <Bike className="h-10 w-10" />
      </motion.div>

      {/* Sparkle Effects */}
      {useMemo(() =>
        [...Array(6)].map((_, i) => {
          const top = `${Math.random() * 100}%`;
          const left = `${Math.random() * 100}%`;
          return (
            <motion.div
              key={i}
              variants={sparkleVariants as any}
              animate="animate"
              className="absolute text-secondary-main/30"
              style={{
                top,
                left,
                animationDelay: `${i * 0.5}s`,
              }}
            >
              <Star className="h-4 w-4" />
            </motion.div>
          );
        })
      , [])}

      {/* Floating Hearts */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -100],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.8,
            ease: "easeOut",
          }}
          className="absolute text-red-400/20"
          style={{
            bottom: "10%",
            left: `${20 + i * 20}%`,
          }}
        >
          <Heart className="h-6 w-6" />
        </motion.div>
      ))}

      {/* Lightning Bolts */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.2, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 2,
            ease: "easeInOut",
          }}
          className="absolute text-yellow-400/30"
          style={{
            top: `${30 + i * 20}%`,
            right: `${10 + i * 15}%`,
          }}
        >
          <Zap className="h-8 w-8" />
        </motion.div>
      ))}
    </div>
  )
}
