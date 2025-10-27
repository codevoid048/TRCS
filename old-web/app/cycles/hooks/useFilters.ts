"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { ProductsAPI } from "@/lib/api/products"
import { 
  Product, 
  FilterState, 
  SearchState, 
  ProductsAPIParams, 
  ProductsResponse,
  FilterOptions 
} from "@/types/product"

export function useFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false)

  // API response states
  const [allProducts, setAllProducts] = useState<Product[]>([]) // All loaded products
  const [productsData, setProductsData] = useState<ProductsResponse | null>(null)
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMorePages, setHasMorePages] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [error, setError] = useState<string | null>(null)

  // Applied filters (what's actually filtering the results)
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(() => {
    const initialFilters: FilterState = {
      category: searchParams?.getAll("category") || [],
      brand: searchParams?.getAll("brand") || [],
      gearType: searchParams?.getAll("gearType") || [],
      brakeType: searchParams?.getAll("brakeType") || [],
      frameSize: searchParams?.getAll("frameSize") || [],
      wheelSize: searchParams?.getAll("wheelSize") || [],
      frameMaterial: searchParams?.getAll("frameMaterial") || [],
      color: searchParams?.getAll("color") || [],
      featured: searchParams?.get("featured") === "true" ? true : undefined,
    }

    return initialFilters
  })

  // Pending filters (what user is currently selecting)
  const [pendingFilters, setPendingFilters] = useState<FilterState>(appliedFilters)

  // Search state
  const [searchState, setSearchState] = useState<SearchState>({
    query: searchParams?.get("q") || "",
    sortBy: (searchParams?.get("sort") as SearchState['sortBy']) || "createdAt",
    sortOrder: (searchParams?.get("order") as SearchState['sortOrder']) || "desc",
    page: 1, // Always start from page 1 for infinite scroll
    limit: 30 // Load 30 products at a time
  })

  // Check if there are pending changes
  const hasPendingChanges = useMemo(() => {
    return JSON.stringify(appliedFilters) !== JSON.stringify(pendingFilters)
  }, [appliedFilters, pendingFilters])

  // Update URL when filters or search changes
  useEffect(() => {
    const params = new URLSearchParams()

    // Add search query
    if (searchState.query) {
      params.set("q", searchState.query)
    }

    // Add sort
    if (searchState.sortBy !== "createdAt") {
      params.set("sort", searchState.sortBy)
    }

    // Add sort order
    if (searchState.sortOrder !== "desc") {
      params.set("sortOrder", searchState.sortOrder)
    }

    // Remove pagination params for infinite scroll
    // if (searchState.page > 1) {
    //   params.set("page", searchState.page.toString())
    // }

    if (searchState.limit !== 30) {
      params.set("limit", searchState.limit.toString())
    }

    // Add applied filters
    Object.entries(appliedFilters).forEach(([key, values]) => {
      if (key === 'featured' && values === true) {
        params.set('featured', 'true')
      } else if (Array.isArray(values)) {
        values.forEach((value: string) => {
          if (value) params.append(key, value)
        })
      }
    })

    const queryString = params.toString()
    const newUrl = queryString ? `${pathname || '/'}?${queryString}` : (pathname || '/')

    // Update URL without scrolling
    router.replace(newUrl, { scroll: false })
  }, [appliedFilters, searchState, pathname, router])

  // Fetch products from API
  const fetchProducts = useCallback(async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setIsLoadingMore(true)
      } else {
        setIsLoading(true)
        setAllProducts([]) // Clear products for new search/filter
        setCurrentPage(1)
      }
      setError(null)

      const pageToFetch = isLoadMore ? currentPage + 1 : 1

      const apiParams: ProductsAPIParams = {
        page: pageToFetch,
        limit: searchState.limit,
        search: searchState.query || undefined,
        // Only include sort parameters if they're not default values
        ...(searchState.sortBy !== 'createdAt' && { sortBy: searchState.sortBy }),
        ...(searchState.sortOrder !== 'desc' && { sortOrder: searchState.sortOrder }),
        ...appliedFilters,
      }

      const response = await ProductsAPI.getProducts(apiParams)
      
      if (isLoadMore) {
        // Append new products to existing ones
        setAllProducts(prev => [...prev, ...response.data.products])
        setCurrentPage(pageToFetch)
      } else {
        // Replace products for new search/filter
        setAllProducts(response.data.products)
        setCurrentPage(1)
      }
      
      setProductsData(response)
      setHasMorePages(response.data.pagination.hasNextPage)

      // Log cache stats in development
      // if (process.env.NODE_ENV === 'development') {
      //   const stats = ProductsAPI.getCacheStats()
      //   console.log('📊 Cache Stats:', stats)
      // }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products')
      console.error('Error fetching products:', err)
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }, [appliedFilters, searchState]) // Removed currentPage from dependencies

  // Separate function for loading more products to avoid dependency issues
  const loadMoreProducts = useCallback(async () => {
    if (isLoadingMore || !hasMorePages) return
    
    try {
      setIsLoadingMore(true)
      setError(null)

      const pageToFetch = currentPage + 1

      const apiParams: ProductsAPIParams = {
        page: pageToFetch,
        limit: searchState.limit,
        search: searchState.query || undefined,
        // Only include sort parameters if they're not default values
        ...(searchState.sortBy !== 'createdAt' && { sortBy: searchState.sortBy }),
        ...(searchState.sortOrder !== 'desc' && { sortOrder: searchState.sortOrder }),
        ...appliedFilters,
      }

      const response = await ProductsAPI.getProducts(apiParams)
      
      // Append new products to existing ones
      setAllProducts(prev => {
        const updated = [...prev, ...response.data.products]
        return updated
      })
      setCurrentPage(pageToFetch)
      setHasMorePages(response.data.pagination.hasNextPage)
      
      // Update productsData to maintain pagination info
      setProductsData(prevData => ({
        ...response,
        data: {
          ...response.data,
          products: prevData ? [...prevData.data.products, ...response.data.products] : response.data.products
        }
      }))

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more products')
      console.error('Error loading more products:', err)
    } finally {
      setIsLoadingMore(false)
    }
  }, [currentPage, searchState, appliedFilters, isLoadingMore, hasMorePages])

  // Fetch filter options
  const fetchFilterOptions = useCallback(async () => {
    try {
      const response = await ProductsAPI.getFilterOptions()
      setFilterOptions(response)
    } catch (err) {
      console.error('Error fetching filter options:', err)
    }
  }, [])

  // Initial data fetch
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Fetch filter options on mount
  useEffect(() => {
    fetchFilterOptions()
  }, [fetchFilterOptions])

  // Functions for managing filters
  const updatePendingFilter = useCallback((category: string, value: string) => {
    setPendingFilters((prev) => {
      const currentValues = prev[category as keyof FilterState] as string[] || []
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value]

      return {
        ...prev,
        [category]: newValues,
      }
    })
  }, [])

  const updatePendingFeatured = useCallback((value: boolean) => {
    setPendingFilters((prev) => ({
      ...prev,
      featured: value,
    }))
  }, [])

  // Direct featured update that bypasses pending filters and calls API immediately
  const updateFeaturedDirect = useCallback((value: boolean) => {
    const newAppliedFilters = {
      ...appliedFilters,
      featured: value || undefined, // Use undefined instead of false to remove from URL
    }
    
    // Update both applied and pending filters immediately
    setAppliedFilters(newAppliedFilters)
    setPendingFilters(newAppliedFilters)
    
    // Clear products and reset pagination for fresh results
    setAllProducts([])
    setCurrentPage(1)
    setSearchState(prev => ({ ...prev, page: 1 }))
  }, [appliedFilters])

  // Direct gear type update (single-select with toggle)
  const updateGearTypeDirect = useCallback((gearType: string) => {
    const currentGearTypes = appliedFilters.gearType || []
    const isAlreadySelected = currentGearTypes.includes(gearType)
    
    let newGearTypes: string[]
    if (isAlreadySelected) {
      // Deselect if already selected
      newGearTypes = []
    } else {
      // Select this gear type (replacing any other selection)
      newGearTypes = [gearType]
    }
    
    const newAppliedFilters = {
      ...appliedFilters,
      gearType: newGearTypes,
    }
    
    // Update both applied and pending filters immediately
    setAppliedFilters(newAppliedFilters)
    setPendingFilters(newAppliedFilters)
    
    // Clear products and reset pagination for fresh results
    setAllProducts([])
    setCurrentPage(1)
    setSearchState(prev => ({ ...prev, page: 1 }))
  }, [appliedFilters])

  const applyFilters = useCallback(() => {
    setAppliedFilters(pendingFilters)
    setAllProducts([]) // Clear accumulated products
    setCurrentPage(1) // Reset page counter
    setSearchState(prev => ({ ...prev, page: 1 })) // Reset to first page
  }, [pendingFilters])

  const clearFilters = useCallback(() => {
    const emptyFilters: FilterState = {
      category: [],
      brand: [],
      gearType: [],
      brakeType: [],
      frameSize: [],
      wheelSize: [],
      frameMaterial: [],
      color: [],
      featured: undefined,
    }
    setPendingFilters(emptyFilters)
    setAppliedFilters(emptyFilters)
    setAllProducts([]) // Clear accumulated products
    setCurrentPage(1) // Reset page counter
    setSearchState(prev => ({ ...prev, page: 1 }))
  }, [])

  const resetPendingFilters = useCallback(() => {
    setPendingFilters(appliedFilters)
  }, [appliedFilters])

  // Remove a specific filter value
  const removeFilter = useCallback((category: string, value: string) => {
    const newPendingFilters = {
      ...pendingFilters,
      [category]: (pendingFilters[category as keyof FilterState] as string[] || []).filter((v: string) => v !== value),
    }
    const newAppliedFilters = {
      ...appliedFilters,
      [category]: (appliedFilters[category as keyof FilterState] as string[] || []).filter((v: string) => v !== value),
    }
    
    setPendingFilters(newPendingFilters)
    setAppliedFilters(newAppliedFilters)
    setAllProducts([]) // Clear accumulated products
    setCurrentPage(1) // Reset page counter
    setSearchState(prev => ({ ...prev, page: 1 }))
  }, [pendingFilters, appliedFilters])

  // Search functions
  const updateSearch = useCallback((query: string) => {
    setAllProducts([]) // Clear accumulated products
    setCurrentPage(1) // Reset page counter
    setSearchState(prev => ({ ...prev, query, page: 1 }))
  }, [])

  const updateSort = useCallback((sortBy: SearchState['sortBy']) => {
    setAllProducts([]) // Clear accumulated products  
    setCurrentPage(1) // Reset page counter
    setSearchState(prev => ({ ...prev, sortBy, page: 1 }))
  }, [])

  const updateSortOrder = useCallback((sortOrder: SearchState['sortOrder']) => {
    setAllProducts([]) // Clear accumulated products
    setCurrentPage(1) // Reset page counter
    setSearchState(prev => ({ ...prev, sortOrder, page: 1 }))
  }, [])

  const updatePage = useCallback((page: number) => {
    setSearchState(prev => ({ ...prev, page }))
  }, [])

  // Toggle functions
  const toggleFilterPanel = useCallback((isOpen?: boolean) => {
    setIsFilterPanelOpen(isOpen ?? !isFilterPanelOpen)
  }, [isFilterPanelOpen])

  const toggleFilterCollapse = useCallback(() => {
    setIsFilterCollapsed(!isFilterCollapsed)
  }, [isFilterCollapsed])

  // Get filter options helper
  const getFilterOptions = useCallback(() => {
    if (!filterOptions) return null
    return filterOptions.config
  }, [filterOptions])

  return {
    // Data
    filteredCycles: allProducts, // Use accumulated products instead of just current page
    pagination: productsData?.data.pagination,
    appliedFilters,
    pendingFilters,
    searchState,
    hasPendingChanges,
    isLoading,
    isLoadingMore,
    hasMorePages,
    error,

    // Filter functions
    updatePendingFilter,
    updatePendingFeatured,
    updateFeaturedDirect,
    updateGearTypeDirect,
    applyFilters,
    clearFilters,
    resetPendingFilters,
    removeFilter,

    // Search functions
    updateSearch,
    updateSort,
    loadMoreProducts, // Use the dedicated function instead of fetchProducts(true)
    updateSortOrder,
    // updatePage, // Remove this since we're using infinite scroll

    // UI state
    isFilterPanelOpen,
    isFilterCollapsed,
    toggleFilterPanel,
    toggleFilterCollapse,

    // Utility functions
    getFilterOptions,
    fetchProducts,
  }
}
