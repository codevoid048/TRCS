"use client"

export default function FooterSkeleton() {
  return (
    <footer className="bg-[#2D3436] dark:bg-gray-900 text-white py-16 transition-colors duration-300 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section Skeleton */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="h-12 w-12 rounded-full bg-gray-700 dark:bg-gray-800" />
              <div className="h-6 w-40 bg-gray-700 dark:bg-gray-800 rounded" />
            </div>
            <div className="h-4 w-72 bg-gray-700 dark:bg-gray-800 rounded mb-2" />
            <div className="h-4 w-64 bg-gray-700 dark:bg-gray-800 rounded mb-2" />
            <div className="h-4 w-56 bg-gray-700 dark:bg-gray-800 rounded mb-6" />
            <div className="flex space-x-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 w-10 bg-gray-700 dark:bg-gray-800 rounded-full" />
              ))}
            </div>
          </div>

          {/* Contact Info Skeleton */}
          <div>
            <div className="h-6 w-32 bg-gray-700 dark:bg-gray-800 rounded mb-6" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="h-5 w-5 bg-gray-700 dark:bg-gray-800 rounded" />
                  <div className="h-4 w-32 bg-gray-700 dark:bg-gray-800 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links Skeleton */}
          <div>
            <div className="h-6 w-32 bg-gray-700 dark:bg-gray-800 rounded mb-6" />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 w-28 bg-gray-700 dark:bg-gray-800 rounded" />
              ))}
            </div>
          </div>
        </div>
        {/* Bottom Bar Skeleton */}
        <div className="border-t border-gray-700 dark:border-gray-800 mt-12 pt-8 text-center transition-colors duration-300">
          <div className="h-4 w-80 bg-gray-700 dark:bg-gray-800 rounded mx-auto" />
        </div>
      </div>
    </footer>
  )
} 