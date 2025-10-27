"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Phone, X, MessagesSquare } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"

interface FloatingContactButtonProps {
  showScrollUp?: boolean
}

export default function FloatingContactButton({ showScrollUp = false }: FloatingContactButtonProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleCallClick = () => {
    window.open('tel:+918688432642', '_self') // Replace with your actual phone number
  }

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hi! I'm interested in your cycles. Can you help me?")
    window.open(`https://wa.me/918688432642?text=${message}`, '_blank') // Replace with your actual WhatsApp number
  }

  if (!isMounted) return null

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsPopupOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Contact Popup */}
      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={`fixed right-4 sm:right-6 z-50 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 min-w-[280px] ${showScrollUp ? 'bottom-32' : 'bottom-24'}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Contact Us
              </h3>
              <button
                onClick={() => setIsPopupOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            {/* Contact Options */}
            <div className="space-y-3">
              {/* Call Option */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCallClick}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/30 dark:hover:to-blue-700/30 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-blue-900 dark:text-blue-100">Call Us</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">+91 86884 32642</p>
                </div>
              </motion.button>

              {/* WhatsApp Option */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleWhatsAppClick}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700 hover:from-green-100 hover:to-green-200 dark:hover:from-green-800/30 dark:hover:to-green-700/30 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                  <FaWhatsapp className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-green-900 dark:text-green-100">WhatsApp</p>
                  <p className="text-sm text-green-700 dark:text-green-300">Chat with us instantly</p>
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Button - Always visible but moves up when scroll button appears */}
      <motion.div
        className="fixed right-4 sm:right-6 z-30"
        animate={{
          bottom: showScrollUp ? '5.5rem' : '1rem' // Move up when scroll button is visible
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.button
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsPopupOpen(true)}
          className="w-14 h-14 bg-gradient-to-r from-primary-main to-secondary-main hover:shadow-3xl text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 border-2 border-white dark:border-gray-800 relative"
          title="Contact us"
        >
          <MessagesSquare className="h-6 w-6" />
          
          {/* Pulse Animation */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-main to-secondary-main animate-ping opacity-20" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-main to-secondary-main animate-pulse opacity-30" />
        </motion.button>
      </motion.div>
    </>
  )
}