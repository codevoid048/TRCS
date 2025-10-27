"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface TextAnimationProps {
  text: string
  className?: string
}

export function TypewriterText({ text, className = "" }: TextAnimationProps) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, 100)
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text])

  return (
    <div className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
        className="inline-block w-0.5 h-6 bg-current ml-1"
      />
    </div>
  )
}

export function FadeInWords({ text, className = "" }: TextAnimationProps) {
  const words = text.split(" ")

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className={className}>
      {words.map((word, index) => (
        <motion.span key={index} variants={wordVariants} className="inline-block mr-2">
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}

export function GlitchText({ text, className = "" }: TextAnimationProps) {
  return (
    <motion.div className={`relative ${className}`} whileHover="hover">
      <motion.span
        variants={{
          hover: {
            x: [0, -2, 2, 0],
            transition: { duration: 0.3, repeat: 2 },
          },
        }}
        className="relative z-10"
      >
        {text}
      </motion.span>

      <motion.span
        variants={{
          hover: {
            opacity: [0, 0.7, 0],
            x: [0, 2, -2, 0],
            transition: { duration: 0.3, repeat: 2 },
          },
        }}
        className="absolute top-0 left-0 text-red-500 z-0"
        style={{ clipPath: "inset(0 0 50% 0)" }}
      >
        {text}
      </motion.span>

      <motion.span
        variants={{
          hover: {
            opacity: [0, 0.7, 0],
            x: [0, -2, 2, 0],
            transition: { duration: 0.3, repeat: 2 },
          },
        }}
        className="absolute top-0 left-0 text-blue-500 z-0"
        style={{ clipPath: "inset(50% 0 0 0)" }}
      >
        {text}
      </motion.span>
    </motion.div>
  )
}

export function WaveText({ text, className = "" }: TextAnimationProps) {
  const letters = text.split("")

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1,
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: 2,
      },
    },
  }

  const letterVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 0.6,
        ease: "easeInOut",
      },
    },
  }

  return (
    <motion.div variants={containerVariants} animate="animate" className={className}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={{
            animate: {
              y: [0, -20, 0],
              transition: {
                duration: 0.6,
                ease: [0.42, 0, 0.58, 1], // cubic-bezier for "easeInOut"
              },
            },
          }}
          className="inline-block"
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  )
}
