"use client"

import React, { Suspense } from "react"
import { useState, useCallback, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, X, ChevronDown, SlidersHorizontal, ChevronUp } from "lucide-react"
import { useFilters } from "./hooks/useFilters"
import ProductGrid from "./components/ProductGrid"
import CyclesBanner from "./components/CyclesBanner"
import FilterSidebar from "./components/FilterSidebar"
import MobileFilterToggle from "./components/MobileFilterToggle"
import FloatingScrollUpButton from "./components/FloatingScrollUpButton"
import FloatingContactButton from "./components/FloatingContactButton"
import { monitorCachePerformance } from "@/lib/cache/cacheUtils"

// Search Component
const SearchBar = React.memo(({
  searchTerm,
  onSearchChange,
  onSearchSubmit
}: {
  searchTerm: string
  onSearchChange: (term: string) => void
  onSearchSubmit: () => void
}) => {
  const [localSearch, setLocalSearch] = useState(searchTerm)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearchChange(localSearch)
    onSearchSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Search cycles by name, brand, or category..."
          className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-main focus:border-transparent transition-all duration-200 text-sm sm:text-base"
        />
        {localSearch && (
          <button
            type="button"
            onClick={() => {
              setLocalSearch("")
              onSearchChange("")
            }}
            className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        )}
      </div>
    </form>
  )
})

SearchBar.displayName = 'SearchBar'

