"use client"

import { motion, AnimatePresence } from "framer-motion"
import CycleCard from "./CycleCard"
import type { Product } from "@/types/product"

interface ProductGridProps {
  products: Product[]
  onClearAll?: () => void
}

export default function ProductGrid({ products, onClearAll }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex-1">
        <div className="text-center py-12">
          <div className="text-6xl sm:text-9xl mb-4">
            🚲
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
            No cycles found
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
            Try adjusting your search or filters
          </p>
          {onClearAll && (
            <button
              onClick={onClearAll}
              className="text-primary-main hover:text-primary-dark font-medium text-sm sm:text-base"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1">
      <div className="mb-4 sm:mb-6 md:mb-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-2 sm:gap-2 md:gap-4"
        >
          <AnimatePresence>
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="min-w-0" // Prevents flex items from overflowing
              >
                <CycleCard product={product} index={index} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}