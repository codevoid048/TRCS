/**
 * API Cache Manager for optimizing product data fetching
 * Implements in-memory caching with smart invalidation
 */

export interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresAt: number
}

export interface CacheConfig {
  defaultTTL: number // Time to live in milliseconds
  maxSize: number    // Maximum number of cache entries
}

export class APICache {
  private cache = new Map<string, CacheEntry<any>>()
  private config: CacheConfig
  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0
  }

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      defaultTTL: 5 * 60 * 1000, // 5 minutes
      maxSize: 50,
      ...config
    }
  }

  /**
   * Generate cache key from parameters
   */
  private generateKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        result[key] = params[key]
        return result
      }, {} as Record<string, any>)
    
    return `${prefix}:${JSON.stringify(sortedParams)}`
  }

  /**
   * Check if cache entry is valid
   */
  private isValid(entry: CacheEntry<any>): boolean {
    return Date.now() < entry.expiresAt
  }

  /**
   * Manage cache size by removing oldest entries
   */
  private evictOldest() {
    if (this.cache.size < this.config.maxSize) return

    let oldestKey = ''
    let oldestTime = Date.now()

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp
        oldestKey = key
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey)
      this.stats.evictions++
    }
  }

  /**
   * Get cached data
   */
  get<T>(prefix: string, params: Record<string, any>): T | null {
    const key = this.generateKey(prefix, params)
    const entry = this.cache.get(key)

    if (!entry || !this.isValid(entry)) {
      this.cache.delete(key)
      this.stats.misses++
      return null
    }

    this.stats.hits++
    return entry.data
  }

  /**
   * Set cached data
   */
  set<T>(prefix: string, params: Record<string, any>, data: T, customTTL?: number): void {
    this.evictOldest()
    
    const key = this.generateKey(prefix, params)
    const ttl = customTTL || this.config.defaultTTL
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl
    }

    this.cache.set(key, entry)
  }

  /**
   * Invalidate cache entries by prefix
   */
  invalidate(prefix: string): void {
    const keysToDelete: string[] = []
    
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        keysToDelete.push(key)
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key))
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const totalRequests = this.stats.hits + this.stats.misses
    const hitRate = totalRequests > 0 ? (this.stats.hits / totalRequests) * 100 : 0

    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      hits: this.stats.hits,
      misses: this.stats.misses,
      requests: totalRequests,
      hitRate: Number(hitRate.toFixed(1)),
      evictions: this.stats.evictions,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        isValid: this.isValid(entry),
        age: Date.now() - entry.timestamp
      }))
    }
  }
}

// Singleton instance
export const apiCache = new APICache({
  defaultTTL: 1 * 60 * 1000, // 1 minute
  maxSize: 50                 // 50 cache entries max
})

// Cache prefixes
export const CACHE_KEYS = {
  PRODUCTS_LIST: 'products_list',
  PRODUCT_DETAIL: 'product_detail',
  FILTER_OPTIONS: 'filter_options',
  RELATED_PRODUCTS: 'related_products',
  FEATURED_PRODUCTS: 'featured_products',
  REVIEWS: 'reviews'
} as const
