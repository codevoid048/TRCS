"use client"

import { motion } from "framer-motion"
import { useMemo, useState, useEffect } from 'react'
import { ChevronDown, Play, Sparkles } from "lucide-react"
import { TypewriterText, FadeInWords } from "./animations/TextAnimations"
import { MagneticButton, PulseButton } from "./animations/InteractiveAnimations"
import axios from "axios"

interface HeroBanner {
  _id: string
  title: string
  imageUrl: string
  imageAlt: string
  metadata?: {
    [key: string]: any
  }
}

export default function Hero() {
  const [activeBanner, setActiveBanner] = useState<HeroBanner | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch active hero banner
  useEffect(() => {
    const fetchActiveBanner = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        const response = await axios.get(`${API_BASE_URL}/public/hero-banner/active`)
        
        if (response.status === 200 && response.data.data?.banner) {
          setActiveBanner(response.data.data.banner)
        }
      } catch (error) {
        console.log('No active banner found, using default')
      } finally {
        setIsLoading(false)
      }
    }

    fetchActiveBanner()
  }, [])

  const heroVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        staggerChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  // Get background image - use active banner or fallback to default
  const backgroundImage = activeBanner?.imageUrl || "/herosec.webp"
  const backgroundAlt = activeBanner?.imageAlt || "TRC Cycles Hero Background"

  return (
    <section id="home" className="relative min-h-screen h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <motion.div
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 bg-black/40 dark:bg-black/60"
        />
      </motion.div>

      {/* Floating Particles */}
      {useMemo(() =>
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => {
            const delay = Math.random() * 2;
            const duration = Math.random() * 3 + 2;
            const left = `${Math.random() * 100}%`;
            const top = `${Math.random() * 100}%`;
            const size = Math.random();
            return (
              <motion.div
                key={i}
                animate={{
                  y: [0, -100, 0],
                  x: [0, size * 100 - 50, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration,
                  repeat: Number.POSITIVE_INFINITY,
                  delay,
                  ease: "easeInOut",
                }}
                className="absolute w-2 h-2 bg-secondary-main/60 rounded-full"
                style={{
                  left,
                  top
                }}
              />
            );
          })}
        </div>
      , [])}

      {/* Hero Content */ }
        < motion.div
        variants = { heroVariants }
        initial = "hidden"
        animate = "visible"
        className = "relative z-10 text-center text-white px-4 max-w-4xl mx-auto"
        >
        {/* Animated Title */ }
        < motion.div variants = { itemVariants as any } className = "mb-6" >
        <motion.div
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-5xl md:text-7xl font-heading font-bold leading-tight"
        >
          <FadeInWords text="Find Your Perfect" className="block mb-2" />
          <motion.span
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="bg-gradient-to-r from-secondary-main via-primary-main to-secondary-main bg-[length:200%_100%] bg-clip-text text-transparent"
          >
            Ride
          </motion.span>
        </motion.div>
        </motion.div>

        {/* Animated Subtitle */ }
  <motion.div variants={itemVariants as any} className="mb-8">
    <TypewriterText
      text="Discover premium cycles for every adventure, every rider, every journey"
      className="text-xl md:text-2xl text-gray-200 font-body"
    />
  </motion.div>

  {/* Interactive Buttons */ }
  <motion.div variants={itemVariants as any} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
    <MagneticButton className="bg-gradient-to-r from-primary-main to-secondary-main hover:bg-primary-dark text-white px-8 py-4 rounded-full text-lg font-semibold font-accent transition-all duration-300 shadow-lg hover:shadow-xl">
      <motion.a href="/cycles" className="flex items-center space-x-2" whileHover={{ x: 5 }}>
        <Sparkles className="h-5 w-5" />
        <span>Browse Cycles</span>
      </motion.a>
    </MagneticButton>

    <PulseButton className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-main px-8 py-4 rounded-full text-lg font-semibold font-accent transition-all duration-300">
      <motion.a href="/about" className="flex items-center space-x-2" whileHover={{ x: 5 }}>
        <Play className="h-5 w-5" />
        <span>About Us</span>
      </motion.a>
    </PulseButton>
  </motion.div>

  {/* Stats Animation */ }
  <motion.div variants={itemVariants as any} className="mt-12 grid grid-cols-3 gap-8 max-w-md mx-auto">
    {[
      { number: "500+", label: "Cycles" },
      { number: "10K+", label: "Happy Customers" },
      { number: "45+", label: "Years Experience" },
    ].map((stat, index) => (
      <motion.div
        key={stat.label}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          delay: 1.5 + index * 0.2,
          type: "spring",
          stiffness: 200,
          damping: 10,
        }}
        className="text-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: index * 0.5,
          }}
          className="text-2xl font-heading font-bold text-secondary-main"
        >
          {stat.number}
        </motion.div>
        <div className="text-sm font-body text-gray-300">{stat.label}</div>
      </motion.div>
    ))}
  </motion.div>
      </motion.div >

      {/* Animated Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{
            y: [0, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="text-white cursor-pointer"
          onClick={() => {
            document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" })
          }}
        >
          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm font-body">Scroll to explore</span>
            <ChevronDown className="h-6 w-6" />
          </div>
        </motion.div>
      </motion.div>

    </section >
  )
}
