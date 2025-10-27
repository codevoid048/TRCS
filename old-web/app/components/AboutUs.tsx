"use client"

import { motion } from "framer-motion"
import { Award, Users, Target, Shield, Heart, Lightbulb } from "lucide-react"
import { useEffect, useState, useRef } from "react"

const features = [
  {
    icon: Award,
    title: "Premium Quality",
    description: "We source only the finest cycles from trusted manufacturers worldwide",
  },
  {
    icon: Users,
    title: "Expert Team",
    description: "Our knowledgeable staff helps you find the perfect cycle for your needs",
  },
  {
    icon: Target,
    title: "Customer First",
    description: "We prioritize our customers' needs and satisfaction above everything else",
  },
  {
    icon: Lightbulb,
    title: "Excellence",
    description: "We strive for excellence in every aspect of our business, from product selection to customer service",
  },
]

const values = [
  {
    icon: Heart,
    title: "Family Values",
    description: "Built on honesty, service, and trust - the foundation of our 45-year legacy",
  },
  {
    icon: Shield,
    title: "Quality Promise",
    description: "Every bicycle sold, serviced, or repaired carries our promise of trust, quality, and care",
  },
]

// Add image carousel data
const carouselImages = [
  {
    src: "/about-0.webp",
    alt: "CycleStore team and showroom",
    title: "Our Expert Team"
  },
  {
    src: "/about-2.webp",
    alt: "Modern cycle showroom",
    title: "Premium Showroom"
  },
  {
    src: "/about-1.webp",
    alt: "Professional cycle service",
    title: "Expert Service"
  },
  {
    src: "/about-6.webp",
    alt: "Fast delivery service",
    title: "Quick Delivery"
  },
  {
    src: "/about-4.webp",
    alt: "Professional workshop",
    title: "Quality Workshop"
  }
]

export default function AboutUs() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-scroll functionality with hover pause
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
        )
      }, 3000) // Change image every 3 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPaused])

  const handleMouseEnter = () => setIsPaused(true)
  const handleMouseLeave = () => setIsPaused(false)

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-hero text-[#2D3436] dark:text-white mb-4 transition-colors duration-300">
            About The Raja Cycle Stores
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors duration-300">
            Pedaling Dreams Since 1982 — Your trusted family destination for premium bicycles and exceptional service in Vijayawada
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Side - Story */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-bold text-[#2D3436] dark:text-white mb-6 transition-colors duration-300">
              Our Story
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-300">
              For more than four decades, The Raja Cycle Stores has been more than just a bicycle shop - it's been a part of the growing heartbeat of Vijayawada. Established 45 years ago with a simple vision of bringing quality bicycles to our community, we've proudly grown into a trusted destination for riders of all ages.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-300">
              Built on strong family values of honesty, service, and trust, our journey began with one small shop and a big dream. Over the years, we've served generations of families - from grandparents buying their first bicycles for their children, to today's riders exploring new-age cycling.
            </p>
            {/* <p className="text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-300">
              What makes us special is the perfect blend of traditional service with modern innovation. Along with our warm, personalized approach, we offer trusted brands like Firefox Bikes, Suncross, Hercules/BSA, Hero Cycles, Allwyn Bikes, and more. Our expert service team ensures your ride stays smooth and reliable - from basic tune-ups to complete overhauls.
            </p> */}
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-300">
              As a family-run business, we take pride in growing alongside our customers. Every bicycle sold, serviced, or repaired carries with it a piece of our legacy - a promise of trust, quality, and care.
            </p>

            <div className="flex items-center space-x-8 pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-primary-main to-secondary-main bg-clip-text text-transparent">45+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Years Since 1982</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-primary-main to-secondary-main bg-clip-text text-transparent">500+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Premium Cycles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-primary-main to-secondary-main bg-clip-text text-transparent">10K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Happy Families</div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Stunning Image Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Main Carousel Container */}
            <div 
              className="relative rounded-2xl overflow-hidden shadow-2xl group"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* Image Container with Smooth Transitions */}
              <div className="relative h-96 w-full overflow-hidden">
                {carouselImages.map((image, index) => (
                  <motion.div
                    key={index}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ 
                      opacity: index === currentImageIndex ? 1 : 0,
                      scale: index === currentImageIndex ? 1 : 1.1,
                      rotateY: index === currentImageIndex ? 0 : 5
                    }}
                    transition={{ 
                      duration: 0.8, 
                      ease: "easeInOut",
                      opacity: { duration: 0.6 },
                      scale: { duration: 0.8 }
                    }}
                  >
                    <img 
                      src={image.src} 
                      alt={image.alt} 
                      className="w-full h-full object-cover"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
                    
                    {/* Image Title Overlay */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: index === currentImageIndex ? 1 : 0,
                        y: index === currentImageIndex ? 0 : 20
                      }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="absolute bottom-6 left-6 text-white"
                    >
                      <h4 className="text-xl font-bold mb-1">{image.title}</h4>
                      <div className="w-12 h-0.5 bg-white rounded-full"></div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              {/* Navigation Dots */}
              <div className="absolute bottom-4 right-4 flex space-x-2">
                {carouselImages.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'bg-white scale-125' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>

              {/* Play/Pause Indicator */}
              {/* <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isPaused ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2"
              >
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </motion.div> */}

              {/* Hover Effect Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300"
              />
            </div>

            {/* Floating Card with Enhanced Animation */}
            <motion.div
              initial={{ opacity: 0, y: 20, rotate: -5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 100 }}
              viewport={{ once: true }}
              className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-xs border border-gray-100 dark:border-gray-700 transition-colors duration-300 backdrop-blur-sm"
              whileHover={{ 
                scale: 1.05, 
                rotate: 2,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              }}
            >
              <div className="flex items-center space-x-3">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-r from-primary-main to-secondary-main rounded-full flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Award className="h-6 w-6 text-white" />
                </motion.div>
                <div>
                  <div className="font-bold text-[#2D3436] dark:text-white transition-colors duration-300">
                    Trusted Legacy
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                    Since 1982
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary-main to-secondary-main rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-[#2D3436] dark:text-white mb-3 transition-colors duration-300">
                  {feature.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100 dark:border-gray-700 transition-colors duration-300"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-hero text-[#2D3436] dark:text-white mb-4 transition-colors duration-300">
              Our Values
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
              These core principles guide everything we do and shape our commitment to excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-main to-secondary-main rounded-full flex items-center justify-center flex-shrink-0">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#2D3436] dark:text-white mb-2 transition-colors duration-300">
                      {value.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}