// Sort Pills Component
const SortPills = React.memo(({
  sortBy,
  sortOrder,
  onSortChange,
  onSortOrderChange,
  appliedFilters,
  onUpdateFeatured,
  onGearTypeChange
}: {
  sortBy: 'createdAt' | 'updatedAt' | 'price' | 'name'
  sortOrder: 'asc' | 'desc'
  onSortChange: (sortBy: 'createdAt' | 'updatedAt' | 'price' | 'name') => void
  onSortOrderChange: (sortOrder: 'asc' | 'desc') => void
  appliedFilters: any
  onUpdateFeatured: (value: boolean) => void
  onGearTypeChange: (gearType: string) => void
}) => {
  const isGearedActive = appliedFilters.gearType?.includes('Geared') || false
  const isNonGearedActive = appliedFilters.gearType?.includes('Non-Geared') || appliedFilters.gearType?.includes('Single Speed') || false

  return (
    <div className="flex gap-2 flex-wrap">
      {/* Name Sort Pill */}
      <div className="flex rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
        <button
          onClick={() => onSortChange('name')}
          className={`px-3 py-2 text-xs font-medium transition-colors flex items-center space-x-1 ${sortBy === 'name'
              ? 'bg-primary-main text-white'
              : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
        >
          <span>Name</span>
        </button>
        {sortBy === 'name' && (
          <button
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-2 py-2 bg-primary-main text-white hover:bg-primary-dark transition-colors"
            title={sortOrder === 'asc' ? 'Switch to Z-A' : 'Switch to A-Z'}
          >
            {sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        )}
      </div>

      {/* Latest Sort Pill - Hidden for now, keeping functionality */}
      {false && (
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
          <button
            onClick={() => onSortChange('updatedAt')}
            className={`px-3 py-2 text-xs font-medium transition-colors flex items-center space-x-1 ${sortBy === 'updatedAt'
                ? 'bg-primary-main text-white'
                : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
          >
            <span>Latest</span>
          </button>
          {sortBy === 'updatedAt' && (
            <button
              onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-2 py-2 bg-primary-main text-white hover:bg-primary-dark transition-colors group"
              title={sortOrder === 'desc' ? 'Switch to Oldest First' : 'Switch to Latest First'}
            >
              {sortOrder === 'desc' ? <ChevronDown className="h-3 w-3 text-primary-main group-hover:text-primary-dark" /> : <ChevronUp className="h-3 w-3 text-primary-main group-hover:text-primary-dark" />}
            </button>
          )}
        </div>
      )}

      {/* Gear Type Pills */}
      <button
        onClick={() => onGearTypeChange('Geared')}
        className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${isGearedActive
            ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white border-amber-500 shadow-lg'
            : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-300 dark:hover:border-amber-700'
          }`}
      >
        Geared
      </button>

      <button
        onClick={() => onGearTypeChange('Non-Geared')}
        className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${isNonGearedActive
            ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white border-amber-500 shadow-lg'
            : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-300 dark:hover:border-amber-700'
          }`}
      >
        Non-Geared
      </button>

      {/* Featured Products Filter as Pill */}
      <button
        onClick={() => {
          const isCurrentlyFeatured = appliedFilters.featured === true;
          onUpdateFeatured(!isCurrentlyFeatured);
        }}
        className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${appliedFilters.featured === true
            ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white border-amber-500 shadow-lg'
            : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-300 dark:hover:border-amber-700'
          }`}
      >
        Featured
      </button>
    </div>
  )
})

SortPills.displayName = 'SortPills'

// Filter Pill Component
const FilterPill = React.memo(({
  label,
  value,
  onRemove
}: {
  label: string
  value: string
  onRemove: () => void
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    className="inline-flex items-center gap-2 bg-primary-main text-white px-3 py-1 rounded-full text-sm font-medium"
  >
    <span>{label}: {value}</span>
    <button
      onClick={onRemove}
      className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
    >
      <X className="h-3 w-3" />
    </button>
  </motion.div>
))

FilterPill.displayName = 'FilterPill'

// Quick Filter Button Component - appears between search and sort
const QuickFilterButton = React.memo(({
  onClick,
  activeFiltersCount
}: {
  onClick: () => void
  activeFiltersCount: number
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
  >
    <SlidersHorizontal className="h-4 w-4" />
    <span className="text-sm sm:text-base">Filters</span>
    {activeFiltersCount > 0 && (
      <span className="bg-primary-main text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full min-w-[1.25rem] text-center">
        {activeFiltersCount}
      </span>
    )}
  </button>
))

QuickFilterButton.displayName = 'QuickFilterButton'

// Sidebar filters now used instead of modal

// Loading component for Suspense fallback
const CyclesPageLoading = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <CyclesBanner />
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
      <div className="animate-pulse">
        <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            <div className="flex-1 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="flex gap-2 sm:gap-3">
              <div className="h-12 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="h-12 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

// Main Cycles Page Component - wrapped separately to use useSearchParams
function CyclesPageContent() {
  const {
    filteredCycles,
    pagination,
    appliedFilters,
    pendingFilters,
    updatePendingFilter,
    updatePendingFeatured,
    updateFeaturedDirect,
    updateGearTypeDirect,
    applyFilters,
    clearFilters,
    resetPendingFilters,
    removeFilter,
    hasPendingChanges,
    getFilterOptions,
    searchState,
    updateSearch,
    updateSort,
    updateSortOrder,
    isLoading,
    isLoadingMore,
    hasMorePages,
    loadMoreProducts,
    error
  } = useFilters()

  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false)
  const [showScrollUp, setShowScrollUp] = useState(false)

  // Load More button handler
  const handleLoadMore = () => {
    if (hasMorePages && !isLoadingMore && !isLoading) {
      loadMoreProducts()
    }
  }

  // Initialize cache monitoring in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const monitorInterval = monitorCachePerformance()
      return () => {
        if (monitorInterval) {
          clearInterval(monitorInterval)
        }
      }
    }
  }, [])

  // Handle scroll for showing scroll up button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollUp(window.pageYOffset > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0
    Object.entries(appliedFilters).forEach(([key, values]) => {
      if (key === 'featured' && values === true) {
        count += 1
      } else if (Array.isArray(values)) {
        count += values.length
      }
    })
    return count
  }, [appliedFilters])

  // Active filter pills
  const activeFilterPills = useMemo(() => {
    const pills: Array<{ key: string; label: string; value: string }> = []
    Object.entries(appliedFilters).forEach(([key, values]) => {
      const labels: Record<string, string> = {
        category: "Category",
        brand: "Brand",
        frameMaterial: "Frame Material",
        brakeType: "Brake Type",
        frameSize: "Frame Size",
        wheelSize: "Wheel Size",
        gearType: "Gear Type",
        featured: "Featured",
      }

      if (key === 'featured' && values === true) {
        // Do nothing - featured pill is excluded
      } else if (Array.isArray(values)) {
        values.forEach((value: string) => {
          pills.push({ key: `${key}-${value}`, label: labels[key] || key, value })
        })
      }
    })
    return pills
  }, [appliedFilters])

  // Handle loading state
  if (isLoading && (!filteredCycles || filteredCycles.length === 0)) {
    return <CyclesPageLoading />
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <CyclesBanner />
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Error Loading Products
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-main text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Banner Section */}
      <CyclesBanner />

      <div className="max-w-screen mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6">
        <div className="flex gap-6">
          {/* Filter Sidebar */}
          <FilterSidebar
            appliedFilters={appliedFilters}
            pendingFilters={pendingFilters}
            onFilterChange={updatePendingFilter}
            onUpdateFeatured={updatePendingFeatured}
            onApplyFilters={applyFilters}
            onClearFilters={clearFilters}
            onResetFilters={resetPendingFilters}
            hasPendingChanges={hasPendingChanges}
            isOpen={isFiltersOpen}
            onClose={() => setIsFiltersOpen(false)}
            isCollapsed={isFilterCollapsed}
            onToggleCollapse={() => setIsFilterCollapsed(!isFilterCollapsed)}
            filterOptions={getFilterOptions() || undefined}
            autoApplyFilters={true}
          />

          {/* Main Content */}
          <div className="flex-1 min-w-0">

            {/* Search and Controls */}
            <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
              <div className="flex gap-2 items-stretch max-w-4xl">
                <div className="flex-1">
                  <SearchBar
                    searchTerm={searchState.query}
                    onSearchChange={updateSearch}
                    onSearchSubmit={() => { }}
                  />
                </div>
                <div className="lg:hidden w-24 sm:w-32">
                  <MobileFilterToggle
                    onClick={() => setIsFiltersOpen(true)}
                    activeFiltersCount={activeFiltersCount}
                  />
                </div>
              </div>

              {/* Sort Pills */}
              <div className="max-w-4xl">
                <SortPills
                  sortBy={searchState.sortBy}
                  sortOrder={searchState.sortOrder}
                  onSortChange={updateSort}
                  onSortOrderChange={updateSortOrder}
                  appliedFilters={appliedFilters}
                  onUpdateFeatured={updateFeaturedDirect}
                  onGearTypeChange={updateGearTypeDirect}
                />
              </div>

              {/* Active Filter Pills */}
              {activeFilterPills.length > 0 && (
                <div className="flex flex-wrap gap-2 max-w-4xl">
                  <AnimatePresence>
                    {activeFilterPills.map(pill => (
                      <FilterPill
                        key={pill.key}
                        label={pill.label}
                        value={pill.value}
                        onRemove={() => {
                          const [filterKey] = pill.key.split('-')
                          if (filterKey === 'featured') {
                            clearFilters()
                          } else {
                            removeFilter(filterKey, pill.value)
                          }
                        }}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Results Summary */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 max-w-4xl">
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  Showing {filteredCycles.length} of {pagination?.totalProducts || 0} cycles
                  {hasMorePages && (
                    <span className="text-gray-500">
                      {' '}(More available)
                    </span>
                  )}
                </p>
                {isLoading && (
                  <p className="text-xs sm:text-sm text-gray-500">
                    Loading...
                  </p>
                )}
              </div>
            </div>

            {/* Product Grid */}
            <ProductGrid
              products={filteredCycles}
              onClearAll={() => {
                updateSearch("")
                clearFilters()
              }}
            />

            {/* Load More Button */}
            {hasMorePages && (
              <div className="mt-8 sm:mt-12 flex justify-center pb-4 sm:pb-6 lg:pb-8">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="bg-primary-main text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                >
                  {isLoadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Loading...
                    </>
                  ) : (
                    'Load More Cycles'
                  )}
                </button>
              </div>
            )}

            {/* End of Results Message */}
            {!hasMorePages && filteredCycles.length > 0 && (
              <div className="mt-8 sm:mt-12 flex justify-center pb-4 sm:pb-6 lg:pb-8">
                <p className="text-gray-500 dark:text-gray-400 text-center">
                   You've seen all {filteredCycles.length} cycles!
                  <br />
                  <span className="text-sm">Try adjusting your filters to see more products.</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Floating Buttons */}
      <FloatingScrollUpButton />
      <FloatingContactButton showScrollUp={showScrollUp} />
    </div>
  )
}

// Export the main component wrapped in Suspense
export default function CyclesPage() {
  return (
    <Suspense fallback={<CyclesPageLoading />}>
      <CyclesPageContent />
    </Suspense>
  )
}
