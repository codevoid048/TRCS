"use client"

import { motion } from "framer-motion"
import CycleCardSkeleton from "./CycleCardSkeleton"

interface ProductGridSkeletonProps {
  count?: number
}

export default function ProductGridSkeleton({ count = 9 }: ProductGridSkeletonProps) {
  return (
    <div className="flex-1">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5"
      >
        {[...Array(count)].map((_, index) => (
          <CycleCardSkeleton key={index} index={index} />
        ))}
      </motion.div>
    </div>
  )
}
