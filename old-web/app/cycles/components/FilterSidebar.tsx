"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronDown, ChevronLeft, ChevronRight, Filter, Check, RotateCcw, Zap, ChevronUp } from "lucide-react"
import { useState, useCallback, useEffect, useMemo } from "react"

import { FilterState, FilterOptions } from "@/types/product"

type FilterOptionsConfig = FilterOptions['config']

interface FilterSidebarProps {
  appliedFilters: FilterState
  pendingFilters: FilterState
  onFilterChange: (category: string, value: string) => void
  onUpdateFeatured?: (value: boolean) => void
  onApplyFilters: () => void
  onClearFilters: () => void
  onResetFilters: () => void
  hasPendingChanges: boolean
  isOpen: boolean
  onClose: () => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  filterOptions?: FilterOptionsConfig
  autoApplyFilters?: boolean
}

const filterLabels = {
  category: "Category",
  brand: "Brand",
  frameMaterial: "Frame Material",
  gearType: "Gear Type",
  brakeType: "Brake Type",
  priceRange: "Price Range",
  color: "Color",
  frameSize: "Frame Size",
  wheelSize: "Wheel Size",
}

// Map API response keys to FilterState keys
const mapFilterKey = (apiKey: string): string => {
  const keyMapping: Record<string, string> = {
    'brands': 'brand',
    'categories': 'category',
    'frameMaterials': 'frameMaterial',
    'brakeTypes': 'brakeType',
    'frameSizes': 'frameSize',
    'wheelSizes': 'wheelSize',
    'gearTypes': 'gearType',
    'colors': 'color'
  }
  return keyMapping[apiKey] || apiKey
}

// Reverse mapping: FilterState keys to API response keys
const mapToApiKey = (filterKey: string): string => {
  const reverseMapping: Record<string, string> = {
    'brand': 'brands',
    'category': 'categories',
    'frameMaterial': 'frameMaterials',
    'brakeType': 'brakeTypes',
    'frameSize': 'frameSizes',
    'wheelSize': 'wheelSizes',
    'gearType': 'gearTypes',
    'color': 'colors'
  }
  return reverseMapping[filterKey] || filterKey
}

