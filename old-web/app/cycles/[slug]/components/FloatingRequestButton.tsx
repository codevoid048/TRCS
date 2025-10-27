"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import RequestModal from "./RequestModal"
import type { Product } from "@/types/product"

interface FloatingRequestButtonProps {
  product: Product
}

export default function FloatingRequestButton({ product }: FloatingRequestButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
      >
        {/* Sparkle Effects */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              animate={{
                rotate: [0, 360],
                scale: [0.5, 1, 0.5],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.5,
              }}
              style={{
                top: `${Math.sin((i * 60 * Math.PI) / 180) * 40 + 50}%`,
                left: `${Math.cos((i * 60 * Math.PI) / 180) * 40 + 50}%`,
              }}
            >
              <Sparkles className="h-3 w-3 text-yellow-400" />
            </motion.div>
          ))}
        </div>

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
          onClick={() => setIsModalOpen(true)}
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
            <motion.div animate={{ rotate: isHovered ? 360 : 0 }} transition={{ duration: 0.5 }}>
              <FaWhatsapp className="h-6 w-6" />
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
              Request Now
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

      {/* Request Modal */}
      <RequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} product={product} />
    </>
  )
}
