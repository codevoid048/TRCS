/**
 * Cache utilities for debugging and monitoring
 */

import { ProductsAPI } from '@/lib/api/products'

/**
 * Log cache statistics in a formatted way
 */
export function logCacheStats() {
  if (process.env.NODE_ENV !== 'development') return

  const stats = ProductsAPI.getCacheStats()
  
  // console.group('📊 API Cache Statistics')
  // console.log(`🎯 Hit Rate: ${stats.hitRate}% (${stats.hits}/${stats.requests})`)
  // console.log(`💾 Cache Size: ${stats.size}/${stats.maxSize} entries`)
  // console.log(`🧹 Evictions: ${stats.evictions}`)
  // console.log(`📈 Cache Effectiveness: ${stats.hitRate > 30 ? 'Good' : 'Poor'}`)
  
  // if (stats.entries.length > 0) {
  //   console.log('📋 Cache Entries:')
  //   stats.entries.forEach(entry => {
  //     const ageSeconds = Math.round(entry.age / 1000)
  //     const status = entry.isValid ? '✅' : '❌'
  //     console.log(`  ${status} ${entry.key} (${ageSeconds}s old)`)
  //   })
  // }
  
  console.groupEnd()
}

/**
 * Clear all caches (useful for debugging)
 */
export function clearAllCaches() {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('Cache clearing is only available in development')
    return
  }

  ProductsAPI.clearCache()
  // console.log('🧹 All caches cleared')
}

/**
 * Monitor cache performance over time
 */
export function monitorCachePerformance() {
  if (process.env.NODE_ENV !== 'development') return

  // console.log('📊 Starting cache performance monitoring...')
  
  // Log cache stats every 30 seconds
  const interval = setInterval(() => {
    const stats = ProductsAPI.getCacheStats()
    if (stats.requests > 0) {
      logCacheStats()
    }
  }, 30000)

  // Clear interval after 10 minutes
  setTimeout(() => {
    clearInterval(interval)
    // console.log('📊 Cache monitoring stopped')
  }, 10 * 60 * 1000)

  return interval
}

// Expose cache utilities to window for debugging
declare global {
  interface Window {
    cacheUtils: {
      stats: () => void
      clear: () => void
      monitor: () => void
    }
  }
}

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.cacheUtils = {
    stats: logCacheStats,
    clear: clearAllCaches,
    monitor: monitorCachePerformance
  }
}
