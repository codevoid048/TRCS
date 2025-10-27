"use client"

import { Suspense } from "react"
import { motion } from "framer-motion"
// import { Star, Heart, Package, Zap, Router } from "lucide-react"
import Link from "next/link"
import type { Product } from "@/types/product"
import CycleCardSkeleton from "./skeletons/CycleCardSkeleton"
import { TiltCard, FloatingCard } from "../../components/animations/InteractiveAnimations"
import { useRouter } from "next/navigation"

interface CycleCardProps {
  product: Product
  index?: number
}

function CycleCardContent({ product, index = 0 }: CycleCardProps) {
  const router = useRouter();
  const isOutOfStock = product.stock === 0
  // const isLowStock = cycle.stock > 0 && cycle.stock <= 3

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
      }}
      className="h-full"
    >
      {/* <TiltCard className="h-full"> */}
        <FloatingCard
          className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 dark:border-gray-700 relative h-full ${isOutOfStock ? "opacity-60" : ""
            }`}
        >
          {/* Animated Background Gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary-main/5 to-secondary-main/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            animate={{
              background: [
                "linear-gradient(45deg, rgba(139,69,19,0.05) 0%, rgba(255,215,0,0.05) 100%)",
                "linear-gradient(135deg, rgba(255,215,0,0.05) 0%, rgba(139,69,19,0.05) 100%)",
                "linear-gradient(45deg, rgba(139,69,19,0.05) 0%, rgba(255,215,0,0.05) 100%)",
              ],
            }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          />

          {/* Out of Stock Overlay with Animation */}
          {isOutOfStock && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-gray-900/20 backdrop-blur-[1px] z-10 flex items-center justify-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 1, -1, 0],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="bg-red-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full font-semibold text-xs sm:text-sm shadow-lg"
              >
                Out of Stock
              </motion.div>
            </motion.div>
          )}

          {/* Image with Hover Effects - Responsive height */}
          <Link href={`/cycles/${product.slug}`} className={isOutOfStock ? "pointer-events-none" : ""}>
            <div className="relative overflow-hidden cursor-pointer">
              <motion.img
                src={product.images[0]}
                alt={product.name}
                className={`w-full h-40 sm:h-48 md:h-56 lg:h-64 object-cover transition-all duration-500 ${!isOutOfStock ? "group-hover:scale-110" : ""
                  } ${isOutOfStock ? "blur-sm" : ""}`}
                loading="lazy"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />

              {/* Animated Overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              />

              {/* Category Badge with Glow Effect - Responsive */}
              <div className="absolute top-2 sm:top-2 left-2 sm:left-2">
                <motion.span
                  whileHover={{ scale: 1.1 }}
                  className="bg-gradient-to-r from-primary-main to-secondary-main text-white px-2 sm:px-3 py-1 rounded-full text-xs font-medium shadow-lg"
                  animate={{
                    boxShadow: [
                      "0 0 0 rgba(139,69,19,0.4)",
                      "0 0 20px rgba(139,69,19,0.4)",
                      "0 0 0 rgba(139,69,19,0.4)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  {product.category}
                </motion.span>
              </div>

              {product.isFeatured && (
                <div className="absolute top-2 sm:top-2 right-2 sm:right-2">
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    className="bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs font-medium shadow-lg"
                    animate={{
                      boxShadow: [
                        "0 0 0 rgba(139,69,19,0.4)",
                        "0 0 20px rgba(139,69,19,0.4)",
                        "0 0 0 rgba(139,69,19,0.4)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    Featured
                  </motion.span>
                </div>
              )}
            </div>
          </Link>

          {/* Content with Staggered Animations - Responsive padding */}
          <div className="p-3 sm:p-4 md:p-2">
            {/* Name and Brand with Typewriter Effect - Responsive text */}
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className={`text-sm sm:text-base md:text-lg font-bold mb-1 transition-colors duration-300 line-clamp-2 ${!isOutOfStock
                ? "text-[#2D3436] dark:text-white"
                : "text-gray-500 dark:text-gray-400"
                }`}
            >
              {product.name}
            </motion.h3>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-3 md:mb-4 transition-colors duration-300 line-clamp-1"
            >
              {product.brand}
            </motion.p>

            {/* Scrollable Spec Boxes/Tags - Single row with horizontal scroll */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mb-3 sm:mb-4"
            >
              <div 
                className="overflow-x-auto scrollbar-hide w-full"
                style={{
                  scrollbarWidth: 'none', // Firefox
                  msOverflowStyle: 'none', // Internet Explorer 10+
                }}
              >
                <style jsx>{`
                  .scrollbar-hide::-webkit-scrollbar {
                    display: none; /* Safari and Chrome */
                  }
                `}</style>
                <div className="flex gap-1.5 sm:gap-2 pb-1 w-max">
                  {product.gearType && product.gearType === "Geared" && (
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 sm:px-3 py-1 rounded-full font-medium whitespace-nowrap flex-shrink-0"
                    >
                      {product.numberOfGears} Gears
                    </motion.span>
                  )}
                  {product.brakeType && (
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 sm:px-3 py-1 rounded-full font-medium whitespace-nowrap flex-shrink-0"
                    >
                      {product.brakeType}
                    </motion.span>
                  )}
                  {product.frameSize && (
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs px-2 sm:px-3 py-1 rounded-full font-medium whitespace-nowrap flex-shrink-0"
                    >
                      {product.frameSize}
                    </motion.span>
                  )}
                  {product.wheelSize && (
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-xs px-2 sm:px-3 py-1 rounded-full font-medium whitespace-nowrap flex-shrink-0"
                    >
                      {product.wheelSize}
                    </motion.span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Price and Button with Final Animation - Responsive */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex items-center justify-center"
            >
              {isOutOfStock ? (
                <button
                  disabled
                  className="bg-gray-400 dark:bg-gray-600 text-white px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full font-semibold cursor-not-allowed opacity-60 text-xs sm:text-sm"
                >
                  Out of Stock
                </button>
              ) : (
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 25px rgba(139,69,19,0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary-main hover:bg-primary-dark text-white px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden"
                  onClick={() => router.push(`/cycles/${product.slug}`)}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatDelay: 3,
                    }}
                  />
                  <span className="relative z-10 flex items-center space-x-0.5 text-xs sm:text-sm">
                    <Zap className="h-3 w-3" />
                    <span className="hidden sm:inline">View Details</span>
                    <span className="sm:hidden">View</span>
                  </span>
                </motion.button>
              )}
            </motion.div> */}
          </div>
        </FloatingCard>
      {/* </TiltCard> */}
    </motion.div>
  )
}

export default function CycleCard({ product, index = 0 }: CycleCardProps) {
  return (
    <Suspense fallback={<CycleCardSkeleton index={index} />}>
      <CycleCardContent product={product} index={index} />
    </Suspense>
  )
}