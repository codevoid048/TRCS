"use client"

import { Filter } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileFilterToggleProps {
  onClick: () => void
  activeFiltersCount: number
}

export default function MobileFilterToggle({
  onClick,
  activeFiltersCount,
}: MobileFilterToggleProps) {
  return (
    <button
      className={cn(
        'w-full flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3',
        'bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700', 
        'rounded-lg sm:rounded-xl text-gray-700 dark:text-gray-300 transition-all duration-200',
        'hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95'
      )}
      onClick={onClick}
    >
      <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-primary-main" />
      <span className="text-sm sm:text-base font-medium">Filters</span>
      {activeFiltersCount > 0 && (
        <div className="bg-primary-main text-white text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
          {activeFiltersCount}
        </div>
      )}
    </button>
  )
}
