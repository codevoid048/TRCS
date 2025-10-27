"use client"

import { motion } from "framer-motion"
import { Award, Users, Target, Shield, Star, Heart, Bike, MapPin, Phone, Mail, Clock, Wrench, Zap, Globe, Lightbulb, CheckCircle } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import ParticleBackground from "../components/ParticleBackground"

// Image Configuration for Store Collage
// Easy to update: Just change the path in the desired index/position
const storeImages = {
  // Desktop Layout - Top row images (4 images, left to right)
  topRow: [
    "/about-1.webp",    // Index 0 - Top left
    "/about-2.webp",    // Index 1 - Top center-left
    "/about-3.webp",    // Index 2 - Top center-right
    "/about-4.webp"     // Index 3 - Top right
  ],

  // Desktop Layout - Middle row side images
  middleLeft: "/about-5.webp",           // Left side tall image
  centerStore: "/about-6.webp",         // Main store sign center image (most prominent)
  middleRight: "/about-7.webp",     // Right side tall image

  // Desktop Layout - Bottom row images (3 images, left to right)
  bottomRow: [
    "/about-8.webp", // Index 0 - Bottom left
    "/about-9.webp", // Index 1 - Bottom center (no rotation)
    "/about-10.webp"  // Index 2 - Bottom right
  ],

  // Mobile Layout - Gallery images (8 images total)
  mobileGallery: [
    // First row (4 images)
    "/about-1.webp", // Index 0 - Mobile top left
    "/about-2.webp", // Index 1 - Mobile top right
    "/about-3.webp", // Index 2 - Mobile second left
    "/about-4.webp", // Index 3 - Mobile second right
    // Second row (4 images) 
    "/about-5.webp",     // Index 4 - Mobile third left
    "/about-8.webp",     // Index 5 - Mobile third right
    "/about-9.webp",     // Index 6 - Mobile bottom left
    "/about-10.webp"      // Index 7 - Mobile bottom right
  ],

  // Other section images
  storyImage: "/about-8.webp",
  targetImage: "/cycle-team.webp"
}

