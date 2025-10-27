"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import FeaturedCyclesSkeleton from "./skeletons/FeaturedCyclesSkeleton";
import { ProductsAPI } from "@/lib/api/products";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PLACEHOLDER = "/placeholder.jpg?height=300&width=400";

export default function FeaturedCycles() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;

    const fetchFeatured = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await ProductsAPI.getFeaturedProducts();
        const products = response?.data?.featuredProducts ?? [];
        if (mounted) setFeaturedProducts(products);
      } catch (err) {
        console.error("Error fetching featured products:", err);
        if (mounted) setError("Failed to load featured products");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchFeatured();
    return () => {
      mounted = false;
    };
  }, []);

  // Check scroll position and update arrow states
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' })
    }
  }

  // Update scroll state after products load
  useEffect(() => {
    if (featuredProducts.length > 0) {
      setTimeout(checkScrollPosition, 100)
    }
  }, [featuredProducts])

  // Loading skeleton
  if (isLoading) {
    return (
      <section className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FeaturedCyclesSkeleton />
        </div>
      </section>
    );
  }

  if (featuredProducts.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-hero text-[#2D3436] dark:text-white mb-4 transition-colors duration-300">
            Featured Cycles
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
            Discover our handpicked selection of premium cycles
          </p>
        </motion.div>



        {/* Premium Horizontal Carousel */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            className={`hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:bg-white dark:hover:bg-gray-800 hover:scale-110 items-center justify-center ${
              !canScrollLeft ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer'
            }`}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            className={`hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:bg-white dark:hover:bg-gray-800 hover:scale-110 items-center justify-center ${
              !canScrollRight ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer'
            }`}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollPosition}
            className="flex gap-6 overflow-x-auto scrollbar-hide px-4 pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {featuredProducts.slice(0, 8).map((cycle, index) => (
              <motion.div
                key={cycle._id ?? index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.06 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="flex-shrink-0 w-[400px] md:w-[400px] sm:w-[320px] w-[280px]"
                role="listitem"
              >
                <Link href={`/cycles/${cycle.slug}`} className="block group cursor-pointer">
                  <div className="bg-gradient-to-br from-white to-amber-50/30 dark:from-gray-800 dark:to-amber-900/10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-amber-200/50 dark:border-amber-700/30 hover:border-amber-300 dark:hover:border-amber-600">
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <img
                        src={(cycle.images && cycle.images[0]) || PLACEHOLDER}
                        alt={cycle.name || "Featured cycle"}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 bg-gray-50 dark:bg-gray-700"
                      />
                      
                      {/* Overlay Text at Bottom Left */}
                      <div className="absolute bottom-0 left-0">
                        <div className="bg-gradient-to-t from-black/80 via-black/60 to-transparent backdrop-blur-sm px-4 py-3 text-white">
                          <h3 className="text-base font-bold mb-0.5 leading-tight">
                            {cycle.name}
                          </h3>
                          <p className="text-amber-200 text-sm font-medium">
                            {cycle.brand}
                          </p>
                        </div>
                      </div>

                      {/* Golden Accent Line */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600"></div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Custom Scrollbar Styles */}
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
            scroll-behavior: smooth;
          }
        `}</style>
      </div>
    </section>
  );
}
