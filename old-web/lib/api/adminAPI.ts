import axios, { AxiosResponse } from 'axios'
import { adminApiCache, ADMIN_CACHE_TTL } from '../cache/adminApiCache'

interface ApiResponse<T> {
  message: string
  data: T
}

interface DashboardStats {
  totalProducts: number
  totalRequests: number
  ongoingRequests: number
  completedRequests: number
  totalReviews: number
}

interface RecentActivity {
  id: string
  type: "request" | "review" | "product"
  message: string
  productName: string
  time: string
}

interface DashboardData {
  stats: DashboardStats
  recentActivities: RecentActivity[]
}

interface PurchaseRequest {
  _id: string
  name: string
  email: string
  mobileNumber: string
  description?: string
  cycle: {
    _id: string
    name: string
    brand: string
    price: number
    image: string
  }
  status: "ongoing" | "user bought" | "not bought"
  createdAt: string
  updatedAt: string
}

interface Category {
  _id: string
  name: string
  description: string
  image: string
  createdAt: string
  updatedAt: string
}

interface PaginationData {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

interface StatusCounts {
  ongoing: number
  "user bought": number
  "not bought": number
}

class AdminAPI {
  private baseURL: string
  private defaultTimeout: number

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
    this.defaultTimeout = 10000
  }

