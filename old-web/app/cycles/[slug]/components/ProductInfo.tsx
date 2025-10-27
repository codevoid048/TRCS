"use client"

import { motion } from "framer-motion"
import type { Product } from "@/types/product"

interface ProductInfoProps {
  product: Product
}

export default function ProductInfo({ product }: ProductInfoProps) {

  return (
    <div className="space-y-6">

      {/* Quick Specs */}
      <div>
        <h3 className="text-lg font-subheading font-semibold text-[#2D3436] dark:text-white mb-4 transition-colors duration-300">
          Quick Specifications
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg transition-all duration-300 spec-card"
          >
            <p className="text-sm font-body text-gray-600 dark:text-gray-400 transition-colors duration-300">
              Category
            </p>
            <p className="font-medium font-subheading text-[#2D3436] dark:text-white transition-colors duration-300">
              {product.category}
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg transition-all duration-300 spec-card"
          >
            <p className="text-sm font-body text-gray-600 dark:text-gray-400 transition-colors duration-300">
              Gear Type
            </p>
            <p className="font-medium font-subheading text-[#2D3436] dark:text-white transition-colors duration-300">
              {product.gearType}
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg transition-all duration-300 spec-card"
          >
            <p className="text-sm font-body text-gray-600 dark:text-gray-400 transition-colors duration-300">
              Brake Type
            </p>
            <p className="font-medium font-subheading text-[#2D3436] dark:text-white transition-colors duration-300">
              {product.brakeType}
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg transition-all duration-300 spec-card"
          >
            <p className="text-sm font-body text-gray-600 dark:text-gray-400 transition-colors duration-300">
              Frame Size
            </p>
            <p className="font-medium font-subheading text-[#2D3436] dark:text-white transition-colors duration-300">
              {product.frameSize}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