export default function AboutPageClient() {
  const router = useRouter()
  
  const handleGetDirections = () => {
    router.push('/contact')
  }

  const handleCallUs = () => {
    window.location.href = 'tel:+918688432642'
  }

  const stats = [
    { number: "45+", label: "Years in Business", icon: Award },
    { number: "4.5/5", label: "Best Rated in Vijayawada", icon: Star },
    { number: "10K+", label: "Happy Customers", icon: Users }
  ]

  const features = [
    {
      icon: Shield,
      title: "Premium Quality",
      description: "We ensure every cycle meets our high standards of quality and durability for your safety and satisfaction."
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Our experienced team provides professional guidance to help you find the perfect cycle for your needs."
    },
    {
      icon: Heart,
      title: "Fast Delivery",
      description: "Quick and reliable delivery service to get your new cycle to you as soon as possible."
    },
    {
      icon: Award,
      title: "Money-back Guarantee",
      description: "We stand behind our products with a comprehensive money-back guarantee for your peace of mind."
    }
  ]

  const reviews = [
    {
      name: "Ravi Kumar",
      rating: 5,
      comment: "Excellent service and quality cycles. The staff helped me choose the perfect mountain bike for my adventures!"
    },
    {
      name: "Priya Sharma",
      rating: 5,
      comment: "Amazing experience! Great variety of cycles and very knowledgeable staff. Highly recommended for all cycling needs."
    },
    {
      name: "Amit Patel",
      rating: 5,
      comment: "Best cycle store in Vijayawada! Quality products, fair prices, and outstanding customer service."
    },
    {
      name: "Sneha Reddy",
      rating: 5,
      comment: "Bought a cycle for my daughter and the service was exceptional. Very satisfied with the purchase!"
    },
    {
      name: "Rajesh Singh",
      rating: 5,
      comment: "Professional service and great after-sales support. They really care about their customers."
    },
    {
      name: "Deepika Rao",
      rating: 5,
      comment: "Wide range of cycles and accessories. The team helped me find exactly what I was looking for."
    }
  ]

  const values = [
    {
      icon: Target,
      title: "Customer First",
      description: "We prioritize our customers' needs and satisfaction above everything else, ensuring every interaction exceeds expectations."
    },
    {
      icon: Heart,
      title: "Quality Focus",
      description: "Every cycle and accessory we offer undergoes rigorous quality checks to ensure reliability and performance."
    },
    {
      icon: Globe,
      title: "Innovation",
      description: "We continuously innovate and adapt to bring you the latest cycling technology and trends."
    },
    {
      icon: Lightbulb,
      title: "Excellence",
      description: "We strive for excellence in every aspect of our business, from product selection to customer service."
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <>
      {/* Golden Particle Background */}
      <ParticleBackground 
        particleCount={100}
        particleColor={0xFFD700}
        particleOpacity={1.0}
        animationSpeed={0.001}
        particleSize={0.05}
        className="fixed inset-0 z-0"
      />
      
      <div className="relative z-10 min-h-screen bg-gradient-to-br from-slate-50/90 via-blue-50/90 to-indigo-100/90 dark:from-gray-900/90 dark:via-gray-800/90 dark:to-gray-900/90">
      {/* 1. Collage Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-indigo-600/10 dark:from-blue-400/5 dark:via-purple-400/5 dark:to-indigo-400/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-7xl font-bold bg-gradient-to-r from-primary-main to-secondary-main bg-clip-text text-transparent mb-6 leading-tight">
              About CycleStore
            </h1>

            <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Your trusted partner in cycling excellence for over 45 years. Discover premium bicycles and experience unmatched service quality.
            </p>
          </motion.div>

          {/* Store Collage Layout - Similar to the reference image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative max-w-6xl mx-auto"
          >
            {/* Mobile Layout */}
            <div className="block md:hidden">
              <div className="grid grid-cols-2 gap-3 mb-6">
                {storeImages.mobileGallery.slice(0, 4).map((imagePath, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="relative h-32 rounded-xl overflow-hidden shadow-lg"
                  >
                    <Image
                      src={imagePath}
                      alt={`Cycle Store Gallery ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                ))}
              </div>

              {/* Main Store Sign - Mobile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="relative h-48 rounded-2xl overflow-hidden shadow-2xl mb-6"
              >
                <Image
                  src={storeImages.centerStore}
                  alt="The Raja Cycle Stores Main Store Sign"
                  fill
                  className="object-cover"
                />
                {/* <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center">
                  <div className="p-4 text-center">
                    <h3 className="text-xl font-bold text-white mb-1">THE RAJA CYCLE STORES</h3>
                    <p className="text-sm text-white/90">Premium Cycling Destination</p>
                  </div>
                </div> */}
              </motion.div>

              <div className="grid grid-cols-2 gap-3">
                {storeImages.mobileGallery.slice(4, 8).map((imagePath, index) => (
                  <motion.div
                    key={index + 4}
                    whileHover={{ scale: 1.02 }}
                    className="relative h-32 rounded-xl overflow-hidden shadow-lg"
                  >
                    <Image
                      src={imagePath}
                      alt={`Cycle Store Gallery ${index + 5}`}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Desktop Collage Layout - Matching reference image */}
            <div className="hidden md:block">
              <div className="relative">
                {/* Top Row - 4 images */}
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {storeImages.topRow.map((imagePath, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.03, rotate: 1 }}
                      transition={{ duration: 0.3 }}
                      className="relative h-40 rounded-2xl overflow-hidden shadow-xl transform hover:shadow-2xl"
                      style={{
                        transform: `rotate(${index % 2 === 0 ? '1deg' : '-1deg'})`
                      }}
                    >
                      <Image
                        src={imagePath}
                        alt={`Cycle Store Interior ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </motion.div>
                  ))}
                </div>

                {/* Middle Row - Side images + Center store sign */}
                <div className="grid grid-cols-9 gap-4 mb-4 items-stretch">
                  {/* Left side image - Taller and narrower */}
                  <motion.div
                    whileHover={{ scale: 1.03, rotate: -2 }}
                    transition={{ duration: 0.3 }}
                    className="col-span-2 relative h-72 rounded-2xl overflow-hidden shadow-xl transform -rotate-1"
                  >
                    <Image
                      src={storeImages.middleLeft}
                      alt="Bicycle Collection Left"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </motion.div>

                  {/* Center - Main Store Sign (THE RAJA CYCLE STORES) - Larger */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="col-span-5 relative h-80 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-900 to-purple-900"
                  >
                    <Image
                      src={storeImages.centerStore}
                      alt="The Raja Cycle Stores Main Store Sign"
                      fill
                      className="object-cover"
                    />
                    {/* Store Sign Overlay */}
                    {/* <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-center justify-center">
                      <div className="text-center p-8">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.8, delay: 1.2 }}
                          className="relative"
                        >
                          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-3 tracking-wider">
                            THE RAJA
                          </h2>
                          <div className="flex items-center justify-center mb-3">
                            <Bike className="h-10 w-10 text-yellow-400 mr-4" />
                            <h2 className="text-5xl lg:text-6xl font-bold text-white tracking-wider">
                              CYCLE
                            </h2>
                            <Bike className="h-10 w-10 text-yellow-400 ml-4" />
                          </div>
                          <h2 className="text-5xl lg:text-6xl font-bold text-white tracking-wider">
                            STORES
                          </h2>
                          <div className="mt-4 w-40 h-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full"></div>
                          <p className="text-xl text-white/90 mt-4 font-medium">
                            Premium Cycling Since 45+ Years
                          </p>
                        </motion.div>
                      </div>
                    </div> */}
                  </motion.div>

                  {/* Right side image - Taller and narrower */}
                  <motion.div
                    whileHover={{ scale: 1.03, rotate: 2 }}
                    transition={{ duration: 0.3 }}
                    className="col-span-2 relative h-72 rounded-2xl overflow-hidden shadow-xl transform rotate-1"
                  >
                    <Image
                      src={storeImages.middleRight}
                      alt="Bicycle Collection Right"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </motion.div>
                </div>

                {/* Bottom Row - 3 images */}
                <div className="grid grid-cols-3 gap-6">
                  {storeImages.bottomRow.map((imagePath, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.03, rotate: index === 1 ? 0 : index % 2 === 0 ? -1 : 1 }}
                      transition={{ duration: 0.3 }}
                      className="relative h-44 rounded-2xl overflow-hidden shadow-xl transform"
                      style={{
                        transform: `rotate(${index === 1 ? '0deg' : index % 2 === 0 ? '-1deg' : '1deg'})`
                      }}
                    >
                      <Image
                        src={imagePath}
                        alt={`Store Gallery ${index + 7}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. About Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Our Story 🛞✨</h2>
              <div className="text-lg space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>
                  For more than four decades, The Raja Cycle Stores has been more than just a bicycle shop - it's been a part of the growing heartbeat of Vijayawada. Established 45 years ago with a simple vision of bringing quality bicycles to our community, we've proudly grown into a trusted destination for riders of all ages.
                </p>
                <p>
                  Built on strong family values of honesty, service, and trust, our journey began with one small shop and a big dream. Over the years, we've served generations of families - from grandparents buying their first bicycles for their children, to today's riders exploring new-age cycling.
                </p>
                <p>
                  What makes us special is the perfect blend of traditional service with modern innovation. Along with our warm, personalized approach, we offer a wide range of leading bicycle brands including premium lifestyle, commuter, kids', mountain, and e-bikes. Our store features trusted names like Firefox Bikes, Suncross, Hercules/BSA, Hero Cycles, Allwyn Bikes, and more.
                </p>
                <p>
                  As a family-run business, we take pride in growing alongside our customers. Every bicycle sold, serviced, or repaired carries with it a piece of our legacy - a promise of trust, quality, and care.
                </p>
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border-l-4 border-blue-500">
                  <p className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                    🚲 The Raja Cycle Stores - Pedaling Dreams Since 1982
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={storeImages.storyImage}
                  alt="Our Story - The Raja Cycle Stores"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Promise Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={storeImages.targetImage}
                  alt="Our Target - Customer Service"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Our Promise 🚲✨</h2>
              <div className="space-y-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>
                  At The Raja Cycle Stores, our promise is simple - to keep generations riding with trust, quality, and care.
                </p>
                <p>
                  For 45 years, we've proudly served the people of Vijayawada, offering top bicycle brands, expert service, and warm, family-driven support. Whether it's a child's first bike or a high-performance ride, we're here to make every journey special.
                </p>
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border-l-4 border-blue-500">
                  <p className="text-xl font-semibold text-blue-800 dark:text-blue-300">
                    🚴‍♂️ Ride with Trust. Ride with Raja.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Progress Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Stats */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Our Proven
            </h2>
            <h3 className="text-3xl font-normal text-gray-600 dark:text-gray-400 mb-12">
              Success Stories
            </h3>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-3 md:grid-cols-3 gap-12 mb-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="text-3xl md:text-7xl font-bold text-amber-500 mb-2">{stat.number}</div>
                <div className="text-md text-gray-600 dark:text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Customer Reviews - Two Rows with Infinite Sliding */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* First Row - Left to Right Sliding */}
            <div className="relative overflow-hidden">
              <motion.div
                className="flex space-x-6"
                animate={{ x: [0, -1000] }}
                transition={{
                  duration: 30,
                  repeat: Infinity,
                  ease: "linear"
                }}
                onHoverStart={() => { }}
                onHoverEnd={() => { }}
              >
                {[...reviews, ...reviews].map((review, index) => (
                  <motion.div
                    key={index}
                    className="min-w-[300px] bg-gray-100 dark:bg-slate-800 rounded-2xl p-6 border dark:border-slate-700"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center mb-4">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                      "{review.comment}"
                    </p>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-300 dark:bg-slate-600 rounded-full mr-3 flex items-center justify-center">
                        <Users className="h-4 w-4 text-gray-400" />
                      </div>
                      <div>
                        <div className="text-gray-900 dark:text-gray-100 font-medium text-sm">{review.name}</div>
                        <div className="text-gray-600 dark:text-gray-400 text-xs"><i>Customer</i></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Second Row - Right to Left Sliding */}
            <div className="relative overflow-hidden">
              <motion.div
                className="flex space-x-6"
                animate={{ x: [-1000, 0] }}
                transition={{
                  duration: 30,
                  repeat: Infinity,
                  ease: "linear"
                }}
                onHoverStart={() => { }}
                onHoverEnd={() => { }}
              >
                {[...reviews, ...reviews].map((review, index) => (
                  <motion.div
                    key={index}
                    className="min-w-[300px] bg-gray-100 dark:bg-slate-800 rounded-2xl p-6 border dark:border-slate-700"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center mb-4">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                      "{review.comment}"
                    </p>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-300 dark:bg-slate-600 rounded-full mr-3 flex items-center justify-center">
                        <Users className="h-4 w-4 text-gray-400" />
                      </div>
                      <div>
                        <div className="text-gray-900 dark:text-gray-100 font-medium text-sm">{review.name}</div>
                        <div className="text-gray-600 dark:text-gray-400 text-xs"><i>Customer</i></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. Our Promise & Values Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Our Promise & Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              The core principles that define our commitment to excellence
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {/* Premium Quality */}
            <motion.div
              variants={itemVariants}
              className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary-main to-secondary-main rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Premium Quality</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">We ensure every cycle meets our high standards of quality and durability for your safety and satisfaction.</p>
            </motion.div>

            {/* Expert Team */}
            <motion.div
              variants={itemVariants}
              className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary-main to-secondary-main rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Expert Team</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Our experienced team provides professional guidance to help you find the perfect cycle for your needs.</p>
            </motion.div>

            {/* Customer First */}
            <motion.div
              variants={itemVariants}
              className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary-main to-secondary-main rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Customer First</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">We prioritize our customers' needs and satisfaction above everything else, ensuring every interaction exceeds expectations.</p>
            </motion.div>

            {/* Excellence */}
            <motion.div
              variants={itemVariants}
              className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary-main to-secondary-main rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Excellence</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">We strive for excellence in every aspect of our business, from product selection to customer service.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 7. Visit Store Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20"></div>
        <div className="absolute top-10 right-10 w-80 h-80 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-400/10 dark:bg-purple-400/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            {/* <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Store Location
            </motion.div> */}
            
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-6">
              Reach Out to Us
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Our expert team is ready to help you find the perfect bicycle
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <motion.div 
              variants={itemVariants} 
              className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300/50 dark:hover:border-blue-500/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-400/5 dark:to-purple-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  Address
                </h3>
                
                <div className="space-y-2">
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                    29-21-34, Beside Vins Hospital
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Eluru Rd, Near Vijaya Talkies
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Vijayawada, AP 520002
                  </p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <span className="inline-flex items-center text-xs text-blue-600 dark:text-blue-400 font-medium">
                    <MapPin className="h-3 w-3 mr-1" />
                    Get Directions
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants} 
              className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 dark:border-gray-700/50 hover:border-green-300/50 dark:hover:border-green-500/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 dark:from-green-400/5 dark:to-emerald-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                  Phone
                </h3>
                
                <p className="text-gray-700 dark:text-gray-300 text-lg font-semibold mb-2">
                  +91 8688432642
                </p>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Call us for inquiries and support
                </p>
                
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <span className="inline-flex items-center text-xs text-green-600 dark:text-green-400 font-medium">
                    <Phone className="h-3 w-3 mr-1" />
                    Call Now
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants} 
              className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 dark:border-gray-700/50 hover:border-purple-300/50 dark:hover:border-purple-500/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 dark:from-purple-400/5 dark:to-pink-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500 rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                  Email
                </h3>
                
                <p className="text-gray-700 dark:text-gray-300 text-sm font-medium mb-2 break-all">
                  therajacyclestores@gmail.com
                </p>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Send us your questions anytime
                </p>
                
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <span className="inline-flex items-center text-xs text-purple-600 dark:text-purple-400 font-medium">
                    <Mail className="h-3 w-3 mr-1" />
                    Send Email
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants} 
              className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 dark:border-gray-700/50 hover:border-orange-300/50 dark:hover:border-orange-500/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 dark:from-orange-400/5 dark:to-red-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500 rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                  Store Hours
                </h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Mon-Sat</span>
                    <span className="text-gray-800 dark:text-gray-200 text-sm font-medium">10:00 AM - 9:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Sunday</span>
                    <span className="text-gray-800 dark:text-gray-200 text-sm font-medium">10:00 AM - 2:30 PM</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <span className="inline-flex items-center text-xs text-orange-600 dark:text-orange-400 font-medium">
                    <Clock className="h-3 w-3 mr-1" />
                    Open Today
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-2xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Find Your Perfect Bicycle?
              </h3>
              <p className="text-blue-100 dark:text-blue-200 mb-6 max-w-2xl mx-auto">
                Visit our store today and let our expert team help you choose from our premium collection of bicycles and accessories.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGetDirections}
                  className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Directions
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCallUs}
                  className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
                >
                  Call Us Now
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
    </>
  )
}