const FilterOption = React.memo(({
  option,
  filterKey,
  isSelected,
  wasApplied,
  onFilterChange,
  autoApply
}: {
  option: string | { name: string; hex: string; _id: string }
  filterKey: string
  isSelected: boolean
  wasApplied: boolean
  onFilterChange: (category: string, value: string) => void
  autoApply?: boolean
}) => {
  const hasChanged = isSelected !== wasApplied
  
  // Extract option value and check if it's a color object
  const optionValue = typeof option === 'string' ? option : option.name
  const isColorOption = typeof option === 'object' && 'hex' in option
  const hexColor = isColorOption ? option.hex : null

  // Stable click handler with debug for color issues
  const handleClick = useCallback(() => {
    // For debugging
    if (filterKey === 'color') {
      console.log(`Toggling color filter: ${optionValue}`);
    }
    
    // Always use the name string for consistent filtering
    onFilterChange(filterKey, optionValue)
    
    if (autoApply) {
      setTimeout(() => {
      }, 10)
    }
  }, [filterKey, optionValue, onFilterChange, autoApply])

  return (
    <motion.label
      whileHover={{ x: 2 }}
      className="flex items-center space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
    >
      <div className="relative">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleClick}
          className="sr-only"
        />
        <div
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${isSelected
              ? "bg-primary-main border-primary-main"
              : "border-gray-300 dark:border-gray-600 group-hover:border-primary-main"
            }`}
        >
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Check className="h-3 w-3 text-white" />
            </motion.div>
          )}
        </div>
        {hasChanged && <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" />}
      </div>
      
      {/* Color swatch for color options */}
      {isColorOption && hexColor && (
        <div
          className="w-4 h-4 rounded border border-gray-300 dark:border-gray-500 flex-shrink-0"
          style={{ backgroundColor: hexColor }}
          title={`Color: ${optionValue}`}
        />
      )}
      
      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary-main transition-colors font-medium flex-1">
        {optionValue}
      </span>
    </motion.label>
  )
}, (prevProps, nextProps) => {
  // Custom comparison for zero re-renders
  // Handle color objects vs strings properly
  const prevOptionValue = typeof prevProps.option === 'string' ? prevProps.option : prevProps.option.name
  const nextOptionValue = typeof nextProps.option === 'string' ? nextProps.option : nextProps.option.name
  
  return (
    prevOptionValue === nextOptionValue &&
    prevProps.filterKey === nextProps.filterKey &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.wasApplied === nextProps.wasApplied &&
    prevProps.onFilterChange === nextProps.onFilterChange
  )
})

FilterOption.displayName = 'FilterOption'

// Helper function to safely access filter state
const getFilterValue = (filters: FilterState, key: string): string[] => {
  return (filters as any)[key] || []
}

const FilterSection = React.memo(({
  title,
  filterKey,
  options,
  pendingFilters,
  appliedFilters,
  isExpanded,
  onToggleSection,
  onFilterChange,
  autoApply
}: {
  title: string
  filterKey: string
  options: string[] | Array<{ name: string; hex: string; _id: string }>
  pendingFilters: FilterState
  appliedFilters: FilterState
  isExpanded: boolean
  onToggleSection: (key: string) => void
  onFilterChange: (category: string, value: string) => void
  autoApply?: boolean
}) => {
  const pendingCount = getFilterValue(pendingFilters, filterKey).length

  const handleToggle = useCallback(() => {
    onToggleSection(filterKey)
  }, [filterKey, onToggleSection])

  return (
    <div className="border-b border-gray-200 dark:border-gray-600 pb-4 last:border-b-0">
      <button
        onClick={handleToggle}
        className="flex items-center justify-between w-full py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg px-2 transition-colors duration-200"
      >
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-[#2D3436] dark:text-white transition-colors duration-300">{title}</h3>
          {pendingCount > 0 && (
            <span className="bg-primary-main text-white px-2 py-0.5 rounded-full text-xs font-medium">
              {pendingCount}
            </span>
          )}
        </div>
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-3 mt-3 px-2">
              {options.map((option) => {
                // Extract the option value (string) from string or object
                const optionValue = typeof option === 'string' ? option : option.name
                
                // For colors, make sure we're comparing strings to strings
                const isSelected = getFilterValue(pendingFilters, filterKey).includes(optionValue)
                const wasApplied = getFilterValue(appliedFilters, filterKey).includes(optionValue)

                return (
                  <FilterOption
                    key={`${filterKey}-${optionValue}`}
                    option={option} // Pass the full option object (string or color object)
                    filterKey={filterKey}
                    isSelected={isSelected}
                    wasApplied={wasApplied}
                    onFilterChange={onFilterChange}
                    autoApply={autoApply}
                  />
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}, (prevProps, nextProps) => {
  const prevPending = getFilterValue(prevProps.pendingFilters, prevProps.filterKey)
  const nextPending = getFilterValue(nextProps.pendingFilters, nextProps.filterKey)
  const prevApplied = getFilterValue(prevProps.appliedFilters, prevProps.filterKey)
  const nextApplied = getFilterValue(nextProps.appliedFilters, nextProps.filterKey)

  return (
    prevProps.title === nextProps.title &&
    prevProps.filterKey === nextProps.filterKey &&
    prevProps.isExpanded === nextProps.isExpanded &&
    prevPending.length === nextPending.length &&
    prevApplied.length === nextApplied.length &&
    prevPending.every((val: string, idx: number) => val === nextPending[idx]) &&
    prevApplied.every((val: string, idx: number) => val === nextApplied[idx]) &&
    prevProps.onToggleSection === nextProps.onToggleSection &&
    prevProps.onFilterChange === nextProps.onFilterChange
  )
})

FilterSection.displayName = 'FilterSection'

export default function FilterSidebar({
  appliedFilters,
  pendingFilters,
  onFilterChange,
  onUpdateFeatured,
  onApplyFilters,
  onClearFilters,
  onResetFilters,
  hasPendingChanges,
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
  filterOptions,
  autoApplyFilters = false,
}: FilterSidebarProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: false,
    brand: false,
    gearType: false,
    brakeType: false,
    priceRange: false,
    color: false,
    frameSize: false,
    wheelSize: false,
  })

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Stable toggle function
  const toggleSection = useCallback((section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }, [])

  useEffect(() => {
    if (autoApplyFilters && hasPendingChanges) {
      const timeoutId = setTimeout(() => {
        onApplyFilters()
      }, 300) // 300ms delay for better UX
      
      return () => clearTimeout(timeoutId)
    }
  }, [autoApplyFilters, hasPendingChanges, onApplyFilters])

  // Stable apply handler
  const handleApply = useCallback(() => {
    onApplyFilters()
    if (isMobile) {
      onClose()
    }
  }, [onApplyFilters, isMobile, onClose])

  // Memoized counts
  const appliedFiltersCount = useMemo(() => {
    let count = 0
    Object.entries(appliedFilters).forEach(([key, value]) => {
      if (key === 'featured' && value === true) {
        count += 1
      } else if (Array.isArray(value)) {
        count += value.length
      }
    })
    return count
  }, [appliedFilters])

  const pendingFiltersCount = useMemo(() => {
    let count = 0
    Object.entries(pendingFilters).forEach(([key, value]) => {
      if (key === 'featured' && value === true) {
        count += 1
      } else if (Array.isArray(value)) {
        count += value.length
      }
    })
    return count
  }, [pendingFilters])

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div
        className={`
          ${isMobile ? "fixed" : "lg:static lg:block"}
          ${isMobile ? "top-0 left-0 h-screen" : "lg:h-fit lg:max-h-[calc(100vh-80px)]"}
          ${isMobile ? "w-80" : isCollapsed ? "lg:w-16" : "lg:w-80"}
          bg-white dark:bg-gray-800 
          shadow-xl lg:shadow-lg 
          ${isMobile ? "z-50" : "lg:z-auto"}
          ${isMobile ? "border-r border-gray-200 dark:border-gray-700" : "lg:border lg:border-gray-200 lg:dark:border-gray-700"}
          ${isMobile ? "" : "lg:rounded-xl"}
          transform transition-all duration-300 ease-in-out
          ${isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "lg:translate-x-0"}
        `}
      >
        {/* Desktop Collapsed State */}
        {!isMobile && isCollapsed && (
          <div className="flex flex-col items-center py-6 space-y-4">
            {onToggleCollapse && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onToggleCollapse}
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                title="Expand Filters"
              >
                <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </motion.button>
            )}

            <div className="flex flex-col items-center space-y-2">
              <Filter className="h-5 w-5 text-primary-main" />
            </div>

            {/* Active Filters Count */}
            {appliedFiltersCount > 0 && (
              <div className="bg-primary-main text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                {appliedFiltersCount}
              </div>
            )}

            {/* Pending Changes Indicator */}
            {hasPendingChanges && (
              <div className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
                !
              </div>
            )}
          </div>
        )}

        {/* Main Content - Mobile and Desktop Expanded */}
        {(isMobile || !isCollapsed) && (
          <div className={`flex flex-col ${isMobile ? "h-full" : "lg:h-full"}`}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-[#2D3436] dark:text-white transition-colors duration-300">
                  Filters
                </h2>
                {/* Desktop Collapse Button */}
                {!isMobile && onToggleCollapse && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onToggleCollapse}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    title="Collapse Filters"
                  >
                    <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  </motion.button>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {/* Filter Counts - Desktop Only */}
                {!isMobile && (
                  <div className="flex items-center space-x-2 text-xs">
                    {appliedFiltersCount > 0 && (
                      <span className="text-gray-500 dark:text-gray-400">{appliedFiltersCount} applied</span>
                    )}
                    {pendingFiltersCount > 0 && hasPendingChanges && (
                      <span className="text-orange-600 dark:text-orange-400">{pendingFiltersCount} pending</span>
                    )}
                  </div>
                )}

                {/* Mobile Close Button */}
                {isMobile && (
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Sections - Scrollable */}
            <div className="overflow-y-auto p-6 space-y-6 max-h-[70vh]">
              {filterOptions ? (
                Object.entries(filterOptions).map(([apiKey, options]) => {
                  const filterKey = mapFilterKey(apiKey)
                  return (
                    <FilterSection
                      key={filterKey}
                      title={filterLabels[filterKey as keyof typeof filterLabels] || filterKey}
                      filterKey={filterKey}
                      options={options}
                      pendingFilters={pendingFilters}
                      appliedFilters={appliedFilters}
                      isExpanded={expandedSections[filterKey] === true} // Default to collapsed
                      onToggleSection={toggleSection}
                      onFilterChange={onFilterChange}
                      autoApply={autoApplyFilters}
                    />
                  )
                })
              ) : (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-100 rounded w-full"></div>
                        <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons - Fixed at Bottom */}
            <div className="p-6 space-y-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              {/* Apply Filters Button - Only show when auto-apply is disabled */}
              {!autoApplyFilters && (
                <motion.button
                  whileHover={{ scale: hasPendingChanges ? 1.02 : 1 }}
                  whileTap={{ scale: hasPendingChanges ? 0.98 : 1 }}
                  onClick={handleApply}
                  disabled={!hasPendingChanges}
                  className={`w-full py-3 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center space-x-2 ${hasPendingChanges
                      ? "bg-primary-main hover:bg-primary-dark text-white shadow-lg hover:shadow-xl"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    }`}
                >
                  <Zap className="h-4 w-4" />
                  <span>Apply Filters</span>
                  {pendingFiltersCount > 0 && (
                    <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{pendingFiltersCount}</span>
                  )}
                </motion.button>
              )}

              {/* Secondary Actions */}
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onResetFilters}
                  disabled={!hasPendingChanges}
                  className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center space-x-1 ${hasPendingChanges
                      ? "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                      : "bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    }`}
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClearFilters}
                  disabled={appliedFiltersCount === 0 && pendingFiltersCount === 0}
                  className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${appliedFiltersCount > 0 || pendingFiltersCount > 0
                      ? "bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                      : "bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    }`}
                >
                  Clear All
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