  private getAuthHeaders(isFormData: boolean = false) {
    const token = localStorage.getItem('token')
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${token}`
    }
    
    if (!isFormData) {
      headers['Content-Type'] = 'application/json'
    }
    
    return headers
  }

  private async makeRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any,
    cacheKey?: string,
    cacheTTL?: number
  ): Promise<T> {
    // Check cache for GET requests
    if (method === 'GET' && cacheKey) {
      const cached = adminApiCache.get<T>(cacheKey)
      // if (cached) {
      //   // console.log(`[AdminAPI] Cache hit: ${cacheKey}`)
      //   return cached
      // }
      // // console.log(`[AdminAPI] Cache miss: ${cacheKey}`)
    }

    try {
      const isFormData = data instanceof FormData
      const config = {
        method,
        url: `${this.baseURL}${endpoint}`,
        headers: this.getAuthHeaders(isFormData),
        timeout: this.defaultTimeout,
        withCredentials: true,
        ...(data && { data })
      }

      const response: AxiosResponse<ApiResponse<T>> = await axios(config)
      const result = response.data.data

      // Cache successful GET responses
      // if (method === 'GET' && cacheKey && result) {
      //   adminApiCache.set(cacheKey, result, cacheTTL)
      //   console.log(`[AdminAPI] Cached: ${cacheKey}`)
      // }

      return result
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Token expired, clear all admin cache and redirect
        adminApiCache.clear()
        localStorage.removeItem('token')
        window.location.href = '/admin/login'
      }
      throw error
    }
  }

  // Dashboard API
  async getDashboardData(): Promise<DashboardData> {
    return this.makeRequest<DashboardData>(
      'GET',
      '/admin/dashboard',
      undefined,
      'dashboard:main',
      ADMIN_CACHE_TTL.DASHBOARD
    )
  }

  // Purchase Requests API
  async getRequests(status?: string, page: number = 1, limit: number = 20): Promise<{
    requests: PurchaseRequest[]
    pagination: PaginationData
    statusCounts: StatusCounts
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy: 'createdAt',
      sortOrder: 'desc'
    })
    
    if (status && status !== 'all') {
      params.set('status', status)
    }

    const cacheKey = `requests:${status || 'all'}:${page}:${limit}`
    
    return this.makeRequest(
      'GET',
      `/admin/purchase-requests?${params}`,
      undefined,
      cacheKey,
      ADMIN_CACHE_TTL.REQUESTS
    )
  }

  async updateRequestStatus(requestId: string, status: "user bought" | "not bought"): Promise<PurchaseRequest> {
    const result = await this.makeRequest<PurchaseRequest>(
      'PUT',
      `/admin/purchase-requests/${requestId}`,
      { status }
    )
    
    // Invalidate related caches
    adminApiCache.invalidateRequests()
    
    return result
  }

  async deleteRequest(requestId: string): Promise<void> {
    await this.makeRequest<void>(
      'DELETE',
      `/admin/purchase-requests/${requestId}`
    )
    
    // Invalidate related caches
    adminApiCache.invalidateRequests()
  }

  async getCategories(): Promise<Category[]> {
    return this.makeRequest<Category[]>(
      'GET',
      '/admin/categories',
      undefined,
      'categories:all',
      ADMIN_CACHE_TTL.CATEGORIES
    )
  }

  async getCategoryById(categoryId: string): Promise<Category> {
    const cacheKey = `category:${categoryId}`
    
    return this.makeRequest<Category>(
      'GET',
      `/admin/categories/${categoryId}`,
      undefined,
      cacheKey,
      ADMIN_CACHE_TTL.CATEGORIES
    )
  }
  
  async createCategory(categoryData: FormData): Promise<Category> {
    const result = await this.makeRequest<Category>(
      'POST',
      '/admin/categories',
      categoryData,
      undefined,
      undefined
   )
    
    // Invalidate categories cache
    adminApiCache.invalidatePattern('^categories')
    return result
  }

  async updateCategory(categoryId: string, categoryData: FormData): Promise<Category> {
    const result = await this.makeRequest<Category>(
      'PUT',
      `/admin/categories/${categoryId}`,
      categoryData,
      undefined,
      undefined
    )
    
    // Invalidate specific category cache and categories list cache
    adminApiCache.invalidatePattern('^categories')
    adminApiCache.delete(`category:${categoryId}`)
    return result
  }

  async deleteCategory(categoryId: string): Promise<void> {
    await this.makeRequest<void>(
      'DELETE',
      `/admin/categories/${categoryId}`
    )
    
    // Invalidate categories cache
    adminApiCache.invalidatePattern('^categories')
  }
  
  // Products API (placeholder for future implementation)
  async getProducts(page: number = 1, limit: number = 20): Promise<any> {
    const cacheKey = `products:${page}:${limit}`
    
    return this.makeRequest(
      'GET',
      `/admin/products?page=${page}&limit=${limit}`,
      undefined,
      cacheKey,
      ADMIN_CACHE_TTL.PRODUCTS
    )
  }

  async createProduct(productData: any): Promise<any> {
    const result = await this.makeRequest(
      'POST',
      '/admin/products',
      productData
    )
    
    // Invalidate related caches
    adminApiCache.invalidateProducts()
    
    return result
  }

  async updateProduct(productId: string, productData: any): Promise<any> {
    const result = await this.makeRequest(
      'PUT',
      `/admin/products/${productId}`,
      productData
    )
    
    // Invalidate related caches
    adminApiCache.invalidateProducts()
    
    return result
  }

  async deleteProduct(productId: string): Promise<void> {
    await this.makeRequest(
      'DELETE',
      `/admin/products/${productId}`
    )
    
    // Invalidate related caches
    adminApiCache.invalidateProducts()
  }

  // Reviews API
  async getReviews(
    page: number = 1, 
    limit: number = 10, 
    rating?: number, 
    sortBy: string = 'createdAt', 
    sortOrder: string = 'desc'
  ): Promise<{
    reviews: any[]
    pagination: PaginationData
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder
    })
    
    if (rating !== undefined) {
      params.set('rating', rating.toString())
    }

    const cacheKey = `reviews:${page}:${limit}:${rating || 'all'}:${sortBy}:${sortOrder}`
    
    return this.makeRequest(
      'GET',
      `/admin/reviews?${params}`,
      undefined,
      cacheKey,
      ADMIN_CACHE_TTL.REVIEWS
    )
  }

  async getReview(reviewId: string): Promise<any> {
    const cacheKey = `review:${reviewId}`
    
    return this.makeRequest(
      'GET',
      `/admin/reviews/${reviewId}`,
      undefined,
      cacheKey,
      ADMIN_CACHE_TTL.REVIEWS
    )
  }

  async updateReviewStatus(reviewId: string, isActive: boolean): Promise<any> {
    const result = await this.makeRequest<any>(
      'PUT',
      `/admin/reviews/${reviewId}`,
      { isActive }
    )
    
    // Invalidate related caches
    adminApiCache.invalidateReviews()
    
    return result
  }

  async deleteReview(reviewId: string): Promise<void> {
    await this.makeRequest<void>(
      'DELETE',
      `/admin/reviews/${reviewId}`
    )
    
    // Invalidate related caches
    adminApiCache.invalidateReviews()
  }

  // Featured Products API
  async getFeaturedProducts(): Promise<any> {
    return this.makeRequest(
      'GET',
      '/admin/featured',
      undefined,
      'featured:all',
      ADMIN_CACHE_TTL.FEATURED
    )
  }

  async updateFeaturedProducts(productIds: string[]): Promise<any> {
    const result = await this.makeRequest(
      'PUT',
      '/admin/featured',
      { productIds }
    )
    
    // Invalidate related caches
    adminApiCache.invalidatePattern('^featured')
    adminApiCache.invalidateProducts()
    
    return result
  }

  // Cache management methods
  getCacheStats() {
    return adminApiCache.getStats()
  }

  getCacheHitRatio() {
    return adminApiCache.getHitRatio()
  }

  clearCache() {
    adminApiCache.clear()
  }

  invalidateCache(pattern: string) {
    return adminApiCache.invalidatePattern(pattern)
  }

  // Manual cache refresh for specific data
  async refreshDashboard() {
    adminApiCache.invalidateDashboard()
    return this.getDashboardData()
  }

  async refreshRequests() {
    adminApiCache.invalidateRequests()
    return this.getRequests()
  }

  // Example method to demonstrate how to use the updated category API
  async updateCategoryExample(categoryId: string, name: string, description: string, imageFile?: File): Promise<Category> {
    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    
    if (imageFile) {
      formData.append('image', imageFile)
    }

    return this.updateCategory(categoryId, formData)
  }
}

// Create singleton instance
export const adminAPI = new AdminAPI()

export default AdminAPI
