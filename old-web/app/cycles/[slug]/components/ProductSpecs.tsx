"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Package, Settings, Info, Award } from "lucide-react"
import type { Product } from "@/types/product"

interface ProductSpecsProps {
  product: Product
}

export default function ProductSpecs({ product }: ProductSpecsProps) {

  const getColorName = (color: any) => {
    if (Array.isArray(color)) {
      return color[0]?.name || "Default"
    }
    return color?.name || "Default"
  }

  const allSpecs = [
    { label: "Brand", value: product.brand },
    { label: "Category", value: product.category },
    { label: "Color", value: getColorName(product.color) },
    { label: "Frame Material", value: product.frameMaterial || "Steel Alloy" },
    { label: "Weight", value: product.weight || "15-18 kg" },
    { label: "Gear Type", value: product.gearType },
    ...(product.gearType && product.gearType.toLowerCase() !== 'single speed' && product.gearType.toLowerCase() !== 'non-geared' && product.numberOfGears ? 
      [{ label: "Number of Gears", value: `${product.numberOfGears} Speed` }] : []
    ),
    { label: "Brake Type", value: product.brakeType },
    { label: "Frame Size", value: product.frameSize },
    { label: "Wheel Size", value: product.wheelSize },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          {/* <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
            <Settings className="h-6 w-6 text-white" />
          </div> */}
          <h2 className="text-3xl font-heading font-bold text-[#2D3436] dark:text-white transition-colors duration-300">
            Product Specifications
          </h2>
        </div>
        {/* <p className="text-lg font-body text-gray-600 dark:text-gray-400 transition-colors duration-300">
          Detailed technical information about this bicycle
        </p> */}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-white to-amber-50/30 dark:from-gray-800 dark:to-amber-900/10 rounded-2xl shadow-xl p-8 border-2 border-amber-200/50 dark:border-amber-700/30 max-w-4xl mx-auto"
      >
        {/* Specifications Grid - 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {allSpecs.map((spec, index) => (
            <motion.div
              key={spec.label}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group bg-white/80 dark:bg-gray-700/50 backdrop-blur-sm rounded-xl p-3 border border-amber-100 dark:border-amber-800/30 hover:border-amber-300 dark:hover:border-amber-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
                    {spec.label === "Stock Available" && <Package className="h-3.5 w-3.5 text-white" />}
                    {spec.label === "Brand" && <Award className="h-3.5 w-3.5 text-white" />}
                    {spec.label === "Category" && <Info className="h-3.5 w-3.5 text-white" />}
                    {!["Stock Available", "Brand", "Category"].includes(spec.label) && (
                      <Settings className="h-3.5 w-3.5 text-white" />
                    )}
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-300 font-body text-sm">
                    {spec.label}
                  </span>
                </div>
                {spec.label === "Color" ? (
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(product.color) ? (
                      product.color.map((color, colorIndex) => (
                        <div
                          key={colorIndex}
                          className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700"
                        >
                          <div
                            className="w-3 h-3 rounded-full border border-white shadow-sm"
                            style={{ backgroundColor: color.hex }}
                          />
                          {color.name}
                        </div>
                      ))
                    ) : product.color && typeof product.color === 'object' && 'name' in product.color ? (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700">
                        <div
                          className="w-3 h-3 rounded-full border border-white shadow-sm"
                          style={{ backgroundColor: (product.color as any).hex || "#8B4513" }}
                        />
                        {(product.color as any).name}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700">
                        <div
                          className="w-3 h-3 rounded-full border border-white shadow-sm bg-amber-600"
                        />
                        {spec.value}
                      </div>
                    )}
                  </div>
                ) : (
                  <span
                    className={`font-semibold font-accent px-2 py-1 rounded-full text-xs ${
                      spec.label === "Stock Available" && product.stock === 0
                        ? "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30"
                        : spec.label === "Stock Available" && product.stock <= 3
                          ? "text-orange-700 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30"
                          : "text-amber-800 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/30"
                    }`}
                  >
                    {spec.value}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        </motion.div>
    </motion.div>
  )
}
