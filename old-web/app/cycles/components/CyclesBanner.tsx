"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const CyclesBanner = () => {
    const [currentSlide, setCurrentSlide] = useState(0)

    const banners = [
        {
            id: 1,
            title: "Find Your Perfect Cycle",
            subtitle: "Discover premium bicycles for every adventure",
            badges: [
                { icon: "🚴‍♂️", text: "Mountain Bikes" },
                { icon: "🚴‍♀️", text: "Road Bikes" },
                { icon: "👶", text: "Kids Bikes" },
                { icon: "⚡", text: "Electric Bikes" }
            ]
        },
        {
            id: 2,
            title: "Premium Quality Guaranteed",
            subtitle: "Every bike comes with our quality assurance and warranty",
            badges: [
                { icon: "🛡️", text: "Warranty" },
                { icon: "⚙️", text: "Service" },
                { icon: "🏆", text: "Quality" },
                { icon: "🚚", text: "Free Delivery" }
            ]
        },
        {
            id: 3,
            title: "Adventure Awaits You",
            subtitle: "Explore new trails and create unforgettable memories",
            badges: [
                { icon: "🏔️", text: "Trail Ready" },
                { icon: "🌟", text: "Adventure" },
                { icon: "💪", text: "Durable" },
                { icon: "🎯", text: "Performance" }
            ]
        },
        {
            id: 4,
            title: "Eco-Friendly Transport",
            subtitle: "Join the green revolution with sustainable cycling",
            badges: [
                { icon: "🌱", text: "Eco Friendly" },
                { icon: "♻️", text: "Sustainable" },
                { icon: "💚", text: "Green" },
                { icon: "🌍", text: "Planet Care" }
            ]
        }
    ]

    // Auto-slide functionality
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length)
        }, 5000) // Change slide every 5 seconds

        return () => clearInterval(interval)
    }, [banners.length])

    return (
        <div className="relative h-64 sm:h-72 lg:h-80 overflow-hidden pt-20">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 300 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -300 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
                        <div className="text-center">
                            <motion.h1 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4"
                            >
                                {banners[currentSlide].title}
                            </motion.h1>
                            <motion.p 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                className="text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 opacity-70 max-w-2xl mx-auto"
                            >
                                {banners[currentSlide].subtitle}
                            </motion.p>
                            <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.6 }}
                                className="flex flex-wrap justify-center gap-2 sm:gap-3 text-xs sm:text-sm max-w-4xl mx-auto"
                            >
                                {banners[currentSlide].badges.map((badge, index) => (
                                    <motion.span
                                        key={index}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-gray-100 dark:bg-gray-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full whitespace-nowrap border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
                                    >
                                        {badge.icon} {badge.text}
                                    </motion.span>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentSlide 
                                ? 'bg-gray-900 dark:bg-white scale-125' 
                                : 'bg-gray-400 dark:bg-gray-500 hover:bg-gray-600 dark:hover:bg-gray-300'
                        }`}
                    />
                ))}
            </div>
        </div>
    )
}

export default CyclesBanner
