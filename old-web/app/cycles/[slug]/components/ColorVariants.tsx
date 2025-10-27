"use client"
import { motion } from "framer-motion"
import type { Product } from "@/types/product"

interface ColorVariantsProps {
  product: Product
}

export default function ColorVariants({ product }: ColorVariantsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-subheading font-semibold text-[#2D3436] dark:text-white transition-colors duration-300">
        Available Colors
      </h3>

      <div className="flex flex-wrap gap-3">
        {product.color.map((color, index) => (
          <motion.div
            key={color.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="w-8 h-8 rounded-full border-4 border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: color.hex }}
            title={color.name}
          />
        ))}
      </div>
    </div>
  )
}
