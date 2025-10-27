"use client"

import { motion } from "framer-motion"
import { X, Play, Sparkles, ChevronDown } from "lucide-react"
import Image from "next/image"

interface HeroBanner {
  _id: string
  title: string
  imageUrl: string
  imageAlt: string
  isActive: boolean
  createdBy: {
    _id: string
    email: string
  }
  metadata: {
    originalFilename: string
    fileSize: number
    mimeType: string
    campaign?: string
    [key: string]: any
  }
  createdAt: string
  updatedAt: string
}

interface BannerPreviewProps {
  banner: HeroBanner
  onClose: () => void
}

export default function BannerPreview({ banner, onClose }: BannerPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white rounded-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white sticky top-0 z-[60] rounded-t-xl">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Banner Preview</h2>
            <p className="text-gray-600 text-sm mt-1">
              How this banner will look on the homepage
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Preview Content */}
        <div className="p-6 space-y-6">
          {/* Desktop Preview */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Desktop View</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 text-sm text-gray-600 border-b">
                🖥️ Desktop (1920x1200)
              </div>
              
              {/* Hero Section Preview */}
              <section className="relative h-[32rem] flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={banner.imageUrl}
                    alt={banner.imageAlt}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
                </div>

                {/* Floating Particles */}
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

                {/* Hero Content */}
                <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
                  {/* Title */}
                  <div className="mb-6">
                    <div className="text-3xl md:text-5xl font-heading font-bold leading-tight">
                      <div className="block mb-2">Find Your Perfect</div>
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
                    </div>
                  </div>

                  {/* Subtitle */}
                  <div className="mb-8">
                    <p className="text-lg md:text-xl text-gray-200 font-body">
                      Discover premium cycles for every adventure, every rider, every journey
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button className="bg-gradient-to-r from-primary-main to-secondary-main hover:bg-primary-dark text-white px-8 py-4 rounded-full text-lg font-semibold font-accent transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2">
                      <Sparkles className="h-5 w-5" />
                      <span>Browse Cycles</span>
                    </button>
                    <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-main px-8 py-4 rounded-full text-lg font-semibold font-accent transition-all duration-300 flex items-center space-x-2">
                      <Play className="h-5 w-5" />
                      <span>About Us</span>
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="mt-12 grid grid-cols-3 gap-8 max-w-md mx-auto">
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
                  </div>
                </div>                
              </section>
            </div>
          </div>

          {/* Mobile Preview */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Mobile View</h3>
            <div className="flex justify-center">
              <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ width: 375 }}>
                <div className="bg-gray-100 px-4 py-2 text-sm text-gray-600 border-b">
                  📱 Mobile (375x667)
                </div>
                
                {/* Mobile Hero Section Preview */}
                <section className="relative h-80 flex items-center justify-center overflow-hidden">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={banner.imageUrl}
                      alt={banner.imageAlt}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
                  </div>

                  {/* Hero Content */}
                  <div className="relative z-10 text-center text-white px-4">
                    {/* Title */}
                    <div className="mb-4">
                      <div className="text-2xl font-heading font-bold leading-tight">
                        <div className="block mb-1">Find Your Perfect</div>
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
                      </div>
                    </div>

                    {/* Subtitle */}
                    <div className="mb-6">
                      <p className="text-sm text-gray-200 font-body">
                        Discover premium cycles for every adventure
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col gap-3">
                      <button className="bg-gradient-to-r from-primary-main to-secondary-main text-white px-6 py-3 rounded-full text-sm font-semibold font-accent transition-all duration-300 shadow-lg flex items-center justify-center space-x-2">
                        <Sparkles className="h-4 w-4" />
                        <span>Browse Cycles</span>
                      </button>
                      <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-main px-6 py-3 rounded-full text-sm font-semibold font-accent transition-all duration-300 flex items-center justify-center space-x-2">
                        <Play className="h-4 w-4" />
                        <span>About Us</span>
                      </button>
                    </div>

                    {/* Stats */}
                    <div className="mt-8 grid grid-cols-3 gap-4 text-xs">
                      {[
                        { number: "500+", label: "Cycles" },
                        { number: "10K+", label: "Customers" },
                        { number: "45+", label: "Years" },
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
                            className="text-lg font-heading font-bold text-secondary-main"
                          >
                            {stat.number}
                          </motion.div>
                          <div className="text-sm font-body text-gray-300">{stat.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>

          {/* Banner Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Banner Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Title:</span>
                <span className="ml-2 text-gray-600">{banner.title}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  banner.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {banner.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">File Size:</span>
                <span className="ml-2 text-gray-600">
                  {(banner.metadata.fileSize / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Format:</span>
                <span className="ml-2 text-gray-600">{banner.metadata.mimeType}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Created:</span>
                <span className="ml-2 text-gray-600">
                  {new Date(banner.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Created By:</span>
                <span className="ml-2 text-gray-600">{banner.createdBy.email}</span>
              </div>
              {banner.metadata.campaign && (
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-700">Campaign:</span>
                  <span className="ml-2 text-gray-600">{banner.metadata.campaign}</span>
                </div>
              )}
              {banner.imageAlt && (
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-700">Alt Text:</span>
                  <span className="ml-2 text-gray-600">{banner.imageAlt}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
