import { ProductsResponse, FilterOptions, ProductsAPIParams, Product, ProductBySlugResponse, RelatedProductsResponse, FeaturedProductsResponse, ReviewsResponse } from '@/types/product'
import { apiCache, CACHE_KEYS } from '@/lib/cache/apiCache'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export class ProductsAPI {
  static async getProducts(params: ProductsAPIParams = {}): Promise<ProductsResponse> {
    try {
      // Generate normalized parameters for consistent caching
      const normalizedParams = this.generateCacheParams(params)
      
      // Check cache first
      const cachedData = apiCache.get<ProductsResponse>(CACHE_KEYS.PRODUCTS_LIST, normalizedParams)
      
      if (cachedData) {
        // console.log('🎯 Cache hit for products list')
        return cachedData
      }

      // console.log('🌐 API call for products list')
      const queryParams = new URLSearchParams()

      // Add pagination
      if (params.page) queryParams.set('page', params.page.toString())
      if (params.limit) queryParams.set('limit', params.limit.toString())

      // Add search
      if (params.search?.trim()) queryParams.set('search', params.search.trim())

      // Add filters (multiple parameter approach)
      if (params.brand?.length) {
        params.brand.forEach(brand => queryParams.append('brand', brand))
      }
      if (params.category?.length) {
        params.category.forEach(category => queryParams.append('category', category))
      }
      if (params.frameMaterial?.length) {
        params.frameMaterial.forEach(material => queryParams.append('frameMaterial', material))
      }
      if (params.brakeType?.length) {
        params.brakeType.forEach(brake => queryParams.append('brakeType', brake))
      }
      if (params.frameSize?.length) {
        params.frameSize.forEach(size => queryParams.append('frameSize', size))
      }
      if (params.wheelSize?.length) {
        params.wheelSize.forEach(wheel => queryParams.append('wheelSize', wheel))
      }
      if (params.gearType?.length) {
        params.gearType.forEach(gear => queryParams.append('gearType', gear))
      }
      if (params.color?.length) {
        params.color.forEach(color => queryParams.append('color', color))
      }

      // Add sorting
      if (params.sortBy) queryParams.set('sortBy', params.sortBy)
      if (params.sortOrder) queryParams.set('sortOrder', params.sortOrder)

      // Add featured filter
      if (params.featured !== undefined) queryParams.set('featured', params.featured.toString())

      const url = `${API_BASE_URL}/public/products?${queryParams.toString()}`
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })

      if (response.status < 200 || response.status >= 300) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = response.data
      
      // Cache products for 5 minutes
      apiCache.set(CACHE_KEYS.PRODUCTS_LIST, normalizedParams, data)
      
      return data
    } catch (error) {
      // console.error('Error fetching products:', error)
      throw new Error('Failed to fetch products')
    }
  }

  static async getProductBySlug(slug: string): Promise<ProductBySlugResponse> {
    try {
      // Skip cache for product details - using ISR revalidation instead
      const url = `${API_BASE_URL}/public/products/slug/${slug}`
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })

      if (response.status < 200 || response.status >= 300) {
        if (response.status === 404) {
          throw new Error('Product not found')
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = response.data

      // No caching - ISR handles revalidation at page level
      return data
    } catch (error) {
      console.error('Error fetching product by slug:', error)
      throw error
    }
  }

  static async getRelatedProducts(brand: string, category: string): Promise<RelatedProductsResponse> {
    try {

      if (!brand) {
        throw new Error('Brand is required')
      }

      const cachedResult = apiCache.get<RelatedProductsResponse>(CACHE_KEYS.RELATED_PRODUCTS, { brand, category })
      if (cachedResult) {
        return cachedResult
      }

      const url = `${API_BASE_URL}/public/related-products?brand=${brand}&category=${category}`
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })

      if (response.status < 200 || response.status >= 300) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = response.data

      // Cache related products for 10 minutes
      apiCache.set(CACHE_KEYS.RELATED_PRODUCTS, { brand }, data)

      return data
    } catch (error) {
      console.error('Error fetching related products:', error)
      throw new Error('Failed to fetch related products')
    }
  }

  static async getFilterOptions(): Promise<FilterOptions> {
    try {
      // Check cache first
      const cachedResult = apiCache.get<FilterOptions>(CACHE_KEYS.FILTER_OPTIONS, {})
      if (cachedResult) {
        return cachedResult
      }

      const url = `${API_BASE_URL}/public/filters`
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })

      if (response.status < 200 || response.status >= 300) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = response.data

      // Cache filter options for 1 minute (they change less frequently)
      apiCache.set(CACHE_KEYS.FILTER_OPTIONS, {}, data, 1 * 60 * 1000)
      
      return data
    } catch (error) {
      console.error('Error fetching filter options:', error)
      throw new Error('Failed to fetch filter options')
    }
  }

  static async getFeaturedProducts(): Promise<FeaturedProductsResponse> {
    try {
      const cachedResult = apiCache.get<FeaturedProductsResponse>(CACHE_KEYS.FEATURED_PRODUCTS, {})
      if (cachedResult) {
        return cachedResult
      }

      const url = `${API_BASE_URL}/public/featured-products`
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })

      if (response.status < 200 || response.status >= 300) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = response.data

      // Cache featured products for 1 minute
      apiCache.set(CACHE_KEYS.FEATURED_PRODUCTS, {}, data, 1 * 60 * 1000)

      return data
    } catch (error) {
      console.error('Error fetching featured products:', error)
      throw new Error('Failed to fetch featured products')
    }
  }

  static async getReviews(): Promise<ReviewsResponse> {
    try {
      const cachedResult = apiCache.get<ReviewsResponse>(CACHE_KEYS.REVIEWS, {})
      if (cachedResult) {
        return cachedResult
      }

      const url = `${API_BASE_URL}/public/reviews`
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })

      if (response.status < 200 || response.status >= 300) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = response.data

      // Cache reviews for 1 minute
      apiCache.set(CACHE_KEYS.REVIEWS, {}, data, 1 * 60 * 1000)

      return data
    } catch (error) {
      console.error('Error fetching reviews:', error)
      throw new Error('Failed to fetch reviews')
    }
  }

  /**
   * Generate normalized cache parameters for consistent caching
   */
  private static generateCacheParams(params: ProductsAPIParams): Record<string, any> {
    return {
      page: params.page || 1,
      limit: params.limit || 30,
      search: params.search?.trim() || '',
      sortBy: params.sortBy || 'createdAt',
      sortOrder: params.sortOrder || 'desc',
      brand: params.brand?.slice().sort() || [],
      category: params.category?.slice().sort() || [],
      frameMaterial: params.frameMaterial?.slice().sort() || [],
      brakeType: params.brakeType?.slice().sort() || [],
      frameSize: params.frameSize?.slice().sort() || [],
      wheelSize: params.wheelSize?.slice().sort() || [],
      gearType: params.gearType?.slice().sort() || [],
      featured: params.featured || false
    }
  }

  /**
   * Cache management utilities
   */
  static clearCache() {
    apiCache.clear()
  }

  static invalidateProductsCache() {
    apiCache.invalidate(CACHE_KEYS.PRODUCTS_LIST)
  }

  static invalidateProductCache(slug: string) {
    apiCache.invalidate(CACHE_KEYS.PRODUCT_DETAIL)
  }

  static getCacheStats() {
    return apiCache.getStats()
  }
}
