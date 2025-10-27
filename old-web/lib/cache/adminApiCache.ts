interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

interface CacheStats {
  hits: number
  misses: number
  sets: number
  deletes: number
  totalSize: number
}

class AdminAPICache {
  private cache: Map<string, CacheEntry<any>>
  private stats: CacheStats
  private maxSize: number
  private defaultTTL: number

  constructor(maxSize: number = 100, defaultTTL: number = 5 * 60 * 1000) { // 5 minutes default
    this.cache = new Map()
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      totalSize: 0
    }
    this.maxSize = maxSize
    this.defaultTTL = defaultTTL
  }

  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.ttl
  }

  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        this.cache.delete(key)
        this.stats.deletes++
      }
    }
  }

  private evictLRU(): void {
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entry (first in Map)
      const firstKey = this.cache.keys().next().value
      if (firstKey) {
        this.cache.delete(firstKey)
        this.stats.deletes++
      }
    }
  }

  get<T>(key: string): T | null {
    this.cleanup()
    
    const entry = this.cache.get(key)
    if (!entry) {
      this.stats.misses++
      return null
    }

    if (this.isExpired(entry)) {
      this.cache.delete(key)
      this.stats.misses++
      this.stats.deletes++
      return null
    }

    // Move to end (LRU update)
    this.cache.delete(key)
    this.cache.set(key, entry)
    
    this.stats.hits++
    return entry.data
  }

  set<T>(key: string, data: T, ttl?: number): void {
    this.cleanup()
    this.evictLRU()

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    }

    this.cache.set(key, entry)
    this.stats.sets++
    this.stats.totalSize = this.cache.size
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key)
    if (deleted) {
      this.stats.deletes++
      this.stats.totalSize = this.cache.size
    }
    return deleted
  }

  // Admin-specific cache invalidation patterns
  invalidatePattern(pattern: string): number {
    let deleted = 0
    const regex = new RegExp(pattern)
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key)
        deleted++
        this.stats.deletes++
      }
    }
    
    this.stats.totalSize = this.cache.size
    return deleted
  }

  // Invalidate all dashboard-related data
  invalidateDashboard(): void {
    this.invalidatePattern('^dashboard')
    this.invalidatePattern('^stats')
    this.invalidatePattern('^recent-activities')
  }

  // Invalidate all request-related data
  invalidateRequests(): void {
    this.invalidatePattern('^requests')
    this.invalidatePattern('^purchase-requests')
    this.invalidateDashboard() // Dashboard shows request stats
  }

  // Invalidate all product-related data
  invalidateProducts(): void {
    this.invalidatePattern('^products')
    this.invalidatePattern('^featured')
    this.invalidateDashboard() // Dashboard shows product stats
  }

  // Invalidate all review-related data
  invalidateReviews(): void {
    this.invalidatePattern('^reviews')
    this.invalidateDashboard() // Dashboard shows review stats
  }

  // Invalidate all category-related data
  invalidateCategories(): void {
    this.invalidatePattern('^categories')
    this.invalidatePattern('^category')
    this.invalidateDashboard() // Dashboard might show category stats
  }

  clear(): void {
    const size = this.cache.size
    this.cache.clear()
    this.stats.deletes += size
    this.stats.totalSize = 0
  }

  getStats(): CacheStats {
    this.cleanup()
    return {
      ...this.stats,
      totalSize: this.cache.size
    }
  }

  // Get cache hit ratio as percentage
  getHitRatio(): number {
    const total = this.stats.hits + this.stats.misses
    return total > 0 ? (this.stats.hits / total) * 100 : 0
  }

  // Get all cache keys (for debugging)
  getKeys(): string[] {
    this.cleanup()
    return Array.from(this.cache.keys())
  }

  // Export cache state for analysis
  export(): { key: string; data: any; age: number; ttl: number }[] {
    this.cleanup()
    const now = Date.now()
    return Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      data: entry.data,
      age: now - entry.timestamp,
      ttl: entry.ttl
    }))
  }
}

// Create singleton instance for admin cache
export const adminApiCache = new AdminAPICache(150, 5 * 60 * 1000) // 150 entries, 5 min TTL

// Admin-specific TTL constants
export const ADMIN_CACHE_TTL = {
  DASHBOARD: 2 * 60 * 1000,      // 2 minutes - frequently changing data
  REQUESTS: 3 * 60 * 1000,       // 3 minutes - moderately changing
  PRODUCTS: 10 * 60 * 1000,      // 10 minutes - less frequently changing
  REVIEWS: 5 * 60 * 1000,        // 5 minutes - moderate frequency
  STATS: 1 * 60 * 1000,          // 1 minute - high frequency stats
  FEATURED: 15 * 60 * 1000,      // 15 minutes - rarely changing
  CATEGORIES: 10 * 60 * 1000,    // 10 minutes - less frequently changing
} as const

export default AdminAPICache