"use client"

import { motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import CategoriesSkeleton from "./skeletons/CategoriesSkeleton"
import Image from "next/image"
import axios from "axios"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Category {
  title: string
  description: string
  image: string
  slug: string
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/public/categories`, {
          headers: { 'Content-Type': 'application/json' }
        })

        if (res.data.success) {
          const mappedCategories = res.data.data.map((cat: any) => ({
            title: cat.name,
            description: cat.description,
            image: cat.image,
            slug: cat.slug
          }))
          setCategories(mappedCategories)
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

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

  // Update scroll state after categories load
  useEffect(() => {
    if (categories.length > 0) {
      setTimeout(checkScrollPosition, 100)
    }
  }, [categories])

  if (loading) {
    return <CategoriesSkeleton />
  }

  if (categories.length === 0) {
    return null
  }

  return (
    <section id="categories" className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-hero text-[#2D3436] dark:text-white mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find the perfect cycle tailored to your needs and lifestyle
          </p>
        </div>

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
            <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300 mx-auto" />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollPosition}
            className="flex gap-6 overflow-x-auto scrollbar-hide px-4 pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category, index) => {
              const capitalizedSlug = category.slug.charAt(0).toUpperCase() + category.slug.slice(1)
              return (
                <motion.div
                  key={category.slug}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.06 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="flex-shrink-0 w-[400px] md:w-[400px] sm:w-[320px] w-[280px]"
                  role="listitem"
                >
                  <Link href={`/cycles?category=${capitalizedSlug}`} className="block group cursor-pointer">
                    <div className="bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-800 dark:to-gray-700/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden">
                      <div className="relative overflow-hidden aspect-[4/3]">
                        <Image
                          src={category.image}
                          alt={category.title}
                          fill
                          className="object-contain group-hover:scale-105 transition-transform duration-700 bg-gray-50 dark:bg-gray-700"
                        />
                        
                        {/* Overlay Text at Bottom Left */}
                        <div className="absolute bottom-0 left-0">
                          <div className="bg-gradient-to-t from-black/80 via-black/60 to-transparent backdrop-blur-sm px-4 py-3 text-white">
                            <h3 className="text-base font-bold mb-0.5 leading-tight">
                              {category.title}
                            </h3>
                            {category.description && (
                              <p className="text-amber-200 text-sm font-medium">
                                {category.description}
                              </p>
                            )}
                          </div>
                        </div>

                        </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
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
          
          /* Hide arrows on mobile */}
          @media (max-width: 768px) {
            .desktop-arrow {
              display: none;
            }
          }
        `}</style>
      </div>
    </section>
  )
}