"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Ruler, User, Activity } from "lucide-react"
import type { Product } from "@/types/product"

interface SizeGuideProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export default function SizeGuide({ product, isOpen, onClose }: SizeGuideProps) {
  const [selectedSize, setSelectedSize] = useState(product.frameSize)

  // Create a default size chart based on common frame sizes
  const defaultSizeChart = [
    {
      frameSize: "S",
      riderHeight: "5'2\" - 5'6\"",
      inseam: "28\" - 32\"",
      recommended: product.frameSize === "S"
    },
    {
      frameSize: "M", 
      riderHeight: "5'6\" - 5'10\"",
      inseam: "30\" - 34\"",
      recommended: product.frameSize === "M"
    },
    {
      frameSize: "L",
      riderHeight: "5'10\" - 6'2\"", 
      inseam: "32\" - 36\"",
      recommended: product.frameSize === "L"
    },
    {
      frameSize: "XL",
      riderHeight: "6'2\" - 6'6\"",
      inseam: "34\" - 38\"", 
      recommended: product.frameSize === "XL"
    }
  ]

  const sizeChart = defaultSizeChart

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 modal-overlay"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-main rounded-lg flex items-center justify-center">
                  <Ruler className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-heading font-bold text-[#2D3436] dark:text-white">Size Guide</h2>
                  <p className="text-sm font-body text-gray-600 dark:text-gray-400">
                    Find your perfect fit for {product.name}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Size Chart */}
              <div>
                <h3 className="text-lg font-subheading font-semibold text-[#2D3436] dark:text-white mb-4">
                  Size Chart
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700">
                        <th className="text-left p-3 font-subheading font-medium text-[#2D3436] dark:text-white border border-gray-200 dark:border-gray-600">
                          Frame Size
                        </th>
                        <th className="text-left p-3 font-subheading font-medium text-[#2D3436] dark:text-white border border-gray-200 dark:border-gray-600">
                          Rider Height
                        </th>
                        <th className="text-left p-3 font-subheading font-medium text-[#2D3436] dark:text-white border border-gray-200 dark:border-gray-600">
                          Inseam
                        </th>
                        <th className="text-left p-3 font-subheading font-medium text-[#2D3436] dark:text-white border border-gray-200 dark:border-gray-600">
                          Fit
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sizeChart.map((size, index) => (
                        <motion.tr
                          key={size.frameSize}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                            size.recommended ? "bg-primary-main/10 dark:bg-primary-main/20" : ""
                          }`}
                          onClick={() => setSelectedSize(size.frameSize)}
                        >
                          <td className="p-3 font-body border border-gray-200 dark:border-gray-600">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-[#2D3436] dark:text-white">{size.frameSize}</span>
                              {size.recommended && (
                                <span className="bg-primary-main text-white text-xs px-2 py-1 rounded-full font-accent">
                                  Recommended
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3 font-body text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                            {size.riderHeight}
                          </td>
                          <td className="p-3 font-body text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                            {size.inseam}
                          </td>
                          <td className="p-3 border border-gray-200 dark:border-gray-600">
                            <div className="flex items-center space-x-2">
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  size.recommended ? "bg-green-500" : "bg-yellow-500"
                                }`}
                              />
                              <span className="text-sm font-body text-gray-600 dark:text-gray-400">
                                {size.recommended ? "Perfect" : "Good"}
                              </span>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Measurement Guide */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-md font-subheading font-semibold text-[#2D3436] dark:text-white flex items-center space-x-2">
                    <User className="h-4 w-4 text-primary-main" />
                    <span>How to Measure Height</span>
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <ol className="space-y-2 text-sm font-body text-gray-700 dark:text-gray-300">
                      <li>1. Stand straight against a wall</li>
                      <li>2. Remove shoes and keep feet together</li>
                      <li>3. Mark the highest point of your head</li>
                      <li>4. Measure from floor to the mark</li>
                    </ol>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-md font-subheading font-semibold text-[#2D3436] dark:text-white flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-primary-main" />
                    <span>How to Measure Inseam</span>
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <ol className="space-y-2 text-sm font-body text-gray-700 dark:text-gray-300">
                      <li>1. Stand with back against wall</li>
                      <li>2. Place book between legs, spine up</li>
                      <li>3. Mark where book meets the wall</li>
                      <li>4. Measure from floor to the mark</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Current Selection */}
              <div className="bg-primary-main/10 dark:bg-primary-main/20 p-4 rounded-lg">
                <h4 className="font-subheading font-semibold text-[#2D3436] dark:text-white mb-2">
                  Current Selection: {product.frameSize}
                </h4>
                <p className="text-sm font-body text-gray-700 dark:text-gray-300">
                  This size is{" "}
                  {sizeChart.find((s) => s.frameSize === product.frameSize)?.recommended
                    ? "recommended"
                    : "suitable"}{" "}
                  for riders with height {sizeChart.find((s) => s.frameSize === product.frameSize)?.riderHeight} and
                  inseam {sizeChart.find((s) => s.frameSize === product.frameSize)?.inseam}.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-accent"
              >
                Close
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-dark transition-colors font-accent"
              >
                Got it!
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
