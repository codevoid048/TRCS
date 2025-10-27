"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import type { Product } from "@/types/product"

interface ImageGalleryProps {
  product: Product
}

export default function ImageGallery({ product }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [loadingStates, setLoadingStates] = useState<{ [key: number]: boolean }>({})
  const [zoomLevel, setZoomLevel] = useState(1)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [imageDimensions, setImageDimensions] = useState<{ [key: number]: { width: number, height: number, isWide: boolean } }>({})
  const [hoverZoom, setHoverZoom] = useState({ isHovering: false, x: 0, y: 0 })
  const zoomContainerRef = useRef<HTMLDivElement>(null)
  const mainImageRef = useRef<HTMLDivElement>(null)

  // Use actual images from API data
  const images = product.images || [product.images[0]]

  // Image dimension handler
  const handleImageLoadComplete = (index: number, img: HTMLImageElement) => {
    const isWide = img.naturalWidth > img.naturalHeight
    setImageDimensions(prev => ({
      ...prev,
      [index]: {
        width: img.naturalWidth,
        height: img.naturalHeight,
        isWide
      }
    }))
    handleImageLoad(index)
  }

  // Navigation functions
  const nextImage = useCallback(() => {
    setSelectedImage((prev) => (prev + 1) % images.length)
  }, [images.length])

  const prevImage = useCallback(() => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  // Zoom modal functions
  const resetZoom = useCallback(() => {
    setZoomLevel(1)
    setPanOffset({ x: 0, y: 0 })
  }, [])

  const zoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3))
  }, [])

  const zoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev - 0.5, 0.5))
  }, [])

  const closeZoom = useCallback(() => {
    setIsZoomed(false)
    resetZoom()
  }, [resetZoom])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isZoomed) {
        switch (e.key) {
          case 'Escape':
            closeZoom()
            break
          case 'ArrowLeft':
            e.preventDefault()
            prevImage()
            break
          case 'ArrowRight':
            e.preventDefault()
            nextImage()
            break
          case '+':
          case '=':
            e.preventDefault()
            zoomIn()
            break
          case '-':
            e.preventDefault()
            zoomOut()
            break
          case '0':
            e.preventDefault()
            resetZoom()
            break
        }
      } else {
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault()
            prevImage()
            break
          case 'ArrowRight':
            e.preventDefault()
            nextImage()
            break
          case 'Enter':
          case ' ':
            e.preventDefault()
            setIsZoomed(true)
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isZoomed, nextImage, prevImage, closeZoom, zoomIn, zoomOut, resetZoom])

  // Image loading handler
  const handleImageLoad = (index: number) => {
    setLoadingStates(prev => ({ ...prev, [index]: false }))
  }

  const handleImageLoadStart = (index: number) => {
    setLoadingStates(prev => ({ ...prev, [index]: true }))
  }

  // Swipe gesture handlers
  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 50
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        prevImage()
      } else {
        nextImage()
      }
    }
  }

  // Pan gesture handler for zoom modal
  const handleZoomPan = (event: any, info: PanInfo) => {
    if (zoomLevel > 1) {
      setPanOffset(prev => ({
        x: prev.x + info.delta.x,
        y: prev.y + info.delta.y
      }))
    }
  }

  // Hover zoom handlers
  const handleMouseEnter = () => {
    setHoverZoom(prev => ({ ...prev, isHovering: true }))
  }

  const handleMouseLeave = () => {
    setHoverZoom({ isHovering: false, x: 0, y: 0 })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mainImageRef.current) return
    
    const rect = mainImageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    setHoverZoom(prev => ({ ...prev, x, y }))
  }

  // Get image fit class based on aspect ratio
  const getImageFitClass = (index: number) => {
    const dimensions = imageDimensions[index]
    if (!dimensions) return 'object-contain' // Default while loading
    
    // If image is significantly wider than it is tall (landscape)
    const aspectRatio = dimensions.width / dimensions.height
    if (aspectRatio > 1.3) {
      return 'object-contain' // Contain to prevent cropping of wide images
    }
    // If image is significantly taller than it is wide (portrait)
    else if (aspectRatio < 0.7) {
      return 'object-contain' // Contain to prevent cropping of tall images
    }
    // For roughly square images or mild rectangles
    else {
      return 'object-cover' // Cover is fine for near-square images
    }
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow-lg group">
        <motion.div
          ref={mainImageRef}
          key={selectedImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative aspect-square cursor-grab active:cursor-grabbing flex items-center justify-center overflow-hidden"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          {/* Loading State */}
          {loadingStates[selectedImage] && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center z-10">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          <img
            src={images[selectedImage]}
            alt={`${product.name} - View ${selectedImage + 1}`}
            className={`w-full h-full transition-all duration-300 ${getImageFitClass(selectedImage)}`}
            onLoadStart={() => handleImageLoadStart(selectedImage)}
            onLoad={(e) => {
              const img = e.target as HTMLImageElement
              handleImageLoadComplete(selectedImage, img)
            }}
            style={{
              opacity: loadingStates[selectedImage] ? 0 : 1,
              transition: hoverZoom.isHovering 
                ? 'transform 0.1s ease-out, opacity 0.3s ease-in-out' 
                : 'transform 0.3s ease-out, opacity 0.3s ease-in-out',
              transform: hoverZoom.isHovering 
                ? `scale(2) translate(${(50 - hoverZoom.x) * 0.5}%, ${(50 - hoverZoom.y) * 0.5}%)` 
                : 'scale(1) translate(0%, 0%)',
              transformOrigin: `${hoverZoom.x}% ${hoverZoom.y}%`
            }}
          />

          {/* Image background pattern for transparent areas */}
          <div 
            className="absolute inset-0 -z-10"
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 2px, transparent 2px),
                radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 2px, transparent 2px)
              `,
              backgroundSize: '20px 20px'
            }}
          />

          {/* Zoom Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsZoomed(true)}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20"
            aria-label="Zoom image"
          >
            <ZoomIn className="h-5 w-5 text-gray-700" />
          </motion.button>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </motion.button>
            </>
          )}

          {/* Image Indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
              {images.map((_: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === selectedImage ? "bg-white shadow-md" : "bg-white/50"
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="flex justify-center">
          <div className="flex items-center justify-center max-w-full">
            <div 
              className={`flex gap-4 ${
                images.length > 4 
                  ? 'overflow-x-auto scrollbar-hide px-4' 
                  : 'justify-center'
              }`}
              style={{
                maxWidth: images.length > 4 ? '100%' : 'auto',
                scrollSnapType: images.length > 4 ? 'x mandatory' : 'none'
              }}
            >
              {images.map((image: string, index: number) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-md overflow-hidden shadow-sm transition-all duration-200 flex-shrink-0 flex items-center justify-center ${
                    index === selectedImage ? "ring-2 ring-[#0984E3]" : "hover:shadow-md"
                  }`}
                  style={{ 
                    width: 72, 
                    height: 72,
                    scrollSnapAlign: images.length > 4 ? 'start' : 'none'
                  }}
                  aria-label={`Select image ${index + 1}`}
                >
                  {/* Thumbnail Loading State */}
                  {loadingStates[index] && (
                    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <img
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className={`w-full h-full ${getImageFitClass(index)}`}
                    onLoadStart={() => handleImageLoadStart(index)}
                    onLoad={(e) => {
                      const img = e.target as HTMLImageElement
                      handleImageLoadComplete(index, img)
                    }}
                    style={{
                      opacity: loadingStates[index] ? 0 : 1,
                      transition: 'opacity 0.3s ease-in-out'
                    }}
                  />
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeZoom}
          >
            {/* Zoom Controls */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full p-2 z-10">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation()
                  zoomOut()
                }}
                className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                aria-label="Zoom out"
              >
                <ZoomOut className="h-5 w-5" />
              </motion.button>

              <span className="text-white text-sm font-medium px-2">
                {Math.round(zoomLevel * 100)}%
              </span>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation()
                  zoomIn()
                }}
                className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                aria-label="Zoom in"
              >
                <ZoomIn className="h-5 w-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation()
                  resetZoom()
                }}
                className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                aria-label="Reset zoom"
              >
                <RotateCcw className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Navigation in Zoom */}
            {images.length > 1 && (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    prevImage()
                    resetZoom()
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full text-white hover:bg-white/30 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    nextImage()
                    resetZoom()
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full text-white hover:bg-white/30 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </motion.button>
              </>
            )}

            {/* Zoomable Image Container */}
            <motion.div
              ref={zoomContainerRef}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              className="relative max-w-4xl max-h-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                src={images[selectedImage]}
                alt={`${product.name} - Zoomed view`}
                className="w-full h-full object-contain cursor-move"
                style={{
                  transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                  transition: 'transform 0.1s ease-out'
                }}
                drag={zoomLevel > 1}
                dragConstraints={zoomContainerRef}
                dragElastic={0.1}
                onDrag={handleZoomPan}
              />
            </motion.div>

            {/* Close Button */}
            <button
              onClick={closeZoom}
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors text-xl"
              aria-label="Close zoom"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}